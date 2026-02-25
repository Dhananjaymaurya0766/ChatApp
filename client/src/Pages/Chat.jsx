import "./Chat.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const myId = decoded.id;

  // Fetch users
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

  // Fetch messages
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await axios.post(
        "http://localhost:5000/chat/send",
        {
          receiverId: selectedUser._id,
          message: newMessage,
        },
        {
          headers: { Authorization: token },
        }
      );

      setNewMessage("");
      fetchMessages(selectedUser._id);
    } catch (error) {
      console.log("Error sending message");
    }
  };

  return (
    <div className="telegram-container">
      {/* Sidebar */}
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
             {user?.name ? user.name.charAt(0).toUpperCase() : ""}
            </div>
            <div>
              <div className="chat-name">{user.name}</div>
              <div className="chat-email">{user.email}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="chat-section">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="chat-header">
              {selectedUser.name}
            </div>

            {/* Messages */}
            <div className="messages-area">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={
                    msg.sender === myId
                      ? "message sent"
                      : "message received"
                  }
                >
                  {msg.message}
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="input-area">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;