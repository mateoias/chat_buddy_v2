// src/pages/Home.jsx
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Home() {
  const features = [
    {
      title: "Beginner",
      description: "Start your language learning journey with guided conversations and simple vocabulary.",
      badge: "level-beginner",
      comingSoon: true
    },
    {
      title: "Intermediate", 
      description: "Practice conversations with limited vocabulary to achieve 90% comprehension and internalize grammar.",
      badge: "level-intermediate",
      comingSoon: true
    },
    {
      title: "Advanced",
      description: "Engage in free-flowing conversations to refine your fluency and expand your vocabulary.",
      badge: "level-advanced",
      comingSoon: true
    }
  ];

  return (
    <Layout 
      title="Welcome to Language Exchange AI"
      subtitle="Your personal AI-powered language learning companion"
    >
      {/* Hero Section */}
      <div className="text-center mb-5">
        <p className="lead mb-4">
          Practice conversations in your target language with an AI tutor that adapts to your skill level.
          Built with comprehensible input principles and TPRS methodology.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
          <Button as={Link} to="/login" variant="primary" size="lg" className="me-md-2">
            Start Learning
          </Button>
          <Button as={Link} to="/about" variant="outline-primary" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <Row className="g-4 mb-5">
        <Col md={12}>
          <h2 className="text-center mb-4">Choose Your Level</h2>
        </Col>
        {features.map((feature, index) => (
          <Col md={4} key={index}>
            <Card className="h-100 content-card border-0">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <span className={`level-badge ${feature.badge} me-2`}>
                    {feature.title}
                  </span>
                  {feature.comingSoon && (
                    <small className="text-muted">Coming Soon</small>
                  )}
                </div>
                <Card.Text className="flex-grow-1">
                  {feature.description}
                </Card.Text>
                <Button 
                  variant={feature.comingSoon ? "outline-secondary" : "primary"}
                  disabled={feature.comingSoon}
                >
                  {feature.comingSoon ? "Coming Soon" : "Start Practice"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA Section */}
      <div className="content-card text-center">
        <h3 className="mb-3">Ready to Start Your Language Journey?</h3>
        <p className="text-secondary mb-4">
          Join thousands of learners practicing with our AI conversation partner.
          No pressure, just natural conversation practice at your own pace.
        </p>
        <Button as={Link} to="/signup" variant="success" size="lg">
          Create Free Account
        </Button>
      </div>
    </Layout>
  );
}

export default Home;