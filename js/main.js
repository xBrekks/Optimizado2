/* ============================================================
   PIT STOP PERFORMANCE — main.js Unificado
   Se carga con "defer" en el HTML.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ============================================================
       1. SLIDER AUTOMÁTICO (solo index.html)
       ============================================================ */
    const slides = document.querySelectorAll(".slide-image");

    if (slides.length > 0) {
        const btnLeft = document.querySelector(".left-arrow");
        const btnRight = document.querySelector(".right-arrow");
        const seccion = document.querySelector(".slide-section");
        const total = slides.length;
        const INTERVALO = 5000;
        let actual = 0;
        let timer = null;

        const irA = (idx) => {
            slides[actual].classList.remove("active");
            actual = (idx + total) % total;
            slides[actual].classList.add("active");
        };

        const detener = () => clearInterval(timer);

        const iniciar = () => {
            detener();
            timer = setInterval(() => irA(actual + 1), INTERVALO);
        };

        if (btnLeft)  btnLeft.addEventListener("click",  () => { irA(actual - 1); iniciar(); });
        if (btnRight) btnRight.addEventListener("click", () => { irA(actual + 1); iniciar(); });

        if (seccion) {
            seccion.addEventListener("mouseenter", detener);
            seccion.addEventListener("mouseleave", iniciar);
        }

        // No gastar CPU con la pestaña en segundo plano
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) detener();
            else iniciar();
        });

        irA(0);
        iniciar();
    }

    /* ============================================================
       2. CONTROL DEL MENÚ MÓVIL (todas las páginas)
       ============================================================ */
    const btnMenu = document.getElementById("btnMenu");
    const btnClose = document.getElementById("btnClose");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const menuOverlay = document.getElementById("menuOverlay");
    const drawerLinks = document.querySelectorAll(".drawer-links a");

    const cerrarMenu = () => {
        if (mobileDrawer) mobileDrawer.classList.remove("open");
        if (menuOverlay) menuOverlay.classList.remove("active");
    };

    if (btnMenu && mobileDrawer) {
        btnMenu.addEventListener("click", () => {
            mobileDrawer.classList.add("open");
            if (menuOverlay) menuOverlay.classList.add("active");
        });
    }

    if (btnClose) btnClose.addEventListener("click", cerrarMenu);
    if (menuOverlay) menuOverlay.addEventListener("click", cerrarMenu);
    drawerLinks.forEach((link) => link.addEventListener("click", cerrarMenu));

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarMenu();
    });

    /* ============================================================
       3. HISTORIA (solo nosotros.html)
       ============================================================ */
    const sliderHistoria = document.getElementById("timelineSlider");
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    const imagenHistoria = document.getElementById("imagenHistoria");

    const imagenesHistoria = [
        "img/1995.webp",
        "img/2010.webp",
        "img/2026.webp"
    ];

    if (sliderHistoria && btnAnterior && btnSiguiente && imagenHistoria) {
        const totalPasos = document.querySelectorAll(".timeline-step").length;
        let pasoActual = 0;
        let timeoutImg = null;

        // Precarga las imágenes cuando el navegador está libre (evita parpadeo al cambiar)
        const precargar = () => imagenesHistoria.forEach((src) => { new Image().src = src; });
        if ("requestIdleCallback" in window) requestIdleCallback(precargar);
        else window.addEventListener("load", precargar);

        const actualizarSlider = (inicial) => {
            // 1. Mueve el texto horizontalmente
            sliderHistoria.style.transform = `translateX(-${pasoActual * 100}%)`;

            // 2. Cambia la imagen con desvanecimiento (sin parpadeo en la carga inicial)
            if (!inicial) {
                imagenHistoria.style.opacity = 0;
                clearTimeout(timeoutImg); // evita que se pisen clics rápidos
                timeoutImg = setTimeout(() => {
                    imagenHistoria.src = imagenesHistoria[pasoActual];
                    imagenHistoria.style.opacity = 1;
                }, 300);
            }

            // 3. Apaga/enciende botones
            btnAnterior.disabled = (pasoActual === 0);
            btnSiguiente.disabled = (pasoActual === totalPasos - 1);
        };

        btnSiguiente.addEventListener("click", () => {
            if (pasoActual < totalPasos - 1) {
                pasoActual++;
                actualizarSlider();
            }
        });

        btnAnterior.addEventListener("click", () => {
            if (pasoActual > 0) {
                pasoActual--;
                actualizarSlider();
            }
        });

        actualizarSlider(true);
    }

    /* ============================================================
       4. SCROLLTELLING UNIVERSAL (animaciones al hacer scroll)
       ============================================================ */
    const elementosAnimables = document.querySelectorAll(
        ".animar-arriba, .animar-izquierda, .animar-derecha, .animar-scroll, .animar-scroll-right"
    );

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver((entradas, obs) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    obs.unobserve(entrada.target); // solo la primera vez
                }
            });
        }, { threshold: 0.15 });

        elementosAnimables.forEach((el) => observador.observe(el));
    } else {
        elementosAnimables.forEach((el) => el.classList.add("visible"));
    }
});
