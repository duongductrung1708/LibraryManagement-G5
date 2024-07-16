import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Alert } from '@mui/lab';
import {
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import Label from '../../../components/label';

import FineListHead from './FineListHead';
import FineForm from './FineForm';
import FineDialog from './FineDialog';
import { applySortFilter, getComparator } from '../../../utils/tableOperations';
import { apiUrl, methods, routes } from '../../../constants';
import { useAuth } from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'memberName', label: 'Member Name', alignRight: false },
  { id: 'bookName', label: 'Book Name', alignRight: false },
  { id: 'requestDate', label: 'Request Date', alignRight: false },
  { id: 'borrowedDate', label: 'Borrowed Date', alignRight: false },
  { id: 'dueDate', label: 'Due Date', alignRight: false },
  { id: 'fineAmount', label: 'Fine Amount', alignRight: false },
  { id: 'daysOverdue', label: 'Days Overdue', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: '', alignRight: true },
];

// ----------------------------------------------------------------------

const ManageFines = () => {
  const { user } = useAuth();
  // State variables
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('borrowalId');
  const [memberNameFilter, setMemberNameFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Data
  const [fine, setFine] = useState({
    status: '',
  });
  const [fines, setFines] = useState([]);
  const [selectedFineId, setSelectedFineId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // Load data on initial page load
  useEffect(() => {
    getAllFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API operations
  const getAllFines = () => {
    axios
      .get(apiUrl(routes.FINE, methods.GET_ALL))
      .then((response) => {
        // handle success
        console.log(response.data);
        if (user.isAdmin || user.isLibrarian) {
          setFines(response.data.formatfines);
        } else {
          setFines(response.data.formatfines.filter((fine) => user._id === fine.memberId));
        }
        setIsTableLoading(false);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const addFine = () => {
    axios
      .post(apiUrl(routes.FINE, methods.POST), fine)
      .then((response) => {
        toast.success('Fine added');
        console.log(response.data);
        handleCloseModal();
        getAllFines();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const updateFine = () => {
    axios
      .put(apiUrl(routes.FINE, methods.PUT, selectedFineId), fine)
      .then((response) => {
        toast.success('Fine updated');
        console.log(response.data);
        handleCloseModal();
        handleCloseMenu();
        getAllFines();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const deleteFine = () => {
    axios
      .delete(apiUrl(routes.FINE, methods.DELETE, selectedFineId))
      .then((response) => {
        toast.success('Fine deleted');
        handleCloseDialog();
        handleCloseMenu();
        console.log(response.data);
        getAllFines();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const getSelectedFineDetails = () => {
    const selectedFine = fines.find((element) => element._id === selectedFineId);
    setFine(selectedFine);
  };

  const clearForm = () => {
    setFine({
      status: '',
    });
  };

  // Handler functions
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

  const handleFilterByName = (event) => {
    setMemberNameFilter(event.target.value);
  };

  // Table functions
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'unpaid':
        return <Label color="warning">Unpaid</Label>;
      case 'paid':
        return <Label color="success">Paid</Label>;
      default:
        return null;
    }
  };

  const filteredFines = applySortFilter(
    fines.filter((fine) => fine.username.toLowerCase().includes(memberNameFilter.toLowerCase())),
    getComparator(order, orderBy)
  );

  function formatDate(date) {
    const d = new Date(date);
    let day = '' + d.getDate();
    let month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;

    return [day, month, year].join('/');
  }

  return (
    <>
      <Helmet>
        <title>Manage Fines</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Manage Fines
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <OutlinedInput
            value={memberNameFilter}
            onChange={handleFilterByName}
            placeholder="Search by member name..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            sx={{ width: 240 }}
          />
        </Stack>
        {isTableLoading ? (
          <Grid style={{ textAlign: 'center' }}>
            <CircularProgress size="lg" />
          </Grid>
        ) : (
          <Card>
            <Scrollbar>
              {filteredFines.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <FineListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={filteredFines.length}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {filteredFines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fine) => (
                        <TableRow hover key={fine._id} tabIndex={-1}>
                          <TableCell align="left">{fine.username}</TableCell>
                          <TableCell align="left">{fine.book}</TableCell>
                          <TableCell align="left">{formatDate(fine.requestDate)}</TableCell>
                          <TableCell align="left">{formatDate(fine.borrowedDate)}</TableCell>
                          <TableCell align="left">{formatDate(fine.dueDate)}</TableCell>
                          <TableCell align="left">{fine.fineAmount}</TableCell>
                          <TableCell align="left">{fine.daysOverdue}</TableCell>
                          <TableCell align="left" style={{ textTransform: 'uppercase' }}>
                            {getStatusLabel(fine.status)}
                          </TableCell>
                          {user.isAdmin || user.isLibrarian ? (
                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(e) => {
                                setSelectedFineId(fine._id);
                                handleOpenMenu(e);
                              }}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                          ) : null}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="warning" color="warning">
                  No fines found
                </Alert>
              )}
            </Scrollbar>
            {filteredFines.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredFines.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Card>
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
            setIsUpdateForm(true);
            getSelectedFineDetails();
            handleCloseMenu();
            handleOpenModal();
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDialog}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <FineForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedFineId}
        fine={fine}
        setFine={setFine}
        handleAddFine={addFine}
        handleUpdateFine={updateFine}
      />

      <FineDialog
        isDialogOpen={isDialogOpen}
        fineId={selectedFineId}
        handleDeleteFine={deleteFine}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default ManageFines;
