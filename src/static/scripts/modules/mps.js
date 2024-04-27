import { MpsCalculator } from "./MpsCalculator.js";
import {
    createHtmlElementFromString,
    createTableElement,
    debounce,
} from "./utils.js";

export var mpsCalculator = new MpsCalculator();

export function setWeekAmount() {
    mpsCalculator.setWeekAmount(
        document.getElementById("set-week-amount-input").value
    );

    createMpsTable();
}

export function fillMpsParameters() {
    document.getElementById("set-week-amount-input").value =
        mpsCalculator.getWeekAmount();
    document.getElementById("set-mps-lead-time-input").value =
        mpsCalculator.getLeadTime();
    document.getElementById("set-mps-on-hand-input").value =
        mpsCalculator.getOnHand();
}

function fillMpsTable() {
    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Fill Week row
        document
            .querySelector("table.mps-table tr.week-row")
            .appendChild(
                createTableElement(
                    "th",
                    `${i + 1}`,
                    "bg-primary text-light text-center fw-bold"
                )
            );
    }

    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Fill Anticipated Demand row
        let newInput = document
            .querySelector("table.mps-table tr.anticipated-row")
            .appendChild(document.createElement("td"))
            .appendChild(
                createHtmlElementFromString(`
                    <input
                    class="w-100 text-center"
                    type="text"
                    pattern="^[1-9]\d*$"
                    value="${mpsCalculator.getAnticipatedDemandList()[i]}"
                    />
                `)
            );

        newInput.addEventListener("input", debounce(calculateMps, 400));
    }

    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Fill Production row
        let newInput = document
            .querySelector("table.mps-table tr.production-row")
            .appendChild(document.createElement("td"))
            .appendChild(
                createHtmlElementFromString(`
                    <input
                    class="w-100 text-center"
                    type="text"
                    pattern="^[1-9]\d*$"
                    value="${mpsCalculator.getProductionList()[i]}"
                    />
                `)
            );

        newInput.addEventListener("input", debounce(calculateMps, 400));
    }

    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Fill Available row
        document
            .querySelector("table.mps-table tr.available-row")
            .appendChild(
                createTableElement(
                    "td",
                    `${mpsCalculator.getAvailableList()[i]}`,
                    "text-center"
                )
            );
    }
}

function resetMpsTable() {
    const MpsTableTemplate = `
            <table
            class="mps-table table table-striped-columns table-bordered">
            <tr class="week-row">
                <th>Week</th>
            </tr>
            <tr class="anticipated-row">
                <th>Anticipated Demand</th>
            </tr>
            <tr class="production-row">
                <th>Production</th>
            </tr>
            <tr class="available-row">
                <th>Available</th>
            </tr>
        </table>
    `;

    document
        .querySelector("table.mps-table")
        .replaceWith(createHtmlElementFromString(MpsTableTemplate));
}

function getVariablesFromInputs() {
    // Update variables with values from input elements
    // Update Lead Time and On Hand
    mpsCalculator.setLeadTime(
        document.getElementById("set-mps-lead-time-input").value
    );
    mpsCalculator.setOnHand(document.getElementById("set-mps-on-hand-input").value);

    // Update Anticipated Demand list
    let anticipatedDemandInputElements = document.querySelectorAll(
        "table.mps-table tr.anticipated-row td input"
    );

    let anticipatedDemandList = [];
    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        anticipatedDemandList[i] = Number(
            anticipatedDemandInputElements[i].value
        );
    }

    mpsCalculator.setAnticipatedDemandList(anticipatedDemandList);

    // Update Production list
    let productionInputElements = document.querySelectorAll(
        "table.mps-table tr.production-row td input"
    );

    let productionList = [];
    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        productionList[i] = Number(productionInputElements[i].value);
    }

    mpsCalculator.setProductionList(productionList);
}

export function calculateMps() {
    getVariablesFromInputs();
    mpsCalculator.calculateMps();

    // Update Available row
    let availableElements = document.querySelectorAll(
        "table.mps-table tr.available-row td"
    );
    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Replace values in Available row
        availableElements[i].innerText = mpsCalculator.getAvailableList()[i];
    }
}

export function createMpsTable() {
    mpsCalculator.resizeLists();

    resetMpsTable();
    fillMpsTable();

    calculateMps();
}
