"use strict";

/* ==========================================================
   CalclyWorld v2
   Global JavaScript
   Version: 4.0
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();
    initializeCalculatorSearch();
    initializeSmoothScroll();
    initializeActiveNavigation();
    initializeStickyHeader();
    initializeAccessibility();
    initializeUtilities();

});


/* ==========================================================
   THEME (Dark Mode)
========================================================== */

function initializeTheme() {

    const themeToggle = document.getElementById("theme-toggle");

    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("calclyworld-theme");

    const prefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme =
        savedTheme || (prefersDark ? "dark" : "light");

    applyTheme(theme);

    themeToggle.addEventListener("click", () => {

        const newTheme =
            document.documentElement.dataset.theme === "dark"
                ? "light"
                : "dark";

        applyTheme(newTheme);

    });

}


function applyTheme(theme) {

    document.documentElement.dataset.theme = theme;

    localStorage.setItem("calclyworld-theme", theme);

    const button = document.getElementById("theme-toggle");

    if (!button) return;

    const dark = theme === "dark";

    button.textContent = dark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    button.setAttribute("aria-pressed", dark);

}


/* ==========================================================
   CALCULATOR DATABASE
   Complete CalclyWorld Calculator Directory
   Total: 93 calculators
========================================================== */

const CALCULATORS = [

    /* ======================================================
       FINANCE — 15
    ====================================================== */

    {
        name: "SIP Calculator",
        category: "Finance",
        url: "/sip-calculator.html"
    },

    {
        name: "Savings Calculator",
        category: "Finance",
        url: "/savings-calculator.html"
    },

    {
        name: "Fixed Deposit Calculator",
        category: "Finance",
        url: "/fixed-deposit-calculator.html"
    },

    {
        name: "Recurring Deposit Calculator",
        category: "Finance",
        url: "/recurring-deposit-calculator.html"
    },

    {
        name: "Personal Loan Calculator",
        category: "Finance",
        url: "/personal-loan-calculator.html"
    },

    {
        name: "Car Loan Calculator",
        category: "Finance",
        url: "/car-loan-calculator.html"
    },

    {
        name: "Home Loan EMI Calculator",
        category: "Finance",
        url: "/home-loan-emi-calculator.html"
    },

    {
        name: "Credit Card Payoff Calculator",
        category: "Finance",
        url: "/credit-card-payoff-calculator.html"
    },

    {
        name: "Debt Payoff Calculator",
        category: "Finance",
        url: "/debt-payoff-calculator.html"
    },

    {
        name: "Investment Return Calculator",
        category: "Finance",
        url: "/investment-return-calculator.html"
    },

    {
        name: "Inflation Calculator",
        category: "Finance",
        url: "/inflation-calculator.html"
    },

    {
        name: "Currency Converter",
        category: "Finance",
        url: "/currency-converter.html"
    },

    {
        name: "Tax Calculator",
        category: "Finance",
        url: "/tax-calculator.html"
    },

    {
        name: "Salary Calculator",
        category: "Finance",
        url: "/salary-calculator.html"
    },

    {
        name: "Net Worth Calculator",
        category: "Finance",
        url: "/net-worth-calculator.html"
    },


    /* ======================================================
       EVERYDAY — 15
    ====================================================== */

    {
        name: "Date Calculator",
        category: "Everyday",
        url: "/date-calculator.html"
    },

    {
        name: "Time Duration Calculator",
        category: "Everyday",
        url: "/time-duration-calculator.html"
    },

    {
        name: "Age Difference Calculator",
        category: "Everyday",
        url: "/age-difference-calculator.html"
    },

    {
        name: "Countdown Calculator",
        category: "Everyday",
        url: "/countdown-calculator.html"
    },

    {
        name: "Work Hours Calculator",
        category: "Everyday",
        url: "/work-hours-calculator.html"
    },

    {
        name: "Time Zone Converter",
        category: "Everyday",
        url: "/time-zone-converter.html"
    },

    {
        name: "Unit Price Calculator",
        category: "Everyday",
        url: "/unit-price-calculator.html"
    },

    {
        name: "Discount Calculator",
        category: "Everyday",
        url: "/discount-calculator.html"
    },

    {
        name: "Average Calculator",
        category: "Everyday",
        url: "/average-calculator.html"
    },

    {
        name: "GPA Calculator",
        category: "Everyday",
        url: "/gpa-calculator.html"
    },

    {
        name: "Grade Calculator",
        category: "Everyday",
        url: "/grade-calculator.html"
    },

    {
        name: "Percentage Increase Calculator",
        category: "Everyday",
        url: "/percentage-increase-calculator.html"
    },

    {
        name: "Percentage Decrease Calculator",
        category: "Everyday",
        url: "/percentage-decrease-calculator.html"
    },

    {
        name: "Ratio Calculator",
        category: "Everyday",
        url: "/ratio-calculator.html"
    },

    {
        name: "Random Number Generator",
        category: "Everyday",
        url: "/random-number-generator.html"
    },


    /* ======================================================
       MATH — 10
    ====================================================== */

    {
        name: "Scientific Calculator",
        category: "Math",
        url: "/scientific-calculator.html"
    },

    {
        name: "Fraction Calculator",
        category: "Math",
        url: "/fraction-calculator.html"
    },

    {
        name: "Decimal Calculator",
        category: "Math",
        url: "/decimal-calculator.html"
    },

    {
        name: "Exponent Calculator",
        category: "Math",
        url: "/exponent-calculator.html"
    },

    {
        name: "Square Root Calculator",
        category: "Math",
        url: "/square-root-calculator.html"
    },

    {
        name: "Prime Number Calculator",
        category: "Math",
        url: "/prime-number-calculator.html"
    },

    {
        name: "LCM Calculator",
        category: "Math",
        url: "/lcm-calculator.html"
    },

    {
        name: "GCD Calculator",
        category: "Math",
        url: "/gcd-calculator.html"
    },

    {
        name: "Standard Deviation Calculator",
        category: "Math",
        url: "/standard-deviation-calculator.html"
    },

    {
        name: "Mean Median Mode Calculator",
        category: "Math",
        url: "/mean-median-mode-calculator.html"
    },


    /* ======================================================
       HOME & CONSTRUCTION — 10
    ====================================================== */

    {
        name: "Paint Calculator",
        category: "Home & Construction",
        url: "/paint-calculator.html"
    },

    {
        name: "Tile Calculator",
        category: "Home & Construction",
        url: "/tile-calculator.html"
    },

    {
        name: "Flooring Calculator",
        category: "Home & Construction",
        url: "/flooring-calculator.html"
    },

    {
        name: "Concrete Calculator",
        category: "Home & Construction",
        url: "/concrete-calculator.html"
    },

    {
        name: "Cement Calculator",
        category: "Home & Construction",
        url: "/cement-calculator.html"
    },

    {
        name: "Brick Calculator",
        category: "Home & Construction",
        url: "/brick-calculator.html"
    },

    {
        name: "Sand Calculator",
        category: "Home & Construction",
        url: "/sand-calculator.html"
    },

    {
        name: "Gravel Calculator",
        category: "Home & Construction",
        url: "/gravel-calculator.html"
    },

    {
        name: "Roofing Calculator",
        category: "Home & Construction",
        url: "/roofing-calculator.html"
    },

    {
        name: "Square Foot Calculator",
        category: "Home & Construction",
        url: "/square-foot-calculator.html"
    },


    /* ======================================================
       AUTOMOTIVE — 8
    ====================================================== */

    {
        name: "Fuel Cost Calculator",
        category: "Automotive",
        url: "/fuel-cost-calculator.html"
    },

    {
        name: "Fuel Consumption Calculator",
        category: "Automotive",
        url: "/fuel-consumption-calculator.html"
    },

    {
        name: "Mileage Calculator",
        category: "Automotive",
        url: "/mileage-calculator.html"
    },

    {
        name: "EV Charging Cost Calculator",
        category: "Automotive",
        url: "/ev-charging-cost-calculator.html"
    },

    {
        name: "Road Trip Cost Calculator",
        category: "Automotive",
        url: "/road-trip-cost-calculator.html"
    },

    {
        name: "Car Depreciation Calculator",
        category: "Automotive",
        url: "/car-depreciation-calculator.html"
    },

    {
        name: "Tire Size Calculator",
        category: "Automotive",
        url: "/tire-size-calculator.html"
    },

    {
        name: "Engine Compression Ratio Calculator",
        category: "Automotive",
        url: "/engine-compression-ratio-calculator.html"
    },


    /* ======================================================
       TECHNOLOGY — 7
    ====================================================== */

    {
        name: "Download Time Calculator",
        category: "Technology",
        url: "/download-time-calculator.html"
    },

    {
        name: "File Size Calculator",
        category: "Technology",
        url: "/file-size-calculator.html"
    },

    {
        name: "Battery Runtime Calculator",
        category: "Technology",
        url: "/battery-runtime-calculator.html"
    },

    {
        name: "Screen Size Calculator",
        category: "Technology",
        url: "/screen-size-calculator.html"
    },

    {
        name: "TV Size Calculator",
        category: "Technology",
        url: "/tv-size-calculator.html"
    },

    {
        name: "Internet Speed Converter",
        category: "Technology",
        url: "/internet-speed-converter.html"
    },

    {
        name: "Storage Converter",
        category: "Technology",
        url: "/storage-converter.html"
    },


    /* ======================================================
       CONVERSION — 5
    ====================================================== */

    {
        name: "Length Converter",
        category: "Conversion",
        url: "/length-converter.html"
    },

    {
        name: "Weight Converter",
        category: "Conversion",
        url: "/weight-converter.html"
    },

    {
        name: "Temperature Converter",
        category: "Conversion",
        url: "/temperature-converter.html"
    },

    {
        name: "Volume Converter",
        category: "Conversion",
        url: "/volume-converter.html"
    },

    {
        name: "Speed Converter",
        category: "Conversion",
        url: "/speed-converter.html"
    },


    /* ======================================================
       TRAVEL — 5
    ====================================================== */

    {
        name: "Travel Budget Calculator",
        category: "Travel",
        url: "/travel-budget-calculator.html"
    },

    {
        name: "Hotel Cost Calculator",
        category: "Travel",
        url: "/hotel-cost-calculator.html"
    },

    {
        name: "Trip Fuel Calculator",
        category: "Travel",
        url: "/trip-fuel-calculator.html"
    },

    {
        name: "Flight Time Calculator",
        category: "Travel",
        url: "/flight-time-calculator.html"
    },

    {
        name: "Currency Exchange Calculator",
        category: "Travel",
        url: "/currency-exchange-calculator.html"
    },


    /* ======================================================
       LIFESTYLE — 5
    ====================================================== */

    {
        name: "Recipe Converter",
        category: "Lifestyle",
        url: "/recipe-converter.html"
    },

    {
        name: "Water Reminder Calculator",
        category: "Lifestyle",
        url: "/water-reminder-calculator.html"
    },

    {
        name: "Daily Habit Tracker Calculator",
        category: "Lifestyle",
        url: "/daily-habit-tracker-calculator.html"
    },

    {
        name: "Reading Time Calculator",
        category: "Lifestyle",
        url: "/reading-time-calculator.html"
    },

    {
        name: "Pet Age Calculator",
        category: "Lifestyle",
        url: "/pet-age-calculator.html"
    },


    /* ======================================================
       UTILITY — 5
    ====================================================== */

    {
        name: "Password Generator",
        category: "Utility",
        url: "/password-generator.html"
    },

    {
        name: "QR Code Generator",
        category: "Utility",
        url: "/qr-code-generator.html"
    },

    {
        name: "Binary Converter",
        category: "Utility",
        url: "/binary-converter.html"
    },

    {
        name: "Hexadecimal Converter",
        category: "Utility",
        url: "/hexadecimal-converter.html"
    },

    {
        name: "Roman Numeral Converter",
        category: "Utility",
        url: "/roman-numeral-converter.html"
    },


    /* ======================================================
       ADDITIONAL CALCULATORS — 8
       Existing CalclyWorld calculators
    ====================================================== */

    {
        name: "Tip Calculator",
        category: "Finance",
        url: "/tip-calculator.html"
    },

    {
        name: "Age Calculator",
        category: "Everyday",
        url: "/age-calculator.html"
    },

    {
        name: "Compound Interest Calculator",
        category: "Finance",
        url: "/compound-interest-calculator.html"
    },

    {
        name: "EMI Calculator",
        category: "Finance",
        url: "/emi-calculator.html"
    },

    {
        name: "GST Calculator",
        category: "Finance",
        url: "/gst-calculator.html"
    },

    {
        name: "Mortgage Calculator",
        category: "Finance",
        url: "/mortgage-calculator.html"
    },

    {
        name: "Percentage Calculator",
        category: "Everyday",
        url: "/percentage-calculator.html"
    },

    {
        name: "Retirement Calculator",
        category: "Finance",
        url: "/retirement-calculator.html"
    }

];


/* ==========================================================
   UNIVERSAL CALCULATOR SEARCH
========================================================== */

function initializeCalculatorSearch() {

    const input = document.getElementById("calculator-search");
    const results = document.getElementById("search-results");

    if (!input || !results) return;

    input.addEventListener("input", () => {

        const query = input.value.trim().toLowerCase();

        results.innerHTML = "";

        if (query.length === 0) {

            results.hidden = true;
            results.classList.remove("show");

            return;

        }


        const matches = CALCULATORS.filter(calculator => {

            return (
                calculator.name.toLowerCase().includes(query) ||
                calculator.category.toLowerCase().includes(query)
            );

        });


        if (matches.length === 0) {

            results.innerHTML = `
                <div class="search-result-item">
                    <span class="search-result-title">
                        No calculators found
                    </span>
                </div>
            `;

            results.hidden = false;
            results.classList.add("show");

            return;

        }


        results.innerHTML = matches.map(calculator => `

            <a
                href="${calculator.url}"
                class="search-result-item">

                <span class="search-result-title">
                    ${calculator.name}
                </span>

                <span class="search-result-category">
                    ${calculator.category}
                </span>

            </a>

        `).join("");


        results.hidden = false;
        results.classList.add("show");

    });


    document.addEventListener("click", (event) => {

        if (
            !results.contains(event.target) &&
            event.target !== input
        ) {

            results.hidden = true;
            results.classList.remove("show");

        }

    });


    input.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            results.hidden = true;
            results.classList.remove("show");

            input.blur();

        }

    });

}


/* ==========================================================
   STICKY HEADER
========================================================== */

function initializeStickyHeader() {

    const header = document.querySelector(".site-header");

    if (!header) return;

    const updateHeader = () => {

        if (window.scrollY > 20) {

            header.classList.add("header-scrolled");

        } else {

            header.classList.remove("header-scrolled");

        }

    };


    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

}


/* ==========================================================
   SMOOTH SCROLL
========================================================== */

function initializeSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const target =
                document.querySelector(this.getAttribute("href"));

            if (!target) return;

            event.preventDefault();

            const headerHeight =
                document.querySelector(".site-header")?.offsetHeight || 0;

            const position =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                15;

            window.scrollTo({
                top: position,
                behavior: "smooth"
            });

        });

    });

}


/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

function initializeActiveNavigation() {

    const calculatorsLink = document.querySelector(
        '.main-nav a[href="#calculator-directory"]'
    );

    const calculatorSection =
        document.getElementById("calculator-directory");

    if (!calculatorsLink || !calculatorSection) return;


    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    calculatorsLink.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    calculatorsLink.removeAttribute(
                        "aria-current"
                    );

                }

            });

        },

        {
            threshold: 0.25
        }

    );


    observer.observe(calculatorSection);

}


/* ==========================================================
   ACCESSIBILITY
========================================================== */

function initializeAccessibility() {

    // Open external links safely

    document
        .querySelectorAll('a[target="_blank"]')
        .forEach(link => {

            if (!link.hasAttribute("rel")) {

                link.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

            }

        });


    // Allow Enter key to activate calculator cards

    document
        .querySelectorAll(".calculator-card")
        .forEach(card => {

            card.setAttribute("tabindex", "0");

            card.addEventListener("keydown", (event) => {

                if (event.key === "Enter") {

                    card.click();

                }

            });

        });

}


/* ==========================================================
   UTILITIES
========================================================== */

function initializeUtilities() {

    // Automatically update footer copyright year

    document
        .querySelectorAll("[data-current-year]")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });

}