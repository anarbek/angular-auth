require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt } = require("express-jwt");
const config = require('config.json');
const jwt = require('jsonwebtoken');
const { secret } = config;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
const jwtConfig = { secret: config.secret, algorithms: ["HS256"] }
app.use(expressjwt(jwtConfig).unless({ path: ['/authenticate'] } ));

// global error handler
app.use((err, req, res, next) => {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
});

// users hardcoded for simplicity, store in a db for production applications
const users = [
    {
        id: 1,
        username: 'test',
        password: 'test',
        firstName: 'Test',
        lastName: 'User',
        authorities: ['CAN_TEST']
    },
    {
        id: 2,
        username: 'user',
        password: 'user',
        firstName: 'User',
        lastName: 'Userskiy',
        authorities: ['CAN_LIST_USERS','CAN_USE']
    }
];

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({
            sub: user.id,
            authorities: user.authorities
        }, config.secret);
        const { password, ...userWithoutPassword } = user;
        console.log("Issuing the token: "+token);
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

app.post('/authenticate', (req, res, next) => {
    authenticate(req.body)
        .then(user => user
            ? res.json(user)
            : res.status(401).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
});

app.get('/users', async (req, res, next) => {
    console.log(req.auth)
    if (!req.auth.authorities.find(a => a==='CAN_LIST_USERS')) {
        return res.sendStatus(403)
    }
    getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
});

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});


