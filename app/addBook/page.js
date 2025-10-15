

// "use client";

// import { useEffect, useState } from 'react';
// import { Autocomplete, TextInput, Textarea, Text, Button, Notification, Container, Title, FileInput, LoadingOverlay, Alert } from '@mantine/core';
// import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../../app/services/baseApiService';
// import { useRouter } from 'next/navigation';
// import { IconBook, IconMoney, IconStock, IconDescription, IconGenre, IconUser, IconUpload, IconWriting, IconList, IconCash, IconStack, IconRefresh, IconBuilding } from '@tabler/icons-react';
// import { useDisclosure } from '@mantine/hooks';
// import tokenService from '../../app/services/tokenService';

// // Function to sanitize input to prevent script injection and HTML tags
// const sanitizeInput = (input) => {
//   if (!input) return input;
//   return input
//     .replace(/<[^>]*>/g, '')
//     .replace(/&[^;]+;/g, '')
//     .replace(/javascript:/gi, '')
//     .replace(/on\w+="[^"]*"/gi, '');
// };

// // Function to validate if input contains HTML or JavaScript
// const containsHtmlOrJs = (input) => {
//   if (!input) return false;
//   const htmlJsRegex = /<|>|\bon\w+=|javascript:/i;
//   return htmlJsRegex.test(input);
// };

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
//   const [authorArray, setAuthorArray] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState({ message: '', type: '' });
//   const [fetchingAuthors, setFetchingAuthors] = useState(false);
//   const [fetchingPublishers, setFetchingPublishers] = useState(false);
//   const [authorsError, setAuthorsError] = useState('');
//   const [publishersError, setPublishersError] = useState('');
//   const [author, setAuthor] = useState('');
//   const [publisher, setPublisher] = useState('');
//   const [visible, { toggle }] = useDisclosure(false);
//   const router = useRouter();

//   useEffect(() => {
//     setNavigation((path) => router.push(path));
//     fetchAuthors();
//     fetchPublishers();
//   }, [router]);

//   const fetchAuthors = async () => {
//     setFetchingAuthors(true);
//     setAuthorsError('');
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/all`);
//       if (!response.ok) {
//         const errorText = await response.text();
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please log in again.');
//         }
//         throw new Error(`Failed to fetch authors: ${response.status} - ${errorText}`);
//       }
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         const cleanedData = data.filter(author =>
//           author &&
//           typeof author === 'object' &&
//           author.id &&
//           author.firstName &&
//           author.lastName &&
//           typeof author.firstName === 'string' &&
//           typeof author.lastName === 'string' &&
//           `${author.firstName} ${author.lastName}`.trim() !== ''
//         );
//         setAuthorArray(cleanedData);
//       } else {
//         setAuthorArray([]);
//         setAuthorsError('Invalid authors data received');
//       }
//     } catch (error) {
//       setAuthorsError(error.message || 'Failed to fetch authors');
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         return;
//       }
//     } finally {
//       setFetchingAuthors(false);
//     }
//   };

//   const fetchPublishers = async () => {
//     setFetchingPublishers(true);
//     setPublishersError('');
//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`);
//       if (!response.ok) {
//         const errorText = await response.text();
//         if (response.status === 401) {
//           throw new Error('Authentication failed. Please log in again.');
//         }
//         throw new Error(`Failed to fetch publishers: ${response.status} - ${errorText}`);
//       }
//       const data = await response.json();
//       if (Array.isArray(data)) {
//         const cleanedData = data.filter(pub =>
//           pub &&
//           typeof pub === 'object' &&
//           pub.id &&
//           pub.name &&
//           typeof pub.name === 'string' &&
//           pub.name.trim() !== ''
//         );
//         setPublisherArray(cleanedData);
//       } else {
//         setPublisherArray([]);
//         setPublishersError('Invalid publishers data received');
//       }
//     } catch (error) {
//       setPublishersError(error.message || 'Failed to fetch publishers');
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         return;
//       }
//     } finally {
//       setFetchingPublishers(false);
//     }
//   };

//   const authorNames = authorArray.map(author =>
//     `${author?.firstName || ''} ${author?.lastName || ''}`.trim()
//   ).filter(name => name.trim() !== '');
//   const uniquePublisher = publisherArray.map(pub => ({
//     value: pub.id,
//     label: `${pub.name}`
//   })).filter(pub => pub.value && pub.label.trim() !== '');
//   const publisherLabels = uniquePublisher.map(pub => pub.label).filter(label => label.trim() !== '');

//   const genres = [
//     "Literary Fiction", "Mystery", "Thriller", "Fantasy", "Science Fiction",
//     "Historical Fiction", "Romance", "Horror", "Adventure", "Dystopian",
//     "Biography", "Autobiography", "Self-Help", "Travel", "Cookbooks",
//     "History", "Science and Nature", "Politics", "Business and Economics",
//     "Graphic Novels", "Poetry", "Children's Literature", "Young Adult"
//   ];

//   const validateForm = () => {
//     if (!title) {
//       setError('Book title is required.');
//       return false;
//     }
//     if (title.length > 16) {
//       setError('Book title must be 16 characters or less.');
//       return false;
//     }
//     if (containsHtmlOrJs(title)) {
//       setError('Book title cannot contain HTML or JavaScript code.');
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
//     if (!description) {
//       setError('Description is required.');
//       return false;
//     }
//     if (containsHtmlOrJs(description)) {
//       setError('Description cannot contain HTML or JavaScript code.');
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

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     toggle();

//     const formData = new FormData();
//     const bookData = {
//       title: sanitizeInput(title),
//       price: parseFloat(price),
//       stock: parseInt(stock),
//       description: sanitizeInput(description),
//       genre: genre.trim(),
//       authorId,
//       publisherId,
//     };

//     const bookBlob = new Blob([JSON.stringify(bookData)], { type: 'application/json' });
//     formData.append('book', bookBlob, 'book.json');

//     if (profilePicture) {
//       formData.append('photos', profilePicture);
//     }

//     try {
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to create book: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       setNotification({
//         message: `Book "${sanitizeInput(title)}" created successfully!`,
//         type: 'success',
//       });

//       // Check role and call /store-books if role is 'store'
//       const authData = tokenService.getAuthData();
//       if (authData && authData.role === 'store') {
//         const storeId = authData.storeId || '1a39084f-46be-4ad6-850f-c11ad3d8198d';
//         const storeBookData = {
//           storeId,
//           bookId: data.data.id,
//           price: data.data.price,
//           stock: data.data.stock,
//         };

//         try {
//           const storeBookResponse = await authenticatedFetch(`https://books-api.addispages.com/api/store-books`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': '*/*',
//             },
//             body: JSON.stringify(storeBookData),
//           });

//           if (!storeBookResponse.ok) {
//             const errorText = await storeBookResponse.text();
//             throw new Error(`Failed to add book to store: ${storeBookResponse.status} - ${errorText}`);
//           }

//           setNotification({
//             message: `Book "${sanitizeInput(title)}" created and added to store successfully!`,
//             type: 'success',
//           });
//         } catch (storeError) {
//           setNotification({
//             message: `Book created, but failed to add to store: ${storeError.message}`,
//             type: 'error',
//           });
//           if (storeError.message.includes('token') || storeError.message.includes('auth')) {
//             router.push('/login');
//             return;
//           }
//         }
//       }

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

//     } catch (error) {
//       setNotification({
//         message: `Error creating book: ${error.message}`,
//         type: 'error',
//       });
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         router.push('/login');
//         return;
//       }
//     } finally {
//       setLoading(false);
//       toggle();
//     }
//   };

//   const handleAuthorChange = (value) => {
//     const selectedAuthor = authorArray.find(author =>
//       `${author.firstName} ${author.lastName}`.trim() === value
//     );
//     if (selectedAuthor) {
//       setAuthorId(selectedAuthor.id);
//       setAuthor(`${selectedAuthor.firstName} ${selectedAuthor.lastName}`.trim());
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
//     } else {
//       setPublisherId('');
//       setPublisher('');
//     }
//   };

//   const handleRefreshDropdowns = () => {
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
//             maxLength={16}
//             onChange={(event) => setTitle(sanitizeInput(event.currentTarget.value))}
//             placeholder="Enter book title (max 16 chars)"
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
//             data={authorNames}
//             value={author || ''}
//             required
//             onChange={handleAuthorChange}
//             placeholder="Select author"
//             rightSection={<IconUser size={20} />}
//             disabled={authorNames.length === 0 || fetchingAuthors}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('author') ? error : ''}
//           />
//           <Autocomplete
//             label="Publisher"
//             data={publisherLabels}
//             value={publisher || ''}
//             required
//             onChange={handlePublisherChange}
//             placeholder="Select publisher"
//             disabled={publisherLabels.length === 0 || fetchingPublishers}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('publisher') ? error : ''}
//             rightSection={
//               fetchingPublishers ? (
//                 <IconRefresh size={16} className="animate-spin" />
//               ) : (
//                 <IconBuilding size={20} />
//               )
//             }
//           />
//           <Textarea
//             label="Description"
//             value={description}
//             required
//             onChange={(event) => setDescription(sanitizeInput(event.currentTarget.value))}
//             placeholder="Enter book description"
//             rightSection={<IconWriting size={20} />}
//             style={{ maxWidth: 300, marginTop: 10 }}
//             error={error.includes('description') ? error : ''}
//             minRows={3}
//             autosize
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
import Cookies from 'js-cookie';

// Function to sanitize input to prevent script injection and HTML tags
const sanitizeInput = (input) => {
  if (!input) return input;
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

// Function to validate if input contains HTML or JavaScript
const containsHtmlOrJs = (input) => {
  if (!input) return false;
  const htmlJsRegex = /<|>|\bon\w+=|javascript:/i;
  return htmlJsRegex.test(input);
};

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

  useEffect(() => {
    setNavigation((path) => router.push(path));
    fetchAuthors();
    fetchPublishers();
  }, [router]);

  const fetchAuthors = async () => {
    setFetchingAuthors(true);
    setAuthorsError('');
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/authors/all`);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch authors: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
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
      } else {
        setAuthorArray([]);
        setAuthorsError('Invalid authors data received');
      }
    } catch (error) {
      setAuthorsError(error.message || 'Failed to fetch authors');
      if (error.message.includes('token') || error.message.includes('auth')) {
        return;
      }
    } finally {
      setFetchingAuthors(false);
    }
  };

  const fetchPublishers = async () => {
    setFetchingPublishers(true);
    setPublishersError('');
    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch publishers: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
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
      } else {
        setPublisherArray([]);
        setPublishersError('Invalid publishers data received');
      }
    } catch (error) {
      setPublishersError(error.message || 'Failed to fetch publishers');
      if (error.message.includes('token') || error.message.includes('auth')) {
        return;
      }
    } finally {
      setFetchingPublishers(false);
    }
  };

  const authorNames = authorArray.map(author =>
    `${author?.firstName || ''} ${author?.lastName || ''}`.trim()
  ).filter(name => name.trim() !== '');
  const uniquePublisher = publisherArray.map(pub => ({
    value: pub.id,
    label: `${pub.name}`
  })).filter(pub => pub.value && pub.label.trim() !== '');
  const publisherLabels = uniquePublisher.map(pub => pub.label).filter(label => label.trim() !== '');

  const genres = [
    "Literary Fiction", "Mystery", "Thriller", "Fantasy", "Science Fiction",
    "Historical Fiction", "Romance", "Horror", "Adventure", "Dystopian",
    "Biography", "Autobiography", "Self-Help", "Travel", "Cookbooks",
    "History", "Science and Nature", "Politics", "Business and Economics",
    "Graphic Novels", "Poetry", "Children's Literature", "Young Adult"
  ];

  const validateForm = () => {
    if (!title) {
      setError('Book title is required.');
      return false;
    }
    if (title.length > 16) {
      setError('Book title must be 16 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(title)) {
      setError('Book title cannot contain HTML or JavaScript code.');
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
    if (!description) {
      setError('Description is required.');
      return false;
    }
    if (containsHtmlOrJs(description)) {
      setError('Description cannot contain HTML or JavaScript code.');
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    toggle();

    const formData = new FormData();
    const bookData = {
      title: sanitizeInput(title),
      price: parseFloat(price),
      stock: parseInt(stock),
      description: sanitizeInput(description),
      genre: genre.trim(),
      authorId,
      publisherId,
    };

    const bookBlob = new Blob([JSON.stringify(bookData)], { type: 'application/json' });
    formData.append('book', bookBlob, 'book.json');

    if (profilePicture) {
      formData.append('photos', profilePicture);
    }

    try {
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/book`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create book: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setNotification({
        message: `Book "${sanitizeInput(title)}" created successfully!`,
        type: 'success',
      });

      // Check role and call /store-books if role is 'STORE'
      const authDataString = Cookies.get('auth_data');
      let authData = null;
      try {
        authData = authDataString ? JSON.parse(authDataString) : null;
      } catch (parseError) {
        setNotification({
          message: `Error parsing authentication data: ${parseError.message}`,
          type: 'error',
        });
        setLoading(false);
        toggle();
        return;
      }

      if (authData && authData.role === 'STORE') {
        const storeId = authData.storeId || '1a39084f-46be-4ad6-850f-c11ad3d8198d';
        const storeBookData = {
          storeId,
          bookId: data.data.id,
          price: data.data.price,
          stock: data.data.stock,
        };

        try {
          const storeBookResponse = await authenticatedFetch(`https://books-api.addispages.com/api/store-books`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
            },
            body: JSON.stringify(storeBookData),
          });

          if (!storeBookResponse.ok) {
            const errorText = await storeBookResponse.text();
            throw new Error(`Failed to add book to store: ${storeBookResponse.status} - ${errorText}`);
          }

          setNotification({
            message: `Book "${sanitizeInput(title)}" created and added to store successfully!`,
            type: 'success',
          });
        } catch (storeError) {
          setNotification({
            message: `Book created, but failed to add to store: ${storeError.message}`,
            type: 'error',
          });
          if (storeError.message.includes('token') || storeError.message.includes('auth')) {
            router.push('/login');
            return;
          }
        }
      }

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
      setNotification({
        message: `Error creating book: ${error.message}`,
        type: 'error',
      });
      if (error.message.includes('token') || error.message.includes('auth')) {
        router.push('/login');
        return;
      }
    } finally {
      setLoading(false);
      toggle();
    }
  };

  const handleAuthorChange = (value) => {
    const selectedAuthor = authorArray.find(author =>
      `${author.firstName} ${author.lastName}`.trim() === value
    );
    if (selectedAuthor) {
      setAuthorId(selectedAuthor.id);
      setAuthor(`${selectedAuthor.firstName} ${selectedAuthor.lastName}`.trim());
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
    } else {
      setPublisherId('');
      setPublisher('');
    }
  };

  const handleRefreshDropdowns = () => {
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
            maxLength={16}
            onChange={(event) => setTitle(sanitizeInput(event.currentTarget.value))}
            placeholder="Enter book title (max 16 chars)"
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
            onChange={(event) => setDescription(sanitizeInput(event.currentTarget.value))}
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