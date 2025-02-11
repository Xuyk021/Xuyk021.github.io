function waitForProjectsList(callback) {
    const interval = setInterval(() => {
        const projectsList = document.getElementById("projectsList");
        if (projectsList) {
            clearInterval(interval);
            callback();
        }
    }, 100);
}

function fetchProjects() {
    fetch(`./projects.json`)
        .then(response => response.json())
        .then(projects => {
            projects.sort((a, b) => b.year - a.year);
            renderProjects(projects);
        })
        .catch(error => console.error("Failed to load projects:", error));
}
function renderProjects(projects) {
    const projectsList = document.getElementById("projectsList");
    if (!projectsList) {
        console.error("❌ #projectsList NOT FOUND in DOM!");
        return;
    }

    projectsList.innerHTML = projects.map(project => `
        <div class="project-card" data-name="${project.name}">
            <img class="project-card__image" alt="${project.name}" src="${project.image}">
            <div class="project-card__info">
                <div class="project-card__name">${project.name}</div>
                <div class="project-card__year">${project.year}</div>
            </div>
        </div>
    `).join("");

    // ✅ 添加点击事件，在新标签页打开
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", (event) => {
            event.preventDefault();
            const projectName = card.getAttribute("data-name");
            if (!projectName) {
                console.error("❌ projectName is null or undefined!");
                return;
            }
            console.log("📌 点击项目:", projectName);
            
            // ✅ 在新标签页打开项目详情
            window.open(`./index.html#project/${encodeURIComponent(projectName)}`, "_blank");
        });
    });
}
