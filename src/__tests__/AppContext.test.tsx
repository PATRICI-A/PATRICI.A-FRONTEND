import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useApp } from '../store/AppContext';

function ThemeConsumer() {
  const { isDark, toggleTheme } = useApp();
  return (
    <div>
      <span data-testid="theme">{isDark ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

function AuthConsumer() {
  const { isLoggedIn, currentUser } = useApp();
  return (
    <div>
      <span data-testid="logged">{String(isLoggedIn)}</span>
      <span data-testid="user">{currentUser?.name ?? 'none'}</span>
    </div>
  );
}

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders children inside the provider', () => {
    render(
      <AppProvider>
        <span data-testid="child">ok</span>
      </AppProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('starts in light mode by default', () => {
    render(
      <AppProvider>
        <ThemeConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('toggles to dark mode and adds class to html', () => {
    render(
      <AppProvider>
        <ThemeConsumer />
      </AppProvider>
    );
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('starts logged in with the mock user', () => {
    render(
      <AppProvider>
        <AuthConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('logged').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe('Patricia S.');
  });

  it('throws when useApp is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow('useApp must be used within AppProvider');
    spy.mockRestore();
  });
});
