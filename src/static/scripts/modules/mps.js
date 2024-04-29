import { mpsCalculator } from "./calculatorStore.js";
import { calculateMrps } from "./mrp.js";
import { debounce } from "./utils.js";

export function setWeekAmount() {
    // Set Week Amount in the MPS calculator to the value of the Week Amount input element
    mpsCalculator.setWeekAmount(
        document.getElementById("set-week-amount-input").value
    );
}

export function updateMpsParameterInputElements() {
    // Update MPS parameter input elements with values from MPS calculator
    document.getElementById("set-week-amount-input").value =
        mpsCalculator.getWeekAmount();

    document.getElementById("set-mps-lead-time-input").value =
        mpsCalculator.getLeadTime();

    document.getElementById("set-mps-on-hand-input").value =
        mpsCalculator.getOnHand();
}

function resetMpsTable() {
    // Create a new MPS table and replace the old one

    // Create MPS table
    let mpsTable = document.createElement("table");
    mpsTable.classList.add("table", "table-striped-columns", "table-bordered");
    mpsTable.setAttribute("id", "mps-table");

    let tableElementBody = document.createElement("tbody");
    mpsTable.appendChild(tableElementBody);

    let tableRows = {
        // MPS table rows
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

    // Generate MPS table content
    for (let tableRow in tableRows) {
        // Create a new row
        let tableRowElement = document.createElement("tr");
        tableRowElement.setAttribute("id", tableRows[tableRow]["id"]);

        // Create a vertical header
        let tableRowElementHeader = document.createElement("th");
        tableRowElementHeader.textContent = tableRows[tableRow]["name"];

        tableRowElement.appendChild(tableRowElementHeader);

        // Create row data
        for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
            if (tableRow === "week") {
                // Fill the horizontal header row - Week row
                let tableRowElementData = document.createElement("th");
                tableRowElementData.textContent = i + 1;

                tableRowElement.appendChild(tableRowElementData);
            } else {
                // Fill the data rows
                let tableRowElementData = document.createElement("td");

                if (tableRow === "available") {
                    // Fill Available row with data from MPS calculator
                    tableRowElementData.textContent =
                        mpsCalculator.getAvailableList()[i];
                } else {
                    // Create input elements for Anticipated Demand and Production rows
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
                        // Fill Anticipated Demand row with data from MPS calculator
                        tableRowElementInput.setAttribute(
                            "value",
                            `${mpsCalculator.getAnticipatedDemandList()[i]}`
                        );
                    } else {
                        // Fill Production row with data from MPS calculator
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

function getVariablesFromMpsTable() {
    // Set Lead Time in the MPS calculator to the value of the Lead Time input element
    mpsCalculator.setLeadTime(
        document.getElementById("set-mps-lead-time-input").value
    );
    // Set On Hand in the MPS calculator to the value of the On Hand input element
    mpsCalculator.setOnHand(
        document.getElementById("set-mps-on-hand-input").value
    );

    // Update Anticipated Demand list in the MPS calculator with the values from the Anticipated Demand row input elements
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

    // Update Production list in the MPS calculator with the values from the Production row input elements
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
    // Calculate MPS and update Available row in MPS table
    getVariablesFromMpsTable();
    mpsCalculator.calculateMps();

    // Update Available row
    let availableElements = document.querySelectorAll(
        "table#mps-table tr#available-row td"
    );
    for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
        // Replace values in Available row with calculated values
        availableElements[i].textContent = mpsCalculator.getAvailableList()[i];

        // Toggle highlighting cells with negative values
        if (availableElements[i].textContent < 0) {
            availableElements[i].style.backgroundColor = "#dc3545";
            availableElements[i].style.color = "#f8f9fa";
            availableElements[i].style.fontWeight = "bold";
        } else {
            availableElements[i].removeAttribute("style");
        }
    }
}

export function createMpsTable() {
    mpsCalculator.resizeLists();

    resetMpsTable();
}
