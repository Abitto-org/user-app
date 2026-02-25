import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGetMeters } from '@/services/meters';
import { useInitializeGasPurchase } from '@/services/gas-purchase';
import upIcon from '@/assets/icons/up-icon.svg';
import { CircularProgress } from '@mui/material';

import globeIcon from '@/assets/globe.svg'
import walletIcon from '@/assets/wallet.svg'
import { useGetPricePerKg } from '@/services/settings';

const buyGasSchema = z.object({
  meter: z.string().min(1, 'Please select a meter'),
  amount: z.coerce
    .number({ error: 'Amount must be a number' })
    .min(1, 'Amount is required')
    .refine((val) => val >= 1000, { message: 'Minimum amount is ₦1,000' }),
  paymentMethod: z.enum(['wallet', 'online']),
});

type BuyGasFormData = z.infer<typeof buyGasSchema>;

interface BuyGasDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const BuyGasDrawer = ({ open, onClose }: BuyGasDrawerProps) => {
  const [amountInput, setAmountInput] = useState('');
  const { data: meters = [], isLoading: metersLoading } = useGetMeters();
  const { mutate: initializePurchase, isPending } = useInitializeGasPurchase();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buyGasSchema),
    defaultValues: {
      meter: '',
      amount: '' as unknown as number,
      paymentMethod: '' as unknown as 'wallet' | 'online',
    },
  });

  const { data: priceData } = useGetPricePerKg();
  const pricePerKg = Number(priceData?.gasPricePerKg ?? 0);
  const kgEstimate = (() => {
    const amount = Number(amountInput);
    if (!amount || amount <= 0 || !pricePerKg || pricePerKg <= 0) return '0';
    return (amount / pricePerKg).toFixed(0);
  })();

  const onSubmit = (data: BuyGasFormData) => {
    initializePurchase(
      { amount: +data.amount, meterId: data.meter },
      {
        onSuccess: (response) => {
          reset();
          onClose();
          // Open Paystack checkout in a new tab
          window.open(response.data.authorizationUrl, '_blank');
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },

        },
      }}
    >
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        p={3}
      >
        {/* Header */}
        <Box display='flex' justifyContent='flex-end' mb={2}>
          <IconButton onClick={handleClose} size='small'>
            <Close />
          </IconButton>
        </Box>

        <Typography variant='h5' fontWeight='bold'>
          Buy Gas
        </Typography>
        <Typography variant='body2' color='text.secondary' mb={3}>
          Start your gas top up
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          display='flex'
          flexDirection='column'
          flex={1}
        >
          {/* Meter */}
          <Typography variant='body1' fontWeight='semibold' mb={1}>
            Meter
          </Typography>
          <Controller
            name='meter'
            control={control}
            render={({ field }) => (
              <Select
                fullWidth
                {...field}
                displayEmpty
                error={!!errors.meter}
                sx={{ borderRadius: '12px', mb: 0.5 }}
                renderValue={(value) => {
                  if (!value) {
                    return <span style={{ color: '#aaa' }}>Select Meter</span>;
                  }
                  const meter = meters.find((m) => m.id === value);
                  return meter?.meterNumber ?? value;
                }}
              >
                {metersLoading && (
                  <MenuItem disabled>Loading meters...</MenuItem>
                )}
                {!metersLoading && meters.length === 0 && (
                  <MenuItem disabled>No meters found</MenuItem>
                )}
                {meters.map((meter) => (
                  <MenuItem key={meter.id} value={meter.id}>
                    {meter.meterNumber}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.meter && (
            <FormHelperText error sx={{ mb: 1 }}>
              {errors.meter.message}
            </FormHelperText>
          )}

          {/* Amount */}
          <Typography variant='body1' fontWeight='semibold' mt={2} mb={1}>
            Amount
          </Typography>
          <Box
            border='1px solid'
            borderColor={errors.amount ? 'error.main' : '#F5F5F5'}
            borderRadius='12px'
            p={2}
            mb={0.5}
          >
            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <TextField
                placeholder='Amount'
                variant='standard'
                type='number'
                {...register('amount', {
                  onChange: (e) => setAmountInput(e.target.value),
                })}
                slotProps={{
                  input: { disableUnderline: true },
                  htmlInput: { style: { fontSize: '1rem' } },
                }}
                sx={{ flex: 1 }}
              />
              <Typography variant='body2' color='text.secondary' fontWeight={600}>
                Min ₦1,000
              </Typography>
            </Box>
            <Box display='flex' borderTop='1px solid #F5F5F5' pt={2} alignItems='center' gap={0.5} mt={1.5}>
              <Box
                bgcolor='#6699001A'
                borderRadius='50%'
                width='fit-content'
                p={1}
                height={28}
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Typography fontSize={12} fontWeight='bold' color='#669900'>
                  {kgEstimate}
                </Typography>
              </Box>
              <Typography variant='caption' color='text.secondary'>
                KG
              </Typography>
            </Box>
          </Box>
          {errors.amount && (
            <FormHelperText error sx={{ mb: 1 }}>
              {errors.amount.message}
            </FormHelperText>
          )}

          {/* Payment Method */}
          <Typography variant='body1' fontWeight='semibold' mt={4} mb={1}>
            Choose Payment Method
          </Typography>
          <Controller
            name='paymentMethod'
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Box
                  border='1px solid #EDEDED'
                  borderRadius='12px'
                  overflow='hidden'
                  bgcolor='#FAFAFA'
                >
                  <FormControlLabel
                    value='wallet'
                    control={<Radio sx={{ '&.Mui-checked': { color: '#669900' } }} />}
                    label={
                      <Box display='flex' alignItems='center' gap={1}>
                        <img src={walletIcon} alt='wallet' width={20} />
                        <Typography fontWeight={600}>Wallet</Typography>
                      </Box>
                    }
                    sx={{
                      m: 0,
                      px: 2,
                      py: 1.5,
                      width: '100%',
                      justifyContent: 'space-between',
                      flexDirection: 'row-reverse',
                      borderBottom: '1px solid #F2F2F2',
                      bgcolor: '#fff'
                    }}
                  />
                  <FormControlLabel
                    value='online'
                    control={<Radio sx={{ '&.Mui-checked': { color: '#669900' } }} />}
                    label={
                      <Box display='flex' alignItems='center' gap={1}>
                        <img src={globeIcon} width={20} />
                        <Typography fontWeight={600}>Online Payment</Typography>
                      </Box>
                    }
                    sx={{
                      m: 0,
                      px: 2,
                      py: 1.5,
                      width: '100%',
                      justifyContent: 'space-between',
                      flexDirection: 'row-reverse',
                    }}
                  />
                </Box>
              </RadioGroup>
            )}
          />
          {errors.paymentMethod && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              {errors.paymentMethod.message}
            </FormHelperText>
          )}

          {/* Spacer */}
          <Box flex={1} />

          {/* Submit */}
          <Box display='flex' justifyContent='flex-end' mt={4} pb={2}>
            <Button
              type='submit'
              variant='contained'
              size='large'
              disabled={isPending}
              sx={{ py: 1.5, fontSize: '1rem' }}
              endIcon={
                isPending ? (
                  <CircularProgress size={16} color='inherit' />
                ) : (
                  <img src={upIcon} />
                )
              }
            >
              {isPending ? 'Processing...' : 'Proceed'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
