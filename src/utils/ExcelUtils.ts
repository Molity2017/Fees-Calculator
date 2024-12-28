import { ExcelDataItem } from '../types/types';

const possibleAmountColumns = [
  'amount', 'Amount', 'AMOUNT',
  'المبلغ', 'مبلغ', 'القيمة', 'قيمة',
  'value', 'Value', 'VALUE',
  'sum', 'Sum', 'SUM',
  'price', 'Price', 'PRICE',
  'total', 'Total', 'TOTAL',
  'cost', 'Cost', 'COST',
  'money', 'Money', 'MONEY'
];

export function findAccountColumn(columns: string[]): string {
  const accountKeywords = ['account', 'Account', 'ACCOUNT', 'حساب', 'رقم الحساب', 'رقم'];
  return columns.find(column => 
    accountKeywords.includes(column) || 
    accountKeywords.some(keyword => 
      column.toLowerCase().includes(keyword.toLowerCase())
    )
  ) || '';
}

export function findAccountNameColumn(columns: string[]): string {
  const nameKeywords = ['name', 'Name', 'NAME', 'اسم', 'اسم العميل', 'عميل'];
  return columns.find(column => 
    nameKeywords.includes(column) || 
    nameKeywords.some(keyword => 
      column.toLowerCase().includes(keyword.toLowerCase())
    )
  ) || '';
}

interface ProcessedExcelData {
  amounts: string;
  excelData: ExcelDataItem[];
}

export function processExcelData(jsonData: Record<string, any>[]): ProcessedExcelData | null {
  if (!jsonData.length) return null;

  const firstRow = jsonData[0];
  const columns = Object.keys(firstRow);
  
  const amountColumnName = columns.find(column => 
    possibleAmountColumns.includes(column) || 
    possibleAmountColumns.some(possible => 
      column.toLowerCase().includes(possible.toLowerCase())
    )
  ) || columns[0];

  const accountColumnName = findAccountColumn(columns);
  const accountNameColumnName = findAccountNameColumn(columns);
  
  const processedData = jsonData
    .map(row => {
      const value = row[amountColumnName];
      const accountNumber = accountColumnName ? String(row[accountColumnName] || '') : '';
      const accountName = accountNameColumnName ? String(row[accountNameColumnName] || '') : '';
      
      const numValue = typeof value === 'string' ? 
        parseFloat(value.replace(/[^\d.-]/g, '')) : 
        value;

      if (!isNaN(numValue)) {
        return {
          amount: numValue,
          accountNumber,
          accountName
        };
      }
      return null;
    })
    .filter((item): item is { amount: number; accountNumber: string; accountName: string } => item !== null);

  if (processedData.length === 0) return null;

  return {
    amounts: processedData.map(item => item.amount.toString()).join('\n'),
    excelData: processedData
  };
}
