const request = require('supertest');
const fs = require('fs');

jest.mock('fs');

const app = {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

describe('Get Locations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get the list of locations', async () => {
    const mockLocations = [{ id: 1, name: 'Location 1' }, { id: 2, name: 'Location 2' }];
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, JSON.stringify(mockLocations));
    });

    const response = await request(app)
      .get('/api/getLocations')
      .expect(200);

    expect(response.body).toEqual(mockLocations);
  });

  test('should handle file reading error', async () => {
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error('File reading error'), null);
    });

    const response = await request(app)
      .get('/api/getLocations')
      .expect(500);

    expect(response.text).toBe('Internal Server Error');
  });
});