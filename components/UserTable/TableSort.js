

// "use client";
// import { useEffect, useState } from 'react';
// import { 
//   IconChevronDown, 
//   IconChevronUp, 
//   IconSearch, 
//   IconSelector, 
//   IconRefresh, 
//   IconPlus, 
//   IconEdit, 
//   IconTrash, 
//   IconDotsVertical, 
//   IconEye, 
//   IconBook,
//   IconDownload,
//   IconBadge
// } from '@tabler/icons-react';
// import {
//   Center,
//   Group,
//   ScrollArea,
//   Table,
//   Text,
//   TextInput,
//   Box,
//   LoadingOverlay,
//   UnstyledButton,
//   Title,
//   ActionIcon,
//   Button,
//   Menu,
//   Pagination,
//   Modal,
//   TextInput as MantineTextInput,
//   Select,
//   NumberInput,
//   Paper,
//   Avatar,
//   Stack,
//   Divider
// } from '@mantine/core';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../../app/services/baseApiService';
// import { useRouter } from 'next/navigation';
// import { useDisclosure } from '@mantine/hooks';
// import classes from './TableSort.module.css';


// function Th({ children, reversed, sorted, onSort }) {
//   const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
//   return (
//     <Table.Th className={classes.th} style={{ padding: '12px 8px' }}>
//       <UnstyledButton onClick={onSort} className={classes.control}>
//         <Group justify="space-between" gap="xs">
//           <Text fw={500} fz="sm" style={{ whiteSpace: 'nowrap' }}>
//             {children}
//           </Text>
//           <Center className={classes.icon}>
//             <Icon size={14} stroke={1.5} />
//           </Center>
//         </Group>
//       </UnstyledButton>
//     </Table.Th>
//   );
// }

// function filterData(data, search) {
//   const query = search.toLowerCase().trim();
//   return data.filter((item) =>
//     Object.keys(item).some((key) => {
//       const value = item[key];
//       if (key === 'authorName' || key === 'publisherName') {
//         return value && value.toString().toLowerCase().includes(query);
//       }
//       return value && value.toString().toLowerCase().includes(query);
//     })
//   );
// }

// function sortData(data, payload) {
//   const { sortBy, reversed } = payload;

//   if (!sortBy) {
//     return filterData(data, payload.search);
//   }

//   return filterData(
//     [...data].sort((a, b) => {
//       let aValue = a[sortBy];
//       let bValue = b[sortBy];
      
//       if (sortBy === 'price' || sortBy === 'stock' || sortBy === 'rating') {
//         aValue = parseFloat(aValue) || 0;
//         bValue = parseFloat(bValue) || 0;
//       }
      
//       if (reversed) {
//         return bValue < aValue ? -1 : 1;
//       }
//       return aValue < bValue ? -1 : 1;
//     }),
//     payload.search
//   );
// }

// // Pagination component
// function BooksPagination({ total, currentPage, onPageChange, loading }) {
//   if (total <= 7) return null;

//   return (
//     <Group justify="center" mt="lg" mb="md">
//       <Pagination
//         total={Math.ceil(total / 7)}
//         value={currentPage}
//         onChange={onPageChange}
//         disabled={loading}
//         withControls
//         size="sm"
//         radius="md"
//         styles={{
//           control: {
//             '&[dataActive]': {
//               backgroundColor: '#1976d2',
//               color: 'white',
//             },
//           },
//         }}
//       />
//     </Group>
//   );
// }

// export default function BooksTable() {
//   const [notification, setNotification] = useState({ message: '', type: '' });
//   const [search, setSearch] = useState('');
//   const [data, setData] = useState([]);
//   const [sortedData, setSortedData] = useState([]);
//   const [sortBy, setSortBy] = useState(null);
//   const [reverseSortDirection, setReverseSortDirection] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingBook, setEditingBook] = useState(null);
//   const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
//   const [deleteBookId, setDeleteBookId] = useState(null);
//   const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const router = useRouter();

//   // Set up navigation for the auth service
//   useEffect(() => {
//     console.log('📚 Books page loaded, setting up navigation...');
//     setNavigation((path) => {
//       console.log('📍 Books navigation to:', path);
//       router.push(path);
//     });
//   }, [router]);

//   useEffect(() => {
//     console.log('📚 Books page initialized, fetching data...');
//     fetchBooks();
//   }, []);

//   // Reset to first page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   const fetchBooks = async () => {
//     setLoading(true);
//     setError(null);
//     console.log('🔄 Starting books fetch...');
    
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book/all`);
//       console.log('📥 Books fetch response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Books fetch failed:', { status: response.status, error: errorText });
        
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please log in again.');
//         }
//         throw new Error(`Failed to fetch books: ${response.status} - ${errorText}`);
//       }

//       const fetchedData = await response.json();
//       console.log('✅ Books fetched successfully:', fetchedData);
      
//       if (Array.isArray(fetchedData)) {
//         setData(fetchedData);
//         setSortedData(fetchedData);
//         console.log(`📊 Loaded ${fetchedData.length} books`);
//       } else {
//         console.warn('⚠️ Expected array but got:', fetchedData);
//         setData([]);
//         setSortedData([]);
//         setError('Invalid response format from server');
//       }
//     } catch (error) {
//       console.error('💥 Error fetching books:', error);
//       setError(error.message || 'Failed to fetch books');
      
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination logic
//   const paginatedData = () => {
//     const startIndex = (currentPage - 1) * 7;
//     const endIndex = startIndex + 7;
//     return sortedData.slice(startIndex, endIndex);
//   };

//   const setSorting = (field) => {
//     const reversed = field === sortBy ? !reverseSortDirection : false;
//     setReverseSortDirection(reversed);
//     setSortBy(field);
//     setSortedData(sortData(data, { sortBy: field, reversed, search }));
//   };

//   const handleSearchChange = (event) => {
//     const { value } = event.currentTarget;
//     setSearch(value);
//     setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
//   };

//   const handleRefresh = () => {
//     console.log('🔄 Manual refresh triggered for books');
//     fetchBooks();
//   };

//   const handleCreateNew = () => {
//     console.log('➕ Navigate to create book');
//     router.push('/books/create');
//   };

//   const handleViewDetails = (bookId) => {
//     console.log('👁️ Navigate to book details:', bookId);
//     router.push(`/books/${bookId}`);
//   };

//   const handleEdit = (book) => {
//     console.log('✏️ Edit book:', book.id);
//     setEditingBook({
//       ...book,
//       price: parseFloat(book.price) || 0,
//       stock: parseInt(book.stock) || 0,
//       rating: parseFloat(book.rating) || 0
//     });
//     openEdit();
//   };

//   const handleDelete = (bookId, bookTitle) => {
//     console.log('🗑️ Delete book:', bookId);
//     setDeleteBookId(bookId);
//     setNotification({ message: `Delete "${bookTitle}"?`, type: 'warning' });
//     openDelete();
//   };

//   const confirmDelete = async () => {
//     if (!deleteBookId) return;
    
//     setDeleteLoading(true);
//     console.log('🗑️ Confirming book deletion:', deleteBookId);
    
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book/${deleteBookId}`, {
//         method: 'DELETE',
//       });
      
//       console.log('📥 Delete response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Delete failed:', { status: response.status, error: errorText });
//         throw new Error(`Failed to delete book: ${response.status} - ${errorText}`);
//       }
      
//       console.log('✅ Book deleted successfully');
//       setNotification({ message: 'Book deleted successfully!', type: 'success' });
//       closeDelete();
//       setCurrentPage(1);
//       fetchBooks(); // Refresh the list
//     } catch (error) {
//       console.error('💥 Delete error:', error);
//       setNotification({ message: `Error deleting book: ${error.message}`, type: 'error' });
      
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!editingBook) return;
    
//     setUpdateLoading(true);
//     console.log('✏️ Updating book:', editingBook.id);
    
//     const updateData = {
//       id: editingBook.id,
//       title: editingBook.title.trim(),
//       price: parseFloat(editingBook.price) || 0,
//       stock: parseInt(editingBook.stock) || 0,
//       description: editingBook.description?.trim() || '',
//       genre: editingBook.genre?.trim() || '',
//       authorId: editingBook.authorId,
//       publisherId: editingBook.publisherId,
//       imageUrl: editingBook.imageUrl?.trim() || '',
//       authorName: editingBook.authorName,
//       publisherName: editingBook.publisherName,
//       rating: parseFloat(editingBook.rating) || 0
//     };
    
//     console.log('📋 Update data:', updateData);
    
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book/${editingBook.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       });
      
//       console.log('📥 Update response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Update failed:', { status: response.status, error: errorText });
//         throw new Error(`Failed to update book: ${response.status} - ${errorText}`);
//       }
      
//       const data = await response.json();
//       console.log('✅ Book updated successfully:', data);
//       setNotification({ message: `Book "${editingBook.title}" updated successfully!`, type: 'success' });
//       closeEdit();
//       setEditingBook(null);
//       setCurrentPage(1);
//       fetchBooks(); // Refresh the list
//     } catch (error) {
//       console.error('💥 Update error:', error);
//       setNotification({ message: `Error updating book: ${error.message}`, type: 'error' });
      
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingBook(null);
//     closeEdit();
//   };

//   const handleInputChange = (field, value) => {
//     setEditingBook(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleNumberChange = (field, value) => {
//     setEditingBook(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const downloadPDF = () => {
//     if (sortedData.length === 0) {
//       setNotification({ message: 'No data to export', type: 'error' });
//       return;
//     }
    
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text('Books Inventory Report', 14, 20);
//     doc.setFontSize(10);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
//     autoTable(doc, {
//       startY: 35,
//       head: [['Title', 'Author', 'Publisher', 'Genre', 'Price', 'Stock', 'Rating']],
//       body: sortedData.map(row => [
//         row.title || 'N/A', 
//         row.authorName || 'N/A', 
//         row.publisherName || 'N/A', 
//         row.genre || 'N/A', 
//         row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'N/A', 
//         row.stock || 0,
//         row.rating ? `${parseFloat(row.rating).toFixed(1)}/5` : 'N/A'
//       ]),
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 3 },
//       headStyles: { 
//         fillColor: [41, 128, 185], 
//         textColor: 255, 
//         fontStyle: 'bold' 
//       },
//       columnStyles: {
//         0: { cellWidth: 40 }, // Title - wider
//         4: { halign: 'right' }, // Price - right align
//         5: { halign: 'center' }, // Stock - center
//         6: { halign: 'center' } // Rating - center
//       },
//       margin: { top: 40 }
//     });
    
//     doc.save(`books-inventory-${new Date().toISOString().split('T')[0]}.pdf`);
//     console.log('📄 PDF exported successfully');
//     setNotification({ message: 'Books inventory exported to PDF!', type: 'success' });
//   };

//   const paginatedRows = paginatedData().map((row) => (
//     <Table.Tr key={row.id || Math.random()} style={{ borderBottom: '1px solid #e0e0e0' }}>
//       <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
//         <Group gap="xs" wrap="nowrap">
//           <Avatar 
//             size={32} 
//             radius="xl" 
//             color="indigo" 
//             style={{ 
//               backgroundColor: '#e8daf2',
//               border: '1px solid #c084fc'
//             }}
//           >
//             <IconBook size={16} stroke={1.5} />
//           </Avatar>
//           <div style={{ lineHeight: 1.2 }}>
//             <Text fw={600} fz="sm" c="dark" style={{ margin: 0 }}>
//               {row.title || 'N/A'}
//             </Text>
//             {row.description && (
//               <Text fz="xs" c="dimmed" style={{ margin: 0 }}>
//                 {row.description.length > 50 ? `${row.description.substring(0, 50)}...` : row.description}
//               </Text>
//             )}
//           </div>
//         </Group>
//       </Table.Td>
//       <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
//         <Text fz="sm" c="dark" style={{ margin: 0 }}>
//           {row.authorName || 'N/A'}
//         </Text>
//       </Table.Td>
//       <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
//         <Text fz="sm" c="dark" style={{ margin: 0 }}>
//           {row.publisherName || 'N/A'}
//         </Text>
//       </Table.Td>
//       <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', width: '120px' }}>
//         < IconBadge 
//           size="sm" 
//           variant="light" 
//           color={row.genre ? 'grape' : 'gray'}
//           style={{ fontSize: '12px' }}
//         >
//           {row.genre || 'N/A'}
//         </ IconBadge>
//       </Table.Td>
//       <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', width: '100px', textAlign: 'right' }}>
//         <Text fz="sm" c="dark" fw={500} style={{ margin: 0 }}>
//           {row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'N/A'}
//         </Text>
//       </Table.Td>
//       <Table.Td style={{ padding: '12px 8px', verticalAlign: 'middle', width: '80px', textAlign: 'center' }}>
//         <Text fz="sm" c={row.stock > 0 ? 'green' : 'red'} fw={500} style={{ margin: 0 }}>
//           {row.stock || 0}
//         </Text>
//       </Table.Td>
//       <Table.Td style={{ padding: '12px 4px', verticalAlign: 'middle', width: '80px' }}>
//         <Center>
//           <Menu shadow="md" width={140} position="left-start" withArrow>
//             <Menu.Target>
//               <ActionIcon 
//                 variant="subtle" 
//                 color="gray" 
//                 size="sm" 
//                 style={{ 
//                   backgroundColor: 'transparent',
//                   color: '#94a3b8',
//                   border: '1px solid #e2e8f0',
//                   borderRadius: '6px'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = '#f1f5f9';
//                   e.currentTarget.style.color = '#475569';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'transparent';
//                   e.currentTarget.style.color = '#94a3b8';
//                 }}
//               >
//                 <IconDotsVertical size={16} />
//               </ActionIcon>
//             </Menu.Target>
//             <Menu.Dropdown style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
//               <Menu.Item 
//                 leftSection={<IconEye size={14} color="#64748b" />}
//                 onClick={() => handleViewDetails(row.id)}
//                 styles={{
//                   item: {
//                     padding: '8px 12px',
//                     fontSize: '14px',
//                     '&:hover': {
//                       backgroundColor: '#f1f5f9',
//                       color: '#1e293b',
//                     },
//                   },
//                   leftSection: {
//                     marginRight: '8px',
//                   },
//                 }}
//               >
//                 View Details
//               </Menu.Item>
//               <Menu.Item 
//                 leftSection={<IconEdit size={14} color="#64748b" />}
//                 onClick={() => handleEdit(row)}
//                 styles={{
//                   item: {
//                     padding: '8px 12px',
//                     fontSize: '14px',
//                     '&:hover': {
//                       backgroundColor: '#f1f5f9',
//                       color: '#1e293b',
//                     },
//                   },
//                   leftSection: {
//                     marginRight: '8px',
//                   },
//                 }}
//               >
//                 Edit
//               </Menu.Item>
//               <Divider style={{ margin: '4px 0' }} />
//               <Menu.Item 
//                 leftSection={<IconTrash size={14} color="#ef4444" />}
//                 color="red"
//                 onClick={() => handleDelete(row.id, row.title)}
//                 styles={{
//                   item: {
//                     padding: '8px 12px',
//                     fontSize: '14px',
//                     color: '#dc2626',
//                     '&:hover': {
//                       backgroundColor: '#fef2f2',
//                       color: '#b91c1c',
//                     },
//                   },
//                   leftSection: {
//                     marginRight: '8px',
//                   },
//                 }}
//               >
//                 Delete
//               </Menu.Item>
//             </Menu.Dropdown>
//           </Menu>
//         </Center>
//       </Table.Td>
//     </Table.Tr>
//   ));

//   // Genre options for select dropdown
//   const genreOptions = [
//     { value: 'Fiction', label: 'Fiction' },
//     { value: 'Non-Fiction', label: 'Non-Fiction' },
//     { value: 'Mystery', label: 'Mystery' },
//     { value: 'Science Fiction', label: 'Science Fiction' },
//     { value: 'Fantasy', label: 'Fantasy' },
//     { value: 'Romance', label: 'Romance' },
//     { value: 'Biography', label: 'Biography' },
//     { value: 'History', label: 'History' },
//     { value: 'Self-Help', label: 'Self-Help' },
//     { value: 'Business', label: 'Business' },
//     { value: 'Other', label: 'Other' }
//   ];

//   return (
//     <Box pos="relative" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
//       <LoadingOverlay
//         visible={loading}
//         zIndex={1000}
//         overlayProps={{ radius: 'sm', blur: 2 }}
//         loaderProps={{ color: 'blue', type: 'bars' }}
//       />
      
//       {/* Header Section */}
//       <Box style={{ 
//         backgroundColor: 'white', 
//         borderBottom: '1px solid #e2e8f0', 
//         padding: '24px 32px',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
//       }}>
//         <Group justify="apart" align="center">
//           <div>
//             <Title order={1} style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: 700 }}>
//               Books Inventory
//             </Title>
//             <Text c="dimmed" size="sm" style={{ marginTop: '4px' }}>
//               Manage your book catalog ({data.length} total)
//             </Text>
//           </div>
//           <Group gap="md">
//             <ActionIcon 
//               size="lg" 
//               variant="light" 
//               color="blue"
//               onClick={handleRefresh}
//               title="Refresh"
//               style={{ 
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 padding: '8px'
//               }}
//             >
//               <IconRefresh size={20} />
//             </ActionIcon>
//             <ActionIcon 
//               size="lg" 
//               variant="light" 
//               color="green"
//               onClick={downloadPDF}
//               title="Export to PDF"
//               style={{ 
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 padding: '8px'
//               }}
//             >
//               <IconDownload size={20} />
//             </ActionIcon>
//             <Button 
//               leftSection={<IconPlus size={18} />}
//               onClick={handleCreateNew}
//               size="md"
//               style={{
//                 backgroundColor: '#3b82f6',
//                 color: 'white',
//                 borderRadius: '8px',
//                 height: '40px',
//                 fontWeight: 600,
//                 padding: '0 20px',
//                 boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = '#2563eb';
//                 e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = '#3b82f6';
//                 e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
//               }}
//             >
//               Add Book
//             </Button>
//           </Group>
//         </Group>
//       </Box>

//       {/* Search Section */}
//       <Box style={{ 
//         backgroundColor: 'white', 
//         padding: '20px 32px', 
//         borderBottom: '1px solid #e2e8f0',
//         marginBottom: '24px'
//       }}>
//         <TextInput
//           placeholder="Search books by title, author, publisher, genre..."
//           value={search}
//           onChange={handleSearchChange}
//           size="md"
//           radius="md"
//           leftSection={
//             <IconSearch size={16} style={{ color: '#94a3b8' }} />
//           }
//           styles={{
//             input: {
//               border: '1px solid #e2e8f0',
//               paddingLeft: '44px',
//               height: '44px',
//               fontSize: '14px',
//               '&:focus': {
//                 borderColor: '#3b82f6',
//                 boxShadow: '0 0 0 1px #3b82f6',
//               },
//             },
//             section: {
//               width: '44px',
//               height: '44px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             },
//           }}
//           style={{ maxWidth: '480px', width: '100%' }}
//         />
//       </Box>

//       {/* Error Alert */}
//       {error && (
//         <Paper style={{ 
//           margin: '0 32px 24px', 
//           backgroundColor: '#fef2f2', 
//           border: '1px solid #fecaca',
//           borderRadius: '8px',
//           padding: '16px'
//         }}>
//           <Group justify="apart">
//             <Text c="red" size="sm" fw={500}>
//               <IconTrash size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
//               Failed to load books
//             </Text>
//             <Button 
//               size="xs" 
//               variant="subtle" 
//               color="red"
//               onClick={fetchBooks}
//               leftSection={<IconRefresh size={12} />}
//               styles={{
//                 root: {
//                   height: '28px',
//                   padding: '0 12px',
//                   borderRadius: '6px',
//                 },
//               }}
//             >
//               Retry
//             </Button>
//           </Group>
//           <Text c="red" size="xs" mt="xs">
//             {error}
//           </Text>
//         </Paper>
//       )}

//       {/* Main Content */}
//       <ScrollArea style={{ height: 'calc(100vh - 200px)' }}>
//         <Paper style={{ 
//           margin: '0 32px 32px', 
//           backgroundColor: 'white',
//           borderRadius: '12px',
//           overflow: 'hidden',
//           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//         }}>
//           <Table 
//             horizontalSpacing="0" 
//             verticalSpacing="0" 
//             style={{ 
//               borderCollapse: 'collapse',
//               width: '100%',
//               fontSize: '14px'
//             }}
//           >
//             <Table.Thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
//               <Table.Tr>
//                 <Th 
//                   sorted={sortBy === 'title'} 
//                   reversed={reverseSortDirection} 
//                   onSort={() => setSorting('title')}
//                   style={{ width: '300px', paddingLeft: '16px' }}
//                 >
//                   Title
//                 </Th>
//                 <Th 
//                   sorted={sortBy === 'authorName'} 
//                   reversed={reverseSortDirection} 
//                   onSort={() => setSorting('authorName')}
//                   style={{ width: '150px' }}
//                 >
//                   Author
//                 </Th>
//                 <Th 
//                   sorted={sortBy === 'publisherName'} 
//                   reversed={reverseSortDirection} 
//                   onSort={() => setSorting('publisherName')}
//                   style={{ width: '150px' }}
//                 >
//                   Publisher
//                 </Th>
//                 <Th 
//                   sorted={sortBy === 'genre'} 
//                   reversed={reverseSortDirection} 
//                   onSort={() => setSorting('genre')}
//                   style={{ width: '120px' }}
//                 >
//                   Genre
//                 </Th>
//                 <Th 
//                   sorted={sortBy === 'price'} 
//                   reversed={reverseSortDirection} 
//                   onSort={() => setSorting('price')}
//                   style={{ width: '100px', textAlign: 'right' }}
//                 >
//                   Price
//                 </Th>
//                 <Th 
//                   sorted={sortBy === 'stock'} 
//                   reversed={reverseSortDirection} 
//                   onSort={() => setSorting('stock')}
//                   style={{ width: '80px', textAlign: 'center' }}
//                 >
//                   Stock
//                 </Th>
//                 <Th style={{ width: '80px', textAlign: 'center' }}>
//                   Actions
//                 </Th>
//               </Table.Tr>
//             </Table.Thead>
//             <Table.Tbody>
//               {paginatedRows.length > 0 ? (
//                 paginatedRows
//               ) : (
//                 <Table.Tr>
//                   <Table.Td 
//                     colSpan={7} 
//                     style={{ 
//                       textAlign: 'center', 
//                       padding: '60px 20px',
//                       border: 'none'
//                     }}
//                   >
//                     <Stack align="center" gap="md">
//                       {search ? (
//                         <>
//                           <ActionIcon size="lg" variant="light" color="gray" radius="xl" style={{ width: '80px', height: '80px' }}>
//                             <IconSearch size={32} />
//                           </ActionIcon>
//                           <div>
//                             <Text fw={600} size="lg" c="dark" style={{ marginBottom: '8px' }}>
//                               No books found
//                             </Text>
//                             <Text c="dimmed" size="sm">
//                               Try adjusting your search terms or clear the search to see all books.
//                             </Text>
//                           </div>
//                           <Button 
//                             variant="light" 
//                             color="blue"
//                             leftSection={<IconSearch size={14} />}
//                             onClick={() => setSearch('')}
//                             size="sm"
//                           >
//                             Clear Search
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <ActionIcon size="lg" variant="light" color="gray" radius="xl" style={{ width: '80px', height: '80px' }}>
//                             <IconBook size={32} />
//                           </ActionIcon>
//                           <div>
//                             <Text fw={600} size="lg" c="dark" style={{ marginBottom: '8px' }}>
//                               No books yet
//                             </Text>
//                             <Text c="dimmed" size="sm">
//                               Get started by adding your first book to the catalog.
//                             </Text>
//                           </div>
//                           <Button 
//                             leftSection={<IconPlus size={14} />}
//                             onClick={handleCreateNew}
//                             size="sm"
//                             color="blue"
//                           >
//                             Add First Book
//                           </Button>
//                         </>
//                       )}
//                     </Stack>
//                   </Table.Td>
//                 </Table.Tr>
//               )}
//             </Table.Tbody>
//           </Table>
//         </Paper>

//         {/* Pagination */}
//         <BooksPagination 
//           total={sortedData.length} 
//           currentPage={currentPage} 
//           onPageChange={setCurrentPage}
//           loading={loading}
//         />
//       </ScrollArea>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         opened={deleteModal}
//         onClose={closeDelete}
//         title="Delete Book"
//         centered
//         size="sm"
//         withCloseButton
//         radius="md"
//         styles={{
//           header: {
//             borderBottom: '1px solid #e2e8f0',
//             paddingBottom: '16px',
//             marginBottom: '16px'
//           },
//           content: {
//             padding: '24px'
//           }
//         }}
//       >
//         <Stack gap="md">
//           <div style={{ textAlign: 'center', padding: '0 16px' }}>
//             <IconTrash size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
//             <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
//               Are you sure you want to delete this book? 
//               <br />
//               <strong style={{ color: 'dark' }}>{deleteBookId}</strong> 
//               <br />
//               This action cannot be undone.
//             </Text>
//           </div>
//           <Group justify="flex-end" gap="md" mt="md">
//             <Button 
//               variant="outline" 
//               onClick={closeDelete}
//               disabled={deleteLoading}
//               size="sm"
//               radius="md"
//               style={{ minWidth: '80px' }}
//             >
//               Cancel
//             </Button>
//             <Button 
//               color="red" 
//               leftSection={<IconTrash size={16} />}
//               onClick={confirmDelete}
//               loading={deleteLoading}
//               disabled={deleteLoading}
//               size="sm"
//               radius="md"
//               style={{ minWidth: '80px' }}
//             >
//               {deleteLoading ? 'Deleting...' : 'Delete'}
//             </Button>
//           </Group>
//         </Stack>
//       </Modal>

//       {/* Edit Book Modal */}
//       <Modal
//         opened={editModal}
//         onClose={handleCancelEdit}
//         title={`Edit Book`}
//         size="xl"
//         withCloseButton
//         radius="md"
//         styles={{
//           header: {
//             borderBottom: '1px solid #e2e8f0',
//             paddingBottom: '16px',
//             marginBottom: '16px'
//           },
//           content: {
//             padding: '24px'
//           }
//         }}
//       >
//         {editingBook && (
//           <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
//             <Stack gap="md">
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Book Title *
//                   </Text>
//                   <MantineTextInput
//                     value={editingBook.title || ''}
//                     onChange={(e) => handleInputChange('title', e.currentTarget.value)}
//                     placeholder="Enter book title"
//                     size="md"
//                     radius="md"
//                     required
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Author Name *
//                   </Text>
//                   <MantineTextInput
//                     value={editingBook.authorName || ''}
//                     onChange={(e) => handleInputChange('authorName', e.currentTarget.value)}
//                     placeholder="Enter author name"
//                     size="md"
//                     radius="md"
//                     required
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Publisher Name *
//                   </Text>
//                   <MantineTextInput
//                     value={editingBook.publisherName || ''}
//                     onChange={(e) => handleInputChange('publisherName', e.currentTarget.value)}
//                     placeholder="Enter publisher name"
//                     size="md"
//                     radius="md"
//                     required
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Genre *
//                   </Text>
//                   <Select
//                     value={editingBook.genre || ''}
//                     onChange={(value) => handleInputChange('genre', value)}
//                     placeholder="Select genre"
//                     size="md"
//                     radius="md"
//                     data={genreOptions}
//                     required
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Price (USD) *
//                   </Text>
//                   <MantineTextInput
//                     type="number"
//                     step="0.01"
//                     value={editingBook.price || ''}
//                     onChange={(e) => handleNumberChange('price', e.currentTarget.value)}
//                     placeholder="0.00"
//                     size="md"
//                     radius="md"
//                     required
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Stock Quantity *
//                   </Text>
//                   <MantineTextInput
//                     type="number"
//                     value={editingBook.stock || ''}
//                     onChange={(e) => handleNumberChange('stock', e.currentTarget.value)}
//                     placeholder="0"
//                     size="md"
//                     radius="md"
//                     required
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div style={{ gridColumn: '1 / -1' }}>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Description
//                   </Text>
//                   <MantineTextInput
//                     component="textarea"
//                     rows={3}
//                     value={editingBook.description || ''}
//                     onChange={(e) => handleInputChange('description', e.currentTarget.value)}
//                     placeholder="Enter book description (optional)"
//                     size="md"
//                     radius="md"
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         minHeight: '80px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Image URL
//                   </Text>
//                   <MantineTextInput
//                     value={editingBook.imageUrl || ''}
//                     onChange={(e) => handleInputChange('imageUrl', e.currentTarget.value)}
//                     placeholder="Enter book image URL (optional)"
//                     size="md"
//                     radius="md"
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
                
//                 <div>
//                   <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
//                     Rating (0-5)
//                   </Text>
//                   <NumberInput
//                     value={editingBook.rating || 0}
//                     onChange={(value) => handleNumberChange('rating', value)}
//                     max={5}
//                     min={0}
//                     step={0.1}
//                     precision={1}
//                     placeholder="0.0"
//                     size="md"
//                     radius="md"
//                     disabled={updateLoading}
//                     styles={{
//                       input: {
//                         border: '1px solid #d1d5db',
//                         padding: '10px 12px',
//                         '&:focus': {
//                           borderColor: '#3b82f6',
//                           boxShadow: '0 0 0 1px #3b82f6',
//                         },
//                       },
//                     }}
//                   />
//                 </div>
//               </div>
              
//               <Divider style={{ margin: '24px 0' }} />
              
//               <Group justify="flex-end" gap="md">
//                 <Button 
//                   variant="outline" 
//                   onClick={handleCancelEdit}
//                   disabled={updateLoading}
//                   size="md"
//                   radius="md"
//                   style={{ 
//                     minWidth: '100px',
//                     border: '1px solid #d1d5db',
//                     height: '40px'
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="submit"
//                   leftSection={<IconEdit size={16} />}
//                   loading={updateLoading}
//                   disabled={updateLoading}
//                   size="md"
//                   radius="md"
//                   style={{ 
//                     minWidth: '140px',
//                     backgroundColor: '#3b82f6',
//                     color: 'white',
//                     height: '40px',
//                     fontWeight: 600
//                   }}
//                 >
//                   {updateLoading ? 'Updating...' : 'Update Book'}
//                 </Button>
//               </Group>
//             </Stack>
//           </Box>
//         )}
//       </Modal>

//       {/* Success/Error Notification */}
//       {notification.message && (
//         <Paper
//           style={{
//             position: 'fixed',
//             bottom: '24px',
//             right: '24px',
//             zIndex: 1000,
//             maxWidth: '400px',
//             width: '100%',
//             boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//             borderRadius: '12px',
//             border: '1px solid transparent',
//             backgroundColor: notification.type === 'success' ? '#f0fdf4' : notification.type === 'error' ? '#fef2f2' : '#fefce8',
//             borderColor: notification.type === 'success' ? '#bbf7d0' : notification.type === 'error' ? '#fecaca' : '#fef08a'
//           }}
//         >
//           <Group justify="apart" align="center" style={{ padding: '16px 20px' }}>
//             <Group gap="xs">
//               {notification.type === 'success' && <IconBook size={18} color="#16a34a" />}
//               {notification.type === 'error' && <IconTrash size={18} color="#dc2626" />}
//               {notification.type === 'warning' && <IconEye size={18} color="#d97706" />}
//               <Text size="sm" fw={500} style={{ 
//                 color: notification.type === 'success' ? '#166534' : notification.type === 'error' ? '#991b1b' : '#92400e'
//               }}>
//                 {notification.message}
//               </Text>
//             </Group>
//             <ActionIcon 
//               variant="transparent" 
//               onClick={() => setNotification({ message: '', type: '' })}
//               size="sm"
//               style={{ color: '#6b7280' }}
//             >
//               <IconDotsVertical size={16} />
//             </ActionIcon>
//           </Group>
//         </Paper>
//       )}
//     </Box>
//   );
// }


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
  IconDownload,
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
  TextInput as MantineTextInput,
  Select,
  NumberInput,
  Paper,
  Avatar,
  Stack,
  Divider,
  Image,
  Badge
} from '@mantine/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../../app/services/baseApiService';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import classes from './TableSort.module.css';


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
      if (key === 'authorName' || key === 'publisherName') {
        return value && value.toString().toLowerCase().includes(query);
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
      
      if (sortBy === 'price' || sortBy === 'stock' || sortBy === 'rating') {
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
function BooksPagination({ total, currentPage, onPageChange, loading }) {
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

export default function BooksTable() {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [viewModal, { open: openView, close: closeView }] = useDisclosure(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
    console.log('📚 Books page loaded, setting up navigation...');
    setNavigation((path) => {
      console.log('📍 Books navigation to:', path);
      router.push(path);
    });
  }, [router]);

  useEffect(() => {
    console.log('📚 Books page initialized, fetching data...');
    fetchBooks();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    console.log('🔄 Starting books fetch...');
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book/all`);
      console.log('📥 Books fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Books fetch failed:', { status: response.status, error: errorText });
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch books: ${response.status} - ${errorText}`);
      }

      const fetchedData = await response.json();
      console.log('✅ Books fetched successfully:', fetchedData);
      
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
        setSortedData(fetchedData);
        console.log(`📊 Loaded ${fetchedData.length} books`);
      } else {
        console.warn('⚠️ Expected array but got:', fetchedData);
        setData([]);
        setSortedData([]);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('💥 Error fetching books:', error);
      setError(error.message || 'Failed to fetch books');
      
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
    console.log('🔄 Manual refresh triggered for books');
    fetchBooks();
  };

  const handleCreateNew = () => {
    console.log('➕ Navigate to create book');
    router.push('/books/create');
  };

  const handleViewDetails = (book) => {
    console.log('👁️ Opening book details modal:', book.id);
    setViewingBook(book);
    openView();
  };

  const handleEdit = (book) => {
    console.log('✏️ Edit book:', book.id);
    setEditingBook({
      ...book,
      price: parseFloat(book.price) || 0,
      stock: parseInt(book.stock) || 0,
      rating: parseFloat(book.rating) || 0
    });
    openEdit();
  };

  const handleDelete = (bookId, bookTitle) => {
    console.log('🗑️ Delete book:', bookId);
    setDeleteBookId(bookId);
    setNotification({ message: `Delete "${bookTitle}"?`, type: 'warning' });
    openDelete();
  };

  const confirmDelete = async () => {
    if (!deleteBookId) return;
    
    setDeleteLoading(true);
    console.log('🗑️ Confirming book deletion:', deleteBookId);
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book/${deleteBookId}`, {
        method: 'DELETE',
      });
      
      console.log('📥 Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to delete book: ${response.status} - ${errorText}`);
      }
      
      console.log('✅ Book deleted successfully');
      setNotification({ message: 'Book deleted successfully!', type: 'success' });
      closeDelete();
      setCurrentPage(1);
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error('💥 Delete error:', error);
      setNotification({ message: `Error deleting book: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingBook) return;
    
    setUpdateLoading(true);
    console.log('✏️ Updating book:', editingBook.id);
    
    const updateData = {
      id: editingBook.id,
      title: editingBook.title.trim(),
      price: parseFloat(editingBook.price) || 0,
      stock: parseInt(editingBook.stock) || 0,
      description: editingBook.description?.trim() || '',
      genre: editingBook.genre?.trim() || '',
      authorId: editingBook.authorId,
      publisherId: editingBook.publisherId,
      imageUrl: editingBook.imageUrl?.trim() || '',
      authorName: editingBook.authorName,
      publisherName: editingBook.publisherName,
      rating: parseFloat(editingBook.rating) || 0
    };
    
    console.log('📋 Update data:', updateData);
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book/${editingBook.id}`, {
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
        throw new Error(`Failed to update book: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Book updated successfully:', data);
      setNotification({ message: `Book "${editingBook.title}" updated successfully!`, type: 'success' });
      closeEdit();
      setEditingBook(null);
      setCurrentPage(1);
      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error('💥 Update error:', error);
      setNotification({ message: `Error updating book: ${error.message}`, type: 'error' });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    closeEdit();
  };

  const handleInputChange = (field, value) => {
    setEditingBook(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field, value) => {
    setEditingBook(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const downloadPDF = () => {
    if (sortedData.length === 0) {
      setNotification({ message: 'No data to export', type: 'error' });
      return;
    }
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Books Inventory Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    autoTable(doc, {
      startY: 35,
      head: [['Title', 'Author', 'Publisher', 'Genre', 'Price', 'Stock', 'Rating']],
      body: sortedData.map(row => [
        row.title || 'N/A', 
        row.authorName || 'N/A', 
        row.publisherName || 'N/A', 
        row.genre || 'N/A', 
        row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'N/A', 
        row.stock || 0,
        row.rating ? `${parseFloat(row.rating).toFixed(1)}/5` : 'N/A'
      ]),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255, 
        fontStyle: 'bold' 
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Title - wider
        4: { halign: 'right' }, // Price - right align
        5: { halign: 'center' }, // Stock - center
        6: { halign: 'center' } // Rating - center
      },
      margin: { top: 40 }
    });
    
    doc.save(`books-inventory-${new Date().toISOString().split('T')[0]}.pdf`);
    console.log('📄 PDF exported successfully');
    setNotification({ message: 'Books inventory exported to PDF!', type: 'success' });
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
            <IconBook size={14} stroke={1.5} />
          </Avatar>
          <div style={{ lineHeight: 1.2 }}>
            <Text fw={600} fz="sm" c="dark" style={{ margin: 0 }}>
              {row.title || 'N/A'}
            </Text>
            {row.description && (
              <Text fz="xs" c="dimmed" style={{ margin: 0 }}>
                {row.description.length > 50 ? `${row.description.substring(0, 50)}...` : row.description}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.authorName || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle' }}>
        <Text fz="sm" c="dark" style={{ margin: 0 }}>
          {row.publisherName || 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle', width: '120px' }}>
        <Badge 
          size="sm" 
          variant="light" 
          color={row.genre ? 'grape' : 'gray'}
          style={{ fontSize: '12px' }}
        >
          {row.genre || 'N/A'}
        </Badge>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle', width: '100px', textAlign: 'right' }}>
        <Text fz="sm" c="dark" fw={500} style={{ margin: 0 }}>
          {row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'N/A'}
        </Text>
      </Table.Td>
      <Table.Td style={{ padding: '8px 8px', verticalAlign: 'middle', width: '80px', textAlign: 'center' }}>
        <Text fz="sm" c={row.stock > 0 ? 'green' : 'red'} fw={500} style={{ margin: 0 }}>
          {row.stock || 0}
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
                onClick={() => handleDelete(row.id, row.title)}
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

  // Genre options for select dropdown
  const genreOptions = [
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Non-Fiction', label: 'Non-Fiction' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Science Fiction', label: 'Science Fiction' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Biography', label: 'Biography' },
    { value: 'History', label: 'History' },
    { value: 'Self-Help', label: 'Self-Help' },
    { value: 'Business', label: 'Business' },
    { value: 'Other', label: 'Other' }
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
              Books Inventory
            </Title>
            <Text c="dimmed" size="sm" style={{ marginTop: '4px' }}>
              Manage your book catalog ({data.length} total)
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
            <ActionIcon 
              size="lg" 
              variant="light" 
              color="green"
              onClick={downloadPDF}
              title="Export to PDF"
              style={{ 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px'
              }}
            >
              <IconDownload size={20} />
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
              Add Book
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
          placeholder="Search books by title, author, publisher, genre..."
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
              Failed to load books
            </Text>
            <Button 
              size="xs" 
              variant="subtle" 
              color="red"
              onClick={fetchBooks}
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
                  sorted={sortBy === 'title'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('title')}
                  style={{ width: '300px', paddingLeft: '16px' }}
                >
                  Title
                </Th>
                <Th 
                  sorted={sortBy === 'authorName'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('authorName')}
                  style={{ width: '150px' }}
                >
                  Author
                </Th>
                <Th 
                  sorted={sortBy === 'publisherName'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('publisherName')}
                  style={{ width: '150px' }}
                >
                  Publisher
                </Th>
                <Th 
                  sorted={sortBy === 'genre'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('genre')}
                  style={{ width: '120px' }}
                >
                  Genre
                </Th>
                <Th 
                  sorted={sortBy === 'price'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('price')}
                  style={{ width: '100px', textAlign: 'right' }}
                >
                  Price
                </Th>
                <Th 
                  sorted={sortBy === 'stock'} 
                  reversed={reverseSortDirection} 
                  onSort={() => setSorting('stock')}
                  style={{ width: '80px', textAlign: 'center' }}
                >
                  Stock
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
                    colSpan={7} 
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
                              No books found
                            </Text>
                            <Text c="dimmed" size="sm">
                              Try adjusting your search terms or clear the search to see all books.
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
                              No books yet
                            </Text>
                            <Text c="dimmed" size="sm">
                              Get started by adding your first book to the catalog.
                            </Text>
                          </div>
                          <Button 
                            leftSection={<IconPlus size={14} />}
                            onClick={handleCreateNew}
                            size="sm"
                            color="blue"
                          >
                            Add First Book
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
        <BooksPagination 
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
        title="Delete Book"
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
              Are you sure you want to delete this book? 
              <br />
              <strong style={{ color: 'dark' }}>{deleteBookId}</strong> 
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

      {/* Edit Book Modal */}
      <Modal
        opened={editModal}
        onClose={handleCancelEdit}
        title={`Edit Book`}
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
        {editingBook && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <Stack gap="md">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                    Book Title *
                  </Text>
                  <MantineTextInput
                    value={editingBook.title || ''}
                    onChange={(e) => handleInputChange('title', e.currentTarget.value)}
                    placeholder="Enter book title"
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
                    Author Name *
                  </Text>
                  <MantineTextInput
                    value={editingBook.authorName || ''}
                    onChange={(e) => handleInputChange('authorName', e.currentTarget.value)}
                    placeholder="Enter author name"
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
                    Publisher Name *
                  </Text>
                  <MantineTextInput
                    value={editingBook.publisherName || ''}
                    onChange={(e) => handleInputChange('publisherName', e.currentTarget.value)}
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
                    Genre *
                  </Text>
                  <Select
                    value={editingBook.genre || ''}
                    onChange={(value) => handleInputChange('genre', value)}
                    placeholder="Select genre"
                    size="md"
                    radius="md"
                    data={genreOptions}
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
                    Price (USD) *
                  </Text>
                  <MantineTextInput
                    type="number"
                    step="0.01"
                    value={editingBook.price || ''}
                    onChange={(e) => handleNumberChange('price', e.currentTarget.value)}
                    placeholder="0.00"
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
                    Stock Quantity *
                  </Text>
                  <MantineTextInput
                    type="number"
                    value={editingBook.stock || ''}
                    onChange={(e) => handleNumberChange('stock', e.currentTarget.value)}
                    placeholder="0"
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
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <Text size="sm" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                    Description
                  </Text>
                  <MantineTextInput
                    component="textarea"
                    rows={3}
                    value={editingBook.description || ''}
                    onChange={(e) => handleInputChange('description', e.currentTarget.value)}
                    placeholder="Enter book description (optional)"
                    size="md"
                    radius="md"
                    disabled={updateLoading}
                    styles={{
                      input: {
                        border: '1px solid #d1d5db',
                        padding: '10px 12px',
                        minHeight: '80px',
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
                    Image URL
                  </Text>
                  <MantineTextInput
                    value={editingBook.imageUrl || ''}
                    onChange={(e) => handleInputChange('imageUrl', e.currentTarget.value)}
                    placeholder="Enter book image URL (optional)"
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
                    Rating (0-5)
                  </Text>
                  <NumberInput
                    value={editingBook.rating || 0}
                    onChange={(value) => handleNumberChange('rating', value)}
                    max={5}
                    min={0}
                    step={0.1}
                    precision={1}
                    placeholder="0.0"
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
                  {updateLoading ? 'Updating...' : 'Update Book'}
                </Button>
              </Group>
            </Stack>
          </Box>
        )}
      </Modal>

      {/* View Book Modal */}
      <Modal
        opened={viewModal}
        onClose={closeView}
        title="Book Details"
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
        {viewingBook && (
          <Stack gap="md">
            <Center>
              <Image
                src={`https://books-api.addispages.com/api/v1/file/${viewingBook.imageUrl.split('/').pop()}`}
                alt={viewingBook.title}
                height={200}
                fit="contain"
                radius="md"
                fallbackSrc="https://via.placeholder.com/200x300?text=No+Image"
              />
            </Center>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text size="sm" fw={500} c="dimmed">ID</Text>
                <Text>{viewingBook.id || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Title</Text>
                <Text>{viewingBook.title || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Author Name</Text>
                <Text>{viewingBook.authorName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Author ID</Text>
                <Text>{viewingBook.authorId || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Publisher Name</Text>
                <Text>{viewingBook.publisherName || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Publisher ID</Text>
                <Text>{viewingBook.publisherId || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Genre</Text>
                <Text>{viewingBook.genre || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Price</Text>
                <Text>{viewingBook.price ? `$${parseFloat(viewingBook.price).toFixed(2)}` : 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Stock</Text>
                <Text>{viewingBook.stock || 0}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Rating</Text>
                <Text>{viewingBook.rating ? `${parseFloat(viewingBook.rating).toFixed(1)}` : 'N/A'}</Text>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Text size="sm" fw={500} c="dimmed">Description</Text>
                <Text>{viewingBook.description || 'N/A'}</Text>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Text size="sm" fw={500} c="dimmed">Image URL</Text>
                <Text truncate="end">{viewingBook.imageUrl || 'N/A'}</Text>
              </div>
              <div>
                <Text size="sm" fw={500} c="dimmed">Created At</Text>
                <Text>{viewingBook.createdAt ? new Date(viewingBook.createdAt).toLocaleString() : 'N/A'}</Text>
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