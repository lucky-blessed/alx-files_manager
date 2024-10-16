import express from "express";
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 5000;

/**
 * Use the routes defined in the index.js file
 */
app.use('/', routes);

/**
 * Start the server
 */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;