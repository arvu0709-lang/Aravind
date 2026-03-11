import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard title', () => {
  render(<App />);
  const linkElement = screen.getByText(/My React Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});

