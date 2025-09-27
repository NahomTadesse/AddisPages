

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
  IconBook,
  IconUser,
  IconMail,
  IconPhone
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
  Alert,
  Menu,
  Pagination,
  Modal,
  TextInput as MantineTextInput,
  Paper,
  Avatar,
  Stack,
  Divider
} from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../../app/services/baseApiService';
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
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (reversed) {
        return bValue < aValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    }),
    payload.search
  );
}

// Pagination component
function AuthorsPagination({ total, currentPage, onPageChange, loading }) {
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

export default function AuthorsTable() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [deleteAuthorId, setDeleteAuthorId] = useState(null);
  const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
 
    setNavigation((path) => {
    
      router.push(path);
    });
  }, [router]);

  useEffect(() => {
  
    fetchAuthors();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
 
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/all`);
    
      
      if (!response.ok) {
        const errorText = await response.text();
      
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch authors: ${response.status} - ${errorText}`);
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
   
      setError(error.message || 'Failed to fetch authors');
      
      if (error.message.includes('token') || error.message.includes('auth')) {
   
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Validation function for author form
  const validateForm = () => {
    if (!editingAuthor.firstName) {
      setNotification({ message: 'First name is required.', type: 'error' });
      return false;
    }
    if (editingAuthor.firstName.length > 50) {
      setNotification({ message: 'First name must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingAuthor.firstName)) {
      setNotification({ message: 'First name cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingAuthor.lastName) {
      setNotification({ message: 'Last name is required.', type: 'error' });
      return false;
    }
    if (editingAuthor.lastName.length > 50) {
      setNotification({ message: 'Last name must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingAuthor.lastName)) {
      setNotification({ message: 'Last name cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingAuthor.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingAuthor.email)) {
      setNotification({ message: 'A valid email is required.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingAuthor.email)) {
      setNotification({ message: 'Email cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingAuthor.phoneNumber) {
      setNotification({ message: 'Phone number is required.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingAuthor.phoneNumber)) {
      setNotification({ message: 'Phone number cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (!editingAuthor.nationality) {
      setNotification({ message: 'Nationality is required.', type: 'error' });
      return false;
    }
    if (editingAuthor.nationality.length > 50) {
      setNotification({ message: 'Nationality must be 50 characters or less.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingAuthor.nationality)) {
      setNotification({ message: 'Nationality cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    if (editingAuthor.bio && editingAuthor.bio.length > 500) {
      setNotification({ message: 'Biography must be 500 characters or less.', type: 'error' });
      return false;
    }
    if (containsHtmlOrJs(editingAuthor.bio)) {
      setNotification({ message: 'Biography cannot contain HTML or JavaScript code.', type: 'error' });
      return false;
    }
    
    setNotification({ message: '', type: '' });
    return true;
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
    setSearch(sanitizeInput(value)); // Sanitize search input
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleRefresh = () => {
  
    fetchAuthors();
  };

  const handleCreateNew = () => {
 
    router.push('/addAuthor');
  };

  const handleViewDetails = (authorId) => {
   
    router.push(`/authors/${authorId}`);
  };

  const handleEdit = (author) => {
  
    setEditingAuthor({
      ...author,
      firstName: author.firstName || '',
      lastName: author.lastName || '',
      email: author.email || '',
      phoneNumber: author.phoneNumber || '',
      bio: author.bio || '',
      nationality: author.nationality || ''
    });
    openEdit();
  };

  const handleDelete = (authorId, authorName) => {
   
    setDeleteAuthorId(authorId);
    setNotification({ message: `Delete "${authorName}"?`, type: 'warning' });
    openDelete();
  };

  const confirmDelete = async () => {
    if (!deleteAuthorId) return;
    
    setDeleteLoading(true);
   
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/delete?id=${deleteAuthorId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*'
        }
      });
      
   
      
      if (!response.ok) {
        const errorText = await response.text();
      
        throw new Error(`Failed to delete author: ${response.status} - ${errorText}`);
      }
      
   
      setNotification({ message: 'Author deleted successfully!', type: 'success' });
      closeDelete();
      setCurrentPage(1);
      fetchAuthors(); // Refresh the list
    } catch (error) {
    
      setNotification({ message: `Error deleting author: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
   
        return;
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingAuthor) return;
    
    if (!validateForm()) {
    
      return;
    }

    setUpdateLoading(true);
   
    
    const updateData = {
      author: {
        id: editingAuthor.id,
        firstName: sanitizeInput(editingAuthor.firstName.trim()),
        lastName: sanitizeInput(editingAuthor.lastName.trim()),
        email: sanitizeInput(editingAuthor.email.trim()),
        phoneNumber: sanitizeInput(editingAuthor.phoneNumber.trim()),
        bio: sanitizeInput(editingAuthor.bio.trim()),
        nationality: sanitizeInput(editingAuthor.nationality.trim())
      },
      photos: editingAuthor.photos || null
    };
    
  
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/update`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
  
      
      if (!response.ok) {
        const errorText = await response.text();
     
        throw new Error(`Failed to update author: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
   
      setNotification({ message: `Author "${sanitizeInput(editingAuthor.firstName)} ${sanitizeInput(editingAuthor.lastName)}" updated successfully!`, type: 'success' });
      closeEdit();
      setEditingAuthor(null);
      setCurrentPage(1);
      fetchAuthors(); // Refresh the list
    } catch (error) {
    
      setNotification({ message: `Error updating author: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
      
        return;
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingAuthor(null);
    closeEdit();
    setNotification({ message: '', type: '' }); // Clear any validation errors
  };

  const handleInputChange = (field, value) => {
    setEditingAuthor(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
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
            <IconUser size={16} stroke={1.5} />
          </Avatar>
          <div style={{ lineHeight: 1.2 }}>
            <Text fw={600} fz="sm" c="dark" style={{ margin: 0 }}>
              {row.firstName || 'N/A'}
            </Text>
            {row.bio && (
              <Text fz="xs" c="dimmed" style={{ margin: 0 }}>
                {row.bio.length > 50 ? `${row.bio.substring(0, 50)}...` : row.bio}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', width: '200px' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.nationality || 'N/A'}
        </Text>
        {row.bio && (
          <Text fz="xs" c="dimmed" style={{ margin: '2px 0 0 0' }}>
            {row.bio.length > 30 ? `${row.bio.substring(0, 30)}...` : row.bio}
          </Text>
        )}
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
                onClick={() => handleDelete(row.id, `${row.firstName} ${row.lastName}`)}
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
              Authors
            </Title>
            <Text c="dimmed" size="sm" style={{ marginTop: '4px' }}>
              Manage your author directory ({data.length} total)
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
              Add Author
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
          placeholder="Search authors by name, nationality, or bio..."
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
              Failed to load authors
            </Text>
            <Button 
              size="xs" 
              variant="subtle" 
              color="red"
              onClick={fetchAuthors}
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
                  style={{ width: '400px', paddingLeft: '16px' }}
                >
                  Author Name
                </Th>
                <Th 
                  sorted={sortBy === 'nationality'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('nationality')}
                  style={{ width: '300px' }}
                >
                  Nationality & Bio
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
                    colSpan={3} 
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
                              No authors found
                            </Text>
                            <Text c="dimmed" size="sm">
                              Try adjusting your search terms or clear the search to see all authors.
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
                              No authors yet
                            </Text>
                            <Text c="dimmed" size="sm">
                              Get started by adding your first author.
                            </Text>
                          </div>
                          <Button 
                            leftSection={<IconPlus size={14} />}
                            onClick={handleCreateNew}
                            size="sm"
                            color="blue"
                          >
                            Add First Author
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
        <AuthorsPagination 
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
        title="Delete Author"
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
              Are you sure you want to delete this author? 
              <br />
              <strong style={{ color: 'dark' }}>{deleteAuthorId}</strong> 
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

      {/* Edit Author Modal */}
      <Modal
        opened={editModal}
        onClose={handleCancelEdit}
        title={`Edit Author`}
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
        {editingAuthor && (
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
                    First Name *
                  </Text>
                  <MantineTextInput
                    value={editingAuthor.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.currentTarget.value)}
                    placeholder="Enter first name"
                    size="md"
                    radius="md"
                    required
                    disabled={updateLoading}
                    maxLength={50}
                    rightSection={<IconUser size={16} />}
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
                    Last Name *
                  </Text>
                  <MantineTextInput
                    value={editingAuthor.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.currentTarget.value)}
                    placeholder="Enter last name"
                    size="md"
                    radius="md"
                    required
                    disabled={updateLoading}
                    maxLength={50}
                    rightSection={<IconUser size={16} />}
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
                    Email *
                  </Text>
                  <MantineTextInput
                    value={editingAuthor.email || ''}
                    onChange={(e) => handleInputChange('email', e.currentTarget.value)}
                    placeholder="Enter email"
                    size="md"
                    radius="md"
                    required
                    disabled={updateLoading}
                    rightSection={<IconMail size={16} />}
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
                    value={editingAuthor.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.currentTarget.value)}
                    placeholder="Enter phone number"
                    size="md"
                    radius="md"
                    required
                    disabled={updateLoading}
                    rightSection={<IconPhone size={16} />}
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
                    Nationality *
                  </Text>
                  <MantineTextInput
                    value={editingAuthor.nationality || ''}
                    onChange={(e) => handleInputChange('nationality', e.currentTarget.value)}
                    placeholder="Enter nationality"
                    size="md"
                    radius="md"
                    required
                    disabled={updateLoading}
                    maxLength={50}
                    rightSection={<IconUser size={16} />}
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
                    Biography
                  </Text>
                  <MantineTextInput
                    value={editingAuthor.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.currentTarget.value)}
                    placeholder="Enter author biography (optional)"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    maxLength={500}
                    multiline
                    rows={4}
                    styles={{
                      input: {
                        border: '1px solid #d1d5db',
                        padding: '10px 12px',
                        minHeight: '100px',
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
                  {updateLoading ? 'Updating...' : 'Update Author'}
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
              {notification.type === 'success' && <IconUser size={18} color="#16a34a" />}
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