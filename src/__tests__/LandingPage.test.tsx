import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { LandingPage } from '../pages/LandingPage';

describe('LandingPage', () => {
  it('renders the hero section with CTA buttons', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LandingPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Regístrate')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('displays the patrici.a brand name', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LandingPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('patrici.a')).toBeInTheDocument();
  });

  it('shows feature cards section', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LandingPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Match por Intereses')).toBeInTheDocument();
    expect(screen.getByText('Crea tu Parche')).toBeInTheDocument();
    expect(screen.getByText('Eventos del Campus')).toBeInTheDocument();
    expect(screen.getByText('Bienestar y Soporte')).toBeInTheDocument();
  });

  it('renders the testimonials section', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <LandingPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Lo que dicen nuestros estudiantes')).toBeInTheDocument();
  });
});
