import { Chip, Link } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { DataTable, type DataTableColumn } from '@/shared/data-table';
import { useGetTransactions, getKgPurchased, type Transaction } from '@/services/transactions';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  SUCCESS: {
    label: 'Successful',
    bg: '#E8F5E9',
    color: '#2E7D32',
  },
  FAILED: {
    label: 'Failed',
    bg: '#FDECEA',
    color: '#D32F2F',
  },
  PENDING: {
    label: 'Pending',
    bg: '#FFF8E1',
    color: '#F9A825',
  },
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

export const RecentActivityTable = () => {
  const { data, isLoading } = useGetTransactions({ page: 1, limit: 6 });


  return (
    <DataTable
      columns={columns}
      rows={data?.transactions ?? []}
      loading={isLoading}
      skeletonRows={6}
      getRowKey={(row) => row.id}
      emptyMessage='No transactions yet'
    />
  );
};
