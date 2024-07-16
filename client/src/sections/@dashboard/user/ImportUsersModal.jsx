import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Modal, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl, methods, routes } from '../../../constants';

const ImportUsersModal = ({ isOpen, onClose }) => {
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

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      // Extract the headers and data
      const headers = worksheet[0];
      const usersData = worksheet.slice(1);

      // Format the data
      const users = usersData.map(row => {
        const user = {};
        headers.forEach((header, index) => {
          user[header] = row[index];
        });
        return {
          ...user,
          password: user.password || Math.random().toString(36).slice(-8),
        };
      });

      axios.post(apiUrl(routes.AUTH, methods.IMPORT), { users })
        .then(response => {
          toast.success('Users imported successfully');
          onClose();
        })
        .catch(error => {
          console.error('Error importing users:', error);
          toast.error('Error importing users');
        });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...style }}>
        <Typography variant="h6" textAlign="center">Import Users</Typography>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <Button variant="contained" onClick={handleImport} sx={{ mt: 2 }}>Import</Button>
      </Box>
    </Modal>
  );
};

ImportUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImportUsersModal;
