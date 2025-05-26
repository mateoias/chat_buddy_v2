// src/pages/FAQs.jsx
import { Accordion, Card, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';

function FAQs() {
  const faqs = [
    {
      question: "How does the AI conversation partner work?",
      answer: "Our AI uses OpenAI's GPT-4 model, fine-tuned with specific prompts for language learning. It adapts to your level and provides comprehensible input based on proven language acquisition principles."
    },
    {
      question: "What is Comprehensible Input (CI) and TPRS?",
      answer: "Comprehensible Input is language that you can understand even if you don't know every word. TPRS (Teaching Proficiency through Reading and Storytelling) is a method that uses stories and repetition to help you acquire language naturally, similar to how children learn their first language."
    },
    {
      question: "Do I need to know grammar rules before starting?",
      answer: "No! Our approach focuses on natural language acquisition. You'll pick up grammar patterns naturally through conversation, just like you did with your native language. Grammar explanations are available when you specifically ask for them."
    },
    {
      question: "What languages can I practice?",
      answer: "Currently we support Chinese, English, French, German, Italian, and Spanish. You can set your native language and target language when you sign up."
    },
    {
      question: "How accurate are the AI responses?",
      answer: "The AI is generally very accurate for language learning purposes. However, it may occasionally 'hallucinate' or provide incorrect factual information. This isn't a problem for language practice - just change the topic if the conversation gets too strange!"
    },
    {
      question: "Can I practice speaking and listening?",
      answer: "Audio features are coming soon! Currently, you can practice reading and writing. We're working on adding text-to-speech for listening practice and speech recognition for speaking practice."
    },
    {
      question: "What's the difference between the skill levels?",
      answer: "Beginner (coming soon) uses very simple vocabulary and structures. Intermediate limits vocabulary to help you achieve 90% comprehension. Advanced allows free conversation to build fluency."
    },
    {
      question: "Is my conversation data saved?",
      answer: "Currently, conversations are only stored for your session and are deleted when you end the chat or log out. In the future, we plan to add optional conversation history to track your progress."
    },
    {
      question: "Can I use this to replace a human language teacher?",
      answer: "This tool is designed to supplement, not replace, human instruction. It's perfect for getting extra conversation practice anytime, anywhere. For comprehensive language learning, we still recommend working with qualified teachers."
    },
    {
      question: "How often should I practice?",
      answer: "Consistency is key! Even 10-15 minutes daily is better than longer, infrequent sessions. The AI is available 24/7, so you can practice whenever it's convenient for you."
    }
  ];

  return (
    <Layout 
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about Language Exchange AI"
    >
      <div className="content-card mb-4">
        <div className="text-center mb-4">
          <Badge bg="info" className="fs-6 px-3 py-2">
            💡 Can't find your answer? Email us at mateoias@hotmail.com
          </Badge>
        </div>

        <Accordion defaultActiveKey="0">
          {faqs.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={index} className="mb-2">
              <Accordion.Header>
                <span className="fw-medium">{faq.question}</span>
              </Accordion.Header>
              <Accordion.Body>
                <p className="mb-0">{faq.answer}</p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Quick Tips Section */}
      <div className="content-card">
        <h3 className="text-brand mb-3">Quick Tips for Success</h3>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <span className="badge bg-success me-3 mt-1">1</span>
              <div>
                <h6 className="fw-bold">Don't worry about mistakes</h6>
                <small className="text-muted">The AI is patient and won't judge. Focus on communication, not perfection.</small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <span className="badge bg-success me-3 mt-1">2</span>
              <div>
                <h6 className="fw-bold">Stay in your target language</h6>
                <small className="text-muted">Try to respond in your target language even if you make errors.</small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <span className="badge bg-success me-3 mt-1">3</span>
              <div>
                <h6 className="fw-bold">Ask for help when needed</h6>
                <small className="text-muted">If you're confused, just type "I don't understand" in either language.</small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start">
              <span className="badge bg-success me-3 mt-1">4</span>
              <div>
                <h6 className="fw-bold">Practice regularly</h6>
                <small className="text-muted">Short, frequent sessions are more effective than long, infrequent ones.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FAQs;