import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  OTP_TYPES,
  useForgotPassword,
  useResetPassword,
  useVerifyForgotPasswordOtp,
} from '@/services/forgot-password';

const requestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits'),
});

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RequestFormData = z.infer<typeof requestSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

type Step = 'request' | 'otp' | 'reset';

export const ForgotPassword = () => {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const {
    mutate: triggerForgotPassword,
    isPending: isRequestPending,
  } = useForgotPassword();
  const {
    mutate: verifyOtp,
    isPending: isOtpPending,
  } = useVerifyForgotPasswordOtp();
  const {
    mutate: resetPassword,
    isPending: isResetPending,
  } = useResetPassword();

  const onSubmitRequest = (data: RequestFormData) => {
    triggerForgotPassword(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('otp');
      },
    });
  };

  const onSubmitOtp = (data: OtpFormData) => {
    if (!email) return;

    verifyOtp(
      {
        email,
        otp: data.otp,
        type: OTP_TYPES.FORGOT_PASSWORD,
      },
      {
        onSuccess: (response) => {
          setTempToken(response.data.token);
          setStep('reset');
        },
      },
    );
  };

  const onSubmitReset = (data: ResetFormData) => {
    if (!tempToken) return;

    resetPassword({
      token: tempToken,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  const renderStepTitle = () => {
    if (step === 'request') return 'Forgot your password?';
    if (step === 'otp') return 'Enter verification code';
    return 'Set a new password';
  };

  const renderStepSubtitle = () => {
    if (step === 'request') {
      return 'Enter the email associated with your account and we’ll send you a verification code.';
    }
    if (step === 'otp') {
      return `We’ve sent a 6‑digit code to ${email}. Enter it below to continue.`;
    }
    return 'Choose a strong password you have not used before for this account.';
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='100%'
      width='100%'
      px={{ xs: 3, sm: 5, md: 8 }}
    >
      <Box width='100%' maxWidth={480}>
        <Typography
          variant='h3'
          fontWeight='bold'
          mb={1}
          sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
        >
          {renderStepTitle()}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {renderStepSubtitle()}
        </Typography>

        {step === 'request' && (
          <Box
            component='form'
            mt={5}
            display='flex'
            flexDirection='column'
            gap={3}
            onSubmit={handleSubmitRequest(onSubmitRequest)}
            noValidate
          >
            <Box>
              <Typography variant='body1' fontWeight='bold' mb={1}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder='Enter Email Address'
                type='email'
                {...registerRequest('email')}
                error={!!requestErrors.email}
                helperText={requestErrors.email?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </Box>

            <Box display='flex' justifyContent='flex-end' mt={3}>
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={isRequestPending}
                sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                startIcon={
                  isRequestPending && <CircularProgress size={18} color='inherit' />
                }
              >
                Send code
              </Button>
            </Box>
          </Box>
        )}

        {step === 'otp' && (
          <Box
            component='form'
            mt={5}
            display='flex'
            flexDirection='column'
            gap={3}
            onSubmit={handleSubmitOtp(onSubmitOtp)}
            noValidate
          >
            <Box>
              <Typography variant='body1' fontWeight='bold' mb={1}>
                Verification code
              </Typography>
              <TextField
                fullWidth
                placeholder='Enter 6-digit code'
                {...registerOtp('otp')}
                error={!!otpErrors.otp}
                helperText={otpErrors.otp?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </Box>

            <Box display='flex' justifyContent='space-between' mt={3}>
              <Button
                variant='text'
                color='inherit'
                onClick={() => setStep('request')}
                disabled={isOtpPending}
              >
                Back
              </Button>
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={isOtpPending}
                sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                startIcon={isOtpPending && <CircularProgress size={18} color='inherit' />}
              >
                Verify code
              </Button>
            </Box>
          </Box>
        )}

        {step === 'reset' && (
          <Box
            component='form'
            mt={5}
            display='flex'
            flexDirection='column'
            gap={3}
            onSubmit={handleSubmitReset(onSubmitReset)}
            noValidate
          >
            <Box>
              <Typography variant='body1' fontWeight='bold' mb={1}>
                New password
              </Typography>
              <TextField
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                placeholder='Enter new password'
                {...registerReset('newPassword')}
                error={!!resetErrors.newPassword}
                helperText={resetErrors.newPassword?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setShowNewPassword((prev) => !prev)}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box>
              <Typography variant='body1' fontWeight='bold' mb={1}>
                Confirm new password
              </Typography>
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Re-enter new password'
                {...registerReset('confirmPassword')}
                error={!!resetErrors.confirmPassword}
                helperText={resetErrors.confirmPassword?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box display='flex' justifyContent='space-between' mt={3}>
              <Button
                variant='text'
                color='inherit'
                onClick={() => setStep('otp')}
                disabled={isResetPending}
              >
                Back
              </Button>
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={isResetPending}
                sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                startIcon={
                  isResetPending && <CircularProgress size={18} color='inherit' />
                }
              >
                Reset password
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

