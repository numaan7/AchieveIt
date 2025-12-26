import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => 
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'rgba(26, 31, 58, 0.9)'
                : 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🎯 AchieveIt
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            gutterBottom 
            sx={{ mb: 2 }}
          >
            Goal-Based Task Manager
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 5, maxWidth: 400 }}
          >
            Transform your dreams into achievable goals. Track daily tasks, build streaks, and celebrate your progress.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ 
              py: 1.5, 
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5566cc 0%, #633a85 100%)',
                transform: 'translateY(-2px)',
                boxShadow: 8,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
