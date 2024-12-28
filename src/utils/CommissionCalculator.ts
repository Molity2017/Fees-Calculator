import { ResultItem, ExcelDataItem } from '../types/types';

interface CommissionConfig {
  percentage: string;
  fixedAmount: string;
  minAmount: string;
  maxAmount: string;
}

/**
 * Calculates the commission based on the given amount and configuration.
 * 
 * @param amount The amount to calculate the commission for.
 * @param config The commission configuration.
 * @returns The calculated commission result.
 */
export function calculateCommission(amount: number, config: CommissionConfig): ResultItem {
  const { percentage, fixedAmount, minAmount, maxAmount } = config;
  
  // Calculate the commission based on the percentage
  let commission = amount * (Number(percentage) / 100);
  
  // Apply the minimum and maximum limits to the commission
  if (minAmount && commission < Number(minAmount)) {
    commission = Number(minAmount);
  }
  if (maxAmount && commission > Number(maxAmount)) {
    commission = Number(maxAmount);
  }

  // Add the fixed amount to the commission
  if (fixedAmount) {
    commission += Number(fixedAmount);
  }

  // Return the calculated commission result
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
 * @param amounts The amounts to calculate the commissions for, separated by newline characters.
 * @param config The commission configuration.
 * @param excelData The Excel data to use for account information.
 * @returns The calculated commission results.
 */
export function calculateCommissions(
  amounts: string,
  config: CommissionConfig,
  excelData: ExcelDataItem[]
): ResultItem[] {
  // Split the amounts into individual lines and filter out empty lines
  const lines = amounts.split('\n').filter(line => line.trim());
  
  // Calculate the commission for each amount and map the results
  return lines.map((line, index) => {
    // Parse the amount from the line
    const amount = parseFloat(line);
    if (isNaN(amount)) return null;

    // Calculate the commission for the amount
    const result = calculateCommission(amount, config);
    const currentExcelData = excelData[index];

    // Add account information from the Excel data if available
    if (currentExcelData) {
      result.accountNumber = currentExcelData.accountNumber || '';
      result.accountName = currentExcelData.accountName || '';
    }

    // Return the calculated commission result
    return result;
  // Filter out null results
  }).filter((result): result is ResultItem => result !== null);
}
