"use client";
import { useState } from 'react';
import { TextInput, Button, Notification, Container,FileInput , Title,LoadingOverlay,Box } from '@mantine/core';
import { IconUser,IconUpload } from '@tabler/icons-react';
import Cookies from 'js-cookie';
export default function AuthorForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [error, setError] = useState('');
  const userD = JSON.parse(Cookies.get('userData'))
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
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
  
    setLoading(true);
  
    const formData = new FormData();
  
  
    const authorData = {
      name: name,
      bio: bio,
      nationality: nationality,
    };
  

    const authorBlob = new Blob([JSON.stringify(authorData)], {
      type: "application/json",
    });

    formData.append("author", authorBlob, "author.json");
  
    
    if (profilePicture) {
      formData.append("photos", profilePicture);
    } else {
      console.error('No profile picture selected.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/author', {
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
      setNotification({ message: 'Author created successfully!', type: 'success' });
    } catch (error) {
      console.error('Error:', error);
      setNotification({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };




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
             <FileInput
              label="Upload Profile Picture"
              placeholder="Upload picture"
              accept="image/*"
              onChange={setProfilePicture}
              required
              rightSection={<IconUpload size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
          <Button type="submit" style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>
            Create
          </Button>


        </form>
      </Container>
    </div>
    </Box>
  );
}