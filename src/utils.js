const SQL = require('sequelize');

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  // remove when deploying
  const db = new SQL('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './store.sqlite',
    operatorsAliases,
    logging: false,
  });
  
  const users = db.define('user', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: SQL.STRING,
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: {
      // uniqueness
      type: SQL.STRING,
      allowNull: false,
      unique: true
    },
    token: SQL.STRING,
  });
  
  const posts = db.define('post', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    message: SQL.STRING,
    userId: SQL.INTEGER,
  });  

  // development only
  // db.sync({ force: true });

  return { users, posts };
};
