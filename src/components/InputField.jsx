import React from "react";
import { Icon } from "@iconify/react";

export default function InputField({
  label,
  icon,
  placeholder,
  type = "text",
  register,
  name,
  rules,
  error,
  value,
  disabled = false,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-white text-sm font-medium opacity-80">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center bg-[#0F172B60] border-2 rounded-xl transition-all
        ${
          error
            ? "border-[#FF205633] focus-within:border-[#FF2056]"
            : "border-[#2B7FFF15] focus-within:border-[#2B7FFF]"
        }`}
      >
        {icon && (
          <div className="pl-4 text-[#90A1B9]">
            <Icon icon={icon} width={20} />
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          className="w-full bg-transparent border-none text-white px-3 py-3.5 focus:outline-none placeholder-[#90A1B9] text-sm disabled:opacity-70"
          {...(register && name ? register(name, rules) : {})}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[#FF2056] text-xs mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
