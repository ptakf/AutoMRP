import {
    calculateMps,
    createMpsTable,
    initializeMpsParameterInputs,
    setWeekAmount,
} from "./modules/mps.js";
import {
    calculateMrps,
    createMrpTables,
    loadComponentsFromFile,
    loadExampleComponents,
    saveComponentsToFile,
} from "./modules/mrp.js";
import { debounce } from "./modules/utils.js";

// Initialize MPS and MRP components
initializeMpsParameterInputs();

document
    .getElementById("set-week-amount-form")
    .addEventListener("submit", (event) => {
        setWeekAmount();

        createMpsTable();
        createMrpTables();

        event.preventDefault();
    });

createMpsTable();

for (let inputElement of document.getElementsByTagName("input")) {
    inputElement.addEventListener(
        "input",
        debounce(() => {
            calculateMps();
            calculateMrps();
        }, 400)
    );
}

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

// createMrpTables(); // Uncomment to load example components on start
