// tests/api.test.js
import request from 'supertest';
import app from '../server'; // Adjust the path to your server file

describe('API Endpoints', () => {
  it('GET /status should return server status', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });

  it('GET /stats should return server stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
  });

  it('POST /users should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'user@example.com', password: 'password' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /connect should connect a user', async () => {
    const res = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('user@example.com:password').toString('base64'));
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /disconnect should disconnect a user', async () => {
    const res = await request(app).get('/disconnect').set('X-Token', 'test-token'); // Use a valid token here
    expect(res.statusCode).toEqual(204);
  });

  it('GET /users/me should return current user', async () => {
    const res = await request(app).get('/users/me').set('X-Token', 'test-token'); // Use a valid token here
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email');
  });

  it('POST /files should upload a file', async () => {
    const res = await request(app)
      .post('/files')
      .attach('file', 'path/to/file.txt'); // Replace with actual file path
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /files/:id should return file details', async () => {
    const res = await request(app).get('/files/test-id'); // Replace with actual file ID
    expect(res.statusCode).toEqual(200);
  });

  it('GET /files should paginate files', async () => {
    const res = await request(app).get('/files?page=1&limit=10');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('files');
  });

  it('PUT /files/:id/publish should publish a file', async () => {
    const res = await request(app).put('/files/test-id/publish'); // Replace with actual file ID
    expect(res.statusCode).toEqual(200);
  });

  it('PUT /files/:id/unpublish should unpublish a file', async () => {
    const res = await request(app).put('/files/test-id/unpublish'); // Replace with actual file ID
    expect(res.statusCode).toEqual(200);
  });

  it('GET /files/:id/data should return file data', async () => {
    const res = await request(app).get('/files/test-id/data'); // Replace with actual file ID
    expect(res.statusCode).toEqual(200);
  });
});