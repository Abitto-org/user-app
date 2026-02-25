import { type ReactNode } from 'react';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export interface DataTableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Header label displayed in the table head */
  header: string;
  /** Render the cell content for a given row */
  render: (row: T, index: number) => ReactNode;
  /** Optional: bold the cell value (desktop only) */
  bold?: boolean;
  /** Optional: skeleton width when loading (default 80) */
  skeletonWidth?: number;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Optional key extractor for row keys (defaults to index) */
  getRowKey?: (row: T, index: number) => string | number;
  /** Optional empty state message */
  emptyMessage?: string;
  /** Show skeleton loading state */
  loading?: boolean;
  /** Number of skeleton rows to show (default 5) */
  skeletonRows?: number;
}

// ── Skeleton loaders ──

function DesktopSkeleton<T>({
  columns,
  skeletonRows,
}: {
  columns: DataTableColumn<T>[];
  skeletonRows: number;
}) {
  return (
    <Box bgcolor='white' borderRadius={2} border='1px solid #E4E7EC' overflow='hidden'>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell
                key={col.key}
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#111',
                  borderRight:
                    idx !== columns.length - 1 ? '1px solid #EAEAEA' : undefined,
                  bgcolor: '#FAFAFA',
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {columns.map((col, colIdx) => (
                <TableCell
                  key={col.key}
                  sx={{
                    borderRight:
                      colIdx !== columns.length - 1
                        ? '1px solid #EAEAEA'
                        : undefined,
                  }}
                >
                  <Skeleton
                    variant='text'
                    width={col.skeletonWidth ?? 80}
                    height={20}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function MobileSkeleton<T>({
  columns,
  skeletonRows,
}: {
  columns: DataTableColumn<T>[];
  skeletonRows: number;
}) {
  return (
    <Box display='flex' flexDirection='column' gap={2}>
      {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
        <Box
          key={rowIdx}
          bgcolor='white'
          borderRadius={2}
          border='1px solid #E4E7EC'
          p={2}
        >
          {columns.map((col) => (
            <Box
              key={col.key}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              py={1}
            >
              <Typography variant='body2' color='#888' fontWeight={600}>
                {col.header}
              </Typography>
              <Skeleton
                variant='text'
                width={col.skeletonWidth ?? 80}
                height={18}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

// ── Mobile card view ──

function MobileCards<T>({
  columns,
  rows,
  getRowKey,
}: Pick<DataTableProps<T>, 'columns' | 'rows' | 'getRowKey'>) {
  return (
    <Box display='flex' flexDirection='column' gap={2}>
      {rows.map((row, index) => (
        <Box
          key={getRowKey?.(row, index) ?? index}
          bgcolor='white'
          borderRadius={2}
          border='1px solid #E4E7EC'
          p={2}
        >
          {columns.map((col) => (
            <Box
              key={col.key}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              py={1}
            >
              <Typography variant='body2' color='#888' fontWeight={600}>
                {col.header}
              </Typography>
              <Typography
                variant='body2'
                fontWeight={col.bold ? 600 : 400}
                component='div'
              >
                {col.render(row, index)}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

// ── Desktop table view ──

function DesktopTable<T>({
  columns,
  rows,
  getRowKey,
}: Pick<DataTableProps<T>, 'columns' | 'rows' | 'getRowKey'>) {
  return (
    <Box bgcolor='white' borderRadius={2} border='1px solid #E4E7EC' overflow='hidden'>
      <Table sx={{ overflow: 'hidden !important' }}>
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell
                key={col.key}
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#344054',
                  borderRight:
                    idx !== columns.length - 1 ? '1px solid #EAEAEA' : undefined,
                  bgcolor: '#F9FAFB',
                  py: 1.25,
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={getRowKey?.(row, rowIndex) ?? rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell
                  key={col.key}
                  sx={{
                    fontWeight: col.bold ? 600 : undefined,
                    color: '#101828',
                    fontSize: 13.5,
                    py: 1.35,
                    borderRight:
                      colIndex !== columns.length - 1
                        ? '1px solid #EAEAEA'
                        : undefined,
                  }}
                >
                  {col.render(row, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

// ── Main component ──

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'No data available',
  loading = false,
  skeletonRows = 5,
}: DataTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return isMobile ? (
      <MobileSkeleton columns={columns} skeletonRows={skeletonRows} />
    ) : (
      <DesktopSkeleton columns={columns} skeletonRows={skeletonRows} />
    );
  }

  if (rows.length === 0) {
    return (
      <Box
        bgcolor='white'
        borderRadius={2}
        border='1px solid #E4E7EC'
        p={3.5}
        textAlign='center'
        display='flex'
        flexDirection='column'
        alignItems='center'
        gap={1}
      >
        <InboxOutlinedIcon sx={{ color: '#98A2B3', fontSize: 28 }} />
        <Typography color='text.secondary'>{emptyMessage}</Typography>
      </Box>
    );
  }

  return isMobile ? (
    <MobileCards columns={columns} rows={rows} getRowKey={getRowKey} />
  ) : (
    <DesktopTable columns={columns} rows={rows} getRowKey={getRowKey} />
  );
}
