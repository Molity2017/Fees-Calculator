import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface CommissionInputsProps {
  percentage: string;
  fixedAmount: string;
  minAmount: string;
  maxAmount: string;
  onPercentageChange: (value: string) => void;
  onFixedAmountChange: (value: string) => void;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
}

export function CommissionInputs({
  percentage,
  fixedAmount,
  minAmount,
  maxAmount,
  onPercentageChange,
  onFixedAmountChange,
  onMinAmountChange,
  onMaxAmountChange,
}: CommissionInputsProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [activeInputs, setActiveInputs] = useState({
    percentage: false,
    fixedAmount: false,
    minAmount: false,
    maxAmount: false
  });

  const handleCheckboxChange = (field: keyof typeof activeInputs) => {
    setActiveInputs(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      if (!newState[field]) {
        switch (field) {
          case 'percentage': onPercentageChange(''); break;
          case 'fixedAmount': onFixedAmountChange(''); break;
          case 'minAmount': onMinAmountChange(''); break;
          case 'maxAmount': onMaxAmountChange(''); break;
        }
      }
      return newState;
    });
  };

  return (
    <div className="grid grid-cols-4 gap-6 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 text-right">{t('commission.percentage')}</div>
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={activeInputs.percentage}
            onChange={() => handleCheckboxChange('percentage')}
          />
        </div>
        <input
          type="number"
          value={percentage}
          onChange={(e) => {
            if (activeInputs.percentage) {
              onPercentageChange(e.target.value);
            }
          }}
          disabled={!activeInputs.percentage}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="2.5"
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 text-right">{t('commission.fixedAmount')}</div>
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={activeInputs.fixedAmount}
            onChange={() => handleCheckboxChange('fixedAmount')}
          />
        </div>
        <input
          type="number"
          value={fixedAmount}
          onChange={(e) => {
            if (activeInputs.fixedAmount) {
              onFixedAmountChange(e.target.value);
            }
          }}
          disabled={!activeInputs.fixedAmount}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="50"
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 text-right">{t('commission.minAmount')}</div>
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={activeInputs.minAmount}
            onChange={() => handleCheckboxChange('minAmount')}
          />
        </div>
        <input
          type="number"
          value={minAmount}
          onChange={(e) => {
            if (activeInputs.minAmount) {
              onMinAmountChange(e.target.value);
            }
          }}
          disabled={!activeInputs.minAmount}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="100"
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 text-right">{t('commission.maxAmount')}</div>
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={activeInputs.maxAmount}
            onChange={() => handleCheckboxChange('maxAmount')}
          />
        </div>
        <input
          type="number"
          value={maxAmount}
          onChange={(e) => {
            if (activeInputs.maxAmount) {
              onMaxAmountChange(e.target.value);
            }
          }}
          disabled={!activeInputs.maxAmount}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="1000"
        />
      </div>
    </div>
  );
}