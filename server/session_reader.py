#!/usr/bin/env python3
import os
import pickle
import json
from datetime import datetime

def read_session_file(filepath):
    """Safely read a Flask session file with multiple methods"""
    print(f"\n=== Reading: {os.path.basename(filepath)} ===")
    
    # Check file size
    file_size = os.path.getsize(filepath)
    print(f"File size: {file_size} bytes")
    
    if file_size == 0:
        print("File is empty")
        return
    
    # Try to read raw bytes first
    with open(filepath, 'rb') as f:
        raw_data = f.read()
        print(f"First 20 bytes (hex): {raw_data[:20].hex()}")
        print(f"First 20 bytes (raw): {raw_data[:20]}")
    
    # Try pickle
    try:
        with open(filepath, 'rb') as f:
            session_data = pickle.load(f)
            print("✅ Pickle format - SUCCESS")
            print("Session data:")
            for key, value in session_data.items():
                if key == 'messages' and isinstance(value, list):
                    print(f"  {key}: [{len(value)} messages]")
                    for i, msg in enumerate(value[-3:]):  # Show last 3 messages
                        print(f"    {i}: {msg}")
                else:
                    print(f"  {key}: {value}")
            return session_data
    except Exception as e:
        print(f"❌ Pickle failed: {e}")
    
    # Try JSON
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            session_data = json.load(f)
            print("✅ JSON format - SUCCESS")
            print("Session data:", session_data)
            return session_data
    except Exception as e:
        print(f"❌ JSON failed: {e}")
    
    # Try as text
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            print("✅ Text format - SUCCESS")
            print("Content:", content[:200] + "..." if len(content) > 200 else content)
            return content
    except Exception as e:
        print(f"❌ Text failed: {e}")
    
    print("❌ Could not read file in any known format")
    return None

def main():
    session_dir = 'flask_session'
    
    if not os.path.exists(session_dir):
        print(f"❌ Directory {session_dir} does not exist")
        return
    
    session_files = [f for f in os.listdir(session_dir) if not f.startswith('.')]
    
    if not session_files:
        print(f"❌ No session files found in {session_dir}")
        return
    
    print(f"Found {len(session_files)} session files:")
    
    for filename in session_files:
        filepath = os.path.join(session_dir, filename)
        
        # Get file timestamp
        mtime = os.path.getmtime(filepath)
        timestamp = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
        print(f"\n📁 {filename} (modified: {timestamp})")
        
        read_session_file(filepath)
    
    print(f"\n✅ Finished reading {len(session_files)} session files")

if __name__ == "__main__":
    main()