const Categories = require('./categories.model');
const Tasks = require('./tasks.model');
const Users = require('./users.model');
const UserTasks = require('./userTasks.model');

const initModels = () => {
    // Tasks - Categories
    Tasks.belongsTo(Categories, {foreignKey: 'categoryId'});
    Categories.hasMany(Tasks, {foreignKey: 'categoryId'});

    // Tasks - Users

    UserTasks.belongsTo(Tasks, {foreignKey: 'taskId'});
    Tasks.hasMany(UserTasks, {foreignKey: 'taskId'});

    UserTasks.belongsTo(Users, {foreignKey: 'userId'});
    Users.hasMany(UserTasks, {foreignKey: 'userId'});
};

module.exports = initModels;
