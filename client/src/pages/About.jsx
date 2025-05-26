// src/pages/About.jsx
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';

function About() {
  const levels = [
    {
      title: "Beginning",
      badge: "level-beginner",
      description: "This section is designed for users who are just starting out. This is the hardest part for an AI powered chatbot and it is still under construction."
    },
    {
      title: "Intermediate", 
      badge: "level-intermediate",
      description: "For learners who can hold a basic conversation. This section is fine tuned to help your listening ability and grammar knowledge. It limits vocabulary and focuses on letting you achieve 90% comprehension so that you can internalize grammatical structures."
    },
    {
      title: "Advanced",
      badge: "level-advanced", 
      description: "Aimed at users with solid speaking skills, this is the easiest type of language learning to automate. It is a sampling of prompts to make sure that you focus on language learning with minimal friction."
    }
  ];

  return (
    <Layout 
      title="About Language Exchange AI"
      subtitle="Computer-assisted language learning powered by AI"
    >
      {/* Author Section */}
      <div className="content-card mb-4">
        <h2 className="text-brand mb-3">About the Author</h2>
        <p className="lead">
          Welcome to the computer assisted language learning website. My name is <strong>Matthew Werth</strong> 
          and I have been a language teacher for many years. Currently I am working on 
          a number of automated tools to make life easier for language teachers and language learners.
        </p>
        <p>
          This tool is an automated language exchange chatbot for students who want to practice their 
          language skills. It is divided into three levels with fine tuned prompts to make language 
          learning easier. The guiding philosophy is <strong>CI with TPRS</strong>, especially at the lower levels.
        </p>
      </div>

      {/* Learning Levels */}
      <h2 className="text-center mb-4">Learning Levels</h2>
      <Row className="g-4 mb-5">
        {levels.map((level, index) => (
          <Col md={4} key={index}>
            <Card className="h-100 content-card border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <span className={`level-badge ${level.badge}`}>
                    {level.title}
                  </span>
                </div>
                <Card.Text>
                  {level.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Technology Section */}
      <div className="content-card mb-4">
        <h2 className="text-brand mb-3">About the Language Exchange Chatbot</h2>
        <p>
          The chatbot is powered by{' '}
          <a href="https://openai.com/api/" target="_blank" rel="noreferrer" className="text-decoration-none">
            OpenAI
          </a>, this is a wrapper for the GPT 4.0 model that has been optimized for conversation 
          based on the level that you choose.
        </p>

        <Row className="mt-4">
          <Col md={6}>
            <h5 className="text-secondary mb-3">Important Notes:</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Badge bg="info" className="me-2">Info</Badge>
                The model responses are usually factually accurate, but there is no guarantee and that isn't important for language learning
              </li>
              <li className="mb-2">
                <Badge bg="warning" className="me-2">Warning</Badge>
                GPT hallucinates sometimes, so if the conversation gets too weird, just change the topic and carry on
              </li>
              <li className="mb-2">
                <Badge bg="secondary" className="me-2">Note</Badge>
                You, the human, are ultimately responsible for what happens in these conversations. ChatGPT is generally 
                eager to please, so it's easy to get it to say weird and/or unsavory things, but that's usually because 
                the computer thinks that's what you wanted based on your side of the text.
              </li>
            </ul>
          </Col>
          <Col md={6}>
            <h5 className="text-secondary mb-3">Teaching Philosophy:</h5>
            <div className="bg-light p-3 rounded">
              <h6 className="fw-bold">Comprehensible Input (CI) with TPRS</h6>
              <p className="small mb-0">
                Our approach focuses on providing input that is slightly above your current level, 
                using Teaching Proficiency through Reading and Storytelling (TPRS) techniques to 
                make language acquisition natural and engaging.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contact Section */}
      <div className="content-card text-center">
        <h3 className="text-brand mb-3">Get in Touch</h3>
        <p className="text-secondary mb-3">
          Feel free to contact me with any comments or suggestions:
        </p>
        <a 
          href="mailto:mateoias@hotmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
        >
          📧 Send Email
        </a>
      </div>
    </Layout>
  );
}

export default About;