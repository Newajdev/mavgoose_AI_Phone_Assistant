/* ================= PRICE LIST META ADAPTERS ================= */

// Category
export const adaptCategory = (c) => ({
  id: c.id,
  name: c.name,
});

// Brand
export const adaptBrand = (b) => ({
  id: b.id,
  name: b.brand_name,
});

// Device Model
export const adaptModel = (m) => ({
  id: m.id,
  name: m.model_name,
});

// Repair Type
export const adaptRepairType = (r) => ({
  id: r.id,
  name: r.name,
});

// Price List Item (optional – future use)
export const adaptPriceItem = (p) => ({
  id: p.id,
  categoryId: p.category,
  brandId: p.brand,
  modelId: p.device_model,
  repairTypeId: p.repair_type,

  category_name: p.category_name,
  brand_name: p.brand_name,
  device_model_name: p.device_model_name,
  repair_type_name: p.repair_type_name,

  price: p.price,
  status: p.status,
  updated_at: p.updated_at,
});
