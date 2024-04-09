const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

jest.mock('fs');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Authentication Router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should log in a user with valid credentials', async () => {
    const mockUser = { id: 'user-id', username: 'testuser', password: 'hashedpassword' };
    fs.readFileSync.mockReturnValue(JSON.stringify([mockUser]));
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mock-token');

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password' })
      .expect(200);

    expect(response.body).toEqual({ message: 'Logged in successfully', token: 'mock-token' });
  });

  test('should return an error for invalid credentials', async () => {
    const mockUser = { id: 'user-id', username: 'testuser', password: 'hashedpassword' };
    fs.readFileSync.mockReturnValue(JSON.stringify([mockUser]));
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(400);

    expect(response.body).toEqual({ message: 'Invalid credentials' });
  });

  // Add more test cases for error scenarios and edge cases
});