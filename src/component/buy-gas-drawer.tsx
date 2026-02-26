import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGetMeter, useGetMeters } from '@/services/meters';
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
    .refine((val) => val >= 0, { message: 'Minimum amount is ₦1,000' }),
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
  const selectedMeterId = useWatch({ control, name: 'meter' });
  const { data: selectedMeterDetails, isLoading: meterDetailsLoading, isError: meterDetailsError } =
    useGetMeter(selectedMeterId || undefined);

  const { data: priceData } = useGetPricePerKg();
  const pricePerKg = Number(priceData?.gasPricePerKg ?? 0);
  const kgEstimate = (() => {
    const amount = Number(amountInput);
    if (!amount || amount <= 0 || !pricePerKg || pricePerKg <= 0) return '0';
    return (amount / pricePerKg).toFixed(3);
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
              <Autocomplete
                freeSolo
                options={meters.map((meter) => meter.id)}
                value={field.value || null}
                onChange={(_, newValue) => {
                  field.onChange(typeof newValue === 'string' ? newValue : '');
                }}
                inputValue={
                  field.value
                    ? meters.find((m) => m.id === field.value)?.meterNumber ?? field.value
                    : ''
                }
                onInputChange={(_, newInputValue, reason) => {
                  if (reason === 'input' || reason === 'clear') {
                    field.onChange(newInputValue);
                  }
                }}
                getOptionLabel={(option) =>
                  meters.find((m) => m.id === option)?.meterNumber ?? option
                }
                filterOptions={(options, state) => {
                  const q = state.inputValue.trim().toLowerCase();
                  if (!q) return options;
                  return options.filter((id) => {
                    const meter = meters.find((m) => m.id === id);
                    return (
                      id.toLowerCase().includes(q) ||
                      (meter?.meterNumber ?? '').toLowerCase().includes(q)
                    );
                  });
                }}
                loading={metersLoading}
                noOptionsText={metersLoading ? 'Loading meters...' : 'No meters found'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder='Select meter or type meter ID/number'
                    error={!!errors.meter}
                    sx={{
                      mb: 0.5,
                      '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                    }}
                  />
                )}
              />
            )}
          />
          {errors.meter && (
            <FormHelperText error sx={{ mb: 1 }}>
              {errors.meter.message}
            </FormHelperText>
          )}
          {selectedMeterId && (
            <Box
              mt={1}
              mb={1}
              px={1.5}
              py={1.25}
              border='1px solid #EAECF0'
              borderRadius='10px'
              bgcolor='#FCFCFD'
            >
              {meterDetailsLoading ? (
                <Typography variant='caption' color='text.secondary'>
                  Loading meter details...
                </Typography>
              ) : meterDetailsError || !selectedMeterDetails ? (
                <Typography variant='caption' color='text.secondary'>
                  Unable to fetch meter details for this meter.
                </Typography>
              ) : (
                <>
                  <Typography variant='caption' color='#667085' display='block' mb={0.5}>
                    Owner:{' '}
                    <Typography
                      component='span'
                      variant='caption'
                      fontWeight={700}
                      color='#344054'
                    >
                      {`${selectedMeterDetails?.user?.firstName ?? ''} ${selectedMeterDetails?.user?.lastName ?? ''
                        }`.trim() ||
                        selectedMeterDetails?.user?.email ||
                        'N/A'}
                    </Typography>
                  </Typography>
                  <Typography variant='body2' fontWeight={700} color='#1D2939'>
                    {selectedMeterDetails?.estate?.name || 'Estate not available'}
                  </Typography>
                  <Typography variant='caption' color='#667085'>
                    {[
                      selectedMeterDetails?.estate?.address,
                      selectedMeterDetails?.estate?.city,
                      selectedMeterDetails?.estate?.state,
                      selectedMeterDetails?.estate?.country,
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Address not available'}
                  </Typography>
                </>
              )}
            </Box>
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
