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
     Box,
     Alert
} from '@mantine/core';
import classes from './AuthenticationTitle.module.css';
import { useRouter } from 'next/navigation';
import {React,useState,useEffect} from 'react'
import { useDisclosure } from '@mantine/hooks';
import { useUser } from '../../contexts/UserContext'
import useLocalStorage from '../../hooks/useLocalStorage'
import { IconInfoCircle, IconUser } from '@tabler/icons-react';
export default function AuthenticationTitle() {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [visible, { toggle }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    // const { setUserData } = useUser();
    const [userData, setUserData] = useLocalStorage('userData', {});
    const [alert, setAlert] = useState({ visible: false, message: '', color: '' });
    const icon = <IconInfoCircle />;
    const router = useRouter();

    useEffect(() => {
        if (errorVisible) {
            const timer = setTimeout(() => {
                setErrorVisible(false);
            }, 1000);

            return () => clearTimeout(timer); 
        }
    }, [errorVisible]);

    const handleSignIn = async () => {
        setLoading(true);
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
                setLoading(false);
                setErrorVisible(true)
              
                throw new Error('Network response was not ok');
                
            }
    
            const responseData = await response.json();
            if(responseData.access_token){
                console.log('User created successfully:', responseData);
                setUserData(responseData); 

                setLoading(false);
                // localStorage.setItem('userData', JSON.stringify(responseData));
                router.push('/stat'); 
            }
            else{
                setErrorVisible(true)
            }
            setLoading(false);
            
           
        } catch (error) {
            console.error('Error creating user:', error);
            setErrorVisible(true)
            setLoading(false);
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
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Phone Number" value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 rightSection={<IconUser size={20} />}
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
              { errorVisible && <Alert variant="light" color="red" radius="md" title="Alert title" icon={icon}>
                Error Logging In
              </Alert>}
            </Paper>
        </Container>
        </Box>
    );
}