import { Search } from 'lucide-react';

interface NoResultsProps {
  message: string;
  suggestion: string;
}

export function NoResults({ message, suggestion }: NoResultsProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-full bg-warmgray-100 flex items-center justify-center mx-auto mb-4">
        <Search className="w-7 h-7 text-warmgray-400" aria-hidden />
      </div>
      <p className="text-lg font-display text-primary-900 mb-2">{message}</p>
      <p className="text-sm text-warmgray-600 max-w-sm mx-auto">{suggestion}</p>
    </div>
  );
}
