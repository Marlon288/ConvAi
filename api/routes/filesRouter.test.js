const request = require('supertest');
const app = require('../app');
const { verifyToken } = require('./authRouter');

jest.mock('./authRouter');

const app = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

describe('Files Router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get the list of files', async () => {
    app.get.mockImplementation((path, middleware, handler) => {
      if (path === '/api/protected/files') {
        handler(null, { json: jest.fn() });
      }
    });

    verifyToken.mockImplementation((req, res, next) => next());

    const response = await request(app)
      .get('/api/protected/files')
      .set('Authorization', 'Bearer mock-token')
      .expect(200);

    expect(app.get).toHaveBeenCalledWith('/api/protected/files', verifyToken, expect.any(Function));
  });

  test('should add a new file', async () => {
    verifyToken.mockImplementation((req, res, next) => next());

    const response = await request(app)
      .post('/api/protected/files')
      .set('Authorization', 'Bearer mock-token')
      .send({ name: 'Trainingset8.txt', lastUpdated: '2024-03-01' })
      .expect(201);

    expect(response.text).toBe('File added successfully');
  });

  test('should delete a file', async () => {
    verifyToken.mockImplementation((req, res, next) => next());

    const response = await request(app)
      .delete('/api/protected/files/Trainingset1.txt')
      .set('Authorization', 'Bearer mock-token')
      .expect(200);

    expect(response.text).toBe('File deleted successfully');
  });

  
});