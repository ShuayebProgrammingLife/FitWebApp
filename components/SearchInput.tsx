import { SearchIcon } from "./Icons";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export default function SearchInput({ value, onChange, placeholder, label }: Props) {
  return (
    <label className="relative block w-full sm:w-64">
      <span className="sr-only">{label}</span>
      <SearchIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted2" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[9px] border border-[#232732] bg-[#13161d] py-2 pl-9 pr-3 text-xs text-white placeholder:text-muted2"
      />
    </label>
  );
}