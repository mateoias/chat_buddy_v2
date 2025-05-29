from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
# from flask_session import Session
from openai import OpenAI
import json
import os
import io
import tempfile
import azure.cognitiveservices.speech as speechsdk
from bots.base_bot import BaseBot
from bots.system_prompts import get_system_message
from bots.intent_bot import IntentBot
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = Flask(__name__)
app.secret_key = "mateoias"  # Replace with a strong secret key
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["PERMANENT_SESSION_LIFETIME"] = 86400 
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174"])
USER_FILE = 'users.json'

# Azure Speech Configuration
AZURE_SPEECH_KEY = os.getenv('AZURE_SPEECH_KEY')
AZURE_SPEECH_REGION = os.getenv('AZURE_SPEECH_REGION', 'eastus')

# Language to voice mapping for Azure Speech
LANGUAGE_VOICES = {
    'en': 'en-US-JennyNeural',
    'es': 'es-ES-ElviraNeural', 
    'fr': 'fr-FR-DeniseNeural',
    'de': 'de-DE-KatjaNeural',
    'it': 'it-IT-ElsaNeural',
    'zh': 'zh-CN-XiaoxiaoNeural',
}

def get_speech_config():
    """Initialize Azure Speech configuration"""
    if not AZURE_SPEECH_KEY:
        return None
    
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION
    )
    return speech_config

# Load users
def load_users():
    if os.path.exists(USER_FILE):
        with open(USER_FILE, 'r') as f:
            return json.load(f)
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
    native_lang = data.get('nativeLang', 'en')  # Get from request
    target_lang = data.get('targetLang', 'es')  # Get from request

    users = load_users()

    if email in users:
        return jsonify({'success': False, 'message': 'User already exists'}), 400

    # Create new user with language preferences
    users[email] = {
        'password': password,
        'native_lang': native_lang,
        'target_lang': target_lang,
        'personalization': {}
    }
    save_users(users)
    
    # Auto-login with their actual language choices
    session['user_id'] = email
    session['username'] = email
    session['native_lang'] = native_lang  # Use actual choice
    session['target_lang'] = target_lang  # Use actual choice
    session['user_background'] = {
        'native_lang': native_lang,
        'target_lang': target_lang,
        'skill_level': 'beginner',
        'interests': [],
        'learning_goals': 'conversation practice'
    }
    session['current_conversation'] = []
    session.modified = True

    return jsonify({
        'success': True, 
        'message': 'Account created and logged in',
        'auto_logged_in': True
    })

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    native_lang = data.get('nativeLang')
    target_lang = data.get('targetLang')

    # Load users
    users = load_users()
    
    # Check credentials
    if username in users and users[username]['password'] == password:
        user_data = users[username]
        
        # Store user session data
        session['user_id'] = username
        session['username'] = username
        session['native_lang'] = native_lang
        session['target_lang'] = target_lang
        
        # Initialize user background
        session['user_background'] = {
            'native_lang': native_lang,
            'target_lang': target_lang,
            'skill_level': 'beginner',
            'interests': ['travel', 'food'],
            'learning_goals': 'conversation practice'
        }
        
        # IMPORTANT: Load personalization from user data if it exists
        if 'personalization' in user_data and user_data['personalization']:
            print(f"Loading personalization from file: {user_data['personalization']}")
            session['user_background']['personalization'] = user_data['personalization']
            session['personalization'] = user_data['personalization']
            
            # Also add the name to user_background root if it exists
            if 'name' in user_data['personalization']:
                session['user_background']['name'] = user_data['personalization']['name']
        else:
            print("No personalization found in user file")
        
        # Initialize empty conversation
        session['current_conversation'] = []
        session.modified = True
        
        # Check if user has completed personalization
        has_personalization = user_data.get('personalization', {}).get('completed', False)
        
        print(f"Login complete - session user_background: {session['user_background']}")
        
        return jsonify({
            'success': True, 
            'message': 'Login successful',
            'needs_personalization': not has_personalization
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password'}), 400
    
@app.route('/save_personalization', methods=['POST'])
def save_personalization():
    try:
        data = request.get_json()
        user_id = session.get('user_id') or session.get('username')
        
        if not user_id:
            return jsonify({'success': False, 'message': 'Not logged in'}), 401
        
        print(f"Saving personalization for user: {user_id}")  # Debug
        
        # Load users
        users = load_users()
        
        # Make sure user exists
        if user_id not in users:
            print(f"User {user_id} not found in users file")  # Debug
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Save personalization to user data
        users[user_id]['personalization'] = data
        users[user_id]['personalization']['completed'] = True
        
        # Save to file
        save_users(users)
        print(f"Saved personalization to file for {user_id}")  # Debug
        
        # Also store in session for immediate use
        session['personalization'] = data
        session['personalization']['completed'] = True
        session.modified = True
        
        # Update user background for chat bot
        if 'user_background' not in session:
            session['user_background'] = {
                    'native_lang': session.get('native_lang', 'en'),
                    'target_lang': session.get('target_lang', 'es'),
                    'skill_level': 'beginner'
    }
            
        session['user_background'].update({
            'name': data.get('name', ''),

        })
        session['user_background']['personalization'] = data

        
        print("Session updated successfully")  # Debug
        
        return jsonify({
            'success': True, 
            'message': 'Personalization saved',
            'data': data
        })
        
    except Exception as e:
        print(f"Error saving personalization: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Failed to save'}), 500
@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"message": "Logged out"}), 200
    except Exception as e:
        print("Logout failed:", str(e))
        return jsonify({"error": "Logout failed"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Check if user is logged in
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Not logged in'}), 401
            
        data = request.get_json()
        user_input = data.get("message")
        if not user_input:
            return jsonify({"error": "Empty message"}), 400

        # Get current conversation and user background from session
        conversation = session.get("current_conversation", [])
        user_background = session.get("user_background", {})
        
        # DEBUG: Let's see what we have
        print(f"\n=== CHAT DEBUG ===")
        print(f"User ID: {user_id}")
        print(f"user_background from session: {user_background}")
        print(f"Has personalization in user_background: {'personalization' in user_background}")
        print(f"Has personalization in session root: {'personalization' in session}")
        
        if 'personalization' not in user_background and 'personalization' in session:
            print("Copying personalization from session to user_background")
            user_background['personalization'] = session['personalization']
            # IMPORTANT: Update the session with the modified user_background
            session['user_background'] = user_background
            session.modified = True
        
        # DEBUG: Check after copy
        print(f"user_background after copy: {user_background}")
        
        # Add user message to conversation
        conversation.append({"role": "user", "content": user_input})

        # Create bot with user background for personalization
        bot = BaseBot(conversation, client, user_background=user_background)
        
        # DEBUG: Verify bot received it
        print(f"Bot's user_background: {bot.user_background}")
        
        # For now, use simple conversation system message
        # Later we'll add intent detection back
        system_message = get_system_message("conversation")
        bot_response = bot.ask_openai(system_message)
    
        # Add bot response to conversation
        conversation.append({"role": "assistant", "content": bot_response})
        
        # Update session
        session["current_conversation"] = conversation
        session.modified = True
        
        return jsonify({"response": bot_response})

    except Exception as e:
        print("Error during chat:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Something went wrong on the server.'}), 500
    

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    """Convert text to speech using Azure Speech Services"""
    try:
        print("=== TTS Request Started ===")
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'en')
        
        print(f"Text: {text[:50]}...")
        print(f"Language: {language}")
        
        if not text:
            print("Error: No text provided")
            return jsonify({'error': 'No text provided'}), 400
            
        # Check Azure configuration
        if not AZURE_SPEECH_KEY:
            print("Error: AZURE_SPEECH_KEY not set")
            return jsonify({'error': 'Azure Speech not configured - missing API key'}), 500
            
        if not AZURE_SPEECH_REGION:
            print("Error: AZURE_SPEECH_REGION not set")
            return jsonify({'error': 'Azure Speech not configured - missing region'}), 500
            
        print(f"Azure Speech Key: {AZURE_SPEECH_KEY[:10]}... (truncated)")
        print(f"Azure Speech Region: {AZURE_SPEECH_REGION}")
        
        # Get Azure Speech configuration
        try:
            speech_config = speechsdk.SpeechConfig(
                subscription=AZURE_SPEECH_KEY,
                region=AZURE_SPEECH_REGION
            )
            print("Speech config created successfully")
        except Exception as e:
            print(f"Error creating speech config: {e}")
            return jsonify({'error': f'Failed to create speech config: {str(e)}'}), 500
            
        # Get appropriate voice for language
        voice_name = LANGUAGE_VOICES.get(language, LANGUAGE_VOICES['en'])
        speech_config.speech_synthesis_voice_name = voice_name
        print(f"Using voice: {voice_name}")
        
        # Use a simpler approach - synthesize to WAV format
        try:
            synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
            print("Synthesizer created, starting synthesis...")
            
            result = synthesizer.speak_text_async(text).get()
            print(f"Synthesis result reason: {result.reason}")
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                print("Synthesis completed successfully")
                audio_data = result.audio_data
                
                # Create temporary file
                import tempfile
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
                temp_file.write(audio_data)
                temp_file.close()
                
                print(f"Audio file created: {temp_file.name}, size: {len(audio_data)} bytes")
                
                # Return audio file
                return send_file(
                    temp_file.name,
                    mimetype='audio/wav',
                    as_attachment=False,
                    download_name='speech.wav'
                )
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = result.cancellation_details
                print(f"Speech synthesis canceled: {cancellation_details.reason}")
                if cancellation_details.reason == speechsdk.CancellationReason.Error:
                    print(f"Error details: {cancellation_details.error_details}")
                    return jsonify({
                        'error': f'Speech synthesis failed: {cancellation_details.error_details}'
                    }), 500
                else:
                    return jsonify({
                        'error': f'Speech synthesis canceled: {cancellation_details.reason}'
                    }), 500
            else:
                print(f"Unexpected result reason: {result.reason}")
                return jsonify({
                    'error': f'Unexpected synthesis result: {result.reason}'
                }), 500
                
        except Exception as e:
            print(f"Error during synthesis: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': f'Synthesis failed: {str(e)}'}), 500
            
    except Exception as e:
        print(f"General error in text-to-speech: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'TTS service error: {str(e)}'}), 500
    
@app.route('/reset_chat', methods=['POST'])
def reset_chat():
    """Reset current conversation but keep user background"""
    session['current_conversation'] = []
    session.modified = True
    return jsonify({'success': True, 'message': 'Chat history cleared.'})

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    # Debug logging
    print("Session contents:", dict(session))
    
    # Check both username and user_id for compatibility
    user_id = session.get('username') or session.get('user_id')
    
    if not user_id:
        return jsonify({'logged_in': False})
    
    # Load user data from file
    users = load_users()
    user_data = users.get(user_id, {})
    personalization = user_data.get('personalization', session.get('personalization', {}))

    response_data = {
        'logged_in': True,
        'username': user_id,
        'background': {
            'native_lang': user_data.get('native_lang', session.get('native_lang', 'en')),
            'target_lang': user_data.get('target_lang', session.get('target_lang', 'es')),
            'skill_level': session.get('skill_level', 'beginner')
        },
        'personalization': personalization,
        'conversation_length': len(session.get('current_conversation', []))
    }
    
    print(f"Returning user info: {response_data}")
    return jsonify(response_data)


@app.route('/get_personalization', methods=['GET'])
def get_personalization():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'logged_in': False}), 401
    
    # For now, return from session. Later this will come from Neo4j
    personalization = session.get('personalization', {})
    
    return jsonify({
        'success': True,
        'personalization': personalization
    })

if __name__ == '__main__':
    app.run(debug=True)