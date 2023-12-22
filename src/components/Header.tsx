import { useLanguage } from '../hooks/useLanguage';

export function Header() {
  const { language } = useLanguage();
  
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-24 h-24">
          <img src="/logo.png" alt="Fees Calculator" className="w-full h-full object-contain" />
        </div>
        <div className="text-right">
          <h1 className={`text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 bg-clip-text text-transparent mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'حاسبة العمولات' : 'Fees Calculator'}
          </h1>
          <p className={`text-lg text-gray-600 dark:text-gray-300 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'احسب عمولاتك بكل سهولة ويسر' : 'Calculate your fees easily'}
          </p>
        </div>
      </div>
    </div>
  );
}