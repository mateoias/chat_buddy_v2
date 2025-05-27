import React, { useState, useEffect, useRef, useCallback } from 'react';
import { franc } from 'franc-min'; // Language detection library

// Language code mapping
const LANG_CODE_MAP = {
  'eng': 'en',  // English
  'spa': 'es',  // Spanish  
  'fra': 'fr',  // French
  'deu': 'de',  // German
  'ita': 'it',  // Italian
  'cmn': 'zh',  // Chinese (Mandarin)
  'por': 'pt',  // Portuguese
  'rus': 'ru',  // Russian
  'jpn': 'ja',  // Japanese
  'kor': 'ko',  // Korean
};

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false); // Simple flag to prevent all duplicates
  const lastAutoPlayedIdRef = useRef(null); // Track last auto-played message

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat when component mounts
  useEffect(() => {
    initializeChat();
  }, []);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      isPlayingRef.current = false;
    };
  }, []);

  // Simple auto-play logic - only when messages change and it's a new bot message
  useEffect(() => {
    if (messages.length === 0 || isPlayingRef.current) return;
    
    const lastMessage = messages[messages.length - 1];
    
    // Auto-play only bot messages that we haven't auto-played yet
    if (lastMessage && 
        lastMessage.sender === 'bot' && 
        lastMessage.id !== lastAutoPlayedIdRef.current) {
      
      console.log('Auto-playing bot message:', lastMessage.id);
      lastAutoPlayedIdRef.current = lastMessage.id;
      
      // Small delay to ensure message is rendered
      setTimeout(() => {
        if (!isPlayingRef.current) { // Double-check we're not playing anything
          playAudio(lastMessage.id, lastMessage.text, lastMessage.sender, true);
        }
      }, 200);
    }
  }, [messages]);

  const detectLanguage = (text) => {
    try {
      const detectedLang = franc(text);
      const mappedLang = LANG_CODE_MAP[detectedLang];
      
      if (!mappedLang) {
        return null;
      }
      
      console.log(`Detected language: ${detectedLang} -> ${mappedLang}`);
      return mappedLang;
    } catch (error) {
      console.log('Language detection failed:', error);
      return null;
    }
  };

  const determineLanguageForTTS = (text, sender) => {
    if (sender === 'bot' && userInfo?.background?.target_lang) {
      return userInfo.background.target_lang;
    }
    
    if (sender === 'user') {
      const detectedLang = detectLanguage(text);
      
      if (detectedLang) {
        console.log(`Using detected language ${detectedLang} for TTS`);
        return detectedLang;
      }
      
      const hasNonAscii = /[^\x00-\x7F]/.test(text);
      if (hasNonAscii && userInfo?.background?.target_lang) {
        return userInfo.background.target_lang;
      }
      
      return userInfo?.background?.native_lang || 'en';
    }
    
    return 'en';
  };

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      const userRes = await fetch('http://localhost:5000/get_user_info', {
        credentials: 'include',
      });
      const userData = await userRes.json();
      
      if (!userData.logged_in) {
        console.log('User not logged in');
        return;
      }
      
      setUserInfo(userData);

      const chatRes = await fetch('http://localhost:5000/start_chat', {
        method: 'POST',
        credentials: 'include',
      });
      const chatData = await chatRes.json();
      
      if (chatData.success) {
        const welcomeMessage = { 
          id: Date.now(), 
          text: `Hello!`,
          //  I'm here to help you practice ${userData.background?.target_lang || 'your target language'}. What would you like to talk about today?`, 
          sender: 'bot' 
        };
        
        setMessages([welcomeMessage]);
        setChatInitialized(true);
      }
    } catch (err) {
      console.error('Error initializing chat:', err);
      const errorMessage = { 
        id: Date.now(), 
        text: "Sorry, I couldn't initialize the chat. Please try refreshing.", 
        sender: 'bot' 
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      setIsLoading(true);
      stopAudio();
      lastAutoPlayedIdRef.current = null;
      
      const res = await fetch('http://localhost:5000/reset_chat', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setMessages([]);
        setChatInitialized(false);
        await initializeChat();
      }
    } catch (err) {
      console.error('Error resetting chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    console.log('Stopping audio');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingAudio(null);
    isPlayingRef.current = false;
  };

  const handleSend = async (text) => {
    if (!text.trim() || !chatInitialized || isLoading) return;
  
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
  
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
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized playAudio function to prevent recreation on every render
  const playAudio = useCallback(async (messageId, text, sender, isAutoPlay = false) => {
    try {
      console.log(`playAudio: ${messageId}, auto: ${isAutoPlay}, playing: ${isPlayingRef.current}`);
      
      // If audio is already playing, handle stop/start logic
      if (isPlayingRef.current) {
        if (!isAutoPlay && playingAudio === messageId) {
          // Manual click on currently playing message - stop it
          console.log('Stopping currently playing audio');
          stopAudio();
          return;
        } else {
          // Already playing something else or auto-play while playing - ignore
          console.log('Audio already playing, ignoring request');
          return;
        }
      }

      // Set the flag immediately to prevent any other calls
      isPlayingRef.current = true;
      setPlayingAudio(messageId);

      // Get language for TTS
      const language = determineLanguageForTTS(text, sender);
      console.log(`Playing audio in ${language} (${isAutoPlay ? 'auto' : 'manual'})`);

      // Request TTS from server
      const response = await fetch('http://localhost:5000/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          text: text,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and configure audio element
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        console.log('Audio ended');
        setPlayingAudio(null);
        isPlayingRef.current = false;
        URL.revokeObjectURL(audioUrl);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };
      
      audio.onerror = (error) => {
        console.error('Audio error:', error);
        setPlayingAudio(null);
        isPlayingRef.current = false;
        URL.revokeObjectURL(audioUrl);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };

      audioRef.current = audio;
      await audio.play();
      console.log('Audio started playing');

    } catch (err) {
      console.error('playAudio error:', err);
      setPlayingAudio(null);
      isPlayingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [userInfo, playingAudio]);

  // Debounced button click handler to prevent double-clicks
  const handleAudioButtonClick = useCallback((messageId, text, sender) => {
    // Prevent rapid clicks
    if (Date.now() - (handleAudioButtonClick.lastClick || 0) < 500) {
      console.log('Preventing rapid click');
      return;
    }
    handleAudioButtonClick.lastClick = Date.now();
    
    playAudio(messageId, text, sender, false);
  }, [playAudio]);

  if (!chatInitialized && isLoading) {
    return (
      <div className="page-layout">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="chat-container d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Initializing your personalized chat session...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="content-card">
              <div className="chat-container">
                {/* User info display */}
                {userInfo && (
                  <div className="user-info mb-3">
                    <div className="row text-center text-md-start">
                      <div className="col-md-4 mb-2 mb-md-0">
                        <strong>Learning:</strong> {userInfo.background?.native_lang?.toUpperCase()} → {userInfo.background?.target_lang?.toUpperCase()}
                      </div>
                      <div className="col-md-4 mb-2 mb-md-0">
                        <strong>Level:</strong> 
                        <span className={`level-badge level-${userInfo.background?.skill_level} ms-2`}>
                          {userInfo.background?.skill_level}
                        </span>
                      </div>
                      <div className="col-md-4">
                        <strong>Messages:</strong> <span className="badge bg-secondary">{userInfo.conversation_length}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Area */}
                <div className="messages-area" style={{ height: '60vh', overflowY: 'auto', padding: '1rem', border: '1px solid var(--bg-tertiary)', borderRadius: 'var(--border-radius)', marginBottom: '1rem' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`message-bubble ${msg.sender} ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-lg)', position: 'relative' }}>
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <small className="fw-bold opacity-75">
                            {msg.sender === 'bot' ? '🤖 AI Tutor' : '👤 You'}
                          </small>
                          <button
                            onClick={() => handleAudioButtonClick(msg.id, msg.text, msg.sender)}
                            className={`btn btn-sm ms-2 ${msg.sender === 'user' ? 'btn-outline-light' : 'btn-outline-primary'}`}
                            style={{ 
                              border: 'none', 
                              background: 'none', 
                              padding: '0.25rem',
                              fontSize: '0.875rem',
                              opacity: playingAudio === msg.id ? 1 : 0.7
                            }}
                            title={playingAudio === msg.id ? "Stop audio" : "Play audio"}
                            disabled={isLoading}
                          >
                            {playingAudio === msg.id ? (
                              <i className="bi bi-stop-fill"></i>
                            ) : (
                              <i className="bi bi-volume-up-fill"></i>
                            )}
                          </button>
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="d-flex justify-content-start mb-3">
                      <div className="message-bubble bot bg-light" style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-lg)' }}>
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <em className="text-muted">AI is thinking...</em>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <ChatInput onSend={handleSend} disabled={isLoading} />

                {/* Reset Chat Button */}
                <div className="text-center mt-3 pt-3 border-top">
                  <button
                    onClick={resetChat}
                    className="btn btn-outline-danger btn-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </span>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Start New Conversation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={submit} className="d-flex gap-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={disabled ? "Please wait..." : "Type your message in any language..."}
        className="form-control"
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={disabled || !input.trim()}
        style={{ minWidth: '80px' }}
      >
        {disabled ? (
          <span className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </span>
        ) : (
          <>
            <i className="bi bi-send me-1"></i>
            Send
          </>
        )}
      </button>
    </form>
  );
}

export default Chat;