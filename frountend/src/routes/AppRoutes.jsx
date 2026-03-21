import { Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import RequireAuth from './RequireAuth'

import HomePage from '../pages/HomePage'
import BlogListingPage from '../pages/BlogListingPage'
import BlogDetailPage from '../pages/BlogDetailPage'
import GalleryPage from '../pages/GalleryPage'
import LoginPage from '../pages/LoginPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

