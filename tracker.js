const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(cors());
app.use(express.urlencoded());

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = [];
const exercises = [];

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: Date.now().toString() };
  users.push(newUser);
  res.json(newUser);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === _id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const exercise = {
    userId: _id,
    description,
    duration: parseInt(duration, 10),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };
  exercises.push(exercise);
  const response = {
    username: user.username,
    _id: user._id,
    exercise: exercise
  };
  res.json({user:response});
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = users.find(u => u._id === _id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  let userExercises = exercises.filter(e => e.userId === _id);
  if (from) userExercises = userExercises.filter(e => new Date(e.date) >= new Date(from));
  if (to) userExercises = userExercises.filter(e => new Date(e.date) <= new Date(to));
  if (limit) userExercises = userExercises.slice(0, parseInt(limit, 10));

  res.json({
    username: user.username,
    count: userExercises.length,
    log: userExercises
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
