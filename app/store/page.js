


"use client";
import { useEffect, useState } from 'react';
import { 
  IconChevronDown, 
  IconChevronUp, 
  IconSearch, 
  IconSelector, 
  IconRefresh, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconDotsVertical, 
  IconEye, 
  IconBuilding,
  IconWriting,
  IconUser
} from '@tabler/icons-react';
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
  Textarea,
  Paper,
  Avatar,
  Stack,
  Divider,
  Badge,
  Notification
} from '@mantine/core';
import { authenticatedFetch, setNavigation } from '../../app/services/baseApiService';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import classes from './TableSort.module.css';
import Cookies from 'js-cookie';
// Function to sanitize input to prevent script injection and HTML tags
const sanitizeInput = (input) => {
  if (!input) return input;
  return input
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+="[^"]*"/gi, ''); // Remove event attributes
};

// Function to validate if input contains HTML or JavaScript
const containsHtmlOrJs = (input) => {
  if (!input) return false;
  const htmlJsRegex = /<|>|\bon\w+=|javascript:/i;
  return htmlJsRegex.test(input);
};

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

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) => {
      const value = item[key];
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
      
      if (reversed) {
        return bValue < aValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    }),
    payload.search
  );
}

// Pagination component
function StoresPagination({ total, currentPage, onPageChange, loading }) {
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

export default function StoresTable() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStore, setEditingStore] = useState(null);
  const [addingStore, setAddingStore] = useState(false);
  const [viewingStore, setViewingStore] = useState(null);
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [viewModal, { open: openView, close: closeView }] = useDisclosure(false);
  const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [addModal, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [deleteStoreId, setDeleteStoreId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const router = useRouter();

   const [userRole, setUserRole] = useState();


   useEffect(() => {
    const authData = Cookies.get('auth_data');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        setUserRole(parsedData.role || null);
      } catch (err) {
        console.error('Error parsing auth data:', err);
        router.push('/'); // Redirect if invalid
      }
    } else {
      router.push('/'); // Redirect if no auth
    }
    setLoading(false);
  }, [router]);


  useEffect(() => {
 
    if (userRole === 'ADMIN' && !loading) {
      fetchStores();
    }
    else{
      // router.push('stat');
    }
  }, [userRole]); 

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(`https://books-api.addispages.com/api/stores`);
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          router.push('/login');
          return;
        }
        throw new Error(`Failed to fetch stores: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      const fetchedData = responseData.data;
      
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setSortedData(fetchedData);
      } else {
        setData([]);
        setSortedData([]);
        setError('Invalid response format from server: data is not an array');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };
  
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
    fetchStores();
  };

  const handleCreateNew = () => {
    setAddingStore(true);
    setEditingStore({
      firstName: '',
      email: '',
      phoneNumber: '',
      userName: '',
      role: 'STORE',
      status: 'ACTIVE',
      password: '',
      contactPhoneNumber: '',
      contactPersonName: '',
      storeDescription: '',
      storeName: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        region: '',
        subcity: '',
        additionalInfo: '',
        zipCode: '',
        zone: '',
        woreda: '',
        kebele: '',
        district: '',
        houseNumber: '',
        addressType: 'BUSINESS_ADDRESS'
      },
      lastName: '',
      customerId: ''
    });
    openAdd();
  };

  const handleViewDetails = (store) => {
    setViewingStore(store);
    openView();
  };

  const handleEdit = (store) => {
    setAddingStore(false);
    setEditingStore({
      id: store.id,
      firstName: store.firstName || '',
      email: store.email || '',
      phoneNumber: store.phoneNumber || '',
      userName: store.userName || '',
      role: store.role || 'STORE',
      status: store.status || 'ACTIVE',
      password: '',
      contactPhoneNumber: store.contactPhoneNumber || '',
      contactPersonName: store.contactPersonName || '',
      storeDescription: store.storeDescription || '',
      storeName: store.storeName || '',
      address: {
        street: store.address?.street || '',
        city: store.address?.city || '',
        state: store.address?.state || '',
        country: store.address?.country || '',
        region: store.address?.region || '',
        subcity: store.address?.subcity || '',
        additionalInfo: store.address?.additionalInfo || '',
        zipCode: store.address?.zipCode || '',
        zone: store.address?.zone || '',
        woreda: store.address?.woreda || '',
        kebele: store.address?.kebele || '',
        district: store.address?.district || '',
        houseNumber: store.address?.houseNumber || '',
        addressType: store.address?.addressType || 'STORE_CONTACT'
      },
      lastName: store.lastName || '',
      customerId: store.customerId || ''
    });
    openEdit();
  };

  const handleDelete = (storeId, storeName) => {
    setDeleteStoreId(storeId);
    setNotification({ message: `Delete "${storeName}"?`, type: 'warning' });
    openDelete();
  };

  const confirmDelete = async () => {
    if (!deleteStoreId) return;
    
    setDeleteLoading(true);
    
    try {
      const response = await authenticatedFetch(`https://books-api.addispages.com/api/stores/${deleteStoreId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete store: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      
      setNotification({ 
        message: responseData.message || 'Store deleted successfully!', 
        type: 'success' 
      });
      closeDelete();
      setCurrentPage(1);
      fetchStores();
    } catch (error) {
      setNotification({ 
        message: `Error deleting store: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const validateForm = () => {
    if (!editingStore.storeName) {
      setNotification({ message: 'Store name is required.', type: 'error' });
      return false;
    }
    if (editingStore.storeName.length > 50) {
      setNotification({ message: 'Store name must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingStore.storeName)) {
      setNotification({ message: 'Store name cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingStore.storeDescription) {
      setNotification({ message: 'Description is required.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingStore.storeDescription)) {
      setNotification({ message: 'Description cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingStore.email) {
      setNotification({ message: 'Email is required.', type: 'error' });
      return false;
    }
    if (!editingStore.userName) {
      setNotification({ message: 'Username is required.', type: 'error' });
      return false;
    }
    if (addingStore && !editingStore.password) {
      setNotification({ message: 'Password is required for new users.', type: 'error' });
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!editingStore) return;
    
    if (!validateForm()) {
      return;
    }

    setUpdateLoading(true);

    const updateData = {
      firstName: sanitizeInput(editingStore.firstName),
      email: sanitizeInput(editingStore.email),
      phoneNumber: sanitizeInput(editingStore.phoneNumber),
      userName: sanitizeInput(editingStore.userName),
      role: editingStore.role,
      status: editingStore.status,
      contactPhoneNumber: sanitizeInput(editingStore.contactPhoneNumber),
      contactPersonName: sanitizeInput(editingStore.contactPersonName),
      storeDescription: sanitizeInput(editingStore.storeDescription),
      storeName: sanitizeInput(editingStore.storeName),
      address: {
        street: sanitizeInput(editingStore.address.street),
        city: sanitizeInput(editingStore.address.city),
        state: sanitizeInput(editingStore.address.state),
        country: sanitizeInput(editingStore.address.country),
        region: sanitizeInput(editingStore.address.region),
        subcity: sanitizeInput(editingStore.address.subcity),
        additionalInfo: sanitizeInput(editingStore.address.additionalInfo),
        zipCode: '',
        zone: '',
        woreda: '',
        kebele: '',
        district: '',
        houseNumber: '',
        addressType: editingStore.address.addressType
      },
      lastName: sanitizeInput(editingStore.lastName),
      customerId: ''
    };

    if (editingStore.password) {
      updateData.password = sanitizeInput(editingStore.password);
    }
    
    try {
      const response = await authenticatedFetch(`https://books-api.addispages.com/api/stores/${editingStore.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update store: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      
      setNotification({
        message: responseData.message || `Store "${sanitizeInput(editingStore.storeName)}" updated successfully!`,
        type: 'success'
      });
      closeEdit();
      setEditingStore(null);
      setCurrentPage(1);
      fetchStores();
    } catch (error) {
      setNotification({
        message: `Error updating store: ${error.message}`,
        type: 'error'
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!editingStore) return;
    
    if (!validateForm()) {
      return;
    }

    setAddLoading(true);

    const addData = {
      firstName: sanitizeInput(editingStore.firstName),
      email: sanitizeInput(editingStore.email),
      phoneNumber: sanitizeInput(editingStore.phoneNumber),
      userName: sanitizeInput(editingStore.userName),
      role: editingStore.role,
      status: editingStore.status,
      password: sanitizeInput(editingStore.password),
      contactPhoneNumber: sanitizeInput(editingStore.contactPhoneNumber),
      contactPersonName: sanitizeInput(editingStore.contactPersonName),
      storeDescription: sanitizeInput(editingStore.storeDescription),
      storeName: sanitizeInput(editingStore.storeName),
      address: {
        street: sanitizeInput(editingStore.address.street),
        city: sanitizeInput(editingStore.address.city),
        state: sanitizeInput(editingStore.address.state),
        country: sanitizeInput(editingStore.address.country),
        region: sanitizeInput(editingStore.address.region),
        subcity: sanitizeInput(editingStore.address.subcity),
        additionalInfo: sanitizeInput(editingStore.address.additionalInfo),
        zipCode: '',
        zone: '',
        woreda: '',
        kebele: '',
        district: '',
        houseNumber: '',
        addressType: editingStore.address.addressType
      },
      lastName: sanitizeInput(editingStore.lastName),
      customerId: ''
    };
    
    try {
      const response = await authenticatedFetch(`https://books-api.addispages.com/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(addData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add store: ${response.status} - ${errorText}`);
      }

      setNotification({
        message: `Store "${sanitizeInput(editingStore.storeName)}" added successfully!`,
        type: 'success'
      });
      closeAdd();
      setEditingStore(null);
      setAddingStore(false);
      setCurrentPage(1);
      fetchStores();
    } catch (error) {
      setNotification({
        message: `Error adding store: ${error.message}`,
        type: 'error'
      });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        return;
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStore(null);
    closeEdit();
  };

  const handleCancelAdd = () => {
    setEditingStore(null);
    setAddingStore(false);
    closeAdd();
  };

  const handleInputChange = (field, value) => {
    setEditingStore(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setEditingStore(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const paginatedRows = paginatedData().map((row) => (
    <Table.Tr key={row.id || Math.random()} style={{ borderBottom: '1px solid #e0e0e0' }}>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Group gap="xs" wrap="nowrap">
          <Avatar 
            size={28} 
            radius="xl" 
            color="indigo" 
            style={{ 
              backgroundColor: '#e8daf2',
              border: '1px solid #c084fc'
            }}
          >
            <IconBuilding size={14} stroke={1.5} />
          </Avatar>
          <div style={{ lineHeight: 1.2 }}>
            <Text fw={600} fz="sm" c="dark" style={{ margin: 0 }}>
              {row.name || 'N/A'}
            </Text>
            {row.storeDescription && (
              <Text fz="xs" c="dimmed" style={{ margin: 0 }}>
                {row.description.length > 50 ? `${row.description.substring(0, 50)}...` : row.description}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Badge 
          size="sm" 
          variant="light" 
          color="grape"
          style={{ fontSize: '12px' }}
        >
          {row.description || 'N/A'}
        </Badge>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.userName || 'N/A'}
        </Text>
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
                onClick={() => handleDelete(row.id, row.storeName)}
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
    <>
    {userRole === 'ADMIN' &&
  
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
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: 700 }}>
              Stores Inventory
            </Title>
            <Text c="dimmed" size="sm" style={{ marginTop: '4px' }}>
              Manage your stores ({data.length} total)
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
              Add Store
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
          placeholder="Search stores by name, description, owner..."
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
          <Group justify="space-between">
            <Text c="red" size="sm" fw={500}>
              <IconTrash size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Failed to load stores
            </Text>
            <Button 
              size="xs" 
              variant="subtle" 
              color="red"
              onClick={fetchStores}
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
                  sorted={sortBy === 'storeName'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('storeName')}
                  style={{ width: '300px', paddingLeft: '16px' }}
                >
                  Name
                </Th>
                <Th 
                  sorted={sortBy === 'storeDescription'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('storeDescription')}
                  style={{ width: '300px' }}
                >
                  Description
                </Th>
                <Th 
                  sorted={sortBy === 'userName'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('userName')}
                  style={{ width: '200px' }}
                >
                  Owner
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
                    colSpan={4} 
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
                              No stores found
                            </Text>
                            <Text c="dimmed" size="sm">
                              Try adjusting your search terms or clear the search to see all stores.
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
                            <IconBuilding size={32} />
                          </ActionIcon>
                          <div>
                            <Text fw={600} size="lg" c="dark" style={{ marginBottom: '8px' }}>
                              No stores yet
                            </Text>
                            <Text c="dimmed" size="sm">
                              Get started by adding your first store.
                            </Text>
                          </div>
                          <Button 
                            leftSection={<IconPlus size={14} />}
                            onClick={handleCreateNew}
                            size="sm"
                            color="blue"
                          >
                            Add First Store
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
        <StoresPagination 
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
        title="Delete Store"
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
              Are you sure you want to delete this store? 
              <br />
              <strong style={{ color: 'dark' }}>{deleteStoreId}</strong> 
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

      {/* Edit Store Modal */}
      <Modal
        opened={editModal}
        onClose={handleCancelEdit}
        title="Edit Store"
        size="xl"
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
        {editingStore && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <Stack gap="md">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <TextInput
                  label="Store Name"
                  value={editingStore.storeName || ''}
                  required
                  maxLength={50}
                  onChange={(event) => handleInputChange('storeName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter store name (max 50 chars)"
                  rightSection={<IconBuilding size={20} />}
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('name') ? notification.message : ''}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Username"
                  value={editingStore.userName || ''}
                  required
                  onChange={(event) => handleInputChange('userName', event.currentTarget.value)}
                  placeholder="Enter username"
                  rightSection={<IconUser size={20} />}
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('username') ? notification.message : ''}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Email"
                  value={editingStore.email || ''}
                  required
                  onChange={(event) => handleInputChange('email', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter email"
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('email') ? notification.message : ''}
                  disabled={updateLoading}
                />
                <TextInput
                  label="First Name"
                  value={editingStore.firstName || ''}
                  onChange={(event) => handleInputChange('firstName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter first name"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Last Name"
                  value={editingStore.lastName || ''}
                  onChange={(event) => handleInputChange('lastName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter last name"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Phone Number"
                  value={editingStore.phoneNumber || ''}
                  onChange={(event) => handleInputChange('phoneNumber', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter phone number"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Contact Person Name"
                  value={editingStore.contactPersonName || ''}
                  onChange={(event) => handleInputChange('contactPersonName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter contact person name"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Contact Phone Number"
                  value={editingStore.contactPhoneNumber || ''}
                  onChange={(event) => handleInputChange('contactPhoneNumber', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter contact phone number"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Password"
                  type="password"
                  value={editingStore.password || ''}
                  onChange={(event) => handleInputChange('password', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter new password (optional)"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <Textarea
                  label="Description"
                  value={editingStore.storeDescription || ''}
                  required
                  onChange={(event) => handleInputChange('storeDescription', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter store description"
                  rightSection={<IconWriting size={20} />}
                  style={{ maxWidth: 300, gridColumn: '1 / -1' }}
                  error={notification.message.includes('description') ? notification.message : ''}
                  minRows={3}
                  autosize
                  disabled={updateLoading}
                />
                <Text size="sm" fw={500} c="dimmed">Address Details</Text>
                <TextInput
                  label="Street"
                  value={editingStore.address.street || ''}
                  onChange={(event) => handleAddressChange('street', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter street"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="City"
                  value={editingStore.address.city || ''}
                  onChange={(event) => handleAddressChange('city', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter city"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="State"
                  value={editingStore.address.state || ''}
                  onChange={(event) => handleAddressChange('state', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter state"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Country"
                  value={editingStore.address.country || ''}
                  onChange={(event) => handleAddressChange('country', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter country"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Region"
                  value={editingStore.address.region || ''}
                  onChange={(event) => handleAddressChange('region', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter region"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Subcity"
                  value={editingStore.address.subcity || ''}
                  onChange={(event) => handleAddressChange('subcity', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter subcity"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
                <TextInput
                  label="Additional Info"
                  value={editingStore.address.additionalInfo || ''}
                  onChange={(event) => handleAddressChange('additionalInfo', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter additional info"
                  style={{ maxWidth: 300 }}
                  disabled={updateLoading}
                />
              </div>
              
              <Divider style={{ margin: '24px 0' }} />
              
              <Group justify="flex-end" gap="md">
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={updateLoading}
                  size="md"
                  radius="md"
                  style={{ minWidth: '100px' }}
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
                    color: 'white'
                  }}
                >
                  {updateLoading ? 'Updating...' : 'Update Store'}
                </Button>
              </Group>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* Add Store Modal */}
      <Modal
        opened={addModal}
        onClose={handleCancelAdd}
        title="Add Store"
        size="xl"
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
        {editingStore && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
            <Stack gap="md">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <TextInput
                  label="Store Name"
                  value={editingStore.storeName || ''}
                  required
                  maxLength={50}
                  onChange={(event) => handleInputChange('storeName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter store name (max 50 chars)"
                  rightSection={<IconBuilding size={20} />}
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('name') ? notification.message : ''}
                  disabled={addLoading}
                />
                <TextInput
                  label="Username"
                  value={editingStore.userName || ''}
                  required
                  onChange={(event) => handleInputChange('userName', event.currentTarget.value)}
                  placeholder="Enter username"
                  rightSection={<IconUser size={20} />}
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('username') ? notification.message : ''}
                  disabled={addLoading}
                />
                <TextInput
                  label="Email"
                  value={editingStore.email || ''}
                  required
                  onChange={(event) => handleInputChange('email', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter email"
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('email') ? notification.message : ''}
                  disabled={addLoading}
                />
                <TextInput
                  label="First Name"
                  value={editingStore.firstName || ''}
                  onChange={(event) => handleInputChange('firstName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter first name"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Last Name"
                  value={editingStore.lastName || ''}
                  onChange={(event) => handleInputChange('lastName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter last name"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Phone Number"
                  value={editingStore.phoneNumber || ''}
                  onChange={(event) => handleInputChange('phoneNumber', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter phone number"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Contact Person Name"
                  value={editingStore.contactPersonName || ''}
                  onChange={(event) => handleInputChange('contactPersonName', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter contact person name"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Contact Phone Number"
                  value={editingStore.contactPhoneNumber || ''}
                  onChange={(event) => handleInputChange('contactPhoneNumber', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter contact phone number"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Password"
                  type="password"
                  value={editingStore.password || ''}
                  required
                  onChange={(event) => handleInputChange('password', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter password"
                  style={{ maxWidth: 300 }}
                  error={notification.message.includes('password') ? notification.message : ''}
                  disabled={addLoading}
                />
                <Textarea
                  label="Description"
                  value={editingStore.storeDescription || ''}
                  required
                  onChange={(event) => handleInputChange('storeDescription', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter store description"
                  rightSection={<IconWriting size={20} />}
                  style={{ maxWidth: 300, gridColumn: '1 / -1' }}
                  error={notification.message.includes('description') ? notification.message : ''}
                  minRows={3}
                  autosize
                  disabled={addLoading}
                />
                <Text size="sm" fw={500} c="dimmed">Address Details</Text>
                <TextInput
                  label="Street"
                  value={editingStore.address.street || ''}
                  onChange={(event) => handleAddressChange('street', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter street"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="City"
                  value={editingStore.address.city || ''}
                  onChange={(event) => handleAddressChange('city', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter city"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="State"
                  value={editingStore.address.state || ''}
                  onChange={(event) => handleAddressChange('state', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter state"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Country"
                  value={editingStore.address.country || ''}
                  onChange={(event) => handleAddressChange('country', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter country"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Region"
                  value={editingStore.address.region || ''}
                  onChange={(event) => handleAddressChange('region', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter region"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Subcity"
                  value={editingStore.address.subcity || ''}
                  onChange={(event) => handleAddressChange('subcity', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter subcity"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
                <TextInput
                  label="Additional Info"
                  value={editingStore.address.additionalInfo || ''}
                  onChange={(event) => handleAddressChange('additionalInfo', sanitizeInput(event.currentTarget.value))}
                  placeholder="Enter additional info"
                  style={{ maxWidth: 300 }}
                  disabled={addLoading}
                />
              </div>
              
              <Divider style={{ margin: '24px 0' }} />
              
              <Group justify="flex-end" gap="md">
                <Button 
                  variant="outline" 
                  onClick={handleCancelAdd}
                  disabled={addLoading}
                  size="md"
                  radius="md"
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  leftSection={<IconPlus size={16} />}
                  loading={addLoading}
                  disabled={addLoading}
                  size="md"
                  radius="md"
                  style={{ 
                    minWidth: '140px',
                    backgroundColor: '#3b82f6',
                    color: 'white'
                  }}
                >
                  {addLoading ? 'Adding...' : 'Add Store'}
                </Button>
              </Group>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* View Store Modal */}
      <Modal
        opened={viewModal}
        onClose={closeView}
        title="Store Details"
        size="xl"
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
        {viewingStore && (
          <Stack gap="md">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text size="sm" fw={500} c="dimmed">ID</Text>
                <Text>{viewingStore.id || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Store Name</Text>
                <Text>{viewingStore.storeName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Username</Text>
                <Text>{viewingStore.userName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Email</Text>
                <Text>{viewingStore.email || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">First Name</Text>
                <Text>{viewingStore.firstName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Last Name</Text>
                <Text>{viewingStore.lastName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Phone Number</Text>
                <Text>{viewingStore.phoneNumber || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Contact Person Name</Text>
                <Text>{viewingStore.contactPersonName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Contact Phone Number</Text>
                <Text>{viewingStore.contactPhoneNumber || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Customer ID</Text>
                <Text>{viewingStore.customerId || 'N/A'}</Text>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Text size="sm" fw={500} c="dimmed">Description</Text>
                <Text>{viewingStore.storeDescription || 'N/A'}</Text>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Text size="sm" fw={500} c="dimmed">Address</Text>
                <Text>
                  {[
                    viewingStore.address?.street,
                    viewingStore.address?.city,
                    viewingStore.address?.state,
                    viewingStore.address?.country,
                    viewingStore.address?.region,
                    viewingStore.address?.subcity,
                    viewingStore.address?.additionalInfo,
                    viewingStore.address?.zipCode,
                    viewingStore.address?.zone,
                    viewingStore.address?.woreda,
                    viewingStore.address?.kebele,
                    viewingStore.address?.district,
                    viewingStore.address?.houseNumber
                  ].filter(Boolean).join(', ') || 'N/A'}
                </Text>
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
        <Notification
          color={notification.type === 'success' ? 'green' : notification.type === 'error' ? 'red' : 'yellow'}
          title={notification.type === 'success' ? 'Success' : notification.type === 'error' ? 'Error' : 'Warning'}
          onClose={() => setNotification({ message: '', type: '' })}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px'
          }}
          withCloseButton
          withBorder
        >
          {notification.message}
        </Notification>
      )}
    </Box>
}

      </>
  );
}