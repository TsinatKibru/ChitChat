
import './userInfo.css'
import { useUserStore } from '../../../lib/userStore'
import { useEffect, useState } from 'react'
import UserProfileUpdate from './UserProfileUpdate';

const UserInfo = ({setActiveComponent}) => {

  const [edit ,setEdit]= useState(false);
  const {currentUser } = useUserStore()
  const handleSetActiveComp=()=>{
    setActiveComponent("Detail")
  }

  useEffect(()=>{console.log("edit" , edit)},[edit])
  return (
    <div className='userInfo'>
        <div className="user">
            <img className='img' src={currentUser?.avatar || "./avatar.png" }alt="" />
            <h3>{currentUser.username}</h3>
        </div>
        <div className="icons">
            <img onClick={handleSetActiveComp} className='img' src="./more.png" alt="" />
            <img className='img' src="./video.png" alt="" />
            <img onClick={()=>setEdit((prev)=> !prev)} className='img' src="./edit.png" alt="" />
        </div>
        {edit && <UserProfileUpdate setEdit={setEdit}/>}
    </div>
  )
}

export default UserInfo
