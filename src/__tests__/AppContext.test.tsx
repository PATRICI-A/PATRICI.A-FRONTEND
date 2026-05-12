import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';

function TestConsumer() {
  const { isDark, isLoggedIn, currentUser, notifications } = useApp();
  return (
    <div>
      <span data-testid="isDark">{String(isDark)}</span>
      <span data-testid="isLoggedIn">{String(isLoggedIn)}</span>
      <span data-testid="currentUser">{currentUser ? currentUser.name : 'null'}</span>
      <span data-testid="notifications">{notifications}</span>
    </div>
  );
}

describe('AppContext', () => {
  it('provides default values', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    expect(getByTestId('isDark').textContent).toBe('false');
    expect(getByTestId('isLoggedIn').textContent).toBe('false');
    expect(getByTestId('currentUser').textContent).toBe('null');
    expect(getByTestId('notifications').textContent).toBe('3');
  });

  it('throws error when used outside AppProvider', () => {
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useApp must be used within AppProvider');
  });
});
