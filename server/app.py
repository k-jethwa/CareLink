from flask import Flask, request, jsonify
from flask_cors import CORS
from auth import verify_firebase_token
import db
import ml
from email_utils import send_emergency_email
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route("/api/contacts", methods=["POST"])
def add_contact():
    """Add a new emergency contact for a user"""
    user, error_response, status_code = verify_firebase_token()
    if error_response:
        return error_response, status_code
    
    uid = user["uid"]
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    try:
        db.insert_contact(uid, name, email)
        contacts = db.get_contacts(uid)
        logger.info(f"Contact added for user {uid}: {name} ({email})")
        return jsonify({
            "message": "Contact added successfully",
            "contacts": contacts
        }), 201
    except Exception as e:
        logger.error(f"Error adding contact: {e}")
        return jsonify({"error": "Failed to add contact"}), 500


@app.route("/api/contacts/<uid>", methods=["GET"])
def get_user_contacts(uid):
    """Get all emergency contacts for a specific user"""
    user, error_response, status_code = verify_firebase_token()
    if error_response:
        return error_response, status_code
    
    # Verify the user is requesting their own contacts
    if user["uid"] != uid:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        contacts = db.get_contacts(uid)
        return jsonify({"contacts": contacts}), 200
    except Exception as e:
        logger.error(f"Error getting contacts: {e}")
        return jsonify({"error": "Failed to get contacts"}), 500

@app.route('/api/checkin', methods=['POST'])
def create_checkin():
    try:
        user, error_response, status_code = verify_firebase_token()
        if error_response:
            return error_response, status_code
        
        uid = user["uid"]  # Extract uid from decoded token
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract data
        date = data.get('date')
        journal = data.get('journal', '')
        answers = data.get('answers', {})
        hours_of_sleep = data.get('hours_of_sleep')
        
        if not date:
            return jsonify({'error': 'Date is required'}), 400
        
        mood_analysis = ml.analyze_mood(journal)
        mood = mood_analysis['mood']
        color = mood_analysis['color']
        
        db.insert_checkin(uid, date, mood, color, json.dumps(answers), hours_of_sleep)
        
        sad_count = len(db.get_recent_sad_checkins(uid, days=7))
        if sad_count >= 3:
            send_emergency_email(uid, answers)  
        
        return jsonify({
            'success': True,
            'mood': mood,
            'color': color,
            'message': 'Check-in created successfully'
        }), 201
    
    except Exception as e:
        logger.error(f"Error creating check-in: {e}")
        return jsonify({'error': 'Failed to create check-in'}), 500


@app.route('/api/checkins/<uid>', methods=['GET'])
def get_user_checkins_endpoint(uid):
    try:
        user, error_response, status_code = verify_firebase_token()
        if error_response:
            return error_response, status_code

        if user["uid"] != uid:
            return jsonify({'error': 'Unauthorized access'}), 403

        checkins = db.get_user_checkins(uid)

        return jsonify({'success': True, 'checkins': checkins}), 200

    except Exception as e:
        logger.error(f"Error getting check-ins: {e}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

@app.route("/api/analytics/<uid>", methods=["GET"])
def get_user_analytics(uid):
    try:
        user, error_response, status_code = verify_firebase_token()
        if error_response:
            return error_response, status_code
        
        if user["uid"] != uid:
            return jsonify({"error": "Unauthorized"}), 403

        checkins = db.get_checkins(uid)
        
        mood_counts = {"happy": 0, "sad": 0, "neutral": 0}
        total_checkins = len(checkins)
        
        for checkin in checkins:
            mood = checkin.get("mood", "neutral")
            mood_counts[mood] = mood_counts.get(mood, 0) + 1
        
        mood_percentages = {}
        for mood, count in mood_counts.items():
            mood_percentages[mood] = (count / total_checkins * 100) if total_checkins > 0 else 0
        
        recent_sad_count = db.get_checkin_count_by_mood(uid, "sad", days=7)
        recent_happy_count = db.get_checkin_count_by_mood(uid, "happy", days=7)
        
        analytics = {
            "total_checkins": total_checkins,
            "mood_counts": mood_counts,
            "mood_percentages": mood_percentages,
            "recent_patterns": {
                "sad_days_7d": recent_sad_count,
                "happy_days_7d": recent_happy_count,
                "emergency_triggered": recent_sad_count >= 3
            }
        }
        
        return jsonify(analytics), 200
        
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
        return jsonify({"error": "Failed to get analytics"}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {e}")
    return jsonify({"error": "Something went wrong"}), 500

    
if __name__ == "__main__":
    db.init_db()
    db.migrate_existing_data()
    app.run(debug=True, host="0.0.0.0", port=5001)