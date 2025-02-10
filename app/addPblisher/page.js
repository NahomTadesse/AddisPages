"use client";

import { useState } from 'react';
import { TextInput, Button, LoadingOverlay, FileInput, Box, Notification, Container, Title } from '@mantine/core';
import { IconUser, IconMail, IconPhone, IconAddressBook, IconBook, IconPhoneCall, IconHome, IconHome2, IconUpload } from '@tabler/icons-react';
import Cookies from 'js-cookie';

export default function PublisherForm() {
  const [name, setName] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [addressType, setAddressType] = useState('');
  const [error, setError] = useState('');
  const userD = JSON.parse(Cookies.get('userData'));
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const validateForm = () => {
    if (!name || !currentAddress || !phoneNumber || !email || !addressType) {
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
    const publisherData = {
      name: name,
      address: {
        currentAddress: currentAddress,
        permanentAddress: permanentAddress,
        phoneNumber: phoneNumber,
        email: email,
        idDocumentUrl: idDocumentUrl,
        addressType: addressType,
      },
    };

    const publisherBlob = new Blob([JSON.stringify(publisherData)], {
      type: "application/json",
    });

    formData.append("publisher", publisherBlob, "publisher.json");

    if (profilePicture) {
      formData.append("photos", profilePicture);
    } else {
      console.error('No document file selected.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/publisher', {
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
      setNotification({ message: 'Publisher created successfully!', type: 'success' });
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
          <Title ta="left">ADD PUBLISHER</Title>
          {error && (
            <Notification color="red" title="Error" onClose={() => setError('')}>
              {error}
            </Notification>
          )}
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
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <TextInput
              label="Publisher Name"
              value={name}
              required
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Enter publisher name"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
            <TextInput
              label="Current Address"
              value={currentAddress}
              required
              onChange={(event) => setCurrentAddress(event.currentTarget.value)}
              placeholder="Enter current address"
              rightSection={<IconHome2 size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
            <TextInput
              label="Permanent Address"
              value={permanentAddress}
              onChange={(event) => setPermanentAddress(event.currentTarget.value)}
              placeholder="Enter permanent address"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              required
              onChange={(event) => setPhoneNumber(event.currentTarget.value)}
              placeholder="Enter phone number"
              rightSection={<IconPhoneCall size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
            <TextInput
              label="Email"
              value={email}
              required
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="Enter email address"
              rightSection={<IconMail size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
            <TextInput
              label="ID Document URL"
              value={idDocumentUrl}
              onChange={(event) => setIdDocumentUrl(event.currentTarget.value)}
              placeholder="Enter ID document URL"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 300, marginTop: 10 }}
            />
            <TextInput
              label="Address Type"
              value={addressType}
              required
              onChange={(event) => setAddressType(event.currentTarget.value)}
              placeholder="Enter address type"
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