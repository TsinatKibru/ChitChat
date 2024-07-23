// import { useEffect, useRef, useState } from "react";
// import { useUserStore } from "../../../lib/userStore";
// import upload from "../../../services/upload";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { toast } from "react-toastify";
// import { CgClose } from "react-icons/cg";


// const UserProfileUpdate = ({setEdit}) => {
//   const { currentUser } = useUserStore();
//   const [avatar, setAvatar] = useState({ file: null, url: currentUser?.avatar || "/default-avatar.png" });
//   const [username, setUsername] = useState(currentUser?.username || '');
//   const [loading, setLoading] = useState(false);
//   const profileref = useRef();


//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const imgUrl = avatar.file ? await upload(avatar.file) : avatar.url;

//       await updateDoc(doc(db, "users", currentUser.id), {
//         username,
//         avatar: imgUrl,
//         updatedAt: Date.now(),
//       });

      
//       toast.success("Profile updated successfully!");
      
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAvatarChange = (e) => {
//     if (e.target.files[0]) {
//       setAvatar({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0]),
//       });
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileref.current && !profileref.current.contains(event.target)) {
//         setEdit(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [setEdit]);



//   return (
//     <section className="fixed top-10 min-h-screen flex items-center justify-center w-full h-full" ref={profileref}>
//       <div className="w-full max-w-md bg-darkblue2 rounded-lg shadow dark:border dark:bg-darkblue3 dark:border-gray-700">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//          <div className="flex justify-between"> <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white inline-block ">
//             Update Profile
//           </h1>
//           <div  onClick={()=>setEdit((prev)=> !prev)} className="inline-block"><CgClose/></div></div>
//           <form className="space-y-4 md:space-y-6" onSubmit={handleUpdate}>
//             <div>
//               <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                 Upload an Avatar
//               </label>
//               <input type="file" id="file" className="hidden" onChange={handleAvatarChange} />
//               <label htmlFor="file" className="cursor-pointer">
//                 <img src={avatar.url} alt="Avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />
//               </label>
//             </div>
//             <div>
//               <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 placeholder="Username"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={loading}
//             >
//               {loading ? 'Updating...' : 'Update Profile'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UserProfileUpdate;
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import upload from "../../../services/upload";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "react-toastify";
import { CgClose } from "react-icons/cg";

const UserProfileUpdate = ({ setEdit }) => {
  const { currentUser , fetchUserInfo } = useUserStore();
  const [avatar, setAvatar] = useState({ file: null, url: currentUser?.avatar || "/default-avatar.png" });
  const [username, setUsername] = useState(currentUser?.username || '');
  const [loading, setLoading] = useState(false);
  const profileRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imgUrl = avatar.file ? await upload(avatar.file) : avatar.url;

      await updateDoc(doc(db, "users", currentUser.id), {
        username,
        avatar: imgUrl,
        updatedAt: Date.now(),
      });

      await fetchUserInfo(currentUser.id);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setEdit(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setEdit]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div ref={profileRef} className="w-full max-w-md bg-darkblue2 rounded-lg shadow dark:border dark:bg-darkblue3 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update Profile
            </h1>
            <div onClick={() => setEdit(false)} className="cursor-pointer">
              <CgClose />
            </div>
          </div>
          <form className="space-y-4 md:space-y-6" onSubmit={handleUpdate}>
            <div>
              <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Upload an Avatar
              </label>
              <input type="file" id="file" className="hidden" onChange={handleAvatarChange} />
              <label htmlFor="file" className="cursor-pointer">
                <img src={avatar.url} alt="Avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />
              </label>
            </div>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Username"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileUpdate;
