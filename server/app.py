from flask import Flask, request, jsonify, session
from flask_cors import CORS  # import CORS
from flask_session import Session
from openai import OpenAI
import json
import os
from bots.base_bot import BaseBot
from bots.system_prompts import get_system_message
from bots.intent_bot import IntentBot
from dotenv import load_dotenv
load_dotenv()
api_key=os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = Flask(__name__)
app.secret_key = "mateoias"  # Replace with a strong secret key
app.config["SESSION_TYPE"] = "filesystem"  # or "redis" if you want persistence beyond memory
Session(app)
CORS(app, supports_credentials=True)
USER_FILE = 'users.json'

# Load users

def load_users():
    try:
        if os.path.exists(USER_FILE):
            with open(USER_FILE, 'r') as f:
                content = f.read().strip()
                if content:  # Check if file has content
                    return json.loads(content)
                else:
                    return {}  # Return empty dict for empty file
        return {}
    except (json.JSONDecodeError, FileNotFoundError):
        # If file is corrupted or missing, return empty dict
        return {}
    
# Save users
def save_users(users):
    with open(USER_FILE, 'w') as f:
        json.dump(users, f, indent=2)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    users = load_users()

    if email in users:
        return jsonify({'success': False, 'message': 'User already exists'}), 400

    users[email] = {'password': password}
    save_users(users)

    return jsonify({'success': True, 'message': 'Account created'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    native_lang = data.get('nativeLang')
    target_lang = data.get('targetLang')

    # In production: check username/password securely!
    if username and password:
        session['username'] = username
        session['native_lang'] = native_lang
        session['target_lang'] = target_lang
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid login data'}), 400

@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"message": "Logged out"}), 200
    except Exception as e:
        print ("try except in flask aoo failed")
        return jsonify({"error": "Logout failed"}), 500



@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message")
        if not user_input:
            return jsonify({"error": "Empty message"}), 400

        # Initialize session messages if not already present
        if "messages" not in session:
            session["messages"] = [{"role": "assistant", "content": "Hello, what would you like to talk about today?"}]
            session.modified = True

        session["messages"].append({"role": "user", "content": user_input})
        session.modified = True 
        # choose the intent, work on this later

        # intent_bot = IntentBot(session["messages"], client)
        # intent = intent_bot.detect_intent(session["messages"])
        # print("Intent detected:", intent)
        # print("___________________________")
        # # Choose the correct system message and get the bot response

        # system_msg = get_system_message(intent)
        # print("system message is: ", system_msg)
        # print("___________________________")

        bot = BaseBot(session["messages"], client)
        bot_response = bot.ask_openai("conversation")
    
        # Step 4: Update session history (excluding intent detection)
        session["messages"].append({"role": "assistant", "content": bot_response})
        session.modified = True
        return jsonify({"response": bot_response})

    except Exception as e:
        print("Error during OpenAI call:", str(e))
        return jsonify({'error': 'Something went wrong on the server.'}), 500

@app.route('/reset_chat', methods=['POST'])
def reset_chat():
    session.pop('messages', None)
    session.modified = True
    return jsonify({'success': True, 'message': 'Chat history cleared.'})


if __name__ == '__main__':
    app.run(debug=True)
