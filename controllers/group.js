const Group = require('../models/group');
const UserGroup = require('../models/usergroup');

exports.createGroup = async (req, res, next) => {
    const {group_name} = req.body;

    const group = await req.user.createGroup({
        name: group_name
    }, {through: {isAdmin : true}})

    console.log(`success ===>group`);
    return res.status(200).json({success : true, name: group.name , id:group.id});

}

exports.getGroups= async (req, res, next) => {

    const arrayOfGroups = await req.user.getGroups({
        attributes : ["id" , "name"],
    } );

    const groups = arrayOfGroups.map(ele => {
        return {id : ele.id, name: ele.name};
    });

    res.status(200).json({success : true, groups});
}