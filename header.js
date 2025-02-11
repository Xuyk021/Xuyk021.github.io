document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menuIcon');
    const modal = document.getElementById('modal');

    menuIcon.addEventListener('click', function() {
        console.log("Menu icon clicked!"); // 检查点击事件是否触发
        modal.classList.toggle('active');
    });
    // 点击弹出窗口外部时隐藏窗口
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // 点击退出按钮隐藏弹出窗口
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
});


// 监听滚动事件
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) { // 当滚动超过50px时
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

