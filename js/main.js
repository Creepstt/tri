// ===== PRELOADER =====
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader after page is loaded
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });

    // Initialize observers and event listeners after the DOM is fully loaded
    initScrollObserver();
    initMobileMenu();
    initSwiper();
    initCalculator();
    initMap();
    initFormValidation();
    initScrollToTop();
    trackActiveSection();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== REVEAL ANIMATION ON SCROLL =====
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all elements with reveal-element class
    document.querySelectorAll('.reveal-element').forEach(el => {
        observer.observe(el);
    });
}

// ===== SWIPER INITIALIZATION =====
function initSwiper() {
    const truckSlider = new Swiper('.truck-slider', {
        loop: true,
        effect: 'creative',
        creativeEffect: {
            prev: {
                translate: [0, 0, -100],
                opacity: 0
            },
            next: {
                translate: ['100%', 0, 0],
                opacity: 0
            },
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        grabCursor: true,
        keyboard: {
            enabled: true,
        },
        speed: 800,
    });
}

// ===== CALCULATOR =====
function initCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;
    
    const weightInput = document.getElementById('weight');
    const volumeInput = document.getElementById('volume');
    const distanceInput = document.getElementById('distance');
    const resultElement = document.getElementById('calc-result');
    
    // Add input validation
    const inputs = [weightInput, volumeInput, distanceInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Remove non-numeric characters except decimal point
            input.value = input.value.replace(/[^0-9.]/g, '');
            
            // Enforce min and max values if defined
            const min = parseFloat(input.getAttribute('min') || 0);
            const max = parseFloat(input.getAttribute('max') || Infinity);
            const value = parseFloat(input.value || 0);
            
            if (value < min) {
                input.classList.add('error');
            } else if (max !== Infinity && value > max) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
    });
    
    // Calculate button click handler
    calculateBtn.addEventListener('click', () => {
        // Validate inputs
        let isValid = true;
        inputs.forEach(input => {
            const value = parseFloat(input.value || 0);
            const min = parseFloat(input.getAttribute('min') || 0);
            const max = parseFloat(input.getAttribute('max') || Infinity);
            
            if (value < min || (max !== Infinity && value > max) || isNaN(value)) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        if (!isValid) {
            resultElement.textContent = '₽ 0';
            resultElement.classList.add('error');
            setTimeout(() => {
                resultElement.classList.remove('error');
            }, 500);
            return;
        }
        
        // Get input values
        const weight = parseFloat(weightInput.value || 0);
        const volume = parseFloat(volumeInput.value || 0);
        const distance = parseFloat(distanceInput.value || 0);
        
        // Статический расчет стоимости для HTML версии
        const baseRate = 50;
        const weightRate = 10;
        const volumeRate = 300;
        
        const distanceCost = distance * baseRate;
        const weightCost = weight * weightRate;
        const volumeCost = volume * volumeRate;
        const total = Math.max(distanceCost + weightCost + volumeCost, 0);
        
        // Показываем результат
        if (resultElement) {
            resultElement.textContent = '₽ ' + Math.round(total).toLocaleString('ru-RU');
            resultElement.classList.add('highlight');
            setTimeout(() => {
                resultElement.classList.remove('highlight');
            }, 1000);
        }
    });
}




// ===== YANDEX MAP =====
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(() => {
            const map = new ymaps.Map('map', {
                center: [55.755864, 37.617698], // Москва
                zoom: 9,
                controls: ['zoomControl', 'fullscreenControl']
            });

            // Зоны обслуживания
            const centralZone = new ymaps.Circle([
                [55.755864, 37.617698], // Центр Москвы
                15000 // 15 км
            ], {
                hintContent: 'Экспресс-зона',
                balloonContent: 'Доставка в течение 2-3 часов<br>Минимальный тариф',
            }, {
                fillColor: '#2ecc7180',
                strokeColor: '#27ae60',
                strokeWidth: 2,
                strokeOpacity: 0.9,
                fillOpacity: 0.4
            });

            const innerZone = new ymaps.Circle([
                [55.755864, 37.617698],
                30000 // 30 км
            ], {
                hintContent: 'Стандартная зона',
                balloonContent: 'Доставка в течение 4-6 часов<br>Стандартный тариф',
            }, {
                fillColor: '#3498db80',
                strokeColor: '#2980b9',
                strokeWidth: 2,
                strokeOpacity: 0.9,
                fillOpacity: 0.3
            });

            const outerZone = new ymaps.Circle([
                [55.755864, 37.617698],
                60000 // 60 км
            ], {
                hintContent: 'Пригородная зона',
                balloonContent: 'Доставка на следующий день<br>Повышенный тариф',
            }, {
                fillColor: '#e74c3c80',
                strokeColor: '#c0392b',
                strokeWidth: 2,
                strokeOpacity: 0.9,
                fillOpacity: 0.2
            });

            // Офис и склад
            const mainOffice = new ymaps.Placemark([55.755864, 37.617698], {
                hintContent: 'Главный офис',
                balloonContentHeader: 'Центральный офис HD78',
                balloonContentBody: 
                    '<strong>Адрес:</strong> г. Москва, ул. Транспортная, 10<br>' +
                    '<strong>Телефон:</strong> +7 (925) 123-45-67<br>' +
                    '<strong>Режим работы:</strong><br>' +
                    'Пн-Пт: 9:00 - 20:00<br>' +
                    'Сб-Вс: 10:00 - 18:00',
                balloonContentFooter: '<a href="#contacts">Связаться с нами</a>'
            }, {
                preset: 'islands#blueHomeCircleIcon'
            });

            const warehouse = new ymaps.Placemark([55.751244, 37.618423], {
                hintContent: 'Склад',
                balloonContentHeader: 'Складской комплекс',
                balloonContentBody: 'Круглосуточный прием и отправка грузов',
                balloonContentFooter: 'Доступен для самовывоза'
            }, {
                preset: 'islands#darkGreenWarehouseIcon'
            });

            // Добавляем легенду на карту
            const legend = new ymaps.control.ListBox({
                data: {
                    content: 'Зоны доставки'
                },
                items: [
                    new ymaps.control.ListBoxItem({
                        data: {
                            content: 'Экспресс-зона (2-3 часа)'
                        },
                        options: {
                            selectOnClick: false
                        }
                    }),
                    new ymaps.control.ListBoxItem({
                        data: {
                            content: 'Стандартная зона (4-6 часов)'
                        },
                        options: {
                            selectOnClick: false
                        }
                    }),
                    new ymaps.control.ListBoxItem({
                        data: {
                            content: 'Пригородная зона (24 часа)'
                        },
                        options: {
                            selectOnClick: false
                        }
                    })
                ]
            });

            // Добавляем все объекты на карту
            map.controls.add(legend);
            map.geoObjects
                .add(outerZone)
                .add(innerZone)
                .add(centralZone)
                .add(mainOffice)
                .add(warehouse);

            // Устанавливаем границы отображения
            map.setBounds(outerZone.geometry.getBounds(), {
                checkZoomRange: true,
                duration: 300
            }).then(() => {
                map.setZoom(map.getZoom() - 0.5);
            });
        });
    } else {
        mapElement.innerHTML = '<div class="map-placeholder">Карта временно недоступна</div>';
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');
    
    // Validate email format
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Input validation
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Имя должно содержать минимум 2 символа';
        } else {
            nameError.textContent = '';
        }
    });
    
    emailInput.addEventListener('input', () => {
        if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Введите корректный email адрес';
        } else {
            emailError.textContent = '';
        }
    });
    
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Сообщение должно содержать минимум 10 символов';
        } else {
            messageError.textContent = '';
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Имя должно содержать минимум 2 символа';
            isValid = false;
        } else {
            nameError.textContent = '';
        }
        
        if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Введите корректный email адрес';
            isValid = false;
        } else {
            emailError.textContent = '';
        }
        
        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Сообщение должно содержать минимум 10 символов';
            isValid = false;
        } else {
            messageError.textContent = '';
        }
        
        if (!isValid) return;
        
        // Для HTML версии просто показываем сообщение об успешной отправке
        if (formStatus) {
            formStatus.textContent = 'Ваше сообщение успешно отправлено!';
            formStatus.className = 'success-message';
            contactForm.reset();
            
            // Скрываем сообщение через 5 секунд
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = '';
            }, 5000);
        }
    });
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ACTIVE SECTION TRACKING =====
function trackActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}