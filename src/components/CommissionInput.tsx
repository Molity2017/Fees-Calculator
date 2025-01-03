interface CommissionInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  active: boolean;
  onActiveChange: (active: boolean) => void;
  placeholder: string;
  symbol?: string;
}

export function CommissionInput({
  label,
  value,
  onChange,
  active,
  onActiveChange,
  placeholder,
  symbol
}: CommissionInputProps) {
  return (
    <div className="p-2.5 rounded-xl shadow-md transition-colors duration-200 dark:bg-gray-800 bg-white">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-sm sm:text-lg font-bold dark:text-gray-200 text-gray-700 mb-2 text-right">
          {label}
          {symbol && (
            <span className="text-gray-500 dark:text-gray-400 mr-1 inline-flex items-center justify-center text-sm sm:text-lg font-normal dark:bg-gray-700 bg-gray-100 rounded-full w-6 h-6 sm:w-7 sm:h-7">
              {symbol}
            </span>
          )}
        </div>
        <input
          type="checkbox"
          className="w-4 h-7 accent-blue-500 dark:accent-blue-400"
          checked={active}
          onChange={(e) => {
            const newActive = e.target.checked;
            onActiveChange(newActive);
            if (!newActive) {
              onChange('');
            }
          }}
        />
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          if (active) {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        disabled={!active}
        className={`w-full p-2 rounded-lg border transition-colors duration-200
          ${active 
            ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white border-gray-300 text-gray-900' 
            : 'dark:bg-gray-900 dark:border-gray-700 dark:text-gray-500 bg-gray-100 border-gray-200 text-gray-400'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        `}
      />
    </div>
  );
}
