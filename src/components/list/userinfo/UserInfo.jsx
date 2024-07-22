
import './userInfo.css'
import { useUserStore } from '../../../lib/userStore'

const UserInfo = ({setActiveComponent}) => {

  
  const {currentUser } = useUserStore()
  const handleSetActiveComp=()=>{
    setActiveComponent("Detail")
  }
  return (
    <div className='userInfo'>
        <div className="user">
            <img className='img' src={currentUser?.avatar || "./avatar.png" }alt="" />
            <h3>{currentUser.username}</h3>
        </div>
        <div className="icons">
            <img onClick={handleSetActiveComp} className='img' src="./more.png" alt="" />
            <img className='img' src="./video.png" alt="" />
            <img className='img' src="./edit.png" alt="" />
        </div>
    </div>
  )
}

export default UserInfo
