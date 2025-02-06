"use client";
import { useState } from 'react';
import { TextInput, Button, Notification, Container, Title } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

export default function AuthorForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [error, setError] = useState('');

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

    const response = await fetch('https://books-api.addispages.com/api/v1/author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with your actual token
      },
      body: JSON.stringify({
        name,
        bio,
        nationality,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
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
        </form>
      </Container>
    </div>
  );
}