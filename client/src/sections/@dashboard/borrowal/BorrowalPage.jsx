import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Alert } from '@mui/lab';

const BorrowalPage = () => {
  const [borrowals, setBorrowals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/borrowal/getall');
        setBorrowals(response.data.borrowalsList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching borrowals:', error);
        setIsLoading(false);
      }
    };

    fetchBorrowals();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Borrowals
      </Typography>
      {borrowals.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member Name</TableCell>
                <TableCell>Book Name</TableCell>
                <TableCell>Borrowed On</TableCell>
                <TableCell>Due On</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowals.map((borrowal) => (
                <TableRow key={borrowal.borrowal._id}>
                  <TableCell>{borrowal.borrowal.memberId.name}</TableCell> {/* Display member name */}
                  <TableCell>{borrowal.borrowal.bookId.name}</TableCell> {/* Display book name */}
                  <TableCell>{new Date(borrowal.borrowal.borrowedDate).toLocaleDateString('en-US')}</TableCell> {/* Format borrowedDate */}
                  <TableCell>{new Date(borrowal.borrowal.dueDate).toLocaleDateString('en-US')}</TableCell> {/* Format dueDate */}
                  <TableCell>{borrowal.borrowal.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="warning">No borrowals found</Alert>
      )}
    </Container>
  );
};

export default BorrowalPage;
