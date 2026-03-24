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

    $upArrow.on("click", function () {
        if ($journalList.length) {
            $journalList.animate({ scrollTop: "-=200px" }, 300);
        }
    });

    $downArrow.on("click", function () {
        if ($journalList.length) {
            $journalList.animate({ scrollTop: "+=200px" }, 300);
        }
    });

    function updateArrows() {
        if (!$journalList.length) return;

        var scrollTop = $journalList.scrollTop();
        var scrollHeight = $journalList[0].scrollHeight;
        var height = $journalList.outerHeight();

        // Update Up Arrow visibility
        if (scrollTop <= 10) {
            $upArrow.css({
                opacity: "0",
                "pointer-events": "none",
            });
        } else {
            $upArrow.css({
                opacity: "0.5",
                "pointer-events": "auto",
            });
        }

        // Update Down Arrow visibility (with 10px buffer)
        if (scrollTop + height >= scrollHeight - 10) {
            $downArrow.css({
                opacity: "0",
                "pointer-events": "none",
            });
        } else {
            $downArrow.css({
                opacity: "0.5",
                "pointer-events": "auto",
            });
        }
    }

    $journalList.on("scroll", updateArrows);
    $window.on("resize load", updateArrows);

    // Initial check after layout/animations settle
    setTimeout(updateArrows, 1500);
})(jQuery);
