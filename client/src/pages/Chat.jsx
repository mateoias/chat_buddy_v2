import React, { useState, useEffect, useRef } from 'react';
import { franc } from 'franc-min';
import './Chat.css';

// Language code mapping
const LANG_CODE_MAP = {
  'eng': 'en', 'spa': 'es', 'fra': 'fr', 'deu': 'de', 
  'ita': 'it', 'cmn': 'zh', 'por': 'pt', 'rus': 'ru', 
  'jpn': 'ja', 'kor': 'ko'
};

function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, what would you like to talk about today?', sender: 'bot' }
  ]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Get user info on mount
  useEffect(() => {
    checkUserAndPersonalization();
  }, []);

  const checkUserAndPersonalization = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_user_info', { 
        credentials: 'include' 
      });
      const data = await response.json();
      
      if (data.logged_in) {
        setUserInfo(data);
        
    initializePersonalizedChat(data);


      }
    } catch (err) {
      console.error('Error getting user info:', err);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const initializePersonalizedChat = (userData) => {
    // Create a personalized welcome message based on user preferences
    let welcomeMessage = `Hello${userData.personalization?.name ? ' ' + userData.personalization.name : ''}! `;
    
    if (userData.personalization?.skillLevel === 'beginner') {
      welcomeMessage += "Let's start with something simple. ";
    } else if (userData.personalization?.skillLevel === 'intermediate') {
      welcomeMessage += "Ready to practice your conversation skills? ";
    } else {
      welcomeMessage += "Let's have an advanced conversation. ";
    }
    
    if (userData.personalization?.preferredTopics?.length > 0) {
      welcomeMessage += `Would you like to talk about ${userData.personalization.preferredTopics[0].toLowerCase()}?`;
    } else {
      welcomeMessage += "What would you like to talk about today?";
    }
    
    setMessages([{ id: 1, text: welcomeMessage, sender: 'bot' }]);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const detectLanguage = (text) => {
    try {
      const detected = franc(text);
      return LANG_CODE_MAP[detected] || null;
    } catch (error) {
      console.error('Language detection failed:', error);
      return null;
    }
  };

  const getLanguageForTTS = (text, sender) => {
    // For BOT messages: Need to be smarter about language choice
    if (sender === 'bot') {
      // Detect if the bot is speaking in the user's native language
      // Look for common patterns that indicate native language explanation
      const detected = detectLanguage(text);
      
      // If bot's text is detected as user's native language, use native voice
      if (detected && detected === userInfo?.background?.native_lang) {
        console.log(`Bot speaking in native language: ${detected}`);
        return detected;
      }
      
      // Check for explicit language markers or mixed content
      const hasNativeLanguageMarkers = (
        text.includes("in English") || 
        text.includes("means") || 
        text.includes("translation") ||
        text.includes("In " + getNativeLanguageName(userInfo?.background?.native_lang))
      );
      
      if (hasNativeLanguageMarkers) {
        console.log(`Bot appears to be explaining in native language`);
        return userInfo?.background?.native_lang || 'en';
      }
      
      // Default: bot speaks in target language
      console.log(`Bot speaking in target language: ${userInfo?.background?.target_lang}`);
      return userInfo?.background?.target_lang || 'en';
    }
    
    // For USER messages:
    // First try to detect the language they're actually speaking
    const detected = detectLanguage(text);
    
    if (detected) {
      console.log(`User text detected as: ${detected}`);
      return detected;
    }
    
    // If detection fails, check if the text has non-ASCII characters
    const hasNonAscii = /[^\x00-\x7F]/.test(text);
    if (hasNonAscii && userInfo?.background?.target_lang) {
      console.log(`Non-ASCII detected, using target language: ${userInfo.background.target_lang}`);
      return userInfo.background.target_lang;
    }
    
    // Last resort: assume they're speaking their target language (since they're practicing)
    console.log(`Defaulting to target language: ${userInfo?.background?.target_lang || 'en'}`);
    return userInfo?.background?.target_lang || userInfo?.background?.native_lang || 'en';
  };

  // Helper function to get language name
  const getNativeLanguageName = (langCode) => {
    const languages = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'zh': 'Chinese'
    };
    return languages[langCode] || 'English';
  };

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;
  
    // Add user message
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: text })
      });
  
      const data = await res.json();
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || "Sorry, I couldn't understand that.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
  
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please try again.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudio = async (messageId, text, sender) => {
    // Prevent double-processing
    if (isProcessingAudio) return;
    setIsProcessingAudio(true);

    // If clicking the currently playing audio, stop it
    if (playingAudioId === messageId) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingAudioId(null);
      setIsProcessingAudio(false);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';  // Clear the source
      audioRef.current = null;
    }

    try {
      setPlayingAudioId(messageId);
      
      const language = getLanguageForTTS(text, sender);
      
      const response = await fetch('http://localhost:5000/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text, language })
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setPlayingAudioId(null);
        setIsProcessingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setPlayingAudioId(null);
        setIsProcessingAudio(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Audio playback failed');
      };

      await audio.play();
      
    } catch (err) {
      console.error('Audio error:', err);
      setPlayingAudioId(null);
      setIsProcessingAudio(false);
    }
  };

  const resetChat = async () => {
    try {
      await fetch('http://localhost:5000/reset_chat', {
        method: 'POST',
        credentials: 'include',
      });
      
      setMessages([
        { id: Date.now(), text: 'Hello, what would you like to talk about today?', sender: 'bot' }
      ]);
      setPlayingAudioId(null);
      audioRef.current?.pause();
      
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Show loading while checking user
  if (isCheckingUser) {
    return (
      <div className="chat-page">
        <div className="chat-container">
          <div className="loading-container">
            <p>Loading your personalized experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      
      <div className="chat-container">
        {/* Simple user info bar */}
        {userInfo && (
          <div className="user-info-bar">
            <span>Learning: {userInfo.background?.target_lang?.toUpperCase()}</span>
            <span>Level: {userInfo.background?.skill_level}</span>
          </div>
        )}

        {/* Messages */}
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              <div className={`message-bubble ${msg.sender}`}>
                <div className="message-header">
                  <strong>{msg.sender === 'bot' ? '🤖 Bot' : '👤 You'}</strong>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(msg.id, msg.text, msg.sender);
                    }}
                    className="audio-button"
                    disabled={isLoading || isProcessingAudio}
                    aria-label={playingAudioId === msg.id ? "Stop audio" : "Play audio"}
                  >
                    {playingAudioId === msg.id ? '⏹' : '🔊'}
                  </button>
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message-row bot">
              <div className="message-bubble bot loading">
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />

        {/* Reset button */}
        <div className="chat-actions">
          <button onClick={resetChat} className="reset-button">
            Reset Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple input component
function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={disabled ? "Please wait..." : "Type your message..."}
        disabled={disabled}
        className="chat-input"
      />
      <button type="submit" disabled={disabled || !input.trim()} className="send-button">
        Send
      </button>
    </form>
  );
}

export default Chat;