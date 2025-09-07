import jwt
from functools import wraps
from flask import request, jsonify, current_app
from datetime import datetime

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            decoded = jwt.decode(
                token,
                current_app.config["JWT_SECRET"],
                algorithms=[current_app.config["JWT_ALGORITHM"]]
            )
            request.user = decoded   
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated
