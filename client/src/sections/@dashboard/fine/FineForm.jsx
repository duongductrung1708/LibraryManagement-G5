import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

FineForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  id: PropTypes.string,
  fine: PropTypes.object,
  setFine: PropTypes.func,
  handleAddFine: PropTypes.func,
  handleUpdateFine: PropTypes.func,
};

export default function FineForm({
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  id,
  fine,
  setFine,
  handleAddFine,
  handleUpdateFine,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFine({ ...fine, [name]: value });
  };

  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal}>
      <DialogTitle>{isUpdateForm ? 'Update Fine Status' : 'Add Fine'}</DialogTitle>
      <DialogContent>
        {isUpdateForm && (
          <TextField
            name="status"
            label="Status"
            select
            value={fine.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button onClick={isUpdateForm ? handleUpdateFine : handleAddFine}>
          {isUpdateForm ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
