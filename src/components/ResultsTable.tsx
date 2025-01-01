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
    <div className="bg-blue-50 rounded-xl p-4 divide-y divide-blue-100 h-[400px] sm:h-[400px] overflow-y-auto results-container">
      {results.map((result, index) => (
        <div 
          key={index}
          data-amount={result.amount}
          className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-sm cursor-pointer transition-colors duration-150 ease-in-out"
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
