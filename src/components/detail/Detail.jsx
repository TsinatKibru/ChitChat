import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";

const Detail = ({ setActiveComponent }) => {
  const { changeBlock, chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log("blockError", error);
    }
  };
  return (
    <div className="detail ">
      <div className="header flex md:hidden items-center justify-start px-4 py-3  ">
        <FaArrowLeft
          className="back-icon text-gray-200 hover:text-gray-300 cursor-pointer"
          onClick={() => setActiveComponent("Chat")}
        />
      </div>
      <div className="user">
        <img src={user?.avatar || "/avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="/arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span>photo.png</span>
              </div>
              <img src="/download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span>photo.png</span>
              </div>
              <img src="/download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span>photo.png</span>
              </div>
              <img src="/download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
                <span>photo.png</span>
              </div>
              <img src="/download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "UNBlock User"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
