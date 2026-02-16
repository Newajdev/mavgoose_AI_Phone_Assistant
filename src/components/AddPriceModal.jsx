import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

import {
  getCategoriesApi,
  getBrandsApi,
  getDeviceModelsApi,
  getRepairTypesApi,
  createBrandApi,
  createCategoryApi,
  createDeviceModelApi,
  createPriceApi,
  createRepairTypeApi
} from "../libs/pricing.api";

import { AuthContext } from "../provider/AuthContext";

export default function AddPriceModal({ onClose, onSuccess }) {
  const { getActiveStoreId } = useContext(AuthContext);
  const storeId = getActiveStoreId();

  const [quickType, setQuickType] = useState(null);
  const [quickName, setQuickName] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [repairTypes, setRepairTypes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    brand: "",
    model: "",
    repairType: "",
    price: "",
    status: "ACTIVE",
  });

  /* ================= LOAD INITIAL ================= */
  useEffect(() => {
    getCategoriesApi().then((res) => setCategories(res.data || []));
    getRepairTypesApi().then((res) => setRepairTypes(res.data || []));
  }, []);

  /* ================= LOAD BRANDS ================= */
  // Normal form brand load (category selected)
  useEffect(() => {
    if (form.category) {
      getBrandsApi(form.category).then((res) => setBrands(res.data || []));
    } else {
      setBrands([]);
      setForm((prev) => ({ ...prev, brand: "", model: "" }));
    }
  }, [form.category]);

  /* ================= LOAD MODELS ================= */
  useEffect(() => {
    if (form.brand) {
      getDeviceModelsApi(form.brand).then((res) => setModels(res.data || []));
    } else {
      setModels([]);
      setForm((prev) => ({ ...prev, model: "" }));
    }
  }, [form.brand]);

  /* ================= PRICE SUBMIT ================= */
  const handleSubmit = async () => {
    if (!storeId) {
      toast.error("Please select a store first");
      return;
    }
    if (!form.model || !form.repairType || !form.price) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await createPriceApi(
        {
          device_model: form.model,
          repair_type: form.repairType,
          price: Number(form.price),
          status: form.status,
        },
        storeId
      );
      toast.success("Price added successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Failed to add price");
    } finally {
      setLoading(false);
    }
  };

  /* ================= QUICK CREATE ================= */
  const handleQuickCreate = async () => {
    if (!quickName.trim()) {
      toast.error("Name required");
      return;
    }

    try {
      let res;

      if (quickType === "category") {
        res = await createCategoryApi({ name: quickName });
        setCategories((prev) => [...prev, res.data]);
        setForm((prev) => ({ ...prev, category: res.data.id }));
      }

      if (quickType === "brand") {
        if (!form.category) {
          toast.error("Select a category first");
          return;
        }

        res = await createBrandApi({
          name: quickName,
          category: form.category,
        });

        setBrands((prev) => [...prev, res.data]);
        setForm((prev) => ({ ...prev, brand: res.data.id }));
      }


      if (quickType === "model") {
        if (!form.brand) {
          toast.error("Select a brand first");
          return;
        }
        res = await createDeviceModelApi({
          name: quickName,
          brand: form.brand,
        });
        setModels((prev) => [...prev, res.data]);
        setForm((prev) => ({ ...prev, model: res.data.id }));
      }

      if (quickType === "repair") {
        res = await createRepairTypeApi({ name: quickName });
        setRepairTypes((prev) => [...prev, res.data]);
        setForm((prev) => ({ ...prev, repairType: res.data.id }));
      }

      toast.success("Created successfully");
      setQuickName("");
      setQuickType(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="relative w-full max-w-4xl">
        <div className="p-px rounded-3xl bg-linear-to-br from-[#2B7FFF] via-[#00C6FF] to-[#6C63FF]">
          <div className="bg-[#0F172A]/95 rounded-3xl p-8 relative">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Add New Price</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition">✕</button>
            </div>

            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400 flex justify-between items-center">
                  Category
                  <Icon icon="mdi:plus-circle-outline" className="text-[#2B7FFF] text-lg cursor-pointer hover:scale-110 transition"
                    onClick={() => setQuickType("category")} />
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-[#2B7FFF] outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400 flex justify-between items-center">
                  Brand
                  <Icon icon="mdi:plus-circle-outline" className="text-[#2B7FFF] text-lg cursor-pointer hover:scale-110 transition"
                    onClick={() => setQuickType("brand")} />
                </label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-[#2B7FFF] outline-none"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                </select>
              </div>

              {/* Device Model */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400 flex justify-between items-center">
                  Device Model
                  <Icon icon="mdi:plus-circle-outline" className="text-[#2B7FFF] text-lg cursor-pointer hover:scale-110 transition"
                    onClick={() => setQuickType("model")} />
                </label>
                <select
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-[#2B7FFF] outline-none"
                >
                  <option value="">Select Model</option>
                  {models.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                </select>
              </div>

              {/* Repair Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400 flex justify-between items-center">
                  Repair Type
                  <Icon icon="mdi:plus-circle-outline" className="text-[#2B7FFF] text-lg cursor-pointer hover:scale-110 transition"
                    onClick={() => setQuickType("repair")} />
                </label>
                <select
                  value={form.repairType}
                  onChange={(e) => setForm({ ...form, repairType: e.target.value })}
                  className="bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-[#2B7FFF] outline-none"
                >
                  <option value="">Select Repair Type</option>
                  {repairTypes.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                </select>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Price</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-[#2B7FFF] outline-none" />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-[#2B7FFF] outline-none">
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-10">
              <button disabled={loading} onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-linear-to-r from-[#2B7FFF] to-[#00C6FF] text-white font-semibold">
                {loading ? "Saving..." : "Save Price"}
              </button>
              <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-700 text-white">Cancel</button>
            </div>

            {/* Quick Create Modal */}
            {/* Quick Create Modal */}
            {quickType && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-3xl">
                <div className="bg-[#0F172A] p-6 rounded-2xl w-full max-w-sm border border-[#2B7FFF40]">
                  <h4 className="text-white font-semibold mb-4 capitalize">Create {quickType}</h4>

                  {quickType === "model" && (
                    <>
                      <label className="text-sm text-gray-400 mb-1">Select Brand</label>
                      <select
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 outline-none mb-3"
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>

                      <label className="text-sm text-gray-400 mb-1">Device Model Name</label>
                      <input
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        placeholder="Enter device model name"
                        className="w-full bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 outline-none"
                      />
                    </>
                  )}

                  {quickType === "brand" && (
                    <>
                      <label className="text-sm text-gray-400 mb-1">Category (optional)</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 outline-none mb-3"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      <label className="text-sm text-gray-400 mb-1">Brand Name</label>
                      <input
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        placeholder="Enter brand name"
                        className="w-full bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 outline-none"
                      />
                    </>
                  )}

                  {quickType !== "model" && quickType !== "brand" && (
                    <input
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      placeholder={`Enter ${quickType} name`}
                      className="w-full bg-[#1E293B] text-white px-4 py-3 rounded-xl border border-gray-600 outline-none"
                    />
                  )}

                  <div className="flex gap-3 mt-5">
                    <button onClick={handleQuickCreate} className="flex-1 bg-[#2B7FFF] py-2 rounded-xl">Create</button>
                    <button onClick={() => setQuickType(null)} className="flex-1 bg-gray-600 py-2 rounded-xl">Cancel</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
