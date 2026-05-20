const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section");

const pendingTasksCount = document.getElementById("pendingTasksCount");
const nextTaskTitle = document.getElementById("nextTaskTitle");
const nextTaskDate = document.getElementById("nextTaskDate");
const weeklyLoadText = document.getElementById("weeklyLoadText");
const weeklyLoadDetail = document.getElementById("weeklyLoadDetail");
const systemDateTime = document.getElementById("systemDateTime");
const mainRecommendation = document.getElementById("mainRecommendation");

const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const priorityInput = document.getElementById("priorityInput");
const feedbackMessage = document.getElementById("feedbackMessage");
const emptyTasksMessage = document.getElementById("emptyTasksMessage");
const formErrorMessage = document.getElementById("formErrorMessage");

const searchTaskInput = document.getElementById("searchTaskInput");
const filterSubjectInput = document.getElementById("filterSubjectInput");
const filterPriorityInput = document.getElementById("filterPriorityInput");
const sortTasksInput = document.getElementById("sortTasksInput");
const todayTasksBtn = document.getElementById("todayTasksBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const addSubjectBtn = document.getElementById("addSubjectBtn");
const newSubjectInput = document.getElementById("newSubjectInput");
const subjectsContainer = document.getElementById("subjectsContainer");
const subjectFeedbackMessage = document.getElementById("subjectFeedbackMessage");
const emptySubjectsMessage = document.getElementById("emptySubjectsMessage");

const saveProfileBtn = document.getElementById("saveProfileBtn");
const studentNameInput = document.getElementById("studentNameInput");
const degreeInput = document.getElementById("degreeInput");
const courseInput = document.getElementById("courseInput");
const profileFeedbackMessage = document.getElementById("profileFeedbackMessage");

const calendarMonthTitle = document.getElementById("calendarMonthTitle");
const calendarDays = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const todayMonthBtn = document.getElementById("todayMonthBtn");

const futureBtn = document.getElementById("futureBtn");
const futureRisk = document.getElementById("futureRisk");
const futureRiskText = document.getElementById("futureRiskText");
const criticalDay = document.getElementById("criticalDay");
const futureAdvice = document.getElementById("futureAdvice");
const futureRiskBar = document.getElementById("futureRiskBar");
const futureStatus = document.getElementById("futureStatus");
const futureAlert = document.getElementById("futureAlert");
const futureFocusTask = document.getElementById("futureFocusTask");
const futureEnergy = document.getElementById("futureEnergy");
const futureConfidence = document.getElementById("futureConfidence");
const futureTimeline = document.getElementById("futureTimeline");

let tasks = [];
let subjects = [];
let profile = {};
let currentCalendarDate = new Date();
let showOnlyToday = false;

/* ---------- LOCAL STORAGE ---------- */

function saveData() {
    localStorage.setItem("campusflow_tasks", JSON.stringify(tasks));
    localStorage.setItem("campusflow_subjects", JSON.stringify(subjects));
    localStorage.setItem("campusflow_profile", JSON.stringify(profile));
}

function normalizePriority(priority) {
    if (priority === "urgent") return "high";
    if (priority === "normal") return "medium";
    if (priority === "easy") return "low";
    if (["low", "medium", "high"].includes(priority)) return priority;
    return "medium";
}

function loadData() {
    try {
        const savedTasks = localStorage.getItem("campusflow_tasks");
        const savedSubjects = localStorage.getItem("campusflow_subjects");
        const savedProfile = localStorage.getItem("campusflow_profile");

        tasks = savedTasks ? JSON.parse(savedTasks) : [];
        subjects = savedSubjects ? JSON.parse(savedSubjects) : [];
        profile = savedProfile ? JSON.parse(savedProfile) : {};

        tasks = tasks
            .filter(task => task && task.title && task.subject && task.date)
            .map(task => ({
                ...task,
                id: Number(task.id) || Date.now() + Math.random(),
                priority: normalizePriority(task.priority),
                completed: Boolean(task.completed)
            }));
    } catch (error) {
        tasks = [];
        subjects = [];
        profile = {};
    }
}

/* ---------- NAVEGACIÓN ---------- */

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(section => section.classList.remove("active-section"));

        tab.classList.add("active");

        const sectionId = tab.dataset.section;
        document.getElementById(sectionId).classList.add("active-section");
    });
});

/* ---------- UTILIDADES ---------- */

function showFeedback(element, text) {
    element.textContent = text;

    setTimeout(() => {
        element.textContent = "";
    }, 2500);
}

function updateSystemDateTime() {
    const now = new Date();

    systemDateTime.textContent = now.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }) + " · " + now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getPriorityText(priority) {
    if (priority === "high") return "Prioridad alta";
    if (priority === "low") return "Prioridad baja";
    return "Prioridad media";
}

function parseLocalDate(dateValue) {
    const [year, month, day] = dateValue.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function getDateText(dateValue) {
    if (!dateValue) return "Sin fecha";
    return parseLocalDate(dateValue).toLocaleDateString("es-ES");
}

function getTaskDateTimeText(dateValue, timeValue) {
    const dateText = getDateText(dateValue);
    if (!timeValue) return dateText;
    return `${dateText} · ${timeValue}`;
}

function isToday(dateValue) {
    const today = new Date();
    const taskDate = parseLocalDate(dateValue);

    return today.getFullYear() === taskDate.getFullYear()
        && today.getMonth() === taskDate.getMonth()
        && today.getDate() === taskDate.getDate();
}

function updateEmptyMessages() {
    emptySubjectsMessage.style.display = subjects.length === 0 ? "block" : "none";
}

/* ---------- PERFIL ---------- */

function renderProfile() {
    if (!profile.name) return;

    studentNameInput.value = profile.name || "";
    degreeInput.value = profile.degree || "";
    courseInput.value = profile.course || "";

    document.querySelector(".user-badge").textContent = profile.name;
}

saveProfileBtn.addEventListener("click", () => {
    const studentName = studentNameInput.value.trim();
    const degree = degreeInput.value.trim();
    const course = courseInput.value.trim();

    if (studentName === "" || degree === "" || course === "") {
        showFeedback(profileFeedbackMessage, "Completa todos los campos del perfil.");
        return;
    }

    profile = {
        name: studentName,
        degree: degree,
        course: course
    };

    document.querySelector(".user-badge").textContent = studentName;

    saveData();
    showFeedback(profileFeedbackMessage, "Perfil guardado correctamente.");

    setTimeout(() => {
        document.querySelector('[data-section="inicio"]').click();
    }, 1000);
});

/* ---------- ASIGNATURAS ---------- */

function renderSubjects() {
    subjectsContainer.innerHTML = "";

    subjectInput.innerHTML = `
        <option value="">Selecciona asignatura...</option>
    `;

    filterSubjectInput.innerHTML = `
        <option value="">Todas las asignaturas</option>
    `;

    subjects.forEach(subjectName => {
        const subjectCard = document.createElement("article");
        subjectCard.classList.add("subject-card");

        subjectCard.innerHTML = `
            <h3>${subjectName}</h3>
            <p>Asignatura disponible para nuevas tareas</p>
        `;

        subjectsContainer.appendChild(subjectCard);

        const optionTask = document.createElement("option");
        optionTask.value = subjectName;
        optionTask.textContent = subjectName;
        subjectInput.appendChild(optionTask);

        const optionFilter = document.createElement("option");
        optionFilter.value = subjectName;
        optionFilter.textContent = subjectName;
        filterSubjectInput.appendChild(optionFilter);
    });

    updateEmptyMessages();
}

addSubjectBtn.addEventListener("click", () => {
    const subjectName = newSubjectInput.value.trim();

    if (subjectName === "") {
        showFeedback(subjectFeedbackMessage, "Escribe el nombre de la asignatura.");
        return;
    }

    if (subjects.includes(subjectName)) {
        showFeedback(subjectFeedbackMessage, "Esa asignatura ya existe.");
        return;
    }

    subjects.push(subjectName);
    newSubjectInput.value = "";

    saveData();
    renderSubjects();

    showFeedback(subjectFeedbackMessage, "Asignatura añadida correctamente.");
});

/* ---------- ERRORES EN FORMULARIO ---------- */

function clearTaskFormErrors() {
    taskInput.classList.remove("input-error");
    subjectInput.classList.remove("input-error");
    dateInput.classList.remove("input-error");
    formErrorMessage.textContent = "";
}

function showTaskFormError(input, message) {
    input.classList.add("input-error");
    formErrorMessage.textContent = message;
}

[taskInput, subjectInput, dateInput].forEach(input => {
    input.addEventListener("input", clearTaskFormErrors);
    input.addEventListener("change", clearTaskFormErrors);
});

/* ---------- FILTROS Y ORDENACIÓN ---------- */

function getFilteredAndSortedTasks() {
    let result = [...tasks];

    const searchText = searchTaskInput.value.toLowerCase().trim();
    const subjectFilter = filterSubjectInput.value;
    const priorityFilter = filterPriorityInput.value;
    const sortMode = sortTasksInput.value;

    if (searchText !== "") {
        result = result.filter(task =>
            task.title.toLowerCase().includes(searchText) ||
            task.subject.toLowerCase().includes(searchText)
        );
    }

    if (subjectFilter !== "") {
        result = result.filter(task => task.subject === subjectFilter);
    }

    if (priorityFilter !== "") {
        result = result.filter(task => task.priority === priorityFilter);
    }

    if (showOnlyToday) {
        result = result.filter(task => isToday(task.date));
    }

    if (sortMode === "date") {
        result.sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
    }

    if (sortMode === "priority") {
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    if (sortMode === "subject") {
        result.sort((a, b) => a.subject.localeCompare(b.subject));
    }

    return result;
}

searchTaskInput.addEventListener("input", renderTasks);
filterSubjectInput.addEventListener("change", renderTasks);
filterPriorityInput.addEventListener("change", renderTasks);
sortTasksInput.addEventListener("change", renderTasks);

todayTasksBtn.addEventListener("click", () => {
    showOnlyToday = true;
    renderTasks();
});

clearFiltersBtn.addEventListener("click", () => {
    searchTaskInput.value = "";
    filterSubjectInput.value = "";
    filterPriorityInput.value = "";
    sortTasksInput.value = "date";
    showOnlyToday = false;
    renderTasks();
});

/* ---------- TAREAS ---------- */

function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = getFilteredAndSortedTasks();

    visibleTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task", task.priority);

        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;

        li.innerHTML = `
            <div>
                <strong>${task.title}</strong>
                <span>${task.subject} · Entrega: ${getTaskDateTimeText(task.date, task.time)} · ${getPriorityText(task.priority)}</span>
            </div>
            <button class="complete-btn">${task.completed ? "Reabrir" : "Completar"}</button>
        `;

        taskList.appendChild(li);
    });

    if (tasks.length === 0) {
        emptyTasksMessage.textContent = "Todavía no hay tareas. Añade una tarea para empezar a organizarte.";
        emptyTasksMessage.style.display = "block";
    } else if (visibleTasks.length === 0) {
        emptyTasksMessage.textContent = "No hay tareas que coincidan con los filtros seleccionados.";
        emptyTasksMessage.style.display = "block";
    } else {
        emptyTasksMessage.style.display = "none";
    }
}

addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const subjectText = subjectInput.value;
    const dateValue = dateInput.value;
    const timeValue = timeInput.value;
    const priority = priorityInput.value;

    clearTaskFormErrors();

    if (taskText === "") {
        showTaskFormError(taskInput, "Escribe el nombre de la tarea.");
        return;
    }

    if (subjectText === "") {
        showTaskFormError(subjectInput, "Selecciona una asignatura para la tarea.");
        return;
    }

    if (dateValue === "") {
        showTaskFormError(dateInput, "Selecciona una fecha. Es necesaria para colocar la tarea en el calendario.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskText,
        subject: subjectText,
        date: dateValue,
        time: timeValue,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";
    subjectInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    priorityInput.value = "medium";

    saveData();
    renderTasks();
    updateDashboard();
    renderCalendar();
    analyzeFutureMode(false);

    showFeedback(feedbackMessage, "Tarea añadida correctamente.");
});

taskList.addEventListener("click", event => {
    if (!event.target.classList.contains("complete-btn")) return;

    const li = event.target.closest(".task");
    const taskId = Number(li.dataset.id);

    tasks = tasks.map(task => {
        if (Number(task.id) === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveData();
    renderTasks();
    updateDashboard();
    renderCalendar();
    analyzeFutureMode(false);

    showFeedback(feedbackMessage, "Estado de la tarea actualizado.");
});

/* ---------- DASHBOARD ---------- */

function updateDashboard() {
    const pendingTasks = tasks.filter(task => !task.completed);
    pendingTasksCount.textContent = pendingTasks.length;

    if (pendingTasks.length === 0) {
        nextTaskTitle.textContent = "No hay entregas registradas";
        nextTaskDate.textContent = "Añade una tarea con fecha";
        mainRecommendation.textContent = "Añade tus asignaturas y tareas para que CampusFlow pueda ayudarte a organizar tu semana.";
    } else {
        const sortedTasks = [...pendingTasks].sort((a, b) => {
            return parseLocalDate(a.date) - parseLocalDate(b.date);
        });

        const nextTask = sortedTasks[0];

        nextTaskTitle.textContent = nextTask.title;
        nextTaskDate.textContent = `${nextTask.subject} · ${getTaskDateTimeText(nextTask.date, nextTask.time)}`;
        mainRecommendation.textContent = `Empieza por “${nextTask.title}”, porque es la próxima entrega registrada.`;
    }

    updateWeeklyLoad();
}

function getStartOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);
    return result;
}

function updateWeeklyLoad() {
    const today = new Date();
    const start = getStartOfWeek(today);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const weekTasks = tasks.filter(task => {
        if (task.completed) return false;

        const taskDate = parseLocalDate(task.date);
        return taskDate >= start && taskDate <= end;
    });

    const highTasks = weekTasks.filter(task => task.priority === "high");

    if (weekTasks.length === 0) {
        weeklyLoadText.textContent = "Sin carga";
        weeklyLoadDetail.textContent = "No hay tareas pendientes esta semana";
    } else if (weekTasks.length <= 2 && highTasks.length === 0) {
        weeklyLoadText.textContent = "Baja";
        weeklyLoadDetail.textContent = `${weekTasks.length} tarea(s) esta semana`;
    } else if (weekTasks.length <= 5) {
        weeklyLoadText.textContent = "Moderada";
        weeklyLoadDetail.textContent = `${weekTasks.length} tarea(s), ${highTasks.length} de prioridad alta`;
    } else {
        weeklyLoadText.textContent = "Alta";
        weeklyLoadDetail.textContent = `${weekTasks.length} tarea(s), conviene reorganizar`;
    }
}

/* ---------- CALENDARIO ---------- */

function renderCalendar() {
    calendarDays.innerHTML = "";

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const today = new Date();

    calendarMonthTitle.textContent = currentCalendarDate.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    for (let i = 0; i < startOffset; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-cell", "empty-cell");
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const cellDate = new Date(year, month, day);

        const cell = document.createElement("div");
        cell.classList.add("calendar-cell");

        const isCurrentDay =
            cellDate.getFullYear() === today.getFullYear() &&
            cellDate.getMonth() === today.getMonth() &&
            cellDate.getDate() === today.getDate();

        if (isCurrentDay) {
            cell.classList.add("today-cell");
        }

        const dayNumber = document.createElement("strong");
        dayNumber.textContent = isCurrentDay ? `${day} · Hoy` : day;
        cell.appendChild(dayNumber);

        const tasksForDay = tasks.filter(task => {
            if (task.completed) return false;

            const taskDate = parseLocalDate(task.date);

            return taskDate.getFullYear() === cellDate.getFullYear()
                && taskDate.getMonth() === cellDate.getMonth()
                && taskDate.getDate() === cellDate.getDate();
        });

        tasksForDay.forEach(task => {
            const event = document.createElement("p");
            event.classList.add("calendar-event", task.priority);
            event.textContent = `${task.time || "--:--"} ${task.title}`;
            cell.appendChild(event);
        });

        calendarDays.appendChild(cell);
    }
}

prevMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
});

todayMonthBtn.addEventListener("click", () => {
    currentCalendarDate = new Date();
    renderCalendar();
});

/* ---------- FUTURE MODE ---------- */

function analyzeFutureMode(showPopup = false) {
    futureStatus.textContent = "Escaneando tareas, fechas y prioridades...";
    futureBtn.textContent = "Analizando...";
    futureBtn.disabled = true;
    futureAlert.classList.add("hidden");

    setTimeout(() => {
        const pendingTasks = tasks.filter(task => !task.completed);
        const highPriorityTasks = pendingTasks.filter(task => task.priority === "high");

        if (pendingTasks.length === 0) {
            futureRisk.textContent = "0%";
            futureRiskBar.style.width = "0%";
            futureRiskText.textContent = "No hay tareas pendientes.";
            criticalDay.textContent = "Sin día crítico";
            futureAdvice.textContent = "Añade tareas para que Future Mode pueda simular tu semana.";
            futureFocusTask.textContent = "Sin tarea prioritaria";
            futureEnergy.textContent = "Baja";
            futureConfidence.textContent = "25%";
            futureTimeline.innerHTML = `
                <p class="card-note">
                    No hay tareas suficientes para crear una línea temporal predictiva.
                </p>
            `;
            futureStatus.textContent = "Análisis completado. No se detecta carga académica.";
            futureBtn.textContent = "Analizar riesgo académico";
            futureBtn.disabled = false;

            if (showPopup) {
                alert("Future Mode activado: todavía no hay tareas suficientes para predecir tu semana.");
            }

            return;
        }

        const dateCounts = {};

        pendingTasks.forEach(task => {
            dateCounts[task.date] = (dateCounts[task.date] || 0) + 1;
        });

        const criticalDate = Object.keys(dateCounts).sort((a, b) => {
            return dateCounts[b] - dateCounts[a];
        })[0];

        const maxSameDayTasks = dateCounts[criticalDate] || 0;

        let risk = pendingTasks.length * 14 + highPriorityTasks.length * 22 + maxSameDayTasks * 8;

        if (risk > 100) {
            risk = 100;
        }

        const sortedTasks = [...pendingTasks].sort((a, b) => {
            return parseLocalDate(a.date) - parseLocalDate(b.date);
        });

        const focusTask =
            sortedTasks.find(task => task.priority === "high") ||
            sortedTasks[0];

        futureRisk.textContent = risk + "%";
        futureRiskBar.style.width = risk + "%";
        criticalDay.textContent = criticalDate ? getDateText(criticalDate) : "Sin datos";
        futureFocusTask.textContent = focusTask
            ? `${focusTask.title} (${focusTask.subject})`
            : "Sin tarea prioritaria";

        const confidence = Math.min(95, 45 + pendingTasks.length * 8);
        futureConfidence.textContent = confidence + "%";

        if (risk < 40) {
            futureRiskText.textContent = "Semana controlada.";
            futureAdvice.textContent = "Vas bien. Mantén el ritmo y revisa tus tareas al inicio del día.";
            futureEnergy.textContent = "Normal";
            futureStatus.textContent = "Predicción estable: no se detecta saturación grave.";
        } else if (risk < 75) {
            futureRiskText.textContent = "Semana con carga moderada.";
            futureAdvice.textContent = "Conviene adelantar una tarea antes de que se acumulen las entregas.";
            futureEnergy.textContent = "Media";
            futureStatus.textContent = "Predicción moderada: se recomienda reorganizar una tarea.";
        } else {
            futureRiskText.textContent = "Riesgo alto de saturación.";
            futureAdvice.textContent = "Deberías ponerte ya. Empieza por la tarea más próxima o de prioridad alta.";
            futureEnergy.textContent = "Alta";
            futureStatus.textContent = "Predicción crítica: riesgo alto de acumulación académica.";
        }

        futureTimeline.innerHTML = "";

        sortedTasks.slice(0, 5).forEach(task => {
            const item = document.createElement("div");
            item.classList.add("future-timeline-item", task.priority);

            item.innerHTML = `
                <strong>${task.title}</strong>
                <span>${task.subject} · ${getTaskDateTimeText(task.date, task.time)} · ${getPriorityText(task.priority)}</span>
            `;

            futureTimeline.appendChild(item);
        });

        const randomAlert = Math.random() < 0.5;

        if (showPopup && randomAlert) {
            futureAlert.classList.remove("hidden");
            alert("⚠️ CampusFlow Future Mode: deberías ponerte ya con tus tareas. Hay riesgo de que se te acumule la semana.");
        }

        futureBtn.textContent = "Analizar riesgo académico";
        futureBtn.disabled = false;
    }, 900);
}

futureBtn.addEventListener("click", () => {
    analyzeFutureMode(true);
});

/* ---------- INICIO ---------- */

loadData();
renderProfile();
renderSubjects();
renderTasks();
updateEmptyMessages();
updateDashboard();
updateSystemDateTime();
renderCalendar();
analyzeFutureMode(false);

setInterval(updateSystemDateTime, 60000);
