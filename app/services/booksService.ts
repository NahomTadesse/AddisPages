import { createAuthenticatedFetch, BOOKS_API_BASE_URL } from './baseApiService';

export interface Book {
  id: string;
  title: string;
  authorName: string;
  publisherName: string;
  genre: string;
  price: number;
  stock: number;
  // Add other book properties as needed
}

const authFetch = createAuthenticatedFetch();

const transformBookFromAPI = (bookData: any): Book => {
  return {
    id: bookData.id,
    title: bookData.title,
    authorName: bookData.authorName,
    publisherName: bookData.publisherName,
    genre: bookData.genre,
    price: bookData.price,
    stock: bookData.stock,
  };
};

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await authFetch(`${BOOKS_API_BASE_URL}/book`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch books: ${errorText}`);
    }
    
    const books = await response.json();
    return books.map(transformBookFromAPI);
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchBookById = async (bookId: string): Promise<Book | null> => {
  try {
    const response = await authFetch(`${BOOKS_API_BASE_URL}/book/${bookId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch book: ${errorText}`);
    }
    
    const book = await response.json();
    return transformBookFromAPI(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
};

export const addBook = async (bookData: Omit<Book, 'id'>): Promise<Book | null> => {
  try {
    const response = await authFetch(`${BOOKS_API_BASE_URL}/book`, {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add book: ${errorText}`);
    }
    
    const book = await response.json();
    return transformBookFromAPI(book);
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (bookId: string, bookData: Partial<Book>): Promise<Book | null> => {
  try {
    const response = await authFetch(`${BOOKS_API_BASE_URL}/book/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update book: ${errorText}`);
    }
    
    const book = await response.json();
    return transformBookFromAPI(book);
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (bookId: string): Promise<boolean> => {
  try {
    const response = await authFetch(`${BOOKS_API_BASE_URL}/book/${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete book: ${errorText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const searchBooks = async (searchTerm: string): Promise<Book[]> => {
  try {
    const response = await authFetch(`${BOOKS_API_BASE_URL}/book/search?q=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search books: ${errorText}`);
    }
    
    const books = await response.json();
    return books.map(transformBookFromAPI);
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};