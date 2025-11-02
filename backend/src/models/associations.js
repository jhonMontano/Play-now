import Roles from "./roles.js";
import User from "./user.js";
import Mall from "./mall.js";
import Court from "./court.js";

Roles.hasMany(User, { foreignKey: "idRol", as: "usuarios" });
User.belongsTo(Roles, { foreignKey: "idRol", as: "rol" });

Mall.belongsTo(User, { foreignKey: "adminId", as: "administrador" });
User.hasOne(Mall, { foreignKey: "adminId", as: "mallAdministrado" });

Mall.hasMany(Court, { foreignKey: "mallId", as: "canchas" });
Court.belongsTo(Mall, { foreignKey: "mallId", as: "mall" });

export { Roles, User, Mall, Court };

