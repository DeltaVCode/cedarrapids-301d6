'use strict';

const express = require('express');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  let viewModel = {
    user: { username: 'dahlbyk' }
  }
  response.render('index', viewModel);
})

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
