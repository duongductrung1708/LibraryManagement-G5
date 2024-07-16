import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

FineDialog.propTypes = {
  isDialogOpen: PropTypes.bool,
  fineId: PropTypes.string,
  handleDeleteFine: PropTypes.func,
  handleCloseDialog: PropTypes.func,
};

export default function FineDialog({ isDialogOpen, fineId, handleDeleteFine, handleCloseDialog }) {
  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Delete Fine</DialogTitle>
      <DialogContent>Are you sure you want to delete this fine?</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={() => handleDeleteFine(fineId)}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
