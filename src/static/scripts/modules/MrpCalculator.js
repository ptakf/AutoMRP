import { mpsCalculator } from "./mps.js";

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

export class MrpCalculator {
    calculateMrps() {
        this.calculateMrp(shoe, shoeInsert);
        this.calculateMrp(shoeInsert, cardboard);
        this.calculateMrp(shoeInsert, protectiveLayer);

        this.calculateMrp(shoe, shoeLace);

        this.calculateMrp(shoe, incompleteShoe);
        this.calculateMrp(incompleteShoe, shoeSole);
        this.calculateMrp(incompleteShoe, upperLayer);
    }

    calculateMrp(higerBOM, lowerBOM) {
        let onHand = lowerBOM.onHand;
        let leadTime = lowerBOM.leadTime;
        let lotSize = lowerBOM.lotSize;

        let grossRequirements = [];
        if (higerBOM.BOMlevel == 0) {
            grossRequirements = mpsCalculator.productionList.slice(1); // Całkowite zapotrzebowanie
            grossRequirements.push(0);
        } else {
            grossRequirements = higerBOM.plannedOrderReleases;
        }
        let scheduledReceipts = []; // Planowane przyjęcia
        let projectedOnHand = []; // Przewidywane na stanie
        let netRequirements = []; // Zapotrzebowanie netto
        let plannedOrderReleases = []; // Planowane zamówienia
        let plannedOrderReceipts = []; // Planowane przyjęcie zamówień

        for (let i = 0; i < mpsCalculator.weekAmount; i++) {
            let netDemand = onHand - grossRequirements[i];
            let plannedOrders = 0;

            // Oblicz net demand
            netRequirements.push(netDemand < 0 ? Math.abs(netDemand) : 0);

            // Aktualizuj onHand
            onHand =
                netDemand < 0
                    ? onHand + lotSize - grossRequirements[i]
                    : onHand - grossRequirements[i];

            // Dodaj lotSize do plannedOrderReceipts w bieżącym tygodniu
            plannedOrderReceipts.push(netDemand < 0 ? lotSize : 0);

            // Dodaj lotSize do plannedOrderReleases w poprzednim tygodniu
            plannedOrderReleases.push(
                i > 0 ? (netDemand < 0 ? lotSize : 0) : 0
            );

            plannedOrderReleases[i] += plannedOrders;
            plannedOrderReceipts[i] += plannedOrders;

            // Zapisz onHand do projectedOnHand
            projectedOnHand.push(onHand);
        }

        // Przesuń wartości plannedOrderReleases w lewo o leadTime względem plannedOrderReceipts
        for (let i = 0; i < leadTime; i++) {
            plannedOrderReleases.push(plannedOrderReleases.shift());
        }

        console.log("------ " + lowerBOM.name + " ------");
        console.log("Total demand:             ", grossRequirements.join(", "));
        console.log("Planowane przyjęcia:      ", scheduledReceipts.join(", "));
        console.log("Expected in stock:        ", projectedOnHand.join(", "));
        console.log("Net demand:               ", netRequirements.join(", "));
        console.log(
            "Planned orders:           ",
            plannedOrderReleases.join(", ")
        );
        console.log(
            "Planned receipt of orders:",
            plannedOrderReceipts.join(", ")
        );
        console.log("------------------------");

        lowerBOM.plannedOrderReleases = plannedOrderReleases;
    }
}
