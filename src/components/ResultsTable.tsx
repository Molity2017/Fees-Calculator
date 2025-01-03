import { useLanguage } from '../hooks/useLanguage';
import { formatNumber } from '../utils/formatNumber';

interface ResultItem {
  amount: number;
  commission: number;
  accountNumber: string;
  accountName: string;
}

interface ResultsTableProps {
  results: ResultItem[];
  onResultClick: (result: ResultItem) => void;
}

export function ResultsTable({ results, onResultClick }: ResultsTableProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="rounded-xl p-4 h-[400px] sm:h-[400px] overflow-y-auto results-container
      dark:bg-gray-800/50 dark:border-gray-700 bg-gray-800/5 border border-gray-700/10 transition-colors duration-200">
      {results.map((result, index) => (
        <div 
          key={index}
          data-amount={result.amount}
          className="bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80 
            rounded-lg shadow-sm cursor-pointer transition-colors duration-150 ease-in-out mb-2 last:mb-0"
          onClick={() => onResultClick(result)}
        >
          <div className="p-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-extrabold text-gray-900 dark:text-white">{t('commission.amount')}&nbsp;&nbsp;: </span>
                {formatNumber(result.amount)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-extrabold text-gray-900 dark:text-white">{t('commission.commission')}&nbsp;&nbsp;: </span>
                <span className="text-green-600 dark:text-green-400">{formatNumber(result.commission)}</span>
              </div>
            </div>
            {(result.accountNumber || result.accountName) && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {result.accountNumber && (
                  <div>{t('commission.accountNumber')}: {result.accountNumber}</div>
                )}
                {result.accountName && (
                  <div>{t('commission.accountName')}: {result.accountName}</div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
