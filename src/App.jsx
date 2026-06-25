import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import { AuthProvider } from "./context/AuthProvider";
import { BranchProvider } from "./context/BranchProvider";

import ProtectedRoute from "./auth/ProtectedRoute";
import BranchGuard from "./auth/BranchGuard";

/* LAYOUTS */
import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import SuperAdminLayout from "./components/layout/SuperAdminLayout";

/* ================= PUBLIC ================= */

const Landing = lazy(() =>
  import("./pages/public/Landing")
);

const Login = lazy(() =>
  import("./pages/public/Login")
);

const Register = lazy(() =>
  import("./pages/public/Register")
);

const Menu = lazy(() =>
  import("./pages/public/Menu")
);

const OrderStatus = lazy(() =>
  import("./pages/public/OrderStatus")
);

const ForgotPassword = lazy(() =>
  import("./pages/public/ForgotPassword")
);

const ResetPassword = lazy(() =>
  import("./auth/ResetPassword")
);

/* ================= CUSTOMER ================= */

const Home = lazy(() =>
  import("./pages/public/Home")
);

const EmailVerification = lazy(() =>
  import("./auth/EmailVerification")
);

const ProductDetail = lazy(() =>
  import("./pages/public/ProductDetail")
);

const Checkout = lazy(() =>
  import("./pages/public/Checkout")
);

const Profile = lazy(() =>
  import("./pages/user/Profile")
);

const Riwayat = lazy(() =>
  import("./pages/user/Riwayat")
);

const Voucher = lazy(() =>
  import("./pages/user/Voucher")
);

const MyVoucher = lazy(() =>
  import("./pages/user/MyVoucher")
);

/* ================= ADMIN ================= */

const Dashboard = lazy(() =>
  import("./pages/admin/Dashboard")
);

const AdminProductDetail = lazy(() =>
  import("./pages/super_admin/AdminProductDetail")
);

const BranchStock = lazy(() =>
  import("./pages/admin/BranchStock")
);

const OrderHub = lazy(() =>
  import("./pages/admin/OrderHub")
);

const KasirOrder = lazy(() =>
  import("./pages/admin/KasirOrder")
);

/* ================= SUPER ADMIN ================= */

const Categories = lazy(() =>
  import("./pages/super_admin/Categories")
);

const Cabang = lazy(() =>
  import("./pages/super_admin/Cabang")
);

const ItemMenu = lazy(() =>
  import("./pages/super_admin/ItemMenu")
);

const AdminCabang = lazy(() =>
  import("./pages/super_admin/AdminCabang")
);

const BannerManagement = lazy(() =>
  import("./pages/super_admin/BannerManagement")
);

const VoucherManagement = lazy(() =>
  import("./pages/super_admin/VoucherManagement")
);

const FeeManagement = lazy(() =>
  import("./pages/super_admin/FeeManagement")
);

function App() {

  return (
    <AuthProvider>
      <BranchProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div
                className="
                  min-h-screen
                  flex
                  items-center
                  justify-center
                  bg-[#F8F5F0]
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    border-4
                    border-[#2F5231]/20
                    border-t-[#2F5231]
                    rounded-full
                    animate-spin
                  "
                />

              </div>
            }
          >

            <Routes>
              {/* ================= PUBLIC ================= */}
              <Route
                path="/"
                element={<Landing />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              <Route
                path="/email-verification"
                element={<EmailVerification />}
              />

              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              <Route
                path="/reset-password"
                element={<ResetPassword />}
              />

              <Route
                path="/orders/:orderNumber"
                element={<OrderStatus />}
              />

              {/* ================= PUBLIC CUSTOMER FLOW ================= */}
              <Route
                element={
                  <BranchGuard>
                    <CustomerLayout />
                  </BranchGuard>
                }
              >

                <Route
                  path="/home"
                  element={<Home />}
                />

                <Route
                  path="/productdetail/:id"
                  element={<ProductDetail />}
                />

                <Route
                  path="/menu"
                  element={<Menu />}
                />

                <Route
                  path="/checkout"
                  element={<Checkout />}
                />

              </Route>

              {/* ================= AUTH CUSTOMER ================= */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["customer"]}
                  >
                    <BranchGuard>
                      <CustomerLayout />
                    </BranchGuard>
                  </ProtectedRoute>
                }
              >

                <Route
                  path="/profile"
                  element={<Profile />}
                />

                <Route
                  path="/history"
                  element={<Riwayat />}
                />

                <Route
                  path="/voucher"
                  element={<Voucher />}
                />

                <Route
                  path="/myvoucher"
                  element={<MyVoucher />}
                />

              </Route>

              {/* ================= SUPER ADMIN ================= */}
              <Route
                path="/superadmin"
                element={
                  <ProtectedRoute
                    allowedRoles={["super_admin"]}
                  >
                    <SuperAdminLayout />
                  </ProtectedRoute>
                }
              >

                <Route
                  index
                  element={
                    <Navigate
                      to="/superadmin/dashboard"
                      replace
                    />
                  }
                />

                <Route
                  path="dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="categories"
                  element={<Categories />}
                />

                <Route
                  path="cabang"
                  element={<Cabang />}
                />

                <Route
                  path="admin-cabang"
                  element={<AdminCabang />}
                />

                <Route
                  path="item-menu"
                  element={<ItemMenu />}
                />

                <Route
                  path="banners"
                  element={<BannerManagement />}
                />

                <Route
                  path="vouchers"
                  element={<VoucherManagement />}
                />

                <Route
                  path="fees"
                  element={<FeeManagement />}
                />

              </Route>

              {/* ================= ADMIN ================= */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "admin",
                      "super_admin",
                    ]}
                  >
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >

                <Route
                  index
                  element={
                    <Navigate
                      to="/admin/dashboard"
                      replace
                    />
                  }
                />

                <Route
                  path="dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="menu-items/:id"
                  element={<AdminProductDetail />}
                />

                <Route
                  path="stock"
                  element={<BranchStock />}
                />

                <Route
                  path="order-hub"
                  element={<OrderHub />}
                />

                <Route
                  path="orders/create"
                  element={<KasirOrder />}
                />

              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </BranchProvider>
    </AuthProvider>
  );
}

export default App;