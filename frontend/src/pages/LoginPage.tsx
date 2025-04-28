import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Divider,
  Link,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FacebookIcon from '@mui/icons-material/Facebook';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithFacebook();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to login with Facebook');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to ShareIt
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Share your favorite local businesses and earn rewards!
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleEmailLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
            <Link component={RouterLink} to="/signup" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>

          <Divider sx={{ width: '100%', my: 2 }}>OR</Divider>

          <Button
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookLogin}
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: '#1877f2',
              '&:hover': {
                backgroundColor: '#166fe5',
              },
            }}
            disabled={loading}
          >
            Continue with Facebook
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            By continuing, you agree to ShareIt's Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 