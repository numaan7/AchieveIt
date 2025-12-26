import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  getDoc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseInit';
import { addDays, startOfDay } from 'date-fns';

// Goals Collection
export const createGoal = async (userId, goalData) => {
  try {
    const { name, description, totalSteps, startDate } = goalData;
    
    const goal = {
      userId,
      name,
      description,
      totalSteps,
      completedSteps: 0,
      startDate: Timestamp.fromDate(new Date(startDate)),
      createdAt: Timestamp.now(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, 'goals'), goal);
    
    // Create tasks automatically
    await createTasksForGoal(docRef.id, userId, totalSteps, startDate);
    
    return { id: docRef.id, ...goal };
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

// Create tasks for a goal automatically
const createTasksForGoal = async (goalId, userId, totalSteps, startDate) => {
  const tasksRef = collection(db, 'tasks');
  const start = startOfDay(new Date(startDate));
  
  const taskPromises = [];
  
  for (let i = 0; i < totalSteps; i++) {
    const taskDate = addDays(start, i);
    const task = {
      goalId,
      userId,
      title: `Day ${i + 1} - Complete your goal step`,
      description: `Complete step ${i + 1} of ${totalSteps}`,
      dueDate: Timestamp.fromDate(taskDate),
      completed: false,
      stepNumber: i + 1,
      createdAt: Timestamp.now()
    };
    
    taskPromises.push(addDoc(tasksRef, task));
  }
  
  await Promise.all(taskPromises);
};

export const getUserGoals = async (userId) => {
  try {
    const q = query(
      collection(db, 'goals'), 
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by createdAt on the client side to avoid needing a composite index
    return goals.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error getting user goals:', error);
    throw error;
  }
};

export const updateGoal = async (goalId, updates) => {
  const goalRef = doc(db, 'goals', goalId);
  await updateDoc(goalRef, updates);
};

export const deleteGoal = async (goalId) => {
  // Delete the goal
  await deleteDoc(doc(db, 'goals', goalId));
  
  // Delete all tasks associated with the goal
  const q = query(collection(db, 'tasks'), where('goalId', '==', goalId));
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// Tasks Collection
export const getUserTasks = async (userId, startDate = null, endDate = null) => {
  try {
    let q;
    
    if (startDate && endDate) {
      // Use only userId filter to avoid composite index requirement
      q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter by date on the client side
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      return tasks.filter(task => {
        const taskDueDate = task.dueDate;
        return taskDueDate >= startTimestamp && taskDueDate <= endTimestamp;
      });
    } else {
      q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.error('Error getting user tasks:', error);
    throw error;
  }
};

export const toggleTaskCompletion = async (taskId, completed, goalId) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { 
    completed,
    completedAt: completed ? Timestamp.now() : null
  });
  
  // Update goal progress
  if (goalId) {
    await updateGoalProgress(goalId, completed ? 1 : -1);
  }
};

const updateGoalProgress = async (goalId, increment) => {
  const goalRef = doc(db, 'goals', goalId);
  const goalSnapshot = await getDoc(goalRef);
  
  if (goalSnapshot.exists()) {
    const currentGoal = goalSnapshot.data();
    const newCompletedSteps = Math.max(0, currentGoal.completedSteps + increment);
    
    await updateDoc(goalRef, { 
      completedSteps: newCompletedSteps,
      status: newCompletedSteps >= currentGoal.totalSteps ? 'completed' : 'active'
    });
  }
};

export const getTasksForDate = async (userId, date) => {
  try {
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = addDays(startOfDayDate, 1);
    
    // Get all user tasks and filter on client side
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter by date on the client side
    const startTimestamp = Timestamp.fromDate(startOfDayDate);
    const endTimestamp = Timestamp.fromDate(endOfDayDate);
    
    return tasks.filter(task => {
      const taskDueDate = task.dueDate;
      return taskDueDate >= startTimestamp && taskDueDate < endTimestamp;
    });
  } catch (error) {
    console.error('Error getting tasks for date:', error);
    throw error;
  }
};

// Streak calculation
export const calculateStreak = async (userId) => {
  const today = startOfDay(new Date());
  let currentStreak = 0;
  let checkDate = today;
  
  while (true) {
    const tasks = await getTasksForDate(userId, checkDate);
    const hasCompletedTask = tasks.some(task => task.completed);
    
    if (!hasCompletedTask) {
      break;
    }
    
    currentStreak++;
    checkDate = addDays(checkDate, -1);
    
    // Limit to prevent infinite loop
    if (currentStreak > 365) break;
  }
  
  return currentStreak;
};
