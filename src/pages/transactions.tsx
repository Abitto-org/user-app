import { useState, useMemo, type UIEventHandler } from 'react';
import {
  Skeleton,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Link,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { DataTable, type DataTableColumn } from '@/shared/data-table';
import { TransactionDetailsDrawer } from '@/component/transaction-details-drawer';
import {
  useGetTransactionsInfinite,
  useGetTransactionStats,
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

const formatNaira = (value: number | string) => {
  return `₦${Number(value || 0).toLocaleString('en-NG')}`;
};

const formatType = (type: string) => {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getColumns = (
  onView: (transaction: Transaction) => void,
): DataTableColumn<Transaction>[] => [
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
    render: (row) => (
      <Link
        href='#'
        onClick={(e) => {
          e.preventDefault();
          onView(row);
        }}
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
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filters: TransactionFilters = useMemo(
    () => ({
      limit: ITEMS_PER_PAGE,
      ...(statusFilter && { status: statusFilter }),
    }),
    [statusFilter],
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetTransactionsInfinite(filters);
  const { data: stats, isLoading: statsLoading } = useGetTransactionStats();

  const transactions = useMemo(
    () => data?.pages.flatMap((entry) => entry.transactions) ?? [],
    [data?.pages],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.reference.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        formatType(t.type).toLowerCase().includes(q) ||
        formatAmount(t.amount).toLowerCase().includes(q),
    );
  }, [transactions, search]);

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {
    const el = event.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 120 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  const columns = useMemo(
    () =>
      getColumns((transaction) => {
        setSelectedTransaction(transaction);
        setDetailsOpen(true);
      }),
    [],
  );

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
        display='grid'
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}
        gap={2}
        mb={2}
      >
        <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2}>
          <Typography color='text.secondary' fontSize={13} mb={1}>
            Total Spent
          </Typography>
          {statsLoading ? (
            <>
              <Skeleton width={130} height={36} />
              <Skeleton width={110} height={22} />
            </>
          ) : (
            <>
              <Typography fontWeight={700} fontSize={34 / 16 + 'rem'} lineHeight={1.1}>
                {formatNaira(stats?.totalSpentAllTime ?? 0)}
              </Typography>
              <Typography mt={1} color='#12B76A' fontSize={12} fontWeight={600}>
                Last 30 Days
              </Typography>
            </>
          )}
        </Box>

        <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2}>
          <Typography color='text.secondary' fontSize={13} mb={1}>
            Total Transactions
          </Typography>
          {statsLoading ? (
            <>
              <Skeleton width={80} height={36} />
              <Skeleton width={170} height={22} />
            </>
          ) : (
            <>
              <Typography fontWeight={700} fontSize={34 / 16 + 'rem'} lineHeight={1.1}>
                {Number(stats?.totalTransactions ?? 0).toLocaleString('en-NG')}
              </Typography>
              <Typography mt={1} color='#344054' fontSize={12} fontWeight={600}>
                {`${Number(stats?.percentageIncreasePastMonth ?? 0).toLocaleString('en-NG')}% increase in the past month`}
              </Typography>
            </>
          )}
        </Box>

        <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2}>
          <Typography color='text.secondary' fontSize={13} mb={1}>
            Total Gas Purchased
          </Typography>
          {statsLoading ? (
            <>
              <Skeleton width={120} height={36} />
              <Skeleton width={110} height={22} />
            </>
          ) : (
            <>
              <Typography fontWeight={700} fontSize={34 / 16 + 'rem'} lineHeight={1.1}>
                {`${Number(stats?.totalGasPurchasedKgLast30d ?? 0).toLocaleString('en-NG')}kg`}
              </Typography>
              <Typography mt={1} color='#344054' fontSize={12} fontWeight={600}>
                Last 30 Days
              </Typography>
            </>
          )}
        </Box>
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

        <Box
          onScroll={handleScroll}
          sx={{
            maxHeight: { xs: '60vh', md: '65vh' },
            overflowY: 'auto',
            pr: 0.5,
          }}
        >
          <DataTable
            columns={columns}
            rows={filtered}
            loading={isLoading}
            skeletonRows={ITEMS_PER_PAGE}
            getRowKey={(row) => row.id}
            emptyMessage='No transactions found'
          />
          {isFetchingNextPage && (
            <Box display='flex' justifyContent='center' py={2}>
              <CircularProgress size={20} />
            </Box>
          )}
          {!hasNextPage && filtered.length > 0 && (
            <Box display='flex' justifyContent='center' py={2}>
              <Typography variant='caption' color='text.secondary'>
                You have reached the end of your transactions.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <TransactionDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        transaction={selectedTransaction}
      />
    </Box>
  );
};
