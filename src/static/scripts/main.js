import {
    calculateMps,
    createMpsTable,
    initializeMpsParameterInputs,
    setWeekAmount,
} from "./modules/mps.js";
import { calculateMrps, createMrpTables } from "./modules/mrp.js";
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
createMrpTables();

for (let inputElement of document.getElementsByTagName("input")) {
    inputElement.addEventListener(
        "input",
        debounce(() => {
            calculateMps();
            calculateMrps();
        }, 400)
    );
}
