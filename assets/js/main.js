/*
	Phenomena Replication Laboratory Landing Page
*/

(function ($) {
    var $window = $(window),
        $body = $("body"),
        $hero = $("#hero"),
        $heroTitle = $("#hero-title"),
        $heroSubtitle = $("#hero-subtitle"),
        $heroButton = $("#start-project-btn");

    var animationsDone = false;

    // Breakpoints.
    breakpoints({
        xlarge: ["1281px", "1680px"],
        large: ["981px", "1280px"],
        medium: ["737px", "980px"],
        small: ["481px", "736px"],
        xsmall: ["361px", "480px"],
        xxsmall: [null, "360px"],
    });

    // Play initial animations on page load.
    $window.on("load", function () {
        window.setTimeout(function () {
            $body.removeClass("is-preload");

            // Slide-in Animation Sequence
            setTimeout(function () {
                if ($heroTitle.length) $heroTitle.addClass("visible");
            }, 100);

            setTimeout(function () {
                if ($heroSubtitle.length) $heroSubtitle.addClass("visible");
            }, 600);

            setTimeout(function () {
                if ($heroButton.length) $heroButton.addClass("visible");

                // Enable parallax after animations complete
                setTimeout(function () {
                    animationsDone = true;
                    // Remove CSS transitions to allow instant parallax updates
                    $heroTitle.css("transition", "none");
                    $heroSubtitle.css("transition", "none");
                    $heroButton.css("transition", "none");
                    updateHeroText();
                }, 1000);
            }, 1100);
        }, 100);
    });

    // Modal Handling
    var $modal = $("#contact-modal");
    var $btn = $("#start-project-btn");
    var $close = $(".close-modal");

    // Open Modal
    if ($btn.length) {
        $btn.on("click", function (e) {
            e.preventDefault();
            $modal.addClass("active");
        });
    }

    // Close Modal
    if ($close.length) {
        $close.on("click", function () {
            $modal.removeClass("active");
        });
    }

    // Click outside to close
    $window.on("click", function (e) {
        if ($(e.target).is($modal)) {
            $modal.removeClass("active");
        }
    });

    // Mobile Menu Toggle
    var $hamburger = $(".hamburger");
    var $mobileNav = $(".mobile-nav-overlay");
    var $mobileLinks = $mobileNav.find("a");

    if ($hamburger.length) {
        $hamburger.on("click", function () {
            $hamburger.toggleClass("active");
            $mobileNav.toggleClass("active");
        });

        $mobileLinks.on("click", function () {
            $hamburger.removeClass("active");
            $mobileNav.removeClass("active");
        });
    }

    // ==========================================
    // ==========================================
    // Scroll Animations & Image Sequence Logic
    // ==========================================

    var $hero = $("#hero");
    var $heroTitle = $("#hero-title");
    var $heroSubtitle = $("#hero-subtitle");

    // Canvas setup
    const canvas = document.getElementById("hero-canvas");

    if (canvas) {
        const context = canvas.getContext("2d");

        // Configuration
        // Best Practice: Use a sequence of optimized JPEGs or WebPs.
        // Create a folder 'images/sequence' and number them frame_001.png, frame_002.png, etc.
        const frameCount = 29; // Adjust based on your actual sequence length
        const currentFrame =
            window.currentFrame ||
            ((index) =>
                `images/sequence/frame_${index.toString().padStart(3, "0")}.png`);

        const images = [];
        const sequence = {
            frame: 0,
        };

        // Preload images
        // We use a fallback to 'images/overlay.png' so the site works without the sequence uploaded.
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            images.push(img);
            const src = currentFrame(i + 1); // 1-based index for filenames

            img.onload = () => {
                if (i === 0 || sequence.frame === i) {
                    requestAnimationFrame(render);
                }
            };

            img.onerror = function () {
                this.src = window.heroFallbackImage || "images/overlay.png";
                this.onerror = null;
            };

            img.src = src;
        }

        // Canvas resizing to cover screen
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            requestAnimationFrame(render);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        function render() {
            const img = images[sequence.frame];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            // "object-fit: cover" logic for canvas
            // Calculates ratios to ensure image covers the entire canvas while maintaining aspect ratio
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio,
            );
        }

        function updateSequence() {
            const scrollTop = $window.scrollTop();
            const windowHeight = $window.height();

            // Define how far the user must scroll to play the entire sequence.
            // Setting it to 1.5x window height gives a good pace relative to scrolling speed.
            const maxScroll = windowHeight * 1.5;
            const scrollFraction = scrollTop / maxScroll;

            // Map scroll fraction to frame index
            const frameIndex = Math.max(
                0,
                Math.min(
                    frameCount - 1,
                    Math.floor(scrollFraction * frameCount),
                ),
            );

            // Only update if frame changed within bounds
            if (
                frameIndex >= 0 &&
                frameIndex < frameCount &&
                frameIndex !== sequence.frame
            ) {
                sequence.frame = frameIndex;
                requestAnimationFrame(render);
            }
        }

        $window.on("scroll", () => requestAnimationFrame(updateSequence));

        // Ensure initial frame is rendered immediately
        updateSequence();

        // Extra check for Firefox/Caching: render if images[0] is already loaded
        if (images[0] && images[0].complete) {
            requestAnimationFrame(render);
        }
    }

    // Hero Text Animation (Parallax/Fade)
    function updateHeroText() {
        if (!animationsDone) return;

        var scrollTop = $window.scrollTop();

        if ($hero.length) {
            var heroHeight = $hero.outerHeight();
            // Start fading out
            var opacity = 1 - scrollTop / (heroHeight * 0.6);
            var translateX = scrollTop * 0.5;

            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;

            $heroTitle.css({
                opacity: opacity,
                transform: "translateX(" + translateX + "px)",
            });
            $heroSubtitle.css({
                opacity: opacity,
                transform: "translateX(" + translateX + "px)",
            });
            $heroButton.css({
                opacity: opacity,
                transform: "translateY(0)",
            });
        }
    }

    $window.on("scroll", () => requestAnimationFrame(updateHeroText));

    // Initial call
    updateHeroText();
})(jQuery);
