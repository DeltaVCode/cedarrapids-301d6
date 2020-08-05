'use strict'

// Application Dependencies
const express = require('express');
const methodOverride = require('method-override')
const pg = require('pg');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Override from POST to PUT/DELETE/etc with ?_method=PUT
app.use(methodOverride('_method'));
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
// Specify a directory for static resources
app.use(express.static('./public'));

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
app.get('/', getTasks);

app.get('/tasks/:task_id', getOneTask);
app.put('/tasks/:task_id', updateOneTask);
app.delete('/tasks/:task_id', deleteOneTask);

app.get('/add', showForm);

app.post('/add', addTask);

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

console.log('Trying to connect to Postgres')
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  })
  .catch(err => { throw err; })

// HELPER FUNCTIONS

function getTasks(request, response) {
  const SQL = `
    SELECT *
    FROM tasks
  `;
  client.query(SQL)
    .then(results => {
      let viewModel = {
        tasks: results.rows,
      };
      response.render('index', viewModel);
    })
}

function getOneTask(request, response) {
  const SQL = `
    SELECT *
    FROM tasks
    WHERE id = $1
  `;
  let values = [request.params.task_id];
  client.query(SQL, values)
    .then(function getOneSqlResult(result) {
      let task = new Task(result.rows[0]);

      let viewModel = {
        task,
      };
      response.render('pages/detail', viewModel);
    })
    .catch(err => handleError(err, response));
}

function Task(row) {
  this.id = row.id;
  this.title = row.title;
  this.contact = row.contact;
  this.description = row.description;
  this.status = row.status;
  this.isFromConstructor = true;
}

function deleteOneTask(request, response) {
  const SQL = `
    DELETE
    FROM tasks
    WHERE id = $1
  `;
  let values = [request.params.task_id];
  client.query(SQL, values)
    .then(function deleteOneSqlResult() {
      response.redirect('/');
    })
    .catch(err => handleError(err, response));
}

function updateOneTask(request, response) {
  console.log(request.body);
  // Destructuring
  let { title, description, category, contact, status } = request.body;

  const SQL = `
    UPDATE tasks SET
      title = $2,
      description = $3,
      category = $4,
      contact = $5,
      status = $6
    WHERE id = $1
  `;
  const { task_id } = request.params;
  const values = [task_id, title, description, category, contact, status];

  client.query(SQL, values)
    .then(() => {
      // POST - Redirect - GET pattern
      response.redirect(`/tasks/${task_id}`);
    })
    .catch(err => {
      handleError(err, response);
    });
}

function showForm(request, response) {
  response.render('pages/add-task')
}

function addTask(request, response) {
  console.log(request.body);
  // Destructuring
  let { title, description, category, contact, status } = request.body;

  const SQL = `
    INSERT INTO tasks (title, description, category, contact, status)
    VALUES ($1,$2,$3,$4,$5)
  `;
  const values = [title, description, category, contact, status];

  client.query(SQL, values)
    .then(() => {
      // POST - Redirect - GET pattern
      response.redirect('/');
    })
    .catch(err => {
      handleError(err, response);
    });
}

function handleError(error, response) {
  let viewModel = {
    error: error.message
  };
  response.status(500).render('pages/error', viewModel);
}
