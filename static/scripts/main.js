var weekAmount = 10;

function setWeekAmount() {
    weekAmount = document.getElementById("set-week-amount-input").value;

    resetMpsTable();
}

function createHtmlElementFromString(template) {
    let parent = document.createElement("div");
    parent.innerHTML = template.trim();

    return parent.firstChild;
}

function fillMpsTable() {
    // Fill Week row
    for (let i = 0; i < weekAmount; i++) {
        // const weekCellTemplate = createHtmlElementFromString(
        //   `<td class="bg-primary text-light text-center px-4">${i + 1}</td>`
        // );
        // Cannot use createHtmlElement(), because for whatever reason it doesn't work with <td> tags
        const weekColumn = document.createElement("td");
        weekColumn.className = "bg-primary text-light text-center px-4";
        weekColumn.innerText = `${i + 1}`;

        document
            .querySelector("table.mps-table tr.week-row")
            .appendChild(weekCell);
    }

    // Fill Anticipated Demand row
}

function resetMpsTable() {
    const MpsTableTemplate = `
    <table class="mps-table table table-striped-columns table-bordered mt-3">
        <div>
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
        </div>
      </table>
    `;

    // document
    //     .querySelector("table.mps-table")
    //     .replaceWith(createHtmlElementFromString(MpsTableTemplate));
}

function createMpsTable() {
    resetMpsTable();
    fillMpsTable();
}

createMpsTable();
