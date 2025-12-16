import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders login screen by default', async () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const heading = await screen.findByText(/sign in to your account/i);
  expect(heading).toBeInTheDocument();
});
