import { useLanguage } from '../hooks/useLanguage';

export function DeveloperButton() {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center mt-4">
      <a
        href="https://wa.me/+201015415601"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-md hover:from-green-600 hover:to-emerald-600 transition-all inline-block"
      >
        {t('commission.developer')}
      </a>
    </div>
  );
}
