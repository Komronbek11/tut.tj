const menuIcon = document.querySelector('.menu-icon');
const mainItem = document.querySelector('.main-item');
const menuContainer = document.querySelector('.menu-container');
const menuItems = document.querySelectorAll('.menu-item');

function menuToggle() {
    if (menuContainer.classList.contains('active')) {
        menuContainer.style.maxHeight = '0';
        menuContainer.style.opacity = '0';
        setTimeout(() => {
            menuContainer.classList.remove('active');
        }, 500); // Ждем завершения анимации перед скрытием
    } else {
        menuContainer.classList.add('active');
        menuContainer.style.maxHeight = '200px'; // Задаем высоту
        menuContainer.style.opacity = '1';
    }
    menuIcon.classList.toggle('active');
}

mainItem.addEventListener('click', menuToggle);

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.item-text').textContent = item.textContent;
        menuToggle();
    });
});

document.addEventListener("keydown", function (e) {
    if (e.key === "PrintScreen") {
        e.preventDefault();
       // alert("Скриншот запрещен!");
    }
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      //  alert("Сохранение страницы запрещено!");
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
       // alert("Скриншот запрещен!");
    }
});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
   // alert("Контекстное меню отключено!");
});

navigator.mediaDevices.addEventListener("devicechange", function () {
  //  alert("Обнаружена попытка записи экрана!");
});


