import { useState, useEffect, memo, useCallback } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getTasksForDate, toggleTaskCompletion } from '../services/firestoreService';

const TodaysTasks = memo(({ onTaskUpdate }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaysTasks();
  }, [user]);

  const loadTodaysTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const todaysTasks = await getTasksForDate(user.uid, new Date());
      setTasks(todaysTasks);
    } catch (error) {
      console.error('Error loading today\'s tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = useCallback(async (task) => {
    try {
      await toggleTaskCompletion(task.id, !task.completed, task.goalId);
      await loadTodaysTasks();
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }, [onTaskUpdate]);

  const completedCount = tasks.filter(t => t.completed).length;

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          ⚡ Today's Tasks
        </Typography>
        <Chip 
          label={`${completedCount} / ${tasks.length}`}
          color={completedCount === tasks.length && tasks.length > 0 ? 'success' : 'primary'}
          sx={{ fontWeight: 700 }}
        />
      </Box>

      {tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No tasks scheduled for today. Great job staying on top of things! 🎉
        </Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              dense
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                mb: 1,
                backgroundColor: task.completed ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(task)}
                  color="success"
                />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  '& .MuiListItemText-primary': {
                    fontWeight: task.completed ? 'normal' : 600
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
});

TodaysTasks.displayName = 'TodaysTasks';

export default TodaysTasks;
