import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Link,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { DataTable, type DataTableColumn } from '@/shared/data-table';
import {
  useGetTransactions,
  getKgPurchased,
  type Transaction,
  type TransactionFilters,
} from '@/services/transactions';

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  SUCCESS: { label: 'Successful', bg: '#E8F5E9', color: '#2E7D32' },
  FAILED: { label: 'Failed', bg: '#FDECEA', color: '#D32F2F' },
  PENDING: { label: 'Pending', bg: '#FFF8E1', color: '#F9A825' },
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

const formatAmount = (amount: string) => {
  const value = Number(amount) / 100;
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};

const formatType = (type: string) => {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const columns: DataTableColumn<Transaction>[] = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    skeletonWidth: 140,
    render: (row) => formatDate(row.createdAt),
  },
  {
    key: 'type',
    header: 'Type',
    skeletonWidth: 100,
    render: (row) => formatType(row.type),
  },
  {
    key: 'amount',
    header: 'Amount',
    bold: true,
    skeletonWidth: 110,
    render: (row) => formatAmount(row.amount),
  },
  {
    key: 'gasUnit',
    header: 'Gas Unit',
    skeletonWidth: 50,
    render: (row) => {
      const kg = getKgPurchased(row.metadata);
      return kg ? `${kg} kg` : '—';
    },
  },
  {
    key: 'status',
    header: 'Status',
    skeletonWidth: 90,
    render: (row) => {
      const config = statusConfig[row.status] ?? statusConfig.PENDING;
      return (
        <Chip
          label={config.label}
          sx={{
            bgcolor: config.bg,
            color: config.color,
            fontWeight: 500,
            borderRadius: '999px',
            height: 28,
          }}
        />
      );
    },
  },
  {
    key: 'action',
    header: 'Action',
    skeletonWidth: 60,
    render: () => (
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
  },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'SUCCESS', label: 'Successful' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'PENDING', label: 'Pending' },
];

export const Transactions = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const filters: TransactionFilters = useMemo(
    () => ({
      page,
      limit: ITEMS_PER_PAGE,
      ...(statusFilter && { status: statusFilter }),
    }),
    [page, statusFilter],
  );

  const { data, isLoading } = useGetTransactions(filters);

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const filtered = useMemo(() => {
    const transactions = data?.transactions ?? [];
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.reference.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        formatType(t.type).toLowerCase().includes(q) ||
        formatAmount(t.amount).toLowerCase().includes(q),
    );
  }, [data?.transactions, search]);

  return (
    <Box>
      <Box
        display='flex'
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant='h4' fontWeight='bold'>
            Transactions
          </Typography>
          <Typography variant='body2' color='text.secondary' mt={0.5}>
            View all your transactions
          </Typography>
        </Box>
        <Button
          variant='contained'
          endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
          sx={{ whiteSpace: 'nowrap', px: 3, borderRadius: '12px' }}
        >
          Export Report
        </Button>
      </Box>

      <Box
        bgcolor='white'
        borderRadius={3}
        border='1px solid #E4E7EC'
        p={{ xs: 2, md: 3 }}
      >
        <Box
          display='flex'
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent='space-between'
          gap={2}
          mb={3}
        >
          <Typography variant='h6' fontWeight='bold'>
            Transactions
          </Typography>
          <Box display='flex' gap={1.5} flexDirection={{ xs: 'column', sm: 'row' }}>
            <TextField
              size='small'
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': { borderRadius: '10px' },
              }}
            />
            <Button
              variant='outlined'
              startIcon={<TuneIcon />}
              onClick={() => setShowFilters((prev) => !prev)}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                color: '#555',
                borderColor: '#DDD',
                '&:hover': { borderColor: '#BBB' },
              }}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Box display='flex' gap={2} mb={3} flexWrap='wrap'>
            <Select
              size='small'
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              displayEmpty
              sx={{ minWidth: 160, borderRadius: '10px' }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        <Typography variant='body2' color='text.secondary' mb={2}>
          View all your transactions
        </Typography>

        <DataTable
          columns={columns}
          rows={filtered}
          loading={isLoading}
          skeletonRows={ITEMS_PER_PAGE}
          getRowKey={(row) => row.id}
          emptyMessage='No transactions found'
        />

        {totalPages > 1 && (
          <Box display='flex' justifyContent='flex-end' mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape='rounded'
              color='primary'
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
