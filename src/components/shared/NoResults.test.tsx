import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoResults } from './NoResults';

describe('NoResults', () => {
  it('annonce l’état vide aux lecteurs d’écran', () => {
    render(
      <NoResults
        message="Aucun centre ne correspond à votre recherche."
        suggestion="Essayez d'élargir vos filtres."
      />,
    );

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent(/aucun centre/i);
    expect(status).toHaveTextContent(/élargir vos filtres/i);
  });
});
