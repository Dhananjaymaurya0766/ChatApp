import "./Chat.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";


function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [file, setFile] = useState(null);

  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const myId = decoded?.id;

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/profile",
          {
            headers: { Authorization: token }
          }
        );
        setProfile(res.data);
      } catch (err) {
        console.log("Profile error");
      }
    };

    fetchProfile();
  }, []);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/chat/users",
          {
            headers: { Authorization: token },
          }
        );
        setUsers(res.data);
      } catch (error) {
        console.log("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  // ================= SOCKET CONNECTION =================
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("join", myId);

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.senderId,
          message: data.message,
        },
      ]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ================= FETCH MESSAGES =================
  const fetchMessages = async (receiverId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/chat/${receiverId}`,
        {
          headers: { Authorization: token },
        }
      );
      setMessages(res.data);
    } catch (error) {
      console.log("Error fetching messages");
    }
  };

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
  if (!selectedUser) return;

  const formData = new FormData();

  formData.append("receiverId", selectedUser._id);
  formData.append("message", newMessage);

  if (file) {
    formData.append("media", file);
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/chat/send",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 🔥 socket (optional real-time)
    socketRef.current.emit("sendMessage", {
      senderId: myId,
      receiverId: selectedUser._id,
      message: newMessage,
      media : res.data.media,
    });

    // update UI
    setMessages((prev) => [
      ...prev,
      res.data,]);

    setNewMessage("");
    setFile(null); // ✅ clear file

  } catch (error) {
    console.log("Error sending message", error);
  }
  console.log("Message being sent:", newMessage);
};
  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
  };

  return (
    <div className="telegram-container">
       <div>
        <div className="profile-section" onClick={() => setShowProfile(true)}>
        <div className="profile-avatar">
         {profile?.name?.charAt(0).toUpperCase()}
        </div>

     <div className="profile-info">
     <div className="profile-name">{profile?.name}</div>
     <div className="profile-email">{profile?.email}</div>
     </div>
     
      </div>
       <div>
        
       </div>
       </div>
     { /* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">Chats</div>

        {users.map((user) => (
          <div
            key={user._id}
            className={`chat-item ${
              selectedUser?._id === user._id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              fetchMessages(user._id);
            }}
          >
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="chat-name">{user.name}</div>
              <div className="chat-email">{user.email}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        {selectedUser ? (
          <>
            <div className="chat-header">
              {selectedUser.name}
            </div>

            <div className="messages-area">
              {messages.map((msg, index) => {
  const senderId =
    typeof msg.sender === "object"
      ? msg.sender._id?.toString()
      : msg.sender?.toString();

  return (
    <div
      key={index}
      className={
        senderId === myId
          ? "message sent"
          : "message received"
      }
    >
      {msg.message && <p>{msg.message}</p>}

      {msg.media && (
        <img
          src={`http://localhost:5000/uploads/${msg.media}`}
          alt="media"
          className="chat-image"
        />
      )}
    </div>
  );
})}
            </div>

            <div className="input-area">
           <label className="file-btn">
            📎
           <input type="file"hidden onChange={(e) => setFile(e.target.files[0])}/>
           </label>
           <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write a message..."/>
           <button onClick={handleSend}>Send</button>
          </div>
          </>
        ) : (
          <div className="no-chat">
            Select a chat to start messaging
          </div>
        )}
      </div>
      {/* {Profile Features} */}
      {/* {showProfile && (console.log("showProfile:", showProfile))}   */}
      {showProfile && (
    <div className="profile-popup">
    <div className="profile-card">

      <button
        className="close-btn"
        onClick={() => setShowProfile(false)}
      >
        ✕
      </button>

      <div className="profile-avatar-large">
        {profile?.name?.charAt(0).toUpperCase()}
      </div>

      <h2>{profile?.name}</h2>
      <p>{profile?.email}</p>

      <div className="profile-actions">

        <button
          className="group-btn"
          onClick={() => setShowGroupModal(true)}
        >
          ➕ Create Group
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default Chat;