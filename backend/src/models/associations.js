import Roles from "./roles.js";
import User from "./user.js";
import Mall from "./mall.js";

Roles.hasMany(User, { foreignKey: "idRol", as: "usuarios" });
User.belongsTo(Roles, { foreignKey: "idRol", as: "rol" });

Mall.belongsTo(User, { foreignKey: "adminId", as: "administrador" });

User.hasOne(Mall, { foreignKey: "adminId", as: "mallAdministrado" });

export { Roles, User, Mall };
