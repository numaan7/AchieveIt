import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Snackbar,
  Fade,
  Zoom
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import {
  createGoal,
  getUserGoals,
  deleteGoal,
  updateGoal
} from '../services/firestoreService';
import GoalCard from './GoalCard';
import CreateGoalDialog from './CreateGoalDialog';
import EditGoalDialog from './EditGoalDialog';
import TodaysTasks from './TodaysTasks';

const Dashboard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const userGoals = await getUserGoals(user.uid);
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = useCallback(async (goalData) => {
    try {
      setError(null);
      await createGoal(user.uid, goalData);
      setSuccess('Goal created successfully!');
      await loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      setError('Failed to create goal. Please check your internet connection and try again.');
    }
  }, [user]);

  const handleDeleteGoal = useCallback(async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? All associated tasks will be deleted.')) {
      try {
        setError(null);
        await deleteGoal(goalId);
        setSuccess('Goal deleted successfully!');
        await loadGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
        setError('Failed to delete goal. Please try again.');
      }
    }
  }, []);

  const handleEditGoal = useCallback((goal) => {
    setSelectedGoal(goal);
    setEditDialogOpen(true);
  }, []);

  const handleUpdateGoal = useCallback(async (goalId, updates) => {
    try {
      setError(null);
      await updateGoal(goalId, updates);
      setSuccess('Goal updated successfully!');
      await loadGoals();
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal. Please try again.');
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          My Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Create Goal
        </Button>
      </Box>

      {/* Today's Tasks Section */}
      <Box sx={{ mb: 4 }}>
        <TodaysTasks onTaskUpdate={loadGoals} />
      </Box>

      {goals.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No goals yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first goal to start tracking your progress
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Create Your First Goal
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          {goals.map((goal, index) => (
            <Zoom
              in={true}
              timeout={300 + index * 100}
              key={goal.id}
            >
              <Grid item xs={12} sm={6} lg={4}>
                <GoalCard
                  goal={goal}
                  onDelete={handleDeleteGoal}
                  onEdit={handleEditGoal}
                />
              </Grid>
            </Zoom>
          ))}
        </Grid>
      )}

      <CreateGoalDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreateGoal={handleCreateGoal}
      />

      <EditGoalDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onEditGoal={handleUpdateGoal}
        goal={selectedGoal}
      />

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
