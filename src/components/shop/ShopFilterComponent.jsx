"use client";

import { useState } from "react";
import ShopCardComponent from "./ShopCardComponent";

const MAX_PRICE = 300;

const QUICK_PRICES = [
  { label: "Under $50", value: 50 },
  { label: "Under $100", value: 100 },
  { label: "Under $150", value: 150 },
];

export default function ShopFilterComponent({ products = [], categories = [] }) {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const sliderValue = maxPrice ?? MAX_PRICE;

  // Filter products based on search, price, and selected categories
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = maxPrice === null || product.price <= maxPrice;
    const matchesCategory = selectedCategoryIds.length === 0 || selectedCategoryIds.includes(product.categoryId);
    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Get the category name for a product
  function getCategoryName(product) {
    const category = categories.find((c) => c.categoryId === product.categoryId);
    return category ? category.name : "Uncategorized";
  }

  // Count how many products belong to each category
  function getProductCount(categoryId) {
    return products.filter((p) => p.categoryId === categoryId).length;
  }

  function toggleCategory(categoryId) {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  function resetFilters() {
    setSearch("");
    setMaxPrice(null);
    setSelectedCategoryIds([]);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Luxury beauty products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Use the filters to narrow by price and brand.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:w-72"
        />
      </div>

      {/* Product count */}
      <p className="mt-4 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
        products
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Sidebar ── */}
        <aside className="w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:w-64">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Filters</p>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 transition hover:text-gray-900"
            >
              Reset filters
            </button>
          </div>

          {/* Price range */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Price Range
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              $0 – ${sliderValue}
            </p>
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              value={sliderValue}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full cursor-pointer accent-gray-900"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>$0</span>
              <span>${MAX_PRICE}</span>
            </div>
          </div>

          {/* Quick select */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Quick Select
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {QUICK_PRICES.map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setMaxPrice(value)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                    maxPrice === value
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setMaxPrice(null)}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                  maxPrice === null
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                All prices
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Categories
            </p>
            <div className="mt-2 flex flex-col gap-2.5">
              {categories.map((category) => (
                <label
                  key={category.categoryId}
                  className="flex cursor-pointer items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category.categoryId)}
                      onChange={() => toggleCategory(category.categoryId)}
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {getProductCount(category.categoryId)}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Select none to include all categories.
            </p>
          </div>
        </aside>

        {/* ── Product grid ── */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ShopCardComponent
                  key={product.productId}
                  product={product}
                  catLabel={getCategoryName(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
