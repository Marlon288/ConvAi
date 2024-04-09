import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListComponent from './ListComponent';


describe('ListComponent', () => {
  const locations = [
    { location_label: 'Location 1' },
    { location_label: 'Location 2' },
    { location_label: 'Location 3' },
  ];

  const setLocation = jest.fn();

  test('renders list of locations', () => {
    render(<ListComponent locations={locations} setLocation={setLocation} />);

    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Location 2')).toBeInTheDocument();
    expect(screen.getByText('Location 3')).toBeInTheDocument();
  });

  test('calls setLocation when location item is clicked', () => {
    render(<ListComponent locations={locations} setLocation={setLocation} />);

    const locationItem = screen.getByText('Location 1');
    fireEvent.click(locationItem);

    expect(setLocation).toHaveBeenCalledWith({ location_label: 'Location 1' });
  });
});