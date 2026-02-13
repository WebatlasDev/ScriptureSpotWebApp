'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toastifyOverrides.css';

export default function ToastProvider() {
  return (
    <ToastContainer
      theme="dark"
      limit={1}
      position="bottom-center"
      autoClose={3000}
      closeOnClick
      pauseOnHover
      draggable
    />
  );
}
