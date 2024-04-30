import {
    calculateMps,
    createMpsTable,
    setWeekAmount,
    updateMpsParameterInputElements,
} from "./modules/mpsTables.js";
import {
    calculateMrps,
    createMrpTables,
    loadComponentsFromFile,
    loadExampleComponents,
    saveComponentsToFile,
} from "./modules/mrpTables.js";
import { debounce } from "./modules/utils.js";

// Add a service worker
window.onload = () => {
    "use strict";

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(
            "./static/scripts/modules/serviceWorker.js",
            { scope: "/" }
        );
    }
};

// Initialize loading/saving configuration
document
    .getElementById("load-configuration-input")
    .addEventListener("change", (input) => {
        loadComponentsFromFile(input.target.files[0]);
    });

document
    .getElementById("load-example-configuration-button")
    .addEventListener("click", () => {
        loadExampleComponents();
        createMrpTables();
    });

document
    .getElementById("save-configuration-button")
    .addEventListener("click", saveComponentsToFile);

// Initialize MPS and MRP components
document
    .getElementById("set-week-amount-form")
    .addEventListener("submit", (event) => {
        setWeekAmount();

        createMpsTable();
        createMrpTables();

        calculateMps();
        calculateMrps();

        event.preventDefault();
    });

for (let inputElementId of [
    "set-mps-lead-time-input",
    "set-mps-on-hand-input",
]) {
    document.getElementById(inputElementId).addEventListener(
        "input",
        debounce(() => {
            calculateMps();
            calculateMrps();
        }, 400)
    );
}

updateMpsParameterInputElements();
createMpsTable();

// Uncomment next two lines to load example components on start:
// loadExampleComponents();
// createMrpTables();
