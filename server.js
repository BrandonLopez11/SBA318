const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

let tasks = [
  { id: 1, name: 'Task 1', description: 'First Task', completed: false, createdBy: 'Alice', comments: [{ user: 'Alice', text: 'Initial comment' }] },
  { id: 2, name: 'Task 2', description: 'Second Task', completed: false, createdBy: 'Bob', comments: [] }
];

const { checkTaskExistence } = require('./middleWare/taskMiddleware');
const { errorHandler } = require('./middleWare/errorHandler');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('index', { tasks });
});

app.get('/tasks/new', (req, res) => {
  res.render('tasks-new');
});

app.get('/tasks/:id', checkTaskExistence(tasks), (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  res.render('tasks-show', { task });
});

app.post('/tasks', (req, res) => {
  const { name, description, createdBy } = req.body; 
  const newTask = {
    id: tasks.length + 1,
    name,
    description,
    completed: false,
    createdBy, 
    comments: [] 
  };
  tasks.push(newTask);
  res.redirect('/');
});

app.delete('/tasks/:id', checkTaskExistence(tasks), (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.redirect('/');
});

app.put('/tasks/:id/complete', checkTaskExistence(tasks), (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  task.completed = true;
  res.redirect(`/tasks/${task.id}`);
});

app.post('/tasks/:id/comments', checkTaskExistence(tasks), (req, res) => {
  const { text, user } = req.body; 
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  task.comments.push({ user, text });
  res.redirect(`/tasks/${task.id}`);
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
