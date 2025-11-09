
function initBaseRoles() {
  const existing = JSON.parse(localStorage.getItem("lmsData"));

  if (!existing) {
    const baseData = {
      users: [
        {
          id: 1,
          name: "Super Admin",
          email: "superadmin@abc.edu",
          password: "1234",
          role: "abmin"
        },
        {
          id: 2,
          name: "Administrador General",
          email: "administrador@abc.edu",
          password: "1234",
          role: "administrador"
        },
        {
          id: 3,
          name: "Profesor Carlos",
          email: "maestro@abc.edu",
          password: "1234",
          role: "maestro"
        },
        {
          id: 4,
          name: "Estudiante Laura",
          email: "estudiante@abc.edu",
          password: "1234",
          role: "estudiante"
        }
      ],
      courses: []
    };

    localStorage.setItem("lmsData", JSON.stringify(baseData));
    console.log(" Estructura inicial creada en localStorage.");
  }
}

initBaseRoles();


class RoleManager {
  static getUserByEmail(email) {
    const data = JSON.parse(localStorage.getItem("lmsData")) || { users: [] };
    return data.users.find(u => u.email === email);
  }

  static setRole(userId, newRole, currentUser) {
    const data = JSON.parse(localStorage.getItem("lmsData")) || { users: [] };
    const user = data.users.find(u => u.id === userId);

    if (!user) return alert("Usuario no encontrado.");

    if (currentUser.role === "abmin") {
      user.role = newRole; 
    } else if (currentUser.role === "administrador" && newRole === "maestro") {
      user.role = "maestro";
    } else {
      alert("No tienes permisos para cambiar este rol.");
      return;
    }

    localStorage.setItem("lmsData", JSON.stringify(data));
    alert(` Rol actualizado a ${newRole} para ${user.name}`);
  }

  static listUsers() {
    const data = JSON.parse(localStorage.getItem("lmsData")) || { users: [] };
    console.table(data.users);
  }
}
