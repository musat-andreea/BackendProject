const request = require('request');

const checkUserLoggedin = (req, res, next) => {
    const options = {
        url: 'http://user:3001/api/users/check',
        method: 'GET',
        headers: {
            'Cookie': req.headers.cookie,
        },
    }

    request(options, (err, _res, body) => {
        if (err) {
            console.log(err);
            res.send(err);
            res.status(500).json({ status: 'fail', message: 'internal server error' });
        } else {
            const { status, user, message } = JSON.parse(body);
            if (status === 'success') {
                req.user = user;
                next();
            } else {
                return res.status(404).json({ status, message });
            }
        }
    });
}

module.exports = checkUserLoggedin;
