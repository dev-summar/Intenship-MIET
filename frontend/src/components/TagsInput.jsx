import { useState, useCallback } from 'react';

export function TagsInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('');

  const tags = Array.isArray(value) ? value : [];

  const addTag = useCallback(
    (tag) => {
      const t = tag.trim();
      if (t && !tags.includes(t)) {
        onChange([...tags, t]);
      }
    },
    [tags, onChange]
  );

  const removeTag = useCallback(
    (index) => {
      onChange(tags.filter((_, i) => i !== index));
    },
    [tags, onChange]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) {
        addTag(input.trim());
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-0.5 text-sm text-primary-800"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="text-primary-600 hover:text-primary-800 ml-0.5"
            aria-label="Remove"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag(input.trim()) && setInput('')}
        placeholder={placeholder}
        className="min-w-[120px] flex-1 border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none"
      />
    </div>
  );
}
