// Global variables
var weekAmount = 10;
var anticipatedDemandList = [];
var productionList = [];
var availableList = [];
var leadTime = 1;
var onHand = 0;

function debounce(callback, delay) {
    // Delay executing the function passed as an argument
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
}

function setLeadTime() {
    leadTime = document.getElementById("set-lead-time-input").value;
}

function setOnHand() {
    onHand = document.getElementById("set-on-hand-input").value;

    calculateMps();
    createMpsTable();
}

function createHtmlElementFromString(template) {
    let parent = document.createElement("div");
    parent.innerHTML = template.trim();

    return parent.firstChild;
}

function createTdElement(innerText = "", className = "") {
    // TODO: Figure out why it's not possible to use createHtmlElement() with <td> tags
    let tdElement = document.createElement("td");
    tdElement.innerText = innerText;
    tdElement.className = className;

    return tdElement;
}

function fillMpsTable() {
    for (let i = 0; i < weekAmount; i++) {
        // Fill Week row
        document
            .querySelector("table.mps-table tr.week-row")
            .appendChild(
                createTdElement(
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
                    oninput="calculateMps()"
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
                    oninput="calculateMps()"
                    value="${productionList[i]}"
                    />
                `)
            );
    }

    for (let i = 0; i < weekAmount; i++) {
        // Fill Available row
        document
            .querySelector("table.mps-table tr.available-row")
            .appendChild(createTdElement(`${availableList[i]}`, "text-center"));
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

function createMpsTable() {
    resetMpsTable();
    fillMpsTable();

    document.getElementById("set-lead-time-input").value = leadTime;

    document.getElementById("set-on-hand-input").value = onHand;
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

function updateLists() {
    // Update lists with values from input elements
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
    updateLists();

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

    // TODO: implement displaying the calculated availability in the MPS table

    console.log(availableList); // TODO: remove this
}

// Initialize components
resizeLists();
createMpsTable();
