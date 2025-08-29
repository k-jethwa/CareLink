from flask import request, jsonify
import logging
import os

logger = logging.getLogger(__name__)

def verify_firebase_token():
    """Verify Firebase ID token from request headers"""
    try:
        from firebase_admin import auth
    except ImportError:
        logger.error("Firebase admin not available")
        return None, jsonify({"error": "Authentication service unavailable"}), 500
    
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({"error": "Missing Authorization header"}), 401
    
    # Extract token from "Bearer <token>"
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None, jsonify({"error": "Invalid Authorization header format"}), 401
    
    token = parts[1]
    
    if not token.strip():
        return None, jsonify({"error": "Empty token"}), 401
    
    try:
        # Verify the token with Firebase
        decoded_token = auth.verify_id_token(token)
        
        # Ensure required fields are present
        if 'uid' not in decoded_token:
            return None, jsonify({"error": "Invalid token structure"}), 401
            
        return decoded_token, None, None
        
    except auth.ExpiredIdTokenError:
        return None, jsonify({"error": "Token has expired"}), 401
    except auth.RevokedIdTokenError:
        return None, jsonify({"error": "Token has been revoked"}), 401
    except auth.InvalidIdTokenError:
        return None, jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return None, jsonify({"error": "Token verification failed"}), 401