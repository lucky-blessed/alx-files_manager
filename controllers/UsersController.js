import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  /**
   * Create a new user
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    /**
     * Check if email is provided
     */
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    /**
     * Check if password is provided
     */
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    /**
     * Check if email already exists in the database
     */
    const userExists = await dbClient.client
      .db(dbClient.dbName)
      .collection('users')
      .findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    /**
     * Hash the password using SHA1
     */
    const hashedPassword = sha1(password);

    /**
     * Insert the new user into the users collection
     */
    const result = await dbClient.client
      .db(dbClient.dbName)
      .collection('users')
      .insertOne({
        email,
        password: hashedPassword,
      });

    /**
     * Return the created user (only id and email) with status 201
     */
    return res.status(201).json({ id: result.insertedId, email });
  }

  /**
   * Retrieve user information based on the authentication token
   */
  static async getMe(req, res) {
    /**
     * Extract token from the X-Token header
     */
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /**
     * Check if the token exists in Redis
     */
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /**
     * Retrieve the user information from MongoDB
     */
    const user = await dbClient.client
      .db(dbClient.dbName)
      .collection('users')
      .findOne({ _id: dbClient.getObjectId(userId) });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /**
     * Return the user object (id and email only)
     */
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;