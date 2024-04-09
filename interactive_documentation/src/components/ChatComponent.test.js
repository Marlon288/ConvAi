import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import ChatComponent from './ChatComponent';

describe('ChatComponent', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders chat container with location label', () => {
    const location = { location_label: 'Test Location' };
    render(
      <MemoryRouter>
        <ChatComponent location={location} />
      </MemoryRouter>
    );

    expect(screen.getByText('RailVision - Test Location')).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(
      <MemoryRouter>
        <ChatComponent />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText('Enter your message here...');
    fireEvent.change(inputElement, { target: { value: 'Test message' } });

    expect(inputElement.value).toBe('Test message');
  });

  test('sends user message and displays loading indicator when submitting', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      body: {
        getReader: jest.fn().mockReturnValue({
          read: jest.fn().mockResolvedValueOnce({ done: false, value: new Uint8Array([116, 101, 115, 116]) }),
          cancel: jest.fn(),
        }),
      },
    });

    render(
      <MemoryRouter>
        <ChatComponent />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText('Enter your message here...');
    fireEvent.change(inputElement, { target: { value: 'Test message' } });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('GPT')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('stop-svg');
  });

  test('displays error message when request fails', async () => {
    global.fetch.mockRejectedValue(new Error('Request failed'));

    render(
      <MemoryRouter>
        <ChatComponent />
      </MemoryRouter>
    );

    const inputElement = screen.getByPlaceholderText('Enter your message here...');
    fireEvent.change(inputElement, { target: { value: 'Test message' } });

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('There was an error with the Request')).toBeInTheDocument();
    });
  });

  test('cancels request when stop button is clicked', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
  
    render(
      <MemoryRouter>
        <ChatComponent />
      </MemoryRouter>
    );
  
    const inputElement = screen.getByPlaceholderText('Enter your message here...');
    fireEvent.change(inputElement, { target: { value: 'Test message' } });
  
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
  
    const stopButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(stopButton);
  
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:9000/api/cancelRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.any(String),
    });
  });
});