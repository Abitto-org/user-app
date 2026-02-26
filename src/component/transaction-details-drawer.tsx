import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { Close, NorthEast, SouthWest } from '@mui/icons-material';
import upIcon from '@/assets/icons/up-icon.svg';
import {
  getKgPurchased,
  getTransactionDisplayAmount,
  type Transaction,
} from '@/services/transactions';
import { pxToRem } from '@/util/font';

interface TransactionDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const formatAmount = (amount: number | string) => {
  const value = Number(amount);
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

const getStatusStyle = (status?: string) => {
  if (status === 'SUCCESS') return { label: 'Successful', bg: '#ECFDF3', color: '#067647' };
  if (status === 'FAILED') return { label: 'Failed', bg: '#FEF3F2', color: '#B42318' };
  return { label: 'Pending', bg: '#FFFAEB', color: '#B54708' };
};

export const TransactionDetailsDrawer = ({
  open,
  onClose,
  transaction,
}: TransactionDetailsDrawerProps) => {
  const unitsBought = transaction ? getKgPurchased(transaction.metadata) : null;
  const transferMeta =
    transaction?.type === 'GAS_TRANSFER' &&
    transaction.metadata &&
    typeof (transaction.metadata as Record<string, unknown>).transferId === 'string'
      ? (transaction.metadata as {
          type?: 'incoming' | 'outgoing';
          transferId: string;
          senderEmail?: string;
          recipientEmail?: string;
          gasPriceAtTime?: number;
        })
      : null;
  const isIncomingTransfer = transferMeta?.type === 'incoming';
  const directionLabel = transaction
    ? transaction.type === 'GAS_TRANSFER'
      ? isIncomingTransfer
        ? 'Credit'
        : 'Debit'
      : 'Debit'
    : '--';
  const status = getStatusStyle(transaction?.status);
  const counterParty =
    transferMeta?.type === 'incoming'
      ? transferMeta.senderEmail
      : transferMeta?.recipientEmail;
  const directionIcon =
    transferMeta?.type === 'incoming' ? (
      <SouthWest sx={{ color: '#067647', fontSize: 18 }} />
    ) : (
      <NorthEast sx={{ color: '#B42318', fontSize: 18 }} />
    );

  const detailRows: Array<{ label: string; value: string }> = [
    { label: 'Direction', value: directionLabel },
    {
      label: 'Amount',
      value: transaction ? formatAmount(getTransactionDisplayAmount(transaction)) : '--',
    },
    {
      label: 'Purpose',
      value: transaction ? formatPurpose(transaction.type) : '--',
    },
    {
      label: 'Units',
      value: unitsBought ? `${Number(unitsBought).toLocaleString('en-NG')} kg` : '--',
    },
    {
      label: 'Timestamp',
      value: transaction ? formatDate(transaction.createdAt) : '--',
    },
    {
      label: 'Reference',
      value: transaction?.reference ?? '--',
    },
    {
      label: 'Provider',
      value: transaction?.provider ?? '--',
    },
    {
      label: transferMeta?.type === 'incoming' ? 'Sender' : 'Recipient',
      value: counterParty ?? '--',
    },
    {
      label: 'Transfer ID',
      value: transferMeta?.transferId ?? '--',
    },
    {
      label: 'Gas price at time',
      value:
        transferMeta && typeof transferMeta.gasPriceAtTime === 'number'
          ? formatAmount(transferMeta.gasPriceAtTime)
          : '--',
    },
  ];

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

        <Box px={3} py={3} display='flex' flexDirection='column' gap={2}>
          <Box
            p={2}
            borderRadius='12px'
            border='1px solid #EAECF0'
            bgcolor='#FCFCFD'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center' gap={1}>
              {transaction?.type === 'GAS_TRANSFER' ? directionIcon : null}
              <Typography fontWeight={700}>
                {transaction?.type === 'GAS_TRANSFER'
                  ? isIncomingTransfer
                    ? 'Gas Received'
                    : 'Gas Sent'
                  : 'Gas Purchase'}
              </Typography>
            </Box>
            <Chip
              label={status.label}
              sx={{
                bgcolor: status.bg,
                color: status.color,
                fontWeight: 700,
                borderRadius: '999px',
              }}
            />
          </Box>

          <Box border='1px solid #EAECF0' borderRadius='12px' p={2}>
            {detailRows.map((row, index) => (
              <Box key={row.label}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  py={1.2}
                  gap={2}
                >
                  <Typography color='#667085' fontSize={pxToRem(14)}>
                    {row.label}
                  </Typography>
                  <Typography
                    fontWeight={700}
                    fontSize={pxToRem(14)}
                    textAlign='right'
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {row.value}
                  </Typography>
                </Box>
                {index < detailRows.length - 1 && <Divider />}
              </Box>
            ))}
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
