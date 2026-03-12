import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/modules/auth/pages/LoginPage.vue";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage.vue";
import ProductsPage from "@/modules/products/pages/ProductsPage.vue";
import BrandsPage from "@/modules/brands/pages/BrandsPage.vue";
import CategoryPage from "@/modules/category/pages/CategoryPage.vue";
import WarehousePage from "@/modules/warehouse/pages/WarehousePage.vue";
import StockPage from "@/modules/stocks/pages/StockPage.vue";
import StockLedgerPage from "@/modules/stocks/pages/StockLedgerPage.vue";
import StockTransferPage from "@/modules/stocks/pages/StockTransferPage.vue";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guest: true },
  },

  {
    path: "/",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { auth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardPage,
      },
      {
        path: "",
        redirect: "/dashboard", // root redirects to dashboard
      },
      {
        path: "users",
        name: "users",
        component: () =>
          import("@/modules/users/pages/UsersPage.vue"),
        meta: { permission: "user.view" },
      },
      {
        path: "products",
        name: "products",
        component: ProductsPage,
      },
      {
        path: "brands",
        name: "brands",
        component: BrandsPage,
      },
      {
        path: "categories",
        name: "categories",
        component: CategoryPage,
      },
      {
        path: "warehouses",
        name: "warehouse",
        component: WarehousePage,
      },
      {
        path: "stocks",
        name: "stock",
        component: StockPage,
      },
      {
        path: "stock-ledger",
        name: "stock-ledger",
        component: StockLedgerPage,
      },
      {
        path: "stock-transfer",
        name: "stock-transfer",
        component: StockTransferPage,
      },
    ],
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
/**
 * Global auth guard
 */
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // wait until auth restoration completes (after refresh)
  if (!auth.isBootstrapped) {
    await auth.fetchUser();
  }

  // trying to access protected page while guest
  if (to.meta.auth && !auth.isAuthenticated) {
    return "/login";
  }

  // logged in user opening login page
  if (to.meta.guest && auth.isAuthenticated) {
    return "/dashboard";
  }
    if (!auth.isBootstrapped) {
    await auth.fetchUser();
  }

  if (to.meta.auth && !auth.isAuthenticated) {
    return "/login";
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return "/dashboard";
  }

  if (to.meta.permission && !auth.can(to.meta.permission as string)) {
    return "/dashboard";
  }
  return true;
});
export default router;
