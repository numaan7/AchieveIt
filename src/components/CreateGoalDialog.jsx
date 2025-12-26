import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

const CreateGoalDialog = ({ open, onClose, onCreateGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalSteps: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.totalSteps > 0) {
      onCreateGoal({
        ...formData,
        totalSteps: parseInt(formData.totalSteps)
      });
      setFormData({
        name: '',
        description: '',
        totalSteps: '',
        startDate: new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Goal</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Goal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Total Steps"
            name="totalSteps"
            type="number"
            value={formData.totalSteps}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 1 }}
            helperText="Number of days/steps to complete this goal"
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.name || !formData.totalSteps}
        >
          Create Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGoalDialog;
