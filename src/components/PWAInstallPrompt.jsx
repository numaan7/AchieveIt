import { useState, useEffect } from 'react';
import {
  Button,
  Snackbar,
  Alert,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  CloudOff as OfflineIcon,
  CloudDone as OnlineIcon
} from '@mui/icons-material';
import pwaHelper from '../utils/pwaHelper';

const PWAInstallPrompt = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Check if install is possible
    setCanInstall(pwaHelper.canInstall());

    // Listen for online/offline changes
    const handleOnlineStatusChange = (online) => {
      setIsOnline(online);
      if (!online) {
        setShowOfflineMessage(true);
      }
    };

    pwaHelper.onOnlineStatusChange(handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await pwaHelper.install();
    setIsInstalling(false);

    if (success) {
      setShowInstallSuccess(true);
      setCanInstall(false);
    }
  };

  // Check for iOS and show appropriate prompt
  useEffect(() => {
    if (pwaHelper.isIOS() && canInstall) {
      // For iOS, we might want to show different UI
    }
  }, [canInstall]);

  return (
    <Box>
      {/* Online/Offline Status */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}>
        <Chip
          icon={isOnline ? <OnlineIcon /> : <OfflineIcon />}
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
          variant="outlined"
          sx={{
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
          }}
        />
      </Box>

      {/* Install Button */}
      {canInstall && (
        <Box sx={{ position: 'fixed', bottom: 90, right: 24, zIndex: 1200 }}>
          <Button
            variant="contained"
            startIcon={isInstalling ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={handleInstall}
            disabled={isInstalling}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 4,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isInstalling ? 'Installing...' : 'Install App'}
          </Button>
        </Box>
      )}

      {/* Installation Success Message */}
      <Snackbar
        open={showInstallSuccess}
        autoHideDuration={4000}
        onClose={() => setShowInstallSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowInstallSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          🎉 AchieveIt installed successfully! You can now use it offline.
        </Alert>
      </Snackbar>

      {/* Offline Message */}
      <Snackbar
        open={showOfflineMessage && !isOnline}
        autoHideDuration={4000}
        onClose={() => setShowOfflineMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowOfflineMessage(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          📴 You are offline. Some features may be limited, but your app will work.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PWAInstallPrompt;
