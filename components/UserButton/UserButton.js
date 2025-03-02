"use client";
import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './UserButton.module.css';
import { useUser } from '../../contexts/UserContext'
import useLocalStorage from '../../hooks/useLocalStorage'
import Cookies from 'js-cookie';
import { useEffect } from 'react';
export function UserButton() {
  
  const [userData] = useLocalStorage('userData', {});
  // console.log('serr',userData)
  const userD = JSON.parse(Cookies.get('userData'))
  useEffect(()=>{
    console.log('dataaa',userD.phoneNumber)
  },[])
  // const savedData = localStorage.getItem('userData');
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
          {/* {userData ? userData.username : 'Guest'} */}
          {Cookies.get('userData') ?  userD.phoneNumber  : 'Guest'}
          
          </Text>

          <Text c="dimmed" size="xs">
          {/* {userData ? userData.username : 'Guest'} */}
          {Cookies.get('userData') ?  userD.phoneNumber  : 'Guest'}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}