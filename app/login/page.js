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
import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle, IconUser } from '@tabler/icons-react';
import tokenService from '../services/tokenService';
import { BOOKS_API_BASE_URL } from '../services/baseApiService';

export default function AuthenticationTitle() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [visible, { toggle }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const icon = <IconInfoCircle />;
    const router = useRouter();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);

            return () => clearTimeout(timer); 
        }
    }, [error]);

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        console.log('🔐 Starting login process...');

        try {
            console.log('📤 Sending login request with phone:', phone);
            const response = await fetch(`${BOOKS_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    principal: phone,
                    password: password,
                }),
            });

            console.log('📥 Login response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Login failed with response:', errorText);
                throw new Error(`Login failed: ${response.status} - ${errorText || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('✅ Login successful, received data:', data);
            
            if (data.access_token) {
                console.log('🔑 Setting auth data with token...');
                tokenService.setAuthData(data);
                console.log('🚀 Navigating to /stat...');
                router.push('/stat');
            } else {
                console.error('❌ No access token in response:', data);
                throw new Error('No access token received from server');
            }
        } catch (err) {
            console.error('💥 Login error:', err);
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
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
                    <form onSubmit={handleSubmit}>
                        <TextInput 
                            label="Phone Number" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            rightSection={<IconUser size={20} />}
                            placeholder="your number" 
                            required 
                            mb="md"
                        />
                        
                        <PasswordInput 
                            label="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password" 
                            required 
                            visible={visible}
                            onVisibilityChange={toggle}
                            mb="md"
                        />

                        {error && (
                            <Alert 
                                variant="light" 
                                color="red" 
                                radius="md" 
                                mb="md"
                                icon={icon}
                            >
                                {error}
                            </Alert>
                        )}

                        <Group justify="space-between" mt="lg">
                            <Checkbox label="Remember me" />
                            <Anchor component="button" size="sm" href="#" onClick={(e) => e.preventDefault()}>
                                Forgot password?
                            </Anchor>
                        </Group>
                        
                        <Button
                            type="submit"
                            fullWidth
                            mt="xl"
                            disabled={!phone || !password || loading}
                            loading={loading}
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}