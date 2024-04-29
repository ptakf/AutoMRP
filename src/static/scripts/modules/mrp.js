import { mpsCalculator, mrpCalculator } from "./calculatorStore.js";
import { exampleComponents } from "./exampleComponents.js";
import { calculateMps } from "./mps.js";
import { debounce } from "./utils.js";

var componentDictionary = {};

var mrpTableRows = {
    week: {
        name: "Week",
        id: "week-row",
    },
    grossRequirements: {
        name: "Gross Requirements",
        id: "gross-requirements-row",
    },
    scheduledReceipts: {
        name: "Scheduled Receipts",
        id: "scheduled-receipts-row",
    },
    projectedOnHand: {
        name: "Projected on Hand",
        id: "projected-on-hand-row",
    },
    netRequirements: {
        name: "Net Requirements",
        id: "net-requirements-row",
    },
    plannedOrderReleases: {
        name: "Planned Order Releases",
        id: "planned-order-releases-row",
    },
    plannedOrderReceipts: {
        name: "Planned Order Receipts",
        id: "planned-order-receipts-row",
    },
};

var mrpTableParameterInputs = {
    leadTime: { name: "Lead Time", id: "set-mrp-lead-time-input" },
    lotSize: { name: "Lot Size", id: "set-mrp-lot-size-input" },
    onHand: { name: "On Hand", id: "set-mrp-on-hand-input" },
};

export function loadExampleComponents() {
    componentDictionary = exampleComponents;
}

export function loadComponentsFromFile(componentsFile) {
    componentsFile.text().then((response) => {
        if (response != "") {
            componentDictionary = JSON.parse(response);

            createMrpTables(componentDictionary);
            return componentDictionary;
        }
    });
}

export function saveComponentsToFile() {
    let button = document.getElementById("save-configuration-button");
    button.href = URL.createObjectURL(
        new Blob([JSON.stringify(componentDictionary)], {
            type: "text/json",
        })
    );
    button.download = "components.json";
}

function resetMrpTable(component) {
    // Create MRP component row
    let mrpComponentRow = document.createElement("div");
    mrpComponentRow.classList.add("row");
    mrpComponentRow.setAttribute("id", `mrp-component-${component["id"]}`);

    // Create MRP component Title row
    let titleRow = document.createElement("div");
    titleRow.classList.add("row", "top-row");

    let title = document.createElement("h3");
    title.textContent = `${component["name"]} (BOM Level: ${component["bomLevel"]})`;
    titleRow.appendChild(title);

    mrpComponentRow.appendChild(titleRow);

    // Create MRP component Table row
    let tableElementRow = document.createElement("div");
    tableElementRow.classList.add("row");

    let tableElement = document.createElement("table");
    tableElement.classList.add(
        "mrp-component-table",
        "table",
        "table-striped-columns",
        "table-bordered"
    );

    let tableElementBody = document.createElement("tbody");
    tableElement.appendChild(tableElementBody);

    for (let tableRow in mrpTableRows) {
        // Table row
        let tableRowElement = document.createElement("tr");
        tableRowElement.setAttribute("id", mrpTableRows[tableRow]["id"]);

        // Table header
        let tableRowElementHeader = document.createElement("th");
        tableRowElementHeader.textContent = mrpTableRows[tableRow]["name"];

        tableRowElement.appendChild(tableRowElementHeader);

        // Table data
        for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
            if (tableRow === "week") {
                let tableRowElementData = document.createElement("th");
                tableRowElementData.textContent = i + 1;

                tableRowElement.appendChild(tableRowElementData);
            } else {
                let tableRowElementData = document.createElement("td");

                if (tableRow === "scheduledReceipts") {
                    let tableRowElementInput = document.createElement("input");
                    tableRowElementInput.setAttribute("type", "number");
                    tableRowElementInput.addEventListener(
                        "input",
                        debounce(() => {
                            calculateMps();
                            calculateMrps();
                        }, 400)
                    );

                    tableRowElementInput.setAttribute("value", 0);

                    tableRowElementData.appendChild(tableRowElementInput);
                } else {
                    let tableRowElementData = document.createElement("td");
                    tableRowElementData.textContent = 0;
                }

                tableRowElement.appendChild(tableRowElementData);
            }
        }

        tableElementBody.appendChild(tableRowElement);
    }

    tableElementRow.appendChild(tableElement);
    mrpComponentRow.appendChild(tableElementRow);

    // Create MRP component Parameter Input row
    let parameterInputRow = document.createElement("div");
    parameterInputRow.classList.add("row", "bottom-row");

    for (let parameter in mrpTableParameterInputs) {
        let parameterColumn = document.createElement("div");
        parameterColumn.classList.add("col-sm-4", "d-inline-flex");

        // Parameter label
        let parameterLabel = document.createElement("label");
        parameterLabel.setAttribute(
            "for",
            mrpTableParameterInputs[parameter]["id"]
        );
        parameterLabel.textContent = mrpTableParameterInputs[parameter]["name"];

        parameterColumn.appendChild(parameterLabel);

        // Parameter input
        let parameterInput = document.createElement("input");
        parameterInput.setAttribute(
            "id",
            mrpTableParameterInputs[parameter]["id"]
        );
        parameterInput.setAttribute("type", "number");
        parameterInput.setAttribute("value", `${component[parameter]}`);
        parameterInput.classList.add("form-control");
        parameterInput.addEventListener(
            "input",
            debounce(() => {
                calculateMps();
                calculateMrps();
            }, 400)
        );

        parameterColumn.appendChild(parameterInput);

        // Append row
        parameterInputRow.appendChild(parameterColumn);
    }

    mrpComponentRow.appendChild(parameterInputRow);

    // Append the MRP table to the document or replace the old MRP table
    let queriedMrpComponentRow = document.querySelector(
        `#mrp-component-${component["id"]}`
    );

    if (queriedMrpComponentRow === null) {
        document
            .querySelector(".mrp-components-row")
            .appendChild(mrpComponentRow);
    } else {
        queriedMrpComponentRow.replaceWith(mrpComponentRow);
    }
}

function getVariablesFromInputs() {
    for (let component in componentDictionary) {
        // Update Scheduled Receipts values with new values from input elements
        let scheduledReceiptsRowInputs = document.querySelectorAll(
            `.mrp-components-row #mrp-component-${componentDictionary[component]["id"]} .mrp-component-table
             tbody tr#scheduled-receipts-row td input`
        );

        for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
            componentDictionary[component]["scheduledReceipts"][i] = Number(
                scheduledReceiptsRowInputs[i].value
            );
        }

        // Update component parameter values
        let mrpComponentParameterInputs = document.querySelectorAll(
            `.mrp-components-row #mrp-component-${componentDictionary[component]["id"]} .bottom-row input`
        );

        for (let parameterInput of mrpComponentParameterInputs) {
            let parameterInputId = Object.keys(mrpTableParameterInputs).find(
                (key) => mrpTableParameterInputs[key].id == parameterInput.id
            );

            componentDictionary[component][parameterInputId] = Number(
                parameterInput.value
            );
        }
        break;
    }
}

export function calculateMrps() {
    getVariablesFromInputs();

    for (let component in componentDictionary) {
        let calculations = mrpCalculator.calculateMrp(
            componentDictionary[component],
            componentDictionary[componentDictionary[component]["parentId"]]
        );

        let mrpComponentTableRows = document.querySelectorAll(
            `.mrp-components-row #mrp-component-${componentDictionary[component]["id"]} .mrp-component-table tbody tr`
        );

        for (let tableRow of mrpComponentTableRows) {
            if (tableRow.id !== "week-row") {
                let tableRowId = Object.keys(mrpTableRows).find(
                    (key) => mrpTableRows[key].id == tableRow.id
                );

                let tableCells = tableRow.getElementsByTagName("td");
                for (let i = 0; i < tableCells.length; i++) {
                    if (tableRow.id === "scheduled-receipts-row") {
                        tableCells[i].firstChild.value =
                            calculations[tableRowId][i];
                    } else {
                        tableCells[i].textContent = calculations[tableRowId][i];
                    }
                }
            }
        }
    }
}

export function createMrpTables(components = componentDictionary) {
    // Remove old MRP tables
    document.querySelector("div.mrp-components-row").innerHTML = "";

    for (let component in components) {
        resetMrpTable(components[component]);
    }

    calculateMrps();
}
