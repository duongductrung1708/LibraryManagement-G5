import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  OutlinedInput,
  Pagination,
  Popover,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import { apiUrl, methods, routes } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import BorrowalForm from '../borrowal/BorrowalForm';
import BookDialog from './BookDialog';
import BookForm from './BookForm';
import ImportBooksModal from './ImportBooksModal';

// ----------------------------------------------------------------------

const StyledBookImage = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const TruncatedTypography = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  position: 'relative',
  '&::after': {
    content: '"..."',
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: 'white',
  },
});

const BookPage = () => {
  const { user } = useAuth();

  // State variables
  const [book, setBook] = useState({
    id: '',
    name: '',
    isbn: '',
    summary: '',
    isAvailable: true,
    authorId: '',
    genreId: '',
    photoUrl: '',
    pageUrls: [],
    position: '',
  });

  const [borrowal, setBorrowal] = useState({
    bookId: '',
    memberId: '',
    borrowedDate: '',
    dueDate: '',
    status: '',
  });

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [isBorrowalModalOpen, setIsBorrowalModalOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterIsAvailable, setFilterIsAvailable] = useState('');
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // API operations
  const getAllBooks = () => {
    axios
      .get(apiUrl(routes.BOOK, methods.GET_ALL))
      .then((response) => {
        setBooks(response.data.booksList);
        setFilteredBooks(response.data.booksList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        toast.error('Failed to fetch books');
      });
  };

  const addBook = () => {
    axios
      .post(apiUrl(routes.BOOK, methods.POST), book)
      .then((response) => {
        toast.success('Book added successfully');
        handleCloseModal();
        getAllBooks();
        clearForm();
      })
      .catch((error) => {
        console.error('Error adding book:', error);
        toast.error('Failed to add book');
      });
  };

  const updateBook = () => {
    axios
      .put(apiUrl(routes.BOOK, methods.PUT, selectedBookId), book)
      .then((response) => {
        toast.success('Book updated successfully');
        handleCloseModal();
        handleCloseMenu();
        getAllBooks();
        clearForm();
      })
      .catch((error) => {
        console.error('Error updating book:', error);
        toast.error('Failed to update book');
      });
  };

  const deleteBook = (bookId) => {
    axios
      .delete(apiUrl(routes.BOOK, methods.DELETE, bookId))
      .then((response) => {
        toast.success('Book deleted successfully');
        handleCloseDialog();
        handleCloseMenu();
        getAllBooks();
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      });
  };

  const addBorrowal = () => {
    axios
      .post(apiUrl(routes.BORROWAL, methods.POST), borrowal)
      .then((response) => {
        toast.success('Borrowal added successfully');
        handleCloseBorrowalModal();
        clearBorrowForm();
      })
      .catch((error) => {
        console.error('Error adding borrowal:', error);
        toast.error('Failed to add borrowal');
      });
  };

  const fetchGenres = () => {
    axios
      .get(apiUrl(routes.GENRE, methods.GET_ALL))
      .then((response) => {
        setGenres(response.data.genresList);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        toast.error('Failed to fetch genres');
      });
  };

  const fetchAuthors = () => {
    axios
      .get(apiUrl(routes.AUTHOR, methods.GET_ALL))
      .then((response) => {
        setAuthors(response.data.authorsList);
      })
      .catch((error) => {
        console.error('Error fetching authors:', error);
        toast.error('Failed to fetch authors');
      });
  };

  useEffect(() => {
    fetchGenres();
    fetchAuthors();
  }, []);

  const getSelectedBookDetails = () => {
    const selectedBook = books.find((element) => element._id === selectedBookId);
    setBook(selectedBook);
  };

  const clearForm = () => {
    setBook({
      id: '',
      name: '',
      isbn: '',
      summary: '',
      isAvailable: true,
      authorId: '',
      genreId: '',
      photoUrl: '',
      pageUrls: [],
      position: '',
    });
  };

  const handleOpenMenu = (event) => {
    setIsMenuOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  const handleCloseBorrowalModal = () => {
    setIsBorrowalModalOpen(false);
  };

  const clearBorrowForm = () => {
    setBorrowal({
      bookId: '',
      memberId: '',
      borrowedDate: '',
      dueDate: '',
      status: '',
    });
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  useEffect(() => {
    if (filterName.trim() === '' && filterGenre === '' && filterAuthor === '' && filterIsAvailable === '') {
      setFilteredBooks(books);
    } else {
      let filteredResults = books;

      if (filterName.trim() !== '') {
        filteredResults = filteredResults.filter((book) =>
          book.name.toLowerCase().includes(filterName.trim().toLowerCase())
        );
      }

      if (filterGenre !== '') {
        filteredResults = filteredResults.filter((book) => book.genreId === filterGenre);
      }

      if (filterAuthor !== '') {
        filteredResults = filteredResults.filter((book) => book.authorId === filterAuthor);
      }

      if (filterIsAvailable !== '') {
        const isAvailableValue = filterIsAvailable === 'true';
        filteredResults = filteredResults.filter((book) => book.isAvailable === isAvailableValue);
      }

      setFilteredBooks(filteredResults);
    }
  }, [filterName, filterGenre, filterAuthor, filterIsAvailable, books]);

  // Pagination logic
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Helmet>
        <title>Book Management</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Books
          </Typography>
          {user?.role === 'Admin' && (
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
              New Book
            </Button>
          )}
        </Stack>

        <Card>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <OutlinedInput
                  fullWidth
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Search by name"
                  startAdornment={<Iconify icon="eva:search-fill" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>All Genres</em>
                  </MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>All Authors</em>
                  </MenuItem>
                  {authors.map((author) => (
                    <MenuItem key={author.id} value={author.id}>
                      {author.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  value={filterIsAvailable}
                  onChange={(e) => setFilterIsAvailable(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>All Availability</em>
                  </MenuItem>
                  <MenuItem value="true">Available</MenuItem>
                  <MenuItem value="false">Not Available</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {isTableLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} mt={2}>
            {currentBooks.map((book) => (
              <Grid key={book.id} item xs={12} sm={6} md={4}>
                <Card>
                  <Box sx={{ pt: '100%', position: 'relative' }}>
                    <StyledBookImage alt={book.name} src={book.photoUrl} />
                  </Box>
                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Typography variant="subtitle2" noWrap>
                      {book.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.isAvailable ? 'Available' : 'Not Available'}
                    </Typography>
                    <TruncatedTypography variant="body2">
                      {book.summary}
                    </TruncatedTypography>
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to={`/books/${book.id}`}
                      endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                    >
                      View Details
                    </Button>
                    {user?.role === 'Admin' && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => {
                            setSelectedBookId(book.id);
                            handleOpenMenu();
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setSelectedBookId(book.id);
                            handleOpenDialog();
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={Math.ceil(filteredBooks.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>

      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            getSelectedBookDetails();
            setIsUpdateForm(true);
            handleOpenModal();
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedBookId(null);
            setIsUpdateForm(false);
            clearForm();
            handleOpenModal();
          }}
        >
          <Iconify icon="eva:plus-fill" sx={{ mr: 2 }} />
          Add
        </MenuItem>
      </Popover>

      <BookDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onDelete={() => deleteBook(selectedBookId)}
      />

      <BookForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={isUpdateForm ? updateBook : addBook}
        book={book}
        setBook={setBook}
        isUpdateForm={isUpdateForm}
        genres={genres}
        authors={authors}
      />

      <BorrowalForm
        open={isBorrowalModalOpen}
        onClose={handleCloseBorrowalModal}
        onSubmit={addBorrowal}
        borrowal={borrowal}
        setBorrowal={setBorrowal}
      />

      <ImportBooksModal
        open={isImportModalOpen}
        onClose={handleCloseImportModal}
        onImported={getAllBooks}
      />
    </>
  );
};

export default BookPage;
