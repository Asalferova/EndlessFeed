// Ссылка на элемент контейнера, в который будут добавляться изображения
const photoContainer = document.querySelector('#photo-container');

// Настройка параметров для запроса к API Unsplash
const token = 'i0L1B-zwQcvsPC4erXHqqMdMSUoE-Vfo-992hTU3bHI';
let page = 1;
const perPage = 20;
let isFetching = true;
let imageList = [];

// Вызываем функцию getImages в первый раз при загрузке страницы
getImages(page);

// Функция getImages делает запрос к API Unsplash и добавляет полученные изображения на страницу
async function getImages(page) {
    try {
        const response = await fetch(`https://api.unsplash.com/photos?page=${page}&per_page=${perPage}&client_id=${token}`);

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();

        data.forEach((el) => {
            const img = `<img src="${el.urls.small}" alt="image">`;
            photoContainer.insertAdjacentHTML('beforeend', img);
        });

        isFetching = false;
    } catch (error) {
        console.log(error.message);
    }
};

// Функция checkPosition проверяет, достиг ли пользователь конца страницы, и если да, то загружает новые изображения
function checkPosition() {
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight

    const scrolled = window.scrollY

    const threshold = height - screenHeight / 4

    const position = scrolled + screenHeight

    if (position >= threshold && !isFetching) {
        isFetching = true;
        page++;
        getImages(page)
    }
}

// Функция throttle ограничивает количество вызовов функции в единицу времени
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Обработчик события прокрутки, который вызывает функцию checkPosition (с применением throttle)
window.addEventListener('scroll', throttle(checkPosition, 200));

