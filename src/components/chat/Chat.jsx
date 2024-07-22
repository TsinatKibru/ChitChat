import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { toast } from "react-toastify";
import { useUserStore } from "../../lib/userStore";
import upload from "../../services/upload";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa"; // Using react-icons for the three-dotted icon
import { BiDetail } from "react-icons/bi";

const Chat = ({ setActiveComponent }) => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const endRef = useRef(null);
  const ref = useRef();

  const { chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();

  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unsub();
    };
  }, [chatId]);

  console.log(chat);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log("messagesendError", error);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
  };
  const handleSetActiveComp=()=>{
    setDropdownOpen(false)
    setActiveComponent("Detail")
  }
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDropdownOpen]);

  return (
    <div className="chat">
      <div className="top">
      <div className="header flex md:hidden justify-start  -mr-10  ">
        <FaArrowLeft
          className="back-icon text-white hover:text-gray-300 cursor-pointer"
          onClick={() => setActiveComponent("List")}
        />
      </div>
        <div className="user">
          <img src={user?.avatar || "/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="md:hidden relative">
          <FaEllipsisV
            className="w-6 h-6  cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="iconsm absolute shadow-md p-2 rounded-lg right-5 bg-darkblue3 border-gray-500 border-2" ref={ref}>
            <div className="flex items-center mb-2 ">
              <img src="/phone.png" alt="phone" className="w-5 h-5 mr-2" />
              <span className="text-white text-sm">Phone</span>
            </div>
            <div className="flex items-center mb-2">
              <img src="/video.png" alt="video" className="w-5 h-5 mr-2" />
              <span className="text-white text-sm">Video</span>
            </div>
           
            <div className="flex items-center mb-2 cursor-pointer" onClick={handleSetActiveComp}>
            <img src="/info.png" alt="info" className="w-5 h-5 mr-2" />
              <span className="text-white text-sm">Details</span>
            </div>
          </div>
          
          )}
        </div>

        <div className="icons">
          <img src="/phone.png" alt="" />
          <img src="/video.png" alt="" />
          <img src="/info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              {message.text && <p>{message.text}</p>}
              <span>1 min ago</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img?.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            {" "}
            <img src="/img.png" alt="" />
          </label>

          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          {/* <img src="/camera.png" alt="" />
          <img src="/mic.png" alt="" /> */}
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "Blocked! Can't chat"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="/emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
