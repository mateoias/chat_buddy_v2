import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [chatInitialized, setChatInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat when component mounts
  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      // Get user info from server
      const userRes = await fetch('http://localhost:5000/get_user_info', {
        credentials: 'include',
      });
      const userData = await userRes.json();
      
      if (!userData.logged_in) {
        console.log('User not logged in');
        return;
      }
      
      setUserInfo(userData);

      // Start a new chat session
      const chatRes = await fetch('http://localhost:5000/start_chat', {
        method: 'POST',
        credentials: 'include',
      });
      const chatData = await chatRes.json();
      
      if (chatData.success) {
        // Set initial bot message
        setMessages([
          { 
            id: Date.now(), 
            text: `Hello! I'm here to help you practice ${userData.background?.target_lang || 'your target language'}. What would you like to talk about today?`, 
            sender: 'bot' 
          }
        ]);
        setChatInitialized(true);
      }
    } catch (err) {
      console.error('Error initializing chat:', err);
      setMessages([
        { 
          id: Date.now(), 
          text: "Sorry, I couldn't initialize the chat. Please try refreshing.", 
          sender: 'bot' 
        }
      ]);
    }
  };

  const resetChat = async () => {
    try {
      const res = await fetch('http://localhost:5000/reset_chat', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        // Reset frontend messages and reinitialize
        setMessages([]);
        setChatInitialized(false);
        await initializeChat();
      }
    } catch (err) {
      console.error('Error resetting chat:', err);
    }
  };

  const handleSend = async (text) => {
    if (!text.trim() || !chatInitialized) return;
  
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
  
    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({message: text})
      });
  
      const data = await res.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot'
      };
  
      setMessages(prev => [...prev, botMessage]);
  
    } catch (err) {
      console.error('Error communicating with server:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: 'bot'
      }]);
    }
  };

  if (!chatInitialized) {
    return (
      <div className="chat-container">
        <div className="loading-message">
          Initializing your personalized chat session...
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* User info display */}
      {userInfo && (
        <div className="user-info" style={{ 
          padding: '0.5rem', 
          backgroundColor: '#f0f0f0', 
          marginBottom: '1rem',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <strong>Learning:</strong> {userInfo.background?.native_lang} → {userInfo.background?.target_lang} | 
          <strong> Level:</strong> {userInfo.background?.skill_level} | 
          <strong> Messages:</strong> {userInfo.conversation_length}
        </div>
      )}

      {/* Messages */}
      {messages.map((msg) => (
        <div key={msg.id} className={`message-row ${msg.sender}`}>
          <div className={`message-bubble ${msg.sender}`}>
            <strong>{msg.sender === 'bot' ? 'Bot' : 'You'}:</strong><br />
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />

      {/* Reset Chat Button */}
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button
          onClick={resetChat}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Reset Chat
        </button>
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}

function ChatInput({ onSend }) {
  const [input, setInput] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={submit} style={{ marginTop: '1rem', display: 'flex' }}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ flexGrow: 1, padding: '0.5rem' }}
      />
      <button type="submit" style={{ marginLeft: '0.5rem' }}>Send</button>
    </form>
  );
}

export default Chat;