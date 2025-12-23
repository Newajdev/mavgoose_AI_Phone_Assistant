import { useEffect, useRef, useState } from "react";

export default function DropDown({ options, value, onChange, placeholder = "Select option", className, }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative w-48 ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full px-4 py-2
          bg-[#0F172B80]
          border-2 border-[#2B7FFF33]
          rounded-xl
          text-white
          flex items-center justify-between
          focus:outline-none
        "
        aria-expanded={open}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute z-20 mt-2 w-full
          rounded-xl overflow-hidden
          bg-[#0F172B]
          border border-[#2B7FFF33]
          transform transition-all duration-200 ease-out
          ${open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}
        `}
      >
        {options.map((opt, index) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange?.(opt.value);
              setOpen(false);
            }}
            className="
              w-full px-4 py-2 text-left
              text-white
              hover:bg-[#2B7FFF33]
              transition-colors
            "
            style={{ transitionDelay: `${index * 40}ms` }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
