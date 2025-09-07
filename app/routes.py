from flask import send_file,send_from_directory,Blueprint,url_for, request, jsonify, current_app
from app.database import mongo
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta
from app.utils import token_required
from bson import ObjectId
import os
import uuid
from werkzeug.utils import secure_filename
from app.parsinglogic import parse_text_to_excel,Calculator
import mimetypes


cal = Calculator()

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
    if ("precheck" or "postcheck") not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    
    precheckfile = request.files.getlist("precheck")
    print(precheckfile!=0)
    postcheckfile = request.files.getlist("postcheck")
    print(len(postcheckfile) != 0 and len(precheckfile) != 0)
    if (len(precheckfile) == 0 and len(postcheckfile) != 0) or (len(postcheckfile) == 0 and len(precheckfile) == 0):
        return jsonify({"message": "No selected file"}), 400



    print(postcheckfile,precheckfile,"filefilefilefile=>>>>>>filefilefilefile")
    
    
    precheck_files = []
    postcheck_files = []
    
    org_file_pre = []
    org_file_post = []
    
    for oneprefile in precheckfile:
        original_filename = secure_filename(oneprefile.filename)
        unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
        org_file_pre.append({
            "original_filename":original_filename,
            "unique_filename":unique_filename
        })
        file_path = os.path.join(os.path.join(UPLOAD_FOLDER,"pre"), unique_filename)
        oneprefile.save(file_path)
        precheck_files.append(file_path)
        
    for onepostfile in postcheckfile:
        original_filename = secure_filename(onepostfile.filename)
        unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
        file_path = os.path.join(os.path.join(UPLOAD_FOLDER,"post"), unique_filename)
        onepostfile.save(file_path)
        postcheck_files.append(file_path)
        
        org_file_post.append({
            "original_filename":original_filename,
            "unique_filename":unique_filename
        })
        
    
    
    cal = Calculator()
    prefiledata = cal.startCalc(precheck_files,"pre","","")
    
    postfiledata = {}
    
    if(len(postcheckfile) > 0):
        postfiledata = cal.startCalc(postcheck_files,"post","","")
    
    print(prefiledata,"prefiledataprefiledataprefiledata")
    
    
    file_path_final = prefiledata["file_name_all"]
    
    finer_name = prefiledata["file_all"]
    
    
    if(len(postcheckfile) > 0):
        postcheck = postfiledata["file_name_all"]
        
        finer_name = postfiledata["file_all"]
    
        # file_path_final = cal.startdiffCalc(post_files=postcheck,pre_files=file_path_final)
        
        file_path_final = postcheck
        
    
    
    print(file_path_final,"file_path_finalfile_path_finalfile_path_finalfile_path_final")
    
        
    
        
    
    file_doc = {
        "user_id": request.user.get("sub"),
        "original_filename": finer_name,
        "org_file_pre": org_file_pre,
        "org_file_post": org_file_post,
        "filename": unique_filename,
        "precheck_files":", ".join(precheck_files),
        "postcheck_files":", ".join(postcheck_files),
        "prefiledata_nodes":", ".join(prefiledata["nodeIdList"]),
        "postfiledata_nodes":", ".join(prefiledata["nodeIdList"]),
        "path": file_path_final
    }

    result = mongo.db.files.insert_one(file_doc)
    
    return jsonify({
        "message": "File uploaded successfully",
        "file_id": str(result.inserted_id),
        "filename": unique_filename,
        "parsed_excel_filename": file_path_final
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
            # "content_type": f["content_type"],
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
        # download_name = file_doc.get("parsed_excel_filename", "parsed.xlsx")
        # content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    else:
        file_path = os.path.join(os.getcwd(),file_doc["path"])
        download_name = file_doc["original_filename"]
        content_type = mimetypes.guess_type(file_path)

    print(download_name,"download_namedownload_namedownload_name")

    return send_file(
        file_path,
        as_attachment=True,
        attachment_filename=file_doc["original_filename"],  # ✅ sets correct filename
        mimetype=file_doc.get("content_type", "application/octet-stream")
    ) 
    return send_from_directory("downloads", download_name, as_attachment=True)
    # return (
    #     open(file_path, "rb"),
    #     200,
    #     {
    #         "Content-Type": content_type,
    #         "Content-Disposition": f'attachment; filename="{download_name}"'
    #     }
    # )




@api.route("/circle_enm", methods=["GET","POST"])
@token_required
def get_users():
    
    if(request.method == "GET"):
            
        users = mongo.db.users.find({"circle_enm": {"$ne": "admin"}})  
        
        user_list = []
        for user in users:
            user_list.append({
                "id": str(user["_id"]),
                "full_name": user.get("full_name"),
                "email": user.get("email"),
                "role": user.get("role", "user")  
            })

        return jsonify(user_list), 200

    
