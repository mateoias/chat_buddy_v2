import { useState } from 'react';
import './FAQs.css';

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the AI language chatbot work?",
      answer: "Our AI chatbot uses advanced GPT-4 technology to provide conversational practice in your target language. It adapts to your level and provides natural, contextual responses to help you improve your speaking skills."
    },
    {
      question: "What languages are currently supported?",
      answer: "We currently support Chinese, English, French, German, Italian, and Spanish. We're continuously working to add more languages based on user demand."
    },
    {
      question: "What's the difference between the three levels?",
      answer: "Beginner level uses simple vocabulary and basic grammar structures. Intermediate level introduces more complex sentences and everyday topics. Advanced level provides near-native conversations with sophisticated vocabulary and cultural nuances."
    },
    {
      question: "Is this suitable for complete beginners?",
      answer: "While our beginner level is designed to be as accessible as possible, having some basic knowledge of the language (alphabet, basic greetings) will help you get the most out of the experience."
    },
    {
      question: "How often should I practice?",
      answer: "We recommend daily practice sessions of 15-30 minutes for optimal results. Consistency is more important than duration - regular short sessions are better than occasional long ones."
    },
    {
      question: "Can I track my progress?",
      answer: "Currently, we don't have a formal progress tracking system, but we're working on implementing features like conversation history, vocabulary tracking, and proficiency assessments."
    },
    {
      question: "Is my conversation data saved?",
      answer: "Conversations are saved only for the duration of your session. When you log out or reset the chat, your conversation history is cleared to protect your privacy."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Yes! Our website is fully responsive and works on smartphones and tablets. Simply access it through your mobile browser."
    },
    {
      question: "What teaching methodology do you use?",
      answer: "We follow the Comprehensible Input (CI) approach with TPRS (Teaching Proficiency through Reading and Storytelling), especially at lower levels. This ensures you understand 90% of the content while learning new structures naturally."
    },
    {
      question: "How do I report issues or suggest improvements?",
      answer: "You can email us at mateoias@hotmail.com with any feedback, bug reports, or feature suggestions. We value user input and use it to improve the platform."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faqs-page">
      <h1>Frequently Asked Questions</h1>
      <p className="faqs-intro">
        Find answers to common questions about our AI-powered language learning platform.
      </p>

      <div className="faqs-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className={`faq-question ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faqs-footer">
        <h2>Still have questions?</h2>
        <p>
          Feel free to reach out to us at{' '}
          <a href="mailto:mateoias@hotmail.com">mateoias@hotmail.com</a>
        </p>
      </div>
    </div>
  );
}

export default FAQs;