
class DataService {
  static loadData() {
    return JSON.parse(localStorage.getItem("lmsData")) || { users: [], courses: [] };
  }

  static saveData(data) {
    localStorage.setItem("lmsData", JSON.stringify(data));
  }


  static getCourses() {
    return this.loadData().courses;
  }

  static getCourseById(id) {
    const data = this.loadData();
    return data.courses.find(c => c.id === id);
  }

  static addCourse(course) {
    const data = this.loadData();
    data.courses.push(course);
    this.saveData(data);
  }

  static updateCourse(courseId, updates) {
    const data = this.loadData();
    const index = data.courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      data.courses[index] = { ...data.courses[index], ...updates };
      this.saveData(data);
    }
  }

  static deleteCourse(courseId) {
    const data = this.loadData();
    data.courses = data.courses.filter(c => c.id !== courseId);
    this.saveData(data);
  }


  static getUserById(id) {
    const data = this.loadData();
    return data.users.find(u => u.id === id);
  }

  static getAllUsers() {
    const data = this.loadData();
    return data.users;
  }

  static updateUser(userId, updates) {
    const data = this.loadData();
    const index = data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates };
      this.saveData(data);
    }
  }
}


class PermissionService {
  static canCreateCourse(user) {
    return ["maestro", "administrador", "abmin"].includes(user.role);
  }

  static canEditCourse(user, course) {
    if (user.role === "abmin" || user.role === "administrador") return true;
    return user.role === "maestro" && course.teacherId === user.id;
  }

  static canDeleteCourse(user, course) {
    return this.canEditCourse(user, course);
  }

  static canAssignRole(user, targetRole) {
    if (user.role === "abmin") return true; 
    if (user.role === "administrador" && targetRole === "maestro") return true;
    return false;
  }

  static canDeleteUser(user) {
    return user.role === "abmin" || user.role === "administrador";
  }
}


(function initLMSData() {
  const existing = JSON.parse(localStorage.getItem("lmsData"));
  if (!existing) {
    const baseData = {
      users: [
        { id: 1, name: "Super Abmin", email: "abmin@abc.edu", password: "1234", role: "abmin" },
        { id: 2, name: "Administrador", email: "admin@abc.edu", password: "1234", role: "administrador" },
        { id: 3, name: "Profe Ana", email: "maestro@abc.edu", password: "1234", role: "maestro" },
        { id: 4, name: "Estudiante Juan", email: "estudiante@abc.edu", password: "1234", role: "estudiante" }
      ],
      courses: []
    };
    localStorage.setItem("lmsData", JSON.stringify(baseData));
    console.log(" Estructura LMS inicial creada en localStorage.");
  }
})();


function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedInAdmin")) || null;
}

