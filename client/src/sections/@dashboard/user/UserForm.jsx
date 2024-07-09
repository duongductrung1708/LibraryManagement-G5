import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../components/iconify';

const UserForm = ({ isUpdateForm, isModalOpen, handleCloseModal, user, setUser, handleAddUser, handleUpdateUser }) => {
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
            {isUpdateForm ? <span>Update</span> : <span>Add</span>} user
          </Typography>
          <Stack spacing={3} paddingY={2}>
            <Grid container spacing={0}>
              <Grid item xs={12} md={8} paddingRight={1}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={user.name}
                  autoFocus
                  required
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                      photoUrl: `https://api.dicebear.com/8.x/${e.target.value.replace(' ', '+')}/svg`,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4} paddingLeft={1}>
                <TextField
                  fullWidth
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  value={user.dob}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setUser({ ...user, dob: e.target.value })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={0} sx={{ paddingBottom: '4px' }}>
              <Grid item xs={12} md={6} paddingRight={1}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={user.email}
                  required
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6} paddingLeft={1}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  type="number"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </Grid>
            </Grid>

            <FormControl>
              <FormLabel id="available-label" sx={{ textAlign: 'center' }}>
                User role
              </FormLabel>
              <RadioGroup
                sx={{ paddingTop: '10px' }}
                aria-labelledby="available-label"
                defaultValue={user.isAdmin ? 'Admin' : user.isLibrarian ? 'Librarian' : 'Member'}
                name="radio-buttons-group"
                onChange={(e) => {
                  const isAdmin = e.target.value === 'Admin';
                  const isLibrarian = e.target.value === 'Librarian';
                  setUser({ ...user, isAdmin, isLibrarian });
                }}
              >
                <Grid container spacing={0}>
                  <Grid item xs={12} md={4} paddingRight={1}>
                    <FormControlLabel
                      value="Admin"
                      control={<Radio />}
                      label="Admin"
                      sx={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} paddingRight={1}>
                    <FormControlLabel
                      value="Librarian"
                      control={<Radio />}
                      label="Librarian"
                      sx={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} paddingLeft={1}>
                    <FormControlLabel
                      value="Member"
                      control={<Radio />}
                      label="Member"
                      sx={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel id="status-label" sx={{ textAlign: 'center' }}>
                User Status
              </FormLabel>
              <RadioGroup
                sx={{ paddingTop: '10px' }}
                aria-labelledby="status-label"
                defaultValue={user.status ? 'ACTIVE' : 'DEACTIVE'}
                name="radio-buttons-group-status"
                onChange={(e) => setUser({ ...user, status: e.target.value === 'ACTIVE' })}
              >
                <Grid container spacing={0}>
                  <Grid item xs={12} md={6} paddingRight={1}>
                    <FormControlLabel
                      value="ACTIVE"
                      control={<Radio />}
                      label="Active"
                      sx={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} paddingRight={1}>
                    <FormControlLabel
                      value="DEACTIVE"
                      control={<Radio />}
                      label="Deactive"
                      sx={{ textAlign: 'center', justifyContent: 'center', width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>

            <TextField
              name="photoUrl"
              label="Photo URL"
              value={user.photoUrl}
              required
              onChange={(e) => setUser({ ...user, photoUrl: e.target.value })}
            />

            <Box textAlign="center">
              <Button
                size="large"
                variant="contained"
                onClick={isUpdateForm ? handleUpdateUser : handleAddUser}
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
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

UserForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  user: PropTypes.object,
  setUser: PropTypes.func,
  handleAddUser: PropTypes.func,
  handleUpdateUser: PropTypes.func,
};

export default UserForm;
