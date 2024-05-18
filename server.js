import app from './app.js';

const port = 5200;

// Start the server
app.listen(port, () => {
  console.log('Server is listening on ' + port);
});
