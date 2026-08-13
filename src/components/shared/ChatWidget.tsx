import { useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Droplet } from 'lucide-react';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

const QUICK_QUESTIONS_FR = [
  'Puis-je donner mon sang ?',
  'Où trouver un centre ?',
  'Combien de temps ça dure ?',
];

const QUICK_QUESTIONS_EN = [
  'Can I donate blood?',
  'Where is the nearest center?',
  'How long does it take?',
];

const ANSWERS_FR: Record<string, string> = {
  'Puis-je donner mon sang ?':
    'Vous devez avoir entre 18 et 65 ans, peser au moins 50 kg, et respecter un délai entre deux dons (3 mois pour les hommes, 4 mois pour les femmes). Utilisez notre simulateur d\'éligibilité ci-dessus pour vérifier !',
  'Où trouver un centre ?':
    'Consultez la section « Centres » plus bas sur cette page. Vous y trouverez tous les centres de collecte au Bénin avec leurs horaires et coordonnées.',
  'Combien de temps ça dure ?':
    'Un don de sang prend environ 50 minutes au total : 15 min d\'accueil et d\'entretien, 8-10 min pour le prélèvement, puis 20 min de repos et collation.',
};

const ANSWERS_EN: Record<string, string> = {
  'Can I donate blood?':
    'You must be 18-65 years old, weigh at least 50 kg, and respect a delay between donations (3 months for men, 4 months for women). Try our eligibility simulator above!',
  'Where is the nearest center?':
    'Check the "Centers" section further down this page. You\'ll find all collection centers in Benin with their hours and contact info.',
  'How long does it take?':
    'A blood donation takes about 50 minutes total: 15 min welcome and interview, 8-10 min for the collection, then 20 min of rest and refreshments.',
};

export function ChatWidget() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const quickQuestions = lang === 'fr' ? QUICK_QUESTIONS_FR : QUICK_QUESTIONS_EN;
  const answers = lang === 'fr' ? ANSWERS_FR : ANSWERS_EN;

  function handleQuick(q: string) {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'bot', text: answers[q] || (lang === 'fr' ? 'Je vous invite à consulter la section correspondante sur cette page.' : 'Please check the relevant section on this page.') },
    ]);
  }

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg },
      {
        role: 'bot',
        text: lang === 'fr'
          ? 'Merci pour votre message ! Pour des réponses précises, explorez les sections de cette page ou contactez directement un centre de collecte.'
          : 'Thank you for your message! For specific answers, please explore the sections on this page or contact a collection center directly.',
      },
    ]);
    setInput('');
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent-600 text-white shadow-xl shadow-accent-600/30 flex items-center justify-center hover:bg-accent-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={lang === 'fr' ? 'Ouvrir le chat' : 'Open chat'}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-warmgray-200/50 overflow-hidden flex flex-col"
            style={{ height: 420 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-bordeaux-700 text-ivory-50 px-4 py-3 flex items-center gap-2">
              <Droplet className="w-5 h-5" fill="currentColor" />
              <div>
                <p className="font-display text-sm font-medium">HemoLink Assistant</p>
                <p className="text-xs text-bordeaux-200">
                  {lang === 'fr' ? 'En ligne' : 'Online'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-ivory-50">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-warmgray-500 mb-4">
                    {lang === 'fr'
                      ? 'Bonjour ! Comment puis-je vous aider ?'
                      : 'Hello! How can I help you?'}
                  </p>
                  <div className="space-y-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuick(q)}
                        className="block w-full text-left px-3 py-2 text-sm rounded-lg bg-white border border-warmgray-200 text-warmgray-700 hover:border-bordeaux-300 hover:text-bordeaux-700 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-bordeaux-700 text-ivory-50 rounded-br-sm'
                        : 'bg-white border border-warmgray-200 text-warmgray-700 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-warmgray-200 bg-white flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={lang === 'fr' ? 'Écrivez un message...' : 'Type a message...'}
                className="flex-1 px-3 py-2 text-sm bg-ivory-50 rounded-lg border border-warmgray-200 focus:border-bordeaux-300 focus:outline-none text-warmgray-700 placeholder-warmgray-400"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-lg bg-bordeaux-700 text-ivory-50 flex items-center justify-center hover:bg-bordeaux-800 transition-colors shrink-0"
                aria-label={lang === 'fr' ? 'Envoyer' : 'Send'}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
