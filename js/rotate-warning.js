document.addEventListener("DOMContentLoaded", function () {
    let rotateWarning = document.getElementById("rotate-warning");

    /**
     * Checks if the device is a mobile device.
     * @returns {boolean} True if a mobile device is detected, false otherwise.
     */
    function isMobileDevice() {
        return window.innerWidth <= 480;
    }

    /**
     * Checks if the device is in portrait mode.
     * @returns {boolean} True if the device is in portrait mode, false otherwise.
     */
    function isPortraitMode() {
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Updates the visibility of the rotate warning based on device orientation.
     */
    function checkOrientation() {
        if (isMobileDevice()) {
            rotateWarning.style.display = isPortraitMode() ? "flex" : "none";
        } else {
            rotateWarning.style.display = "none";
        }
    }

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
});
