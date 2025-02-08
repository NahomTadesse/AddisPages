"use client";
// import { useState } from 'react';
// import { Autocomplete, TextInput, Button } from '@mantine/core';

// export default function BookForm () {
//   const [title, setTitle] = useState('');
//   const [price, setPrice] = useState(0);
//   const [stock, setStock] = useState(0);
//   const [description, setDescription] = useState('');
//   const [genre, setGenre] = useState('');
//   const [authorId, setAuthorId] = useState('');
//   const [publisherId, setPublisherId] = useState('');

//   const authors = [
//     { id: "e8ca4992-e50d-4e23-af60-df407c23689c", name: "test2" }
//   ];

//   const publishers = [
//     { id: "3aa57522-39ba-4db1-be8f-dc990aaf01f1", name: "string" },
//     { id: "40f0a3ea-709f-454f-a897-63e7a4337dee", name: "string" },
//     { id: "e0ebda1d-dc3c-4d9a-83fe-3576a25b69b9", name: "string" },
//     { id: "3b98788b-5c8d-4c44-98bb-83e16d88113e", name: "string" },
//     { id: "7a486ee9-c5f8-4a51-8019-043e5484cb98", name: "string" }
//   ];

//   const genres = ['horror', 'comedy', 'sifi'];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch('https://books-api.addispages.com/api/v1/book', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         title,
//         price,
//         stock,
//         description,
//         genre,
//         authorId,
//         publisherId,
//       }),
//     });

//     const data = await response.json();
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextInput
//         label="Title"
//         value={title}
//         onChange={(event) => setTitle(event.currentTarget.value)}
//       />
//       <TextInput
//         label="Price"
//         type="number"
//         value={price}
//         onChange={(event) => setPrice(event.currentTarget.value)}
//       />
//       <TextInput
//         label="Stock"
//         type="number"
//         value={stock}
//         onChange={(event) => setStock(event.currentTarget.value)}
//       />
//       <TextInput
//         label="Description"
//         value={description}
//         onChange={(event) => setDescription(event.currentTarget.value)}
//       />
//       <Autocomplete
//         label="Genre"
//         data={genres}
//         value={genre}
//         onChange={setGenre}
//       />
//       <Autocomplete
//         label="Author"
//         data={authors.map((author) => author.name)}
//         value={authorId}
//         onChange={setAuthorId}
//       />
//       <Autocomplete
//         label="Publisher"
//         data={publishers.map((publisher) => publisher.name)}
//         value={publisherId}
//         onChange={setPublisherId}
//       />
//       <Button type="submit">Submit</Button>
//     </form>
//   );
// };



import { useEffect, useState } from 'react';
import { Autocomplete, TextInput, Button, Notification ,
  Container,Title ,FileInput,LoadingOverlay} from '@mantine/core';

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
  const [publisherArray , setPublisherArray] = useState([])
  const [authorArray , setAuthotArray] = useState([])

  const [publisher , setPublisher] = useState()
  const [author , setAuthor] = useState()
  const [visible, { toggle }] = useDisclosure(false);

useEffect(()=>{
  fetchAuthors();
  fetchPublisher();
},[])

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
      setAuthotArray(data)
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
      setPublisherArray(data)
    } catch (error) {
      console.error('Error fetching authors:', error);
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
  // const genres = ['horror', 'comedy', 'sifi'];

  const validateForm = () => {
    if (!title || !description || !genre || !authorId || !publisherId || price <= 0 || stock < 0) {
      setError('Please fill out all fields correctly.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    console.log('heyyy',publisherId)
    e.preventDefault();

    if (!validateForm()) return;
    toggle()
    const response = await fetch('https://books-api.addispages.com/api/v1/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        price,
        stock,
        description,
        genre,
        authorId,
        publisherId,
        profilePicture
      }),
    });

    const data = await response.json();
    console.log(data);
    toggle()
  };

  const orderItem = async ()=>{
    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/orderItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWhvbXRhZGVzc2UxMUBnbWFpbC5jb20iLCJpYXQiOjE3MzkwNDg2MjMsImV4cCI6MTczOTEzNTAyM30.7no4AQe9_kLc7lewn7AFh1eVqFQ41cmeR4s07fW4pyc"
        },
        body: JSON.stringify(
          [
            {
             
              "quantity": 1,
              "amount": 2,
              "bookId": "9d734255-ad30-4c59-82ab-4959fd6e148d",
              "unitPrice": 20,
              "totalPrice": 20,
              "userId": "88f7cbe7-214d-4512-8bc1-7dd1c34a0c16"
              
            }
          ]
        ),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); 
      setPublisherArray(data)
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  }

  return (
    <div style={{marginLeft:10,marginTop:45}}>

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
            setAuthor(selectedAuthor ? selectedAuthor.name : '')
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
            setPublisher(selectedPublisher ? selectedPublisher.label : '')
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

        <Button onClick={orderItem} style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>test</Button>
      </form>
    </Container>
    </div>
  );
};

