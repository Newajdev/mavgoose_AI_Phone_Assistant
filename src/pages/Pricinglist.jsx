import React, { useContext, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AuthContext } from "../provider/AuthContext";
import AddPriceModal from "../components/AddPriceModal";
import {
  getCategoriesApi,
  getBrandsApi,
  getDeviceModelsApi,
  getRepairTypesApi,
  getPriceListApi,
  updatePriceApi,
} from "../libs/pricing.api";

export default function PricingList() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.user?.role === "SUPER_ADMIN";

  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    model: "",
    repairType: "",
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [repairTypes, setRepairTypes] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  /* ---------------- LOAD FILTER DATA ---------------- */
  useEffect(() => {
    getCategoriesApi().then(res => setCategories(res.data));
    getRepairTypesApi().then(res => setRepairTypes(res.data));
  }, []);

  useEffect(() => {
    if (filters.category) {
      getBrandsApi(filters.category).then(res => setBrands(res.data));
    } else setBrands([]);
    setFilters(f => ({ ...f, brand: "", model: "" }));
  }, [filters.category]);

  useEffect(() => {
    if (filters.brand) {
      getDeviceModelsApi(filters.brand).then(res => setModels(res.data));
    } else setModels([]);
    setFilters(f => ({ ...f, model: "" }));
  }, [filters.brand]);

  /* ---------------- FETCH PRICE LIST ---------------- */
  const fetchPriceList = async () => {
    try {
      setLoading(true);
      const res = await getPriceListApi(filters);
      setPricingData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceList();
  }, [filters]);

  /* ---------------- STATUS TOGGLE ---------------- */
  const toggleStatus = async (item) => {
    const newStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    await updatePriceApi(item.id, { status: newStatus });
    fetchPriceList();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0A1230] via-[#0E1B4D] to-[#070E26] min-h-screen">

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          {
            value: filters.category,
            onChange: (v) => setFilters({ ...filters, category: v }),
            placeholder: "All Categories",
            data: categories,
          },
          {
            value: filters.brand,
            onChange: (v) => setFilters({ ...filters, brand: v }),
            placeholder: "Brand",
            data: brands,
          },
          {
            value: filters.model,
            onChange: (v) => setFilters({ ...filters, model: v }),
            placeholder: "Model",
            data: models,
          },
          {
            value: filters.repairType,
            onChange: (v) => setFilters({ ...filters, repairType: v }),
            placeholder: "Repair Type",
            data: repairTypes,
          },
        ].map((f, idx) => (
          <select
            key={idx}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="bg-[#0F1B3D] text-white px-4 py-2 rounded-full border border-[#2B7FFF40] hover:border-[#2B7FFF] transition"
          >
            <option value="">{f.placeholder}</option>
            {f.data.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        ))}

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="ml-auto bg-[#2B7FFF] hover:bg-[#2B7FFFCC] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg"
          >
            <Icon icon="mdi:plus" />
            Add Price
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-[#0F1B3D80] backdrop-blur-xl rounded-2xl border border-[#2B7FFF33] overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-7 text-[#9FB2FF] text-sm px-6 py-4 border-b border-[#2B7FFF33]">
          <div>Category</div>
          <div>Brand</div>
          <div>Model</div>
          <div>Repair Type</div>
          <div>Price</div>
          <div>Status</div>
          <div>Last Updated</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="text-center py-10 text-white">Loading...</div>
        ) : pricingData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-7 items-center px-6 py-4 border-b border-[#2B7FFF20] hover:bg-[#2B7FFF10] transition"
          >
            <div>
              <span className="px-3 py-1 text-xs rounded-full bg-[#2B7FFF25] text-[#6FA3FF]">
                {item.category_name}
              </span>
            </div>
            <div className="text-white">{item.brand_name}</div>
            <div className="text-white">{item.device_model_name}</div>
            <div className="text-white">{item.repair_type_name}</div>
            <div className="text-white font-medium">${item.price}</div>

            {/* Status */}
            <div>
              <button
                onClick={() => toggleStatus(item)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  item.status === "ACTIVE"
                    ? "bg-[#05DF7225] text-[#05DF72]"
                    : "bg-[#64748B30] text-[#94A3B8]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.status === "ACTIVE" ? "bg-[#05DF72]" : "bg-[#94A3B8]"
                  }`}
                />
                {item.status === "ACTIVE" ? "Active" : "Disabled"}
              </button>
            </div>

            <div className="text-[#94A3B8] text-sm">
              {new Date(item.updated_at).toISOString().split("T")[0]}
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD MODAL ================= */}
      {isAddModalOpen && (
        <AddPriceModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchPriceList}
        />
      )}
    </div>
  );
}
