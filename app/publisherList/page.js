

"use client";
import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector, IconRefresh, IconPlus, IconEdit, IconTrash, IconDotsVertical, IconEye, IconBook, IconMapPin } from '@tabler/icons-react';
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
        aValue = aValue.street || aValue.city || '';
        bValue = bValue.street || bValue.city || '';
      }
      
      if (reversed) {
        return bValue < aValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    }),
    payload.search
  );
}

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
  const [addressModal, { open: openAddress, close: closeAddress }] = useDisclosure(false);
  const [deletePublisherId, setDeletePublisherId] = useState(null);
  const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {

    setNavigation((path) => {
  
      router.push(path);
    });
  }, [router]);

  useEffect(() => {
   
    fetchPublishers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchPublishers = async () => {
    setLoading(true);
    setError(null);
  
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`);
 
      
      if (!response.ok) {
        const errorText = await response.text();
     
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch publishers: ${response.status} - ${errorText}`);
      }

      const fetchedData = await response.json();
   
      
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setSortedData(fetchedData);
     
      } else {
       
        setData([]);
        setSortedData([]);
        setError('Invalid response format from server');
      }
    } catch (error) {
    
      setError(error.message || 'Failed to fetch publishers');
      
      if (error.message.includes('token') || error.message.includes('auth')) {
   
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!editingPublisher.name || !editingPublisher.name.trim()) {
      setNotification({ message: 'Publisher name is required.', type: 'error' });
      return false;
    }
    if (editingPublisher.name.length > 100) {
      setNotification({ message: 'Publisher name must be 100 characters or less.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingPublisher.name)) {
      setNotification({ message: 'Publisher name cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingPublisher.addressType) {
      setNotification({ message: 'Address type is required.', type: 'error' });
      return false;
    }
    if (editingPublisher.street && editingPublisher.street.length > 100) {
      setNotification({ message: 'Street must be 100 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.street && containsHtmlOrJs(editingPublisher.street)) {
      setNotification({ message: 'Street cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.city && editingPublisher.city.length > 50) {
      setNotification({ message: 'City must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.city && containsHtmlOrJs(editingPublisher.city)) {
      setNotification({ message: 'City cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.subcity && editingPublisher.subcity.length > 50) {
      setNotification({ message: 'Subcity must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.subcity && containsHtmlOrJs(editingPublisher.subcity)) {
      setNotification({ message: 'Subcity cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.state && editingPublisher.state.length > 50) {
      setNotification({ message: 'State must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.state && containsHtmlOrJs(editingPublisher.state)) {
      setNotification({ message: 'State cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.zipCode && !/^\d{5}(-\d{4})?$/.test(editingPublisher.zipCode)) {
      setNotification({ message: 'Please enter a valid zip code (e.g., 12345 or 12345-6789).', type: 'error' });
      return false;
    }
    if (editingPublisher.zipCode && containsHtmlOrJs(editingPublisher.zipCode)) {
      setNotification({ message: 'Zip code cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.country && editingPublisher.country.length > 50) {
      setNotification({ message: 'Country must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.country && containsHtmlOrJs(editingPublisher.country)) {
      setNotification({ message: 'Country cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.region && editingPublisher.region.length > 50) {
      setNotification({ message: 'Region must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.region && containsHtmlOrJs(editingPublisher.region)) {
      setNotification({ message: 'Region cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.zone && editingPublisher.zone.length > 50) {
      setNotification({ message: 'Zone must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.zone && containsHtmlOrJs(editingPublisher.zone)) {
      setNotification({ message: 'Zone cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.woreda && editingPublisher.woreda.length > 50) {
      setNotification({ message: 'Woreda must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.woreda && containsHtmlOrJs(editingPublisher.woreda)) {
      setNotification({ message: 'Woreda cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.kebele && editingPublisher.kebele.length > 50) {
      setNotification({ message: 'Kebele must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.kebele && containsHtmlOrJs(editingPublisher.kebele)) {
      setNotification({ message: 'Kebele cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.houseNumber && editingPublisher.houseNumber.length > 20) {
      setNotification({ message: 'House number must be 20 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.houseNumber && containsHtmlOrJs(editingPublisher.houseNumber)) {
      setNotification({ message: 'House number cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.district && editingPublisher.district.length > 50) {
      setNotification({ message: 'District must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.district && containsHtmlOrJs(editingPublisher.district)) {
      setNotification({ message: 'District cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingPublisher.additionalInfo && editingPublisher.additionalInfo.length > 500) {
      setNotification({ message: 'Additional info must be 500 characters or less.', type: 'error' });
      return false;
    }
    if (editingPublisher.additionalInfo && containsHtmlOrJs(editingPublisher.additionalInfo)) {
      setNotification({ message: 'Additional info cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }

    setNotification({ message: '', type: '' });
    return true;
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
    setSearch(sanitizeInput(value));
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleRefresh = () => {
   
    fetchPublishers();
  };

  const handleCreateNew = () => {

    router.push('/addPblisher');
  };

  const handleViewDetails = (publisherId) => {
    
    router.push(`/publishers/${publisherId}`);
  };

  const handleEdit = (publisher) => {
    
    setEditingPublisher({
      ...publisher,
      street: publisher.address?.street || '',
      city: publisher.address?.city || '',
      state: publisher.address?.state || '',
      zipCode: publisher.address?.zipCode || '',
      country: publisher.address?.country || '',
      region: publisher.address?.region || '',
      zone: publisher.address?.zone || '',
      woreda: publisher.address?.woreda || '',
      kebele: publisher.address?.kebele || '',
      additionalInfo: publisher.address?.additionalInfo || '',
      district: publisher.address?.district || '',
      houseNumber: publisher.address?.houseNumber || '',
      subcity: publisher.address?.subcity || '',
      addressType: publisher.address?.addressType || ''
    });
    openEdit();
  };

  const handleDelete = (publisherId, publisherName) => {
    
    setDeletePublisherId(publisherId);
    setNotification({ message: `Delete "${sanitizeInput(publisherName)}"?`, type: 'warning' });
    openDelete();
  };

  const handleViewAddress = (address) => {
  
    setSelectedAddress(address);
    openAddress();
  };

  const confirmDelete = async () => {
    if (!deletePublisherId) return;
    
    setDeleteLoading(true);
    
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher/${deletePublisherId}`, {
        method: 'DELETE',
      });
      
    
      
      if (!response.ok) {
        const errorText = await response.text();
       
        throw new Error(`Failed to delete publisher: ${response.status} - ${errorText}`);
      }
      
     
      setNotification({ message: 'Publisher deleted successfully!', type: 'success' });
      closeDelete();
      setCurrentPage(1);
      fetchPublishers();
    } catch (error) {
    
      setNotification({ message: `Error deleting publisher: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        
        return;
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPublisher) return;
    
    if (!validateForm()) {
   
      return;
    }

    setUpdateLoading(true);
   
    
    const updateData = {
      id: editingPublisher.id,
      name: sanitizeInput(editingPublisher.name.trim()),
      address: {
        street: sanitizeInput(editingPublisher.street.trim()) || null,
        city: sanitizeInput(editingPublisher.city.trim()) || null,
        state: sanitizeInput(editingPublisher.state.trim()) || null,
        zipCode: sanitizeInput(editingPublisher.zipCode.trim()) || null,
        country: sanitizeInput(editingPublisher.country.trim()) || null,
        region: sanitizeInput(editingPublisher.region.trim()) || null,
        zone: sanitizeInput(editingPublisher.zone.trim()) || null,
        woreda: sanitizeInput(editingPublisher.woreda.trim()) || null,
        kebele: sanitizeInput(editingPublisher.kebele.trim()) || null,
        additionalInfo: sanitizeInput(editingPublisher.additionalInfo.trim()) || null,
        district: sanitizeInput(editingPublisher.district.trim()) || null,
        houseNumber: sanitizeInput(editingPublisher.houseNumber.trim()) || null,
        subcity: sanitizeInput(editingPublisher.subcity.trim()) || null,
        addressType: editingPublisher.addressType,
      }
    };
    
 
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher/${editingPublisher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      
      
      if (!response.ok) {
        const errorText = await response.text();
       
        throw new Error(`Failed to update publisher: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
    
      setNotification({ message: `Publisher "${sanitizeInput(editingPublisher.name)}" updated successfully!`, type: 'success' });
      closeEdit();
      setEditingPublisher(null);
      setCurrentPage(1);
      fetchPublishers();
    } catch (error) {
  
      setNotification({ message: `Error updating publisher: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
       
        return;
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPublisher(null);
    closeEdit();
    setNotification({ message: '', type: '' });
  };

  const handleInputChange = (field, value) => {
    setEditingPublisher(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
  };

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return 'N/A';
    
    const parts = [];
    if (address.street) parts.push(sanitizeInput(address.street));
    if (address.city) parts.push(sanitizeInput(address.city));
    if (address.subcity) parts.push(sanitizeInput(address.subcity));
    if (address.woreda) parts.push(`Woreda ${sanitizeInput(address.woreda)}`);
    if (address.kebele) parts.push(`Kebele ${sanitizeInput(address.kebele)}`);
    
    return parts.length > 0 ? parts.join(', ') : 'N/A';
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
              {sanitizeInput(row.name) || 'N/A'}
            </Text>
            <Text fz="xs" c="dimmed" style={{ margin: 0 }}>
              {row.address?.addressType ? row.address.addressType.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'Business'}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', maxWidth: '250px' }}>
        <div style={{ lineHeight: 1.4 }}>
          <Text 
            fz="sm" 
            c="blue" 
            style={{ 
              margin: 0, 
              wordBreak: 'break-word',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => handleViewAddress(row.address)}
          >
            {formatAddress(row.address)}
          </Text>
        </div>
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

  const addressTypes = [
    { value: 'CUSTOMER_ADDRESS', label: 'Customer Address' },
    { value: 'EMERGENCY_CONTACT', label: 'Emergency Contact' },
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
                            <IconBook size={32} />
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

        <PublishersPagination 
          total={sortedData.length} 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </ScrollArea>

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
              <strong style={{ color: 'dark' }}>{sanitizeInput(deletePublisherId)}</strong> 
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

      <Modal
        opened={addressModal}
        onClose={closeAddress}
        title="Address Details"
        centered
        size="md"
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
        {selectedAddress && (
          <Stack gap="md">
            <Group gap="xs">
              <IconMapPin size={24} color="#3b82f6" />
              <Text fw={600} size="lg">Address Information</Text>
            </Group>
            <Divider />
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Street:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.street) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">City:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.city) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Subcity:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.subcity) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">State:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.state) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Zip Code:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.zipCode) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Country:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.country) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Region:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.region) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Zone:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.zone) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Woreda:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.woreda) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Kebele:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.kebele) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">House Number:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.houseNumber) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">District:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.district) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Additional Info:</Text>
                <Text size="sm">{sanitizeInput(selectedAddress.additionalInfo) || 'N/A'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Address Type:</Text>
                <Text size="sm">{selectedAddress.addressType?.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}</Text>
              </Group>
            </Stack>
            <Divider />
            <Group justify="flex-end">
              <Button 
                variant="outline" 
                onClick={closeAddress}
                size="sm"
                radius="md"
                style={{ minWidth: '80px' }}
              >
                Close
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

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
              {notification.message && editModal && (
                <Paper
                  style={{
                    backgroundColor: notification.type === 'error' ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${notification.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <Group gap="xs">
                    {notification.type === 'error' && <IconTrash size={18} color="#dc2626" />}
                    <Text size="sm" fw={500} style={{ 
                      color: notification.type === 'error' ? '#991b1b' : '#166534'
                    }}>
                      {notification.message}
                    </Text>
                  </Group>
                </Paper>
              )}
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
                    maxLength={100}
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
                    onChange={(value) => handleInputChange('addressType', value)}
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
                
                <div>
                  <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                    Street
                  </Text>
                  <MantineTextInput
                    id="street"
                    value={editingPublisher.street || ''}
                    onChange={(e) => handleInputChange('street', e.currentTarget.value)}
                    placeholder="Enter street"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={100}
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
                    City
                  </Text>
                  <MantineTextInput
                    id="city"
                    value={editingPublisher.city || ''}
                    onChange={(e) => handleInputChange('city', e.currentTarget.value)}
                    placeholder="Enter city"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Subcity
                  </Text>
                  <MantineTextInput
                    id="subcity"
                    value={editingPublisher.subcity || ''}
                    onChange={(e) => handleInputChange('subcity', e.currentTarget.value)}
                    placeholder="Enter subcity"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    State
                  </Text>
                  <MantineTextInput
                    id="state"
                    value={editingPublisher.state || ''}
                    onChange={(e) => handleInputChange('state', e.currentTarget.value)}
                    placeholder="Enter state"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Zip Code
                  </Text>
                  <MantineTextInput
                    id="zipCode"
                    value={editingPublisher.zipCode || ''}
                    onChange={(e) => handleInputChange('zipCode', e.currentTarget.value)}
                    placeholder="Enter zip code"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={10}
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
                    Country
                  </Text>
                  <MantineTextInput
                    id="country"
                    value={editingPublisher.country || ''}
                    onChange={(e) => handleInputChange('country', e.currentTarget.value)}
                    placeholder="Enter country"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Region
                  </Text>
                  <MantineTextInput
                    id="region"
                    value={editingPublisher.region || ''}
                    onChange={(e) => handleInputChange('region', e.currentTarget.value)}
                    placeholder="Enter region"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Zone
                  </Text>
                  <MantineTextInput
                    id="zone"
                    value={editingPublisher.zone || ''}
                    onChange={(e) => handleInputChange('zone', e.currentTarget.value)}
                    placeholder="Enter zone"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Woreda
                  </Text>
                  <MantineTextInput
                    id="woreda"
                    value={editingPublisher.woreda || ''}
                    onChange={(e) => handleInputChange('woreda', e.currentTarget.value)}
                    placeholder="Enter woreda"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Kebele
                  </Text>
                  <MantineTextInput
                    id="kebele"
                    value={editingPublisher.kebele || ''}
                    onChange={(e) => handleInputChange('kebele', e.currentTarget.value)}
                    placeholder="Enter kebele"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    House Number
                  </Text>
                  <MantineTextInput
                    id="houseNumber"
                    value={editingPublisher.houseNumber || ''}
                    onChange={(e) => handleInputChange('houseNumber', e.currentTarget.value)}
                    placeholder="Enter house number"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={20}
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
                    District
                  </Text>
                  <MantineTextInput
                    id="district"
                    value={editingPublisher.district || ''}
                    onChange={(e) => handleInputChange('district', e.currentTarget.value)}
                    placeholder="Enter district"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={50}
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
                    Additional Info
                  </Text>
                  <MantineTextInput
                    id="additionalInfo"
                    value={editingPublisher.additionalInfo || ''}
                    onChange={(e) => handleInputChange('additionalInfo', e.currentTarget.value)}
                    placeholder="Enter additional information"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={500}
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