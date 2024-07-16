import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../hooks/useAuth';

const BorrowalForm = ({
  handleAddBorrowal,
  handleUpdateBorrowal,
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  borrowal,
  setBorrowal,
  bookName,
  id
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);

  console.log(borrowal);

  const getAllMembers = useCallback(() => {
    axios
      .get('http://localhost:8080/api/user/getAllMembers')
      .then((response) => {
        const filteredMembers = response.data.membersList.filter(
          (member) => !(member.isLibrarian && user.isLibrarian)
        );
        if (user.isAdmin || user.isLibrarian) {
          setMembers(filteredMembers);
        } else {
          setMembers(filteredMembers.filter((member) => user._id === member._id));
        }
        setBorrowal((prev) => ({ ...prev, memberId: user._id }));
      })
      .catch((error) => {
        toast.error('Error fetching members');
        console.log(error);
      });
  }, [setBorrowal, user]);

  const getAllBooks = useCallback(() => {
    axios
      .get('http://localhost:8080/api/book/getAll')
      .then((response) => {
        const allBooks = response.data.booksList;
        setBooks(allBooks);
        const availableBooksList = allBooks.filter((book) => book.isAvailable);
        setAvailableBooks(availableBooksList);
      })
      .catch((error) => {
        toast.error('Error fetching books');
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getAllMembers();
    getAllBooks();
  }, [getAllMembers, getAllBooks]);

  useEffect(() => {
    if (!isUpdateForm) {
      setBorrowal((prev) => ({
        ...prev,
        requestDate: new Date().toISOString().split('T')[0], 
        status: 'pending', 
        bookId: id, 
      }));
    }
  }, [setBorrowal, isUpdateForm, id]);

  useEffect(() => {
    if (!user.isAdmin && !user.isLibrarian) {
      setBorrowal((prev) => ({
        ...prev,
        borrowedDate: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Assuming a default due date 7 days from borrowed date
        status: 'pending',
      }));
    }
  }, [user, setBorrowal]);

  const handleDateChange = (field, value) => {
    const isoDate = new Date(value).toISOString();
    setBorrowal((prev) => ({ ...prev, [field]: isoDate }));
  };

  const handleSubmit = () => {
    // Check if borrowed date is greater than due date
    if (new Date(borrowal.borrowedDate) > new Date(borrowal.dueDate)) {
      toast.error('Borrowed date cannot be later than due date.');
      return;
    }
  
    if (isUpdateForm) {
      handleUpdateBorrowal();
    } else {
      // Check required fields before adding new borrowal
      if (!borrowal.memberId || !borrowal.bookId || !borrowal.borrowedDate || !borrowal.dueDate || !borrowal.status) {
        toast.error('Please fill in all required fields.');
        return;
      }
      handleAddBorrowal();
    }
  };  

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
  };

  const isAdminOrLibrarian = user.isAdmin || user.isLibrarian;

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" paddingBottom={2} paddingTop={1}>
            {isUpdateForm ? 'Update' : 'Add'} borrowal
          </Typography>
          <Stack spacing={3} paddingY={2}>
            <Grid container spacing={0} sx={{ paddingBottom: '4px' }}>
              <Grid item xs={12} md={6} paddingRight={1}>
                <FormControl sx={{ m: 0 }} fullWidth>
                  <InputLabel id="member-label">Member</InputLabel>
                  <Select
                    required
                    disabled={!isAdminOrLibrarian}
                    labelId="member-label"
                    id="member"
                    value={borrowal.memberId}
                    label="Member"
                    onChange={(e) => setBorrowal({ ...borrowal, memberId: e.target.value })}
                  >
                    {members.map((member) => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} paddingLeft={1}>
                <FormControl sx={{ m: 0 }} fullWidth>
                  <Typography variant="subtitle1" id="book-label" aria-describedby="book-label">
                    Book
                  </Typography>
                  <Typography variant="body1" id="book-name">
                    {bookName}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={0} sx={{ paddingBottom: '4px' }}>
              <Grid item xs={12} md={6} paddingRight={1}>
                <TextField
                  fullWidth
                  name="borrowedDate"
                  label="Borrowed date"
                  type="date"
                  value={borrowal.borrowedDate ? new Date(borrowal.borrowedDate).toISOString().split('T')[0] : ''}
                  required
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleDateChange('borrowedDate', e.target.value)}
                  disabled={!isAdminOrLibrarian}
                />
              </Grid>
              <Grid item xs={12} md={6} paddingLeft={1}>
                <TextField
                  fullWidth
                  name="dueDate"
                  label="Due date"
                  type="date"
                  value={borrowal.dueDate ? new Date(borrowal.dueDate).toISOString().split('T')[0] : ''}
                  required
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleDateChange('dueDate', e.target.value)}
                  disabled={!isAdminOrLibrarian}
                />
              </Grid>
            </Grid>

            <FormControl sx={{ m: 0 }} fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={borrowal.status}
                label="Status"
                onChange={(e) => setBorrowal({ ...borrowal, status: e.target.value })}
                disabled={!isAdminOrLibrarian}
              >
                <MenuItem value="pending">
                  <HourglassEmptyIcon style={{ marginRight: 8 }} /> Pending
                </MenuItem>
                <MenuItem value="accepted">
                  <CheckCircleIcon style={{ marginRight: 8 }} /> Accepted
                </MenuItem>
                <MenuItem value="rejected">
                  <CancelIcon style={{ marginRight: 8 }} /> Rejected
                </MenuItem>
                <MenuItem value="returned">
                  <ReplayIcon style={{ marginRight: 8 }} /> Returned
                </MenuItem>
              </Select>
            </FormControl>

            <br />
            <Box textAlign="center">
              <Box textAlign="center" paddingBottom={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<Iconify icon="bi:check-lg" />}
                  style={{ marginRight: '12px' }}
                >
                  Submit
                </Button>

                <Button
                  size="large"
                  color="inherit"
                  variant="contained"
                  onClick={handleCloseModal}
                  startIcon={<Iconify icon="charm:cross" />}
                  style={{ marginLeft: '12px' }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

BorrowalForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  borrowal: PropTypes.object,
  setBorrowal: PropTypes.func,
  handleAddBorrowal: PropTypes.func,
  handleUpdateBorrowal: PropTypes.func,
  bookName: PropTypes.string,
  id: PropTypes.string
};

export default BorrowalForm;
