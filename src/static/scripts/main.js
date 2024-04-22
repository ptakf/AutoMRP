import {
    calculateMps,
    createMpsTable,
    fillMpsParameters,
    setWeekAmount,
} from "./modules/mps.js";
import { calculateMrps } from "./modules/mrp.js";
import { debounce } from "./modules/utils.js";

// Initialize MPS components
fillMpsParameters();

document
    .getElementById("set-week-amount-form")
    .addEventListener("submit", (event) => {
        setWeekAmount();
        event.preventDefault();
    });
document
    .getElementById("set-lead-time-input")
    .addEventListener("input", debounce(calculateMps, 400));
document
    .getElementById("set-on-hand-input")
    .addEventListener("input", debounce(calculateMps, 400));

createMpsTable();

//Initialize MRP components
document
    .getElementById("calculate-mrp-button")
    .addEventListener("click", calculateMrps);
