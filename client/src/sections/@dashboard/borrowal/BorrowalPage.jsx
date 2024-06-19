import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Alert } from '@mui/lab';
import Iconify from '../../../components/iconify';

import toast from "react-hot-toast";

import {
  Avatar,
  Button,
  Card,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Popover,
  Stack,
  TablePagination,
} from "@mui/material";

import BorrowalForm from './BorrowalForm';

const BorrowalPage = () => {
  const [borrowal, setBorrowal]=useState({
    memberId: '',
    bookId: '',
    borrowedDate: '',
    dueDate: '',
    status: '',
  })
  const [borrowals, setBorrowals] = useState([
    {
      borrowal: {
        memberId: { name: "Kiên" },
        bookId: { name: "Book A" },
        borrowedDate: new Date(),
        dueDate: new Date(),
        status: "Borrowed",
      },
    },
    {
      borrowal: {
        memberId: { name: "Hoa" },
        bookId: { name: "Book B" },
        borrowedDate: new Date(),
        dueDate: new Date(),
        status: "Returned",
      },
    },
   
  ]);
  const [isLoading, setIsLoading] = useState(false); // Change to false since we're using hardcoded data
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // useEffect(() => {
  //   const fetchBorrowals = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8080/api/borrowal/getall');
  //       setBorrowals(response.data.borrowalsList);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching borrowals:', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchBorrowals();
  // }, []);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Borrowals
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setIsUpdateForm(false);
              handleOpenModal();
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Stack>
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
                {borrowals.map((borrowal, index) => (
                  <TableRow key={index}>
                    <TableCell>{borrowal.borrowal.memberId.name}</TableCell>
                    <TableCell>{borrowal.borrowal.bookId.name}</TableCell>
                    <TableCell>{new Date(borrowal.borrowal.borrowedDate).toLocaleDateString('en-US')}</TableCell>
                    <TableCell>{new Date(borrowal.borrowal.dueDate).toLocaleDateString('en-US')}</TableCell>
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
    </>
  );
};

export default BorrowalPage;