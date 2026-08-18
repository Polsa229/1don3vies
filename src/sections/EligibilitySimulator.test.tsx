import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { EligibilitySimulator } from './EligibilitySimulator';
import { renderWithI18n } from '@/test/renderWithI18n';

vi.mock('@/components/shared/InkBlot', () => ({
  InkBlot: () => null,
}));

describe('EligibilitySimulator', () => {
  it('affiche une erreur si le formulaire est soumis vide', async () => {
    const user = userEvent.setup();
    renderWithI18n(<EligibilitySimulator />);

    await user.click(screen.getByRole('button', { name: /voir mon résultat/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/veuillez saisir votre âge/i);
  });

  it('affiche directement le résultat si l’âge est bloquant', async () => {
    const user = userEvent.setup();
    renderWithI18n(<EligibilitySimulator />);

    await user.type(screen.getByLabelText(/quel âge/i), '16');
    await user.click(screen.getByRole('button', { name: /voir mon résultat/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/18 et 65 ans/i);
    expect(screen.getByText(/vous n'êtes pas éligible/i)).toBeInTheDocument();
  });

  it('affiche éligible pour un profil valide sans don antérieur', async () => {
    const user = userEvent.setup();
    renderWithI18n(<EligibilitySimulator />);

    await user.type(screen.getByLabelText(/quel âge/i), '30');
    await user.click(screen.getByRole('button', { name: /^homme$/i }));
    await user.type(screen.getByLabelText(/poids/i), '70');
    await user.click(screen.getByRole('button', { name: /^non$/i }));
    await user.click(screen.getByRole('button', { name: /voir mon résultat/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/vous pouvez donner/i);
  });

  it('demande la date si l’utilisateur a déjà donné', async () => {
    const user = userEvent.setup();
    renderWithI18n(<EligibilitySimulator />);

    await user.type(screen.getByLabelText(/quel âge/i), '30');
    await user.click(screen.getByRole('button', { name: /^homme$/i }));
    await user.type(screen.getByLabelText(/poids/i), '70');
    await user.click(screen.getByRole('button', { name: /^oui$/i }));
    await user.click(screen.getByRole('button', { name: /voir mon résultat/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /date de votre dernier don/i,
    );
  });
});
