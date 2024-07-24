import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FaArrowLeft, FaLock, FaSignOutAlt, FaUnlock } from "react-icons/fa";
import { useEffect, useState } from "react";

const Detail = ({ setActiveComponent }) => {
  const { changeBlock, chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [images, setImages] = useState([]);
  const [isPhotosVisible, setIsPhotosVisible] = useState(false);

  const togglePhotosVisibility = () => {
    setIsPhotosVisible(!isPhotosVisible);
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
      const items = res.data().messages;

      setImages(items);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

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

  const getImageName = (url) => {
    if (!url) return '';
    try {
      const pathPart = url.split("/o/")[1];
      const encodedImagePath = pathPart.split("?")[0];
      const decodedImagePath = decodeURIComponent(encodedImagePath);
      const segments = decodedImagePath.split("/");
      const lastSegment = segments.pop();
      const imageName = lastSegment.split(")").pop();
      return imageName || 'downloaded_image';
    } catch (error) {
      console.error('Failed to parse image URL:', error);
      return 'downloaded_image';
    }
  };

  const imgURL =
    "https://firebasestorage.googleapis.com/v0/b/reactchat-98195.appspot.com/o/images%2FFri%20Jul%2019%202024%2013%3A52%3A50%20GMT%2B0300%20(East%20Africa%20Time)favicon.png?alt=media&token=e8142d31-e5a9-490a-a393-118c621f58a2";
  const imageName = getImageName(imgURL);
  console.log(imageName);
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
          <div className="title" onClick={togglePhotosVisibility} >
            <span>Shared Photos</span>
            {/* <img src="/arrowDown.png" alt="" /> */}
            <img src={isPhotosVisible ? "/arrowUp.png" : "/arrowDown.png"} alt="Toggle arrow" />
          </div>
          
           {isPhotosVisible && (
          <div className="photos">
            {images?.length > 0 ? (
              images.map((item) => {
                const { img, createdAt } = item;

                // Skip items without an image
                if (!img) return null;

                return (
                  <div
                    className="flex justify-between items-center"
                    key={createdAt}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="w-10 h-10 object-cover"
                        src={img}
                        alt={getImageName(img)}
                      />
                      <span>{getImageName(img)}</span>
                    </div>
                    <a href={img} download={getImageName(img)} >
                      <img
                        className="w-5 h-5 object-cover"
                        src="/download.png"
                        alt="Download"
                      />
                    </a>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-lg italic mt-4">...No images available</p>

            )}
          </div>
          )}
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        {/* <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "UNBlock User"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button> */}

        <button
          onClick={handleBlock}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${
            isCurrentUserBlocked
              ? "bg-red-500 text-white cursor-not-allowed"
              : isReceiverBlocked
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {isCurrentUserBlocked ? (
            <>
              <FaLock />
              You are blocked
            </>
          ) : isReceiverBlocked ? (
            <>
              <FaUnlock />
              UNBlock User
            </>
          ) : (
            <>
              <FaLock />
              Block User
            </>
          )}
        </button>

        <button
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded logout"
          onClick={() => auth.signOut()}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
