// import ProductList from './pages/ProductList'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
// import Profile from './pages/Profile'
import { useRoutes, Outlet, Navigate } from 'react-router-dom'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constants/path'

import NotFound from './pages/NotFound'

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='login' />
}
const RejectRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/Profile'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Suspense>
                <Profile />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.productDetails,
          element: (
            <MainLayout>
              <Suspense>
                <ProductDetail />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.cart,
          element: (
            <MainLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}
