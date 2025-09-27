
"use client";
import { useState, useEffect } from 'react';
import { TextInput, Button, Notification, Container, FileInput, Title, LoadingOverlay, Box, Alert } from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../services/baseApiService';
import { useRouter } from 'next/navigation';
import { IconUser, IconUpload, IconRefresh, IconMail, IconPhone } from '@tabler/icons-react';

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

export default function AuthorForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  useEffect(() => {
  
    setNavigation((path) => {
    
      router.push(path);
    });
  }, [router]);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError('First name is required.');
      return false;
    }
    if (firstName.length > 50) {
      setError('First name must be 50 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(firstName)) {
      setError('First name cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!lastName.trim()) {
      setError('Last name is required.');
      return false;
    }
    if (lastName.length > 50) {
      setError('Last name must be 50 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(lastName)) {
      setError('Last name cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('A valid email is required.');
      return false;
    }
    if (containsHtmlOrJs(email)) {
      setError('Email cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required.');
      return false;
    }
    if (containsHtmlOrJs(phoneNumber)) {
      setError('Phone number cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!bio.trim()) {
      setError('Author bio is required.');
      return false;
    }
    if (bio.length > 500) {
      setError('Biography must be 500 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(bio)) {
      setError('Biography cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!nationality.trim()) {
      setError('Author nationality is required.');
      return false;
    }
    if (nationality.length > 50) {
      setError('Nationality must be 50 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(nationality)) {
      setError('Nationality cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!age.trim()) {
      setError('Age is required.');
      return false;
    }
    if (isNaN(age) || age < 1 || age > 150) {
      setError('Age must be a number between 1 and 150.');
      return false;
    }
    if (containsHtmlOrJs(age)) {
      setError('Age cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!profilePicture) {
      setError('Please upload a profile picture.');
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
  

    const formData = new FormData();
    const authorData = {
      firstName: sanitizeInput(firstName.trim()),
      lastName: sanitizeInput(lastName.trim()),
      email: sanitizeInput(email.trim()),
      phoneNumber: sanitizeInput(phoneNumber.trim()),
      bio: sanitizeInput(bio.trim()),
      nationality: sanitizeInput(nationality.trim()),
      age: parseInt(sanitizeInput(age.trim())),
    };

  

    const authorBlob = new Blob([JSON.stringify(authorData)], {
      type: "application/json",
    });

    formData.append("author", authorBlob, "author.json");

    if (profilePicture) {
      formData.append("photos", profilePicture);
    
    }

    try {
     
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/create`, {
        method: 'POST',
        body: formData,
      });

      

      if (!response.ok) {
        const errorText = await response.text();
       
        throw new Error(`Failed to create author: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      setNotification({
        message: `Author "${firstName} ${lastName}" created successfully!`,
        type: 'success',
      });

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setBio('');
      setNationality('');
      setAge('');
      setProfilePicture(null);
      setError('');

      // Optionally navigate to authors list
      // router.push('/authors');

    } catch (error) {
     
      setNotification({
        message: `Error creating author: ${error.message}`,
        type: 'error',
      });

      if (error.message.includes('token') || error.message.includes('auth')) {
      
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/authors');
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title ta="left">✍️ ADD NEW AUTHOR</Title>
            <Button
              variant="outline"
              onClick={handleCancel}
              size="sm"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {error && (
            <Alert
              icon="🚨"
              color="red"
              title="Validation Error"
              mb="md"
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <TextInput
              label="First Name"
              value={firstName}
              required
              onChange={(event) => setFirstName(event.currentTarget.value)}
              placeholder="Enter author first name"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('First name') ? error : ''}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Last Name"
              value={lastName}
              required
              onChange={(event) => setLastName(event.currentTarget.value)}
              placeholder="Enter author last name"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('Last name') ? error : ''}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Email"
              value={email}
              required
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="Enter author email"
              rightSection={<IconMail size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('email') ? error : ''}
              disabled={loading}
            />

            <TextInput
              label="Phone Number"
              value={phoneNumber}
              required
              onChange={(event) => setPhoneNumber(event.currentTarget.value)}
              placeholder="Enter author phone number"
              rightSection={<IconPhone size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('Phone number') ? error : ''}
              disabled={loading}
            />

            <TextInput
              label="Nationality"
              value={nationality}
              required
              onChange={(event) => setNationality(event.currentTarget.value)}
              placeholder="Enter author nationality"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('nationality') ? error : ''}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Age"
              value={age}
              required
              onChange={(event) => setAge(event.currentTarget.value)}
              placeholder="Enter author age"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('Age') ? error : ''}
              disabled={loading}
              type="number"
              min={1}
              max={150}
            />

            <div style={{ gridColumn: 'span 2' }}>
              <TextInput
                label="Author Bio"
                value={bio}
                required
                onChange={(event) => setBio(event.currentTarget.value)}
                placeholder="Enter author biography"
                rightSection={<IconUser size={20} />}
                style={{ maxWidth: 800, marginTop: 10 }}
                error={error.includes('bio') ? error : ''}
                multiline
                rows={4}
                disabled={loading}
                maxLength={500}
              />
            </div>

            <FileInput
              label="Profile Picture"
              placeholder="Upload author photo (JPG, PNG)"
              accept="image/jpeg,image/png"
              onChange={setProfilePicture}
              value={profilePicture}
              required
              rightSection={<IconUpload size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('picture') ? error : ''}
              disabled={loading}
            />

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 20 }}>
              <Button
                type="submit"
                size="lg"
                leftSection={<IconUser size={20} />}
                loading={loading}
                disabled={loading}
                style={{ minWidth: 150 }}
              >
                {loading ? 'Creating...' : 'Create Author'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
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
    </Box>
  );
}