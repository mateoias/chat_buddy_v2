// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import Layout from '../components/Layout';

function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, what would you like to talk about today?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input when loading finishes
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const resetChat = async () => {
    try {
      const res = await fetch('http://localhost:5000/reset_chat', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setMessages([
          { id: Date.now(), text: 'Hello, what would you like to talk about today?', sender: 'bot' }
        ]);
      }
    } catch (err) {
      console.error('Error resetting chat:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: inputText })
      });

      const data = await res.json();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Language Practice Chat" maxWidth="xl">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          {/* Single Chat Container - Much more compact */}
          <Card className="chat-container" style={{ height: '75vh' }}>
            <Card.Body className="d-flex flex-column p-0" style={{ height: '100%' }}>
              {/* Messages Area - More space for messages */}
              <div 
                className="overflow-auto px-3 py-2" 
                style={{ 
                  flex: '1 1 0%', 
                  minHeight: 0,
                  maxHeight: 'calc(75vh - 80px)' // Much smaller input area
                }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`d-flex mb-1 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`message-bubble ${msg.sender}`} style={{ 
                      padding: '6px 10px', 
                      fontSize: '0.9rem',
                      lineHeight: '1.2'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="d-flex justify-content-start mb-1">
                    <div className="message-bubble bot" style={{ padding: '6px 10px' }}>
                      <Spinner animation="border" size="sm" className="me-2" />
                      AI is thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Much more compact */}
              <div className="border-top px-3 py-2" style={{ flexShrink: 0 }}>
                <Form onSubmit={handleSend}>
                  <Row className="align-items-center g-2">
                    <Col>
                      <Form.Control
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message in your target language..."
                        disabled={loading}
                        style={{ fontSize: '0.95rem' }}
                        autoFocus
                      />
                    </Col>
                    <Col xs="auto">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="sm"
                        disabled={loading || !inputText.trim()}
                      >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Send'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card.Body>
          </Card>

          {/* Action Buttons - More compact */}
          <Row className="mt-2">
            <Col className="text-center">
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={resetChat}
                  disabled={loading}
                >
                  🔄 Reset
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  disabled={true}
                >
                  🔊 Audio (Soon)
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  disabled={true}
                >
                  🎤 Voice (Soon)
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  disabled={true}
                >
                  ⚙️ Speed (Soon)
                </Button>
              </div>
              <small className="text-muted d-block mt-1" style={{ fontSize: '0.8rem' }}>
                Practice typing first, then we'll add audio features!
              </small>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export default Chat;