import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import Spinner from '../components/Spinner'
import MainLayout from '../components/MainLayout'

const ProductsPage = lazy(() => import('../pages/ProductsPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const ProductFormPage = lazy(() => import('../pages/ProductFormPage'))
const ClientsPage = lazy(() => import('../pages/ClientsPage'))
const ClientFormPage = lazy(() => import('../pages/ClientFormPage'))
const SuppliersPage = lazy(() => import('../pages/SuppliersPage'))
const SupplierFormPage = lazy(() => import('../pages/SupplierFormPage'))
const ProductVariantsPage = lazy(() => import('../pages/ProductVariantsPage'))
const SalesPage = lazy(() => import('../pages/SalesPage'))
const SaleFormPage = lazy(() => import('../pages/SaleFormPage'))
const SaleDetailPage = lazy(() => import('../pages/SaleDetailPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<ClientFormPage />} />
            <Route path="/clients/:id/edit" element={<ClientFormPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/new" element={<SupplierFormPage />} />
            <Route path="/products/:id/variants" element={<ProductVariantsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales/new" element={<SaleFormPage />} />
            <Route path="/sales/:id" element={<SaleDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
