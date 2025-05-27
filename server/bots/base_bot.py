class BaseBot:
    def __init__(self, messages, client, user_background=None):
        self.messages = messages
        self.client = client
        self.user_background = user_background or {}

    def build_prompt(self, system_message):
        """Build prompt with user personalization context"""
        # Add user context to system message if available
        if self.user_background:
            context = f"""
User Context:
- Native Language: {self.user_background.get('native_lang', 'unknown')}
- Target Language: {self.user_background.get('target_lang', 'unknown')}
- Skill Level: {self.user_background.get('skill_level', 'beginner')}
- Interests: {', '.join(self.user_background.get('interests', []))}
- Learning Goals: {self.user_background.get('learning_goals', 'general practice')}

{system_message}

Remember to tailor your responses to the user's skill level and interests.
"""
            system_message = context
            
        return [{"role": "system", "content": system_message}] + self.messages + [{
            "role": "user",
            "content": "Remember to make your response short so I have a chance to speak more."
        }]

    def ask_openai(self, system_message):
        """Get response from OpenAI with personalized prompt"""
        prompt = self.build_prompt(system_message)
        # print ("current prompt is: ", prompt)
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=prompt
        )
        return response.choices[0].message.content