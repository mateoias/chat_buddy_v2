import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Personalization.css';

function Personalization() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    currentLocation: '',
    workStudy: '',
    freeTime: '',
    travelDestinations: '',
    favoriteActivities: '',
    familyFriends: '',
    pets: '',
    hobbies: ''
  });

  // Load existing personalization data if user is updating
  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_personalization', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.personalization) {
          setFormData(data.personalization);
        }
      }
    } catch (error) {
      console.error('Error loading personalization:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

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
          console.log('Personalization saved successfully');
          console.log('Session storage loggedIn:', sessionStorage.getItem('loggedIn'));
        navigate('/chat');
      } else {
        throw new Error('Failed to save personalization');
      }
    } catch (error) {
      console.error('Error saving personalization:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip personalization? You can always add this information later.')) {
      navigate('/chat');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoadingData) {
    return (
      <div className="personalization-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personalization-page">
      <div className="personalization-container">
        <h1>Personalize Your Experience</h1>
        
        <div className="intro-message">
          <p>
            If we have some basic information about you we will be able to personalize 
            our conversation more quickly and our conversations will be more interesting 
            and easier to remember. Please answer some or all of the following questions 
            briefly. We will add more information as the chat progresses.
          </p>
          <p className="reminder">
            <strong>Just a reminder:</strong> You can change or delete your personal 
            information at any time. Also, it doesn't have to be true! It's just 
            something we can talk about, so if you want a pet alligator.......
          </p>
        </div>

        <form onSubmit={handleSubmit} className="personalization-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">What name shall we call you?</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your name or nickname"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nationality">What is your nationality?</label>
              <input
                type="text"
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                placeholder="e.g., American, French, Japanese"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentLocation">Where do you currently live?</label>
              <input
                type="text"
                id="currentLocation"
                value={formData.currentLocation}
                onChange={(e) => handleChange('currentLocation', e.target.value)}
                placeholder="City, Country"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="workStudy">Where do you currently work/study?</label>
              <input
                type="text"
                id="workStudy"
                value={formData.workStudy}
                onChange={(e) => handleChange('workStudy', e.target.value)}
                placeholder="Company, school, or field of work"
                className="form-input"
              />
            </div>
          </div>

          {/* Interests Section */}
          <div className="form-section">
            <h2>Your Interests</h2>
            
            <div className="form-group">
              <label htmlFor="freeTime">What do you like to do in your free time?</label>
              <textarea
                id="freeTime"
                value={formData.freeTime}
                onChange={(e) => handleChange('freeTime', e.target.value)}
                placeholder="Tell us about your free time activities..."
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="travelDestinations">Where do you like to travel?</label>
              <textarea
                id="travelDestinations"
                value={formData.travelDestinations}
                onChange={(e) => handleChange('travelDestinations', e.target.value)}
                placeholder="Favorite destinations or dream trips..."
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="favoriteActivities">What are your favorite activities?</label>
              <textarea
                id="favoriteActivities"
                value={formData.favoriteActivities}
                onChange={(e) => handleChange('favoriteActivities', e.target.value)}
                placeholder="Sports, arts, outdoor activities, etc..."
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Personal Life Section */}
          <div className="form-section">
            <h2>Personal Life</h2>
            
            <div className="form-group">
              <label htmlFor="familyFriends">
                Who are your closest family members and friends? Tell us about them
              </label>
              <textarea
                id="familyFriends"
                value={formData.familyFriends}
                onChange={(e) => handleChange('familyFriends', e.target.value)}
                placeholder="e.g., I have two sisters, my best friend is named..."
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pets">Do you have any pets? Tell us about them</label>
              <textarea
                id="pets"
                value={formData.pets}
                onChange={(e) => handleChange('pets', e.target.value)}
                placeholder="Tell us about your pets (real or imaginary!)..."
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hobbies">Do you have any hobbies? Tell us about them</label>
              <textarea
                id="hobbies"
                value={formData.hobbies}
                onChange={(e) => handleChange('hobbies', e.target.value)}
                placeholder="What do you enjoy doing in your spare time?..."
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
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
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Personalization;