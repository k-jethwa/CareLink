from flask import Flask, request, jsonify
from auth import verify_firebase_token
import db
from email_utils import send_emergency_email
import json

app = Flask(__name__)

@app.route("/api/contacts", methods=["POST"])
def add_contact():
    user, error_response, status_code = verify_firebase_token()
    if error_response:
        return error_response, status_code
    uid = user["uid"]

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({"error": "Name and email required"}), 400

    db.insert_contact(uid, name, email)
    contacts = db.get_contacts(uid)
    return jsonify({"contacts": contacts}), 201


@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    user, error_response, status_code = verify_firebase_token()
    if error_response:
        return error_response, status_code
    uid = user["uid"]

    contacts = db.get_contacts(uid)
    return jsonify({"contacts": contacts})

@app.route("/api/checkin", methods=["POST"])
def create_checkin():
    user, error_response, status_code = verify_firebase_token()
    if error_response:
        return error_response, status_code
    uid = user["uid"]

    data = request.get_json()
    date = data.get("date")
    answers = data.get("answers", {})

    if not date:
        return jsonify({"error": "Date is required"}), 400

    db.insert_checkin(uid, date, json.dumps(answers))

    if answers.get("mood") == "very bad":
        send_emergency_email(uid, answers)

    return jsonify({"message": "Check-in saved"}), 201


@app.route("/api/checkin", methods=["GET"])
def get_checkins():
    user, error_response, status_code = verify_firebase_token()
    if error_response:
        return error_response, status_code
    uid = user["uid"]

    checkins = db.get_checkins(uid)
    return jsonify({"checkins": checkins})


if __name__ == "__main__":
    app.run(debug=True)