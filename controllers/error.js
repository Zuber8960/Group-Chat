const path = require('path');

exports.get404 = (req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'../','frontend/html/error.html'));
}