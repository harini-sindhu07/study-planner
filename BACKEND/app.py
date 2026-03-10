from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import json
import re

app = Flask(__name__)
CORS(app)

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print("⚠️  No OpenAI key found - using fallback plan")
    OPENAI_API_KEY = None

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    try:
        data = request.get_json()
        subjects = data.get('subjects', [])
        daily_hours = data.get('dailyHours', 4)
        
        subject_names = [s.get('name', 'Unknown') for s in subjects]
        
        # Simple fallback - no OpenAI needed
        plan = {
            "day1": [{"subject": subject_names[0] if subject_names else "Math", "duration": f"{daily_hours//2} hours"}],
            "day2": [{"subject": subject_names[1] if len(subject_names)>1 else "Physics", "duration": f"{daily_hours//2} hours"}],
            "day3": [{"subject": subject_names[0] if subject_names else "Math", "duration": f"{daily_hours//2} hours"}],
            "day4": [{"subject": subject_names[1] if len(subject_names)>1 else "Physics", "duration": f"{daily_hours//2} hours"}],
            "day5": [{"subject": "Review", "duration": "2 hours"}],
            "day6": [{"subject": "Practice", "duration": f"{daily_hours//2} hours"}],
            "day7": [{"subject": "Review All", "duration": "2 hours"}]
        }
        
        return jsonify(plan)
        
    except Exception as e:
        return jsonify({"error": "Server error"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK"})

if __name__ == '__main__':
    print("🚀 Starting Study Planner API on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
