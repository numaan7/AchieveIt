import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Box
        component="img"
        src="/icons/android-chrome-192x192.png"
        alt="AchieveIt Logo"
        sx={{
          height: { xs: 60, sm: 80 },
          mb: 3,
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.5rem', sm: '2.2rem' } }}>
        AchieveIt
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
        Make Every Day Count
      </Typography>
      <CircularProgress
        sx={{
          color: 'white',
          mb: 3,
        }}
      />
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Loading your goals...
      </Typography>
    </Box>
  );
}

export default LoadingScreen;
