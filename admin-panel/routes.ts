export type AdminRoute = {
  label: string
  href: string
  children?: AdminRoute[]
}

export const adminRoutes: AdminRoute[] = [
  { label: "Home", href: "/dashboard" },
  {
    label: "Orders",
    href: "/dashboard/orders",
    children: [
      { label: "Drafts", href: "/dashboard/orders/drafts" },
      {
        label: "Abandoned checkouts",
        href: "/dashboard/orders/abandoned-checkouts",
      },
    ],
  },
  {
    label: "Products",
    href: "/dashboard/products",
    children: [
      {
        label: "Collections",
        href: "/dashboard/products/collections",
      },
      { label: "Categories", href: "/dashboard/products/categories" },
      { label: "Inventory", href: "/dashboard/products/inventory" },
    ],
  },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Discounts", href: "/dashboard/discounts" },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    children: [
      { label: "Reports", href: "/dashboard/analytics/reports" },
    ],
  },
]
