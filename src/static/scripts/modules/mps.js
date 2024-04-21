import {
    debounce,
    createHtmlElementFromString,
    createTableElement,
} from "./utils.js";

// MPS variables
export var weekAmount = 10;
export var anticipatedDemandList = [];
export var productionList = [];
export var availableList = [];
export var leadTime = 1;
export var onHand = 0;

export function setWeekAmount() {
    weekAmount = document.getElementById("set-week-amount-input").value;

    createMpsTable();
}

export function fillMpsTable() {
    for (let i = 0; i < weekAmount; i++) {
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

    for (let i = 0; i < weekAmount; i++) {
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
                    value="${anticipatedDemandList[i]}"
                    />
                `)
            );

        newInput.addEventListener("input", debounce(calculateMps, 400));
    }

    for (let i = 0; i < weekAmount; i++) {
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
                    value="${productionList[i]}"
                    />
                `)
            );

        newInput.addEventListener("input", debounce(calculateMps, 400));
    }

    for (let i = 0; i < weekAmount; i++) {
        // Fill Available row
        document
            .querySelector("table.mps-table tr.available-row")
            .appendChild(
                createTableElement("td", `${availableList[i]}`, "text-center")
            );
    }
}

export function resetMpsTable() {
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

export function createMpsTable() {
    resizeLists();

    resetMpsTable();
    fillMpsTable();

    calculateMps();
}

export function resizeLists() {
    // Resize the lists according to the weekAmount variable. Fill empty slots with 0s
    for (let array of [anticipatedDemandList, productionList, availableList]) {
        while (weekAmount > array.length) {
            array.push(0);
        }

        array.length = weekAmount;
    }
}

export function getVariablesFromInputs() {
    // Update variables with values from input elements
    // Update Lead Time and On Hand
    leadTime = document.getElementById("set-lead-time-input").value;
    onHand = document.getElementById("set-on-hand-input").value;

    // Update Anticipated Demand list
    let anticipatedDemandInputElements = document.querySelectorAll(
        "table.mps-table tr.anticipated-row td input"
    );

    for (let i = 0; i < weekAmount; i++) {
        anticipatedDemandList[i] = Number(
            anticipatedDemandInputElements[i].value
        );
    }

    // Update Production list
    let productionInputElements = document.querySelectorAll(
        "table.mps-table tr.production-row td input"
    );

    for (let i = 0; i < weekAmount; i++) {
        productionList[i] = Number(productionInputElements[i].value);
    }
}

export function calculateMps() {
    // Calculate product availability in the MPS
    getVariablesFromInputs();

    for (let i = 0; i < weekAmount; i++) {
        if (i == 0) {
            availableList[i] =
                onHand - anticipatedDemandList[i] + productionList[i];
        } else {
            availableList[i] =
                availableList[i - 1] -
                anticipatedDemandList[i] +
                productionList[i];
        }
    }

    // Update Available row
    let availableElements = document.querySelectorAll(
        "table.mps-table tr.available-row td"
    );
    for (let i = 0; i < weekAmount; i++) {
        // Replace values in Available row
        availableElements[i].innerText = availableList[i];
    }
}
