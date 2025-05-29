import './Beginner.css';

function Beginner() {
  return (
    <div className="beginner-page">
      <h1>Beginner Level</h1>
      <p className="page-intro">
At this level the goal is to provide maximum exposure to the language, which will allow you to acquire the grammar fundamentals. It is very important
that you understand the meaning of what chat buddy is saying, but you don't need to think about the grammar. For more explanation of the theory, see TPRS in the FAQs.
At this level, Chat buddy controls the conversation more and speaks more so that you can hear and understand basic conversation without having to be able to speak. 
As your understanding improves you can start to make longer answers.      </p>

      <section className="beginner-section">
        <h2>🎯 What to Expect</h2>
        <p>
          Our beginner chat uses simple vocabulary and refers to your personal experience to help you understand the topic, but it may use a 
          variety of grammar that seems advanced compared to regular classes. You don't need to think about the grammar, just concentrate
          on understanding the meaning. The AI will speak slowly and clearly and ask you questions. You can respond with single words at 
          first and try out longer answers as you start to pick up the grammar. Remeber, it's not actually usefull to make longer answers that are incorrect.

        </p>
      </section>

      <section className="beginner-section">
        <h2>💡 Personalization</h2>
        <p>
          Personalization is important because it's much easier to understand and remember things that you know about. However that 
          doesn't mean you have to stick to the truth. If you create a crazy story about something you did that's only partially true, 
          or is in fact a complete fuction, you will rememberit better because you created it. That's the story part of TPRS. That said 
          making up crazy stories can be tuiring too, so just do what you're comfortavpe wuth. 
          Remeber, What happens on chat buddy stays on chat buddy. 
        </p>
      </section>

      <section className="beginner-section">
        <h2>📚 Language We'll Cover</h2>
        <p>
          We will start with some common nouns based on your intererests (iphone, Paris, pizza, etc.) and the "super seven" (add link) verbs (to have, to be, to want, 
          to go, to like,.... ). Using simple vocabulary + the super seven chat buddy will introduce you to the grammar of the language. As you progress we will add
          the sweet sixteen verbs (add link) and more vocabulary until you have a solid grip on the grammar. Then you will be ready to move up to intermediate level.
        </p>
      </section>

      <section className="beginner-section">
        <h2>✨ Tips for Success</h2>
        <p>
          Practice as often as possible, even 5 minutes will help. A good session would be 15-20 minutes though. 
          Don't try to speak before you are ready. 
          Fill out the intake questionsairre so the app can focus the conversation on your life. 
          If you are confused, or don't like the direction of the conversation, use your native language to ask the app questions of give instructions.
          But, don't use your native language too much. Time you spend trying to "learn" grammar is mostly wasted.
          Maximize the time spent "acquiring" language.
        </p>
      </section>

      <div className="action-section">
        <h2>Ready to Start?</h2>
        <p>Jump into your first conversation and start learning naturally!</p>
        <a href="/chat" className="start-button">Start Beginner Chat</a>
      </div>
    </div>
  );
}

export default Beginner;