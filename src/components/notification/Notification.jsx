// import React from 'react'
// import './notification.css'
// import { ToastContainer } from 'react-toastify'
// import "react-toastify/dist/ReactToastify.css"

// const Notification = () => {
//   return (
//     <div className='notification'>
//       <ToastContainer position='bottom-right'/>
//     </div>
//   )
// }

// export default Notification
import './notification.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

const Notification = () => {
  return (
    <div className='notification-container'>
      <ToastContainer 
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
      />
    </div>
  )
}

export default Notification
