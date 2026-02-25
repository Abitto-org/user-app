import { useMemo, useState } from 'react';
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  isGasUsageActivity,
  useGetRecentActivities,
  type GasUsageActivity,
} from '@/services/activities';

const PAGE_SIZE = 6;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const formatKg = (value: string) =>
  `${Number(value).toLocaleString('en-NG', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  })} Units`;

export const UsageDailyTable = () => {
  const [page, setPage] = useState(1);
  const { data = [] } = useGetRecentActivities();

  const gasRows = useMemo(
    () => data.filter(isGasUsageActivity) as GasUsageActivity[],
    [data],
  );

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return gasRows.slice(start, start + PAGE_SIZE);
  }, [gasRows, page]);

  const pageCount = Math.max(1, Math.ceil(gasRows.length / PAGE_SIZE));

  return (
    <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2.5}>
      <Typography variant='h6' fontWeight={700}>
        Daily Usage
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={2}>
        Keep track of your daily gas usage
      </Typography>

      <Box border='1px solid #ECECEC' borderRadius='8px' overflow='hidden'>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAFAFA' }}>
              <TableCell>Date</TableCell>
              <TableCell>Gas Used</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>{formatKg(row.kgUsed)}</TableCell>
                <TableCell>4 hours</TableCell>
                <TableCell>Normal</TableCell>
              </TableRow>
            ))}
            {pagedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color='text.secondary'>No usage records yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Box mt={2} display='flex' justifyContent='flex-end'>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, val) => setPage(val)}
          color='primary'
          size='small'
        />
      </Box>
    </Box>
  );
};
