/*
	Phenomena Replication Laboratory Landing Page
*/

(function ($) {
    var $window = $(window),
        $body = $("body"),
        $hero = $("#hero"),
        $heroTitle = $("#hero-title"),
        $heroSubtitle = $("#hero-subtitle"),
        $journalColumn = $(".journal-column"),
        $journalList = $(".journal-list"),
        $textBoundary = $(".text-boundary"),
        $navbar = $("#navbar");

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

    // Play initial animations
    $(function () {
        window.setTimeout(function () {
            $body.removeClass("is-preload");

            setTimeout(function () {
                if ($heroTitle.length) $heroTitle.addClass("visible");
            }, 50);

            setTimeout(function () {
                if ($heroSubtitle.length) $heroSubtitle.addClass("visible");
            }, 350);

            setTimeout(function () {
                animationsDone = true;
                alignJournalColumn();
                // Ensure alignment after layout/fonts load
                setTimeout(alignJournalColumn, 500);
                setTimeout(alignJournalColumn, 2000);
            }, 800);
        }, 50);
    });

    // Function to align journal column height with text boundary
    function alignJournalColumn() {
        var isSplitView =
            $window.width() > 980 ||
            ($window.width() > 600 &&
                window.matchMedia("(orientation: landscape)").matches);

        if (isSplitView && $textBoundary.length && $journalColumn.length) {
            var height = $textBoundary.outerHeight();
            // Match journal height to text for symmetry in split view
            $journalColumn.css("height", height + "px");
        } else {
            // Let CSS handle height and centering in vertical layouts
            $journalColumn.css("height", "");
        }

        // Recalculate scroll arrows whenever the container height changes
        if (typeof updateArrows === "function") updateArrows();
    }

    $window.on("resize load", alignJournalColumn);

    // ==========================================
    // Image Sequence Logic (Background Canvas)
    // ==========================================

    const canvas = document.getElementById("hero-canvas");

    if (canvas) {
        const context = canvas.getContext("2d");
        const frameCount = window.heroFrameCount || 30;
        const currentFrame = (index) =>
            `images/sequence/frame_${index.toString().padStart(3, "0")}.png`;

        const images = [];
        const sequence = { frame: 0 };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const src = currentFrame(i);
            img.onload = () => {
                if (i === 0) requestAnimationFrame(render);
            };
            img.onerror = function () {
                this.src = "images/overlay.png";
                this.onerror = null;
            };
            img.src = src;
            images.push(img);
        }

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

        let scrollAccumulator = 0;
        const scrollThreshold = 30; // Pixels to advance 1 frame

        function advanceFrame(delta) {
            scrollAccumulator += Math.abs(delta);
            if (scrollAccumulator >= scrollThreshold) {
                sequence.frame = (sequence.frame + 1) % frameCount;
                scrollAccumulator = 0;
                render();
            }
        }

        // Advance frames only when interacting with the journal list
        $journalList.on("wheel", (e) => {
            advanceFrame(e.originalEvent.deltaY || 0);
        });

        let lastScrollTop = 0;
        $journalList.on("scroll", () => {
            const st = $journalList.scrollTop();
            advanceFrame(st - lastScrollTop);
            lastScrollTop = st;
        });

        let lastTouchY = 0;
        $journalList.on("touchstart", (e) => {
            if (e.originalEvent.touches) {
                lastTouchY = e.originalEvent.touches[0].clientY;
            }
        });

        $journalList.on("touchmove", (e) => {
            if (e.originalEvent.touches) {
                const touchY = e.originalEvent.touches[0].clientY;
                advanceFrame(touchY - lastTouchY);
                lastTouchY = touchY;
            }
        });

        // Initial render
        render();
    }

    // ==========================================
    // Navbar Logic
    // ==========================================

    // Scroll journal to top on logo click
    $navbar.find(".logo a").on("click", function (e) {
        if ($journalList.length) {
            e.preventDefault();
            e.stopPropagation();
            $journalList.animate({ scrollTop: 0 }, 500);
            $navbar.addClass("stowed");
        }
    });

    // Expand/Collapse on Click
    $navbar.on("click", function (e) {
        if ($navbar.hasClass("stowed")) {
            e.preventDefault();
            e.stopPropagation();
            $navbar.removeClass("stowed");
        }
    });

    // Close when clicking outside
    $(document).on("click", function (e) {
        if (
            !$navbar.hasClass("stowed") &&
            !$(e.target).closest("#navbar").length
        ) {
            $navbar.addClass("stowed");
        }
    });

    // Collapse navbar when scrolling inside the journal list
    $journalList.on("scroll", function () {
        if (!$navbar.hasClass("stowed")) {
            $navbar.addClass("stowed");
        }
    });

    // Journal Scroll Indicators (Arrows)
    var $upArrow = $(".scroll-up");
    var $downArrow = $(".scroll-down");

    function updateArrows() {
        if (!$journalList.length) return;

        var scrollTop = $journalList.scrollTop();
        var scrollHeight = $journalList[0].scrollHeight;
        var height = $journalList.outerHeight();

        // Update Up Arrow visibility
        if (scrollTop <= 10) {
            $upArrow.css("opacity", "0");
        } else {
            $upArrow.css("opacity", "0.5");
        }

        // Update Down Arrow visibility (with 10px buffer)
        if (scrollTop + height >= scrollHeight - 10) {
            $downArrow.css("opacity", "0");
        } else {
            $downArrow.css("opacity", "0.5");
        }
    }

    $journalList.on("scroll", updateArrows);
    $window.on("resize load", updateArrows);

    // Initial check after layout/animations settle
    setTimeout(updateArrows, 1500);
})(jQuery);
