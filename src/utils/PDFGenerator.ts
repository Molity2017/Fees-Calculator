import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFSettings, ResultItem } from '../types/types';
import { formatPDFNumber } from './formatNumber';

interface GeneratePDFParams {
  results: ResultItem[];
  totals: {
    totalAmount: number;
    totalCommission: number;
  };
  settings: PDFSettings;
}

export function generatePDF({ results, totals, settings }: GeneratePDFParams): string {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 5;

  try {
    // الحالة الأولى: إضافة اسم الشركة والشعار معاً
    // يتم عرض الشعار على اليمين مع اسم الشركة بجانبه وخط تحته ثم العنوان الفرعي
    if (settings.companyLogo && settings.companyName) {
      // أبعاد الشعار
      const logoWidth = 25;   // عرض الشعار
      const logoHeight = 22;  // ارتفاع الشعار
      const logoMarginTop = 15;  // المسافة من أعلى للشعار فقط
      const companyName = settings.companyName;
      // حساب العرض الكلي (الشعار + مسافة + النص) لوضعه في المنتصف
      const totalWidth = logoWidth + 1 + doc.getTextWidth(companyName);
      const startX = (pageWidth - totalWidth) / 2;

      // إضافة الشعار في أقصى اليمين من المنطقة المحسوبة
      doc.addImage(settings.companyLogo as string, 'PNG', startX, logoMarginTop, logoWidth, logoHeight);

      // حساب موضع بداية النص (بعد الشعار مباشرة)
      const textX = startX + logoWidth + 1;

      // كتابة اسم الشركة بخط عريض وحجم 16
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text(companyName, textX, logoMarginTop + 8);

      // إضافة خط تحت اسم الشركة للتأكيد عليه
      const titleWidth = doc.getTextWidth(companyName);
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.6);
      doc.line(textX, logoMarginTop + 12, textX + titleWidth, logoMarginTop + 12);

      // إضافة العنوان الفرعي بخط عادي وحجم أصغر
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('Final Data Report with Commissions', textX, logoMarginTop + 18.5);
    }
    // الحالة الثانية: إضافة الشعار فقط
    // يتم عرض الشعار في المنتصف ثم العنوان الفرعي تحته
    else if (settings.companyLogo) {
      // إضافة الشعار في منتصف الصفحة بحجم أصغر من الحالة الأولى
      const logoSize = 25;  // حجم ثابت للشعار
      const logoX = (pageWidth - logoSize) / 2;  // حساب نقطة البداية لتوسيط الشعار
      doc.addImage(settings.companyLogo as string, 'PNG', logoX, margin, logoSize, logoSize);

      // إضافة العنوان الفرعي تحت الشعار مباشرة بخط عادي
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      const subtitle = 'Final Data Report with Commissions';
      const subtitleWidth = doc.getTextWidth(subtitle);
      doc.text(subtitle, (pageWidth - subtitleWidth) / 2, margin + 28);
    }
    // الحالة الثالثة: إضافة اسم الشركة فقط
    // يتم عرض اسم الشركة في المنتصف مع خط تحته ثم العنوان الفرعي
    else if (settings.companyName) {
      // كتابة اسم الشركة في المنتصف بخط عريض
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      const companyName = settings.companyName;
      const companyNameWidth = doc.getTextWidth(companyName);
      const companyNameX = (pageWidth - companyNameWidth) / 2;  // حساب نقطة البداية لتوسيط النص
      doc.text(companyName, companyNameX, margin + 15);

      // إضافة خط تحت اسم الشركة للتأكيد عليه
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.6);
      doc.line(companyNameX, margin + 19, companyNameX + companyNameWidth, margin + 19);

      // إضافة العنوان الفرعي تحت اسم الشركة بخط عادي
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      const subtitle = 'Final Data Report with Commissions';
      const subtitleWidth = doc.getTextWidth(subtitle);
      doc.text(subtitle, (pageWidth - subtitleWidth) / 2, margin + 27);
    }
    // الحالة الرابعة: بدون اسم شركة أو شعار
    // يتم عرض العنوان الفرعي فقط في المنتصف
    else {
      // إضافة العنوان الفرعي فقط بخط عريض وحجم 16
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      const subtitle = 'Final Data Report with Commissions';
      const subtitleWidth = doc.getTextWidth(subtitle);
      doc.text(subtitle, (pageWidth - subtitleWidth) / 2, margin + 13);

      // إضافة خط تحت العنوان
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.6);
      doc.line((pageWidth - subtitleWidth) / 2, margin + 16, (pageWidth - subtitleWidth) / 2 + subtitleWidth, margin + 16);
    }

    // تحديد موضع بداية الجدول بناءً على الحالة
    // في حالة وجود شعار أو اسم شركة نزيد المسافة لإعطاء مساحة أكبر
    const tableStartY = settings.companyName || settings.companyLogo ? margin + 40 : margin + 30;
    const totalAmount = totals.totalAmount;
    const totalCommission = totals.totalCommission;
    const grandTotal = totalAmount + totalCommission;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);

    const y = tableStartY - 3;
    const transfersText = `Number of Transfers: ${results.length}`;
    const totalText = `Total Amount & Commission: ${formatPDFNumber(grandTotal)}`;

    doc.text(transfersText, margin + 10, y);
    doc.text(totalText, (pageWidth - doc.getTextWidth(totalText)) / 2, y);

    // حساب العرض الكلي للجدول
    const totalTableWidth = 11 + 63 + 63 + 24 + 20; // مجموع عرض كل الأعمدة
    // حساب الهامش المطلوب لتوسيط الجدول
    const sideMargin = (pageWidth - totalTableWidth) / 2;

    (doc as any).autoTable({
      head: [[
        { content: 'ID', styles: { halign: 'center', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
        { content: 'Account Number', styles: { halign: 'center', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
        { content: 'Account Name', styles: { halign: 'center', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
        { content: 'Amount', styles: { halign: 'left', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
        { content: 'Fees', styles: { halign: 'left', fillColor: [44, 62, 80], textColor: [255, 255, 255] } }
      ]],
      body: results.map((item, index) => [
        { content: (index + 1).toString(), styles: { halign: 'center' } },
        { content: item.accountNumber, styles: { halign: 'left' } },
        { content: item.accountName, styles: { halign: 'left' } },
        { content: formatPDFNumber(item.amount), styles: { halign: 'left' } },
        { content: formatPDFNumber(item.commission), styles: { halign: 'left' } },
      ]),
      foot: [[
        { content: 'Total', colSpan: 3, styles: { halign: 'left', fontStyle: 'bold', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
        { content: formatPDFNumber(totalAmount), styles: { halign: 'left', fontStyle: 'bold', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
        { content: formatPDFNumber(totalCommission), styles: { halign: 'left', fontStyle: 'bold', fillColor: [44, 62, 80], textColor: [255, 255, 255] } },
      ]],
      startY: tableStartY,
      margin: { left: sideMargin, right: sideMargin },
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 2,
        overflow: 'linebreak',
        lineWidth: 0.1,
        minCellHeight: 4,
        lineColor: [44, 62, 80]
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        cellPadding: 2,
        lineWidth: 0.2,
        valign: 'middle',
        minCellHeight: 5
      },
      bodyStyles: {
        minCellHeight: 3,
        cellPadding: 1,
        fillColor: false
      },
      columnStyles: {
        0: { cellWidth: 11 },
        1: { cellWidth: 63 },
        2: { cellWidth: 63 },
        3: { cellWidth: 24 },
        4: { cellWidth: 20 }
      },
      showFoot: 'lastPage',
      pageBreak: 'auto',
      rowPageBreak: 'auto'
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      if (settings.companyLogo) {
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
        doc.addImage(settings.companyLogo as string, 'PNG', (pageWidth - 200) / 2, (pageHeight - 200) / 2, 200, 200);
        doc.restoreGraphicsState();
      }

      if (i === 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(44, 62, 80);
        const pagesText = `Pages: ${pageCount}`;
        doc.text(pagesText, pageWidth - margin - 10 - doc.getTextWidth(pagesText), y);
      }

      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - margin, { align: 'right' });
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-SA').replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('ar-SA').replace(/:/g, '-');
    const fileName = `Results_${dateStr}_${timeStr}.pdf`;

    doc.save(fileName);
    return fileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
