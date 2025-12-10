const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    ) || window.innerWidth <= 768;

const lenis = new Lenis({
    duration: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: !isMobile,
    lerp: 0.1,
    smoothWheel: !isMobile,
    smoothTouch: false,
    touchMultiplier: 1,
    autoResize: true,
});

if (!isMobile) {
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
            // When ScrollTrigger sets scroll
            if (arguments.length) {
                lenis.scrollTo(value, { immediate: true });
            } else {
                // MUST return Lenis scroll value
                return lenis.scroll;
            }
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: document.documentElement.style.transform
            ? "transform"
            : "fixed",
    });
}

window.addEventListener("keydown", (e) => {
    if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === " " ||
        e.key === "Spacebar"
    ) {
        let scrollAmount = 0;

        if (e.key === "ArrowDown") scrollAmount = 150;
        if (e.key === "ArrowUp") scrollAmount = -150;

        // Spacebar scrolls one viewport down (like normal browsers)
        if (e.key === " " || e.key === "Spacebar") {
            scrollAmount = window.innerHeight * 0.9;
        }

        lenis.scrollTo(lenis.scroll + scrollAmount, { duration: 1 });
        e.preventDefault();
    }
});
