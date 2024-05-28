import sqlite3


def connect_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def close_db(conn):
    conn.close()


class Account:
    def __init__(self, username='admin', password='admin'):
        self.conn = connect_db()
        self.username = username
        self.password = password
        self.init_db(self.username, self.password)

    def init_db(self, username, password):
        script = f"""--sql
            CREATE TABLE IF NOT EXISTS
                Account (
                    username TEXT NOT NULL PRIMARY KEY UNIQUE,
                    password TEXT NOT NULL
                );
            BEGIN TRANSACTION;

            INSERT INTO
                Account (username, password)
            SELECT
                '{username}',
                '{password}' WHERE NOT EXISTS (
                    SELECT
                        1
                    FROM
                        Account
                );
            COMMIT;
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()

    def get_info(self):
        data = {}
        cursor = self.conn.cursor()
        script = f"""--sql
            SELECT * FROM Account;
            """
        cursor.execute(script)
        result = cursor.fetchall()
        for row in result:
            data['username'] = row['username']
            data['password'] = row['password']
        return data

    def change_info(self, username, password):
        script = f"""--sql
            UPDATE Account
            SET username = '{username}', password = '{password}';
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()
        return self.get_info()


class Config:
    def __init__(self) -> None:
        self.conn = connect_db()
        self.init_db()

    def init_db(self):
        script = f"""--sql
        CREATE TABLE IF NOT EXISTS
            Config (
                api_token TEXT NOT NULL,
                chat_id TEXT NOT NULL,
                proxy TEXT
            );
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()

    def get_info(self):
        data = {}
        cursor = self.conn.cursor()
        script = f"""--sql
            SELECT * FROM Config;
            """
        cursor.execute(script)
        result = cursor.fetchall()
        for row in result:
            data['api_token'] = row['api_token']
            data['chat_id'] = row['chat_id']
            data['proxy'] = row['proxy']
        return data

    def change_info(self, api_token, chat_id, proxy=''):
        script = f"""--sql
            BEGIN TRANSACTION;
            INSERT INTO
                Config (api_token, chat_id, proxy)
            SELECT
                '{api_token}',
                '{chat_id}',
                '{proxy}' WHERE NOT EXISTS (
                    SELECT
                        1
                    FROM
                        Config
                );
            COMMIT;
            UPDATE Config
            SET api_token = '{api_token}', chat_id = '{chat_id}', proxy = '{proxy}';
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()
        return self.get_info()


class Data:
    def __init__(self) -> None:
        self.conn = connect_db()
        self.init_db()

    def init_db(self):
        script = f"""--sql
            CREATE TABLE IF NOT EXISTS
                    Data (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        password TEXT NOT NULL,
                        cookie TEXT,
                        country TEXT,
                        type TEXT NOT NULL
                    );
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()

    def get_data(self):
        data = {}
        cursor = self.conn.cursor()
        script = f"""--sql
            SELECT * FROM Data;
            """
        cursor.execute(script)
        result = cursor.fetchall()
        for row in result:
            data[row['id']] = {
                'username': row['username'],
                'password': row['password'],
                'cookie': row['cookie'],
                'country': row['country'],
                'type': row['type'],
            }
        return data

    def add_data(self, username, password, cookie, country, type):
        script = f"""--sql
            INSERT INTO Data
                (username, password, cookie, country, type)
            VALUES
                ('{username}', '{password}', '{cookie}', '{country}', '{type}');
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()
        return self.get_data()

    def delete_data(self, id):
        script = f"""--sql
            DELETE FROM Data
            WHERE id = {id};
            DELETE FROM sqlite_sequence WHERE name = 'Data';
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()
        return self.get_data()

    def add_data(self, username, password, cookie='', country='', type=''):
        script = f"""--sql
            INSERT INTO Data
                (username, password, cookie, country, type)
            VALUES
                ('{username}', '{password}', '{cookie}', '{country}', '{type}');
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()
        return self.get_data()


class Setting:
    def __init__(self) -> None:
        self.conn = connect_db()
        self.init_db()

    def init_db(self):
        script = """--sql
            CREATE TABLE IF NOT EXISTS
                Setting (
                    cookie_type CHAR(3) NOT NULL,
                    load_image BOOL NOT NULL,
                    load_css BOOL NOT NULL,
                    hide_chrome BOOL NOT NULL,
                    auto_close BOOL NOT NULL,
                    route_admin CHAR(30) NOT NULL
                );

            BEGIN TRANSACTION;
            INSERT INTO Setting
                (cookie_type, load_image, load_css, hide_chrome, auto_close, route_admin)
            SELECT
                'max', 0, 0, 0, 1, '/admin'
            WHERE NOT EXISTS (
                SELECT
                    1
                FROM
                    Setting
            );
            COMMIT;
            """

        self.conn.cursor().executescript(script)
        self.conn.commit()

    def get_info(self):
        data = {}
        cursor = self.conn.cursor()
        script = f"""--sql
            SELECT * FROM Setting;
            """
        cursor.execute(script)
        result = cursor.fetchall()
        for row in result:
            data['cookie_type'] = row['cookie_type']
            data['load_image'] = row['load_image']
            data['load_css'] = row['load_css']
            data['hide_chrome'] = row['hide_chrome']
            data['auto_close'] = row['auto_close']
            data['route_admin'] = row['route_admin']
        return data

    def change_info(self, cookie_type, load_image, load_css, hide_chrome, auto_close, route_admin):
        script = f"""--sql
            UPDATE Setting
            SET cookie_type = '{cookie_type}', load_image = {load_image}, load_css = {load_css}, hide_chrome = {hide_chrome}, auto_close = {auto_close}, route_admin = '{route_admin}';
            """
        self.conn.cursor().executescript(script)
        self.conn.commit()
        return self.get_info()
