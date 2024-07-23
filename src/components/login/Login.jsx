// import React, { useState } from "react";
// import "./login.css";
// import { toast } from "react-toastify";
// import { createUserWithEmailAndPassword ,signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../../lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import upload from "../../services/upload";
// import Register from "../Register/Register";

// const Login = () => {
//   const [avatar, setAvatar] = useState({
//     file: null,
//     url: "",
//   });
//   const [loading ,setLoading] = useState(false);

//   const handleLogin = async(e) => {
//     e.preventDefault();
//     setLoading(true)
//     const formData = new FormData(e.target);

//     const { username, email, password } = Object.fromEntries(formData);

//     try { 
      
//       await signInWithEmailAndPassword(auth ,email , password)
//       toast.success("Login Successfull!")
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
      
//     }finally{

//       setLoading(false)
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.target);

//     const { username, email, password } = Object.fromEntries(formData);

    

//     try {
//       const res = await createUserWithEmailAndPassword(auth, email, password);

//       const imgUrl = await upload(avatar.file);
//       await setDoc(doc(db, "users", res.user.uid), {
//         username,
//         email,
//         avatar: imgUrl,
//         id: res.user.uid,
//         blocked: [],
//       });

//       await setDoc(doc(db, "userchats", res.user.uid), {
//         chats: [],
//       });

//       toast.success("Account Created Successfully");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }finally{
//       setLoading(false)
//     }
//   };

//   const handleAvatar = (e) => {
//     if (e.target.files[0]) {
//       setAvatar({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0]),
//       });
//     }
//   };

//   return (
//     <div className="login">
//       <div className="item">
//         <h2>Welcome Back</h2>
//         <form onSubmit={handleLogin}>
//           <input type="text" placeholder="Email" name="email" />
//           <input type="password" placeholder="Password" name="password" />
//           <button disabled={loading}>{loading ? 'Loading': 'Sign In'}</button>
//         </form>
//       </div>
//       <div className="separator"></div>
//       <div className="item">
//         <h2>Create an Account</h2>
//         <form onSubmit={handleRegister}>
//           <label htmlFor="file">
//             <img src={avatar.url || "/avatar.png"} alt="" />
//             Upload an Image
//           </label>
//           <input
//             type="file"
//             id="file"
//             style={{ display: "none" }}
//             onChange={handleAvatar}
//           />
//           <input type="text" placeholder="Username" name="username" />
//           <input type="text" placeholder="Email" name="email" />
//           <input type="password" placeholder="Password" name="password" />
//           <button disabled={loading}>{loading ? 'Loading': 'Sign Up'}</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../services/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = avatar.file ? await upload(avatar.file) : "/default-avatar.png";

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created Successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    

    <section className=" min-h-screen flex items-center justify-center w-full h-full">
      <div className="w-full max-w-md bg-darkblue2 rounded-lg shadow dark:border dark:bg-darkblue3 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          {isLogin ? (
            <>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
              </form>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <button onClick={() => setIsLogin(false)} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an Account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                <div>
                  <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload an Avatar</label>
                  <input type="file" id="file" className="hidden" onChange={handleAvatar} />
                  <label htmlFor="file" className="cursor-pointer">
                    <img src={avatar.url || "/avatar.png"} alt="Avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />
                  </label>
                </div>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
              </form>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <button onClick={() => setIsLogin(true)} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</button>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
   
  );
};

export default Login;
