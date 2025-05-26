from bots.base_bot import BaseBot  # 👈 Import BaseBot

class GrammarBot(BaseBot):
    def get_response(self):
        system_msg = "You are a helpful grammar tutor. Answer clearly and simply."
        return self.ask_openai(system_msg)