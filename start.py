from multiprocessing import Process

from modules.server_admin import app as admin_app
from modules.server_client import app as client_app


def run_admin_app():
    admin_app.run(host='0.0.0.0', port=8080)


def run_client_app():
    client_app.run(host='0.0.0.0', port=8000)


if __name__ == '__main__':
    admin_process = Process(target=run_admin_app)
    client_process = Process(target=run_client_app)

    admin_process.start()
    client_process.start()
