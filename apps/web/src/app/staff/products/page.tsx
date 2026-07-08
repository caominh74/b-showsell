"use client"

import { RecordManager } from "@/components/management/record-manager"

type Product = {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number | null
  stockQuantity: number
  lowStockThreshold: number
  status: string
  brand?: { name: string }
  category?: { name: string }
}

export default function StaffProductsPage() {
  return (
    <div className="space-y-8">
      <RecordManager<Product>
        title="Product catalog"
        description="Create and maintain catalog listings, pricing, inventory, visibility status, and low-stock thresholds."
        endpoint="/staff/products"
        emptyText="No products found."
        fields={[
          { name: "brandId", label: "Brand", type: "select", optionEndpoint: "/admin/brands", required: true },
          { name: "categoryId", label: "Category", type: "select", optionEndpoint: "/staff/categories", required: true },
          { name: "name", label: "Product name", required: true },
          { name: "slug", label: "Slug" },
          { name: "price", label: "Price", type: "number", required: true },
          { name: "salePrice", label: "Sale price", type: "number" },
          { name: "costPrice", label: "Cost price", type: "number" },
          { name: "stockQuantity", label: "Stock", type: "number" },
          { name: "lowStockThreshold", label: "Low-stock threshold", type: "number" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Active", value: "ACTIVE" },
              { label: "Out of stock", value: "OUT_OF_STOCK" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
          { name: "isLimitedEdition", label: "Limited edition", type: "checkbox" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "ingredients", label: "Ingredients", type: "textarea" },
          { name: "usageInstructions", label: "Usage instructions", type: "textarea" },
        ]}
        columns={[
          { label: "Product", render: (product) => <strong className="text-stone-950">{product.name}</strong> },
          { label: "Brand", render: (product) => product.brand?.name ?? "Unknown" },
          { label: "Category", render: (product) => product.category?.name ?? "Unknown" },
          { label: "Price", render: (product) => `${(product.salePrice ?? product.price).toLocaleString()} VND` },
          {
            label: "Stock",
            render: (product) => (
              <span className={product.stockQuantity <= product.lowStockThreshold ? "font-semibold text-rose-700" : ""}>
                {product.stockQuantity}
              </span>
            ),
          },
          { label: "Status", render: (product) => product.status },
        ]}
      />

      <RecordManager<{ id: string; name: string; slug: string; status: string; _count?: { products: number } }>
        title="Product categories"
        description="Maintain the category tree used by staff catalog management and public storefront filters."
        endpoint="/staff/categories"
        emptyText="No categories found."
        fields={[
          { name: "name", label: "Category name", required: true },
          { name: "slug", label: "Slug" },
          { name: "parentId", label: "Parent", type: "select", optionEndpoint: "/staff/categories" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ],
          },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        columns={[
          { label: "Category", render: (category) => <strong className="text-stone-950">{category.name}</strong> },
          { label: "Slug", render: (category) => category.slug },
          { label: "Products", render: (category) => category._count?.products ?? 0 },
          { label: "Status", render: (category) => category.status },
        ]}
      />
    </div>
  )
}
