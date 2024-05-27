from flask import (Flask, redirect, render_template, request,
                   send_from_directory)
from flask_cors import CORS

from modules.api import app_api, login_required

app = Flask(__name__, static_folder="admin",
            template_folder="admin", static_url_path="/admin")

CORS(app)
app.register_blueprint(app_api, url_prefix="/api")


@app.route('/admin')
def admin():
    if request.cookies.get("is_logged_in"):
        return redirect("/dashboard")
    return render_template('index.html')


@app.route("/<path:path>")
def catch_all(path):
    if "dashboard" in path:
        @login_required
        def handle_dashboard():
            return render_template('index.html')
        return handle_dashboard()
    if "admin" in path:
        if request.cookies.get("is_logged_in"):
            return redirect("/dashboard")
    if "." in path:
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
