import { mpsCalculator, mrpCalculator } from "./calculatorStore.js";
import { exampleComponents } from "./exampleComponents.js";
import { calculateMps } from "./mpsTables.js";
import { debounce } from "./utils.js";

var componentDictionary = {};

var mrpTableRows = {
    // MRP table rows
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

var mrpTableParameterInputElements = {
    // MRP table parameter input elements
    leadTime: { name: "Lead Time", id: "set-mrp-lead-time-input" },
    lotSize: { name: "Lot Size", id: "set-mrp-lot-size-input" },
    onHand: { name: "On Hand", id: "set-mrp-on-hand-input" },
};

export function loadExampleComponents() {
    componentDictionary = exampleComponents;
}

export function loadComponentsFromFile(componentsFile) {
    // Load component dictionary from a File() object
    componentsFile.text().then((response) => {
        // Check if the file is not empty
        if (response != "") {
            componentDictionary = JSON.parse(response);

            createMrpTables(componentDictionary);
        }
    });
}

export function saveComponentsToFile() {
    // Update the button with a URL allowing to download a JSON of the current component dictionary
    let button = document.getElementById("save-configuration-button");

    button.href = URL.createObjectURL(
        new Blob([JSON.stringify(componentDictionary)], {
            type: "text/json",
        })
    );

    button.download = "components.json";
}

function resetMrpTable(component) {
    // Create a new row for the passed MRP component with three sub-rows:
    // Title row, Table row and Parameter Input Elements row.
    // Replace the old MRP component row if it exists

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

    // Generate MRP table content
    for (let tableRow in mrpTableRows) {
        // Create a new row
        let tableRowElement = document.createElement("tr");
        tableRowElement.setAttribute("id", mrpTableRows[tableRow]["id"]);

        // Create a vertical header
        let tableRowElementHeader = document.createElement("th");
        tableRowElementHeader.textContent = mrpTableRows[tableRow]["name"];

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

                if (tableRow === "scheduledReceipts") {
                    // Fill the Scheduled Receipts row with input elements
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
                    // Fill the other rows with 0s
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

    // Create MRP component Parameter Input Elements row
    let parameterInputRow = document.createElement("div");
    parameterInputRow.classList.add("row", "bottom-row");

    for (let parameter in mrpTableParameterInputElements) {
        let parameterColumn = document.createElement("div");
        parameterColumn.classList.add("col-sm-4", "d-inline-flex");

        // Create a Parameter Input Element label
        let parameterLabel = document.createElement("label");
        parameterLabel.setAttribute(
            "for",
            mrpTableParameterInputElements[parameter]["id"]
        );
        parameterLabel.textContent =
            mrpTableParameterInputElements[parameter]["name"];

        parameterColumn.appendChild(parameterLabel);

        // Create a Parameter Input Element
        let parameterInput = document.createElement("input");
        parameterInput.setAttribute(
            "id",
            mrpTableParameterInputElements[parameter]["id"]
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
        parameterInputRow.appendChild(parameterColumn);
    }

    mrpComponentRow.appendChild(parameterInputRow);

    // Append the MRP component row to the MRP components section or replace the old row
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

function getVariablesFromMrpTables() {
    for (let component in componentDictionary) {
        // Update Scheduled Receipts list of the component with values
        // from the Scheduled Receipts row input elements
        let scheduledReceiptsRowInputs = document.querySelectorAll(
            `.mrp-components-row #mrp-component-${componentDictionary[component]["id"]} .mrp-component-table
             tbody tr#scheduled-receipts-row td input`
        );

        for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
            componentDictionary[component]["scheduledReceipts"][i] = Number(
                scheduledReceiptsRowInputs[i].value
            );
        }

        // Set Lead Time, Lot Size and On Hand parameters of the component to values
        // of the Lead Time, Lot Size and On Hand input elements
        let mrpComponentParameterInputElements = document.querySelectorAll(
            `.mrp-components-row #mrp-component-${componentDictionary[component]["id"]} .bottom-row input`
        );

        for (let parameterInputElement of mrpComponentParameterInputElements) {
            // Find the input element IDs for the mrpTableParameterInputElements dictionary
            let parameterInputId = Object.keys(
                mrpTableParameterInputElements
            ).find(
                (key) =>
                    mrpTableParameterInputElements[key].id ==
                    parameterInputElement.id
            );

            // Set the parameters of the component with values from the input elements
            componentDictionary[component][parameterInputId] = Number(
                parameterInputElement.value
            );
        }
    }
}

export function calculateMrps() {
    // Calculate MRP and update MRP Table for every component in the component dictionary
    getVariablesFromMrpTables();

    for (let component in componentDictionary) {
        // Calculate MRP for the current component
        let calculations = mrpCalculator.calculateMrp(
            componentDictionary[component],
            componentDictionary[componentDictionary[component]["parentId"]]
        );

        // Update MRP table rows
        let mrpComponentTableRows = document.querySelectorAll(
            `.mrp-components-row #mrp-component-${componentDictionary[component]["id"]} .mrp-component-table tbody tr`
        );

        for (let tableRow of mrpComponentTableRows) {
            // Check if it's a data row and not the header row - Week row
            if (tableRow.id !== "week-row") {
                // Find the row IDs for the mrpTableRows dictionary
                let tableRowId = Object.keys(mrpTableRows).find(
                    (key) => mrpTableRows[key].id == tableRow.id
                );

                // Update table cells in the MRP table row with data from the MRP calculations
                let tableCells = tableRow.getElementsByTagName("td");
                for (let i = 0; i < tableCells.length; i++) {
                    if (tableRow.id === "scheduled-receipts-row") {
                        // Update the input element in the table cell
                        tableCells[i].firstChild.value =
                            calculations[tableRowId][i];
                    } else {
                        // Update the table cell
                        tableCells[i].textContent = calculations[tableRowId][i];

                        // Toggle highlighting cells with negative values
                        if (tableCells[i].textContent < 0) {
                            tableCells[i].style.backgroundColor = "#dc3545";
                            tableCells[i].style.color = "#f8f9fa";
                            tableCells[i].style.fontWeight = "bold";
                        } else {
                            tableCells[i].removeAttribute("style");
                        }
                    }
                }
            }
        }
    }
}

export function createMrpTables(components = componentDictionary) {
    // Remove old MRP tables
    document.querySelector("div.mrp-components-row").innerHTML = "";

    // Create a new MRP table for every component in the component dictionary
    for (let component in components) {
        resetMrpTable(components[component]);
    }

    calculateMrps();
}
