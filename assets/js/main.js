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
        // Breakpoints mirror the split-view media queries in main.css
        var isSplitView =
            $window.width() > 980 ||
            ($window.width() > 560 &&
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

    // Expand on click anywhere in the stowed navbar except the logo link,
    // which navigates instead (on the landing page its own handler above
    // stops the event before this). The hamburger also collapses it again.
    $navbar.on("click", function (e) {
        if ($navbar.hasClass("stowed") && !$(e.target).closest(".logo a").length) {
            e.preventDefault();
            e.stopPropagation();
            $navbar.removeClass("stowed");
        } else if ($(e.target).closest(".hamburger").length) {
            $navbar.addClass("stowed");
        }
    });

    // Mirror the stowed state onto the hamburger for assistive tech. Observing
    // the class covers every place that stows the navbar, including the
    // scroll handlers in the journal pages' inline scripts.
    var $hamburger = $navbar.find(".hamburger");
    if ($hamburger.length) {
        new MutationObserver(function () {
            $hamburger.attr(
                "aria-expanded",
                String(!$navbar.hasClass("stowed")),
            );
        }).observe($navbar[0], { attributes: true, attributeFilter: ["class"] });
    }

    // Close when clicking outside
    $(document).on("click", function (e) {
        if (
            !$navbar.hasClass("stowed") &&
            !$(e.target).closest("#navbar").length
        ) {
            $navbar.addClass("stowed");
        }
    });

    // Close with Escape; if focus was inside the navbar, return it to the
    // hamburger so keyboard users don't lose their place
    $(document).on("keydown", function (e) {
        if (e.key !== "Escape" || $navbar.hasClass("stowed")) return;
        var focusInNavbar = $navbar[0].contains(document.activeElement);
        $navbar.addClass("stowed");
        if (focusInNavbar) $navbar.find(".hamburger").trigger("focus");
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
