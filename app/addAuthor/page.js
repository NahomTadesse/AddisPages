


// "use client";
// import { useState , useEffect } from 'react';
// import { TextInput, Button, Notification, Container, FileInput, Title, LoadingOverlay, Box, Alert } from '@mantine/core';
// import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../services/baseApiService';
// import { useRouter } from 'next/navigation';
// import { IconUser, IconUpload, IconRefresh } from '@tabler/icons-react';

// export default function AuthorForm() {
//   const [name, setName] = useState('');
//   const [bio, setBio] = useState('');
//   const [nationality, setNationality] = useState('');
//   const [error, setError] = useState('');
//   const [notification, setNotification] = useState({ message: '', type: '' });
//   const [loading, setLoading] = useState(false);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const router = useRouter();

//   // Set up navigation for the auth service
//   useEffect(() => {
//     console.log('✍️ Author form loaded, setting up navigation...');
//     setNavigation((path) => {
//       console.log('📍 Author form navigation to:', path);
//       router.push(path);
//     });
//   }, [router]);

//   const validateForm = () => {
//     if (!name.trim()) {
//       setError('Author name is required.');
//       return false;
//     }
//     if (!bio.trim()) {
//       setError('Author bio is required.');
//       return false;
//     }
//     if (!nationality.trim()) {
//       setError('Author nationality is required.');
//       return false;
//     }
//     if (!profilePicture) {
//       setError('Please upload a profile picture.');
//       return false;
//     }
    
//     setError('');
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('✍️ Author form submission started...');
  
//     if (!validateForm()) {
//       console.log('❌ Author form validation failed');
//       return;
//     }
  
//     setLoading(true);
//     console.log('📤 Preparing author data for submission...');

//     const formData = new FormData();
//     const authorData = {
//       name: name.trim(),
//       bio: bio.trim(),
//       nationality: nationality.trim(),
//     };
    
//     console.log('📋 Author data to submit:', authorData);

//     const authorBlob = new Blob([JSON.stringify(authorData)], {
//       type: "application/json",
//     });

//     formData.append("author", authorBlob, "author.json");
    
//     if (profilePicture) {
//       formData.append("photos", profilePicture);
//       console.log('🖼️ Profile picture added to form data:', profilePicture.name);
//     }

//     try {
//       console.log('🚀 Submitting author creation request...');
//       const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/create`, {
//         method: 'POST',
//         body: formData,
//       });
  
//       console.log('📥 Author creation response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Author creation failed:', { status: response.status, error: errorText });
//         throw new Error(`Failed to create author: ${response.status} - ${errorText}`);
//       }
  
//       const data = await response.json();
//       console.log('✅ Author created successfully:', data);
//       setNotification({ 
//         message: `Author "${name}" created successfully!`, 
//         type: 'success' 
//       });
      
//       // Reset form
//       setName('');
//       setBio('');
//       setNationality('');
//       setProfilePicture(null);
//       setError('');
      
//       // Optionally navigate to authors list
//       // router.push('/authors');
      
//     } catch (error) {
//       console.error('💥 Author creation error:', error);
//       setNotification({ 
//         message: `Error creating author: ${error.message}`, 
//         type: 'error' 
//       });
      
//       // If it's an auth error, the token service should have already handled navigation
//       if (error.message.includes('token') || error.message.includes('auth')) {
//         console.log('🔐 Auth error detected, navigation should be handled by token service');
//         return;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     router.push('/authors');
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
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//             <Title ta="left">✍️ ADD NEW AUTHOR</Title>
//             <Button
//               variant="outline"
//               onClick={handleCancel}
//               size="sm"
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//           </div>

//           {error && (
//             <Alert 
//               icon="🚨"
//               color="red" 
//               title="Validation Error"
//               mb="md"
//               onClose={() => setError('')}
//             >
//               {error}
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
//             <TextInput
//               label="Author Name"
//               value={name}
//               required
//               onChange={(event) => setName(event.currentTarget.value)}
//               placeholder="Enter author full name"
//               rightSection={<IconUser size={20} />}
//               style={{ maxWidth: 400, marginTop: 10 }}
//               error={error.includes('name') ? error : ''}
//               disabled={loading}
//             />
            
//             <TextInput
//               label="Nationality"
//               value={nationality}
//               required
//               onChange={(event) => setNationality(event.currentTarget.value)}
//               placeholder="Enter author nationality"
//               rightSection={<IconUser size={20} />}
//               style={{ maxWidth: 400, marginTop: 10 }}
//               error={error.includes('nationality') ? error : ''}
//               disabled={loading}
//             />
            
//             <div style={{ gridColumn: 'span 2' }}>
//               <TextInput
//                 label="Author Bio"
//                 value={bio}
//                 required
//                 onChange={(event) => setBio(event.currentTarget.value)}
//                 placeholder="Enter author biography"
//                 rightSection={<IconUser size={20} />}
//                 style={{ maxWidth: 800, marginTop: 10 }}
//                 error={error.includes('bio') ? error : ''}
//                 multiline
//                 rows={4}
//                 disabled={loading}
//               />
//             </div>
            
//             <FileInput
//               label="Profile Picture"
//               placeholder="Upload author photo (JPG, PNG)"
//               accept="image/jpeg,image/png"
//               onChange={setProfilePicture}
//               value={profilePicture}
//               required
//               rightSection={<IconUpload size={20} />}
//               style={{ maxWidth: 400, marginTop: 10 }}
//               error={error.includes('picture') ? error : ''}
//               disabled={loading}
//             />
            
//             <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 20 }}>
//               <Button 
//                 type="submit" 
//                 size="lg"
//                 leftSection={<IconUser size={20} />}
//                 loading={loading}
//                 disabled={loading}
//                 style={{ minWidth: 150 }}
//               >
//                 {loading ? 'Creating...' : 'Create Author'}
//               </Button>
//               <Button 
//                 variant="outline"
//                 onClick={handleCancel}
//                 size="lg"
//                 disabled={loading}
//                 style={{ minWidth: 150 }}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>

//           {/* Success/Error Notification */}
//           {notification.message && (
//             <Notification
//               color={notification.type === 'success' ? 'green' : 'red'}
//               title={notification.type === 'success' ? 'Success' : 'Error'}
//               onClose={() => setNotification({ message: '', type: '' })}
//               style={{
//                 position: 'fixed',
//                 bottom: 20,
//                 right: 20,
//                 zIndex: 1000,
//                 maxWidth: 400,
//               }}
//               withCloseButton
//               withBorder
//             >
//               {notification.message}
//             </Notification>
//           )}
//         </Container>
//       </div>
//     </Box>
//   );
// }


"use client";
import { useState, useEffect } from 'react';
import { TextInput, Button, Notification, Container, FileInput, Title, LoadingOverlay, Box, Alert } from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../services/baseApiService';
import { useRouter } from 'next/navigation';
import { IconUser, IconUpload, IconRefresh, IconMail, IconPhone } from '@tabler/icons-react';

export default function AuthorForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log('✍️ Author form loaded, setting up navigation...');
    setNavigation((path) => {
      console.log('📍 Author form navigation to:', path);
      router.push(path);
    });
  }, [router]);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError('First name is required.');
      return false;
    }
    if (!lastName.trim()) {
      setError('Last name is required.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('A valid email is required.');
      return false;
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required.');
      return false;
    }
    if (!bio.trim()) {
      setError('Author bio is required.');
      return false;
    }
    if (!nationality.trim()) {
      setError('Author nationality is required.');
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
    console.log('✍️ Author form submission started...');

    if (!validateForm()) {
      console.log('❌ Author form validation failed');
      return;
    }

    setLoading(true);
    console.log('📤 Preparing author data for submission...');

    const formData = new FormData();
    const authorData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      bio: bio.trim(),
      nationality: nationality.trim(),
    };

    console.log('📋 Author data to submit:', authorData);

    const authorBlob = new Blob([JSON.stringify(authorData)], {
      type: "application/json",
    });

    formData.append("author", authorBlob, "author.json");

    if (profilePicture) {
      formData.append("photos", profilePicture);
      console.log('🖼️ Profile picture added to form data:', profilePicture.name);
    }

    try {
      console.log('🚀 Submitting author creation request...');
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/author/create`, {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Author creation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Author creation failed:', { status: response.status, error: errorText });
        throw new Error(`Failed to create author: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Author created successfully:', data);
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
      setProfilePicture(null);
      setError('');

      // Optionally navigate to authors list
      // router.push('/authors');

    } catch (error) {
      console.error('💥 Author creation error:', error);
      setNotification({
        message: `Error creating author: ${error.message}`,
        type: 'error',
      });

      if (error.message.includes('token') || error.message.includes('auth')) {
        console.log('🔐 Auth error detected, navigation should be handled by token service');
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