import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { Close, CardGiftcardOutlined, LockOutlined } from '@mui/icons-material';
import { useGetMeters } from '@/services/meters';
import { useGetProfile } from '@/services/profile';
import { useGiftGas, useSendGiftGasOtp } from '@/services/gifting';
import { useMeterId } from '@/hooks/use-meter-id';

const giftSchema = z.object({
  sourceMeterId: z.string().min(1, 'Please select source meter'),
  recipientMeterNumber: z
    .string()
    .min(1, 'Recipient meter number is required')
    .min(5, 'Enter a valid meter number'),
  amountKg: z.coerce.number().min(0.1, 'Minimum gifting amount is 0.1kg'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

type GiftFormData = z.infer<typeof giftSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface GiftGasDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const GiftGasDrawer = ({ open, onClose }: GiftGasDrawerProps) => {
  const meterId = useMeterId();
  const { data: meters = [] } = useGetMeters();
  const { data: profile } = useGetProfile();
  const { mutate: giftGas, isPending: giftPending } = useGiftGas();
  const { mutate: sendGiftOtp, isPending: sendOtpPending } = useSendGiftGasOtp();

  const [step, setStep] = useState<'gift' | 'otp'>('gift');
  const [giftDraft, setGiftDraft] = useState<GiftFormData | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      sourceMeterId: meterId || '',
      recipientMeterNumber: '',
      amountKg: 0 as unknown as number,
    },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    reset: resetOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const sourceOptions = useMemo(() => meters, [meters]);

  const handleClose = () => {
    setStep('gift');
    setGiftDraft(null);
    reset({
      sourceMeterId: meterId || '',
      recipientMeterNumber: '',
      amountKg: 0.5 as unknown as number,
    });
    resetOtp({ otp: '' });
    onClose();
  };

  const onSubmitGift = (data: GiftFormData) => {
    if (!profile?.email) return;
    sendGiftOtp(
      {
        email: profile.email,
        type: 'gas_gifting_authorization',
      },
      {
      onSuccess: () => {
          setGiftDraft(data);
        setStep('otp');
      },
      },
    );
  };

  const onSubmitOtp = (data: OtpFormData) => {
    if (!giftDraft) return;
    giftGas(
      {
        ...giftDraft,
        otp: data.otp,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
    >
      <Box display='flex' flexDirection='column' height='100%' p={3}>
        <Box display='flex' justifyContent='flex-end' mb={2}>
          <IconButton onClick={handleClose} size='small'>
            <Close />
          </IconButton>
        </Box>

        <Box display='flex' alignItems='center' gap={1} mb={0.5}>
          {step === 'gift' ? (
            <CardGiftcardOutlined sx={{ color: '#669900' }} />
          ) : (
            <LockOutlined sx={{ color: '#669900' }} />
          )}
          <Typography variant='h5' fontWeight='bold'>
            {step === 'gift' ? 'Gift Gas 🎁' : 'Authorize Gift 🔐'}
          </Typography>
        </Box>

        <Typography variant='body2' color='text.secondary' mb={3}>
          {step === 'gift'
            ? 'Share gas with friends and family in seconds ✨'
            : 'Enter the OTP sent to your email to complete gifting ✅'}
        </Typography>

        {step === 'gift' ? (
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmitGift)}
            display='flex'
            flexDirection='column'
            flex={1}
          >
            <Typography variant='body1' fontWeight={600} mb={1}>
              Source Meter
            </Typography>
            <Controller
              name='sourceMeterId'
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth sx={{ borderRadius: '12px' }} error={!!errors.sourceMeterId}>
                  {sourceOptions.map((meter) => (
                    <MenuItem key={meter.id} value={meter.id}>
                      {meter.meterNumber}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.sourceMeterId && (
              <FormHelperText error>{errors.sourceMeterId.message}</FormHelperText>
            )}

            <Typography variant='body1' fontWeight={600} mt={2.5} mb={1}>
              Recipient Meter Number
            </Typography>
            <TextField
              placeholder='e.g. 740-452-384'
              {...register('recipientMeterNumber')}
              error={!!errors.recipientMeterNumber}
              helperText={errors.recipientMeterNumber?.message}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Typography variant='body1' fontWeight={600} mt={2.5} mb={1}>
              Amount (Kg)
            </Typography>
            <TextField
              type='number'
              placeholder='0.5'
              {...register('amountKg')}
              slotProps={{
                htmlInput: {
                  min: 0.1,
                  step: 0.1,
                },
              }}
              error={!!errors.amountKg}
              helperText={errors.amountKg?.message}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Box
              mt={2.5}
              p={1.5}
              border='1px dashed #D0D5DD'
              borderRadius='10px'
              bgcolor='#F9FAFB'
            >
              <Typography variant='caption' color='text.secondary'>
                Step 1: send OTP to authorize this gift transfer.
              </Typography>
            </Box>

            <Box flex={1} />
            <Button
              type='submit'
              variant='contained'
              disabled={sendOtpPending || !profile?.email}
              sx={{ py: 1.5, mt: 3 }}
              endIcon={
                sendOtpPending ? <CircularProgress size={16} color='inherit' /> : undefined
              }
            >
              {sendOtpPending ? 'Sending OTP...' : 'Send OTP ✉️'}
            </Button>
          </Box>
        ) : (
          <Box
            component='form'
            onSubmit={handleSubmitOtp(onSubmitOtp)}
            display='flex'
            flexDirection='column'
            flex={1}
          >
            <Typography variant='body1' fontWeight={600} mb={1}>
              Enter 6-digit OTP
            </Typography>
            <TextField
              placeholder='555555'
              {...registerOtp('otp')}
              error={!!otpErrors.otp}
              helperText={otpErrors.otp?.message}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <Typography variant='caption' color='text.secondary' mt={1}>
              Authorizing as: {profile?.email ?? 'No email available'}
            </Typography>

            <Box flex={1} />
            <Button
              type='submit'
              variant='contained'
              disabled={giftPending || !profile?.email}
              sx={{ py: 1.5, mt: 3 }}
              endIcon={
                giftPending ? <CircularProgress size={16} color='inherit' /> : undefined
              }
            >
              {giftPending ? 'Completing Gift...' : 'Verify OTP & Gift ✅'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
