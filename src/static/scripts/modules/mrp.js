import { MrpCalculator } from "./MrpCalculator.js";
import { mpsCalculator } from "./mps.js";
import { createHtmlElementFromString, debounce } from "./utils.js";

var mrpCalculator = new MrpCalculator(mpsCalculator);

var components = {
    shoeInsert: {
        onHand: 22,
        leadTime: 1,
        lotSize: 50,
        bomLevel: 1,
        plannedOrderReleases: [],
        name: "Shoe Insert",
        id: "q63rn2978",
    },
    cardboard: {
        onHand: 17,
        leadTime: 2,
        lotSize: 50,
        bomLevel: 2,
        plannedOrderReleases: [],
        name: "Cardboard",
        id: "g20sdtb4b",
    },
    protectiveLayer: {
        onHand: 43,
        leadTime: 4,
        lotSize: 50,
        bomLevel: 2,
        plannedOrderReleases: [],
        name: "Protective Layer",
        id: "m0aao0u4v",
    },
    shoeLace: {
        onHand: 8,
        leadTime: 43,
        lotSize: 50,
        bomLevel: 1,
        plannedOrderReleases: [],
        name: "Shoe Lace",
        id: "49shr93o5",
    },
    incompleteShoe: {
        onHand: 3,
        leadTime: 3,
        lotSize: 20,
        bomLevel: 1,
        plannedOrderReleases: [],
        name: "Incomplete Shoe",
        id: "xdj4knm9w",
    },
    shoeSole: {
        onHand: 24,
        leadTime: 5,
        lotSize: 20,
        bomLevel: 2,
        plannedOrderReleases: [],
        name: "Shoe Sole",
        id: "df00hwc1z",
    },
    upperLayer: {
        onHand: 13,
        leadTime: 4,
        lotSize: 20,
        bomLevel: 2,
        plannedOrderReleases: [],
        name: "Upper Layer",
        id: "qo8dn00w9",
    },
};

function resetMrpTable(component) {
    // Create MRP table
    let mrpTable = document.createElement("table");
    mrpTable.classList.add("row", `mrp-part-${component["id"]}`);

    // Create Title row
    let titleRow = document.createElement("div");
    titleRow.classList.add("row", "top-row");

    let title = document.createElement("h3");
    title.textContent = `${component["name"]} (BOM Level: ${component["bomLevel"]})`;
    titleRow.appendChild(title);

    mrpTable.appendChild(titleRow);

    // Create Table row
    let tableElementRow = document.createElement("div");
    tableElementRow.classList.add("row");

    let tableElement = document.createElement("table");
    tableElement.classList.add(
        "mrp-part-table",
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
        let tableRowElement = document.createElement("tr");
        tableRowElement.classList.add(tableRows[tableRow]["id"]);

        // Table Header
        let tableRowElementHeader = document.createElement("th");
        tableRowElementHeader.textContent = tableRows[tableRow]["name"];

        tableRowElement.appendChild(tableRowElementHeader);

        // Table Data
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
    mrpTable.appendChild(tableElementRow);

    // Create Parameter Input row
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

    mrpTable.appendChild(parameterInputRow);

    // Append MRP table to the document or replace old MRP table with the new one
    let queriedMrpTable = document.querySelector(
        `.mrp-part-${component["id"]}`
    );

    if (queriedMrpTable === null) {
        document.querySelector(".mrp-parts-row").appendChild(mrpTable);
    } else {
        queriedMrpTable.replaceWith(mrpTable);
    }

    // Add event listeners to the MRP table's parameter inputs
    document
        .querySelector(`.mrp-part-${component["id"]} #set-mrp-lead-time-input`)
        .addEventListener("input", debounce(calculateMrps, 400));
    document
        .querySelector(`.mrp-part-${component["id"]} #set-mrp-lot-size-input`)
        .addEventListener("input", debounce(calculateMrps, 400));
    document
        .querySelector(`.mrp-part-${component["id"]} #set-mrp-on-hand-input`)
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
