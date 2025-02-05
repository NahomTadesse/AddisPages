"use client";
import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
    LoadingOverlay,
     Box
} from '@mantine/core';
import classes from './AuthenticationTitle.module.css';
import { useRouter } from 'next/navigation';
import {React,useState} from 'react'
import { useDisclosure } from '@mantine/hooks';
import { useUser } from '../../contexts/UserContext'
export default function AuthenticationTitle() {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [visible, { toggle }] = useDisclosure(false);
    const { setUserData } = useUser();
    const router = useRouter();

    const handleSignIn = async () => {
        toggle(); // Show loading overlay
        console.log('Phone:', phone);
        console.log('Password:', password);
        
        try {
            const response = await fetch('https://books-api.addispages.com/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    principal: phone,
                    password: password,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const responseData = await response.json();
            if(responseData.access_token){
                console.log('User created successfully:', responseData);
                setUserData(responseData); 

                toggle()
                // localStorage.setItem('userData', JSON.stringify(responseData));
                router.push('/stat'); 
            }
            toggle()
            
           
        } catch (error) {
            console.error('Error creating user:', error);
            toggle()
        } finally {
            toggle(); // Hide loading overlay
        }
    };

    return (
        <Box pos="relative">
            <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Phone Number" value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                placeholder="your number" required />
                
                <PasswordInput label="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password" required mt="md" />

                <Group justify="space-between" mt="lg">
                    <Checkbox label="Remember me" />
                    <Anchor component="button" size="sm">
                        Forgot password?
                    </Anchor>
                </Group>
                <Button
                    onClick={handleSignIn}
                    fullWidth
                    mt="xl"
                >
                    Sign in
                </Button>
            </Paper>
        </Container>
        </Box>
    );
}