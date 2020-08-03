'use strict';

const express = require('express');

const app = express();
app.set('view engine', 'ejs');

// Middleware!
// Wire up static files from public folder
app.use(express.static('./public'));

// Normally user would come from Authentication
const user = { username: 'dahlbyk' }

// Page Routes
app.get('/', (request, response) => {
  let viewModel = {
    user,
  }
  response.render('index', viewModel);
})

app.get('/list', (request, response) => {
  // TODO: get from database
  let list = ['apples','bananas','kiwi'];

  let viewModel = {
    user,
    productList: list,
  }
  response.render('list', viewModel);
})

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
