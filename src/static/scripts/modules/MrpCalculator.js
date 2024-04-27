export class MrpCalculator {
    mpsCalculator;

    constructor(mpsCalculator) {
        this.mpsCalculator = mpsCalculator;
    }

    calculateMrp(higherBOM, lowerBOM) {
        let onHand = lowerBOM.onHand;
        let leadTime = lowerBOM.leadTime;
        let lotSize = lowerBOM.lotSize;

        let grossRequirements = [];
        if (higherBOM.BOMlevel == 0) {
            grossRequirements = this.mpsCalculator.productionList.slice(1); // Całkowite zapotrzebowanie
            grossRequirements.push(0);
        } else {
            grossRequirements = higherBOM.plannedOrderReleases;
        }

        let scheduledReceipts = []; // Planowane przyjęcia
        let projectedOnHand = []; // Przewidywane na stanie
        let netRequirements = []; // Zapotrzebowanie netto
        let plannedOrderReleases = []; // Planowane zamówienia
        let plannedOrderReceipts = []; // Planowane przyjęcie zamówień

        for (let i = 0; i < this.mpsCalculator.weekAmount; i++) {
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

        // TODO: Delete this:
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
