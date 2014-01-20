module.exports = function (db, cb) {
    db.define('User', {
        email: {type: String, index: {unique: true}},
        password: String,
        session_id: String,
        admin: Boolean,
        rights: Object
    });
    return cb();
};