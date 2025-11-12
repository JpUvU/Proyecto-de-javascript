(function generarCursosAleatorios() {
  const LMS_KEY = "lmsData";
  const data = JSON.parse(localStorage.getItem(LMS_KEY)) || { users: [], courses: [] };
  const cursos = Array.isArray(data.courses) ? data.courses : [];

  const totalCursos = 35;
  if (cursos.length >= totalCursos) {
    console.log(`✅ Ya existen ${cursos.length} cursos en localStorage.`);
    return;
  }

  const titulosBase = [
    "Introducción a JavaScript", "HTML y CSS desde cero", "Python para principiantes",
    "React avanzado", "Node.js con Express", "Bases de Datos MySQL",
    "Programación en Java", "C# y .NET", "Fundamentos de TypeScript",
    "Desarrollo Web Fullstack", "APIs REST con FastAPI", "Vue.js moderno",
    "Angular para desarrolladores", "Docker y DevOps básico", "Git y GitHub profesional",
    "Programación orientada a objetos", "Algoritmos y estructuras de datos",
    "Machine Learning con Python", "Inteligencia Artificial práctica",
    "Flutter y desarrollo móvil", "Kotlin para Android", "Swift para iOS",
    "Diseño de interfaces con Figma", "Testing con Jest", "Next.js y SSR",
    "Despliegue en la nube con AWS", "Linux para desarrolladores",
    "Seguridad informática y hacking ético", "Programación con Rust",
    "Automatización con Python", "PostgreSQL y consultas avanzadas",
    "MongoDB para principiantes", "React Native práctico",
    "Patrones de diseño en software", "API GraphQL con Node"
  ];

  const categorias = [
    "Frontend", "Backend", "Fullstack", "DevOps", "Móvil", "IA", "Bases de Datos", "Seguridad"
  ];

  const niveles = ["Básico", "Intermedio", "Avanzado"];

  const descripciones = [
    "Aprende los fundamentos y desarrolla proyectos reales.",
    "Conoce las mejores prácticas de la industria.",
    "Desarrolla aplicaciones modernas paso a paso.",
    "Domina herramientas esenciales para tu carrera.",
    "Aplica tus conocimientos con ejercicios prácticos.",
    "Conviértete en un experto desde cero."
  ];

  const imagenesProgramacion = [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80"
  ];

  const referenceTeacher =
    data.users?.find(u => u.role === "maestro") ||
    data.users?.find(u => ["abmin", "administrador"].includes(u.role)) || { id: 0, name: "Equipo LMS" };

  const docentesDisponibles = (data.users || []).filter(u =>
    ["maestro", "administrador", "abmin"].includes(u.role)
  );

  const pickTeachers = () => {
    if (docentesDisponibles.length === 0) return [{ ...referenceTeacher }];
    const total = Math.min(docentesDisponibles.length, Math.floor(Math.random() * 3) + 1);
    const shuffled = [...docentesDisponibles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, total).map(t => ({ id: t.id, name: t.name }));
  };

  let lastId = cursos.reduce((max, course) => Math.max(max, course.id || 0), 0);

  while (cursos.length < totalCursos) {
    lastId += 1;
    const titulo = titulosBase[Math.floor(Math.random() * titulosBase.length)];
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const nivel = niveles[Math.floor(Math.random() * niveles.length)];
    const duracion = `${Math.floor(Math.random() * 40) + 10} horas`;
    const precio = (Math.floor(Math.random() * 25) + 5) * 10000;
    const descripcionBase = descripciones[Math.floor(Math.random() * descripciones.length)];
    const assignedTeachers = pickTeachers();

    cursos.push({
      id: lastId,
      title: titulo,
      description: `${descripcionBase} Nivel ${nivel}, enfocado en ${categoria}. Duración: ${duracion}.`,
      teacherId: assignedTeachers[0]?.id ?? referenceTeacher.id,
      teacherName: assignedTeachers.map(t => t.name).join(", "),
      teachers: assignedTeachers,
      category: categoria,
      level: nivel,
      duration: duracion,
      price: precio,
      media: [
        {
          type: "image",
          url: imagenesProgramacion[Math.floor(Math.random() * imagenesProgramacion.length)]
        }
      ],
      createdAt: new Date().toISOString()
    });
  }

  data.courses = cursos;
  localStorage.setItem(LMS_KEY, JSON.stringify(data));
  console.log(`🎉 Se generaron ${totalCursos} cursos y se guardaron en "${LMS_KEY}".`);
})();
