import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';

let users = [
    { id: 1, name: 'کاشف', username: 'themesbrand', password: '123456', email: 'p_shekari@kashef.ir', role: 'role', token: token }
];

const fakeBackend = () => {
    // This sets the mock adapter on the default instance
    var mock = new MockAdapter(axios);

    mock.onPost('/register').reply(function (config) {

        const user = JSON.parse(config['data']);
        user.id = users.length + 1;
        users.push(user);

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, user]);
            });
        });
    });

    mock.onPost('/login').reply(function (config) {
        const user = JSON.parse(config['data']);
        const validUser = users.filter(usr => usr.email === user.username && usr.password === user.password);

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (validUser['length'] === 1) {
                    resolve([200, validUser[0]]);
                } else {
                    reject({"message": "نام کاربری و رمز عبور نامعتبر هستند. لطفاً نام کاربری و رمز عبور صحیح را وارد کنید."});
                }
            });
        });
    });

    mock.onPost('/forget-pwd').reply(function (config) {
        // User needs to check that user is eXist or not and send mail for Reset New password

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, "رمز عبور خود را بازنشانی کنید."]);
            });
        });

    });

}

export default fakeBackend;