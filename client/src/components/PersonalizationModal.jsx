import { useState } from 'react';
import './PersonalizationModal.css';

function PersonalizationModal({ onComplete, onSkip }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // PLACEHOLDER FIELDS - We'll revise these based on chat needs
    skillLevel: 'beginner',
    learningGoals: '',
    preferredTopics: [],
    name: '',
    // Add more fields as needed
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/save_personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Personalization saved:', data);
        onComplete(formData);
      } else {
        throw new Error('Failed to save personalization');
      }
    } catch (error) {
      console.error('Error saving personalization:', error);
      alert('Failed to save preferences. You can continue without them.');
      onSkip();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip personalization? You can always update your preferences later.')) {
      onSkip();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Personalize Your Learning Experience</h2>
          <p>Help us tailor your conversations to your needs</p>
        </div>

        <form onSubmit={handleSubmit} className="personalization-form">
          {/* PLACEHOLDER FORM CONTENT - TO BE REVISED */}
          <div className="form-section">
            <h3>📚 Current Level</h3>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="skillLevel"
                  value="beginner"
                  checked={formData.skillLevel === 'beginner'}
                  onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                />
                <span>Beginner - I know basic words and phrases</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="skillLevel"
                  value="intermediate"
                  checked={formData.skillLevel === 'intermediate'}
                  onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                />
                <span>Intermediate - I can have simple conversations</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="skillLevel"
                  value="advanced"
                  checked={formData.skillLevel === 'advanced'}
                  onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                />
                <span>Advanced - I want to refine my fluency</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>🎯 What's your main goal?</h3>
            <textarea
              placeholder="E.g., I want to travel to Germany next year, I need business German for work, etc."
              value={formData.learningGoals}
              onChange={(e) => setFormData({...formData, learningGoals: e.target.value})}
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-section">
            <h3>💬 Topics you're interested in</h3>
            <p className="form-hint">Select all that apply - this helps make conversations more engaging</p>
            {/* PLACEHOLDER CHECKBOXES */}
            <div className="checkbox-grid">
              {['Travel', 'Food', 'Sports', 'Technology', 'Culture', 'Business'].map(topic => (
                <label key={topic} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={topic}
                    checked={formData.preferredTopics.includes(topic)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, preferredTopics: [...formData.preferredTopics, topic]});
                      } else {
                        setFormData({...formData, preferredTopics: formData.preferredTopics.filter(t => t !== topic)});
                      }
                    }}
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>👋 What should we call you?</h3>
            <input
              type="text"
              placeholder="Your name or nickname (optional)"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-input"
            />
          </div>

          {/* PLACEHOLDER FOR ADDITIONAL FIELDS */}
          <div className="form-placeholder">
            <p>📝 Additional personalization fields will go here based on chat requirements</p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleSkip}
              className="btn-secondary"
              disabled={isLoading}
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Start Learning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonalizationModal;