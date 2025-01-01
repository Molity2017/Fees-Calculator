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
        className="w-full p-4 border rounded-xl h-[200px] sm:h-[400px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          bg-white border-gray-100 transition-colors"
        placeholder={placeholder}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
