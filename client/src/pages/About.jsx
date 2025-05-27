export default function About() {
  return (
    <div className="page-layout">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Hero Section */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-brand mb-3">About Language Exchange AI</h1>
              <p className="lead text-muted">Revolutionizing language learning through personalized AI conversation practice</p>
            </div>

            {/* About the Author */}
            <div className="content-card">
              <h2 className="h4 fw-bold mb-3">About the Author</h2>
              <p>
                Welcome to the computer assisted language learning website. My name is <strong>Matthew Werth</strong> 
                and I have been a language teacher for many years. Currently I am working on 
                a number of automated tools to make life easier for language teachers and language learners.
              </p>
              <p>
                This tool is an automated language exchange chatbot for students who want to practice their 
                language skills, it is divided into three levels with fine tuned prompts to make language 
                learning easier. The guiding philosophy is <strong>CI with TPRS</strong>, especially at the lower levels.
              </p>
            </div>

            {/* Learning Levels */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="content-card h-100">
                  <div className="d-flex align-items-center mb-3">
                    <span className="level-badge level-beginner me-2">Beginner</span>
                    <h3 className="h5 mb-0">Starting Out</h3>
                  </div>
                  <p className="mb-0">
                    This section is designed for users who are just starting out. This is the hardest part for an AI 
                    powered chatbot and it is still under construction.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="content-card h-100">
                  <div className="d-flex align-items-center mb-3">
                    <span className="level-badge level-intermediate me-2">Intermediate</span>
                    <h3 className="h5 mb-0">Building Skills</h3>
                  </div>
                  <p className="mb-0">
                    For learners who can hold a basic conversation. This section is fine tuned to help your listening ability 
                    and grammar knowledge. It limits vocabulary and focuses on letting you achieve 90% comprehension so that 
                    you can internalize grammatical structures.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="content-card h-100">
                  <div className="d-flex align-items-center mb-3">
                    <span className="level-badge level-advanced me-2">Advanced</span>
                    <h3 className="h5 mb-0">Mastering Fluency</h3>
                  </div>
                  <p className="mb-0">
                    Aimed at users with solid speaking skills, this is the easiest type of language learning to automate.
                    It is a sampling of prompts to make sure that you focus on language learning with minimal friction.
                  </p>
                </div>
              </div>
            </div>

            {/* Technology Section */}
            <div className="content-card">
              <h2 className="h4 fw-bold mb-3">About the Language Exchange Chatbot</h2>
              <p>
                The chatbot is powered by <a href="https://openai.com/api/" target="_blank" rel="noreferrer" className="text-brand fw-semibold">OpenAI</a>, 
                this is a wrapper for the GPT 4.0 model that has been optimized for conversation 
                based on the level that you choose.
              </p>

              <div className="alert alert-info" role="alert">
                <h5 className="alert-heading">
                  <i className="bi bi-info-circle me-2"></i>
                  Important Notes
                </h5>
                <ul className="mb-0">
                  <li>The model responses are usually factually accurate, but there is no guarantee and that isn't important for language learning</li>
                  <li>GPT hallucinates sometimes, so if the conversation gets too weird, just change the topic and carry on</li>
                  <li>You, the human, are ultimately responsible for what happens in these conversations, chatGPT is generally
                  eager to please, so it's easy to get it to say weird and/or unsavory things, but that's usually because
                  the computer thinks that what you wanted based on your side of the text.</li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="content-card text-center">
              <h3 className="h5 fw-bold mb-3">Get in Touch</h3>
              <p className="mb-3">
                Feel free to contact me with any comments or suggestions:
              </p>
              <a 
                href="mailto:mateoias@hotmail.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="bi bi-envelope me-2"></i>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}