import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileTable from './FileTable';

describe('FileTable', () => {
  const files = [
    { name: 'File 1', lastUpdated: '2023-06-01', isDeleted: false },
    { name: 'File 2', lastUpdated: '2023-06-02', isDeleted: false },
    { name: 'File 3', lastUpdated: '2023-06-03', isDeleted: true },
  ];

  const sortConfig = { key: null, direction: 'ascending' };
  const setSortConfig = jest.fn();
  const setSearchQuery = jest.fn();
  const onDelete = jest.fn();

  test('renders file table with correct data', () => {
    render(
      <FileTable
        files={files}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        searchQuery=""
        setSearchQuery={setSearchQuery}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('File 1')).toBeInTheDocument();
    expect(screen.getByText('File 2')).toBeInTheDocument();
    expect(screen.getByText('File 3')).toBeInTheDocument();
    expect(screen.getAllByText('Delete').length).toBe(2);
  });

  test('calls setSortConfig when column header is clicked', () => {
    render(
      <FileTable
        files={files}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        searchQuery=""
        setSearchQuery={setSearchQuery}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText('Name'));
    expect(setSortConfig).toHaveBeenCalledWith({ key: 'name', direction: 'ascending' });
  });

  test('calls setSearchQuery when search input value changes', () => {
    render(
      <FileTable
        files={files}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        searchQuery=""
        setSearchQuery={setSearchQuery}
        onDelete={onDelete}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(searchInput, { target: { value: 'File 1' } });
    expect(setSearchQuery).toHaveBeenCalledWith('File 1');
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <FileTable
        files={files}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        searchQuery=""
        setSearchQuery={setSearchQuery}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('File 1');
  });
});