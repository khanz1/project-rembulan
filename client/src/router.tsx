import { createBrowserRouter, redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import HistoryPage from './pages/HistoryPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import OrderCompletedPage from './pages/OrderCompletedPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import { GoogleLoginProvider } from './contexts/GoogleLogin.context.tsx';
import HistoryDetailPage from './pages/HistoryDetailPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GoogleLoginProvider>
        <LoginPage />
      </GoogleLoginProvider>
    ),
    loader: () => {
      if (localStorage.getItem('token')) {
        return redirect('/');
      }

      return null;
    },
  },
  {
    path: '/',
    loader: () => {
      if (!localStorage.getItem('token')) {
        return redirect('/login');
      }

      return null;
    },
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            element: <HistoryPage />,
          },
          {
            path: ':id',
            element: <HistoryDetailPage />,
          },
        ],
      },
      {
        path: 'order',
        children: [
          {
            path: '',
            index: true,
            element: <OrderPage />,
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'completed',
            element: <OrderCompletedPage />,
          },
        ],
      },
    ],
  },
]);
