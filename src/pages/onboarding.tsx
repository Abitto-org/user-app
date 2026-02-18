import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { useGetEstates, useOnboarding } from '@/services/profile';

const OTHER_ESTATE_VALUE = 'other';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  },
};

const onboardingSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    gender: z.string().min(1, 'Please select a gender'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    estateId: z.string().min(1, 'Please select an estate'),
    estateName: z.string().optional(),
    houseNumber: z.string().min(1, 'House number is required'),
    nin: z.string().min(1, 'NIN is required'),
  })
  .refine(
    (data) =>
      data.estateId !== OTHER_ESTATE_VALUE || (data.estateName && data.estateName.trim().length > 0),
    {
      message: 'Estate name is required',
      path: ['estateName'],
    },
  );

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const step1Fields: (keyof OnboardingFormData)[] = [
  'firstName',
  'lastName',
  'gender',
  'phoneNumber',
];

export const Onboarding = () => {
  const [step, setStep] = useState(0);

  const { data: estates = [], isLoading: estatesLoading } = useGetEstates();
  const { mutate: onboard, isPending } = useOnboarding();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      phoneNumber: '',
      estateId: '',
      estateName: '',
      houseNumber: '',
      nin: '',
    },
    mode: 'onTouched',
  });

  const selectedEstateId = watch('estateId');
  const isOtherEstate = selectedEstateId === OTHER_ESTATE_VALUE;

  const handleNext = async () => {
    const isValid = await trigger(step1Fields);
    if (isValid) setStep(1);
  };

  const onSubmit = (data: OnboardingFormData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender.toLowerCase(),
      phoneNumber: data.phoneNumber,
      nin: data.nin,
      estateId: isOtherEstate ? '' : data.estateId,
      houseNumber: data.houseNumber,
      ...(isOtherEstate && { estateName: data.estateName }),
    };
    onboard(payload);
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
      py={4}
    >
      <Box width='100%' maxWidth={480}>
        {step === 0 ? (
          <>
            <Typography
              variant='h3'
              fontWeight='bold'
              mb={1}
              sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
            >
              Personal Details
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              This will help us personalize your experience
            </Typography>

            <Box mt={4} display='flex' flexDirection='column' gap={3}>
              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Enter First Name'
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={inputSx}
                />
              </Box>

              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Enter Last Name'
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={inputSx}
                />
              </Box>

              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  Gender
                </Typography>
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <Select
                      fullWidth
                      {...field}
                      displayEmpty
                      error={!!errors.gender}
                      sx={{ borderRadius: '12px' }}
                      renderValue={(value) =>
                        value ? (
                          value
                        ) : (
                          <span style={{ color: '#aaa' }}>Select Gender</span>
                        )
                      }
                    >
                      <MenuItem value='Male'>Male</MenuItem>
                      <MenuItem value='Female'>Female</MenuItem>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <FormHelperText error>{errors.gender.message}</FormHelperText>
                )}
              </Box>

              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Enter Phone Number'
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  sx={inputSx}
                />
              </Box>

              <Box display='flex' justifyContent='flex-end' mt={2}>
                <Button
                  variant='contained'
                  size='large'
                  sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                  onClick={handleNext}
                >
                  Proceed
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography
              variant='h3'
              fontWeight='bold'
              mb={1}
              sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
            >
              House Address
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Enter your house location
            </Typography>

            <Box mt={4} display='flex' flexDirection='column' gap={3}>
              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  Estate
                </Typography>
                <Controller
                  name='estateId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      fullWidth
                      {...field}
                      displayEmpty
                      error={!!errors.estateId}
                      sx={{ borderRadius: '12px' }}
                      renderValue={(value) => {
                        if (!value) {
                          return <span style={{ color: '#aaa' }}>Select Estate</span>;
                        }
                        if (value === OTHER_ESTATE_VALUE) return 'Other';
                        const estate = estates.find((e) => e.id === value);
                        return estate?.name ?? value;
                      }}
                    >
                      {estatesLoading && (
                        <MenuItem disabled>
                          <CircularProgress size={18} sx={{ mr: 1 }} /> Loading...
                        </MenuItem>
                      )}
                      {estates.map((estate) => (
                        <MenuItem key={estate.id} value={estate.id}>
                          {estate.name}
                        </MenuItem>
                      ))}
                      <MenuItem value={OTHER_ESTATE_VALUE}>Other</MenuItem>
                    </Select>
                  )}
                />
                {errors.estateId && (
                  <FormHelperText error>{errors.estateId.message}</FormHelperText>
                )}
              </Box>

              {isOtherEstate && (
                <Box>
                  <Typography variant='body1' fontWeight='bold' mb={1}>
                    Estate Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder='Enter Estate Name'
                    {...register('estateName')}
                    error={!!errors.estateName}
                    helperText={errors.estateName?.message}
                    sx={inputSx}
                  />
                </Box>
              )}

              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  House Number
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Enter House Number'
                  {...register('houseNumber')}
                  error={!!errors.houseNumber}
                  helperText={errors.houseNumber?.message}
                  sx={inputSx}
                />
              </Box>

              <Box>
                <Typography variant='body1' fontWeight='bold' mb={1}>
                  NIN
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Enter NIN'
                  {...register('nin')}
                  error={!!errors.nin}
                  helperText={errors.nin?.message}
                  sx={inputSx}
                />
              </Box>

              <Box display='flex' justifyContent='flex-end' gap={2} mt={2}>
                <Button
                  variant='text'
                  size='large'
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  disabled={isPending}
                  sx={{ px: 5, py: 1.5, fontSize: '1rem' }}
                >
                  {isPending ? <CircularProgress size={24} color='inherit' /> : 'Done'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
