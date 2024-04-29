import { mpsCalculator } from "./calculatorStore.js";
import { calculateMrps } from "./mrp.js";
import { debounce } from "./utils.js";

export function setWeekAmount() {
    mpsCalculator.setWeekAmount(
        document.getElementById("set-week-amount-input").value
    );
}

export function initializeMpsParameterInputs() {
    document.getElementById("set-week-amount-input").value =
        mpsCalculator.getWeekAmount();

    document.getElementById("set-mps-lead-time-input").value =
        mpsCalculator.getLeadTime();

    document.getElementById("set-mps-on-hand-input").value =
        mpsCalculator.getOnHand();
}

function resetMpsTable() {
    // Create MPS table
    let mpsTable = document.createElement("table");
    mpsTable.classList.add("table", "table-striped-columns", "table-bordered");
    mpsTable.setAttribute("id", "mps-table");

    let tableElementBody = document.createElement("tbody");
    mpsTable.appendChild(tableElementBody);

    let tableRows = {
        week: {
            name: "Week",
            id: "week-row",
        },
        anticipatedDemand: {
            name: "Anticipated Demand",
            id: "anticipated-row",
        },
        production: {
            name: "Production",
            id: "production-row",
        },
        available: {
            name: "Available",
            id: "available-row",
        },
    };

    for (let tableRow in tableRows) {
        // Table row
        let tableRowElement = document.createElement("tr");
        tableRowElement.setAttribute("id", tableRows[tableRow]["id"]);

        // Table header
        let tableRowElementHeader = document.createElement("th");
        tableRowElementHeader.textContent = tableRows[tableRow]["name"];

        tableRowElement.appendChild(tableRowElementHeader);

        // Table data
        for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
            if (tableRow === "week") {
                let tableRowElementData = document.createElement("th");
                tableRowElementData.textContent = i + 1;

                tableRowElement.appendChild(tableRowElementData);
            } else {
                let tableRowElementData = document.createElement("td");

                if (tableRow === "available") {
                    tableRowElementData.textContent =
                        mpsCalculator.getAvailableList()[i];
                } else {
                    let tableRowElementInput = document.createElement("input");
                    tableRowElementInput.setAttribute("type", "number");
                    tableRowElementInput.addEventListener(
                        "input",
                        debounce(() => {
                            calculateMps();
                            calculateMrps();
                        }, 400)
                    );

                    if (tableRow === "anticipatedDemand") {
                        tableRowElementInput.setAttribute(
                            "value",
                            `${mpsCalculator.getAnticipatedDemandList()[i]}`
                        );
                    } else {
                        tableRowElementInput.setAttribute(
                            "value",
                            `${mpsCalculator.getProductionList()[i]}`
                        );
                    }

                    tableRowElementData.appendChild(tableRowElementInput);
                }

                tableRowElement.appendChild(tableRowElementData);
            }
        }

        tableElementBody.appendChild(tableRowElement);
    }

    // Replace the old MPS table
    document.querySelector("table#mps-table").replaceWith(mpsTable);
}

function getVariablesFromInputs() {
    // Update variables with values from input elements
    // Update Lead Time and On Hand
    mpsCalculator.setLeadTime(
        document.getElementById("set-mps-lead-time-input").value
    );
    mpsCalculator.setOnHand(
        document.getElementById("set-mps-on-hand-input").value
    );

    // Update Anticipated Demand list
    let anticipatedDemandInputElements = document.querySelectorAll(
        "table#mps-table tr#anticipated-row td input"
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
        "table#mps-table tr#production-row td input"
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
        "table#mps-table tr#available-row td"
    );
    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Replace values in Available row
        availableElements[i].textContent = mpsCalculator.getAvailableList()[i];
    }
}

export function createMpsTable() {
    mpsCalculator.resizeLists();

    resetMpsTable();

    calculateMps();
}
