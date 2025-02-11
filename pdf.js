document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("cvButton").addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation(); // 防止 SPA 监听事件
        window.location.href = "XU Yunkai CV.pdf"; // 在相同窗口打开 PDF
    });
});
