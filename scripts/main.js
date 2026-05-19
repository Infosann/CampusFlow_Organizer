const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section");

const pendingTasksCount = document.getElementById("pendingTasksCount");
const nextTaskTitle = document.getElementById("nextTaskTitle");
const nextTaskDate = document.getElementById("nextTaskDate");
const weeklyLoadText = document.getElementById("weeklyLoadText");
const weeklyLoadDetail = document.getElementById("weeklyLoadDetail");
const systemDateTime = document.getElementById("systemDateTime");

const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const priorityInput = document.getElementById("priorityInput");
const feedbackMessage = document.getElementById("feedbackMessage");
const emptyTasksMessage = document.getElementById("emptyTasksMessage");

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

let tasks = [];
let currentCalendarDate = new Date();

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(section => section.classList.remove("active-section"));

        tab.classList.add("active");

        const sectionId = tab.dataset.section;
        document.getElementById(sectionId).classList.add("active-section");
    });
});

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
    if (priority === "urgent") return "Urgente";
    if (priority === "easy") return "Rápida";
    return "Normal";
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

function updateEmptyMessages() {
    emptyTasksMessage.style.display = tasks.length === 0 ? "block" : "none";
    emptySubjectsMessage.style.display = subjectsContainer.children.length === 0 ? "block" : "none";
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
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

    updateEmptyMessages();
}

function updateDashboard() {
    const pendingTasks = tasks.filter(task => !task.completed);
    pendingTasksCount.textContent = pendingTasks.length;

    if (pendingTasks.length === 0) {
        nextTaskTitle.textContent = "No hay entregas registradas";
        nextTaskDate.textContent = "Añade una tarea con fecha";
    } else {
        const sortedTasks = [...pendingTasks].sort((a, b) => {
            return parseLocalDate(a.date) - parseLocalDate(b.date);
        });

        const nextTask = sortedTasks[0];

        nextTaskTitle.textContent = nextTask.title;
        nextTaskDate.textContent = `${nextTask.subject} · ${getTaskDateTimeText(nextTask.date, nextTask.time)}`;
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

    const urgentTasks = weekTasks.filter(task => task.priority === "urgent");

    if (weekTasks.length === 0) {
        weeklyLoadText.textContent = "Sin carga";
        weeklyLoadDetail.textContent = "No hay tareas pendientes esta semana";
    } else if (weekTasks.length <= 2 && urgentTasks.length === 0) {
        weeklyLoadText.textContent = "Baja";
        weeklyLoadDetail.textContent = `${weekTasks.length} tarea(s) esta semana`;
    } else if (weekTasks.length <= 5) {
        weeklyLoadText.textContent = "Moderada";
        weeklyLoadDetail.textContent = `${weekTasks.length} tarea(s), ${urgentTasks.length} urgente(s)`;
    } else {
        weeklyLoadText.textContent = "Alta";
        weeklyLoadDetail.textContent = `${weekTasks.length} tarea(s), conviene reorganizar`;
    }
}

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

        const isToday =
            cellDate.getFullYear() === today.getFullYear() &&
            cellDate.getMonth() === today.getMonth() &&
            cellDate.getDate() === today.getDate();

        if (isToday) {
            cell.classList.add("today-cell");
        }

        const dayNumber = document.createElement("strong");
        dayNumber.textContent = day;

        if (isToday) {
            dayNumber.textContent = `${day} · Hoy`;
        }

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

taskList.addEventListener("click", event => {
    if (!event.target.classList.contains("complete-btn")) return;

    const li = event.target.closest(".task");
    const taskId = Number(li.dataset.id);

    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    renderTasks();
    updateDashboard();
    renderCalendar();

    showFeedback(feedbackMessage, "Estado de la tarea actualizado.");
});

saveProfileBtn.addEventListener("click", () => {
    const studentName = studentNameInput.value.trim();
    const degree = degreeInput.value.trim();
    const course = courseInput.value.trim();

    if (studentName === "" || degree === "" || course === "") {
        showFeedback(profileFeedbackMessage, "Completa todos los campos del perfil.");
        return;
    }

    document.querySelector(".user-badge").textContent = studentName;
    showFeedback(profileFeedbackMessage, "Perfil guardado correctamente.");

    setTimeout(() => {
        document.querySelector('[data-section="inicio"]').click();
    }, 1000);
});

addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const subjectText = subjectInput.value;
    const dateValue = dateInput.value;
    const timeValue = timeInput.value;
    const priority = priorityInput.value;

    if (taskText === "") {
        showFeedback(feedbackMessage, "Escribe el nombre de la tarea.");
        return;
    }

    if (subjectText === "") {
        showFeedback(feedbackMessage, "Selecciona una asignatura para la tarea.");
        return;
    }

    if (dateValue === "") {
        showFeedback(feedbackMessage, "Selecciona una fecha para mostrar la tarea en el calendario.");
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
    dateInput.value = "";
    timeInput.value = "";
    priorityInput.value = "normal";

    renderTasks();
    updateDashboard();
    renderCalendar();

    showFeedback(feedbackMessage, "Tarea añadida correctamente.");
});

addSubjectBtn.addEventListener("click", () => {
    const subjectName = newSubjectInput.value.trim();

    if (subjectName === "") {
        showFeedback(subjectFeedbackMessage, "Escribe el nombre de la asignatura.");
        return;
    }

    const repeated = Array.from(subjectInput.options).some(option => option.value === subjectName);

    if (repeated) {
        showFeedback(subjectFeedbackMessage, "Esa asignatura ya existe.");
        return;
    }

    const subjectCard = document.createElement("article");
    subjectCard.classList.add("subject-card");

    subjectCard.innerHTML = `
        <h3>${subjectName}</h3>
        <p>Asignatura disponible para nuevas tareas</p>
    `;

    subjectsContainer.appendChild(subjectCard);

    const option = document.createElement("option");
    option.value = subjectName;
    option.textContent = subjectName;
    subjectInput.appendChild(option);

    newSubjectInput.value = "";

    updateEmptyMessages();
    showFeedback(subjectFeedbackMessage, "Asignatura añadida correctamente.");
});

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
updateEmptyMessages();
updateDashboard();
updateSystemDateTime();
renderCalendar();

setInterval(updateSystemDateTime, 60000);s
