import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';

const rows = [
  { status: 'successful' },
  { status: 'failed' },
  { status: 'successful' },
  { status: 'pending' },
  { status: 'successful' },
  { status: 'successful' },
];

const statusConfig = {
  successful: {
    label: 'Successful',
    bg: '#E8F5E9',
    color: '#2E7D32',
  },
  failed: {
    label: 'Failed',
    bg: '#FDECEA',
    color: '#D32F2F',
  },
  pending: {
    label: 'Pending',
    bg: '#FFF8E1',
    color: '#F9A825',
  },
};

const headers = ['Timestamp', 'Type', 'Amount', 'Gas Unit', 'Status', 'Action'] as const;

const getRowValues = (row: (typeof rows)[number]) => {
  const status = statusConfig[row.status as keyof typeof statusConfig];
  return {
    Timestamp: '20-08-2025 | 8:58am',
    Type: 'Gas Purchase',
    Amount: '₦5,000,000.00',
    'Gas Unit': '24.5',
    Status: (
      <Chip
        label={status.label}
        sx={{
          bgcolor: status.bg,
          color: status.color,
          fontWeight: 500,
          borderRadius: '999px',
          height: 28,
        }}
      />
    ),
    Action: (
      <Link
        href='#'
        underline='none'
        sx={{
          color: '#6A9A00',
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        View <NorthEastIcon sx={{ fontSize: 16 }} />
      </Link>
    ),
  };
};

// ── Mobile card view ──

const MobileCards = () => (
  <Box display='flex' flexDirection='column' gap={2}>
    {rows.map((row, index) => {
      const values = getRowValues(row);
      return (
        <Box
          key={index}
          bgcolor='white'
          borderRadius={2}
          border='1px solid #E4E7EC'
          p={2}
        >
          {headers.map((header) => (
            <Box
              key={header}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              py={1}
              sx={{
                '&:not(:last-child)': {
                  //  borderBottom: '1px solid #F2F2F2',
                },
              }}
            >
              <Typography variant='body2' color='#888' fontWeight={600}>
                {header}
              </Typography>
              <Typography
                variant='body2'
                fontWeight={header === 'Amount' ? 600 : 400}
                component='div'
              >
                {values[header]}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    })}
  </Box>
);

// ── Desktop table view ──

const DesktopTable = () => (
  <Box bgcolor='white' borderRadius={2} border='1px solid #E4E7EC' overflow='hidden'>
    <Table sx={{ overflow: 'hidden !important' }}>
      <TableHead sx={{ overflow: 'hidden !important' }}>
        <TableRow sx={{ overflow: 'hidden !important' }}>
          {headers.map((head, idx) => (
            <TableCell
              key={head}
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: '#111',
                borderRight:
                  idx !== headers.length - 1 ? '1px solid #EAEAEA' : undefined,
                bgcolor: '#FAFAFA',
                overflow: 'hidden !important',
              }}
            >
              {head}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row, index) => {
          const values = getRowValues(row);
          return (
            <TableRow key={index}>
              <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>
                {values.Timestamp}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>
                {values.Type}
              </TableCell>
              <TableCell
                sx={{ fontWeight: 600, borderRight: '1px solid #EAEAEA' }}
              >
                {values.Amount}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>
                {values['Gas Unit']}
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>
                {values.Status}
              </TableCell>
              <TableCell>{values.Action}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </Box>
);

// ── Main component ──

export const RecentActivityTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? <MobileCards /> : <DesktopTable />;
};
