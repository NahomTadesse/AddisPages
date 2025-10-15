

// "use client";

// import {
//   IconAdjustments,
//   IconCalendarStats,
//   IconFileAnalytics,
//   IconGauge,
//   IconLock,
//   IconNotes,
//   IconPresentationAnalytics,
//   IconLogout,
// } from '@tabler/icons-react';
// import { Code, Group, ScrollArea, Button } from '@mantine/core';
// import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
// import { UserButton } from '../UserButton/UserButton';
// import { Logo } from './Logo';
// import { UserProvider } from '../../contexts/UserContext';
// import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
// import { useRouter } from 'next/navigation';
// import classes from './NavbarNested.module.css';

// const mockdata = [
//   { label: 'Dashboard', icon: IconGauge },
//   {
//     label: 'Books',
//     icon: IconNotes,
//     initiallyOpened: true,
//     links: [
//       { label: 'Add Book', link: '/addBook' },
//       { label: 'Orders', link: '/orders' },
//       { label: 'Books', link: '/bookList' },
//     ],
//   },
//   {
//     label: 'Publishers',
//     icon: IconNotes,
//     initiallyOpened: false,
//     links: [
//       { label: 'Add Publisher', link: '/addPblisher' },
//       { label: 'Publishers', link: '/publisherList' },
//     ],
//   },
//   {
//     label: 'Authors',
//     icon: IconNotes,
//     initiallyOpened: false,
//     links: [
//       { label: 'Add Author', link: '/addAuthor' },
//       { label: 'Authors', link: '/authorList' },
//     ],
//   },

//     {
//     label: 'Stores',
//     icon: IconNotes,
//     initiallyOpened: false,
//     links: [
//       { label: 'Stores', link: '/store' },
      
//     ],
//   },

//   {
//     label: 'Analytics',
//     icon: IconPresentationAnalytics,
//     initiallyOpened: false,
//     links: [
//       { label: 'Overall Stat', link: '/stat' },
//       { label: 'Monthly Stat', link: '/stat' },
//       { label: 'Yearly Stat', link: '/stat' },
//     ],
//   },
// ];

// export function NavbarNested() {
//   const router = useRouter();

//   // Map mockdata to LinksGroup for menu items
//   const links = mockdata.map((item) => (
//     <LinksGroup {...item} key={item.label} />
//   ));

//   // NEW: Logout handler
//   const handleLogout = () => {
//     // Clear all cookies
//     document.cookie.split(';').forEach((cookie) => {
//       const [name] = cookie.split('=');
//       document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
//     });

//     router.push('/');
//   };

//   return (
//     <nav className={classes.navbar}>
//       <div className={classes.header}>
//         <Group justify="space-between">
//           <div style={{fontWeight:'bold'}}>ADDIS BOOKS</div>
//           <ColorSchemeToggle />
//         </Group>
//       </div>

//       <ScrollArea className={classes.links}>
//         <div className={classes.linksInner}>
//           {links}
//           {/* NEW: Logout button styled to match navbar */}
//           <Button
//             variant="subtle"
//             size="md"
//             color="red" // Red to indicate a destructive action
//             leftSection={<IconLogout size="1.1rem" />}
//             onClick={handleLogout}
//             className={classes.control} // Match LinksGroup styling
//             styles={{
//               root: {
//                 justifyContent: 'flex-start', // Align content like LinksGroup
//                 padding: '8px 12px', // Match typical navbar item padding
//                 fontWeight: 500, // Match typical navbar font weight
//               },
//             }}
//           >
//             Logout
//           </Button>
//         </div>
//       </ScrollArea>

//       <div className={classes.footer}>
//         <UserButton />
//       </div>
//     </nav>
//   );
// }



"use client";

import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
  IconLogout,
} from '@tabler/icons-react';
import { Code, Group, ScrollArea, Button } from '@mantine/core';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { UserButton } from '../UserButton/UserButton';
import { Logo } from './Logo';
import { UserProvider } from '../../contexts/UserContext';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import classes from './NavbarNested.module.css';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Books',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Add Book', link: '/addBook' },
      { label: 'Orders', link: '/orders' },
      { label: 'Books', link: '/bookList' },
    ],
  },
  {
    label: 'Publishers',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Add Publisher', link: '/addPblisher' },
      { label: 'Publishers', link: '/publisherList' },
    ],
  },
  {
    label: 'Authors',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Add Author', link: '/addAuthor' },
      { label: 'Authors', link: '/authorList' },
    ],
  },
  {
    label: 'Stores',
    icon: IconNotes,
    initiallyOpened: false,
    links: [
      { label: 'Stores', link: '/store' },
    ],
  },
  {
    label: 'Analytics',
    icon: IconPresentationAnalytics,
    initiallyOpened: false,
    links: [
      { label: 'Overall Stat', link: '/stat' },
      { label: 'Monthly Stat', link: '/stat' },
      { label: 'Yearly Stat', link: '/stat' },
    ],
  },
];

export function NavbarNested() {
  const router = useRouter();
  const [userRole, setUserRole] = useState();

  // Retrieve user data from cookies
  useEffect(() => {
    const authData = Cookies.get('auth_data');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        setUserRole(parsedData.role || null); // Assuming role is stored in auth_data
      } catch (err) {
        console.error('Error parsing auth data:', err);
      }
    }
  }, []);

  // Filter mockdata to exclude Stores if user is not ADMIN
  const filteredMockdata = userRole === 'ADMIN' ? mockdata : mockdata.filter(item => item.label !== 'Stores');

  // Map filtered mockdata to LinksGroup for menu items
  const links = filteredMockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  // Restrict access to /store path
  useEffect(() => {
    if (userRole && userRole !== 'ADMIN' && router.pathname === '/store') {
      router.push('/'); // Redirect to home or another safe route
    }
  }, [userRole, router]);

  // Logout handler
  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });

    router.push('/');
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <div style={{fontWeight:'bold'}}>ADDIS BOOKS</div>
          <ColorSchemeToggle />
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {links}
          {/* Logout button styled to match navbar */}
          <Button
            variant="subtle"
            size="md"
            color="red"
            leftSection={<IconLogout size="1.1rem" />}
            onClick={handleLogout}
            className={classes.control}
            styles={{
              root: {
                justifyContent: 'flex-start',
                padding: '8px 12px',
                fontWeight: 500,
              },
            }}
          >
            Logout
          </Button>
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}