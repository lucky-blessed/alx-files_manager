import express from 'express';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware to parse incoming JSON requests
 */
app.use(express.json());

/**
 * Load all routes from the routes folder
 */
app.use('/', routes);

/**
 * Start the server and listen on the specified port
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});