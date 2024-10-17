// tests/client.test.js
import redisClient from '../utils/redis'; // Adjust the path as necessary
import dbClient from '../utils/db'; // Adjust the path as necessary

describe('Redis Client', () => {
  it('should set and get a value', async () => {
    await redisClient.set('testKey', 'testValue', 3600);
    const value = await redisClient.get('testKey');
    expect(value).toBe('testValue');
  });

  it('should delete a key', async () => {
    await redisClient.del('testKey');
    const value = await redisClient.get('testKey');
    expect(value).toBe(null);
  });
});

describe('DB Client', () => {
  it('should connect to the database', async () => {
    const result = await dbClient.db.command({ ping: 1 });
    expect(result).toBeTruthy(); // This checks if the database is connected
  });

  it('should insert a user and find it', async () => {
    const user = { email: 'test@example.com', password: 'password' };
    await dbClient.db.collection('users').insertOne(user);
    const foundUser = await dbClient.db.collection('users').findOne({ email: 'test@example.com' });
    expect(foundUser).toBeTruthy();
    expect(foundUser.email).toBe(user.email);
  });

  afterAll(async () => {
    await dbClient.db.collection('users').deleteMany({ email: 'test@example.com' });
    await dbClient.close();
  });
});
