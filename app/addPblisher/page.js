"use client";
import { useState } from 'react';
import { TextInput, Button, Notification, Container, Title } from '@mantine/core';
import { IconUser ,IconMail , IconPhone , IconAddressBook , IconBook, IconPhoneCall, IconHome, IconHome2 } from '@tabler/icons-react';

export default function PublisherForm() {
  const [name, setName] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [addressType, setAddressType] = useState('');
  const [error, setError] = useState('');

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

    const response = await fetch('https://books-api.addispages.com/api/v1/publisher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        address: {
          currentAddress,
          permanentAddress,
          phoneNumber,
          email,
          idDocumentUrl,
          addressType,
        },
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div style={{ marginLeft: 10, marginTop: 45 }}>
      <Container size={1000} my={0}>
        <Title ta="left">ADD PUBLISHER</Title>
        {error && (
          <Notification color="red" title="Error" onClose={() => setError('')}>
            {error}
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
          <Button type="submit" style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>
            Create
          </Button>
        </form>
      </Container>
    </div>
  );
}