import { useEffect, useRef, useState } from "react";
import "./addUser.css";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../lib/userStore";
const AddUser = ({setAddMode}) => {
  const [user, setUser] = useState(null);

  const {currentUser} = useUserStore()
  const ref = useRef();

  const handleSearch = async (e) => {
   
    e.preventDefault();
    console.log("ksdhcb")
    const formData = new FormData(e.target);
    const username = formData.get("username");
    console.log("username",username)
    try {
      const userRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);
      console.log("querySnapShot.docs[0].data()",querySnapShot?.docs[0]?.data())

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }

    } catch (error) {
      console.log("searchError", error);
    }
  };

  const handleAdd= async()=>{

    const chatRef = collection(db , "chats");
    const userChatsRef = collection(db , "userchats");


    try {
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef,{
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef , user.id),{
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now()
        })
      })

      await updateDoc(doc(userChatsRef , currentUser.id),{
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now()
        })
      })

      console.log(newChatRef.id)

      toast.success("user Added")
      setAddMode(false)
      
    } catch (error) {
      console.log("userAddError" , error)
      
    }
      
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setAddMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setAddMode]);

  return (
    <div className="addUser" ref={ref}>
      <form onSubmit={handleSearch}>
        <input className="text-darkblue3" type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && 
      <div className="user">
      <div className="detail">
        <img src={user.avatar || "/avatar.png"} alt="" />
        <span>{user.username}</span>
      </div>
      <button onClick={handleAdd}>Add User</button>
    </div>
    }
    </div>
  );
};

export default AddUser;
