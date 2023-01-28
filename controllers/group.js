const Group = require('../models/group');
const UserGroup = require('../models/usergroup');

exports.createGroup = async (req, res, next) => {
    console.log(req.body);
    const {group_name} = req.body;
    const group = await req.user.createGroup({
        name: group_name
    })
    res.status(200).json({success : true, group});

}

exports.getGroups= async (req, res, next) => {
    // console.log(`gtting all groups`);
    
    const arrayOfGroups = await UserGroup.findAll();

    const groups = [];
    
    let i=0;
    while(i<arrayOfGroups.length){
        const data = await Group.findOne({where : {id : arrayOfGroups[i].groupId}});
        groups.push(data);
        i++;
    }

    // console.log(groups);
    res.status(200).json({success : true, groups});
}