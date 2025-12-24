import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function AddPriceModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        category: "",
        brand: "",
        model: "",
        repairType: "",
        price: "",
        status: "Active",
    });

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1D293D] border-2 border-[#2B7FFF33] rounded-2xl p-8 max-w-4xl w-full mx-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Category */}
                    <div>
                        <label className="text-white text-base font-medium mb-3 block">Category</label>
                        <div className="flex gap-3">
                            <div className="relative w-full">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-[#0F172B60] text-gray-400 border-none rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]"
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Laptop">Laptop</option>
                                </select>
                                <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={20} />
                            </div>
                            <button className="bg-black rounded-full p-3 hover:bg-gray-900 transition-colors shrink-0">
                                <Icon icon="mdi:plus" className="text-white" width={20} />
                            </button>
                        </div>
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="text-white text-base font-medium mb-3 block">Brand</label>
                        <div className="flex gap-3">
                            <div className="relative w-full">
                                <select
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full bg-[#0F172B60] text-gray-400 border-none rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]"
                                >
                                    <option value="" disabled>Select Brand</option>
                                    <option value="Apple">Apple</option>
                                    <option value="Samsung">Samsung</option>
                                    <option value="Google">Google</option>
                                </select>
                                <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={20} />
                            </div>
                            <button className="bg-black rounded-full p-3 hover:bg-gray-900 transition-colors shrink-0">
                                <Icon icon="mdi:plus" className="text-white" width={20} />
                            </button>
                        </div>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="text-white text-base font-medium mb-3 block">Model</label>
                        <div className="flex gap-3">
                            <div className="relative w-full">
                                <select
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full bg-[#0F172B60] text-gray-400 border-none rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]"
                                >
                                    <option value="" disabled>Select Model</option>
                                    <option value="iphone 13">iphone 13</option>
                                    <option value="iphone 14">iphone 14</option>
                                </select>
                                <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={20} />
                            </div>
                            <button className="bg-black rounded-full p-3 hover:bg-gray-900 transition-colors shrink-0">
                                <Icon icon="mdi:plus" className="text-white" width={20} />
                            </button>
                        </div>
                    </div>

                    {/* Repair Type */}
                    <div>
                        <label className="text-white text-base font-medium mb-3 block">Repair type</label>
                        <div className="flex gap-3">
                            <div className="relative w-full">
                                <select
                                    value={formData.repairType}
                                    onChange={(e) => setFormData({ ...formData, repairType: e.target.value })}
                                    className="w-full bg-[#0F172B60] text-gray-400 border-none rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]"
                                >
                                    <option value="" disabled>Select Type</option>
                                    <option value="Screen">Screen</option>
                                    <option value="Battery">Battery</option>
                                </select>
                                <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={20} />
                            </div>
                            <button className="bg-black rounded-full p-3 hover:bg-gray-900 transition-colors shrink-0">
                                <Icon icon="mdi:plus" className="text-white" width={20} />
                            </button>
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-white text-base font-medium mb-3 block">Price</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="$150"
                                className="w-full bg-[#0F172B60] text-white border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#2B7FFF]"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-white text-base font-medium mb-3 block">Status</label>
                        <div className="w-full bg-[#0F172B60] rounded-lg px-4 py-3 flex items-center justify-end">
                            <button
                                onClick={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Disabled' : 'Active' })}
                                className="flex items-center gap-3"
                            >
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.status === 'Active' ? 'bg-[#05DF72]' : 'bg-gray-600'}`}>
                                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white transition-all ${formData.status === 'Active' ? 'right-1' : 'left-1'}`}></div>
                                </div>
                                <span className="text-gray-400">{formData.status === 'Active' ? 'Active' : 'Disabled'}</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-6 mt-12">
                    <button
                        onClick={handleSubmit}
                        className="w-40 bg-[#05DF72] text-black font-medium py-3 rounded-xl hover:bg-[#05DF72CC] transition-all"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="w-40 bg-[#646464] text-black font-medium py-3 rounded-xl hover:bg-[#646464]/80 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
