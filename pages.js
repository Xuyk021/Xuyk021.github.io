document.addEventListener("DOMContentLoaded", function () {
    const contentDiv = document.getElementById("content");
    const links = document.querySelectorAll(".nav__item");

    function loadPage(page, addHistory = true, callback = null) {
        let isProjectPage = false;
        let projectName = null;

        // ✅ 解析 `#project/Xhair`，确保先加载 `projects.html`
        if (page.startsWith("project/")) {
            console.log(`🔄 解析到项目详情页: ${page}`);
            projectName = page.replace("project/", ""); // 提取项目名称
            page = "projects"; 
            isProjectPage = true;
        }

        fetch(`./${page}.html`)
            .then(response => {
                if (!response.ok) throw new Error("页面加载失败");
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;

                if (addHistory) {
                    history.pushState({ page }, "", `#${page}`);
                }

                // ✅ `projects.html` 加载后，进入具体的 `#project/项目`
                if (page === "projects") {
                    waitForProjectsList(() => {
                        console.log("✅ `projects.html` 加载完成");
                        if (isProjectPage) {
                            console.log(`🔄 进入项目详情页: ${projectName}`);
                            window.location.hash = `#project/${projectName}`; // **修正 URL**
                            handleRouteChange();
                        } else {
                            fetchProjects();
                        }
                    });
                } 
                else if (page === "gallery") {
                    waitForGalleryToLoad();
                }

                if (callback) callback();
            })
            .catch(error => console.error("页面加载错误:", error));
    }

    function onPageLoad(page) {
        if (page === "projects") {
            waitForProjectsList(fetchProjects);
        }
    }

    // ✅ 处理导航栏点击事件
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page");
            if (page) {
                loadPage(page);
            }
        });
    });

    // ✅ 监听前进/后退按钮
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        }
    });

    // ✅ 页面首次加载时，确保正确解析 `#project/Xhair`
    const defaultPage = "about";
    const hashPage = window.location.hash.replace("#", "") || defaultPage;
    
    if (hashPage.startsWith("project/")) {
        console.log(`🔄 解析到项目详情页: ${hashPage}`);
        loadPage("projects", true, () => {
            console.log(`🔄 `, `修正 URL 为 ${hashPage}`);
            window.location.hash = `#${hashPage}`; // **确保 URL 不丢失**
            handleRouteChange();
        });
    } else {
        loadPage(hashPage);
    }
});
