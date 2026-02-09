import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegister } from '@/services/auth';

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormData) => {
    signup(data);
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
          Create your account
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Already have an account?{' '}
          <Link
            to='/login'
            style={{ color: '#669900', fontWeight: 600, textDecoration: 'none' }}
          >
            Sign In
          </Link>
        </Typography>

        <Box
          component='form'
          mt={5}
          display='flex'
          flexDirection='column'
          gap={3}
          onSubmit={handleSubmit(onSubmit)}
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
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </Box>

          <Box>
            <Typography variant='body1' fontWeight='bold' mb={1}>
              Password
            </Typography>
            <TextField
              fullWidth
              placeholder='Create Password'
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
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
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box display='flex' justifyContent='flex-end' mt={3}>
            <Button
              type='submit'
              variant='contained'
              size='large'
              disabled={isPending}
              sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
              startIcon={isPending && <CircularProgress size={18} color='inherit' />}
            >
              {'Proceed'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
