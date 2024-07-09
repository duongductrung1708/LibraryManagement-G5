import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Modal, Typography } from '@mui/material';
import { parse } from 'papaparse';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl, methods, routes } from '../../../constants';

const ImportBooksModal = ({ isOpen, onClose }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 4,
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    parse(file, {
      complete: (results) => {
        const books = results.data;
        const formattedBooks = books.map(book => ({
          ...book,
        }));

        axios.post(apiUrl(routes.AUTH, methods.IMPORTBOOK), { books: formattedBooks })
          .then(response => {
            toast.success('Books imported successfully');
            onClose();
          })
          .catch(error => {
            console.error('Error importing books:', error);
            toast.error('Error importing books');
          });
          console.log('Formatted Books:', formattedBooks);
      },
      header: true,
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...style }}>
        <Typography variant="h6" textAlign="center">Import Books</Typography>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button variant="contained" onClick={handleImport} sx={{ mt: 2 }}>Import</Button>
      </Box>
    </Modal>
  );
};

ImportBooksModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImportBooksModal;
