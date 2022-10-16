const express = require('express');
const router = express.Router();

const { Exco } = require('./Model/exco');
const { StudentRecord } = require('./Model/studentRecord');

// Middleware
const { auth } = require('./auth');

router.post('/newExco', (req, res) => {
    const exco = new Exco(req.body);
    exco.save( (err, doc) => {
        if(err) res.send(err);

        exco.generateToken( (err, id) => {
            if(err) res.json({ msg: "Unable to assign a token to you" })

            res.status(200).send(doc);
        } )
    } )
})

router.post('/login', (req, res) => {

    Exco.findOne( {email: req.body.email}, (err, user) => {
        
        if(!user) return res.json({ 
            isAuth: false, 
            msg: "User not found, Check email" 
        });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ 
                isAuth: false, 
                msg: "Incorrect Password" 
            })

            user.generateToken( (err, user) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ isAuth: true, user });
            } )
        })

    } )

})

router.post('/studentRecord', auth, (req, res) => {
    if(req.user){
        const studentRecord = new StudentRecord(req.body.details);
        studentRecord.save( (err, doc) => {
            if(err) res.status(400).send(err)
            res.status(200).send(doc);
        } )
    }
})

router.get('/studentRecord', (req, res) => {
    StudentRecord.find( {}, (err, doc) => {
        if(err) res.status(400).send(err);
        res.status(200).send(doc);
    } )
})

router.post('/collect', auth, (req, res) => {
    if(req.user){
        StudentRecord.updateOne( 
            {_id: req.body.details.id},
            { $set: { collected: true } },
            (err, doc) => {
                if(err) res.status(400).send(err);
                res.status(200).send(doc);
            }
        )
    }
})

router.post('/logout', auth, (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    })
})

module.exports = router;
