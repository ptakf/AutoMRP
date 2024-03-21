// Global variables
var weekAmount = 10;
var anticipatedDemandList = [];
var productionList = [];
var availableList = [];

function debounce(callback, delay) {
    // Function that delays executing the function passed as an argument.
    let timer;
    return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback(), delay);
    };
}

function setWeekAmount() {
    weekAmount = document.getElementById("set-week-amount-input").value;
    document.getElementById("set-week-amount-input").value = "";

    createMpsTable();
}

function createHtmlElementFromString(template) {
    let parent = document.createElement("div");
    parent.innerHTML = template.trim();

    return parent.firstChild;
}

function createTdElementFromString(innerText = "", className = "") {
    // TODO: Figure out why it's not possible to use createHtmlElement() with <td> tags.
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
                createTdElementFromString(
                    `${i + 1}`,
                    "bg-primary text-light text-center px-4"
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
                    oninput=""
                    value="${anticipatedDemandList[i]}"
                    />
                `)
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

function createMpsTable() {
    resetMpsTable();
    fillMpsTable();
}

function initializeLists() {
    // Fill the lists with 0s
    for (array of [anticipatedDemandList, productionList, availableList]) {
        array.length = weekAmount;
        array.fill(0);
    }
}

// Initialize components
initializeLists();
createMpsTable();
