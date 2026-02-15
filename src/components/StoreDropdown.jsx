import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export default function StoreDropdown({ stores, loadingStores, selectStore, closeDropdown }) {
    const dropdownRef = useRef();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeDropdown]);

    return (
        <div
            ref={dropdownRef}
            className="absolute top-28 left-5 right-5 bg-[#0F172A]  border border-white/20 rounded-xl p-3 z-50 max-h-96 overflow-y-auto shadow-lg"
        >
            {loadingStores && (
                <p className="text-center text-sm text-gray-300">Loading stores...</p>
            )}

            {!loadingStores && stores.map((store) => (
                <div
                    key={store.id}
                    onClick={() => selectStore(store)}
                    className="p-3 rounded-lg hover:bg-white/20 cursor-pointer transition"
                >
                    <p className="text-white text-sm font-medium">{store.name}</p>
                    <p className="text-xs text-gray-400">{store.location}</p>
                </div>
            ))}
        </div>
    );
}
