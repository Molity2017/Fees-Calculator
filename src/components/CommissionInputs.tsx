import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { CommissionInput } from './CommissionInput';

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

export type { CommissionInputsProps };

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

  const handleActiveChange = (field: keyof typeof activeInputs, value: boolean) => {
    setActiveInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <CommissionInput
        label={t('commission.percentage')}
        value={percentage}
        onChange={onPercentageChange}
        active={activeInputs.percentage}
        onActiveChange={(value) => handleActiveChange('percentage', value)}
        placeholder="2.5"
        symbol="%"
      />
      <CommissionInput
        label={t('commission.fixedAmount')}
        value={fixedAmount}
        onChange={onFixedAmountChange}
        active={activeInputs.fixedAmount}
        onActiveChange={(value) => handleActiveChange('fixedAmount', value)}
        placeholder="50"
        symbol="$"
      />
      <CommissionInput
        label={t('commission.minAmount')}
        value={minAmount}
        onChange={onMinAmountChange}
        active={activeInputs.minAmount}
        onActiveChange={(value) => handleActiveChange('minAmount', value)}
        placeholder="10"
        symbol="↓"
      />
      <CommissionInput
        label={t('commission.maxAmount')}
        value={maxAmount}
        onChange={onMaxAmountChange}
        active={activeInputs.maxAmount}
        onActiveChange={(value) => handleActiveChange('maxAmount', value)}
        placeholder="100"
        symbol="↑"
      />
    </div>
  );
}