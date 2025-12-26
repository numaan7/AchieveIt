import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { calculateStreak, getUserTasks } from '../services/firestoreService';
import { startOfDay, subDays, format } from 'date-fns';

const StreakView = () => {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakData();
  }, [user]);

  const loadStreakData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Calculate current streak
      const streak = await calculateStreak(user.uid);
      setCurrentStreak(streak);

      // Generate chart data for last 30 days
      const chartDataPoints = [];
      const today = startOfDay(new Date());

      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const tasks = await getUserTasks(
          user.uid,
          date,
          subDays(date, -1)
        );
        
        const completedCount = tasks.filter(t => t.completed).length;
        
        chartDataPoints.push({
          date: format(date, 'MMM dd'),
          completed: completedCount,
          total: tasks.length
        });
      }

      setChartData(chartDataPoints);
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
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
        Streak & Progress
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <FireIcon sx={{ fontSize: { xs: 50, sm: 60 }, mb: 2 }} />
            <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: '2.5rem', sm: '3rem' } }}>
              {currentStreak}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
              Day Streak
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Keep it going! 🔥
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
              30-Day Task Completion
            </Typography>
            <Box sx={{ width: '100%', height: 300, mt: 2 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Completed Tasks"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Total Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Streak Tips
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    🎯 Be Consistent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete at least one task every day to maintain your streak
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    📅 Plan Ahead
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the calendar to schedule tasks in advance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    🏆 Set Goals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Break down big goals into daily achievable tasks
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StreakView;
