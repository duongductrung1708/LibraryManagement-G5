import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Avatar, Box, Divider, IconButton, MenuItem, Popover, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function AccountPopover() {
  // const { user } = useAuth();
  const user = {
    name: "minh",
    email: "lvhm114@gmail.com",
    isAdmin: false,
    isLibrarian: false,
    photoUrl:"asd",
    _id: "66706707332ac58fab7fe156",
    salt: "77d57e7d4a83284c049206b1d518542e",
    hash: "7dd5d4c0c08af40cb69464c8495cf3d92e382bc0a541dbe48c060a2ec63b363702025277a0845c1272708039d9762edad14ad1e239a1e0e2807196d92a64b537"
}
  // const { logout } = useAuth();
  const  logout  = () =>  console.log("heelo");
  const [open, setOpen] = useState(null);

  const logoutUser = () => {
    handleClose();
    logout();
    // axios
    //   .get(`http://localhost:8080/api/auth/logout`, { withCredentials: true })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log(response.data);
    //       logout();
    //     }
    //   })
    //   .catch((error) => {
    //     alert(error);
    //     console.log(error);
    //   });
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user.photoUrl} alt={user.name} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <MenuItem style={{paddingLeft: "3px"}}>
            <Link to={`/userprofile/${user._id}`} style={{ textDecoration: 'none' }}>
              <Typography variant="subtitle2" noWrap>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {user.email}
              </Typography>
            </Link>
          </MenuItem>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logoutUser} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
