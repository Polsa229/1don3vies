import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('affiche un état de chargement puis appelle onComplete', () => {
    const onComplete = vi.fn();
    render(<LoadingScreen onComplete={onComplete} />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByText(/une action peut faire toute la différence/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
