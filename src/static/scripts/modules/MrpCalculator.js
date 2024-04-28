export class MrpCalculator {
    mpsCalculator;

    constructor(mpsCalculator) {
        this.mpsCalculator = mpsCalculator;
    }

    calculateMrp(lowerBom, higherBom = { bomLevel: 0 }) {
        let onHand = lowerBom.onHand;
        let leadTime = lowerBom.leadTime;
        let lotSize = lowerBom.lotSize;

        let scheduledReceipts = []; // Planowane przyjęcia
        let projectedOnHand = []; // Przewidywane na stanie
        let netRequirements = []; // Zapotrzebowanie netto
        let plannedOrderReleases = []; // Planowane zamówienia
        let plannedOrderReceipts = []; // Planowane przyjęcie zamówień
        let grossRequirements = []; // Całkowite zapotrzebowanie

        // // Resize the lists according to the weekAmount variable. Fill empty slots with 0s
        // for (let array of [
        //     scheduledReceipts,
        //     projectedOnHand,
        //     netRequirements,
        //     plannedOrderReleases,
        //     plannedOrderReceipts,
        //     grossRequirements,
        // ]) {
        //     while (this.mpsCalculator.weekAmount > array.length) {
        //         array.push(0);
        //     }

        //     array.length = this.mpsCalculator.weekAmount;
        // }

        if (higherBom.bomLevel == 0) {
            grossRequirements = this.mpsCalculator.productionList.slice(1); // Całkowite zapotrzebowanie
            grossRequirements.push(0);
        } else {
            grossRequirements = higherBom.plannedOrderReleases;
        }

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

        lowerBom.plannedOrderReleases = plannedOrderReleases;

        return {
            grossRequirements: grossRequirements,
            scheduledReceipts: scheduledReceipts,
            projectedOnHand: projectedOnHand,
            netRequirements: netRequirements,
            plannedOrderReleases: plannedOrderReleases,
            plannedOrderReceipts: plannedOrderReceipts,
        };
    }
}
