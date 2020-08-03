'use strict';

const express = require('express');

const app = express();

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
