const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_I = 10;

const excoSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minLength: 6
    },
    token: {
        type: String
    }
});


excoSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified("password")){
        bcrypt.genSalt(SALT_I, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash( user.password, salt, function(err, hash) {
                if(err) return next(err);

                user.password = hash;
                next();
            } )
        })
    }
    else{
        next();
    }

});


excoSchema.methods.comparePassword = function(cPassword, cb) {
    bcrypt.compare(cPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

excoSchema.methods.generateToken = function(cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.secret); // '18000s'

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

excoSchema.statics.findByToken = function(token, cb) {
    var user = this;

    jwt.verify(token, process.env.secret, function(err, decode) {
        if(err) return cb(err);

        user.findOne({"_id": decode, "token": token}, function(err, user) {
            if(err) return cb(err)
            cb(null, user)
        })
    })

}

excoSchema.methods.deleteToken = function(token, cb) {
    var user = this;

    user.updateOne({$unset: {token: 1}}, (err, user) => {
        if(err) return cb(err);
        cb(null, user);
    })
}


const Exco = mongoose.model("Excos", excoSchema);

module.exports = { Exco };
