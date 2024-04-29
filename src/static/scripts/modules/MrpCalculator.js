export class MrpCalculator {
    mpsCalculator;

    constructor(mpsCalculator) {
        this.mpsCalculator = mpsCalculator;
    }

    resizeList(list) {
        // Resize the list passed as an argument according to the weekAmount variable.
        // Fill empty slots with 0s
        while (this.mpsCalculator.weekAmount > list.length) {
            list.push(0);
        }

        list.length = this.mpsCalculator.weekAmount;

        return list;
    }

    calculateMrp(lowerBom, higherBom = { bomLevel: 0 }) {
        let onHand = lowerBom.onHand;
        let leadTime = lowerBom.leadTime;
        let lotSize = lowerBom.lotSize;

        let grossRequirements = []; // Całkowite zapotrzebowanie
        let scheduledReceipts = this.resizeList(lowerBom.scheduledReceipts); // Planowane przyjęcia
        let projectedOnHand = []; // Przewidywane na stanie
        let netRequirements = []; // Zapotrzebowanie netto
        let plannedOrderReleases = []; // Planowane zamówienia
        let plannedOrderReceipts = []; // Planowane przyjęcie zamówień

        if (higherBom.bomLevel == 0) {
            grossRequirements = this.mpsCalculator.productionList.slice(1);
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
            onHand += scheduledReceipts[i];

            onHand =
                netDemand < 0
                    ? onHand + lotSize - grossRequirements[i]
                    : onHand - grossRequirements[i];

            // Dodaj lotSize do plannedOrderReleases w bieżącym tygodniu
            plannedOrderReleases.push(netDemand < 0 ? lotSize : 0);

            plannedOrderReleases[i] += plannedOrders;

            // Zapisz onHand do projectedOnHand
            projectedOnHand.push(onHand);
        }

        // Przesuń wartości plannedOrderReleases w lewo o leadTime
        if (plannedOrderReleases[0] === 0) {
            for (let i = 0; i < leadTime; i++) {
                if (plannedOrderReleases[0] !== 0) break;
                plannedOrderReleases.push(plannedOrderReleases.shift());
            }
        }

        plannedOrderReceipts = plannedOrderReleases.slice();

        // Przesuń wartości plannedOrderReceipts w prawo o leadTime
        for (let i = 0; i < leadTime; i++) {
            plannedOrderReceipts.unshift(0);
            plannedOrderReceipts.pop();
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
