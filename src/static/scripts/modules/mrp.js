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

function createMrpTable(component) {
    let mrpTableTemplate = `
        <div class="row mrp-part-${component["id"]}">
            <div class="row">
                <div class="col-md-8">
                    <h3>${component["name"]} (BOM Level: ${component["bomLevel"]})</h3>
                </div>    

                <div class="col-md-4 top-row">
                    <!-- <button class="btn" type="button">
                        Delete
                    </button> -->
                </div>
            </div>

            <div class="row">
                <table
                    class="mrp-part-table table table-striped-columns table-bordered"
                >
                    <tr class="week-row">
                        <th>Week</th>
                    </tr>
                    <tr class="gross-requirements-row">
                        <th>Gross Requirements</th>
                    </tr>
                    <tr class="scheduled-receipts-row">
                        <th>Scheduled Receipts</th>
                    </tr>
                    <tr class="projected-on-hand-row">
                        <th>Projected on Hand</th>
                    </tr>
                    <tr class="net-requirements-row">
                        <th>Net Requirements</th>
                    </tr>
                    <tr class="planned-order-releases-row">
                        <th>Planned Order Releases</th>
                    </tr>
                    <tr class="planned-order-receipts-row">
                        <th>Planned Order Receipts</th>
                    </tr>
                </table>
            </div>

            <div class="row bottom-row">
                <div class="col-sm-4 d-inline-flex">
                    <label for="set-mrp-lead-time-input"
                        >Lead Time</label
                    >
                    <input
                        id="set-mrp-lead-time-input"
                        class="form-control"
                        type="number"
                        pattern="^\d*$"
                        value=${component["leadTime"]}
                        required
                    />
                </div>
                <div class="col-sm-4 d-inline-flex">
                    <label for="set-mrp-lot-size-input"
                        >Lot Size</label
                    >
                    <input
                        id="set-mrp-lot-size-input"
                        class="form-control"
                        type="number"
                        pattern="^\d*$"
                        value=${component["lotSize"]}
                        required
                    />
                </div>
                <div class="col-sm-4 d-inline-flex">
                    <label for="set-mrp-on-hand-input"
                        >On Hand</label
                    >
                    <input
                        id="set-mrp-on-hand-input"
                        class="form-control"
                        type="number"
                        pattern="^\d*$"
                        value=${component["onHand"]}
                        required
                    />
                </div>
            </div>
        </div>
    `;

    document
        .querySelector("div.mrp-parts-row")
        .appendChild(createHtmlElementFromString(mrpTableTemplate));

    document
        .getElementById("set-mrp-lead-time-input")
        .addEventListener("input", debounce(calculateMrps, 400));
    document
        .getElementById("set-mrp-lot-size-input")
        .addEventListener("input", debounce(calculateMrps, 400));
    document
        .getElementById("set-mrp-on-hand-input")
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
        createMrpTable(components[component]);
        break;
    }

    calculateMrps();
}
