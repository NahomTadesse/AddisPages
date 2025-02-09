"use client";
import { useState } from 'react';
import { TextInput, Button, Notification, Container, Title,LoadingOverlay,Box } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import Cookies from 'js-cookie';
export default function AuthorForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [error, setError] = useState('');
  const userD = JSON.parse(Cookies.get('userData'))

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !bio || !nationality) {
      setError('Please fill out all required fields correctly.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true)

    const response = await fetch('https://books-api.addispages.com/api/v1/author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization : userD.access_token
      },
      body: JSON.stringify({
        name : name,
        bio : bio,
        nationality : nationality,
      }),
    });

    const data = await response.json();
    console.log(data);
    setLoading(false)
  };


  
  const orderBook = async()=>{
    const quantity = 1

    try {
        const response = await fetch('https://books-api.addispages.com/api/v1/orderItem', {
            method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization : userD.access_token
          },
  body: JSON.stringify(
    [
        {
         
                  quantity:quantity,
                  amount: 2,
                  bookId: "9d734255-ad30-4c59-82ab-4959fd6e148d",
                  unitPrice: 20,
                  totalPrice: 20,
                  userId: "88f7cbe7-214d-4512-8bc1-7dd1c34a0c16"
         
        }
      ]

),
        
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
         if(responseData !=[]){
           
            // setBooks(responseData)
        }
       
        console.log('User created successfully:', responseData);
        
    
       
      } catch (error) {
        console.error('Error creating user:', error);
        
      
      }
}

  return (

    <Box pos="relative">
    <LoadingOverlay
  visible={loading}
  zIndex={1000}
  overlayProps={{ radius: 'sm', blur: 2 }}
  loaderProps={{ color: 'blue', type: 'bars' }}
/>
    <div style={{ marginLeft: 10, marginTop: 45 }}>
      <Container size={1000} my={0}>
        <Title ta="left">ADD AUTHOR</Title>
        {error && (
          <Notification color="red" title="Error" onClose={() => setError('')}>
            {error}
          </Notification>
        )}
        <form onSubmit={handleSubmit} style={{ }}>
          <TextInput
            label="Author Name"
            value={name}
            required
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Enter author name"
            rightSection={<IconUser size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <TextInput
            label="Bio"
            value={bio}
            required
            onChange={(event) => setBio(event.currentTarget.value)}
            placeholder="Enter author bio"
            rightSection={<IconUser size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <TextInput
            label="Nationality"
            value={nationality}
            required
            onChange={(event) => setNationality(event.currentTarget.value)}
            placeholder="Enter author nationality"
            rightSection={<IconUser size={20} />}
            style={{ maxWidth: 300, marginTop: 10 }}
          />
          <Button type="submit" style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>
            Create
          </Button>



          <Button onClick={orderBook} style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>
            Create
          </Button>
        </form>
      </Container>
    </div>
    </Box>
  );
}