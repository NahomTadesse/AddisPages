"use client";
import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector, IconRefresh, IconPlus, IconEdit, IconTrash, IconDotsVertical, IconEye, IconBookOpen } from '@tabler/icons-react';
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
  Alert,
  Menu,
  Pagination,
  Modal,
  TextInput as MantineTextInput,
  Select,
  Paper,
  Badge,
  Avatar,
  Stack,
  Divider
} from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../services/baseApiService';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import classes from './TableSort.module.css';
import { IconBook  } from '@tabler/icons-react';

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th} style={{ padding: '12px 8px' }}>
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

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) => {
      const value = item[key];
      if (key === 'address' && typeof value === 'object') {
        return Object.values(value).some((addressValue) =>
          addressValue && addressValue.toString().toLowerCase().includes(query)
        );
      }
      return value && value.toString().toLowerCase().includes(query);
    })
  );
}

function sortData(data, payload) {
  const { sortBy, reversed } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'address' && typeof aValue === 'object') {
        aValue = aValue.currentAddress || aValue.permanentAddress || '';
        bValue = bValue.currentAddress || bValue.permanentAddress || '';
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
function PublishersPagination({ total, currentPage, onPageChange, loading }) {
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

export default function PublishersTable() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [deletePublisherId, setDeletePublisherId] = useState(null);
  const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
    console.log('🏢 Publishers page loaded, setting up navigation...');
    setNavigation((path) => {
      console.log('📍 Publishers navigation to:', path);
      router.push(path);
    });
  }, [router]);

  useEffect(() => {
    console.log('🏢 Publishers page initialized, fetching data...');
    fetchPublishers();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchPublishers = async () => {
    setLoading(true);
    setError(null);
    console.log('🔄 Starting publishers fetch...');
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`);
      console.log('📥 Publishers fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Publishers fetch failed:', { status: response.status, error: errorText });
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch publishers: ${response.status} - ${errorText}`);
      }

      const fetchedData = await response.json();
      console.log('✅ Publishers fetched successfully:', fetchedData);
      
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setSortedData(fetchedData);
        console.log(`📊 Loaded ${fetchedData.length} publishers`);
      } else {
        console.warn('⚠️ Expected array but got:', fetchedData);
        setData([]);
        setSortedData([]);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('💥 Error fetching publishers:', error);
      setError(error.message || 'Failed to fetch publishers');
      
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
    console.log('🔄 Manual refresh triggered for publishers');
    fetchPublishers();
  };

  const handleCreateNew = () => {
    console.log('➕ Navigate to create publisher');
    router.push('/publishers/create');
  };

  const handleViewDetails = (publisherId) => {
    console.log('👁️ Navigate to publisher details:', publisherId);
    router.push(`/publishers/${publisherId}`);
  };

  const handleEdit = (publisher) => {
    console.log('✏️ Edit publisher:', publisher.id);
    setEditingPublisher({
      ...publisher,
      currentAddress: publisher.address?.currentAddress || '',
      permanentAddress: publisher.address?.permanentAddress || '',
      phoneNumber: publisher.address?.phoneNumber || '',
      email: publisher.address?.email || '',
      idDocumentUrl: publisher.address?.idDocumentUrl || '',
      addressType: publisher.address?.addressType || ''
    });
    openEdit();
  };

  const handleDelete = (publisherId, publisherName) => {
    console.log('🗑️ Delete publisher:', publisherId);
    setDeletePublisherId(publisherId);
    setNotification({ message: `Delete "${publisherName}"?`, type: 'warning' });
    openDelete();
  };

  const confirmDelete = async () => {
    if (!deletePublisherId) return;
    
    setDeleteLoading(true);
    console.log('🗑️ Confirming publisher deletion:', deletePublisherId);
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher/${deletePublisherId}`, {
        method: 'DELETE',
      });
      
      console.log('📥 Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to delete publisher: ${response.status} - ${errorText}`);
      }
      
      console.log('✅ Publisher deleted successfully');
      setNotification({ message: 'Publisher deleted successfully!', type: 'success' });
      closeDelete();
      setCurrentPage(1);
      fetchPublishers(); // Refresh the list
    } catch (error) {
      console.error('💥 Delete error:', error);
      setNotification({ message: `Error deleting publisher: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPublisher) return;
    
    setUpdateLoading(true);
    console.log('✏️ Updating publisher:', editingPublisher.id);
    
    const updateData = {
      id: editingPublisher.id,
      name: editingPublisher.name.trim(),
      address: {
        id: editingPublisher.address?.id || '',
        currentAddress: editingPublisher.currentAddress.trim(),
        permanentAddress: editingPublisher.permanentAddress.trim() || '',
        phoneNumber: editingPublisher.phoneNumber.trim(),
        email: editingPublisher.email.trim(),
        idDocumentUrl: editingPublisher.idDocumentUrl.trim() || '',
        addressType: editingPublisher.addressType,
      }
    };
    
    console.log('📋 Update data:', updateData);
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher/${editingPublisher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      console.log('📥 Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to update publisher: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Publisher updated successfully:', data);
      setNotification({ message: `Publisher "${editingPublisher.name}" updated successfully!`, type: 'success' });
      closeEdit();
      setEditingPublisher(null);
      setCurrentPage(1);
      fetchPublishers(); // Refresh the list
    } catch (error) {
      console.error('💥 Update error:', error);
      setNotification({ message: `Error updating publisher: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPublisher(null);
    closeEdit();
  };

  const handleInputChange = (field, value) => {
    setEditingPublisher(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressInputChange = (addressField, value) => {
    setEditingPublisher(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [addressField]: value
      }
    }));
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return 'N/A';
    
    const parts = [];
    if (address.currentAddress) parts.push(address.currentAddress);
    if (address.permanentAddress) parts.push(`(${address.permanentAddress})`);
    if (address.phoneNumber) parts.push(address.phoneNumber);
    if (address.email) parts.push(address.email);
    
    return parts.length > 0 ? parts.join(' | ') : 'N/A';
  };

  const paginatedRows = paginatedData().map((row) => (
    <Table.Tr key={row.id || Math.random()} style={{ borderBottom: '1px solid #e0e0e0' }}>
      <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
        <Group gap="xs" wrap="nowrap">
          <Avatar 
            size={32} 
            radius="xl" 
            color="blue" 
            style={{ 
              backgroundColor: '#e3f2fd',
              border: '1px solid #bbdefb'
            }}
          >
            <IconBook size={16} stroke={1.5} />
          </Avatar>
          <div style={{ lineHeight: 1.2 }}>
            <Text fw={600} fz="sm" c="dark" style={{ margin: 0 }}>
              {row.name || 'N/A'}
            </Text>
            <Text fz="xs" c="dimmed" style={{ margin: 0 }}>
              {row.address?.addressType ? row.address.addressType.charAt(0).toUpperCase() + row.address.addressType.slice(1) : 'Business'}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', maxWidth: '250px' }}>
        <div style={{ lineHeight: 1.4 }}>
          <Text fz="sm" c="dark" style={{ margin: 0, wordBreak: 'break-word' }}>
            {row.address?.currentAddress || 'N/A'}
          </Text>
          {row.address?.permanentAddress && (
            <Text fz="xs" c="dimmed" style={{ margin: '2px 0 0 0' }}>
              {row.address.permanentAddress}
            </Text>
          )}
        </div>
      </Table.Td>
      <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', width: '120px' }}>
        <Text fz="sm" c="dark" style={{ 
          margin: 0, 
          wordBreak: 'break-all',
          color: row.address?.phoneNumber ? '#1976d2' : 'dimmed'
        }}>
          {row.address?.phoneNumber || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', width: '180px' }}>
        <Text fz="sm" c={row.address?.email ? 'dark' : 'dimmed'} style={{ 
          margin: 0, 
          wordBreak: 'break-all',
          color: row.address?.email ? '#1976d2' : 'dimmed'
        }}>
          {row.address?.email || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '12px 4px', verticalAlign: 'middle', width: '80px' }}>
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
                onClick={() => handleViewDetails(row.id)}
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
                leftSection={<IconEdit size={14} color="#64748b" />}
                onClick={() => handleEdit(row)}
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
                Edit
              </Menu.Item>
              <Divider style={{ margin: '4px 0' }} />
              <Menu.Item 
                leftSection={<IconTrash size={14} color="#ef4444" />}
                color="red"
                onClick={() => handleDelete(row.id, row.name)}
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

  // Update form
  const addressTypes = [
    { value: 'business', label: 'Business' },
    { value: 'residential', label: 'Residential' },
    { value: 'p_o_box', label: 'P.O. Box' },
  ];

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
              Publishers
            </Title>
            <Text c="dimmed" size="sm" style={{ marginTop: '4px' }}>
              Manage your publishing partners ({data.length} total)
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
            <Button 
              leftSection={<IconPlus size={18} />}
              onClick={handleCreateNew}
              size="md"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                height: '40px',
                fontWeight: 600,
                padding: '0 20px',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
              }}
            >
              Add Publisher
            </Button>
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
          placeholder="Search publishers by name, address, email, or phone..."
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
              Failed to load publishers
            </Text>
            <Button 
              size="xs" 
              variant="subtle" 
              color="red"
              onClick={fetchPublishers}
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
                  sorted={sortBy === 'name'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('name')}
                  style={{ width: '300px', paddingLeft: '16px' }}
                >
                  Publisher Name
                </Th>
                <Th 
                  sorted={sortBy === 'address'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('address')}
                  style={{ width: '300px' }}
                >
                  Address
                </Th>
                <Th style={{ width: '140px', textAlign: 'center' }}>
                  Contact
                </Th>
                <Th style={{ width: '180px' }}>
                  Email
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
                    colSpan={5} 
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
                              No publishers found
                            </Text>
                            <Text c="dimmed" size="sm">
                              Try adjusting your search terms or clear the search to see all publishers.
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
                            {/* <IconBookOpen size={32} /> */}
                          </ActionIcon>
                          <div>
                            <Text fw={600} size="lg" c="dark" style={{ marginBottom: '8px' }}>
                              No publishers yet
                            </Text>
                            <Text c="dimmed" size="sm">
                              Get started by adding your first publishing partner.
                            </Text>
                          </div>
                          <Button 
                            leftSection={<IconPlus size={14} />}
                            onClick={handleCreateNew}
                            size="sm"
                            color="blue"
                          >
                            Add First Publisher
                          </Button>
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
        <PublishersPagination 
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
        title="Delete Publisher"
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
              Are you sure you want to delete this publisher? 
              <br />
              <strong style={{ color: 'dark' }}>{deletePublisherId}</strong> 
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

      {/* Edit Publisher Modal */}
     <Modal
  opened={editModal}
  onClose={handleCancelEdit}
  title={`Edit Publisher`}
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
  {editingPublisher && (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
      <Stack gap="md">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              Publisher Name *
            </Text>
            <MantineTextInput
              id="publisherName"
              value={editingPublisher.name || ''}
              onChange={(e) => handleInputChange('name', e.currentTarget.value)}
              placeholder="Enter publisher name"
              size="md"
              radius="md"
              required
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              Phone Number *
            </Text>
            <MantineTextInput
              id="phoneNumber"
              value={editingPublisher.phoneNumber || ''}
              onChange={(e) => handleAddressInputChange('phoneNumber', e.currentTarget.value)}
              placeholder="+251 9XX XXX XXX"
              size="md"
              radius="md"
              required
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              Email Address *
            </Text>
            <MantineTextInput
              id="email"
              type="email"
              value={editingPublisher.email || ''}
              onChange={(e) => handleAddressInputChange('email', e.currentTarget.value)}
              placeholder="publisher@example.com"
              size="md"
              radius="md"
              required
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              Address Type *
            </Text>
            <Select
              value={editingPublisher.addressType || ''}
              onChange={(value) => handleAddressInputChange('addressType', value)}
              placeholder="Select address type"
              size="md"
              radius="md"
              data={addressTypes}
              required
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              Current Address *
            </Text>
            <MantineTextInput
              id="currentAddress"
              value={editingPublisher.currentAddress || ''}
              onChange={(e) => handleAddressInputChange('currentAddress', e.currentTarget.value)}
              placeholder="Enter current business address"
              size="md"
              radius="md"
              required
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  minHeight: '44px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              Permanent Address
            </Text>
            <MantineTextInput
              id="permanentAddress"
              value={editingPublisher.permanentAddress || ''}
              onChange={(e) => handleAddressInputChange('permanentAddress', e.currentTarget.value)}
              placeholder="Enter permanent address (optional)"
              size="md"
              radius="md"
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
              ID Document URL
            </Text>
            <MantineTextInput
              id="idDocumentUrl"
              value={editingPublisher.idDocumentUrl || ''}
              onChange={(e) => handleAddressInputChange('idDocumentUrl', e.currentTarget.value)}
              placeholder="Enter business license URL (optional)"
              size="md"
              radius="md"
              disabled={updateLoading}
              styles={{
                input: {
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  '&:focus': {
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <Divider style={{ margin: '24px 0' }} />
        
        <Group justify="flex-end" gap="md">
          <Button 
            variant="outline" 
            onClick={handleCancelEdit}
            disabled={updateLoading}
            size="md"
            radius="md"
            style={{ 
              minWidth: '100px',
              border: '1px solid #d1d5db',
              height: '40px'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            leftSection={<IconEdit size={16} />}
            loading={updateLoading}
            disabled={updateLoading}
            size="md"
            radius="md"
            style={{ 
              minWidth: '140px',
              backgroundColor: '#3b82f6',
              color: 'white',
              height: '40px',
              fontWeight: 600
            }}
          >
            {updateLoading ? 'Updating...' : 'Update Publisher'}
          </Button>
        </Group>
      </Stack>
    </Box>
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
              {notification.type === 'success' && <IconBook size={18} color="#16a34a" />}
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