// import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
// import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
// // import { BarChart } from '@mantine/charts';
// import {StatsGrid} from './statGrid'
// import { PieChart, BarChart } from '@mantine/charts';
// const icons = {
//   up: IconArrowUpRight,
//   down: IconArrowDownRight,
// };

// const data = [
//   { label: 'Transactions', stats: '456,578', progress: 65, color: 'teal', icon: 'up' },
//   { label: 'Books Sold', stats: '2,550', progress: 72, color: 'blue', icon: 'up' },
//   {
//     label: 'Users',
//     stats: '4,735',
//     progress: 52,
//     color: 'red',
//     icon: 'down',
//   },
// ] ;

// const BarChartData = [
//   { month: 'January', Smartphones: 1200, Laptops: 900, Tablets: 200 },
//   { month: 'February', Smartphones: 1900, Laptops: 1200, Tablets: 400 },
//   { month: 'March', Smartphones: 400, Laptops: 1000, Tablets: 200 },
//   { month: 'April', Smartphones: 1000, Laptops: 200, Tablets: 800 },
//   { month: 'May', Smartphones: 800, Laptops: 1400, Tablets: 1200 },
//   { month: 'June', Smartphones: 750, Laptops: 600, Tablets: 1000 },
// ];

// export default function StatsRing() {
//   const stats = data.map((stat) => {
//     const Icon = icons[stat.icon];
//     return (
//         <div style={{marginTop:45}}>


//       <Paper withBorder radius="md" p="xs" key={stat.label}>
//         <Group>
//           <RingProgress
//             size={80}
//             roundCaps
//             thickness={8}
//             sections={[{ value: stat.progress, color: stat.color }]}
//             label={
//               <Center>
//                 <Icon size={20} stroke={1.5} />
//               </Center>
//             }
//           />

//           <div>
//             <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
//               {stat.label}
//             </Text>
//             <Text fw={700} size="xl">
//               {stat.stats}
//             </Text>
//           </div>
//         </Group>
//       </Paper>

   
//         </div>
//     );
//   });

//   return( 
//   <div>
//   <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
//   <StatsGrid/>
//   <StatsGrid/>
//   {/* <BarChart
//       h={300}
//       data={BarChartData}
//       dataKey="month"
//       type="percent"
//       series={[
//         { name: 'Smartphones', color: 'violet.6' },
//         { name: 'Laptops', color: 'blue.6' },
//         { name: 'Tablets', color: 'teal.6' },
//       ]}
//     /> */}
//   </div>
//   )

// }

"use client";
import { useEffect } from 'react';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';
import { StatsGrid } from './statGrid';
import { PieChart, BarChart } from '@mantine/charts';
import { authenticatedFetch, setNavigation } from '../../app/services/baseApiService';
import { useRouter } from 'next/navigation';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

const data = [
  { label: 'Transactions', stats: '456,578', progress: 65, color: 'teal', icon: 'up' },
  { label: 'Books Sold', stats: '2,550', progress: 72, color: 'blue', icon: 'up' },
  { label: 'Users', stats: '4,735', progress: 52, color: 'red', icon: 'down' },
];

const BarChartData = [
  { month: 'January', Smartphones: 1200, Laptops: 900, Tablets: 200 },
  { month: 'February', Smartphones: 1900, Laptops: 1200, Tablets: 400 },
  { month: 'March', Smartphones: 400, Laptops: 1000, Tablets: 200 },
  { month: 'April', Smartphones: 1000, Laptops: 200, Tablets: 800 },
  { month: 'May', Smartphones: 800, Laptops: 1400, Tablets: 1200 },
  { month: 'June', Smartphones: 750, Laptops: 600, Tablets: 1000 },
];

export default function StatsRing() {
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
    console.log('📊 StatsRing page loaded, setting up navigation...');
    setNavigation((path) => {
      console.log('📍 StatsRing navigation to:', path);
      router.push(path);
    });
  }, [router]);

  // Check token validity on page load
  useEffect(() => {
    console.log('🔐 Checking authentication for StatsRing...');
    const checkAuth = async () => {
      try {
        // Make a lightweight API call to verify token (adjust endpoint as needed)
        const response = await authenticatedFetch('/api/auth/verify'); // Replace with your actual auth verification endpoint
        console.log('📥 Auth verification response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Auth verification failed:', { status: response.status, error: errorText });
          throw new Error('Authentication failed. Please log in again.');
        }

        console.log('✅ Authentication verified successfully');
      } catch (error) {
        console.error('💥 Auth verification error:', error);
        if (error.message.includes('token') || error.message.includes('auth')) {
          console.log('🔐 Auth error detected, navigation should be handled by token service');
        }
      }
    };

    checkAuth();
  }, []);

  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <div style={{ marginTop: 45 }} key={stat.label}>
        <Paper withBorder radius="md" p="xs">
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[{ value: stat.progress, color: stat.color }]}
              label={
                <Center>
                  <Icon size={20} stroke={1.5} />
                </Center>
              }
            />
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {stat.label}
              </Text>
              <Text fw={700} size="xl">
                {stat.stats}
              </Text>
            </div>
          </Group>
        </Paper>
      </div>
    );
  });

  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
      <StatsGrid />
      <StatsGrid />
      {/* Uncomment if you want to include the BarChart */}
      {/* <BarChart
        h={300}
        data={BarChartData}
        dataKey="month"
        type="percent"
        series={[
          { name: 'Smartphones', color: 'violet.6' },
          { name: 'Laptops', color: 'blue.6' },
          { name: 'Tablets', color: 'teal.6' },
        ]}
      /> */}
    </div>
  );
}