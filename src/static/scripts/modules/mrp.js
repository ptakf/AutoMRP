import { MrpCalculator } from "./MrpCalculator.js";
import { componentDictionary } from "./components.js";
import { mpsCalculator } from "./mps.js";
import { debounce } from "./utils.js";

var mrpCalculator = new MrpCalculator(mpsCalculator);
var components = componentDictionary;

function resetMrpTable(component) {
    // Create MRP component row
    let mrpComponentRow = document.createElement("div");
    mrpComponentRow.classList.add("row", `mrp-component-${component["id"]}`);

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

    let tableRows = {
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

    for (let tableRow in tableRows) {
        // Table row
        let tableRowElement = document.createElement("tr");
        tableRowElement.classList.add(tableRows[tableRow]["id"]);

        // Table header
        let tableRowElementHeader = document.createElement("th");
        tableRowElementHeader.textContent = tableRows[tableRow]["name"];

        tableRowElement.appendChild(tableRowElementHeader);

        // Table data
        for (let i = 0; i < mpsCalculator.getWeekAmount(); i++) {
            if (tableRows[tableRow] === tableRows["week"]) {
                let tableRowElementData = document.createElement("th");
                tableRowElementData.textContent = i + 1;

                tableRowElement.appendChild(tableRowElementData);
            } else {
                let tableRowElementData = document.createElement("td");
                tableRowElementData.textContent = 0;

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

    let parameters = {
        leadTime: { name: "Lead Time", id: "set-mrp-lead-time-input" },
        lotSize: { name: "Lot Size", id: "set-mrp-lot-size-input" },
        onHand: { name: "On Hand", id: "set-mrp-on-hand-input" },
    };

    for (let parameter in parameters) {
        let parameterColumn = document.createElement("div");
        parameterColumn.classList.add("col-sm-4", "d-inline-flex");

        // Parameter label
        let parameterLabel = document.createElement("label");
        parameterLabel.setAttribute("for", parameters[parameter]["id"]);
        parameterLabel.textContent = parameters[parameter]["name"];

        parameterColumn.appendChild(parameterLabel);

        // Parameter input
        let parameterInput = document.createElement("input");
        parameterInput.setAttribute("id", parameters[parameter]["id"]);
        parameterInput.setAttribute("type", "number");
        parameterInput.setAttribute("value", `${component[parameter]}`);
        parameterInput.classList.add("form-control");

        parameterColumn.appendChild(parameterInput);

        // Append row
        parameterInputRow.appendChild(parameterColumn);
    }

    mrpComponentRow.appendChild(parameterInputRow);

    // Append the MRP table to the document or replace the old MRP table
    let queriedMrpComponentRow = document.querySelector(
        `.mrp-component-${component["id"]}`
    );

    if (queriedMrpComponentRow === null) {
        document.querySelector(".mrp-components-row").appendChild(mrpComponentRow);
    } else {
        queriedMrpComponentRow.replaceWith(mrpComponentRow);
    }

    // Add event listeners to the MRP table's parameter inputs
    document
        .querySelector(`.mrp-component-${component["id"]} #set-mrp-lead-time-input`)
        .addEventListener("input", debounce(calculateMrps, 400));
    document
        .querySelector(`.mrp-component-${component["id"]} #set-mrp-lot-size-input`)
        .addEventListener("input", debounce(calculateMrps, 400));
    document
        .querySelector(`.mrp-component-${component["id"]} #set-mrp-on-hand-input`)
        .addEventListener("input", debounce(calculateMrps, 400));
}

export function calculateMrps() {
    mrpCalculator.calculateMrp(components["shoeInsert"]);
    mrpCalculator.calculateMrp(
        components["cardboard"],
        components["shoeInsert"]
    );
    mrpCalculator.calculateMrp(["protectiveLayer"], components["shoeInsert"]);

    mrpCalculator.calculateMrp(components["shoeLace"]);

    mrpCalculator.calculateMrp(components["incompleteShoe"]);
    mrpCalculator.calculateMrp(
        components["shoeSole"],
        components["incompleteShoe"]
    );
    mrpCalculator.calculateMrp(
        components["upperLayer"],
        components["incompleteShoe"]
    );
}

export function createMrpTables() {
    for (let component in components) {
        resetMrpTable(components[component]);
        break; // TODO: remove this
    }

    calculateMrps();
}
