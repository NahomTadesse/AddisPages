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



import { useState } from 'react';
import { Autocomplete, TextInput, Button, Notification , Container,Title } from '@mantine/core';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [error, setError] = useState('');

  const authors = [
    { id: "e8ca4992-e50d-4e23-af60-df407c23689c", name: "test2" }
  ];

  const publishers = [
    { id: "3aa57522-39ba-4db1-be8f-dc990aaf01f1", name: "string" },
    { id: "40f0a3ea-709f-454f-a897-63e7a4337dee", name: "string" },
    { id: "e0ebda1d-dc3c-4d9a-83fe-3576a25b69b9", name: "string" },
    { id: "3b98788b-5c8d-4c44-98bb-83e16d88113e", name: "string" },
    { id: "7a486ee9-c5f8-4a51-8019-043e5484cb98", name: "string" }
  ];

  const uniquePublisherNames = [...new Set(publishers.map(publisher => publisher.name))];

  const genres = ['horror', 'comedy', 'sifi'];

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
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div style={{marginLeft:10,marginTop:45}}>

<Container size={1000} my={0}>
            <Title ta="left" >
                ADD BOOK
            </Title>
      {error && (
        <Notification color="red" title="Error" onClose={() => setError('')}>
          {error}
        </Notification>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <TextInput
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="Enter book title"
          style={{ maxWidth: 300,  marginTop:10 }}
        />
        <TextInput
          label="Price"
          type="number"
          value={price}
          onChange={(event) => setPrice(event.currentTarget.value)}
          placeholder="Enter book price"
          style={{ maxWidth: 300,  marginTop:10 }}
        />
        <TextInput
          label="Stock"
          type="number"
          value={stock}
          onChange={(event) => setStock(event.currentTarget.value)}
          placeholder="Enter stock quantity"
          style={{ maxWidth: 300,  marginTop:10 }}
        />
        <TextInput
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          placeholder="Enter book description"
          style={{ maxWidth: 300,  marginTop:10 }}
        />
        <Autocomplete
          label="Genre"
          data={genres}
          value={genre}
          onChange={setGenre}
          placeholder="Select genre"
          style={{ maxWidth: 300, marginTop:10}}
        />
        <Autocomplete
          label="Author"
          data={authors.map(author => author.name)}
          value={authorId}
          onChange={setAuthorId}
          placeholder="Select author"
          style={{ maxWidth: 300, marginTop:10 }}
        />
        <Autocomplete
          label="Publisher"
          data={uniquePublisherNames}
          value={publisherId}
          onChange={setPublisherId}
          placeholder="Select publisher"
          style={{ maxWidth: 300, height: 50 }}
        />
        <Button type="submit" style={{ gridColumn: 'span 2', maxWidth: 300, height: 50,marginTop:50 }}>Submit</Button>
      </form>
      </Container>
    </div>
  );
};

export default BookForm;