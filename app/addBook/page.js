

// "use client";

// import { useEffect, useState } from 'react';
// import { Autocomplete, TextInput, Button, Notification, Container, Title, FileInput, LoadingOverlay, Alert } from '@mantine/core';
// import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../../app/services/baseApiService';
// import { useRouter } from 'next/navigation';
// import { IconBook, IconMoney, IconStock, IconDescription, IconGenre, IconUser, IconUpload, IconWriting, IconList, IconCash, IconStack, IconRefresh } from '@tabler/icons-react'; 
// import { useDisclosure } from '@mantine/hooks';

// export default function BookForm() {
//   const [title, setTitle] = useState('');
//   const [price, setPrice] = useState('');
//   const [stock, setStock] = useState(1);
//   const [description, setDescription] = useState('');
//   const [genre, setGenre] = useState('');
//   const [authorId, setAuthorId] = useState('');
//   const [publisherId, setPublisherId] = useState('');
//   const [error, setError] = useState('');
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [publisherArray, setPublisherArray] = useState([]);
//   const [authorArray, setAuthotArray] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState({ message: '', type: '' });
//   const [fetchingAuthors, setFetchingAuthors] = useState(false);
//   const [fetchingPublishers, setFetchingPublishers] = useState(false);
//   const [authorsError, setAuthorsError] = useState('');
//   const [publishersError, setPublishersError] = useState('');
//   const [author, setAuthor] = useState();
//   const [publisher, setPublisher] = useState();
//   const [visible, { toggle }] = useDisclosure(false);
//   const router = useRouter();

//   // Set up navigation for the auth service
//   useEffect(() => {
//     console.log('📖 Book form loaded, setting up navigation...');
//     setNavigation((path) => {
//       console.log('📍 Book form navigation to:', path);
//       router.push(path);
//     });
//   }, [router]);

//   useEffect(() => {
//     console.log('📖 Book form initialized, fetching dropdown data...');
//     fetchAuthors();
//     fetchPublishers();
//   }, []);

//   const fetchAuthors = async () => {
//     setFetchingAuthors(true);
//     setAuthorsError('');
//     console.log('🔄 Starting authors fetch for dropdown...');
    
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/all`);
//       console.log('📥 Authors fetch response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Authors fetch failed:', { status: response.status, error: errorText });
        
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please log in again.');
//         }
//         throw new Error(`Failed to fetch authors: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('✅ Authors fetched for dropdown:', data);
      
//       if (Array.isArray(data)) {
//         setAuthotArray(data);
//         console.log(`📊 Loaded ${data.length} authors for dropdown`);
//       } else {
//         console.warn('⚠️ Expected array but got:', data);
//         setAuthotArray([]);
//         setAuthorsError('Invalid authors data received');
//       }
//     } catch (error) {
//       console.error('💥 Error fetching authors:', error);
//       setAuthorsError(error.message || 'Failed to fetch authors');
      
//       // If it's an auth error, the token service should have already handled navigation
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setFetchingAuthors(false);
//     }
//   };

//   const fetchPublishers = async () => {
//     setFetchingPublishers(true);
//     setPublishersError('');
//     console.log('🔄 Starting publishers fetch for dropdown...');
    
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`);
//       console.log('📥 Publishers fetch response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Publishers fetch failed:', { status: response.status, error: errorText });
        
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please log in again.');
//         }
//         throw new Error(`Failed to fetch publishers: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('✅ Publishers fetched for dropdown:', data);
      
//       if (Array.isArray(data)) {
//         setPublisherArray(data);
//         console.log(`📊 Loaded ${data.length} publishers for dropdown`);
//       } else {
//         console.warn('⚠️ Expected array but got:', data);
//         setPublisherArray([]);
//         setPublishersError('Invalid publishers data received');
//       }
//     } catch (error) {
//       console.error('💥 Error fetching publishers:', error);
//       setPublishersError(error.message || 'Failed to fetch publishers');
      
//       // If it's an auth error, the token service should have already handled navigation
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setFetchingPublishers(false);
//     }
//   };

//   const uniquePublisher = publisherArray.map(pub => ({
//     value: pub.id,
//     label: `${pub.name}` 
//   }));

//   const genres = [
//     "Literary Fiction",
//     "Mystery",
//     "Thriller",
//     "Fantasy",
//     "Science Fiction",
//     "Historical Fiction",
//     "Romance",
//     "Horror",
//     "Adventure",
//     "Dystopian",
//     "Biography",
//     "Autobiography",
//     "Self-Help",
//     "Travel",
//     "Cookbooks",
//     "History",
//     "Science and Nature",
//     "Politics",
//     "Business and Economics",
//     "Graphic Novels",
//     "Poetry",
//     "Children's Literature",
//     "Young Adult"
//   ];

//   const validateForm = () => {
//     if (!title.trim()) {
//       setError('Book title is required.');
//       return false;
//     }
//     if (!price || parseFloat(price) <= 0) {
//       setError('Price must be a positive number.');
//       return false;
//     }
//     if (!stock || stock < 0) {
//       setError('Stock must be 0 or greater.');
//       return false;
//     }
//     if (!description.trim()) {
//       setError('Description is required.');
//       return false;
//     }
//     if (!genre.trim()) {
//       setError('Genre is required.');
//       return false;
//     }
//     if (!authorId) {
//       setError('Please select an author.');
//       return false;
//     }
//     if (!publisherId) {
//       setError('Please select a publisher.');
//       return false;
//     }
//     if (!profilePicture) {
//       setError('Please upload a book cover image.');
//       return false;
//     }
    
//     setError('');
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('📝 Book form submission started...');
  
//     if (!validateForm()) {
//       console.log('❌ Form validation failed');
//       return;
//     }
    
//     setLoading(true);
//     toggle();
//     console.log('📤 Preparing book data for submission...');

//     const formData = new FormData();
//     const bookData = { 
//       title: title.trim(), 
//       price: parseFloat(price), 
//       stock: parseInt(stock), 
//       description: description.trim(), 
//       genre: genre.trim(), 
//       authorId, 
//       publisherId 
//     };
    
//     console.log('📋 Book data to submit:', bookData);
    
//     const bookBlob = new Blob([JSON.stringify(bookData)], { type: "application/json" });
//     formData.append("book", bookBlob, "book.json");

//     if (profilePicture) {
//       formData.append('photos', profilePicture);
//       console.log('🖼️ Image file added to form data:', profilePicture.name);
//     }

//     try {
//       console.log('🚀 Submitting book creation request...');
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book`, {
//         method: 'POST',
//         body: formData,
//       });
  
//       console.log('📥 Book creation response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Book creation failed:', { status: response.status, error: errorText });
//         throw new Error(`Failed to create book: ${response.status} - ${errorText}`);
//       }
  
//       const data = await response.json();
//       console.log('✅ Book created successfully:', data);
      
//       setNotification({ 
//         message: `Book "${title}" created successfully!`, 
//         type: 'success' 
//       });
      
//       // Reset form
//       setTitle('');
//       setPrice('');
//       setStock(1);
//       setDescription('');
//       setGenre('');
//       setAuthorId('');
//       setPublisherId('');
//       setProfilePicture(null);
//       setAuthor('');
//       setPublisher('');
      
//       // Optionally navigate to books list
//       // router.push('/books');
      
//     } catch (error) {
//       console.error('💥 Book creation error:', error);
//       setNotification({ 
//         message: `Error creating book: ${error.message}`, 
//         type: 'error' 
//       });
      
//       // If it's an auth error, the token service should have already handled navigation
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setLoading(false);
//       toggle();
//     }
//   };

//   const handleAuthorChange = (value) => {
//     const selectedAuthor = authorArray.find(author => author.name === value);
//     if (selectedAuthor) {
//       setAuthorId(selectedAuthor.id);
//       setAuthor(selectedAuthor.name);
//       console.log('👤 Author selected:', selectedAuthor.name, 'ID:', selectedAuthor.id);
//     } else {
//       setAuthorId('');
//       setAuthor('');
//     }
//   };

//   const handlePublisherChange = (value) => {
//     const selectedPublisher = uniquePublisher.find(pub => pub.label === value);
//     if (selectedPublisher) {
//       setPublisherId(selectedPublisher.value);
//       setPublisher(selectedPublisher.label);
//       console.log('🏢 Publisher selected:', selectedPublisher.label, 'ID:', selectedPublisher.value);
//     } else {
//       setPublisherId('');
//       setPublisher('');
//     }
//   };

//   const handleRefreshDropdowns = () => {
//     console.log('🔄 Manual refresh of dropdown data triggered');
//     fetchAuthors();
//     fetchPublishers();
//   };

//   return (
//     <div style={{ marginLeft: 10, marginTop: 45 }}>
//       <LoadingOverlay
//         visible={loading}
//         zIndex={1000}
//         overlayProps={{ radius: 'sm', blur: 2 }}
//         loaderProps={{ color: 'blue', type: 'bars' }}
//       />
      
//       <Container size={1000} my={0}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//           <Title ta="left">📖 ADD NEW BOOK</Title>
//           <Button
//             variant="subtle"
//             leftSection={<IconRefresh size={16} />}
//             onClick={handleRefreshDropdowns}
//             loading={fetchingAuthors || fetchingPublishers}
//             disabled={fetchingAuthors || fetchingPublishers}
//             size="sm"
//           >
//             {fetchingAuthors || fetchingPublishers ? 'Loading...' : 'Refresh Data'}
//           </Button>
//         </div>

//         {/* Authors Error */}
//         {authorsError && (
//           <Alert 
//             icon="🚨"
//             color="red" 
//             title="Authors Loading Error"
//             mb="md"
//           >
//             <Text size="sm">{authorsError}</Text>
//             <Button 
//               size="xs" 
//               variant="subtle" 
//               color="red" 
//               mt="xs"
//               onClick={fetchAuthors}
//               leftSection={<IconRefresh size={14} />}
//             >
//               Retry
//             </Button>
//           </Alert>
//         )}

//         {/* Publishers Error */}
//         {publishersError && (
//           <Alert 
//             icon="🚨"
//             color="red" 
//             title="Publishers Loading Error"
//             mb="md"
//           >
//             <Text size="sm">{publishersError}</Text>
//             <Button 
//               size="xs" 
//               variant="subtle" 
//               color="red" 
//               mt="xs"
//               onClick={fetchPublishers}
//               leftSection={<IconRefresh size={14} />}
//             >
//               Retry
//             </Button>
//           </Alert>
//         )}

//         {error && (
//           <Notification 
//             color="red" 
//             title="Validation Error" 
//             onClose={() => setError('')}
//             mb="md"
//           >
//             {error}
//           </Notification>
//         )}

//         <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
//           <TextInput
//             label="Book Title"
//             value={title}
//             required
//             onChange={(event) => setTitle(event.currentTarget.value)}
//             placeholder="Enter book title"
//             rightSection={<IconBook size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('title') ? error : ''}
//           />
          
//           <TextInput
//             label="Price"
//             type="number"
//             step="0.01"
//             min="0"
//             value={price}
//             required
//             onChange={(event) => setPrice(event.currentTarget.value)}
//             placeholder="0.00"
//             rightSection={<IconCash size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('price') ? error : ''}
//           />
          
//           <TextInput
//             label="Stock Quantity"
//             type="number"
//             min="0"
//             value={stock}
//             required
//             onChange={(event) => setStock(parseInt(event.currentTarget.value) || 0)}
//             placeholder="0"
//             rightSection={<IconStack size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('stock') ? error : ''}
//           />
          
//           <Autocomplete
//             label="Genre"
//             data={genres}
//             value={genre}
//             required
//             onChange={setGenre}
//             placeholder="Select genre"
//             rightSection={<IconList size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('genre') ? error : ''}
//           />
          
//           <Autocomplete
//             label="Author"
//             data={authorArray.map(author => author.name)}
//             value={author || ''}
//             required
//             onChange={handleAuthorChange}
//             placeholder="Select author"
//             rightSection={<IconUser size={20} />}
//             disabled={authorArray.length === 0 || fetchingAuthors}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('author') ? error : ''}
//             rightSection={
//               fetchingAuthors ? (
//                 <IconRefresh size={16} className="animate-spin" />
//               ) : (
//                 <IconUser size={20} />
//               )
//             }
//           />
          
//           <Autocomplete
//             label="Publisher"
//             data={uniquePublisher.map(pub => pub.label)}
//             value={publisher || ''}
//             required
//             onChange={handlePublisherChange}
//             placeholder="Select publisher"
//             disabled={publisherArray.length === 0 || fetchingPublishers}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('publisher') ? error : ''}
//             rightSection={
//               fetchingPublishers ? (
//                 <IconRefresh size={16} className="animate-spin" />
//               ) : (
//                 <IconUser size={20} />
//               )
//             }
//           />
          
//           <TextInput
//             label="Description"
//             value={description}
//             required
//             onChange={(event) => setDescription(event.currentTarget.value)}
//             placeholder="Enter book description"
//             rightSection={<IconWriting size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('description') ? error : ''}
//             multiline
//             rows={3}
//           />
          
//           <FileInput
//             label="Book Cover Image"
//             placeholder="Upload book cover (JPG, PNG)"
//             accept="image/jpeg,image/png"
//             onChange={setProfilePicture}
//             value={profilePicture}
//             required
//             rightSection={<IconUpload size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('image') ? error : ''}
//           />
          
//           <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 20 }}>
//             <Button 
//               type="submit" 
//               size="lg"
//               leftSection={<IconBook size={20} />}
//               loading={loading}
//               disabled={loading}
//               style={{ minWidth: 150 }}
//             >
//               {loading ? 'Creating...' : 'Create Book'}
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={() => router.push('/books')}
//               size="lg"
//               disabled={loading}
//               style={{ minWidth: 150 }}
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>

//         {/* Success/Error Notification */}
//         {notification.message && (
//           <Notification
//             color={notification.type === 'success' ? 'green' : 'red'}
//             title={notification.type === 'success' ? 'Success' : 'Error'}
//             onClose={() => setNotification({ message: '', type: '' })}
//             style={{
//               position: 'fixed',
//               bottom: 20,
//               right: 20,
//               zIndex: 1000,
//               maxWidth: 400,
//             }}
//             withCloseButton
//             withBorder
//           >
//             {notification.message}
//           </Notification>
//         )}
//       </Container>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from 'react';
import { Autocomplete, TextInput, Textarea, Text, Button, Notification, Container, Title, FileInput, LoadingOverlay, Alert } from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../../app/services/baseApiService';
import { useRouter } from 'next/navigation';
import { IconBook, IconMoney, IconStock, IconDescription, IconGenre, IconUser, IconUpload, IconWriting, IconList, IconCash, IconStack, IconRefresh, IconBuilding } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export default function BookForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [publisherArray, setPublisherArray] = useState([]);
  const [authorArray, setAuthorArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [fetchingAuthors, setFetchingAuthors] = useState(false);
  const [fetchingPublishers, setFetchingPublishers] = useState(false);
  const [authorsError, setAuthorsError] = useState('');
  const [publishersError, setPublishersError] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [visible, { toggle }] = useDisclosure(false);
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
    console.log('📖 Book form loaded, setting up navigation...');
    setNavigation((path) => {
      console.log('📍 Book form navigation to:', path);
      router.push(path);
    });
  }, [router]);

  useEffect(() => {
    console.log('📖 Book form initialized, fetching dropdown data...');
    fetchAuthors();
    fetchPublishers();
  }, []);

  const fetchAuthors = async () => {
    setFetchingAuthors(true);
    setAuthorsError('');
    console.log('🔄 Starting authors fetch for dropdown...');
    
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/all`);
      console.log('📥 Authors fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Authors fetch failed:', { status: response.status, error: errorText });
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch authors: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Authors fetched for dropdown:', data);
      
      if (Array.isArray(data)) {
        // Filter out invalid authors (null/undefined, missing id/firstName/lastName, or empty names)
        const cleanedData = data.filter(author => 
          author && 
          typeof author === 'object' && 
          author.id && 
          author.firstName && 
          author.lastName && 
          typeof author.firstName === 'string' && 
          typeof author.lastName === 'string' && 
          `${author.firstName} ${author.lastName}`.trim() !== ''
        );
        setAuthorArray(cleanedData);
        console.log(`📊 Loaded ${cleanedData.length} valid authors for dropdown (filtered from ${data.length})`);
        if (cleanedData.length < data.length) {
          console.warn('⚠️ Filtered out invalid authors:', data.length - cleanedData.length);
        }
      } else {
        console.warn('⚠️ Expected array but got:', data);
        setAuthorArray([]);
        setAuthorsError('Invalid authors data received');
      }
    } catch (error) {
      console.error('💥 Error fetching authors:', error);
      setAuthorsError(error.message || 'Failed to fetch authors');
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setFetchingAuthors(false);
    }
  };

  const fetchPublishers = async () => {
    setFetchingPublishers(true);
    setPublishersError('');
    console.log('🔄 Starting publishers fetch for dropdown...');
    
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

      const data = await response.json();
      console.log('✅ Publishers fetched for dropdown:', data);
      
      if (Array.isArray(data)) {
        const cleanedData = data.filter(pub => 
          pub && 
          typeof pub === 'object' && 
          pub.id && 
          pub.name && 
          typeof pub.name === 'string' && 
          pub.name.trim() !== ''
        );
        setPublisherArray(cleanedData);
        console.log(`📊 Loaded ${cleanedData.length} valid publishers for dropdown (filtered from ${data.length})`);
        if (cleanedData.length < data.length) {
          console.warn('⚠️ Filtered out invalid publishers:', data.length - cleanedData.length);
        }
      } else {
        console.warn('⚠️ Expected array but got:', data);
        setPublisherArray([]);
        setPublishersError('Invalid publishers data received');
      }
    } catch (error) {
      console.error('💥 Error fetching publishers:', error);
      setPublishersError(error.message || 'Failed to fetch publishers');
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setFetchingPublishers(false);
    }
  };

  // NEW: Combine firstName and lastName for display in Autocomplete
  const authorNames = authorArray.map(author => 
    `${author?.firstName || ''} ${author?.lastName || ''}`.trim()
  ).filter(name => name.trim() !== '');
  const uniquePublisher = publisherArray.map(pub => ({
    value: pub.id,
    label: `${pub.name}` 
  })).filter(pub => pub.value && pub.label.trim() !== '');
  const publisherLabels = uniquePublisher.map(pub => pub.label).filter(label => label.trim() !== '');

  const genres = [
    "Literary Fiction",
    "Mystery",
    "Thriller",
    "Fantasy",
    "Science Fiction",
    "Historical Fiction",
    "Romance",
    "Horror",
    "Adventure",
    "Dystopian",
    "Biography",
    "Autobiography",
    "Self-Help",
    "Travel",
    "Cookbooks",
    "History",
    "Science and Nature",
    "Politics",
    "Business and Economics",
    "Graphic Novels",
    "Poetry",
    "Children's Literature",
    "Young Adult"
  ];

  const validateForm = () => {
    if (!title.trim()) {
      setError('Book title is required.');
      return false;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Price must be a positive number.');
      return false;
    }
    if (!stock || stock < 0) {
      setError('Stock must be 0 or greater.');
      return false;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return false;
    }
    if (!genre.trim()) {
      setError('Genre is required.');
      return false;
    }
    if (!authorId) {
      setError('Please select an author.');
      return false;
    }
    if (!publisherId) {
      setError('Please select a publisher.');
      return false;
    }
    if (!profilePicture) {
      setError('Please upload a book cover image.');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Book form submission started...');
  
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    setLoading(true);
    toggle();
    console.log('📤 Preparing book data for submission...');

    const formData = new FormData();
    const bookData = { 
      title: title.trim(), 
      price: parseFloat(price), 
      stock: parseInt(stock), 
      description: description.trim(), 
      genre: genre.trim(), 
      authorId, 
      publisherId 
    };
    
    console.log('📋 Book data to submit:', bookData);
    
    const bookBlob = new Blob([JSON.stringify(bookData)], { type: "application/json" });
    formData.append("book", bookBlob, "book.json");

    if (profilePicture) {
      formData.append('photos', profilePicture);
      console.log('🖼️ Image file added to form data:', profilePicture.name);
    }

    try {
      console.log('🚀 Submitting book creation request...');
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book`, {
        method: 'POST',
        body: formData,
      });
  
      console.log('📥 Book creation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Book creation failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to create book: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log('✅ Book created successfully:', data);
      
      setNotification({ 
        message: `Book "${title}" created successfully!`, 
        type: 'success' 
      });
      
      // Reset form
      setTitle('');
      setPrice('');
      setStock(1);
      setDescription('');
      setGenre('');
      setAuthorId('');
      setPublisherId('');
      setProfilePicture(null);
      setAuthor('');
      setPublisher('');
      
    } catch (error) {
      console.error('💥 Book creation error:', error);
      setNotification({ 
        message: `Error creating book: ${error.message}`, 
        type: 'error' 
      });
      
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setLoading(false);
      toggle();
    }
  };

  const handleAuthorChange = (value) => {
    // NEW: Match combined firstName and lastName
    const selectedAuthor = authorArray.find(author => 
      `${author.firstName} ${author.lastName}`.trim() === value
    );
    if (selectedAuthor) {
      setAuthorId(selectedAuthor.id);
      setAuthor(`${selectedAuthor.firstName} ${selectedAuthor.lastName}`.trim());
      console.log('👤 Author selected:', `${selectedAuthor.firstName} ${selectedAuthor.lastName}`, 'ID:', selectedAuthor.id);
    } else {
      setAuthorId('');
      setAuthor('');
    }
  };

  const handlePublisherChange = (value) => {
    const selectedPublisher = uniquePublisher.find(pub => pub.label === value);
    if (selectedPublisher) {
      setPublisherId(selectedPublisher.value);
      setPublisher(selectedPublisher.label);
      console.log('🏢 Publisher selected:', selectedPublisher.label, 'ID:', selectedPublisher.value);
    } else {
      setPublisherId('');
      setPublisher('');
    }
  };

  const handleRefreshDropdowns = () => {
    console.log('🔄 Manual refresh of dropdown data triggered');
    fetchAuthors();
    fetchPublishers();
  };

  return (
    <div style={{ marginLeft: 10, marginTop: 45 }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />
      
      <Container size={1000} my={0}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title ta="left">📖 ADD NEW BOOK</Title>
          <Button
            variant="subtle"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRefreshDropdowns}
            loading={fetchingAuthors || fetchingPublishers}
            disabled={fetchingAuthors || fetchingPublishers}
            size="sm"
          >
            {fetchingAuthors || fetchingPublishers ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Authors Error */}
        {authorsError && (
          <Alert 
            icon="🚨"
            color="red" 
            title="Authors Loading Error"
            mb="md"
          >
            <Text size="sm">{authorsError}</Text>
            <Button 
              size="xs" 
              variant="subtle" 
              color="red" 
              mt="xs"
              onClick={fetchAuthors}
              leftSection={<IconRefresh size={14} />}
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Publishers Error */}
        {publishersError && (
          <Alert 
            icon="🚨"
            color="red" 
            title="Publishers Loading Error"
            mb="md"
          >
            <Text size="sm">{publishersError}</Text>
            <Button 
              size="xs" 
              variant="subtle" 
              color="red" 
              mt="xs"
              onClick={fetchPublishers}
              leftSection={<IconRefresh size={14} />}
            >
              Retry
            </Button>
          </Alert>
        )}

        {error && (
          <Notification 
            color="red" 
            title="Validation Error" 
            onClose={() => setError('')}
            mb="md"
          >
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <TextInput
            label="Book Title"
            value={title}
            required
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="Enter book title"
            rightSection={<IconBook size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('title') ? error : ''}
          />
          
          <TextInput
            label="Price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            required
            onChange={(event) => setPrice(event.currentTarget.value)}
            placeholder="0.00"
            rightSection={<IconCash size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('price') ? error : ''}
          />
          
          <TextInput
            label="Stock Quantity"
            type="number"
            min="0"
            value={stock}
            required
            onChange={(event) => setStock(parseInt(event.currentTarget.value) || 0)}
            placeholder="0"
            rightSection={<IconStack size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('stock') ? error : ''}
          />
          
          <Autocomplete
            label="Genre"
            data={genres}
            value={genre}
            required
            onChange={setGenre}
            placeholder="Select genre"
            rightSection={<IconList size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('genre') ? error : ''}
          />
          
          <Autocomplete
            label="Author"
            data={authorNames}
            value={author || ''}
            required
            onChange={handleAuthorChange}
            placeholder="Select author"
            rightSection={<IconUser size={20} />}
            disabled={authorNames.length === 0 || fetchingAuthors}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('author') ? error : ''}
          />
          
          <Autocomplete
            label="Publisher"
            data={publisherLabels}
            value={publisher || ''}
            required
            onChange={handlePublisherChange}
            placeholder="Select publisher"
            disabled={publisherLabels.length === 0 || fetchingPublishers}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('publisher') ? error : ''}
            rightSection={
              fetchingPublishers ? (
                <IconRefresh size={16} className="animate-spin" />
              ) : (
                <IconBuilding size={20} />
              )
            }
          />
          
          <Textarea
            label="Description"
            value={description}
            required
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Enter book description"
            rightSection={<IconWriting size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('description') ? error : ''}
            minRows={3}
            autosize
          />
          
          <FileInput
            label="Book Cover Image"
            placeholder="Upload book cover (JPG, PNG)"
            accept="image/jpeg,image/png"
            onChange={setProfilePicture}
            value={profilePicture}
            required
            rightSection={<IconUpload size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
            error={error.includes('image') ? error : ''}
          />
          
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 20 }}>
            <Button 
              type="submit" 
              size="lg"
              leftSection={<IconBook size={20} />}
              loading={loading}
              disabled={loading}
              style={{ minWidth: 150 }}
            >
              {loading ? 'Creating...' : 'Create Book'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/books')}
              size="lg"
              disabled={loading}
              style={{ minWidth: 150 }}
            >
              Cancel
            </Button>
          </div>
        </form>

        {notification.message && (
          <Notification
            color={notification.type === 'success' ? 'green' : 'red'}
            title={notification.type === 'success' ? 'Success' : 'Error'}
            onClose={() => setNotification({ message: '', type: '' })}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
              maxWidth: 400,
            }}
            withCloseButton
            withBorder
          >
            {notification.message}
          </Notification>
        )}
      </Container>
    </div>
  );
}