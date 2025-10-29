import Roles from "./roles.js";
import User from "./user.js";
import Mall from "./mall.js";

Roles.hasMany(User, { foreignKey: "idRol", as: "usuarios" });
User.belongsTo(Roles, { foreignKey: "idRol", as: "rol" });

Mall.hasOne(User, { 
  foreignKey: "idMall", 
  as: "administrador",
  constraints: false
});

User.belongsTo(Mall, { 
  foreignKey: "idMall", 
  as: "mall" 
});

export { Roles, User, Mall };