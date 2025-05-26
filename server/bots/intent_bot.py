from bots.base_bot import BaseBot  # 👈 Import BaseBot

class IntentBot(BaseBot):
    def detect_intent(self, conversation):
        intent_prompt = [
    {
        "role": "system",
        "content": (
            "You are an intent classifier.\n"
            "Your job is to read the conversation so far and respond with just one word — the intent label.\n"
            "The possible intents are: conversation, grammar,or confused.\n"
            "Do not explain. Do not roleplay. Do not answer the user. Just return the intent as a single word."
        )
    }
]

# Add full conversation history (a list of dicts like {'role': 'user', 'content': ...})
        intent_prompt += conversation

# Append clarifying final message
        intent_prompt.append({
    "role": "user",
    "content": (
        "What is the intent of this conversation so far?\n"
        "Respond with exactly one word: conversation, grammar, confused"
    )
})


        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=intent_prompt,
            temperature = 0
        )
        intent = response.choices[0].message.content.strip().lower()
        return intent


