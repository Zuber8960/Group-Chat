const path = require('path');

exports.get404 = (req, res, next) => {
    console.log('===========================================================================');
    res.status(404).sendFile(path.join(__dirname,'../','frontend/html/error.html'));
}