import { Box, Button, Drawer, IconButton, Typography, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';
import upIcon from '@/assets/icons/up-icon.svg';
import { getKgPurchased, type Transaction } from '@/services/transactions';
import { pxToRem } from '@/util/font';

interface TransactionDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const formatAmount = (amount: string) => {
  const value = Number(amount) / 100;
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 || 12;
  return `${day}-${month}-${year} | ${displayHour}:${minutes}${ampm}`;
};

const formatPurpose = (type: string) =>
  type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const TransactionDetailsDrawer = ({
  open,
  onClose,
  transaction,
}: TransactionDetailsDrawerProps) => {
  const unitsBought = transaction ? getKgPurchased(transaction.metadata) : null;

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 440 } } }}
    >
      <Box display='flex' flexDirection='column' height='100%'>
        <Box display='flex' justifyContent='flex-end' p={2}>
          <IconButton onClick={onClose} size='small'>
            <Close />
          </IconButton>
        </Box>

        <Box px={3} pb={2} borderBottom='1px solid #EFEFEF'>
          <Typography variant='h5' fontWeight='bold'>
            Transaction
          </Typography>
          <Typography variant='body2' fontWeight='bold' color='text.secondary' mt={0.5}>
            {transaction?.description || 'Transaction details'}
          </Typography>
        </Box>

        <Box px={3} py={3} display='flex' flexDirection='column' gap={3}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography color='#4A4A4A' fontSize={pxToRem(16)}>
              Type
            </Typography>
            <Chip
              label='Debit'
              sx={{
                bgcolor: '#FDECEA',
                color: '#E53935',
                fontWeight: 600,
                borderRadius: '999px',
              }}
            />
          </Box>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography color='#4A4A4A' fontSize={pxToRem(16)}>
              Amount
            </Typography>
            <Typography fontWeight={700} fontSize={pxToRem(16)}>
              {transaction ? formatAmount(transaction.amount) : '--'}
            </Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography color='#4A4A4A' fontSize={pxToRem(16)}>
              TimeStamp
            </Typography>
            <Typography fontWeight={700} fontSize={pxToRem(16)}>
              {transaction ? formatDate(transaction.createdAt) : '--'}
            </Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography color='#4A4A4A' fontSize={pxToRem(16)}>
              Purpose
            </Typography>
            <Typography fontWeight={700} fontSize={pxToRem(16)}>
              {transaction ? formatPurpose(transaction.type) : '--'}
            </Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography color='#4A4A4A' fontSize={pxToRem(16)}>
              Units Bought
            </Typography>
            <Typography fontWeight={700} fontSize={pxToRem(16)}>
              {unitsBought ? `${unitsBought}kg` : '--'}
            </Typography>
          </Box>
        </Box>

        <Box mt='auto' p={3} display='flex' justifyContent='flex-end'>
          <Button
            variant='contained'
            onClick={onClose}
            endIcon={<img src={upIcon} alt='done' />}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
