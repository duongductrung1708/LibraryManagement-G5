import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Alert } from '@mui/lab';
import {
  Avatar,
  Button,
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
import UserTableHead from './UserListHead';
import UserForm from './UserForm';
import UserDialog from './UserDialog';
import { applySortFilter, getComparator } from '../../../utils/tableOperations';
import { apiUrl, methods, routes } from '../../../constants';
import ImportUsersModal from './ImportUsersModal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'photo', label: 'Photo', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'dob', label: 'DOB', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '', label: '', alignRight: false },
];

// ----------------------------------------------------------------------

const UserPage = () => {
  // State variables
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Data
  const [user, setUser] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    status: true,
    phone: '',
    isAdmin: false,
    isLibrarian: false,
    photoUrl: 'https://www.pngitem.com/pimgs/m/645-6452863_profile-image-memoji-brown-hair-man-with-glasses.png',
  });
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    setIsTableLoading(true);
    axios
      .get(apiUrl(routes.USER, methods.GET_ALL))
      .then((response) => {
        setUsers(response.data.usersList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch users');
        setIsTableLoading(false);
      });
  };

  const addUser = () => {
    axios
      .post(apiUrl(routes.AUTH, methods.POST), user)
      .then((response) => {
        toast.success('User added');
        handleCloseModal();
        getAllUsers();
        clearForm();
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          toast.error('User already exists');
        } else {
          console.error(error);
          toast.error('Something went wrong, please try again');
        }
      });
  };

  const updateUser = () => {
    axios
      .put(apiUrl(routes.USER, methods.PUT, selectedUserId), user)
      .then((response) => {
        toast.success('User updated');
        handleCloseModal();
        handleCloseMenu();
        getAllUsers();
        clearForm();
      })
      .catch((error) => {
        console.error(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const deleteUser = (userId) => {
    axios
      .delete(apiUrl(routes.USER, methods.DELETE, userId))
      .then((response) => {
        toast.success('User deleted');
        handleCloseDialog();
        handleCloseMenu();
        getAllUsers();
      })
      .catch((error) => {
        console.error(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const getSelectedUserDetails = () => {
    const selectedUser = users.find((element) => element._id === selectedUserId);
    setUser(selectedUser);
  };

  const clearForm = () => {
    setUser({
      name: '',
      dob: '',
      email: '',
      password: '',
      phone: '',
      status: true,
      isAdmin: false,
      isLibrarian: false,
      photoUrl: '',
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

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

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
  };

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Users
          </Typography>
          <Stack direction="row" spacing={2}>
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
            <Button
              variant="contained"
              onClick={() => {
                handleOpenImportModal();
              }}
              startIcon={<Iconify icon="eva:cloud-upload-outline" />}
            >
              Import New Users
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <OutlinedInput
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Search by name..."
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
              {filteredUsers.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserTableHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={filteredUsers.length}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                        <TableRow hover key={user._id} tabIndex={-1}>
                          <TableCell align="left">
                            <Avatar alt={user.name} src={user.photoUrl} />
                          </TableCell>

                          <TableCell align="left">{user.name}</TableCell>

                          <TableCell align="left">{new Date(user.dob).toLocaleDateString('en-US')}</TableCell>

                          <TableCell align="left">{user.email}</TableCell>

                          <TableCell align="left">
                            {user.status ? (
                              <Label color="success">ACTIVE</Label>
                            ) : (
                              <Label color="error">DEACTIVE</Label>
                            )}
                          </TableCell>

                          <TableCell align="left">{user.phone}</TableCell>

                          <TableCell align="left">
                            {user.isAdmin ? (
                              <Label color="error">Admin</Label>
                            ) : user.isLibrarian ? (
                              <Label color="warning">Librarian</Label>
                            ) : (
                              <Label color="success">Member</Label>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(e) => {
                                setSelectedUserId(user._id);
                                handleOpenMenu(e);
                              }}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="warning" color="warning">
                  No users found
                </Alert>
              )}
            </Scrollbar>
            {filteredUsers.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
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
            getSelectedUserDetails();
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

      <UserForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedUserId}
        user={user}
        setUser={setUser}
        handleAddUser={addUser}
        handleUpdateUser={updateUser}
      />

      <UserDialog
        isDialogOpen={isDialogOpen}
        userId={selectedUserId}
        handleDeleteUser={deleteUser}
        handleCloseDialog={handleCloseDialog}
      />
      <ImportUsersModal isOpen={isImportModalOpen} onClose={handleCloseImportModal} />
    </>
  );
};

export default UserPage;
