import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
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
}

export default UsersController;
