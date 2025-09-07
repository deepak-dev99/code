from flask import Blueprint,url_for, request, jsonify, current_app
from app.database import mongo
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta
from app.utils import token_required
from bson import ObjectId
import os
import uuid
from werkzeug.utils import secure_filename
from app.parsinglogic import parse_text_to_excel

api = Blueprint("api", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



@api.route("/register", methods=["POST"])
def register():
    data = request.json
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({"error": "All fields (full_name, email, password) are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.hash(password)
    user = {
        "full_name": full_name,
        "email": email,
        "hashed_password": hashed_pw,
        "role": "user"   
    }

    mongo.db.users.insert_one(user)

    return jsonify({"message": "User created successfully"}), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.verify(password, user["hashed_password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "sub": str(user["_id"]),
            "role": user.get("role", "admin"),  
            "exp": datetime.utcnow() + timedelta(hours=1)
        },
        current_app.config["JWT_SECRET"],
        algorithm=current_app.config["JWT_ALGORITHM"]
    )

    return jsonify({
        "email": user["email"],
        "role": user.get("role", "admin"),
        "access_token": token
    })

@api.route("/", methods=["GET"])
def user111():
    return {"message": "Hello from Flask!"}


@api.route("/users", methods=["GET"])
@token_required
def get_users():
    users = mongo.db.users.find({"role": {"$ne": "admin"}})  
    
    user_list = []
    for user in users:
        user_list.append({
            "id": str(user["_id"]),
            "full_name": user.get("full_name"),
            "email": user.get("email"),
            "role": user.get("role", "user")  
        })

    return jsonify(user_list), 200


@api.route("/upload", methods=["POST"])
@token_required
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    original_filename = secure_filename(file.filename)

    unique_filename = f"{uuid.uuid4().hex}_{original_filename}"

    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)

    excel_filename = None
    excel_path = None
    if file.content_type in ["text/plain", "text/csv"]:  
        excel_filename, excel_path = parse_text_to_excel(file_path, UPLOAD_FOLDER)

    file_doc = {
        "user_id": request.user.get("sub"),
        "original_filename": original_filename,
        "filename": unique_filename,
        "content_type": file.content_type,
        "path": file_path,
        "parsed_excel_filename": excel_filename,
        "parsed_excel_path": excel_path
    }

    result = mongo.db.files.insert_one(file_doc)
    
    return jsonify({
        "message": "File uploaded successfully",
        "file_id": str(result.inserted_id),
        "filename": unique_filename,
        "parsed_excel_filename": excel_filename
    }), 201

@api.route("/user-files", methods=["GET"])
@token_required
def get_user_files():
    user_id = request.user.get("sub")  

    files_cursor = mongo.db.files.find({"user_id": user_id})
    
    files_list = []
    for f in files_cursor:
        files_list.append({
            "id": str(f["_id"]),
            "original_filename": f["original_filename"],
            "filename": f["filename"],
            "content_type": f["content_type"],
            "download_url": url_for('api.download_file', file_id=str(f["_id"]), _external=True)
        })
    
    return jsonify(files_list), 200

@api.route("/download/<file_id>", methods=["GET"])
@token_required
def download_file(file_id):
    file_doc = mongo.db.files.find_one({"_id": ObjectId(file_id)})

    if not file_doc or file_doc["user_id"] != request.user.get("sub"):
        return jsonify({"message": "File not found"}), 404

    if file_doc.get("parsed_excel_path") and os.path.exists(file_doc["parsed_excel_path"]):
        file_path = file_doc["parsed_excel_path"]
        download_name = file_doc.get("parsed_excel_filename", "parsed.xlsx")
        content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    else:
        file_path = file_doc["path"]
        download_name = file_doc["original_filename"]
        content_type = file_doc["content_type"]

    return (
        open(file_path, "rb"),
        200,
        {
            "Content-Type": content_type,
            "Content-Disposition": f'attachment; filename="{download_name}"'
        }
    )
