import React, { RefObject } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { SearchBar, SearchType } from './SearchBar';

interface FileUploadSectionProps {
  fileInputRef: RefObject<HTMLInputElement>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  onClearAmounts: () => void;
}

export function FileUploadSection({
  fileInputRef,
  onFileUpload,
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  onClearAmounts
}: FileUploadSectionProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="col-span-2">
      <div dir={isRTL ? 'rtl' : 'ltr'} className="relative mb-6">
        <div className="flex items-center justify-between gap-1 sm:gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="font-bold text-[9px] sm:text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-1 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-transparent shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150 ease-in-out dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
            type="button"
          >
            {t('commission.importExcel')}
          </button>

          <div className="flex-1 max-w-[60%] sm:max-w-[70%]">
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchType={searchType}
              setSearchType={setSearchType}
            />
          </div>

          <button
            onClick={onClearAmounts}
            className="font-bold text-[9px] sm:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-1 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-transparent shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150 ease-in-out dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
            type="button"
          >
            {t('commission.clearAmounts')}
          </button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          accept=".xlsx,.xls"
          className="hidden"
        />
      </div>
    </div>
  );
}
