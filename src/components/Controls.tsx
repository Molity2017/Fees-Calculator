import { Moon } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ControlsProps {
  darkMode: boolean;
  onDarkModeChange: (isDark: boolean) => void;
}

export default function Controls({ 
  darkMode, 
  onDarkModeChange,
}: ControlsProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => onDarkModeChange(!darkMode)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden group"
          aria-label="Toggle dark mode"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 border border-blue-200/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105" />
          <span className="relative transition-transform duration-300 group-hover:rotate-[30deg]">
            <Moon className="w-4 h-4" />
          </span>
        </button>

        <div className="w-px h-5 bg-gradient-to-b from-transparent via-gray-200/20 to-transparent" />

        <button
          onClick={toggleLanguage}
          className="relative min-w-[5rem] px-5 py-2 rounded-full overflow-hidden group"
          aria-label="Toggle language"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 border border-blue-200/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105" />
          <span className="relative inline-block text-sm font-medium transition-transform duration-300 group-hover:scale-110">
            {language === 'ar' ? 'English' : 'عربي'}
          </span>
        </button>
      </div>
    </div>
  );
}