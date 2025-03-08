document.addEventListener("DOMContentLoaded", function () {
    let rotateWarning = document.getElementById("rotate-warning");
    let panelBelow = document.querySelector(".panel-below");

    /**
     * Checks if the device is a mobile device or tablet.
     * @returns {boolean} True if a mobile device or tablet is detected, false otherwise.
     */
    function isMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|ipad/.test(userAgent) || window.innerWidth <= 1366;
    }

    /**
     * Checks if the device is in portrait mode.
     * @returns {boolean} True if the device is in portrait mode, false otherwise.
     */
    function isPortraitMode() {
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Updates the visibility of the rotate warning and panel below based on device orientation.
     */
    function checkOrientation() {
        if (isMobileDevice()) {
            rotateWarning.style.display = isPortraitMode() ? "flex" : "none";
            panelBelow.style.display = "flex";
        } else {
            rotateWarning.style.display = "none";
            panelBelow.style.display = "none";
        }
    }

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
});
