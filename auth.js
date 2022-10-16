const { Exco } = require('./Model/exco');

const auth = (req, res, next) => {
    let token = req.body.token;

    Exco.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ error: true })

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };
