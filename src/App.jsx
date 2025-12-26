import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Fade
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Timeline as TimelineIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useAuth } from './contexts/AuthContext';
import { useThemeMode } from './contexts/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import StreakView from './components/StreakView';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { user, loading, signOut } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [currentView, setCurrentView] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut();
  };

  const handleViewChange = (event, newValue) => {
    setCurrentView(newValue);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <CalendarView />;
      case 'streak':
        return <StreakView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar
          sx={{
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box
            component="img"
            src="/icons/android-chrome-192x192.png"
            alt="AchieveIt Logo"
            sx={{ height: { xs: 32, sm: 40 }, mr: { xs: 1, sm: 2 } }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              fontWeight: 'bold',
              mr: { xs: 1, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            AchieveIt
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mr: { xs: 1, sm: 4 },
              opacity: 0.9,
              fontStyle: 'italic',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Make Every Day Count
          </Typography>

          <Tabs
            value={currentView}
            onChange={handleViewChange}
            textColor="inherit"
            sx={{
              flexGrow: 1,
              '& .MuiTab-root': {
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
                minWidth: { xs: 'auto', sm: '120px' },
                py: { xs: 1, sm: 1.5 },
              },
            }}
            TabIndicatorProps={{
              style: { backgroundColor: 'white', height: 3 }
            }}
          >
            <Tab
              icon={<DashboardIcon />}
              iconPosition="start"
              label="Dashboard"
              value="dashboard"
            />
            <Tab
              icon={<CalendarIcon />}
              iconPosition="start"
              label="Calendar"
              value="calendar"
            />
            <Tab
              icon={<TimelineIcon />}
              iconPosition="start"
              label="Streak"
              value="streak"
            />
          </Tabs>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              ml: { xs: 'auto', sm: 0 },
            }}
          >
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                mr: { xs: 0, sm: 1 },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {user.displayName}
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
        <Fade in={true} timeout={500}>
          <Box>
            {renderView()}
          </Box>
        </Fade>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 AchieveIt - Goal-Based Task Manager
          </Typography>
        </Container>

      {/* PWA Install Prompt and Online Status */}
      <PWAInstallPrompt />
      </Box>
    </Box>
  );
}

export default App;
