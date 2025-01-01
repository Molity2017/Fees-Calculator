export const formatNumber = (value: number): string => {
  // تنسيق الرقم بالأرقام الإنجليزية
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  // إذا كانت كل الأرقام بعد العلامة العشرية أصفاراً، نحذف العلامة العشرية والأصفار
  const [whole, fraction] = formattedNumber.split('.');
  if (fraction && parseInt(fraction) === 0) {
    return whole;
  }

  return formattedNumber;
};

// دالة خاصة لتنسيق الأرقام في ملف PDF
export const formatPDFNumber = (value: number): string => {
  // تنسيق الرقم بالأرقام الإنجليزية
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  // إذا كانت كل الأرقام بعد العلامة العشرية أصفاراً، نحذف العلامة العشرية والأصفار
  const [whole, fraction] = formattedNumber.split('.');
  if (!fraction || parseInt(fraction) === 0) {
    return whole;
  }

  // إذا كان هناك رقمين بعد العلامة العشرية وكلاهما صفر، نحذفهما
  if (fraction.length === 2 && fraction === '00') {
    return whole;
  }

  return formattedNumber;
};