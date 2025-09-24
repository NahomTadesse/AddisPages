"use client";
import { useEffect, useState } from 'react';
import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Box,
  LoadingOverlay,
  UnstyledButton,
  Title,
  ActionIcon,
  Button,
  Menu,
  Pagination,
  Modal,
  Paper,
  Stack,
  Divider,
  Badge
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
  IconRefresh,
  IconTrash,
  IconCheck,
  IconDotsVertical,
  IconEye
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { authenticatedFetch, BOOKS_API_BASE_URL } from '../../app/services/baseApiService';
import Cookies from 'js-cookie';
import classes from '../../components/UserTable/TableSort.module.css';

// Th component for sortable table headers
function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th} style={{ padding: '8px 8px' }}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" gap="xs">
          <Text fw={500} fz="sm" style={{ whiteSpace: 'nowrap' }}>
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

// Filter data based on search query
function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) => {
      const value = item[key];
      if (key === 'orderItemIds') return false; // Exclude orderItemIds from search
      return value && value.toString().toLowerCase().includes(query);
    })
  );
}

// Sort data based on sortBy and direction
function sortData(data, payload) {
  const { sortBy, reversed } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'totalAmount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (reversed) {
        return bValue < aValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    }),
    payload.search
  );
}

// Pagination component
function OrdersPagination({ total, currentPage, onPageChange, loading }) {
  if (total <= 7) return null;

  return (
    <Group justify="center" mt="lg" mb="md">
      <Pagination
        total={Math.ceil(total / 7)}
        value={currentPage}
        onChange={onPageChange}
        disabled={loading}
        withControls
        size="sm"
        radius="md"
        styles={{
          control: {
            '&[dataActive]': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
          },
        }}
      />
    </Group>
  );
}

export default function BookingTable() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [viewModal, { open: openView, close: closeView }] = useDisclosure(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const userD = JSON.parse(Cookies.get('userData') || '{}');

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Fetch orders on mount
  useEffect(() => {
    console.log('📦 Orders page initialized, fetching data...');
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    console.log('🔄 Starting orders fetch...');

    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/order`, {
        headers: {
          Authorization: userD.access_token,
        },
      });
      console.log('📥 Orders fetch response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Orders fetch failed:', { status: response.status, error: errorText });
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
      }

      const fetchedData = await response.json();
      console.log('✅ Orders fetched successfully:', fetchedData);

      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setSortedData(fetchedData);
        console.log(`📊 Loaded ${fetchedData.length} orders`);
      } else {
        console.warn('⚠️ Expected array but got:', fetchedData);
        setData([]);
        setSortedData([]);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('💥 Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const paginatedData = () => {
    const startIndex = (currentPage - 1) * 7;
    const endIndex = startIndex + 7;
    return sortedData.slice(startIndex, endIndex);
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered for orders');
    fetchOrders();
  };

  const handleDelete = (orderId, orderUniqueId) => {
    console.log('🗑️ Delete order:', orderId);
    setDeleteOrderId(orderId);
    setNotification({ message: `Delete order #${orderUniqueId}?`, type: 'warning' });
    openDelete();
  };

  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    setDeleteLoading(true);
    console.log('🗑️ Confirming order deletion:', deleteOrderId);

    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/order/${deleteOrderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: userD.access_token,
        },
      });

      console.log('📥 Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to delete order: ${response.status} - ${errorText}`);
      }

      console.log('✅ Order deleted successfully');
      setNotification({ message: 'Order deleted successfully!', type: 'success' });
      closeDelete();
      setCurrentPage(1);
      fetchOrders();
    } catch (error) {
      console.error('💥 Delete error:', error);
      setNotification({ message: `Error deleting order: ${error.message}`, type: 'error' });
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setStatusLoading(true);
    console.log(`🔄 Updating order ${orderId} to status: ${status}`);

    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/order/${orderId}/status/${status.toLowerCase()}`, {
        method: 'PUT',
        headers: {
          Authorization: userD.access_token,
        },
      });

      console.log('📥 Status update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Status update failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to update order status: ${response.status} - ${errorText}`);
      }

      console.log('✅ Order status updated successfully');
      setNotification({ message: `Order status updated to ${status}!`, type: 'success' });
      fetchOrders();
    } catch (error) {
      console.error('💥 Status update error:', error);
      setNotification({ message: `Error updating order status: ${error.message}`, type: 'error' });
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setStatusLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    console.log('👁️ Opening order details modal:', order.id);
    setViewingOrder(order);
    openView();
  };

  const paginatedRows = paginatedData().map((row) => (
    <Table.Tr key={row.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          #{row.orderUniqueId || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.userId || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.phoneNO || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.location || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.orderDate ? new Date(row.orderDate).toLocaleDateString() : 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle', textAlign: 'right' }}>
        <Text fz="sm" c="dark" fw={500} style={{ margin: 0 }}>
          {row.totalAmount ? `$${parseFloat(row.totalAmount).toFixed(2)}` : 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Badge
          size="sm"
          variant="light"
          color={
            row.orderStatus === 'DELIVERED' ? 'green' :
            row.orderStatus === 'PROCESSING' ? 'blue' :
            row.orderStatus === 'CANCELLED' ? 'red' : 'gray'
          }
          style={{ fontSize: '12px' }}
        >
          {row.orderStatus || 'N/A'}
        </Badge>
      </Table.Td>
      <Table.Td style={{ padding: '8px 4px', verticalAlign: 'middle', width: '80px' }}>
        <Center>
          <Menu shadow="md" width={140} position="left-start" withArrow>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                style={{
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <Menu.Item
                leftSection={<IconEye size={14} color="#64748b" />}
                onClick={() => handleViewDetails(row)}
                styles={{
                  item: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                    },
                  },
                  leftSection: {
                    marginRight: '8px',
                  },
                }}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCheck size={14} color="#16a34a" />}
                onClick={() => handleStatusChange(row.id, 'Delivered')}
                styles={{
                  item: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                    },
                  },
                  leftSection: {
                    marginRight: '8px',
                  },
                }}
              >
                Mark Delivered
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCheck size={14} color="#3b82f6" />}
                onClick={() => handleStatusChange(row.id, 'Processing')}
                styles={{
                  item: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                    },
                  },
                  leftSection: {
                    marginRight: '8px',
                  },
                }}
              >
                Mark Processing
              </Menu.Item>
              <Menu.Item
                leftSection={<IconCheck size={14} color="#ef4444" />}
                onClick={() => handleStatusChange(row.id, 'Cancelled')}
                styles={{
                  item: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                    },
                  },
                  leftSection: {
                    marginRight: '8px',
                  },
                }}
              >
                Mark Cancelled
              </Menu.Item>
              <Divider style={{ margin: '4px 0' }} />
              <Menu.Item
                leftSection={<IconTrash size={14} color="#ef4444" />}
                color="red"
                onClick={() => handleDelete(row.id, row.orderUniqueId)}
                styles={{
                  item: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#dc2626',
                    '&:hover': {
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                    },
                  },
                  leftSection: {
                    marginRight: '8px',
                  },
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Center>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box pos="relative" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />

      {/* Header Section */}
      <Box style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 32px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <Group justify="apart" align="center">
          <div>
            <Title order={1} style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: 700 }}>
              Orders
            </Title>
            <Text c="dimmed" size="sm" style={{ marginTop: '4px' }}>
              Manage your orders ({data.length} total)
            </Text>
          </div>
          <Group gap="md">
            <ActionIcon
              size="lg"
              variant="light"
              color="blue"
              onClick={handleRefresh}
              title="Refresh"
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px'
              }}
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      {/* Search Section */}
      <Box style={{
        backgroundColor: 'white',
        padding: '20px 32px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        <TextInput
          placeholder="Search orders by order ID, phone, location, date, amount, status..."
          value={search}
          onChange={handleSearchChange}
          size="md"
          radius="md"
          leftSection={
            <IconSearch size={16} style={{ color: '#94a3b8' }} />
          }
          styles={{
            input: {
              border: '1px solid #e2e8f0',
              paddingLeft: '44px',
              height: '44px',
              fontSize: '14px',
              '&:focus': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 1px #3b82f6',
              },
            },
            section: {
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
          style={{ maxWidth: '480px', width: '100%' }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Paper style={{
          margin: '0 32px 24px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <Group justify="apart">
            <Text c="red" size="sm" fw={500}>
              <IconTrash size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Failed to load orders
            </Text>
            <Button
              size="xs"
              variant="subtle"
              color="red"
              onClick={fetchOrders}
              leftSection={<IconRefresh size={12} />}
              styles={{
                root: {
                  height: '28px',
                  padding: '0 12px',
                  borderRadius: '6px',
                },
              }}
            >
              Retry
            </Button>
          </Group>
          <Text c="red" size="xs" mt="xs">
            {error}
          </Text>
        </Paper>
      )}

      {/* Main Content */}
      <ScrollArea style={{ height: 'calc(100vh - 200px)' }}>
        <Paper style={{
          margin: '0 32px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          <Table
            horizontalSpacing="0"
            verticalSpacing="0"
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: '14px'
            }}
          >
            <Table.Thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <Table.Tr>
                <Th
                  sorted={sortBy === 'orderUniqueId'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('orderUniqueId')}
                  style={{ width: '150px', paddingLeft: '16px' }}
                >
                  Order ID
                </Th>
                <Th
                  sorted={sortBy === 'userId'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('userId')}
                  style={{ width: '200px' }}
                >
                  User ID
                </Th>
                <Th
                  sorted={sortBy === 'phoneNO'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('phoneNO')}
                  style={{ width: '150px' }}
                >
                  Phone Number
                </Th>
                <Th
                  sorted={sortBy === 'location'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('location')}
                  style={{ width: '150px' }}
                >
                  Location
                </Th>
                <Th
                  sorted={sortBy === 'orderDate'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('orderDate')}
                  style={{ width: '120px' }}
                >
                  Date
                </Th>
                <Th
                  sorted={sortBy === 'totalAmount'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('totalAmount')}
                  style={{ width: '100px', textAlign: 'right' }}
                >
                  Amount
                </Th>
                <Th
                  sorted={sortBy === 'orderStatus'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('orderStatus')}
                  style={{ width: '120px' }}
                >
                  Status
                </Th>
                <Th style={{ width: '80px', textAlign: 'center' }}>
                  Actions
                </Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows
              ) : (
                <Table.Tr>
                  <Table.Td
                    colSpan={8}
                    style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      border: 'none'
                    }}
                  >
                    <Stack align="center" gap="md">
                      {search ? (
                        <>
                          <ActionIcon size="lg" variant="light" color="gray" radius="xl" style={{ width: '80px', height: '80px' }}>
                            <IconSearch size={32} />
                          </ActionIcon>
                          <div>
                            <Text fw={600} size="lg" c="dark" style={{ marginBottom: '8px' }}>
                              No orders found
                            </Text>
                            <Text c="dimmed" size="sm">
                              Try adjusting your search terms or clear the search to see all orders.
                            </Text>
                          </div>
                          <Button
                            variant="light"
                            color="blue"
                            leftSection={<IconSearch size={14} />}
                            onClick={() => setSearch('')}
                            size="sm"
                          >
                            Clear Search
                          </Button>
                        </>
                      ) : (
                        <>
                          <ActionIcon size="lg" variant="light" color="gray" radius="xl" style={{ width: '80px', height: '80px' }}>
                            <IconCheck size={32} />
                          </ActionIcon>
                          <div>
                            <Text fw={600} size="lg" c="dark" style={{ marginBottom: '8px' }}>
                              No orders yet
                            </Text>
                            <Text c="dimmed" size="sm">
                              No orders available to display.
                            </Text>
                          </div>
                        </>
                      )}
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Pagination */}
        <OrdersPagination
          total={sortedData.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </ScrollArea>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModal}
        onClose={closeDelete}
        title="Delete Order"
        centered
        size="sm"
        withCloseButton
        radius="md"
        styles={{
          header: {
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '16px',
            marginBottom: '16px'
          },
          content: {
            padding: '24px'
          }
        }}
      >
        <Stack gap="md">
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <IconTrash size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
              Are you sure you want to delete this order?
              <br />
              <strong style={{ color: 'dark' }}>#{deleteOrderId}</strong>
              <br />
              This action cannot be undone.
            </Text>
          </div>
          <Group justify="flex-end" gap="md" mt="md">
            <Button
              variant="outline"
              onClick={closeDelete}
              disabled={deleteLoading}
              size="sm"
              radius="md"
              style={{ minWidth: '80px' }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={confirmDelete}
              loading={deleteLoading}
              disabled={deleteLoading}
              size="sm"
              radius="md"
              style={{ minWidth: '80px' }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Order Modal */}
      <Modal
        opened={viewModal}
        onClose={closeView}
        title="Order Details"
        size="lg"
        withCloseButton
        radius="md"
        styles={{
          header: {
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '16px',
            marginBottom: '16px'
          },
          content: {
            padding: '24px'
          }
        }}
      >
        {viewingOrder && (
          <Stack gap="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text size="sm" fw={500} c="dimmed">Order ID</Text>
                <Text>#{viewingOrder.orderUniqueId || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Internal ID</Text>
                <Text>{viewingOrder.id || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">User ID</Text>
                <Text>{viewingOrder.userId || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Phone Number</Text>
                <Text>{viewingOrder.phoneNO || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Location</Text>
                <Text>{viewingOrder.location || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Order Date</Text>
                <Text>{viewingOrder.orderDate ? new Date(viewingOrder.orderDate).toLocaleString() : 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Total Amount</Text>
                <Text>{viewingOrder.totalAmount ? `$${parseFloat(viewingOrder.totalAmount).toFixed(2)}` : 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Status</Text>
                <Text>{viewingOrder.orderStatus || 'N/A'}</Text>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Text size="sm" fw={500} c="dimmed">Order Item IDs</Text>
                <Text>{viewingOrder.orderItemIds?.length > 0 ? viewingOrder.orderItemIds.join(', ') : 'None'}</Text>
              </div>
            </div>
            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={closeView}
                size="md"
                radius="md"
                style={{ minWidth: '100px' }}
              >
                Close
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Success/Error Notification */}
      {notification.message && (
        <Paper
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            border: '1px solid transparent',
            backgroundColor: notification.type === 'success' ? '#f0fdf4' : notification.type === 'error' ? '#fef2f2' : '#fefce8',
            borderColor: notification.type === 'success' ? '#bbf7d0' : notification.type === 'error' ? '#fecaca' : '#fef08a'
          }}
        >
          <Group justify="apart" align="center" style={{ padding: '16px 20px' }}>
            <Group gap="xs">
              {notification.type === 'success' && <IconCheck size={18} color="#16a34a" />}
              {notification.type === 'error' && <IconTrash size={18} color="#dc2626" />}
              {notification.type === 'warning' && <IconEye size={18} color="#d97706" />}
              <Text size="sm" fw={500} style={{
                color: notification.type === 'success' ? '#166534' : notification.type === 'error' ? '#991b1b' : '#92400e'
              }}>
                {notification.message}
              </Text>
            </Group>
            <ActionIcon
              variant="transparent"
              onClick={() => setNotification({ message: '', type: '' })}
              size="sm"
              style={{ color: '#6b7280' }}
            >
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      )}
    </Box>
  );
}