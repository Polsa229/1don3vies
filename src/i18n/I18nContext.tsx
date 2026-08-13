import { useState, useCallback, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from '@/i18n/translations';
import { I18nContext } from '@/i18n/i18n-context';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[lang][key] ?? translations.fr[key] ?? key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}
