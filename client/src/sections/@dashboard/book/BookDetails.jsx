import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, Avatar, TextField, Divider, Breadcrumbs, Link, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Label from '../../../components/label';
import BorrowalForm from '../borrowal/BorrowalForm';

// ----------------------------------------------------------------------

const TruncatedTypography = styled(Typography)({
  color: 'black',
});

const BookDetails = () => {
  const [borrowal, setBorrowal] = useState({
    bookId: '',
    memberId: '',
    borrowedDate: '',
    dueDate: '',
    status: '',
  });

  const navigate = useNavigate();
  const [isBorrowalModalOpen, setIsBorrowalModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [review, setReview] = useState('');

  // Hardcoded data for testing
  const book = {
    _id: '1',
    name: 'Sample Book',
    photoUrls: [
      'https://via.placeholder.com/600x800',
      'https://via.placeholder.com/601x801',
      'https://via.placeholder.com/600x800',
      'https://via.placeholder.com/603x803',
    ],
    summary: 'This is a sample book summary.',
    isbn: '123-456-789',
    isAvailable: true,
  };

  const author = {
    name: 'John Doe',
    photoUrl: 'https://via.placeholder.com/50',
  };

  const genre = {
    name: 'Fiction',
  };

  const user = {
    name: 'Jane Doe',
    photoUrl: 'https://via.placeholder.com/50',
  };

  const reviews = [
    {
      _id: '1',
      reviewedBy: user,
      review: 'Great book!',
    },
    {
      _id: '2',
      reviewedBy: user,
      review: 'Interesting read.',
    },
  ];

  const images = book.photoUrls.map((url) => ({
    original: url,
    thumbnail: url,
  }));

  const backToBookPage = () => {
    navigate('/books');
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

  return (
    <Container>
      <Helmet>
        <title>{book.name} - Book Details</title>
      </Helmet>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/books">
          Books
        </Link>
        <Link component={RouterLink} to={`/books/genres/${genre.name}`}>
          {genre.name}
        </Link>
        <Typography color="text.primary">{book.name}</Typography>
      </Breadcrumbs>

      <Button variant="outlined" color="primary" onClick={backToBookPage} sx={{ mb: 2 }}>
        Back to Books
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <ImageGallery items={images} />
        </Grid>
        <Grid item xs={12} sm={8} style={{ paddingLeft: '3rem' }}>
          <Box>
            <Typography variant="h3">{book.name}</Typography>
            <Label color={book.isAvailable ? 'success' : 'error'} sx={{ mt: 1, mb: 2 }}>
              {book.isAvailable ? 'Available' : 'Not available'}
            </Label>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar alt={author.name} src={author.photoUrl} /> {author.name}
            </Typography>
            <Box sx={{ position: 'relative', mt: 2 }}>
              <TruncatedTypography variant="body1">{book.summary}</TruncatedTypography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2 }}>
              ISBN: {book.isbn}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2 }}>
              GENRE: {genre.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2 }}>
              LANGUAGE: English
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2 }}>
              PAGES: 240p
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={(e) => {
                setSelectedBookId(book._id);
                handleOpenBorrowalModal(e);
              }}
            >
              Borrow
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mt: 2 }}>Write a Review</Typography>
        <Grid item xs={12} style={{ paddingLeft: "3rem" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt={user?.name} src={user?.photoUrl} sx={{ mr: 2 }} />
            <Typography variant="subtitle1" sx={{ color: '#888888' }}>{user?.name}</Typography>
          </Box>
          <TextField
            id="standard-basic"
            label="Your comment"
            variant="standard"
            fullWidth
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="primary" sx={{ mt: 2 }} 
          // onClick={addReview}
          >
            Submit Review
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Reviews</Typography>
        {reviews.map((rev) => (
          <Box key={rev._id} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar alt={rev.reviewedBy.name} src={rev.reviewedBy.photoUrl} sx={{ mr: 2 }} />
              <Typography variant="subtitle1" sx={{ color: '#888888' }}>{rev.reviewedBy.name}</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#000000' }}>{rev.review}</Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>
      <BorrowalForm
        isModalOpen={isBorrowalModalOpen}
        handleCloseModal={handleCloseBorrowalModal}
        id={selectedBookId}
        borrowal={borrowal}
        setBorrowal={setBorrowal}
        // handleAddBorrowal={addBorrowal}
      />
    </Container>
  );
};

export default BookDetails;
