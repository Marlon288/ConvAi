const request = require('supertest');
const app = require('../app');
const { getRetrievalChain, getController, removeController } = require('../modules/sharedData');

jest.mock('../modules/sharedData', () => ({
  getRetrievalChain: jest.fn(),
  storeController: jest.fn(),
  getController: jest.fn(),
  removeController: jest.fn(),
  setupStreamingForModel: jest.fn(),
}));

describe('AI Handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set a prompt and generate a response', async () => {
    const mockInvoke = jest.fn().mockResolvedValue({ answer: 'Mock answer' });
    getRetrievalChain.mockReturnValue({ invoke: mockInvoke });

    const response = await request(app)
      .post('/api/setPrompt')
      .send({ id: 'test-id', input: 'What is the capital of France?', history: [] })
      .expect(200);

    expect(mockInvoke).toHaveBeenCalledWith({
      input: 'What is the capital of France?',
      chat_history: [],
      signal: expect.any(AbortSignal),
    });
    expect(response.text).toBe('');
  });

  test('should handle cancellation of a request', async () => {
    const mockAbort = jest.fn();
    getController.mockReturnValue({ abort: mockAbort });

    const response = await request(app)
      .post('/api/cancelRequest')
      .send({ requestId: 'test-id' })
      .expect(200);

    expect(getController).toHaveBeenCalledWith('test-id');
    expect(mockAbort).toHaveBeenCalled();
    expect(response.body).toEqual({ message: 'Request cancelled' });
    expect(removeController).toHaveBeenCalledWith('test-id');
  });

  // Add more test cases for error scenarios and edge cases
});