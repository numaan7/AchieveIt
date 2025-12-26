import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getUserTasks, toggleTaskCompletion } from '../services/firestoreService';

const CalendarView = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [user, currentMonth]);

  useEffect(() => {
    filterTasksForSelectedDate();
  }, [selectedDate, tasks]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);

      const userTasks = await getUserTasks(user.uid, calendarStart, calendarEnd);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasksForSelectedDate = () => {
    const filtered = tasks.filter(task => {
      const taskDate = task.dueDate?.toDate?.() || new Date(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
    setSelectedDateTasks(filtered);
  };

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      const taskDate = task.dueDate?.toDate?.() || new Date(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  const handleTaskToggle = async (task) => {
    try {
      await toggleTaskCompletion(task.id, !task.completed, task.goalId);
      await loadTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const renderHeader = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {days.map((day) => (
          <Grid item xs key={day}>
            <Typography
              variant="body2"
              align="center"
              fontWeight="bold"
              color="text.secondary"
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayTasks = getTasksForDay(day);
        const completedTasks = dayTasks.filter(t => t.completed).length;

        days.push(
          <Grid item xs key={day}>
            <Paper
              elevation={isSameDay(day, selectedDate) ? 3 : 0}
              sx={{
                p: 1,
                minHeight: 80,
                cursor: 'pointer',
                backgroundColor: isSameDay(day, selectedDate)
                  ? 'primary.light'
                  : isToday(day)
                  ? 'action.hover'
                  : 'background.paper',
                opacity: isSameMonth(day, monthStart) ? 1 : 0.3,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => setSelectedDate(cloneDay)}
            >
              <Typography
                variant="body2"
                fontWeight={isToday(day) ? 'bold' : 'normal'}
                color={isToday(day) ? 'primary' : 'text.primary'}
              >
                {format(day, 'd')}
              </Typography>
              {dayTasks.length > 0 && (
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={`${completedTasks}/${dayTasks.length}`}
                    size="small"
                    color={completedTasks === dayTasks.length ? 'success' : 'default'}
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container spacing={1} key={day} sx={{ mb: 1 }}>
          {days}
        </Grid>
      );
      days = [];
    }

    return <Box>{rows}</Box>;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography
        variant="h4"
        component="h2"
        fontWeight="bold"
        sx={{ mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        Calendar
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
              {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedDateTasks.length} task(s)
            </Typography>

            {selectedDateTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No tasks for this day
              </Typography>
            ) : (
              <List>
                {selectedDateTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    dense
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.completed}
                        onChange={() => handleTaskToggle(task)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={task.description}
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalendarView;
