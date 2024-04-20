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

    createMpsTable();
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
                    "th",
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

function createMpsTable(initializeTable = false) {
    if (initializeTable) {
        document.getElementById("set-week-amount-input").value = weekAmount;
        document.getElementById("set-lead-time-input").value = leadTime;
        document.getElementById("set-on-hand-input").value = onHand;
    }

    resizeLists();

    resetMpsTable();
    fillMpsTable();

    calculateMps();
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
createMpsTable(true);


// MRP
function calculateMrps() {
    calculateMrpIns();
    calculateMrpShl();
    calculateMrpIsh();
}
// Ins - shoe insert
// Car - cardboard
// Pls - protective layer of the shoe
// Shl - shoelace
// Ish - incomplete shoe
// Sol - shoe sole
// Uls - upper layer of the shoe

// td - Total demand
// pp - Planned parties
// eis - Expected in stock
// nd - Net demand
// po - Planned orders
// pro - Planned receipt of orders

function calculateMrpIns() {
    let InsOnHand = 22; // Aktualny stan zapasów
    let InsTime = 1; // Czas produkcji
    let InsBatch = 50; // Rozmiar partii

    let tdIns = productionList.slice(1); // Zapotrzebowanie na wkładki
    tdIns.push(0); 
    let eisIns = []; // Przewidywane na stanie
    let ndIns = []; // Zapotrzebowanie netto
    let poIns = []; // Planowane zamówienia
    let proIns = []; // Planowane przyjęcie zamówień

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = InsOnHand - tdIns[i];
        let plannedOrders = 0;

        // Oblicz net demand
        ndIns.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        // Aktualizuj InsOnHand
        InsOnHand = netDemand < 0 ? InsOnHand + InsBatch - tdIns[i] : InsOnHand - tdIns[i];
        
        // Dodaj InsBatch do proIns w bieżącym tygodniu
        proIns.push(netDemand < 0 ? InsBatch : 0);
        
        // Dodaj InsBatch do poIns w poprzednim tygodniu
        poIns.push(i > 0 ? (netDemand < 0 ? InsBatch : 0) : 0);

        // Dodawanie kolejnych partii w tym samym tygodniu, jeśli stan na magazynie nadal jest ujemny
        while (InsOnHand < 0) {
            plannedOrders += InsBatch;
            InsOnHand += InsBatch;
        }
        poIns[i] += plannedOrders;
        proIns[i] += plannedOrders;

        // Zapisz InsOnHand do eisIns
        eisIns.push(InsOnHand);
    }

    // Przesuń wartości poIns w lewo o InsTime względem proIns
    for (let i = 0; i < InsTime; i++) {
        poIns.push(poIns.shift());
    }

    console.log('------ Shoe Insert ------')
    console.log('Total demand:             ', tdIns.join(', '));
    console.log('Expected in stock:        ', eisIns.join(', '));
    console.log('Net demand:               ', ndIns.join(', '));
    console.log('Planned orders:           ', poIns.join(', '));
    console.log('Planned receipt of orders:', proIns.join(', '));
    console.log('------------------------')

    calculateMrpCar(poIns);
    calculateMrpPls(poIns);
}


function calculateMrpCar(poIns) {
    let CarOnHand = 17; 
    let CarTime = 2; 
    let CarBatch = 50; 

    let tdCar = poIns;
    let eisCar = []; 
    let ndCar = []; 
    let poCar = []; 
    let proCar = []; 

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = CarOnHand - tdCar[i];
        let plannedOrders = 0;

        ndCar.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        CarOnHand = netDemand < 0 ? CarOnHand + CarBatch - tdCar[i] : CarOnHand - tdCar[i];
        
        proCar.push(netDemand < 0 ? CarBatch : 0);
        
        poCar.push(i > 0 ? (netDemand < 0 ? CarBatch : 0) : 0);

        while (CarOnHand < 0) {
            plannedOrders += CarBatch;
            CarOnHand += CarBatch;
        }
        poCar[i] += plannedOrders;
        proCar[i] += plannedOrders;

        eisCar.push(CarOnHand);
    }

    for (let i = 0; i < CarTime; i++) {
        poCar.push(poCar.shift());
    }

    console.log('------ Cardboard ------')
    console.log('Total demand:             ', tdCar.join(', '));
    console.log('Expected in stock:        ', eisCar.join(', '));
    console.log('Net demand:               ', ndCar.join(', '));
    console.log('Planned orders:           ', poCar.join(', '));
    console.log('Planned receipt of orders:', proCar.join(', '));
    console.log('------------------------')
}

function calculateMrpPls(poIns) {
    let PlsOnHand = 43; 
    let PlsTime = 4; 
    let PlsBatch = 50; 

    let tdPls = poIns;
    let eisPls = []; 
    let ndPls = []; 
    let poPls = []; 
    let proPls = []; 

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = PlsOnHand - tdPls[i];
        let plannedOrders = 0;

        ndPls.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        PlsOnHand = netDemand < 0 ? PlsOnHand + PlsBatch - tdPls[i] : PlsOnHand - tdPls[i];
        
        proPls.push(netDemand < 0 ? PlsBatch : 0);
        
        poPls.push(i > 0 ? (netDemand < 0 ? PlsBatch : 0) : 0);

        while (PlsOnHand < 0) {
            plannedOrders += PlsBatch;
            PlsOnHand += PlsBatch;
        }
        poPls[i] += plannedOrders;
        proPls[i] += plannedOrders;

        eisPls.push(PlsOnHand);
    }

    for (let i = 0; i < PlsTime; i++) {
        poPls.push(poPls.shift());
    }

    console.log('------ Protective Layer ------')
    console.log('Total demand:             ', tdPls.join(', '));
    console.log('Expected in stock:        ', eisPls.join(', '));
    console.log('Net demand:               ', ndPls.join(', '));
    console.log('Planned orders:           ', poPls.join(', '));
    console.log('Planned receipt of orders:', proPls.join(', '));
    console.log('------------------------')
}


function calculateMrpShl() {
    let ShlOnHand = 8; 
    let ShlTime = 3; 
    let ShlBatch = 50; 

    let tdShl = productionList.slice(1); 
    tdShl.push(0); 
    let eisShl = []; 
    let ndShl = []; 
    let poShl = []; 
    let proShl = []; 

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = ShlOnHand - tdShl[i];
        let plannedOrders = 0;

        ndShl.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        ShlOnHand = netDemand < 0 ? ShlOnHand + ShlBatch - tdShl[i] : ShlOnHand - tdShl[i];
        
        proShl.push(netDemand < 0 ? ShlBatch : 0);
        
        poShl.push(i > 0 ? (netDemand < 0 ? ShlBatch : 0) : 0);

        while (ShlOnHand < 0) {
            plannedOrders += ShlBatch;
            ShlOnHand += ShlBatch;
        }
        poShl[i] += plannedOrders;
        proShl[i] += plannedOrders;

        eisShl.push(ShlOnHand);
    }

    for (let i = 0; i < ShlTime; i++) {
        poShl.push(poShl.shift());
    }

    console.log('------ Shoelance ------')
    console.log('Total demand:             ', tdShl.join(', '));
    console.log('Expected in stock:        ', eisShl.join(', '));
    console.log('Net demand:               ', ndShl.join(', '));
    console.log('Planned orders:           ', poShl.join(', '));
    console.log('Planned receipt of orders:', proShl.join(', '));
    console.log('------------------------')
}


function calculateMrpIsh() {
    let IshOnHand = 3; 
    let IshTime = 3; 
    let IshBatch = 20; 

    let tdIsh = productionList.slice(1); 
    tdIsh.push(0); 
    let eisIsh = []; 
    let ndIsh = []; 
    let poIsh = []; 
    let proIsh = []; 

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = IshOnHand - tdIsh[i];
        let plannedOrders = 0;

        ndIsh.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        IshOnHand = netDemand < 0 ? IshOnHand + IshBatch - tdIsh[i] : IshOnHand - tdIsh[i];
        
        proIsh.push(netDemand < 0 ? IshBatch : 0);
        
        poIsh.push(i > 0 ? (netDemand < 0 ? IshBatch : 0) : 0);

        while (IshOnHand < 0) {
            plannedOrders += IshBatch;
            IshOnHand += IshBatch;
        }
        poIsh[i] += plannedOrders;
        proIsh[i] += plannedOrders;

        eisIsh.push(IshOnHand);
    }

    for (let i = 0; i < IshTime; i++) {
        poIsh.push(poIsh.shift());
    }

    console.log('------ Incomplete shoe ------')
    console.log('Total demand:             ', tdIsh.join(', '));
    console.log('Expected in stock:        ', eisIsh.join(', '));
    console.log('Net demand:               ', ndIsh.join(', '));
    console.log('Planned orders:           ', poIsh.join(', '));
    console.log('Planned receipt of orders:', proIsh.join(', '));
    console.log('------------------------')

    calculateMrpSol(poIsh);
    calculateMrpUls(poIsh)
}

function calculateMrpSol(poIsh) {
    let SolOnHand = 24; 
    let SolTime = 5; 
    let SolBatch = 20; 

    let tdSol = poIsh;
    let eisSol = []; 
    let ndSol = []; 
    let poSol = []; 
    let proSol = []; 

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = SolOnHand - tdSol[i];
        let plannedOrders = 0;

        ndSol.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        SolOnHand = netDemand < 0 ? SolOnHand + SolBatch - tdSol[i] : SolOnHand - tdSol[i];
        
        proSol.push(netDemand < 0 ? SolBatch : 0);
        
        poSol.push(i > 0 ? (netDemand < 0 ? SolBatch : 0) : 0);

        while (SolOnHand < 0) {
            plannedOrders += SolBatch;
            SolOnHand += SolBatch;
        }
        poSol[i] += plannedOrders;
        proSol[i] += plannedOrders;

        eisSol.push(SolOnHand);
    }

    for (let i = 0; i < SolTime; i++) {
        poSol.push(poSol.shift());
    }

    console.log('------ Shoe Sole ------')
    console.log('Total demand:             ', tdSol.join(', '));
    console.log('Expected in stock:        ', eisSol.join(', '));
    console.log('Net demand:               ', ndSol.join(', '));
    console.log('Planned orders:           ', poSol.join(', '));
    console.log('Planned receipt of orders:', proSol.join(', '));
    console.log('------------------------')
}


function calculateMrpUls(poIsh) {
    let UlsOnHand = 13; 
    let UlsTime = 4; 
    let UlsBatch = 20; 

    let tdUls = poIsh;
    let eisUls = []; 
    let ndUls = []; 
    let poUls = []; 
    let proUls = []; 

    for (let i = 0; i < weekAmount; i++) {
        let netDemand = UlsOnHand - tdUls[i];
        let plannedOrders = 0;

        ndUls.push(netDemand < 0 ? Math.abs(netDemand) : 0);
        
        UlsOnHand = netDemand < 0 ? UlsOnHand + UlsBatch - tdUls[i] : UlsOnHand - tdUls[i];
        
        proUls.push(netDemand < 0 ? UlsBatch : 0);
        
        poUls.push(i > 0 ? (netDemand < 0 ? UlsBatch : 0) : 0);

        while (UlsOnHand < 0) {
            plannedOrders += UlsBatch;
            UlsOnHand += UlsBatch;
        }
        poUls[i] += plannedOrders;
        proUls[i] += plannedOrders;

        eisUls.push(UlsOnHand);
    }

    for (let i = 0; i < UlsTime; i++) {
        poUls.push(poUls.shift());
    }

    console.log('------ Upper Layer ------')
    console.log('Total demand:             ', tdUls.join(', '));
    console.log('Expected in stock:        ', eisUls.join(', '));
    console.log('Net demand:               ', ndUls.join(', '));
    console.log('Planned orders:           ', poUls.join(', '));
    console.log('Planned receipt of orders:', proUls.join(', '));
    console.log('------------------------')
}
