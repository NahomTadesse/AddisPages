// "use client";

// import { useState } from 'react';
// import { TextInput, Button, LoadingOverlay, FileInput, Box, Notification, Container, Title } from '@mantine/core';
// import { IconUser, IconMail, IconPhone, IconAddressBook, IconBook, IconPhoneCall, IconHome, IconHome2, IconUpload } from '@tabler/icons-react';
// import Cookies from 'js-cookie';

// export default function PublisherForm() {
//   const [name, setName] = useState('');
//   const [currentAddress, setCurrentAddress] = useState('');
//   const [permanentAddress, setPermanentAddress] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [idDocumentUrl, setIdDocumentUrl] = useState('');
//   const [addressType, setAddressType] = useState('');
//   const [error, setError] = useState('');
//   const userD = JSON.parse(Cookies.get('userData'));
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState({ message: '', type: '' });

//   const validateForm = () => {
//     if (!name || !currentAddress || !phoneNumber || !email || !addressType) {
//       setError('Please fill out all required fields correctly.');
//       return false;
//     }
//     setError('');
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);

//     const formData = new FormData();
//     const publisherData = {
//       name: name,
//       address: {
//         currentAddress: currentAddress,
//         permanentAddress: permanentAddress,
//         phoneNumber: phoneNumber,
//         email: email,
//         idDocumentUrl: idDocumentUrl,
//         addressType: addressType,
//       },
//     };

//     const publisherBlob = new Blob([JSON.stringify(publisherData)], {
//       type: "application/json",
//     });

//     formData.append("publisher", publisherBlob, "publisher.json");

//     if (profilePicture) {
//       formData.append("photos", profilePicture);
//     } else {
//       console.error('No document file selected.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('https://books-api.addispages.com/api/v1/publisher', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${userD.access_token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log('Success:', data);
//       setNotification({ message: 'Publisher created successfully!', type: 'success' });
//     } catch (error) {
//       console.error('Error:', error);
//       setNotification({ message: `Error: ${error.message}`, type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box pos="relative">
//       <LoadingOverlay
//         visible={loading}
//         zIndex={1000}
//         overlayProps={{ radius: 'sm', blur: 2 }}
//         loaderProps={{ color: 'blue', type: 'bars' }}
//       />

//       <div style={{ marginLeft: 10, marginTop: 45 }}>
//         <Container size={1000} my={0}>
//           <Title ta="left">ADD PUBLISHER</Title>
//           {error && (
//             <Notification color="red" title="Error" onClose={() => setError('')}>
//               {error}
//             </Notification>
//           )}
//           {notification.message && (
//             <Notification
//               color={notification.type === 'success' ? 'green' : 'red'}
//               onClose={() => setNotification({ message: '', type: '' })}
//               style={{
//                 position: 'fixed',
//                 bottom: 20,
//                 right: 20,
//                 zIndex: 1000,
//               }}
//             >
//               {notification.message}
//             </Notification>
//           )}
//           <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
//             <TextInput
//               label="Publisher Name"
//               value={name}
//               required
//               onChange={(event) => setName(event.currentTarget.value)}
//               placeholder="Enter publisher name"
//               rightSection={<IconUser size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <TextInput
//               label="Current Address"
//               value={currentAddress}
//               required
//               onChange={(event) => setCurrentAddress(event.currentTarget.value)}
//               placeholder="Enter current address"
//               rightSection={<IconHome2 size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <TextInput
//               label="Permanent Address"
//               value={permanentAddress}
//               onChange={(event) => setPermanentAddress(event.currentTarget.value)}
//               placeholder="Enter permanent address"
//               rightSection={<IconHome size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <TextInput
//               label="Phone Number"
//               value={phoneNumber}
//               required
//               onChange={(event) => setPhoneNumber(event.currentTarget.value)}
//               placeholder="Enter phone number"
//               rightSection={<IconPhoneCall size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <TextInput
//               label="Email"
//               value={email}
//               required
//               onChange={(event) => setEmail(event.currentTarget.value)}
//               placeholder="Enter email address"
//               rightSection={<IconMail size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <TextInput
//               label="ID Document URL"
//               value={idDocumentUrl}
//               onChange={(event) => setIdDocumentUrl(event.currentTarget.value)}
//               placeholder="Enter ID document URL"
//               rightSection={<IconUser size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <TextInput
//               label="Address Type"
//               value={addressType}
//               required
//               onChange={(event) => setAddressType(event.currentTarget.value)}
//               placeholder="Enter address type"
//               rightSection={<IconUser size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <FileInput
//               label="Upload Profile Picture"
//               placeholder="Upload picture"
//               accept="image/*"
//               onChange={setProfilePicture}
//               required
//               rightSection={<IconUpload size={20} />}
//               style={{ maxWidth: 300, marginTop: 10 }}
//             />
//             <Button type="submit" style={{ gridColumn: 'span 2', maxWidth: 200, height: 50, marginTop: 20 }}>
//               Create
//             </Button>
//           </form>
//         </Container>
//       </div>
//     </Box>
//   );
// }


"use client";

import { useState,useEffect } from 'react';
import { TextInput, Button, LoadingOverlay, FileInput, Box, Notification, Container, Title, Alert, Select } from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../services/baseApiService';
import { useRouter } from 'next/navigation';
import { IconUser, IconMail, IconPhone, IconAddressBook, IconBook, IconPhoneCall, IconHome, IconHome2, IconUpload, IconRefresh } from '@tabler/icons-react';

export default function PublisherForm() {
  const [name, setName] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [addressType, setAddressType] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
    console.log('🏢 Publisher form loaded, setting up navigation...');
    setNavigation((path) => {
      console.log('📍 Publisher form navigation to:', path);
      router.push(path);
    });
  }, [router]);

  const addressTypes = [
    { value: 'business', label: 'Business' },
    { value: 'residential', label: 'Residential' },
    { value: 'p_o_box', label: 'P.O. Box' },
  ];

  const validateForm = () => {
    if (!name.trim()) {
      setError('Publisher name is required.');
      return false;
    }
    if (!currentAddress.trim()) {
      setError('Current address is required.');
      return false;
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required.');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return false;
    }
    if (!addressType) {
      setError('Address type is required.');
      return false;
    }
    if (!profilePicture) {
      setError('Please upload a profile picture.');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number.');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🏢 Publisher form submission started...');

    if (!validateForm()) {
      console.log('❌ Publisher form validation failed');
      return;
    }

    setLoading(true);
    console.log('📤 Preparing publisher data for submission...');

    const formData = new FormData();
    const publisherData = {
      name: name.trim(),
      address: {
        currentAddress: currentAddress.trim(),
        permanentAddress: permanentAddress.trim() || null,
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        idDocumentUrl: idDocumentUrl.trim() || null,
        addressType: addressType,
      },
    };

    console.log('📋 Publisher data to submit:', publisherData);

    const publisherBlob = new Blob([JSON.stringify(publisherData)], {
      type: "application/json",
    });

    formData.append("publisher", publisherBlob, "publisher.json");

    if (profilePicture) {
      formData.append("photos", profilePicture);
      console.log('🖼️ Profile picture added to form data:', profilePicture.name);
    }

    try {
      console.log('🚀 Submitting publisher creation request...');
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`, {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Publisher creation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Publisher creation failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to create publisher: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Publisher created successfully:', data);
      setNotification({ 
        message: `Publisher "${name}" created successfully!`, 
        type: 'success' 
      });
      
      // Reset form
      setName('');
      setCurrentAddress('');
      setPermanentAddress('');
      setPhoneNumber('');
      setEmail('');
      setIdDocumentUrl('');
      setAddressType('');
      setProfilePicture(null);
      setError('');
      
      // Optionally navigate to publishers list
      // router.push('/publishers');
      
    } catch (error) {
      console.error('💥 Publisher creation error:', error);
      setNotification({ 
        message: `Error creating publisher: ${error.message}`, 
        type: 'error' 
      });
      
      // If it's an auth error, the token service should have already handled navigation
      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/publishers');
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
            <Title ta="left">🏢 ADD NEW PUBLISHER</Title>
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
              label="Publisher Name"
              value={name}
              required
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Enter publisher name"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('name') ? error : ''}
              disabled={loading}
            />
            
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              required
              onChange={(event) => setPhoneNumber(event.currentTarget.value)}
              placeholder="+251 9XX XXX XXX"
              rightSection={<IconPhoneCall size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('phone') ? error : ''}
              disabled={loading}
            />
            
            <TextInput
              label="Email Address"
              value={email}
              required
              type="email"
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="publisher@example.com"
              rightSection={<IconMail size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('email') ? error : ''}
              disabled={loading}
            />
            
            <TextInput
              label="Current Address"
              value={currentAddress}
              required
              onChange={(event) => setCurrentAddress(event.currentTarget.value)}
              placeholder="Enter current business address"
              rightSection={<IconHome2 size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('address') ? error : ''}
              disabled={loading}
            />
            
            <TextInput
              label="Permanent Address"
              value={permanentAddress}
              onChange={(event) => setPermanentAddress(event.currentTarget.value)}
              placeholder="Enter permanent address (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
            />
            
            <TextInput
              label="ID Document URL"
              value={idDocumentUrl}
              onChange={(event) => setIdDocumentUrl(event.currentTarget.value)}
              placeholder="Enter business license URL (optional)"
              rightSection={<IconBook size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
            />
            
            <Select
              label="Address Type"
              value={addressType}
              required
              onChange={setAddressType}
              placeholder="Select address type"
              data={addressTypes}
              rightSection={<IconAddressBook size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('address type') ? error : ''}
              disabled={loading}
            />
            
            <FileInput
              label="Profile Picture"
              placeholder="Upload publisher logo (JPG, PNG)"
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
                {loading ? 'Creating...' : 'Create Publisher'}
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

          {/* Success/Error Notification */}
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