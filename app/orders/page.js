"use client";
import { Group, Table, ActionIcon, Text, Container, Title, TextInput } from '@mantine/core';
import { IconTrash, IconCheck, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

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
  );
}