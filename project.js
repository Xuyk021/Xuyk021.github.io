
// 解析 URL 获取项目名称
function getProjectNameFromUrl() {
    const hash = window.location.hash;
    console.log("🔍 当前 URL Hash:", hash);
    
    if (hash.startsWith("#project/")) {
        return decodeURIComponent(hash.substring(9)); // `#project/` 长度为 9
    }
    return null;
}

// 处理 URL 变化
function handleRouteChange() {
    console.log("🔄 handleRouteChange() 被调用");

    const projectName = getProjectNameFromUrl();
    console.log("✅ 解析到的项目名称:", projectName);

    // **确保元素存在**
    const projectsList = document.getElementById("projectsList");
    const projectDetails = document.getElementById("projectDetails");
    const projectsTitle = document.getElementById("projectsTitle");

    if (!projectsList || !projectDetails || !projectsTitle) {
        console.error("❌ 页面元素未找到，等待 100ms 后重试...");
        setTimeout(handleRouteChange, 100); // 100ms 后重试
        return;
    }

    if (projectName) {
        console.log("📌 进入项目详情页面:", projectName);
        projectsList.style.display = "none";
        projectsTitle.style.display = "none";
        projectDetails.style.display = "block";

        // **防止重复加载**
        if (!projectDetails.dataset.loaded || projectDetails.dataset.projectName !== projectName) {
            loadProjectDetails(projectName);
        }
    } else {
        console.log("📌 进入项目列表页面");
        projectsList.style.display = "grid";
        projectsTitle.style.display = "block";
        projectDetails.style.display = "none";
        projectDetails.innerHTML = "";

        if (window.location.hash !== "#projects") {
            console.log("🔄 修正 URL 为 #projects");
            window.history.replaceState({}, "", "#projects");
        }
    }
}



// 加载项目详情
// 加载项目详情
function loadProjectDetails(projectName) {
    if (!projectName) {
        console.error("❌ 项目名称为空！");
        document.getElementById("projectDetails").innerHTML = "<h2>项目未找到</h2>";
        return;
    }

    const projectDataPath = `projects-data/${encodeURIComponent(projectName)}.json`;

    console.log(`📡 正在加载项目详情: ${projectDataPath}`);

    fetch(projectDataPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`❌ 无法加载 ${projectDataPath}`);
            }
            return response.json();
        })
        .then(project => {
            console.log("📡 成功加载项目详情:", project);

            // 确保 `projectDetails` 存在
            const detailsContainer = document.getElementById("projectDetails");
            if (!detailsContainer) {
                console.error("❌ projectDetails 容器未找到！");
                return;
            }

            // **根据 JSON 数据控制按钮显示**
            const pdfButton = project.showPdf ? `<a class="btn" href="${project.pdf}" target="_blank">PDF</a>` : "";
            const videoButton = project.showVideo ? `<a class="btn" href="${project.video}" target="_blank">Video</a>` : "";
            const publicationButton = project.showPublication ? `<a class="btn" href="${project.publication}" target="_blank">Publication</a>` : "";

            // 更新 `projectDetails` 内容
            detailsContainer.innerHTML = `
                <div class="project-details">
                    <div class="project-image-slider">
                        <div class="project-image">
                            <img id="slider-image" src="${project.images[0]}" alt="${project.name}">
                        </div>
                        <div class="slider-dots"></div>
                    </div>
                    <div class="project-content">
                        <div class="project-name-link">
                            <h1 class="project-title">${project.name}</h1>
                            <div class="project-links">
                                ${pdfButton}
                                ${videoButton}
                                ${publicationButton}
                            </div>
                        </div>
                        <div class="project-meta">
                            <p class="project-authors">${project.authors}</p>
                            <p class="project-abstract">${project.abstract}</p>
                        </div>
                    </div>
                </div>
            `;

            // 初始化轮播图
            initSlider(project.images);

            // 切换显示内容
            document.getElementById("projectsList").style.display = "none";
            detailsContainer.style.display = "block";
        })
        .catch(error => {
            console.error("❌ 加载项目详情失败:", error);
            document.getElementById("projectDetails").innerHTML = "<h2>加载失败</h2>";
        });
}


// 初始化轮播图
function initSlider(images) {
    const sliderImage = document.getElementById("slider-image");
    const dotsContainer = document.querySelector(".slider-dots");
    let currentIndex = 0;

    if (!sliderImage || !dotsContainer || images.length === 0) {
        console.error("❌ 轮播图初始化失败！");
        return;
    }

    // 生成小圆点
    dotsContainer.innerHTML = "";
    images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => changeImage(index));
        dotsContainer.appendChild(dot);
    });

    function changeImage(index) {
        currentIndex = index;
        sliderImage.style.opacity = "0";
        setTimeout(() => {
            sliderImage.src = images[index];
            sliderImage.style.opacity = "1";
        }, 300);

        // 更新小圆点状态
        document.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    // 自动轮播
    setInterval(() => {
        let nextIndex = (currentIndex + 1) % images.length;
        changeImage(nextIndex);
    }, 10000);
}

// 监听 URL 变化
// 监听 URL 变化
document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 DOM 加载完成，初始化路由监听");

    // 监听前进/后退按钮
    window.addEventListener("popstate", handleRouteChange);

    const projectName = getProjectNameFromUrl();

    // **等待 `projectDetails` 被正确加载**
    const waitForElements = setInterval(() => {
        if (document.getElementById("projectDetails")) {
            console.log("✅ `projectDetails` 已加载，执行 handleRouteChange");
            clearInterval(waitForElements);
            handleRouteChange();  // 确保 URL 逻辑正确
        }
    }, 100);  // 每 100ms 检查一次

    if (projectName) {
        console.log(`🔄 检测到项目 URL，尝试加载: ${projectName}`);
        loadProjectDetails(projectName);
    } else {
        console.log("📌 没有检测到项目 URL，加载项目列表");
        fetchProjects();
    }
});



// 返回到项目列表
function goBack() {
    console.log("🔙 返回到项目列表");
    window.history.pushState({}, "", "#projects"); // 确保 URL 变成 #projects

    const projectsList = document.getElementById("projectsList");
    const projectDetails = document.getElementById("projectDetails");
    const projectsTitle = document.getElementById("projectsTitle");

    if (!projectsList || !projectDetails || !projectsTitle) {
        console.error("❌ projectsList、projectDetails 或 projectsTitle 未找到！");
        return;
    }

    // 重新显示项目列表
    projectsTitle.style.display = "block"; 
    projectsList.style.display = "grid";  
    projectsList.classList.remove("hidden");

    // 隐藏项目详情，并清空内容
    projectDetails.style.display = "none";
    projectDetails.innerHTML = ""; // 彻底清空详情内容

    console.log("✅ 成功返回到项目列表，界面已恢复");
}
