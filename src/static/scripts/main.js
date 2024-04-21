import { debounce } from "./modules/utils.js";
import * as mps from "./modules/mps.js";
import * as mrp from "./modules/mrp.js";

// Initialize MPS components
document.getElementById("set-week-amount-input").value = mps.weekAmount;
document.getElementById("set-lead-time-input").value = mps.leadTime;
document.getElementById("set-on-hand-input").value = mps.onHand;

document
    .getElementById("set-week-amount-form")
    .addEventListener("submit", (event) => {
        mps.setWeekAmount();
        event.preventDefault();
    });
document
    .getElementById("set-lead-time-input")
    .addEventListener("input", debounce(mps.calculateMps, 400));
document
    .getElementById("set-on-hand-input")
    .addEventListener("input", debounce(mps.calculateMps, 400));

mps.createMpsTable();

// Initialize MRP components
document
    .getElementById("calculate-mrp-button")
    .addEventListener("click", mrp.calculateMrps);
