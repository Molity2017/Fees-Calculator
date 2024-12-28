import { useState } from 'react';
import { PDFSettings } from '../../types/types';
import { useLanguage } from '../../hooks/useLanguage';

interface PDFSettingsModalProps {
  initialSettings: PDFSettings;
  onExport: (settings: PDFSettings) => void;
  onClose: () => void;
}

export function PDFSettingsModal({ initialSettings, onExport, onClose }: PDFSettingsModalProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [tempSettings, setTempSettings] = useState(initialSettings);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempSettings(prev => ({
          ...prev,
          companyLogo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    onExport(tempSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
          <h2 className="text-xl font-medium text-white text-center">
            {t('modals.pdfSettings.title')}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('modals.pdfSettings.companyName')}
            </label>
            <input
              type="text"
              value={tempSettings.companyName}
              onChange={e => setTempSettings(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder={t('modals.pdfSettings.companyNamePlaceholder')}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('modals.pdfSettings.companyLogo')}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl">
              <div className="space-y-1 text-center">
                {tempSettings.companyLogo ? (
                  <div className="space-y-4">
                    <img 
                      src={tempSettings.companyLogo} 
                      alt="Company Logo Preview" 
                      className="mx-auto h-24 w-auto object-contain"
                    />
                    <button
                      onClick={() => setTempSettings(prev => ({ ...prev, companyLogo: null }))}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      {t('modals.pdfSettings.removeLogo')}
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                      >
                        <span>{t('modals.pdfSettings.companyLogo')}</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 
                     rounded-xl transition-colors duration-200"
          >
            {t('modals.pdfSettings.cancel')}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {t('modals.pdfSettings.export')}
          </button>
        </div>
      </div>
    </div>
  );
}
