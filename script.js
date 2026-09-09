document.addEventListener("DOMContentLoaded", () => {

    // Mobile menu toggle
    const menuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.toggle("hidden");
            menuBtn.querySelector("i").classList.toggle("bi-list", isHidden);
            menuBtn.querySelector("i").classList.toggle("bi-x-lg", !isHidden);
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                menuBtn.querySelector("i").classList.add("bi-list");
                menuBtn.querySelector("i").classList.remove("bi-x-lg");
            });
        });
    }

    // Marquee - logo sekolah
    function startMarquee(trackId, direction) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const clones = track.innerHTML;
        track.innerHTML += clones;

        let position = 0;
        const speed = 1;
        let paused = false;

        function animate() {
            if (!paused) {
                position += direction === 'right' ? speed : -speed;
                const halfWidth = track.scrollWidth / 2;
                if (halfWidth === 0) {
                    requestAnimationFrame(animate);
                    return;
                }
                if (direction === 'right') {
                    if (position >= halfWidth) position -= halfWidth;
                } else {
                    if (position <= -halfWidth) position += halfWidth;
                }
                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(animate);
        }
        animate();

        track.addEventListener("mouseenter", () => paused = true);
        track.addEventListener("mouseleave", () => paused = false);
    }

    startMarquee("marqueeTrack", "left");

    // slider
    function startSlider(trackId, prevId, nextId, dotsId) {
        const track = document.getElementById(trackId);
        if (!track) return;

        const slides = track.querySelectorAll('.slide');
        if (slides.length < 2) return;

        const realCount = slides.length;

        track.insertBefore(slides[realCount - 1].cloneNode(true), slides[0]);
        track.appendChild(slides[0].cloneNode(true));

        let current = 1;
        let dir = 1;
        let timer;

        const dotsWrap = document.getElementById(dotsId);

        function updateDots() {
            if (!dotsWrap) return;
            const active = (current - 1 + realCount) % realCount;
            dotsWrap.querySelectorAll('button').forEach((bar, idx) => {
                bar.classList.toggle('bg-[#3CC6E8]', idx === active);
                bar.classList.toggle('bg-gray-300', idx !== active);
            });
        }

        function renderDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = '';
            for (let i = 0; i < realCount; i++) {
                const bar = document.createElement('button');
                bar.type = 'button';
                bar.setAttribute('aria-label', 'Slide ' + (i + 1));
                bar.className = 'flex-1 max-w-16 h-1.5 rounded-full transition-colors duration-300 cursor-pointer';
                bar.addEventListener('click', () => show(i + 1));
                dotsWrap.appendChild(bar);
            }
        }

        function show(i) {
            current = i;
            track.style.transition = 'transform 500ms ease-out';
            track.style.transform = `translateX(-${current * 100}%)`;
            updateDots();
        }

        function jumpTo(i) {
            track.style.transition = 'none';
            current = i;
            track.style.transform = `translateX(-${current * 100}%)`;
            void track.offsetWidth;
            track.style.transition = 'transform 500ms ease-out';
            updateDots();
        }

        function next() {
            if (current < realCount) show(current + 1);
        }

        function prev() {
            if (current > 1) show(current - 1);
        }

        function autoNext() {
            if (current >= realCount) dir = -1;
            else if (current <= 1) dir = 1;
            show(current + dir);
        }

        track.addEventListener("transitionend", () => {
            if (current === realCount + 1) jumpTo(1);
            else if (current === 0) jumpTo(realCount);
        });

        function play() {
            clearInterval(timer);
            timer = setInterval(autoNext, 4000);
        }

        renderDots();
        show(1);
        play();

        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        if (prevBtn) prevBtn.addEventListener("click", () => { prev(); play(); });
        if (nextBtn) nextBtn.addEventListener("click", () => { next(); play(); });

        const wrap = track.parentElement;
        wrap.addEventListener("mouseenter", () => clearInterval(timer));
        wrap.addEventListener("mouseleave", play);
    }

    startSlider("kegiatanSlider", "kegiatanPrev", "kegiatanNext", "kegiatanDots");

    // PDF viewer
    function initPdfViewer() {
        const modal = document.getElementById("pdfModal");
        if (!modal) return;

        const overlay = document.getElementById("pdfOverlay");
        const frame = document.getElementById("pdfFrame");
        const title = document.getElementById("pdfTitle");
        const closeBtn = document.getElementById("pdfClose");

        function openPdf(id, name) {
            title.textContent = name;
            frame.src = "https://drive.google.com/file/d/" + id + "/preview";
            modal.classList.remove("hidden");
            modal.classList.add("flex");
            document.body.style.overflow = "hidden";
        }

        function closePdf() {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
            frame.src = "";
            document.body.style.overflow = "";
        }

        document.querySelectorAll(".btn-panduan").forEach(btn => {
            btn.addEventListener("click", () => {
                openPdf(btn.dataset.id, btn.closest("div").querySelector("h3").textContent);
            });
        });

        if (closeBtn) closeBtn.addEventListener("click", closePdf);
        if (overlay) overlay.addEventListener("click", closePdf);
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") closePdf();
        });
    }

    initPdfViewer();

});
