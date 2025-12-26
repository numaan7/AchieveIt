import { Card, CardContent, Typography, LinearProgress, Box, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { memo } from 'react';

const GoalCard = memo(({ goal, onDelete, onEdit }) => {
  const progress = goal.totalSteps > 0 
    ? (goal.completedSteps / goal.totalSteps) * 100 
    : 0;

  const startDate = goal.startDate?.toDate?.() || new Date(goal.startDate);
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
            {goal.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={() => onEdit(goal)}
              sx={{ 
                color: 'primary.main',
                '&:hover': { backgroundColor: 'primary.lighter' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(goal.id)}
              sx={{ 
                color: 'error.main',
                '&:hover': { backgroundColor: 'error.lighter' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {goal.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {goal.description}
          </Typography>
        )}
        
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Progress
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={700}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: 2,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                background: progress === 100 
                  ? 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                  : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {goal.completedSteps} of {goal.totalSteps} steps completed
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Started: {startDate.toLocaleDateString()}
          </Typography>
          <Typography 
            variant="caption" 
            color={goal.status === 'completed' ? 'success.main' : 'primary.main'}
            fontWeight="bold"
          >
            {goal.status === 'completed' ? 'Completed' : 'Active'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

GoalCard.displayName = 'GoalCard';

export default GoalCard;

