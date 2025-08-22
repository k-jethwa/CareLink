from flask import request, jsonify

def verify_firebase_token():
    # Import firebase_admin here to avoid circular import issues
    try:
        from firebase_admin import auth
    except ImportError:
        return None, jsonify({"error": "Firebase admin not available"}), 500
    
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({"error": "Missing Authorization header"}), 401

    # Extract token from "Bearer <token>"
    parts = auth_header.split()
    if len(parts) != 2 or parts[0] != "Bearer":
        return None, jsonify({"error": "Invalid Authorization header"}), 401

    token = parts[1]

    try:
        decoded_token = auth.verify_id_token(token)
        # decoded_token contains uid, email, etc.
        return decoded_token, None, None
    except Exception as e:
        return None, jsonify({"error": "Invalid token: " + str(e)}), 401