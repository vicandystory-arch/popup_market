import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthPage } from '@/pages/AuthPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { StoresPage } from '@/pages/StoresPage'
import { StoreDetailPage } from '@/pages/StoreDetailPage'
import { NewStorePage } from '@/pages/NewStorePage'
import { EditStorePage } from '@/pages/EditStorePage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { CollaborationsPage } from '@/pages/CollaborationsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* 메인 페이지는 공개 라우트 */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          {/* 보호된 라우트 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/stores" element={<StoresPage />} />
                    <Route path="/stores/:id" element={<StoreDetailPage />} />
                    <Route path="/stores/:id/edit" element={<EditStorePage />} />
                    <Route path="/stores/new" element={<NewStorePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/collaborations" element={<CollaborationsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
