import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { FaqSection } from './FaqSection';
import { renderWithI18n } from '@/test/renderWithI18n';
import { faqItems } from '@/data/faq.data';

vi.mock('@/components/shared/InkBlot', () => ({
  InkBlot: () => null,
}));

vi.mock('@/components/shared/DonationCriteriaPanel', () => ({
  DonationCriteriaPanel: () => <div data-testid="criteria-panel" />,
}));

describe('FaqSection', () => {
  it('affiche l’accordéon FAQ avec aria-expanded', () => {
    renderWithI18n(<FaqSection />);

    const buttons = screen.getAllByRole('button', { expanded: true });
    expect(buttons.length).toBeGreaterThan(0);
    expect(screen.getByTestId('criteria-panel')).toBeInTheDocument();
    expect(faqItems.length).toBeGreaterThan(0);
  });

  it('expose aria-expanded sur chaque entrée FAQ', () => {
    renderWithI18n(<FaqSection />);

    const faqButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.hasAttribute('aria-expanded'));

    expect(faqButtons).toHaveLength(faqItems.length);
    expect(faqButtons.filter((btn) => btn.getAttribute('aria-expanded') === 'true')).toHaveLength(1);
  });

  it('affiche une alerte si le formulaire d’inquiétude est vide', async () => {
    const user = userEvent.setup();
    renderWithI18n(<FaqSection />);

    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /indiquez un contact/i,
    );
  });

  it('confirme l’envoi du formulaire d’inquiétude', async () => {
    const user = userEvent.setup();
    renderWithI18n(<FaqSection />);

    await user.type(
      screen.getByLabelText(/contact/i),
      'test@example.com',
    );
    await user.type(
      screen.getByLabelText(/votre question/i),
      'Question sur le délai entre deux dons.',
    );
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/merci/i);
  });
});
