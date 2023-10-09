'use client'

import { ToastContainer } from 'react-toastify'

const Toastify = () => (
  <ToastContainer
    autoClose={3000}
    closeOnClick
    draggable={false}
    hideProgressBar={false}
    newestOnTop={false}
    pauseOnFocusLoss={false}
    pauseOnHover
    position="bottom-right"
    rtl={false}
    theme="light"
  />
)

export default Toastify
