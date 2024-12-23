import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { CommissionInputs } from './components/CommissionInputs';
import { useLanguage } from './hooks/useLanguage';
import * as XLSX from 'xlsx';
import { FileDown } from 'lucide-react';

interface ResultItem {
  amount: number;
  commission: number;
  accountNumber: string;
  accountName: string;
}

interface ExcelDataItem {
  accountNumber?: string;
  accountName?: string;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const findAccountNameColumn = (columns: string[]): string | null => {
    const nameKeywords = [
      'name', 'Name', 'NAME',
      'اسم', 'الاسم',
      'holder', 'Holder', 'HOLDER',
      'owner', 'Owner', 'OWNER',
      'صاحب', 'المالك'
    ];

    return columns.find(column => 
      nameKeywords.includes(column) || 
      nameKeywords.some(keyword => 
        column.toLowerCase().includes(keyword.toLowerCase())
      )
    ) || null;
  };

  const findAccountColumn = (columns: string[]): string | null => {
    const accountKeywords = [
      'account', 'Account', 'ACCOUNT',
      'حساب', 'الحساب',
      'iban', 'Iban', 'IBAN',
      'phone', 'Phone', 'PHONE',
      'mobile', 'Mobile', 'MOBILE',
      'موبايل', 'جوال', 'تليفون', 'هاتف',
      'wallet', 'Wallet', 'WALLET',
      'محفظة', 'المحفظة',
      'number', 'Number', 'NUMBER',
      'رقم'
    ];

    return columns.find(column => 
      accountKeywords.includes(column) || 
      accountKeywords.some(keyword => 
        column.toLowerCase().includes(keyword.toLowerCase())
      )
    ) || null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, string | number>[];
        setExcelData(jsonData.map(row => {
          const keys = Object.keys(row);
          const accountColumn = findAccountColumn(keys);
          const accountNameColumn = findAccountNameColumn(keys);
          
          return {
            accountNumber: accountColumn ? String(row[accountColumn] || '') : '',
            accountName: accountNameColumn ? String(row[accountNameColumn] || '') : ''
          };
        }));

        // قائمة بالكلمات المحتملة للمبلغ
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

        // البحث عن العمود المناسب
        let amountColumnName = '';
        const firstRow = jsonData[0] as any;
        if (firstRow) {
          const columns = Object.keys(firstRow);
          amountColumnName = columns.find(column => 
            possibleAmountColumns.includes(column) || 
            possibleAmountColumns.some(possible => 
              column.toLowerCase().includes(possible.toLowerCase())
            )
          ) || columns[0];

          // البحث عن عمود الحساب واسم صاحب الحساب
          const accountColumnName = findAccountColumn(columns);
          const accountNameColumnName = findAccountNameColumn(columns);
          
          // استخراج القيم مع معلومات الحساب
          const amountValues = jsonData
            .map(row => {
              const value = (row as any)[amountColumnName];
              const accountNumber = accountColumnName ? String((row as any)[accountColumnName] || '') : '';
              const accountName = accountNameColumnName ? String((row as any)[accountNameColumnName] || '') : '';
              
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

          if (amountValues.length > 0) {
            setAmounts(amountValues.map(item => item.amount.toString()).join('\n'));
            setExcelData(amountValues);
          } else {
            alert('لم يتم العثور على قيم صحيحة في الملف. تأكد من أن الملف يحتوي على عمود للمبالغ.');
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  // حساب العمولة للمبلغ الواحد
  const calculateCommission = (amount: number): { amount: number; commission: number } => {
    // حساب العمولة بالنسبة المئوية
    let commission = amount * (Number(percentage) / 100);
    
    // تطبيق الحد الأدنى والأقصى على العمولة النسبية فقط
    if (minAmount && commission < Number(minAmount)) {
      commission = Number(minAmount);
    }
    if (maxAmount && commission > Number(maxAmount)) {
      commission = Number(maxAmount);
    }

    // إضافة المبلغ الثابت بعد تطبيق الحدود
    if (fixedAmount) {
      commission += Number(fixedAmount);
    }

    return {
      amount,
      commission
    };
  };

  // حساب العمولة للقائمة
  const calculateCommissions = useCallback(() => {
    const lines = amounts.split('\n').filter(line => line.trim());
    const calculatedResults = lines.map((line, index) => {
      const amount = parseFloat(line);
      if (isNaN(amount)) return null;

      const result = calculateCommission(amount);
      const currentExcelData = excelData[index] as ExcelDataItem | undefined;

      return {
        amount: result.amount,
        commission: result.commission,
        accountNumber: currentExcelData?.accountNumber || '',
        accountName: currentExcelData?.accountName || ''
      };
    }).filter((result): result is ResultItem => result !== null);

    setResults(calculatedResults);
  }, [amounts, percentage, minAmount, maxAmount, fixedAmount, excelData]);

  // Calculate commission whenever any input changes
  useEffect(() => {
    if (amounts.trim()) {
      calculateCommissions();
    }
  }, [amounts, calculateCommissions]);

  // دالة للتمرير إلى النتيجة في قائمة النتائج
  const scrollToResult = useCallback((amount: number) => {
    const resultElement = document.querySelector(`[data-amount="${amount}"]`);
    const resultsContainer = document.querySelector('.results-container');
    if (resultElement && resultsContainer) {
      const containerRect = resultsContainer.getBoundingClientRect();
      const elementRect = resultElement.getBoundingClientRect();
      
      // حساب موقع التمرير المطلوب
      const scrollTop = resultsContainer.scrollTop + (elementRect.top - containerRect.top) - (containerRect.height / 2) + (elementRect.height / 2);
      
      // تمرير محتوى مربع النتائج فقط
      resultsContainer.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // دالة للتمرير إلى المبلغ في مربع الإدخال

  // معالج النقر على النتيجة
  const handleResultClick = useCallback((result: ResultItem) => {
    setSelectedResult(result);
    setShowModal(true);
    setSelectedAmount(result.amount);
  }, []);

  // معالج تحديد النص في مربع الإدخال
  const handleTextareaSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selectedText = target.value.substring(target.selectionStart, target.selectionEnd);
    const amount = parseFloat(selectedText.trim());
    if (!isNaN(amount)) {
      setSelectedAmount(amount);
      scrollToResult(amount);
    }
  }, [scrollToResult]);

  // دالة البحث الموحدة

  // تصفية النتائج حسب البحث
  const filteredResults = useMemo(() => {
    if (!searchQuery) return results;
    return results.filter(result => 
      result.amount.toString().includes(searchQuery) ||
      result.commission.toString().includes(searchQuery) ||
      (result.accountNumber && result.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (result.accountName && result.accountName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [results, searchQuery]);

  // حساب الإجماليات
  const totals = useMemo(() => {
    return results.reduce((acc, result) => ({
      totalAmount: acc.totalAmount + result.amount,
      totalCommission: acc.totalCommission + result.commission
    }), { totalAmount: 0, totalCommission: 0 });
  }, [results]);

  // دالة مسح الأرقام
  const handleClearAmounts = () => {
    setAmounts('');
    setResults([]);
    setExcelData([]);
  };

  const handleExportToExcel = () => {
    if (results.length === 0) return;

    const workbook = XLSX.utils.book_new();
    
    // تحديد عناوين الأعمدة
    const headers = [
      t('accountNumber'),
      t('accountName'),
      t('amount'),
      t('commission'),
    ];

    // تحويل البيانات إلى مصفوفة
    const data = results.map(item => [
      item.accountNumber,
      item.accountName,
      item.amount,
      item.commission,
    ]);

    // إضافة صف المجموع
    const totalRow = [
      t('total'),
      '',
      results.reduce((sum, item) => sum + item.amount, 0),
      results.reduce((sum, item) => sum + item.commission, 0),
    ];

    // دمج البيانات
    const wsData = [headers, ...data, totalRow];

    // إنشاء ورقة العمل
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // تنسيق العناوين
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4A5568" } },
      alignment: { horizontal: "center" },
    };

    // تنسيق الخلايا العددية
    const numberStyle = {
      alignment: { horizontal: "left" },
      numFmt: "#,##0.00",
    };

    // تنسيق صف المجموع
    const totalStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E2E8F0" } },
      alignment: { horizontal: "left" },
      numFmt: "#,##0.00",
    };

    // تطبيق التنسيقات
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:D1');
    
    // تنسيق العناوين
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      worksheet[address].s = headerStyle;
    }

    // تنسيق الأرقام في الأعمدة C و D (المبالغ والعمولات)
    for (let R = 1; R <= range.e.r - 1; ++R) {
      ['C', 'D'].forEach(col => {
        const address = col + (R + 1);
        if (worksheet[address]) {
          worksheet[address].s = numberStyle;
        }
      });
    }

    // تنسيق صف المجموع
    const lastRow = range.e.r + 1;
    ['A', 'B', 'C', 'D'].forEach(col => {
      const address = col + lastRow;
      if (worksheet[address]) {
        worksheet[address].s = totalStyle;
      }
    });

    // تعيين عرض الأعمدة
    const colWidths = [
      { wch: 15 }, // رقم الحساب
      { wch: 25 }, // اسم الحساب
      { wch: 15 }, // المبلغ
      { wch: 15 }, // العمولة
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, t('results'));
    
    // تحديد اسم الملف بناءً على التاريخ الحالي
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-SA').replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('ar-SA').replace(/:/g, '-');
    const fileName = `${t('results')}_${dateStr}_${timeStr}.xlsx`;

    XLSX.writeFile(workbook, fileName);
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
          {/* مربع البحث الموحد */}
          <div className="col-span-2">
            <div dir="rtl" className="relative max-w-4xl mx-auto flex gap-4 items-center mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="min-w-[160px] whitespace-nowrap bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg border border-transparent shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-150 ease-in-out dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800"
                type="button"
              >
                استيراد من ملف Excel
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن المبلغ، العمولة، رقم الحساب، أو اسم صاحب الحساب..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={handleClearAmounts}
                className="min-w-[160px] whitespace-nowrap bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-lg border border-transparent shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150 ease-in-out dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
                type="button"
              >
                مسح الأرقام
              </button>
            </div>
          </div>

          {/* عمود الإدخال */}
          <div className="col-span-1">
            <textarea
              ref={textareaRef}
              value={amounts}
              onChange={(e) => {
                setAmounts(e.target.value);
                setSelectedAmount(null);
              }}
              onSelect={handleTextareaSelect}
              className="w-full p-4 border rounded-xl h-[400px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                bg-white border-gray-200 transition-colors"
              placeholder={t('commission.amountsPlaceholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* عمود النتائج */}
          {results.length > 0 && (
            <div className="col-span-1">
              <div className="bg-blue-50 rounded-xl p-4 divide-y divide-blue-100 h-[400px] overflow-y-auto results-container">
                {filteredResults.map((result, index) => (
                  <div 
                    key={index}
                    data-amount={result.amount}
                    className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-sm cursor-pointer transition-colors duration-150 ease-in-out"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="font-extrabold text-gray-900 dark:text-white">المبلغ&nbsp;&nbsp;: </span>
                          {result.amount.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="font-extrabold text-gray-900 dark:text-white">العمولة&nbsp;&nbsp;: </span>
                          <span className="text-green-600 dark:text-green-400">{result.commission.toFixed(2)}</span>
                        </div>
                      </div>
                      {(result.accountNumber || result.accountName) && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {result.accountNumber && (
                            <div>رقم الحساب: {result.accountNumber}</div>
                          )}
                          {result.accountName && (
                            <div>اسم صاحب الحساب: {result.accountName}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* إجماليات */}
        <div className="grid grid-cols-2 gap-4 mb-6" dir="rtl">
          <div className="bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-800">
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-300 text-lg mb-2 font-bold">إجمالي المبالغ</div>
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-500">
                {totals.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="bg-green-50/50 dark:bg-green-900/20 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-800">
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-300 text-lg mb-2 font-bold">إجمالي العمولات</div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-500">
                {totals.totalCommission.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* زر تصدير Excel */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <FileDown className="w-5 h-5" />
            {t('exportToExcel')}
          </button>
        </div>

        {/* زر المصمم */}
        <div className="text-center mb-4">
          <a 
            href="https://wa.me/+201015415601" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-bold"
          >
            تواصل مع المطور
          </a>
        </div>

        {/* المربع المنبثق */}
        {showModal && selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* الخلفية الضبابية */}
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            
            {/* المربع */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
              {/* الجزء العلوي - بيانات التحويلة */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-4">بيانات التحويلة</h3>
                  <div className="text-4xl font-bold mb-3 flex flex-col items-center gap-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      {percentage && (
                        <span>نسبة العمولة {percentage}%</span>
                      )}
                      {fixedAmount && (
                        <span>
                          {percentage && " + "}
                          المبلغ الثابت {fixedAmount}
                        </span>
                      )}
                      {minAmount && (
                        <span>
                          {(percentage || fixedAmount) && " + "}
                          الحد الأدنى {minAmount}
                        </span>
                      )}
                      {maxAmount && (
                        <span>
                          {(percentage || fixedAmount || minAmount) && " + "}
                          الحد الأقصى {maxAmount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-white/90 space-y-1">
                    <div className="flex flex-wrap justify-center gap-4">
                      {percentage && (
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 p-1 rounded-full">✓</span>
                          <span>النسبة المئوية</span>
                        </div>
                      )}
                      {fixedAmount && (
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 p-1 rounded-full">✓</span>
                          <span>المبلغ الثابت</span>
                        </div>
                      )}
                      {minAmount && (
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 p-1 rounded-full">✓</span>
                          <span>الحد الأدنى</span>
                        </div>
                      )}
                      {maxAmount && (
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 p-1 rounded-full">✓</span>
                          <span>الحد الأقصى</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* الجزء السفلي - التفاصيل */}
              <div className="p-8 space-y-6">
                {/* المبلغ والعمولة */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-gray-600 dark:text-gray-400 mb-2">المبلغ</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{selectedResult.amount.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-gray-600 dark:text-gray-400 mb-2">العمولة</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedResult.commission.toFixed(2)}</div>
                  </div>
                </div>

                {/* معلومات الحساب */}
                {(selectedResult.accountNumber || selectedResult.accountName) && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">معلومات الحساب</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">رقم الحساب:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{selectedResult.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">اسم صاحب الحساب:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{selectedResult.accountName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* زر الإغلاق */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;