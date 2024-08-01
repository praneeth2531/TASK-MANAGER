const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  userId: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error logging in' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const task = new Task({ title, description, dueDate, userId: decoded.userId });
    await task.save();
    res.send(task); // Return the created task
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding task' });
  }
});

app.get('/tasks', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const tasks = await Task.find({ userId: decoded.userId });
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching tasks' });
  }
});

app.get('/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    res.send({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching user' });
  }
});
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Deleting task with ID:', id); 
    const token = req.headers.authorization.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const task = await Task.findOneAndDelete({ _id: id, userId: decoded.userId });
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }
      res.send({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task', error);
      res.status(500).send({ message: 'Error deleting task' });
    }
  });

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});