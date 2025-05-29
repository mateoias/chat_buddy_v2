from bots.personalization_builder import build_personalization_context

class BaseBot:
    def __init__(self, messages, client, user_background=None):
        self.messages = messages
        self.client = client
        self.user_background = user_background or {}


    def build_prompt(self, system_message):
        """Build prompt with user personalization context"""
        # Get personalization context
        personalization_context = build_personalization_context(self.user_background)
        
        # Combine with system message if we have personalization
        if personalization_context:
            full_system_message = f"{personalization_context}\n\n{system_message}\n\nRemember to tailor your responses to the user's skill level and interests."
        else:
            full_system_message = system_message
            
        return [{"role": "system", "content": full_system_message}] + self.messages + [{
            "role": "user",
            "content": "Use the target language wants to chat and use the native language if they have a grammar or vocabulary question. Remember to make your response short so I have a chance to speak more."
        }]

    def ask_openai(self, system_message):
        """Get response from OpenAI with personalized prompt"""
        prompt = self.build_prompt(system_message)
        print ("current prompt is: ", prompt)
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=prompt
        )
        return response.choices[0].message.content