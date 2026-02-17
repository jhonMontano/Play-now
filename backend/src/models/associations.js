import Roles from "./Roles.js";
import User from "./user.js";
import Mall from "./mall.js";
import Court from "./court.js";
import Reservation from "./reservation.js";
import Sport from "./sport.js";

Roles.hasMany(User, { foreignKey: "idRol", as: "usuarios" });
User.belongsTo(Roles, { foreignKey: "idRol", as: "rol" });

Mall.belongsTo(User, { foreignKey: "adminId", as: "administrador" });
User.hasOne(Mall, { foreignKey: "adminId", as: "mallAdministrado" });

Mall.hasMany(Court, { foreignKey: "mallId", as: "canchas" });
Court.belongsTo(Mall, { foreignKey: "mallId", as: "mall" });

Court.hasMany(Reservation, { foreignKey: "courtId", as: "reservas" });
Reservation.belongsTo(Court, { foreignKey: "courtId", as: "cancha" });

User.hasMany(Reservation, { foreignKey: "userId", as: "reservas" });
Reservation.belongsTo(User, { foreignKey: "userId", as: "cliente" });

Sport.hasMany(Court, { foreignKey: "sportId", as: "canchas" });
Court.belongsTo(Sport, { foreignKey: "sportId", as: "deporte" })

export { Roles, User, Mall, Court, Reservation };
