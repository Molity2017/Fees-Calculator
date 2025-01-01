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
    <div className="bg-white p-2.5 rounded-xl shadow-md">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-sm sm:text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 text-right">
          {label}
          {symbol && (
            <span className="text-gray-500 mr-1 inline-flex items-center justify-center text-sm sm:text-lg font-normal bg-gray-100 rounded-full w-6 h-6 sm:w-7 sm:h-7">
              {symbol}
            </span>
          )}
        </div>
        <input
          type="checkbox"
          className="w-4 h-7 accent-blue-500"
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
        disabled={!active}
        className="w-full h-8 px-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}
