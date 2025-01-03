import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { formatNumber, formatPDFNumber } from '../utils/formatNumber';

interface TotalsSectionProps {
  totalAmount: number;
  totalCommission: number;
  isPDF?: boolean;
}

const TotalsSection: React.FC<TotalsSectionProps> = ({
  totalAmount,
  totalCommission,
  isPDF = false,
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const totalSum = totalAmount + totalCommission;
  const format = isPDF ? formatPDFNumber : formatNumber;

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-6 transition-colors duration-200" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="rounded-xl p-3 sm:p-6 shadow-sm transition-colors duration-200
        dark:bg-gray-800/50 dark:border-gray-700 bg-blue-50/50 border border-blue-100">
        <div className="text-center">
          <div className="text-sm sm:text-lg mb-2 font-bold transition-colors duration-200
            dark:text-gray-300 text-gray-600">{t('commission.totalAmount')}</div>
          <div className="text-sm sm:text-4xl font-bold transition-colors duration-200
            dark:text-blue-400 text-blue-700">
            {format(totalAmount)}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-2 sm:p-6 shadow-sm transition-colors duration-200
        dark:bg-gray-800/50 dark:border-gray-700 bg-green-50/50 border border-green-100">
        <div className="text-center">
          <div className="text-sm sm:text-lg mb-2 sm:mb-2 font-bold px-0 mt-1 transition-colors duration-200
            dark:text-gray-300 text-gray-600">{t('commission.totalCommission')}</div>
          <div className="text-sm sm:text-4xl font-bold transition-colors duration-200
            dark:text-green-400 text-green-700">
            {format(totalCommission)}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-3 sm:p-6 shadow-sm transition-colors duration-200
        dark:bg-gray-800/50 dark:border-gray-700 bg-purple-50/50 border border-purple-100">
        <div className="text-center">
          <div className="text-sm sm:text-lg mb-2 sm:mb-2 font-bold transition-colors duration-200
            dark:text-gray-300 text-gray-600">{t('commission.total')}</div>
          <div className="text-sm sm:text-4xl font-bold transition-colors duration-200
            dark:text-purple-400 text-purple-700">
            {format(totalSum)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
