document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       🌙 DARK MODE
    ========================== */

    function toggleDarkMode() {

        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode")
                ? "dark"
                : "light"
        );
    }

    window.toggleDarkMode = toggleDarkMode;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

});
