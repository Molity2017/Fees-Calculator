interface CommissionInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  active: boolean;
  onActiveChange: (active: boolean) => void;
  placeholder: string;
}

export function CommissionInput({
  label,
  value,
  onChange,
  active,
  onActiveChange,
  placeholder
}: CommissionInputProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 text-right">{label}</div>
        <input
          type="checkbox"
          className="w-4 h-4 accent-blue-500"
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
        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}
