// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import { AuthProvider } from "./context/AuthProvider";
// import Cabang from "./pages/Cabang";
// import Categories from "./pages/Categories";
// import ItemMenu from "./pages/ItemMenu";
// import AdminProductDetail from "./pages/AdminProductDetail";
// import ProductDetail from "./pages/ProductDetail";
// import Checkout from "./pages/Checkout";

// // Import layouts
// import SuperAdminLayout from "./components/layout/SuperAdminLayout.jsx";
// import AdminLayout from "./components/layout/AdminLayout";
// import CustomerLayout from "./components/layout/CustomerLayout.jsx";

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Customer Routes */}
//           <Route
//             path="/home"
//             element={
//               <CustomerLayout>
//                 <Home />
//               </CustomerLayout>
//             }
//           />

//           <Route
//             path="/productdetail/:id"
//             element={
//               <CustomerLayout>
//                 <ProductDetail />
//               </CustomerLayout>

//             }
//           />

//           <Route
//             path="/checkout"
//             element={

//                 <Checkout />

//             }
//           />

//           {/* Super Admin Routes with Layout */}
//           <Route
//             path="/superadmin"
//             element={
//               <ProtectedRoute allowedRoles={["super_admin"]}>
//                 <SuperAdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             {/* Super Admin Dashboard */}
//             <Route 
//               path="dashboard" 
//               element={<SuperAdminDashboard />} 
//             />
            
//             {/* Super Admin Categories */}
//             <Route 
//               path="categories" 
//               element={<Categories />} 
//             />
            
//             {/* Super Admin Cabang */}
//             <Route 
//               path="cabang" 
//               element={<Cabang />} 
//             />
            
//             {/* Super Admin Item Menu */}
//             <Route 
//               path="item-menu" 
//               element={<ItemMenu />} 
//             />
            
//             {/* Default redirect for /superadmin */}
//             <Route 
//               index 
//               element={<Navigate to="/superadmin/dashboard" replace />} 
//             />
//           </Route>

//           {/* Admin Routes with Layout */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute allowedRoles={["super_admin","admin"]}>
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             {/* Admin Dashboard */}
//             <Route 
//               path="dashboard" 
//               element={<AdminDashboard />} 
//             />
            
//             {/* Admin Product Detail */}
//             <Route 
//               path="menu-items/:id" 
//               element={<AdminProductDetail />} 
//             />
            
//             {/* Default redirect for /admin */}
//             <Route 
//               index 
//               element={<Navigate to="/admin/dashboard" replace />} 
//             />
//           </Route>

//           {/* Keep individual routes for backward compatibility (optional) */}
//           <Route
//             path="/superadmin/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["super_admin"]}>
//                 <SuperAdminLayout>
//                   <SuperAdminDashboard />
//                 </SuperAdminLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/superadmin/categories"
//             element={
//               <ProtectedRoute allowedRoles={["super_admin"]}>
//                 <SuperAdminLayout>
//                   <Categories />
//                 </SuperAdminLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/superadmin/cabang"
//             element={
//               <ProtectedRoute allowedRoles={["super_admin"]}>
//                 <SuperAdminLayout>
//                   <Cabang />
//                 </SuperAdminLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/superadmin/item-menu"
//             element={
//               <ProtectedRoute allowedRoles={["super_admin"]}>
//                 <SuperAdminLayout>
//                   <ItemMenu />
//                 </SuperAdminLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/menu-items/:id"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
//                 <AdminLayout>
//                   <AdminProductDetail />
//                 </AdminLayout>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

/* PUBLIC */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* CUSTOMER */
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";

/* ADMIN */
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductDetail from "./pages/AdminProductDetail";

/* SUPER ADMIN */
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Categories from "./pages/Categories";
import Cabang from "./pages/Cabang";
import ItemMenu from "./pages/ItemMenu";

/* LAYOUTS */
import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import SuperAdminLayout from "./components/layout/SuperAdminLayout";

function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= CUSTOMER ================= */}

          <Route
            element={
              <ProtectedRoute>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />

            <Route
              path="/productdetail/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />
          </Route>

          {/* ================= SUPER ADMIN ================= */}

          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
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
              element={<SuperAdminDashboard />}
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
              path="item-menu"
              element={<ItemMenu />}
            />
          </Route>

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "super_admin"]}
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
              element={<AdminDashboard />}
            />

            <Route
              path="menu-items/:id"
              element={<AdminProductDetail />}
            />
          </Route>

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;