"use client";
import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector, IconDownload } from '@tabler/icons-react';
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Box,
  LoadingOverlay,
  UnstyledButton,
  Title,
  ActionIcon
} from '@mantine/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import classes from './TableSort.module.css';

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(query);
    })
  );
}

function sortData(data, payload) {
  const { sortBy, reversed } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (reversed) {
        return b[sortBy] < a[sortBy] ? -1 : 1;
      }
      return a[sortBy] < b[sortBy] ? -1 : 1;
    }),
    payload.search
  );
}

export function TableSort() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://books-api.addispages.com/api/v1/book', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedData = await response.json();
      console.log(fetchedData)
      setData(fetchedData);
      setSortedData(fetchedData);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.authorName}</Table.Td>
      <Table.Td>{row.publisherName}</Table.Td>
      <Table.Td>{row.genre}</Table.Td>
      <Table.Td>{row.price}</Table.Td>
      <Table.Td>{row.stock}</Table.Td>
    </Table.Tr>
  ));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    autoTable(doc, {
      head: [['Title', 'Author', 'Publisher', 'Genre', 'Price', 'Stock']],
      body: sortedData.map(row => [row.title, row.authorName, row.publisherName, row.genre, row.price, row.stock]),
    });
    doc.save('books.pdf');
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />
      <ScrollArea>
        <Title order={2} style={{ marginTop: 45, marginLeft: 20, display: 'flex', justifyContent: 'space-between' }}>
          <span>BOOKS</span>
          <ActionIcon onClick={downloadPDF} title="Download as PDF" color="blue" variant="light">
            <IconDownload size={20} />
          </ActionIcon>
        </Title>
        <div className={classes.searchContainer}>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700}>
          <Table.Tbody>
            <Table.Tr>
              <Th sorted={sortBy === 'title'} reversed={reverseSortDirection} onSort={() => setSorting('title')}>
                Title
              </Th>
              <Th sorted={sortBy === 'authorName'} reversed={reverseSortDirection} onSort={() => setSorting('authorName')}>
                Author
              </Th>
              <Th sorted={sortBy === 'publisherName'} reversed={reverseSortDirection} onSort={() => setSorting('publisherName')}>
                Publisher
              </Th>
              <Th sorted={sortBy === 'genre'} reversed={reverseSortDirection} onSort={() => setSorting('genre')}>
                Genre
              </Th>
              <Th sorted={sortBy === 'price'} reversed={reverseSortDirection} onSort={() => setSorting('price')}>
                Price
              </Th>
              <Th sorted={sortBy === 'stock'} reversed={reverseSortDirection} onSort={() => setSorting('stock')}>
                Stock
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}