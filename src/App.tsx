import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import Controls from './components/Controls';
import { CommissionInputs } from './components/CommissionInputs';
import TotalsSection from './components/TotalsSection';
import { PDFSettingsModal } from './components/modals/PDFSettingsModal';
import { ResultsModal } from './components/modals/ResultsModal';
import { ResultsTable } from './components/ResultsTable';
import { ExportButton } from './components/ExportButton';
import { FileUploadSection } from './components/FileUploadSection';
import { InputSection } from './components/InputSection';
import { DeveloperButton } from './components/DeveloperButton';
import { ErrorModal } from './components/modals/ErrorModal';
import { useLanguage } from './hooks/useLanguage';
import { ResultItem, ExcelDataItem, PDFSettings, SearchType } from './types/types';
import { processExcelData } from './utils/ExcelUtils';
import { calculateCommissions } from './utils/CommissionCalculator';
import { generatePDF } from './utils/PDFGenerator';
import * as XLSX from 'xlsx';
import './index.css';

/**
 * المكون الرئيسي للتطبيق
 * يتحكم في حساب العمولات وعرض النتائج
 */
function App() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  // حالة البيانات الرئيسية
  const [amounts, setAmounts] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');
  const [fixedAmount, setFixedAmount] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [excelData, setExcelData] = useState<ExcelDataItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  
  // حالة البحث والأخطاء
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('amount');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfSettings, setPdfSettings] = useState<PDFSettings>({
    companyName: '',
    companyLogo: null
  });
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // المراجع
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * حساب العمولات بناءً على المدخلات الحالية
   * يتم استدعاؤها عند تغيير أي من المدخلات
   */
  const calculateResults = useCallback(() => {
    try {
      const config = { percentage, fixedAmount, minAmount, maxAmount };
      const calculatedResults = calculateCommissions(amounts, config, excelData);
      
      if (!calculatedResults || calculatedResults.length === 0) {
        console.error('No results returned from calculation');
        setResults([]);
        return;
      }

      setResults(calculatedResults);
      setErrorMessage('');
    } catch (err) {
      console.error('Error in calculateResults:', err);
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      setResults([]);
    }
  }, [amounts, percentage, fixedAmount, minAmount, maxAmount, excelData]);

  /**
   * تحديث النتائج عند تغيير المدخلات
   */
  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  /**
   * معالجة تحميل ملف Excel
   * @param event الحدث عند تحميل الملف
   */
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

  /**
   * فلترة النتائج بناءً على البحث
   */
  const filteredResults = useMemo(() => {
    if (!debouncedSearchQuery) return results;
    
    const searchLower = debouncedSearchQuery.toLowerCase();
    
    return results.filter(result => {
      switch (searchType) {
        case 'amount':
          return result.amount.toString().includes(searchLower);
        
        case 'accountNumber':
          if (!result.accountNumber) return false;
          const accountNumber = result.accountNumber.toLowerCase();
          // البحث في الأرقام فقط
          if (/^\d+$/.test(searchLower)) {
            return accountNumber.replace(/\D/g, '').includes(searchLower);
          }
          // البحث في رقم الحساب كامل
          return accountNumber.includes(searchLower);
        
        case 'accountName':
          if (!result.accountName) return false;
          return result.accountName.toLowerCase().includes(searchLower);
        
        default:
          return false;
      }
    });
  }, [results, debouncedSearchQuery, searchType]);

  /**
   * حساب الإجماليات
   * @returns الإجماليات
   */
  const totals = useMemo(() => {
    if (!results || results.length === 0) {
      return { totalAmount: 0, totalCommission: 0 };
    }
    return results.reduce((acc, result) => ({
      totalAmount: acc.totalAmount + result.amount,
      totalCommission: acc.totalCommission + result.commission
    }), { totalAmount: 0, totalCommission: 0 });
  }, [results]);

  /**
   * معالجة النقر على نتيجة
   * @param result النتيجة التي تم النقر عليها
   */
  const handleResultClick = useCallback((result: ResultItem) => {
    setSelectedResult(result);
    setShowModal(true);
  }, []);

  /**
   * معالجة تحديد النص في منطقة النص
   * @param e الحدث عند تحديد النص
   */
  const handleTextareaSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selectedText = target.value.substring(target.selectionStart, target.selectionEnd);
    const amount = parseFloat(selectedText.trim());
    if (!isNaN(amount)) {
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
    }
  }, []);

  /**
   * معالجة تصدير النتائج إلى PDF
   * @param settings إعدادات PDF
   */
  const handleExportToPDF = (settings: PDFSettings) => {
    try {
      generatePDF({ results, totals, settings });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-[100%] md:max-w-[90%] lg:max-w-[85%] mx-auto p-4">
        <div className={`bg-white ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <Header />
          <Controls 
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
          />
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
          <div className="mb-4">
            <FileUploadSection
              fileInputRef={fileInputRef}
              onFileUpload={handleFileUpload}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchType={searchType}
              setSearchType={setSearchType}
              onClearAmounts={() => {
                setAmounts('');
                setResults([]);
                setExcelData([]);
              }}
            />
          </div>
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="col-span-1 sm:col-span-6">
              <InputSection
                textareaRef={textareaRef}
                value={amounts}
                onChange={(value) => {
                  setAmounts(value);
                }}
                onSelect={handleTextareaSelect}
                placeholder={t('commission.amountsPlaceholder')}
                isRTL={isRTL}
              />
            </div>

            <div className="col-span-1 sm:col-span-6">
              {filteredResults.length > 0 && (
                <ResultsTable 
                  results={filteredResults}
                  onResultClick={handleResultClick}
                />
              )}
            </div>
          </div>

          <TotalsSection 
            totalAmount={totals.totalAmount}
            totalCommission={totals.totalCommission}
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

          {errorMessage && (
            <ErrorModal
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;