import { ResultItem, ExcelDataItem } from '../types/types';

interface CommissionConfig {
  percentage: string;
  fixedAmount: string;
  minAmount: string;
  maxAmount: string;
}

type ValidationError = {
  type: 'NEGATIVE_AMOUNT' | 'INVALID_PERCENTAGE' | 'INVALID_FIXED_AMOUNT' | 'INVALID_MIN_AMOUNT' | 'INVALID_MAX_AMOUNT';
  message: string;
};

/**
 * Validates the commission configuration and amount.
 * 
 * @param amount The amount to validate
 * @param config The commission configuration to validate
 * @returns An error object if validation fails, null otherwise
 */
function validateCommissionInput(amount: number, config: CommissionConfig): ValidationError | null {
  if (amount < 0) {
    return {
      type: 'NEGATIVE_AMOUNT',
      message: 'Amount cannot be negative'
    };
  }

  const percentage = Number(config.percentage);
  if (isNaN(percentage) || percentage < 0 || percentage > 100) {
    return {
      type: 'INVALID_PERCENTAGE',
      message: 'Percentage must be between 0 and 100'
    };
  }

  const fixedAmount = Number(config.fixedAmount);
  if (config.fixedAmount && (isNaN(fixedAmount) || fixedAmount < 0)) {
    return {
      type: 'INVALID_FIXED_AMOUNT',
      message: 'Fixed amount must be a positive number'
    };
  }

  const minAmount = Number(config.minAmount);
  if (config.minAmount && (isNaN(minAmount) || minAmount < 0)) {
    return {
      type: 'INVALID_MIN_AMOUNT',
      message: 'Minimum amount must be a positive number'
    };
  }

  const maxAmount = Number(config.maxAmount);
  if (config.maxAmount && (isNaN(maxAmount) || maxAmount < 0)) {
    return {
      type: 'INVALID_MAX_AMOUNT',
      message: 'Maximum amount must be a positive number'
    };
  }

  if (config.minAmount && config.maxAmount && minAmount > maxAmount) {
    return {
      type: 'INVALID_MIN_AMOUNT',
      message: 'Minimum amount cannot be greater than maximum amount'
    };
  }

  return null;
}

/**
 * Calculates the commission based on the given amount and configuration.
 * 
 * @param amount The amount to calculate the commission for
 * @param config The commission configuration
 * @returns The calculated commission result or null if validation fails
 */
export function calculateCommission(amount: number, config: CommissionConfig): ResultItem | null {
  // Validate input
  const validationError = validateCommissionInput(amount, config);
  if (validationError) {
    console.error('Validation error:', validationError.message);
    return null;
  }

  // Convert config values to numbers once
  const percentage = Number(config.percentage);
  const fixedAmount = config.fixedAmount ? Number(config.fixedAmount) : 0;
  const minAmount = config.minAmount ? Number(config.minAmount) : -Infinity;
  const maxAmount = config.maxAmount ? Number(config.maxAmount) : Infinity;
  
  // Calculate base commission
  let commission = amount * (percentage / 100);
  
  // Apply limits and fixed amount
  commission = Math.max(minAmount, Math.min(maxAmount, commission));
  commission += fixedAmount;

  return {
    amount,
    commission,
    accountNumber: '',
    accountName: ''
  };
}

/**
 * Calculates the commissions for multiple amounts based on the given configuration and Excel data.
 * 
 * @param amounts The amounts string, with each amount on a new line
 * @param config The commission configuration
 * @param excelData Optional Excel data for account information
 * @returns Array of calculated commission results
 */
export function calculateCommissions(
  amounts: string,
  config: CommissionConfig,
  excelData: ExcelDataItem[] = []
): ResultItem[] {
  // Split and clean the input
  const lines = amounts
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  
  // Process each line
  return lines
    .map((line, index) => {
      const amount = parseFloat(line);
      if (isNaN(amount)) {
        console.warn(`Invalid amount on line ${index + 1}: "${line}"`);
        return null;
      }

      const result = calculateCommission(amount, config);
      if (!result) return null;

      // Add account information if available
      const currentExcelData = excelData[index];
      if (currentExcelData) {
        result.accountNumber = currentExcelData.accountNumber || '';
        result.accountName = currentExcelData.accountName || '';
      }

      return result;
    })
    .filter((result): result is ResultItem => result !== null);
}
