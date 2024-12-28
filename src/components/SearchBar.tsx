import { useLanguage } from '../hooks/useLanguage';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ searchQuery, setSearchQuery, placeholder }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder || t('commission.searchPlaceholder')}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label={t('buttons.clear')}
        >
          ✕
        </button>
      )}
    </div>
  );
}
