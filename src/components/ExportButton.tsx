import { useLanguage } from '../hooks/useLanguage';

interface ExportButtonProps {
  onClick: () => void;
}

export function ExportButton({ onClick }: ExportButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl 
                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200
                font-medium text-lg flex items-center gap-2 mx-auto"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {t('commission.exportToPDF')}
    </button>
  );
}
