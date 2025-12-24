import React from 'react';
import { Icon } from '@iconify/react';

export default function InputField({ label, icon, placeholder, type = "text", register, name, error, ...props }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-white text-sm font-medium opacity-80">{label}</label>}
            <div className={`relative flex items-center bg-[#0F172B60] border-2 rounded-xl transition-all ${error ? 'border-[#FF205633] focus-within:border-[#FF2056]' : 'border-[#2B7FFF15] focus-within:border-[#2B7FFF]'
                }`}>
                <div className="pl-4 text-[#90A1B9]">
                    <Icon icon={icon} width={20} />
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none text-white px-3 py-3.5 focus:outline-none placeholder-[#90A1B9] text-sm"
                    {...(register ? register(name) : {})}
                    {...props}
                />
            </div>
            {error && <p className="text-[#FF2056] text-xs mt-1">{error.message}</p>}
        </div>
    );
}
