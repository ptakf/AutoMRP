// Global variables
var weekAmount = 10;
var anticipatedDemandList = [];
var productionList = [];
var availableList = [];
var leadTime = 1;
var onHand = 0;

function debounce(callback, delay) {
    // Delay executing the function passed as an argument by the specified amount
    let timer;
    return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback(), delay);
    };
}

function setWeekAmount() {
    weekAmount = document.getElementById("set-week-amount-input").value;
    document.getElementById("set-week-amount-input").value = "";

    resizeLists();
    createMpsTable();
    calculateMps();
}

function createHtmlElementFromString(template) {
    let parent = document.createElement("div");
    parent.innerHTML = template.trim();

    return parent.firstChild;
}

function createTableElement(tag = "td", innerText = "", className = "") {
    // TODO: Figure out why it's not possible to use createHtmlElement() with table tags (<th>, <tr>, <td>)
    let tableElement = document.createElement(tag);
    tableElement.innerText = innerText;
    tableElement.className = className;

    return tableElement;
}

function fillMpsTable() {
    for (let i = 0; i < weekAmount; i++) {
        // Fill Week row
        document
            .querySelector("table.mps-table tr.week-row")
            .appendChild(
                createTableElement(
                    "td",
                    `${i + 1}`,
                    "bg-primary text-light text-center fw-bold"
                )
            );
    }

    for (let i = 0; i < weekAmount; i++) {
        // Fill Anticipated Demand row
        document
            .querySelector("table.mps-table tr.anticipated-row")
            .appendChild(document.createElement("td"))
            .appendChild(
                createHtmlElementFromString(`
                    <input
                    class="w-100 text-center"
                    type="text"
                    pattern="^[1-9]\d*$"
                    oninput="debounce(calculateMps, 400)()"
                    value="${anticipatedDemandList[i]}"
                    />
                `)
            );
    }

    for (let i = 0; i < weekAmount; i++) {
        // Fill Production row
        document
            .querySelector("table.mps-table tr.production-row")
            .appendChild(document.createElement("td"))
            .appendChild(
                createHtmlElementFromString(`
                    <input
                    class="w-100 text-center"
                    type="text"
                    pattern="^[1-9]\d*$"
                    oninput="debounce(calculateMps, 400)()"
                    value="${productionList[i]}"
                    />
                `)
            );
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

function resetMpsTable() {
    const MpsTableTemplate = `
            <table
            class="mps-table table table-striped-columns table-bordered mt-3"
        >
            <tr class="week-row">
                <th class="bg-primary text-light">Week</th>
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

function createMpsTable(initializeTable = false) {
    if (initializeTable) {
        // Fill Lead Time and On Hand
        document.getElementById("set-lead-time-input").value = leadTime;
        document.getElementById("set-on-hand-input").value = onHand;
    }

    resetMpsTable();
    fillMpsTable();
}

function resizeLists() {
    // Resize the lists according to the weekAmount variable. Fill empty slots with 0s
    for (array of [anticipatedDemandList, productionList, availableList]) {
        while (weekAmount > array.length) {
            array.push(0);
        }

        array.length = weekAmount;
    }
}

function getVariablesFromInputs() {
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

function calculateMps() {
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
    availableElements = document.querySelectorAll(
        "table.mps-table tr.available-row td"
    );
    for (let i = 0; i < weekAmount; i++) {
        // Replace values in Available row
        availableElements[i].innerText = availableList[i];
    }
}

// Initialize components
resizeLists();
createMpsTable(true);
