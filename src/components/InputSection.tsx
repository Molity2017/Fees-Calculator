import { RefObject } from 'react';

interface InputSectionProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
  onSelect: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  isRTL: boolean;
}

export function InputSection({
  textareaRef,
  value,
  onChange,
  onSelect,
  placeholder,
  isRTL
}: InputSectionProps) {
  return (
    <div className="col-span-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={onSelect}
        className="w-full p-4 rounded-xl h-[200px] sm:h-[400px] focus:ring-2 focus:ring-blue-500 
          dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400
          bg-gray-800/5 border border-gray-700/10 transition-colors duration-200
          focus:outline-none resize-none"
        placeholder={placeholder}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
