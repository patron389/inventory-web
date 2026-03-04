import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "@/modules/auth/pages/LoginPage.vue";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage.vue";
import ProductsPage from "@/modules/products/pages/ProductsPage.vue";
import BrandsPage from "@/modules/brands/pages/BrandsPage.vue";
import CategoryPage from "@/modules/category/pages/CategoryPage.vue";
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
});
export default router;
