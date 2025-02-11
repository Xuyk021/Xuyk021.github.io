function initializeGallery() {
    console.log("Initializing Gallery...");

    let galleryContainer = document.getElementById("gallery");
    if (!galleryContainer) {
        console.warn("Gallery container (#gallery) not found. Retrying in 200ms...");
        setTimeout(initializeGallery, 200);
        return;
    }

    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let prevBtn = document.getElementById("prev");
    let nextBtn = document.getElementById("next");
    let closeBtn = document.querySelector(".close");

    let currentIndex = 0;
    let images = [];

    async function loadGalleryImages() {
        console.log("Fetching gallery images from images.json...");

        galleryContainer.innerHTML = "";

        try {
            let response = await fetch("./gallery/images.json");
            if (!response.ok) throw new Error("无法获取图片索引");

            let data = await response.json();
            images = data.images;

            console.log("Images found:", images);

            if (images.length === 0) {
                galleryContainer.innerHTML = "<p>未找到图片</p>";
                return;
            }

            images.forEach((imgSrc, index) => {
                let imgElement = document.createElement("img");
                imgElement.src = `gallery/${imgSrc}`;
                imgElement.classList.add("gallery-item");
                imgElement.setAttribute("data-index", index);

                imgElement.addEventListener("click", function () {
                    showLightbox(index);
                });

                galleryContainer.appendChild(imgElement);
            });

        } catch (error) {
            console.error("加载图片时出错:", error);
            galleryContainer.innerHTML = "<p>图片加载失败</p>";
        }
    }

    function showLightbox(index) {
        currentIndex = index;
        lightbox.style.display = "flex";

        lightboxImg.classList.remove("fade-in", "slide-left", "slide-right");
        setTimeout(() => {
            lightboxImg.src = `gallery/${images[currentIndex]}`;
            lightboxImg.classList.add("fade-in");
        }, 50);
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function showPrev() {
        lightboxImg.classList.remove("fade-in", "slide-right");
        lightboxImg.classList.add("slide-left");

        setTimeout(() => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = `gallery/${images[currentIndex]}`;
            lightboxImg.classList.remove("slide-left");
            lightboxImg.classList.add("fade-in");
        }, 100);
    }

    function showNext() {
        lightboxImg.classList.remove("fade-in", "slide-left");
        lightboxImg.classList.add("slide-right");

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = `gallery/${images[currentIndex]}`;
            lightboxImg.classList.remove("slide-right");
            lightboxImg.classList.add("fade-in");
        }, 100);
    }

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showPrev();
        } else if (event.key === "ArrowRight") {
            showNext();
        }
    });

    loadGalleryImages();
}

// 🔹 监听 `#gallery` 是否加载完成，确保 `initializeGallery()` 在正确的时机运行
function waitForGalleryToLoad() {
    console.log("Waiting for gallery.html to load...");

    let checkGallery = setInterval(() => {
        let galleryContainer = document.getElementById("gallery");
        if (galleryContainer) {
            console.log("Gallery detected, initializing...");
            clearInterval(checkGallery);
            initializeGallery();
        }
    }, 100);
}

// 🔹 确保 `DOMContentLoaded` 之后正确初始化
document.addEventListener("DOMContentLoaded", function () {
    waitForGalleryToLoad();
});
