import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LoginPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('nombre@mail.escuelaing.edu.co')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeInTheDocument();
  });

  it('shows the register link', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LoginPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
  });

  it('shows forgot password link', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LoginPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });
});
