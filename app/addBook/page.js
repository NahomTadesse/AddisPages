"use client";

import { useEffect, useState } from 'react';
import { Autocomplete, TextInput, Button, Notification, Container, Title, FileInput, LoadingOverlay } from '@mantine/core';
import Cookies from 'js-cookie';
import { IconBook, IconMoney, IconStock, IconDescription, IconGenre, IconUser, IconUpload, IconWriting, IconList, IconCash, IconStack } from '@tabler/icons-react'; 
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
  const [authorArray, setAuthotArray] = useState([]);
  const userD = JSON.parse(Cookies.get('userData'));
  const [publisher, setPublisher] = useState();
  const [author, setAuthor] = useState();
  const [visible, { toggle }] = useDisclosure(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchAuthors();
    fetchPublisher();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/author', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); 
      setAuthotArray(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchPublisher = async () => {
    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/publisher', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); 
      setPublisherArray(data);
    } catch (error) {
      console.error('Error fetching publishers:', error);
    }
  };

  const uniquePublisher = publisherArray && publisherArray.map(pub => ({
    value: pub.id,
    label: `${pub.name}` 
  }));

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
    if (!title || !description || !genre || !authorId || !publisherId || price <= 0 || stock < 0) {
      setError('Please fill out all fields correctly.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
    toggle();
  
    const formData = new FormData();
    const bookData = { title, price, stock, description, genre, authorId, publisherId };
    const bookBlob = new Blob([JSON.stringify(bookData)], { type: "application/json" });
    formData.append("book", bookBlob, "book.json");

    if (profilePicture) {
      formData.append('photos', profilePicture);
    } else {
      console.error('No image file selected.');
      return; 
    }

    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/book', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userD.access_token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
      setNotification({ message: 'Book created successfully!', type: 'success' });
    } catch (error) {
      console.error('Error:', error);
      setNotification({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      toggle();
    }
  };

  return (
    <div style={{ marginLeft: 10, marginTop: 45 }}>
      <Container size={1000} my={0}>
        <Title ta="left">ADD BOOK</Title>
        {error && (
          <Notification color="red" title="Error" onClose={() => setError('')}>
            {error}
          </Notification>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <TextInput
            label="Title"
            value={title}
            required
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="Enter book title"
            rightSection={<IconBook size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <TextInput
            label="Price"
            type="number"
            value={price}
            required
            onChange={(event) => setPrice(event.currentTarget.value)}
            placeholder="Enter book price"
            rightSection={<IconCash size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <TextInput
            label="Stock"
            type="number"
            value={stock}
            required
            onChange={(event) => setStock(event.currentTarget.value)}
            placeholder="Enter stock quantity"
            rightSection={<IconStack size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <TextInput
            label="Description"
            value={description}
            required
            onChange={(event) => setDescription(event.currentTarget.value)}
            placeholder="Enter book description"
            rightSection={<IconWriting size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
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
          />
          <Autocomplete
            label="Author"
            data={authorArray.map(author => author.name)}
            value={author}
            required
            onChange={(value) => {
              const selectedAuthor = authorArray.find(author => author.name === value);
              setAuthorId(selectedAuthor ? selectedAuthor.id : '');
              setAuthor(selectedAuthor ? selectedAuthor.name : '');
            }}
            placeholder="Select author"
            rightSection={<IconUser size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <Autocomplete
            label="Publisher"
            data={uniquePublisher}
            value={publisher}
            required
            onChange={(value) => {
              const selectedPublisher = uniquePublisher.find(pub => pub.label === value);
              setPublisherId(selectedPublisher ? selectedPublisher.value : '');
              setPublisher(selectedPublisher ? selectedPublisher.label : '');
            }}
            placeholder="Select publisher"
            rightSection={<IconUser size={20} />}
            style={{ maxWidth: 300, height: 50 }}
          />
          <FileInput
            label="Upload Book Cover"
            placeholder="Upload picture"
            accept="image/*"
            onChange={setProfilePicture}
            required
            rightSection={<IconUpload size={20} />}
            style={{ maxWidth: 300 }}
          />
          <Button type="submit" style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>Create</Button>
        </form>

        {/* Notification rendering */}
        {notification.message && (
          <Notification
            color={notification.type === 'success' ? 'green' : 'red'}
            onClose={() => setNotification({ message: '', type: '' })}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            {notification.message}
          </Notification>
        )}
      </Container>
    </div>
  );
};