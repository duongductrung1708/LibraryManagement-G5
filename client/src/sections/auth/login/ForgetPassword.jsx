import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Typography, TextField, Button } from '@mui/material';
import Logo from '../../../components/logo';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      if (response.status === 200) {
        toast.success('A new password has been sent to your email');
      }
    } catch (error) {
      toast.error(error.response.data.message || 'An error occurred');
    }
  };

  return (
    <>
      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ color: '#666666', fontWeight: '600' }} textAlign="center" gutterBottom>
              Library System
            </Typography>
            <Typography variant="h3" textAlign="center" gutterBottom paddingBottom={3}>
              Forgot Password
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleForgotPassword}>
              Send Reset Link
            </Button>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};

export default ForgetPassword;
