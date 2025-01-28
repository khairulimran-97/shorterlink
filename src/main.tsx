import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import RedirectHandler from './components/RedirectHandler';
import WhatsAppRedirect from './components/WhatsAppRedirect';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/ws/*',
    element: <WhatsAppRedirect />,
  },
  {
    path: '*',
    element: <RedirectHandler />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
