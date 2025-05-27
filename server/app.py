from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
from flask_session import Session
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
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
CORS(app, supports_credentials=True)
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
        # Store user session data
        session['user_id'] = username
        session['native_lang'] = native_lang
        session['target_lang'] = target_lang
        
        # Initialize user background (later from Neo4j)
        session['user_background'] = {
            'native_lang': native_lang,
            'target_lang': target_lang,
            'skill_level': 'beginner',  # Will come from Neo4j later
            'interests': ['travel', 'food'],  # Will come from Neo4j later
            'learning_goals': 'conversation practice'  # Will come from Neo4j later
        }
        
        # Initialize empty conversation
        session['current_conversation'] = []
        session.modified = True
        
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid login data'}), 400

@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"message": "Logged out"}), 200
    except Exception as e:
        print("Logout failed:", str(e))
        return jsonify({"error": "Logout failed"}), 500

@app.route('/start_chat', methods=['POST'])
def start_chat():
    """Initialize a new chat session with user background"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not logged in'}), 401
    
    # TODO: Later - pull from Neo4j
    # user_background = neo4j_client.get_user_background(user_id)
    
    # For now, use session data and some defaults
    user_background = {
        'native_lang': session.get('native_lang', 'en'),
        'target_lang': session.get('target_lang', 'es'),
        'skill_level': 'beginner',  # Will come from Neo4j later
        'interests': ['travel', 'food'],  # Will come from Neo4j later
        'learning_goals': 'conversation practice'  # Will come from Neo4j later
    }
    
    # Reset conversation and set background
    session['current_conversation'] = []
    session['user_background'] = user_background
    session.modified = True
    
    return jsonify({
        'success': True, 
        'message': 'Chat initialized',
        'background': user_background
    })

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

        # Add user message to conversation
        conversation.append({"role": "user", "content": user_input})

        # Create bot with user background for personalization
        bot = BaseBot(conversation, client, user_background=user_background)
        
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
    """Get current user session info"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'logged_in': False}), 200
    
    return jsonify({
        'logged_in': True,
        'user_id': user_id,
        'background': session.get('user_background', {}),
        'conversation_length': len(session.get('current_conversation', []))
    })

if __name__ == '__main__':
    app.run(debug=True)