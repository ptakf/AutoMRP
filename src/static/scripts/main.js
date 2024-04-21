import {
    calculateMps,
    createMpsTable,
    leadTime,
    onHand,
    setWeekAmount,
    weekAmount,
} from "./modules/mps.js";
import { calculateMrps } from "./modules/mrp.js";
import { debounce } from "./modules/utils.js";

// Initialize MPS components
document.getElementById("set-week-amount-input").value = weekAmount;
document.getElementById("set-lead-time-input").value = leadTime;
document.getElementById("set-on-hand-input").value = onHand;

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

// Initialize MRP components
document
    .getElementById("calculate-mrp-button")
    .addEventListener("click", calculateMrps);
