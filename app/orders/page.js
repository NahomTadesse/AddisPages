"use client";
import { Group, Table, ActionIcon, Text, Container, Title, TextInput, Button, LoadingOverlay,Box } from '@mantine/core';
import { IconTrash, IconCheck, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
const initialBookings = [
  {
    bookName: 'The Great Gatsby',
    name: 'Abebe Kebded',
    phone: '123-456-7890',
    date: '2025-01-01',
    status: 'Pending',
    price: 100,
  },
  {
    bookName: 'To Kill a Mockingbird',
    name: 'Selam Alemu',
    phone: '987-654-3210',
    date: '2025-01-02',
    status: 'Confirmed',
    price: 200,
  },
  {
    bookName: '1984',
    name: 'Tesfaye Nigussie',
    phone: '555-555-5555',
    date: '2025-01-03',
    status: 'Pending',
    price: 150,
  },
  {
    bookName: 'Moby Dick',
    name: 'Abreham Teklu',
    phone: '444-444-4444',
    date: '2025-01-04',
    status: 'Confirmed',
    price: 250,
  },
];

export default function BookingTable() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
const [loading, setLoading] = useState(false);
  const userD = JSON.parse(Cookies.get('userData'))

  useEffect(()=>{
    getOrders()
  },[])
  const filteredBookings = bookings.filter(booking => {
    const lowerSearch = search.toLowerCase();
    return (
      booking.name.toLowerCase().includes(lowerSearch) ||
      booking.phone.toLowerCase().includes(lowerSearch) ||
      booking.date.includes(lowerSearch) ||
      booking.price.toString().includes(lowerSearch) ||
      booking.status.toLowerCase().includes(lowerSearch) ||
      booking.bookName.toLowerCase().includes(lowerSearch) // Include bookName in search
    );
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === null) return 0;

    if (sortDirection === 'asc') {
      return a[sortBy] < b[sortBy] ? -1 : 1;
    } else {
      return a[sortBy] > b[sortBy] ? -1 : 1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getOrders = async ()=>{
  try {
             const response = await fetch('https://books-api.addispages.com/api/v1/orderItem', {
                
                 headers: {
                     'Content-Type': 'application/json',
                     Authorization : userD.access_token
                     
                 },
             
             });
     
             if (!response.ok) {
                 setLoading(false);
                 
               
                 throw new Error('Network response was not ok');
                 
             }
     
             const responseData = await response.json();
          console.log(responseData);
             setLoading(false);
             
            
         } catch (error) {
             console.error('Error creating user:', error);
           
             setLoading(false);
         } finally {
             setLoading(false);
         }
  }

  const orderBook = async()=>{
    const quantity = 1
console.log('accesstokem',userD.access_token)
    try {
        const response = await fetch('https://books-api.addispages.com/api/v1/orderItem', {
            method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization : userD.access_token
          },
  body: JSON.stringify(
    [
        {
         
                  quantity:quantity,
                  amount: 2,
                  bookId: "9d734255-ad30-4c59-82ab-4959fd6e148d",
                  unitPrice: 20,
                  totalPrice: 20,
                  userId: "88f7cbe7-214d-4512-8bc1-7dd1c34a0c16"
         
        }
      ]

),
        
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
         if(responseData !=[]){
           
            // setBooks(responseData)
        }
       
        console.log('User created successfully:', responseData);
        
    
       
      } catch (error) {
        console.error('Error creating user:', error);
        
      
      }
}


  const rows = sortedBookings.map((booking, index) => (
    <Table.Tr key={index}>
      <Table.Td><Text fz="sm">{booking.bookName}</Text></Table.Td>
      <Table.Td><Text fz="sm">{booking.name}</Text></Table.Td>
      <Table.Td><Text fz="sm">{booking.phone}</Text></Table.Td>
      <Table.Td><Text fz="sm">{booking.date}</Text></Table.Td>
      <Table.Td style={{ textAlign: 'left', fontWeight: "700" }}>${booking.price}</Table.Td>
      <Table.Td style={{ textAlign: 'left', fontWeight: "700", color: booking.status === 'Confirmed' ? '#39FF14' : 'inherit' }}>
        {booking.status}
      </Table.Td>
      <Table.Td>
        <Group position="right">
          <ActionIcon color="green" onClick={() => handleConfirm(index)} title="Confirm" size="sm">
            <IconCheck size={12} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => handleDelete(index)} title="Delete" size="sm">
            <IconTrash size={12} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
       <Box pos="relative">
                <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ color: 'blue', type: 'bars' }}
            />
    <Container style={{ maxWidth: '100%', margin: '0 auto', marginTop: 45 }}>
      <Title order={2} style={{ marginBottom: 10 }}>ORDERS</Title>
      <TextInput
        placeholder="Search order"
        style={{ maxWidth: 300 }}
        mb="md"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <Table striped style={{ width: '100%' }} verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th onClick={() => handleSort('bookName')} style={{ cursor: 'pointer' }}>
              Book Name
              {sortBy === 'bookName' && (sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
            </Table.Th>
            <Table.Th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Booker's Name
              {sortBy === 'name' && (sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
            </Table.Th>
            <Table.Th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
              Phone Number
              {sortBy === 'phone' && (sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
            </Table.Th>
            <Table.Th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
              Date
              {sortBy === 'date' && (sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
            </Table.Th>
            <Table.Th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
              Price
              {sortBy === 'price' && (sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
            </Table.Th>
            <Table.Th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              Status
              {sortBy === 'status' && (sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />)}
            </Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>


    </Container>
    </Box>
  );
}