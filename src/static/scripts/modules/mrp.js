import { MrpCalculator } from "./MrpCalculator.js";
import { mpsCalculator } from "./mps.js";

var mrpCalculator = new MrpCalculator(mpsCalculator);

var shoe = {
    BOMlevel: 0,
};

var shoeInsert = {
    onHand: 22, // Aktualny stan zapasów
    leadTime: 1, // Czas produkcji
    lotSize: 50, // Rozmiar partii
    BOMlevel: 1, // Poziom BOM
    plannedOrderReleases: [], // ???
    name: "Shoe Insert", // ???
};

var cardboard = {
    onHand: 17,
    leadTime: 2,
    lotSize: 50,
    BOMlevel: 2,
    plannedOrderReleases: [],
    name: "Cardboard",
};

var protectiveLayer = {
    onHand: 43,
    leadTime: 4,
    lotSize: 50,
    BOMlevel: 2,
    plannedOrderReleases: [],
    name: "Protective Layer",
};

var shoeLace = {
    onHand: 8,
    leadTime: 43,
    lotSize: 50,
    BOMlevel: 1,
    plannedOrderReleases: [],
    name: "Shoe Lace",
};

var incompleteShoe = {
    onHand: 3,
    leadTime: 3,
    lotSize: 20,
    BOMlevel: 1,
    plannedOrderReleases: [],
    name: "Incomplete Shoe",
};

var shoeSole = {
    onHand: 24,
    leadTime: 5,
    lotSize: 20,
    BOMlevel: 2,
    plannedOrderReleases: [],
    name: "Shoe sole",
};

var upperLayer = {
    onHand: 13,
    leadTime: 4,
    lotSize: 20,
    BOMlevel: 2,
    plannedOrderReleases: [],
    name: "Upper Layer",
};

export function calculateMrps() {
    mrpCalculator.calculateMrp(shoe, shoeInsert);
    mrpCalculator.calculateMrp(shoeInsert, cardboard);
    mrpCalculator.calculateMrp(shoeInsert, protectiveLayer);

    mrpCalculator.calculateMrp(shoe, shoeLace);

    mrpCalculator.calculateMrp(shoe, incompleteShoe);
    mrpCalculator.calculateMrp(incompleteShoe, shoeSole);
    mrpCalculator.calculateMrp(incompleteShoe, upperLayer);
}
