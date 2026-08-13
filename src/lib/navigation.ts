import type { NavigateFunction } from 'react-router-dom';

/** Scroll vers une section de l'accueil, ou y navigue si on est sur une autre route. */
export function goToSection(
  id: string,
  options: {
    pathname: string;
    navigate: NavigateFunction;
  },
) {
  const { pathname, navigate } = options;

  // "Centres" always opens the dedicated page
  if (id === 'centers') {
    if (pathname === '/centres') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate('/centres');
    return;
  }

  if (pathname === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  navigate({ pathname: '/', hash: id });
}

export function goHome(options: { pathname: string; navigate: NavigateFunction }) {
  const { pathname, navigate } = options;
  if (pathname !== '/') {
    navigate('/');
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
