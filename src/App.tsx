import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { CommissionInputs } from './components/CommissionInputs';
import { TotalsSection } from './components/TotalsSection';
import { PDFSettingsModal } from './components/modals/PDFSettingsModal';
import { ResultsModal } from './components/modals/ResultsModal';
import { ResultsTable } from './components/ResultsTable';
import { ExportButton } from './components/ExportButton';
import { FileUploadSection } from './components/FileUploadSection';
import { InputSection } from './components/InputSection';
import { DeveloperButton } from './components/DeveloperButton';
import { useLanguage } from './hooks/useLanguage';
import { ResultItem, ExcelDataItem, PDFSettings } from './types/types';
import { processExcelData } from './utils/ExcelUtils';
import { calculateCommissions } from './utils/CommissionCalculator';
import { generatePDF } from './utils/PDFGenerator';
import * as XLSX from 'xlsx';
import './index.css';

function App() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [darkMode, setDarkMode] = useState(false);
  const [percentage, setPercentage] = useState<string>('');
  const [fixedAmount, setFixedAmount] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [amounts, setAmounts] = useState<string>('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [excelData, setExcelData] = useState<ExcelDataItem[]>([]);
  const [, setSelectedAmount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfSettings, setPdfSettings] = useState<PDFSettings>({
    companyName: '',
    companyLogo: null
  });
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

        const result = processExcelData(jsonData);
        if (result) {
          setAmounts(result.amounts);
          setExcelData(result.excelData);
        } else {
          alert('لم يتم العثور على قيم صحيحة في الملف. تأكد من أن الملف يحتوي على عمود للمبالغ.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const calculateResults = useCallback(() => {
    const config = { percentage, fixedAmount, minAmount, maxAmount };
    const results = calculateCommissions(amounts, config, excelData);
    setResults(results);
  }, [amounts, percentage, fixedAmount, minAmount, maxAmount, excelData]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const scrollToResult = useCallback((amount: number) => {
    const resultElement = document.querySelector(`[data-amount="${amount}"]`);
    const resultsContainer = document.querySelector('.results-container');
    if (resultElement && resultsContainer) {
      const containerRect = resultsContainer.getBoundingClientRect();
      const elementRect = resultElement.getBoundingClientRect();
      const scrollTop = resultsContainer.scrollTop + (elementRect.top - containerRect.top) - (containerRect.height / 2) + (elementRect.height / 2);
      resultsContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleResultClick = useCallback((result: ResultItem) => {
    setSelectedResult(result);
    setShowModal(true);
    setSelectedAmount(result.amount);
  }, []);

  const handleTextareaSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selectedText = target.value.substring(target.selectionStart, target.selectionEnd);
    const amount = parseFloat(selectedText.trim());
    if (!isNaN(amount)) {
      setSelectedAmount(amount);
      scrollToResult(amount);
    }
  }, [scrollToResult]);

  const filteredResults = useMemo(() => {
    if (!searchQuery) return results;
    return results.filter(result => 
      result.amount.toString().includes(searchQuery) ||
      result.commission.toString().includes(searchQuery) ||
      (result.accountNumber && result.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (result.accountName && result.accountName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [results, searchQuery]);

  const totals = useMemo(() => {
    return results.reduce((acc, result) => ({
      totalAmount: acc.totalAmount + result.amount,
      totalCommission: acc.totalCommission + result.commission
    }), { totalAmount: 0, totalCommission: 0 });
  }, [results]);

  const handleClearAmounts = () => {
    setAmounts('');
    setResults([]);
    setExcelData([]);
  };

  const handleExportToPDF = (settings: PDFSettings) => {
    try {
      generatePDF({ results, totals, settings });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6`}
         dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8`}>
        <Header />
        <Controls darkMode={darkMode} onDarkModeChange={setDarkMode} />
        <CommissionInputs
          percentage={percentage}
          fixedAmount={fixedAmount}
          minAmount={minAmount}
          maxAmount={maxAmount}
          onPercentageChange={setPercentage}
          onFixedAmountChange={setFixedAmount}
          onMinAmountChange={setMinAmount}
          onMaxAmountChange={setMaxAmount}
        />
        <div className="mb-8 grid grid-cols-2 gap-4">
          <FileUploadSection
            fileInputRef={fileInputRef}
            onFileUpload={handleFileUpload}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClearAmounts={handleClearAmounts}
          />

          <InputSection
            textareaRef={textareaRef}
            value={amounts}
            onChange={(value) => {
              setAmounts(value);
              setSelectedAmount(null);
            }}
            onSelect={handleTextareaSelect}
            placeholder={t('commission.amountsPlaceholder')}
            isRTL={isRTL}
          />

          {results.length > 0 && (
            <div className="col-span-1">
              <ResultsTable 
                results={filteredResults}
                onResultClick={handleResultClick}
              />
            </div>
          )}
        </div>

        <TotalsSection 
          totalAmount={totals.totalAmount}
          totalCommission={totals.totalCommission}
          darkMode={darkMode}
        />

        <div className="flex justify-center mt-4">
          <ExportButton onClick={() => setShowPdfSettings(true)} />
        </div>

        <DeveloperButton />

        {showModal && selectedResult && (
          <ResultsModal
            result={selectedResult}
            onClose={() => setShowModal(false)}
            percentage={percentage}
            fixedAmount={fixedAmount}
            minAmount={minAmount}
            maxAmount={maxAmount}
            isPercentageChecked={!!percentage}
            isFixedAmountChecked={!!fixedAmount}
            isMinAmountChecked={!!minAmount}
            isMaxAmountChecked={!!maxAmount}
          />
        )}

        {showPdfSettings && (
          <PDFSettingsModal
            initialSettings={pdfSettings}
            onExport={(settings) => {
              handleExportToPDF(settings);
              setPdfSettings(settings);
              setShowPdfSettings(false);
            }}
            onClose={() => setShowPdfSettings(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;