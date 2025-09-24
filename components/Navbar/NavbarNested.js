// "use client";

// import {
//   IconAdjustments,
//   IconCalendarStats,
//   IconFileAnalytics,
//   IconGauge,
//   IconLock,
//   IconNotes,
//   IconPresentationAnalytics,
//   IconLogout, // NEW: Added logout icon
// } from '@tabler/icons-react';
// import { Code, Group, ScrollArea } from '@mantine/core';
// import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
// import { UserButton } from '../UserButton/UserButton';
// import { Logo } from './Logo';
// import { UserProvider } from '../../contexts/UserContext';
// import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
// import { useRouter } from 'next/navigation'; // NEW: Added for navigation
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
//   // NEW: Added Logout as a single LinksGroup item without sub-links
//   {
//     label: 'Logout',
//     icon: IconLogout,
//     onClick: () => {
//       // Clear all cookies
//       document.cookie.split(';').forEach((cookie) => {
//         const [name] = cookie.split('=');
//         document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
//       });
//       console.log('🔓 Cookies cleared, logging out...');
//       // Navigate to root (handled in LinksGroup)
//       window.location.href = '/'; // Using window.location.href for consistency with LinksGroup navigation
//     },
//   },
// ];

// export function NavbarNested() {
//   const router = useRouter(); // NEW: Added for navigation, though not used directly here

//   // NEW: Map mockdata to LinksGroup, passing onClick for items without links
//   const links = mockdata.map((item) => (
//     <LinksGroup
//       {...item}
//       key={item.label}
//       onClick={item.onClick} // Pass onClick for Logout
//     />
//   ));

//   return (
//     <nav className={classes.navbar}>
//       <div className={classes.header}>
//         <Group justify="space-between">
//           <div>Book Dashboard</div>
//           <ColorSchemeToggle />
//         </Group>
//       </div>

//       <ScrollArea className={classes.links}>
//         <div className={classes.linksInner}>{links}</div>
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

  // Map mockdata to LinksGroup for menu items
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  // NEW: Logout handler
  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    console.log('🔓 Cookies cleared, logging out...');
    // Navigate to root
    router.push('/');
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <div>Book Dashboard</div>
          <ColorSchemeToggle />
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {links}
          {/* NEW: Logout button styled to match navbar */}
          <Button
            variant="subtle"
            size="md"
            color="red" // Red to indicate a destructive action
            leftSection={<IconLogout size="1.1rem" />}
            onClick={handleLogout}
            className={classes.control} // Match LinksGroup styling
            styles={{
              root: {
                justifyContent: 'flex-start', // Align content like LinksGroup
                padding: '8px 12px', // Match typical navbar item padding
                fontWeight: 500, // Match typical navbar font weight
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