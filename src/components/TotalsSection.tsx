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
    <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-sm border border-blue-100">
        <div className="text-center">
          <div className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2 font-bold">{t('commission.totalAmount')}</div>
          <div className="text-sm sm:text-4xl font-bold text-blue-700">
            {format(totalAmount)}
          </div>
        </div>
      </div>
      <div className="bg-green-50/50 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-sm border border-green-100">
        <div className="text-center">
          <div className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2 font-bold">{t('commission.totalCommission')}</div>
          <div className="text-sm sm:text-4xl font-bold text-green-700">
            {format(totalCommission)}
          </div>
        </div>
      </div>
      <div className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-3 sm:p-6 shadow-sm border border-purple-100">
        <div className="text-center">
          <div className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2 font-bold">{t('commission.total')}</div>
          <div className="text-sm sm:text-4xl font-bold text-purple-700">
            {format(totalSum)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
