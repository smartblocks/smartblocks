module.exports = function (db, cb) {
    db.define('User', {
        email: String,
        password: String,
        session_id: String,
        admin: Boolean,
        rights: Object
    });
    return cb();
};