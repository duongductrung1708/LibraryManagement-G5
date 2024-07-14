import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Popover,
  Stack,
  Typography,
  Select,
  TablePagination, // Import TablePagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Alert } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
import Label from '../../../components/label';
import BookDialog from './BookDialog';
import BookForm from './BookForm';
import Iconify from '../../../components/iconify';
import { apiUrl, methods, routes } from '../../../constants';
import BorrowalForm from '../borrowal/BorrowalForm';

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
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(3); // Pagination state

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

  const handleOpenBorrowalModal = () => {
    setIsBorrowalModalOpen(true);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title> Books | Library Management System </title>
      </Helmet>

      <Container>
        <Typography variant="h4" gutterBottom>
          Books
        </Typography>

        {isTableLoading ? (
          <CircularProgress />
        ) : (
          <>
          
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>
              <Button
                variant="contained"
                component={Link}
                to="#"
                onClick={() => {
                  handleOpenModal();
                  setIsUpdateForm(false);
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Book
              </Button>

              <Stack direction="row" spacing={2}>
                <OutlinedInput
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Search by name"
                />
                <Select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Genres</em>
                  </MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre._id} value={genre._id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All Authors</em>
                  </MenuItem>
                  {authors.map((author) => (
                    <MenuItem key={author._id} value={author._id}>
                      {author.name}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={filterIsAvailable}
                  onChange={(e) => setFilterIsAvailable(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="true">Available</MenuItem>
                  <MenuItem value="false">Not Available</MenuItem>
                </Select>
              </Stack>
            </Stack>

            <TablePagination
              component="div"
              count={filteredBooks.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[3, 6, 9]} // Pagination options
            />

            <Grid container spacing={3}>
              {filteredBooks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book) => (
                  <Grid key={book._id} item xs={12} sm={6} md={4}>
                    <Card>
                      <Box sx={{ pt: '100%', position: 'relative' }}>
                        {book.isAvailable && (
                          <Label
                            variant="filled"
                            color="info"
                            sx={{
                              zIndex: 9,
                              top: 16,
                              right: 16,
                              position: 'absolute',
                              textTransform: 'uppercase',
                            }}
                          >
                            Available
                          </Label>
                        )}
                        <StyledBookImage alt={book.name} src={book.photoUrl} />
                      </Box>

                      <Stack spacing={2} sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle1" noWrap>
                            {book.name}
                          </Typography>
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              handleOpenMenu(event);
                              setSelectedBookId(book._id);
                            }}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" noWrap>
                          ISBN: {book.isbn}
                        </Typography>

                        <TruncatedTypography variant="body2" color="text.secondary">
                          Summary: {book.summary}
                        </TruncatedTypography>

                        <Typography variant="body2" color="text.secondary">
                          Position: {book.position}
                        </Typography>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            {/* <TablePagination
              component="div"
              count={filteredBooks.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[3, 6, 9]} // Pagination options
            /> */}
          </>
        )}
      </Container>

      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenModal();
            setIsUpdateForm(true);
            getSelectedBookDetails();
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        {user?.userType === 'MEMBER' ? (
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => {
              handleOpenBorrowalModal();
              setBorrowal({ ...borrowal, bookId: selectedBookId });
            }}
          >
            <Iconify icon="eva:book-open-fill" sx={{ mr: 2 }} />
            Borrow
          </MenuItem>
        ) : (
          <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDialog}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>

      <BookForm
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={isUpdateForm ? updateBook : addBook}
        book={book}
        setBook={setBook}
        genres={genres}
        authors={authors}
      />

      <BookDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={() => deleteBook(selectedBookId)}
        title="Delete Confirmation"
        description="Are you sure you want to delete this book? This action cannot be undone."
      />

      <BorrowalForm
        open={isBorrowalModalOpen}
        onClose={handleCloseBorrowalModal}
        onSubmit={addBorrowal}
        borrowal={borrowal}
        setBorrowal={setBorrowal}
      />
    </>
  );
};

export default BookPage;
