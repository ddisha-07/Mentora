import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-700" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-line-soft rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-700 outline-none transition-colors focus:border-ember-500/50 focus:bg-white/[0.06]"
      />
    </div>
  );
}
