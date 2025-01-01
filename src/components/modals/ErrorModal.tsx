import { useLanguage } from '../../hooks/useLanguage';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isRTL ? 'تنبيه' : 'Alert'}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {message}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            {isRTL ? 'موافق' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
