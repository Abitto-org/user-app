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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGetEstates } from '@/services/profile';
import { useLinkMeter } from '@/services/meters';

const schema = z.object({
  meterNumber: z
    .string()
    .min(1, 'Meter number is required')
    .min(5, 'Enter a valid meter number'),
  estateId: z.string().min(1, 'Select an estate'),
  houseNumber: z.string().min(1, 'House number is required'),
});

type LinkMeterForm = z.infer<typeof schema>;

interface LinkMeterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const LinkMeterDrawer = ({ open, onClose }: LinkMeterDrawerProps) => {
  const { data: estates = [] } = useGetEstates();
  const { mutate, isPending } = useLinkMeter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LinkMeterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      meterNumber: '',
      estateId: '',
      houseNumber: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: LinkMeterForm) => {
    mutate(values, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}
    >
      <Box display='flex' flexDirection='column' height='100%' p={3}>
        <Box display='flex' justifyContent='flex-end' mb={1}>
          <IconButton onClick={handleClose} size='small'>
            <Close />
          </IconButton>
        </Box>

        <Typography variant='h5' fontWeight={700} mb={0.5}>
          Link A Meter
        </Typography>
        <Typography variant='body2' color='text.secondary' mb={3}>
          Register a meter to your account
        </Typography>

        <Box
          component='form'
          display='flex'
          flexDirection='column'
          flex={1}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Typography variant='body1' fontWeight={600} mb={1}>
            Meter Number
          </Typography>
          <TextField
            placeholder='Enter Meter Number'
            fullWidth
            {...register('meterNumber')}
            error={!!errors.meterNumber}
            helperText={errors.meterNumber?.message}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <Typography variant='body1' fontWeight={600} mb={1}>
            Estate
          </Typography>
          <Controller
            name='estateId'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                displayEmpty
                error={!!errors.estateId}
                sx={{ borderRadius: '12px', mb: 0.5 }}
                renderValue={(value) =>
                  value
                    ? estates.find((e) => e.id === value)?.name ?? value
                    : 'Select Estate'
                }
              >
                {estates.map((estate) => (
                  <MenuItem key={estate.id} value={estate.id}>
                    {estate.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.estateId && (
            <FormHelperText error sx={{ mb: 2 }}>
              {errors.estateId.message}
            </FormHelperText>
          )}

          <Typography variant='body1' fontWeight={600} mb={1} mt={2}>
            House Number
          </Typography>
          <TextField
            placeholder='Enter Number'
            fullWidth
            {...register('houseNumber')}
            error={!!errors.houseNumber}
            helperText={errors.houseNumber?.message}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <Box flex={1} />
          <Box display='flex' justifyContent='flex-end' mt={3}>
            <Button
              type='submit'
              variant='contained'
              disabled={isPending}
              sx={{ borderRadius: '999px', px: 3, py: 1.4 }}
            >
              {isPending ? 'Requesting...' : 'Request Linking'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

