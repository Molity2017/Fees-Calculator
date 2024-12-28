import { useLanguage } from '../../hooks/useLanguage';

interface ResultItem {
  amount: number;
  commission: number;
  accountNumber: string;
  accountName: string;
}

interface ResultsModalProps {
  result: ResultItem;
  onClose: () => void;
  percentage?: string;
  fixedAmount?: string;
  minAmount?: string;
  maxAmount?: string;
  isPercentageChecked?: boolean;
  isFixedAmountChecked?: boolean;
  isMinAmountChecked?: boolean;
  isMaxAmountChecked?: boolean;
}

export function ResultsModal({ 
  result, 
  onClose,
  percentage,
  fixedAmount,
  minAmount,
  maxAmount,
  isPercentageChecked = false,
  isFixedAmountChecked = false,
  isMinAmountChecked = false,
  isMaxAmountChecked = false
}: ResultsModalProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">{t('modals.results.title')}</h3>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className={`flex items-center gap-2 rounded-lg p-3 ${isPercentageChecked ? 'bg-white/10' : 'bg-white/5'}`}>
                {isPercentageChecked && (
                  <span className="bg-green-500 text-white p-1 rounded-full">✓</span>
                )}
                <div className="flex flex-col items-start">
                  <span className={isPercentageChecked ? 'text-white' : 'text-white/60'}>
                    {t('commission.percentage')}
                  </span>
                  {percentage && isPercentageChecked && (
                    <span className="font-bold text-lg">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-2 rounded-lg p-3 ${isFixedAmountChecked ? 'bg-white/10' : 'bg-white/5'}`}>
                {isFixedAmountChecked && (
                  <span className="bg-green-500 text-white p-1 rounded-full">✓</span>
                )}
                <div className="flex flex-col items-start">
                  <span className={isFixedAmountChecked ? 'text-white' : 'text-white/60'}>
                    {t('commission.fixedAmount')}
                  </span>
                  {fixedAmount && isFixedAmountChecked && (
                    <span className="font-bold text-lg">
                      {fixedAmount}
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-2 rounded-lg p-3 ${isMinAmountChecked ? 'bg-white/10' : 'bg-white/5'}`}>
                {isMinAmountChecked && (
                  <span className="bg-green-500 text-white p-1 rounded-full">✓</span>
                )}
                <div className="flex flex-col items-start">
                  <span className={isMinAmountChecked ? 'text-white' : 'text-white/60'}>
                    {t('commission.minAmount')}
                  </span>
                  {minAmount && isMinAmountChecked && (
                    <span className="font-bold text-lg">
                      {minAmount}
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-2 rounded-lg p-3 ${isMaxAmountChecked ? 'bg-white/10' : 'bg-white/5'}`}>
                {isMaxAmountChecked && (
                  <span className="bg-green-500 text-white p-1 rounded-full">✓</span>
                )}
                <div className="flex flex-col items-start">
                  <span className={isMaxAmountChecked ? 'text-white' : 'text-white/60'}>
                    {t('commission.maxAmount')}
                  </span>
                  {maxAmount && isMaxAmountChecked && (
                    <span className="font-bold text-lg">
                      {maxAmount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-gray-600 dark:text-gray-400 mb-2">{t('commission.amount')}</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatNumber(result.amount)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-center">
              <div className="text-gray-600 dark:text-gray-400 mb-2">{t('commission.commission')}</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatNumber(result.commission)}
              </div>
            </div>
          </div>

          {(result.accountNumber || result.accountName) && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">{t('commission.accountInfo')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('commission.accountNumber')}:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('commission.accountName')}:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.accountName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
          aria-label={t('modals.results.close')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
