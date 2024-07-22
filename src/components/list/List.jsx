
import './list.css'
import UserInfo from './userinfo/UserInfo'
import ChatList from './chatlist/ChatList'

const List = ({setActiveComponent}) => {
  return (
    <div className='list'>
     <UserInfo setActiveComponent={setActiveComponent}/>
     <ChatList setActiveComponent={setActiveComponent}/>
    </div>
  )
}

export default List
