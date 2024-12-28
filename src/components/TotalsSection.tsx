import { useLanguage } from '../hooks/useLanguage';

interface TotalsSectionProps {
  totalAmount: number;
  totalCommission: number;
  darkMode?: boolean;
}

export function TotalsSection({ totalAmount, totalCommission, darkMode }: TotalsSectionProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const totalSum = totalAmount + totalCommission;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`bg-blue-50/50 ${darkMode ? 'dark:bg-blue-900/20' : ''} backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100 ${darkMode ? 'dark:border-blue-800' : ''}`}>
        <div className="text-center">
          <div className={`text-gray-600 ${darkMode ? 'dark:text-gray-300' : ''} text-lg mb-2 font-bold`}>{t('commission.totalAmount')}</div>
          <div className={`text-4xl font-bold text-blue-700 ${darkMode ? 'dark:text-blue-500' : ''}`}>
            {formatNumber(totalAmount)}
          </div>
        </div>
      </div>
      <div className={`bg-green-50/50 ${darkMode ? 'dark:bg-green-900/20' : ''} backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-100 ${darkMode ? 'dark:border-green-800' : ''}`}>
        <div className="text-center">
          <div className={`text-gray-600 ${darkMode ? 'dark:text-gray-300' : ''} text-lg mb-2 font-bold`}>{t('commission.totalCommission')}</div>
          <div className={`text-4xl font-bold text-green-700 ${darkMode ? 'dark:text-green-500' : ''}`}>
            {formatNumber(totalCommission)}
          </div>
        </div>
      </div>
      <div className={`bg-purple-50/50 ${darkMode ? 'dark:bg-purple-900/20' : ''} backdrop-blur-sm rounded-xl p-6 shadow-sm border border-purple-100 ${darkMode ? 'dark:border-purple-800' : ''}`}>
        <div className="text-center">
          <div className={`text-gray-600 ${darkMode ? 'dark:text-gray-300' : ''} text-lg mb-2 font-bold`}>{t('commission.total')}</div>
          <div className={`text-4xl font-bold text-purple-700 ${darkMode ? 'dark:text-purple-500' : ''}`}>
            {formatNumber(totalSum)}
          </div>
        </div>
      </div>
    </div>
  );
}
