import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EnvTest from '../components/EnvTest';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Share Files Securely
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}
          >
            Fast, secure, and easy file sharing for everyone
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            {currentUser ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Why Choose ShareIt?
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Fast
                </Typography>
                <Typography>
                  Upload and share files in seconds with our optimized servers
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Secure
                </Typography>
                <Typography>
                  End-to-end encryption ensures your files stay private
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Simple
                </Typography>
                <Typography>
                  Easy-to-use interface for hassle-free file sharing
                </Typography>
              </Box>
            </Box>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage; 