import { Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ControlsProps {
  darkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

export function Controls({ darkMode, onDarkModeChange }: ControlsProps) {
  const { t, toggleLanguage } = useLanguage();

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
      >
        <Languages className="w-5 h-5" />
        {t('language')}
      </button>

      <button
        onClick={() => onDarkModeChange(!darkMode)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        {t(`darkMode.${darkMode ? 'dark' : 'light'}`)}
      </button>
    </div>
  );
}