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

    // Play initial animations as soon as possible (DOM Ready)
    $(function () {
        window.setTimeout(function () {
            $body.removeClass("is-preload");

            // Snappier Slide-in Sequence
            setTimeout(function () {
                if ($heroTitle.length) $heroTitle.addClass("visible");
            }, 50);

            setTimeout(function () {
                if ($heroSubtitle.length) $heroSubtitle.addClass("visible");
            }, 350);

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
                }, 800);
            }, 800);
        }, 50);
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
        // Create a folder 'images/sequence' and number them frame_000.png, frame_001.png, etc.
        const frameCount = window.heroFrameCount || 30; // Adjust based on your actual sequence length
        const currentFrame =
            window.currentFrame ||
            ((index) =>
                `images/sequence/frame_${index.toString().padStart(3, "0")}.png`);

        const images = [];
        const sequence = {
            frame: 0,
        };

        // Preload images with priority for the first frame
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const src = currentFrame(i); // 0-based index for filenames

            img.onload = () => {
                // If this is the first frame, render it immediately
                if (i === 0) {
                    requestAnimationFrame(render);
                }
            };

            img.onerror = function () {
                this.src = window.heroFallbackImage || "images/overlay.png";
                this.onerror = null;
            };

            img.src = src;
            images.push(img);
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

        // Animation Loop Logic
        const fps = 10; // Normal playback speed
        const scrollMultiplier = 1.5; // Speed multiplier when scrolling
        let lastTime = 0;
        let isScrolling = false;
        let scrollTimeout;

        // Detect scrolling
        $window.on("scroll", () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        });

        function animate(time) {
            if (!lastTime) lastTime = time;

            const currentFps = isScrolling ? fps * scrollMultiplier : fps;
            const interval = 1000 / currentFps;
            const delta = time - lastTime;

            if (delta > interval) {
                lastTime = time - (delta % interval);

                // Advance frame and loop
                sequence.frame = (sequence.frame + 1) % frameCount;
                render();
            }

            requestAnimationFrame(animate);
        }

        // Initial render to avoid blank canvas if images are ready
        render();
        requestAnimationFrame(animate);
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

(function ($) {
    // Resilience Calculator Logic
    var $calcSection = $("#modal-calculator");
    var $resSection = $("#modal-results");
    var $calcBtn = $("#calc-btn");
    var $backBtn = $("#back-to-calc");
    var $close = $(".close-modal");

    // Industry Multipliers (Cost per unit failure * frequency)
    var industryData = {
        logistics: { cost: 5000, uptime: 35 }, // $5k/robot/yr
        manufacturing: { cost: 15000, uptime: 60 }, // $15k/robot/yr
        subsea: { cost: 120000, uptime: 250 }, // $120k/robot/yr (huge retrieval cost)
        aerospace: { cost: 850000, uptime: 500 }, // $850k/robot/yr (mission critical)
    };

    if ($calcBtn.length) {
        $calcBtn.on("click", function () {
            var fleetSize = parseInt($("#fleet-size").val()) || 0;
            var industry = $("#industry").val();

            if (fleetSize > 0) {
                // Calculate
                var data = industryData[industry];
                var totalSavings = fleetSize * data.cost;

                // Format
                var formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                });

                $("#result-savings").text(formatter.format(totalSavings));
                $("#result-uptime").text("+" + data.uptime + "%");

                // Transition
                $calcSection.fadeOut(200, function () {
                    $resSection.fadeIn(200);
                });
            } else {
                $("#fleet-size").focus();
            }
        });
    }

    if ($backBtn.length) {
        $backBtn.on("click", function () {
            $resSection.fadeOut(200, function () {
                $calcSection.fadeIn(200);
            });
        });
    }

    // Reset modal state when closed
    if ($close.length) {
        $close.on("click", function () {
            setTimeout(function () {
                $resSection.hide();
                $calcSection.show();
                $("#fleet-size").val("");
            }, 300);
        });
    }
})(jQuery);

(function ($) {
    // Floating Navbar Behavior
    var $navbar = $("#navbar");

    function updateNavbarScroll() {
        if ($(window).scrollTop() > 50) {
            $navbar.addClass("stowed");
        } else {
            $navbar.removeClass("stowed");
        }
    }

    // Initialize
    updateNavbarScroll();

    // Scroll Event
    $(window).on("scroll", updateNavbarScroll);

    // Expand on Click
    $navbar.on("click", function (e) {
        if ($navbar.hasClass("stowed")) {
            e.preventDefault();
            $navbar.removeClass("stowed");
        }
    });

    // Stow on Click Outside
    $(document).on("click", function (e) {
        if (
            !$(e.target).closest("#navbar").length &&
            $(window).scrollTop() > 50
        ) {
            $navbar.addClass("stowed");
        }
    });
})(jQuery);
