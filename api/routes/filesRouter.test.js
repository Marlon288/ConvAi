const request = require('supertest');
const app = require('../app');
const { verifyToken } = require('./authRouter');

jest.mock('./authRouter');

describe('Files Router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get the list of files', async () => {
    verifyToken.mockImplementation((req, res, next) => next());

    const response = await request(app)
      .get('/api/protected/files')
      .set('Authorization', 'Bearer mock-token')
      .expect(200);

    expect(response.body).toEqual([
      { name: "Trainingset1.txt", lastUpdated: "2024-01-01" },
      { name: "Trainingset2.txt", lastUpdated: "2024-02-01" },
      { name: "Trainingset3.txt", lastUpdated: "2024-02-01" },
      { name: "Trainingset4.txt", lastUpdated: "2024-02-01" },
      { name: "Trainingset5.txt", lastUpdated: "2024-02-01" },
      { name: "Trainingset6.txt", lastUpdated: "2024-02-01" },
      { name: "Trainingset7.txt", lastUpdated: "2024-02-01" },
    ]);
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

  // Add more test cases for error scenarios and edge cases
});