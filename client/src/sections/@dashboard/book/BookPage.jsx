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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Alert,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
import Scrollbar from '../../../components/scrollbar';
import Label from '../../../components/label';
import BookDialog from './BookDialog';
import BookForm from './BookForm';
import Iconify from '../../../components/iconify';
import { apiUrl, methods, routes } from '../../../constants';
import ImportBooksModal from './ImportBooksModal';

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

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterIsAvailable, setFilterIsAvailable] = useState('');
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const getAllBooks = () => {
    axios
      .get(apiUrl(routes.BOOK, methods.GET_ALL))
      .then((response) => {
        console.log(response)
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
        filteredResults = filteredResults.filter((book) => book.isAvailable.toString() === filterIsAvailable);
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

  function formatDate(date) {
    const d = new Date(date);
    let day = '' + d.getDate();
    let month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;

    return [day, month, year].join('/');
  }

  const tableHeadCells = [
    { id: 'photo', label: 'Photo', alignRight: false },
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'position', label: 'Position', alignRight: false },
    { id: 'author', label: 'Author', alignRight: false },
    { id: 'genre', label: 'Genre', alignRight: false },
    { id: 'isAvailable', label: 'Availability', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    { id: 'actions', label: 'Actions', alignRight: true },
  ];

  const renderTableHead = () => (
    <TableHead>
      <TableRow>
        {tableHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => (
    <TableBody>
      {filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((book) => {
        const { _id, photoUrl, name, position, authorId, genreId, isAvailable, createdAt } = book;
        const author = authors.find((author) => author._id === authorId);
        const genre = genres.find((genre) => genre._id === genreId);

        return (
          <TableRow key={_id}>
            <TableCell>
              <img src={photoUrl} alt={name} width="100" height="100" />
            </TableCell>
            <TableCell>
              <Link to={`/books/${_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {name}
              </Link>
            </TableCell>
            <TableCell>{position}</TableCell>
            <TableCell>{author ? author.name : 'N/A'}</TableCell>
            <TableCell>
              <Label
                variant="filled"
                sx={{
                  textTransform: 'uppercase',
                  color: 'primary.main',
                }}
              >
                {genre.name}
              </Label>
            </TableCell>
            <TableCell>
              <Label color={isAvailable ? 'success' : 'error'} sx={{ padding: 2 }}>
                {isAvailable ? 'Available' : 'Not available'}
              </Label>
            </TableCell>
            <TableCell>{formatDate(createdAt)}</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  setSelectedBookId(book._id);
                  handleOpenMenu(e);
                }}
              >
                <Iconify icon={'eva:more-vertical-fill'} />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );

  return (
    <>
      <Helmet>
        <title>Books | Book Management</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Books
          </Typography>
          {user.isAdmin === true || user.isLibrarian === true ? (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
                New Book
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:cloud-upload-outline" />}
                onClick={() => {
                  handleOpenImportModal();
                }}
              >
                Import Books
              </Button>
            </Stack>
          ): null}
        </Stack>

        <Stack direction="row" spacing={2} mb={5}>
          <TextField
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Search by name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-outline" />
                </InputAdornment>
              ),
            }}
          />
          <Select
            displayEmpty
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            input={<OutlinedInput />}
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
            displayEmpty
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            input={<OutlinedInput />}
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
            displayEmpty
            value={filterIsAvailable}
            onChange={(e) => setFilterIsAvailable(e.target.value)}
            input={<OutlinedInput />}
          >
            <MenuItem value="">
              <em>All Availability</em>
            </MenuItem>
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Not Available</MenuItem>
          </Select>
        </Stack>

        {isTableLoading ? (
          <Grid padding={2} style={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : user.isAdmin || user.isLibrarian ? (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  {renderTableHead()}
                  {renderTableBody()}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredBooks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        ) : filteredBooks.length > 0 ? (
          <div>
          <TablePagination
              component="div"
              count={filteredBooks.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 24]}
            />

            <Grid container spacing={3}>
              {filteredBooks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book) => (
                  <Grid key={book._id} item xs={12} sm={6} md={4}>
                <Card>
                  <Box sx={{ pt: '80%', position: 'relative' }}>
                    <Label
                      variant="filled"
                      sx={{
                        zIndex: 9,
                        top: 16,
                        left: 16,
                        position: 'absolute',
                        textTransform: 'uppercase',
                        color: 'primary.main',
                      }}
                    >
                      {book.genre.name}
                    </Label>
                    {(user.isAdmin || user.isLibrarian) && (
                      <Label
                        variant="filled"
                        sx={{
                          zIndex: 9,
                          top: 12,
                          right: 16,
                          position: 'absolute',
                          borderRadius: '100%',
                          width: '30px',
                          height: '30px',
                          color: 'white',
                          backgroundColor: 'white',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            setSelectedBookId(book._id);
                            handleOpenMenu(e);
                          }}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </Label>
                    )}

                    <StyledBookImage alt={book.name} src={book.photoUrl} />
                  </Box>

                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center" variant="h5" noWrap>
                        {book.name}
                      </Typography>
                    </Link>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: '#888888' }}
                      paddingBottom={1}
                      noWrap
                      textAlign="center"
                    >
                      {book.author.name}
                    </Typography>
                    <Label color={book.isAvailable ? 'success' : 'error'} sx={{ padding: 2 }}>
                      {book.isAvailable ? 'Available' : 'Not available'}
                    </Label>

                    <Typography variant="subtitle2" textAlign="center" paddingTop={1}>
                      ISBN: {book.isbn}
                    </Typography>
                    <TruncatedTypography variant="body2">{book.summary}</TruncatedTypography>
                  </Stack>
                </Card>
              </Grid>
                ))}
            </Grid>
            </div>
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

        <BookDialog
          isDialogOpen={isDialogOpen}
          bookId={selectedBookId}
          handleDeleteBook={deleteBook}
          handleCloseDialog={handleCloseDialog}
        />

        <BookForm
          isUpdateForm={isUpdateForm}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          id={selectedBookId}
          book={book}
          setBook={setBook}
          handleAddBook={addBook}
          handleUpdateBook={updateBook}
        />

        <ImportBooksModal isOpen={isImportModalOpen} onClose={handleCloseImportModal} />

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
            sx={{ color: 'success.main' }}
            onClick={() => {
              setIsUpdateForm(true);
              getSelectedBookDetails();
              handleOpenModal();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => {
              handleOpenDialog();
              handleCloseMenu();
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </Container>
    </>
  );
};

export default BookPage;
