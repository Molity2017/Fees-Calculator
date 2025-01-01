import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export type SearchType = 'amount' | 'accountNumber' | 'accountName';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
  searchType,
  setSearchType
}: SearchBarProps): React.JSX.Element {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="relative flex items-center gap-1 sm:gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder || t('commission.searchPlaceholder')}
          className="w-full h-10 sm:h-10 px-2 sm:px-4 text-[8px] sm:text-base rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
            style={{
              right: isRTL ? 'auto' : '0.5rem',
              left: isRTL ? '0.5rem' : 'auto'
            }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as SearchType)}
        className="w-16 sm:w-auto h-10 sm:h-10 px-0 sm:px-2 text-[8px] sm:text-base rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="amount">{t('commission.amount')}</option>
        <option value="accountNumber">{t('commission.accountNumber')}</option>
        <option value="accountName">{t('commission.accountName')}</option>
      </select>
    </div>
  );
}
