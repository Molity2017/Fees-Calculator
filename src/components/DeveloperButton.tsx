import { useLanguage } from '../hooks/useLanguage';

export function DeveloperButton() {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center mt-4">
      <a
        href="https://api.whatsapp.com/send/?phone=201015415601&text=Hello&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-md hover:from-green-600 hover:to-emerald-600 transition-all inline-block text-[10px] sm:text-sm"
      >
        {t('commission.developer')}
      </a>
    </div>
  );
}
