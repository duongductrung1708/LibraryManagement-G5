import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Stack, Container, Grid, Card, Button } from '@mui/material';
import { apiUrl, methods, routes } from '../../../constants';

export default function GenreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [genre, setGenre] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 4,
    marginTop: "30rem",
  };

  const getGenreAndBooks = useCallback(() => {
    setLoading(true);
    axios
      .get(apiUrl(routes.GENRE, methods.GET, id), { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.genre) {
          setGenre(response.data.genre);
          return axios.get(apiUrl(routes.BOOKS_BY_GENRE, methods.GET, id), { withCredentials: true });
        } else {
          throw new Error('Genre not found');
        }
      })
      .then((booksResponse) => {
        setBooks(booksResponse.data.books);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching genre and books:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getGenreAndBooks();
  }, [getGenreAndBooks]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!genre) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Genre not found</Typography>
      </Box>
    );
  }

  const backToBookPage = () => {
    navigate('/books');
  };

  return (
    <Box sx={style}>
      <Button variant="outlined" color="primary" sx={{ mb: 2 }} onClick={backToBookPage}>
        Back to Book
      </Button>
      <Helmet>
        <title>Author Profile - {genre.name}</title>
      </Helmet>
      <Container>
        <Stack spacing={3} paddingY={2} alignItems={'center'}>
          <Typography variant="h4" style={{ textAlign: 'center', width: '100%' }}>
            {genre.name}
          </Typography>
          <Typography variant="body1" style={{ width: '100%' }}>
            Description: {genre.description || 'No description available'}
          </Typography>
          <Typography variant="h6" style={{ width: '100%' }}>
            Books by {genre.name}:
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {books.map((book) => (
              <Grid item xs={12} sm={4} key={book._id} style={{ paddingLeft: '3rem' }}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <img alt={book.name} src={book.photoUrl} style={{ width: '100%', height: 'auto' }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2, textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => navigate(`/books/${book._id}`)}
                  >
                    {book.name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
