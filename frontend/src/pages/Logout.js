import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';

import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  Divider,
} from '@mui/material';

const Logout = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
            p: 3,
            borderRadius: 4,
            boxShadow: 6,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          }}
        >
          {/* Avatar */}
          <Avatar
            alt={currentUser?.name}
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: '#1976d2',
              fontSize: 28,
            }}
          >
            {currentUser?.name?.charAt(0).toUpperCase()}
          </Avatar>

          {/* Heading */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {currentUser?.name}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to log out?
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Buttons */}
          <Stack direction="column" spacing={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ fontWeight: 'bold', py: 1.2 }}
            >
              Log Out
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{
                backgroundColor: '#6b4c77',
                '&:hover': {
                  backgroundColor: '#5a3f65',
                },
                fontWeight: 'bold',
                py: 1.2,
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Card>
      </Box>
    </Container>
  );
};

export default Logout;
