import { useRef, useState, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';
import { useVerifyOtp, useResendOtp } from '@/services/auth';

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 150; // 2:30

const otpSchema = z.object({
  otp: z
    .array(z.string())
    .length(OTP_LENGTH)
    .refine((val) => val.every((digit) => /^\d$/.test(digit)), {
      message: 'Please enter all 6 digits',
    }),
});

type OtpFormData = z.infer<typeof otpSchema>;

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email?: string; type?: string } | null;
  const email = state?.email;
  const otpType = state?.type || 'signup_verification';
  const backRoute = otpType.includes('login') ? '/login' : '/register';

  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: Array(OTP_LENGTH).fill('') },
  });

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  // Redirect if no email in state
  if (!email) {
    return <Navigate to={backRoute} replace />;
  }


  const formatTime = (s: number) => {
    const mins = String(Math.floor(s / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setValue(`otp.${index}`, digit, { shouldValidate: false });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    const currentOtp = getValues('otp');
    if (e.key === 'Backspace' && !currentOtp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    pasted.split('').forEach((char, i) => {
      setValue(`otp.${i}`, char, { shouldValidate: false });
    });
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleResend = () => {
    resendOtp(
      { email, type: otpType },
      { onSuccess: () => setSeconds(COUNTDOWN_SECONDS) },
    );
  };

  const onSubmit = (data: OtpFormData) => {
    const otpCode = data.otp.join('');
    verifyOtp({ email, otp: otpCode, type: otpType });
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
        <Box display={{ xs: 'flex', md: 'none' }} mb={2}>
          <Button
            variant='text'
            onClick={() => navigate(backRoute)}
            startIcon={<ArrowBackIosNew sx={{ fontSize: 14 }} />}
            sx={{
              px: 0,
              minWidth: 0,
              color: '#344054',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'transparent', color: '#1D2939' },
            }}
          >
            Back
          </Button>
        </Box>
        <Typography
          variant='h3'
          fontWeight='bold'
          mb={1}
          sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
        >
          Enter OTP
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Enter one-time password sent to your email address
        </Typography>

        <Box component='form' mt={5} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography variant='body1' fontWeight='bold' mb={1}>
            OTP
          </Typography>

          <Box display='flex' gap={{ xs: 1, sm: 1.5 }}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <Controller
                key={index}
                name={`otp.${index}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    value={field.value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) =>
                      handleKeyDown(index, e as KeyboardEvent<HTMLInputElement>)
                    }
                    onPaste={index === 0 ? handlePaste : undefined}
                    inputRef={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    error={!!errors.otp}
                    slotProps={{
                      htmlInput: {
                        maxLength: 1,
                        style: {
                          textAlign: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          padding: '14px 0',
                        },
                        inputMode: 'numeric',
                      },
                    }}
                    sx={{
                      width: { xs: 44, sm: 56 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                )}
              />
            ))}
          </Box>

          {errors.otp && (
            <Typography variant='caption' color='error' mt={1}>
              {errors.otp.message || 'Please enter all 6 digits'}
            </Typography>
          )}

          <Box mt={3}>
            <Typography variant='body2' color='text.secondary'>
              Didn't receive an OTP?{' '}
              {seconds > 0 ? (
                <Typography
                  component='span'
                  variant='body2'
                  fontWeight='bold'
                  color='#669900'
                >
                  {formatTime(seconds)}
                </Typography>
              ) : (
                <Typography
                  component='span'
                  variant='body2'
                  fontWeight='bold'
                  color='#669900'
                  sx={{
                    cursor: isResending ? 'default' : 'pointer',
                    textDecoration: 'underline',
                    opacity: isResending ? 0.6 : 1,
                  }}
                  onClick={!isResending ? handleResend : undefined}
                >
                  {isResending ? 'Sending...' : 'Resend'}
                </Typography>
              )}
            </Typography>
          </Box>

          <Box display='flex' justifyContent='flex-end' mt={5}>
            <Button
              type='submit'
              variant='contained'
              size='large'
              disabled={isVerifying}
              sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
              startIcon={isVerifying && <CircularProgress size={12} color='inherit' />}
            >
              Proceed
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
