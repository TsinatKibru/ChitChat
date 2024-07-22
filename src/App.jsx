import { useEffect, useState } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"

const App = () => {

  const {currentUser , isLoading ,fetchUserInfo} = useUserStore()
  const [activeComponent, setActiveComponent] = useState("List");
  useEffect(()=>{
    console.log("activeComponent",activeComponent)
  },[activeComponent])

  const {chatId} = useChatStore()
  useEffect(()=>{
    const unSub = onAuthStateChanged(auth , (user)=>{
      fetchUserInfo(user?.uid)
    })
    return ()=>{
      unSub();
    }
  },[fetchUserInfo])

  console.log(currentUser)

  if (isLoading) return (
    <div className="loading">Loading...</div>
  )

  

  return (
    <div className='container'>
     {currentUser?(
       <>
       <div className={`${activeComponent === "List" ? "block md:block" : "hidden md:block"} flex-1`}><List setActiveComponent={setActiveComponent}/></div>
       {chatId &&  <div className={`${activeComponent === "Chat" ? "block md:block" : "hidden md:block"} flex-2` }><Chat setActiveComponent={setActiveComponent}/></div>}
       {chatId &&  <div className={`${activeComponent === "Detail" ? "block md:block" : "hidden md:block"} flex-1`}><Detail setActiveComponent={setActiveComponent}/></div>}
      
       </>
     ):(<Login/>)}
     <Notification/>
    </div>
  )
}

export default App