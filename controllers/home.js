const path = require('path');

exports.home = (req, res, next) => {
    console.log('===========================================================================');
    res.status(202).sendFile(path.join(__dirname,'../','frontend/html/home.html'));
}