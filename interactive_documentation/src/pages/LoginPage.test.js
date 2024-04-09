import React from 'react';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { act } from 'react-dom/test-utils';

beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
      },
      writable: true,
    });
  });
  
  afterEach(() => {
    localStorage.setItem.mockClear();
  });

describe('LoginPage', () => {
  test('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('← Back to Main Page')).toBeInTheDocument();
  });

  test('displays login error when invalid credentials are entered', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ token: null }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    act(()=>{
        fireEvent.change(usernameInput, { target: { value: 'invaliduser' } });
        fireEvent.change(passwordInput, { target: { value: 'invalidpassword' } });
        fireEvent.click(loginButton);
    });


    expect(await screen.findByText('Username or password is wrong')).toBeInTheDocument();
  });

  test('navigates to admin page when valid credentials are entered', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ token: 'validtoken' }),
    });
    const navigate = jest.fn();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    act(() => {
        fireEvent.change(usernameInput, { target: { value: 'validuser' } });
        fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
        fireEvent.click(loginButton);
    });

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:9000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'validuser', password: 'validpassword' }),
        });
    });
  
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'validtoken');
      });
  
      await waitFor(() => {
        navigate('/admin');
        expect(navigate).toHaveBeenCalledWith('/admin');
      });
  });
});