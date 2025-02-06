"use client";
import { useState } from 'react';
import { Container, TextInput, Button, Title, FileInput, Group, Grid } from '@mantine/core';
import { IconHome, IconImageInPicture, IconLock, IconMail, IconPhoneCall, IconUpload, IconUser } from '@tabler/icons-react';

export default function AdminRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [document, setDocument] = useState(null);

  const handleSubmit = () => {
    console.log('Admin Registration:', { name, email, password, phone, address, profilePicture, document });
    // Here you can handle the submission, e.g., send to an API
  };

  return (
    <Container style={{marginTop:45}}>
      <Title order={2}>Admin Registration</Title>
      <Grid>
        <Grid.Col span={5}>
          <TextInput
            label="Name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Enter your name"
            required
            rightSection={<IconUser size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <TextInput
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Enter your email"
            required
            type="email"
            rightSection={<IconMail size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <TextInput
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            placeholder="Enter your password"
            required
            type="password"
            rightSection={<IconLock size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <TextInput
            label="Phone Number"
            value={phone}
            onChange={(event) => setPhone(event.currentTarget.value)}
            placeholder="Enter your phone number"
            required
            rightSection={<IconPhoneCall size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <TextInput
            label="Address"
            value={address}
            onChange={(event) => setAddress(event.currentTarget.value)}
            placeholder="Enter your address"
            required
            rightSection={<IconHome size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <FileInput
            label="Upload Document"
            accept=".pdf,.doc,.docx"
            placeholder='Upload Document'
            onChange={setDocument}
            required
            rightSection={<IconUpload size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <FileInput
            label="Upload Profile Picture"
            placeholder='Upload Your Picture'
            accept="image/*"
            onChange={setProfilePicture}
            required
            rightSection={<IconImageInPicture size={20} />}
            style={{ maxWidth:300,marginTop: 10 }}
          />
        </Grid.Col>
      </Grid>

      <Group position="right" mt="md">
        <Button onClick={handleSubmit}>Register</Button>
      </Group>
    </Container>
  );
};