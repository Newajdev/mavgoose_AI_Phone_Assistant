import React, { useContext, useEffect, useState } from "react";
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

  /* ---------- Load filter data ---------- */
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

  /* ---------- Fetch price list ---------- */
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

  /* ---------- Toggle Status ---------- */
  const toggleStatus = async (item) => {
    const newStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    await updatePriceApi(item.id, { status: newStatus });
    fetchPriceList();
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select onChange={e => setFilters({ ...filters, brand: e.target.value })}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select onChange={e => setFilters({ ...filters, model: e.target.value })}>
          <option value="">All Models</option>
          {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <select onChange={e => setFilters({ ...filters, repairType: e.target.value })}>
          <option value="">All Repair Types</option>
          {repairTypes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Price
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full text-white">
        <thead>
          <tr>
            <th>Category</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Repair</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6">Loading...</td></tr>
          ) : pricingData.map(item => (
            <tr key={item.id}>
              <td>{item.category_name}</td>
              <td>{item.brand_name}</td>
              <td>{item.device_model_name}</td>
              <td>{item.repair_type_name}</td>
              <td>${item.price}</td>
              <td>
                <button onClick={() => toggleStatus(item)}>
                  {item.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <AddPriceModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchPriceList}
        />
      )}
    </div>
  );
}
