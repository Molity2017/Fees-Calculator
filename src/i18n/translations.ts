export const translations = {
  ar: {
    title: 'حاسبة العمولات',
    subtitle: 'احسب عمولاتك بكل سهولة',
    language: 'English',
    darkMode: {
      light: 'الوضع الليلي',
      dark: 'الوضع النهاري'
    },
    commission: {
      title: 'حاسبة العمولات',
      percentage: 'النسبة المئوية',
      fixedAmount: 'المبلغ الثابت',
      minAmount: 'الحد الأدنى',
      maxAmount: 'الحد الأقصى',
      amounts: 'المبالغ (مبلغ لكل سطر)',
      amountsPlaceholder: 'أدخل المبالغ هنا\nمثال:\n1000\n2000\n3000',
      results: 'النتائج:',
      amount: 'المبلغ',
      commission: 'العمولة',
      importExcel: 'استيراد من Excel',
      clearAmounts: 'مسح المبالغ',
      searchPlaceholder: 'ابحث بالمبلغ، العمولة، رقم الحساب، أو اسم صاحب الحساب...',
      totalAmount: 'إجمالي المبالغ',
      totalCommission: 'إجمالي العمولات',
      accountNumber: 'رقم الحساب',
      accountName: 'اسم صاحب الحساب',
      accountInfo: 'معلومات الحساب',
      exportToExcel: 'تصدير لملف Excel',
      exportToPDF: 'تصدير لملف PDF',
      noResults: 'لا توجد نتائج',
      darkMode: 'الوضع الليلي',
      language: 'اللغة',
      developer: 'تواصل مع المطور',
      total: 'المجموع',
      calculate: 'احسب',
      clear: 'مسح'
    },
    modals: {
      pdfSettings: {
        title: 'إعدادات تصدير PDF',
        companyName: 'اسم الشركة',
        companyNamePlaceholder: 'أدخل اسم الشركة',
        companyLogo: 'شعار الشركة',
        removeLogo: 'إزالة الشعار',
        export: 'تصدير',
        cancel: 'إلغاء'
      },
      results: {
        title: 'تفاصيل النتيجة',
        close: 'إغلاق'
      }
    },
    alerts: {
      noValidAmounts: 'لا توجد قيم صحيحة في الملف. تأكد من أن الملف يحتوي على عمود للمبالغ.',
      invalidFile: 'الملف غير صالح. يرجى اختيار ملف Excel صحيح.',
      success: 'تم بنجاح',
      error: 'حدث خطأ'
    },
    buttons: {
      upload: 'رفع ملف',
      download: 'تحميل',
      close: 'إغلاق',
      save: 'حفظ',
      cancel: 'إلغاء'
    },
    errors: {
      invalidInputs: 'يوجد خطأ في المدخلات. تأكد من:\n- المبالغ موجبة\n- النسبة المئوية بين 0 و 100\n- المبالغ الثابتة موجبة\n- الحد الأدنى أقل من الحد الأقصى',
      negativeAmount: 'المبلغ لا يمكن أن يكون سالباً',
      invalidPercentage: 'النسبة المئوية يجب أن تكون بين 0 و 100',
      invalidFixedAmount: 'المبلغ الثابت يجب أن يكون موجباً',
      invalidMinAmount: 'الحد الأدنى يجب أن يكون موجباً',
      invalidMaxAmount: 'الحد الأقصى يجب أن يكون موجباً',
      minGreaterThanMax: 'الحد الأدنى لا يمكن أن يكون أكبر من الحد الأقصى'
    }
  },
  en: {
    title: 'Commission Calculator',
    subtitle: 'Calculate your commissions easily',
    language: 'العربية',
    darkMode: {
      light: 'Dark Mode',
      dark: 'Light Mode'
    },
    commission: {
      title: 'Commission Calculator',
      percentage: 'Percentage (%)',
      fixedAmount: 'Fixed Amount',
      minAmount: 'Min Amount',
      maxAmount: 'Max Amount',
      amounts: 'Amounts (one per line)',
      amountsPlaceholder: 'Enter amounts here\nExample:\n1000\n2000\n3000',
      results: 'Results:',
      amount: 'Amount',
      commission: 'Commission',
      importExcel: 'Import from Excel',
      clearAmounts: 'Clear Amounts',
      searchPlaceholder: 'Search by amount, commission, account number, or account name...',
      totalAmount: 'Total Amounts',
      totalCommission: 'Total Commissions',
      accountNumber: 'Account Number',
      accountName: 'Account Holder',
      accountInfo: 'Account Info',
      exportToExcel: 'Export to Excel',
      exportToPDF: 'Export to PDF',
      noResults: 'No Results Found',
      darkMode: 'Dark Mode',
      language: 'Language',
      developer: 'Contact Developer',
      total: 'Total',
      calculate: 'Calculate',
      clear: 'Clear'
    },
    modals: {
      pdfSettings: {
        title: 'PDF Export Settings',
        companyName: 'Company Name',
        companyNamePlaceholder: 'Enter company name',
        companyLogo: 'Company Logo',
        removeLogo: 'Remove Logo',
        export: 'Export',
        cancel: 'Cancel'
      },
      results: {
        title: 'Result Details',
        close: 'Close'
      }
    },
    alerts: {
      noValidAmounts: 'No valid amounts found in file. Make sure the file contains an amount column.',
      invalidFile: 'Invalid file. Please select a valid Excel file.',
      success: 'Success',
      error: 'Error'
    },
    buttons: {
      upload: 'Upload File',
      download: 'Download',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel'
    },
    errors: {
      invalidInputs: 'Invalid inputs. Please check:\n- Amounts are positive\n- Percentage is between 0 and 100\n- Fixed amounts are positive\n- Minimum is less than maximum',
      negativeAmount: 'Amount cannot be negative',
      invalidPercentage: 'Percentage must be between 0 and 100',
      invalidFixedAmount: 'Fixed amount must be positive',
      invalidMinAmount: 'Minimum amount must be positive',
      invalidMaxAmount: 'Maximum amount must be positive',
      minGreaterThanMax: 'Minimum amount cannot be greater than maximum amount'
    }
  }
};