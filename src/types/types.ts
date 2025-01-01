export interface ResultItem {
  amount: number;
  commission: number;
  accountNumber: string;
  accountName: string;
}

export interface ExcelDataItem {
  accountNumber?: string;
  accountName?: string;
}

export type SearchType = 'amount' | 'accountNumber' | 'accountName';

export interface PDFSettings {
  companyName: string;
  companyLogo: string | null;
}
