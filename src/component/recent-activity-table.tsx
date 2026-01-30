import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Link,
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

export const RecentActivityTable = () => {
  return (
    <Box bgcolor="white" borderRadius={2} border='1px solid #E4E7EC' overflow="hidden">
      <Table sx={{
        overflow: 'hidden !important',
      }}>
        <TableHead sx={{ overflow: 'hidden !important', }}>
          <TableRow sx={{ overflow: 'hidden !important' }}>
            {['Timestamp', 'Type', 'Amount', 'Gas Unit', 'Status', 'Action'].map(
              (head, idx, arr) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#111',
                    borderRight: arr.length - 1 !== idx ? '1px solid #EAEAEA' : null,
                    bgcolor: '#FAFAFA',
                    overflow: 'hidden !important'
                  }}
                >
                  {head}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => {
            const status = statusConfig[row.status as keyof typeof statusConfig];

            return (
              <TableRow key={index}>
                <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>20-08-2025 | 8:58am</TableCell>
                <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>Gas Purchase</TableCell>
                <TableCell sx={{ fontWeight: 600, borderRight: '1px solid #EAEAEA' }}>
                  ₦5,000,000.00
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>24.5</TableCell>

                <TableCell sx={{ borderRight: '1px solid #EAEAEA' }}>
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
                </TableCell>

                <TableCell>
                  <Link
                    href="#"
                    underline="none"
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};
