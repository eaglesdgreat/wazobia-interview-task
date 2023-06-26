import './index.css';

import EmbedProvider from "context/embed";
import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import { RouterProvider } from "react-router-dom";
import router from "routes";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <EmbedProvider>
      <RouterProvider router={router} />
    </EmbedProvider>
  </React.StrictMode>
);
