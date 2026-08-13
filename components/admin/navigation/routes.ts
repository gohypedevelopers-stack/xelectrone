export type AdminRoute = {
  label: string
  href: string
  children?: AdminRoute[]
}

export const adminRoutes: AdminRoute[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Banners", href: "/dashboard/banners" },
  { label: "Creator Videos", href: "/dashboard/creator-videos" },
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
      { label: "Categories", href: "/dashboard/products/categories" },
    ],
  },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Deal of the day", href: "/dashboard/deal-of-the-day" },
  { label: "Discounts", href: "/dashboard/discounts" },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
  },
]
