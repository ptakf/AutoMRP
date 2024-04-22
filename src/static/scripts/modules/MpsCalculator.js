export class MpsCalculator {
    weekAmount = 10;
    anticipatedDemandList = [];
    productionList = [];
    availableList = [];
    leadTime = 1;
    onHand = 0;

    setWeekAmount(weekAmount) {
        this.weekAmount = weekAmount;
    }

    getWeekAmount() {
        return this.weekAmount;
    }

    setAnticipatedDemandList(anticipatedDemandList) {
        this.anticipatedDemandList = anticipatedDemandList;
    }

    getAnticipatedDemandList() {
        return this.anticipatedDemandList;
    }

    setProductionList(productionList) {
        this.productionList = productionList;
    }

    getProductionList() {
        return this.productionList;
    }

    setAvailableList(availableList) {
        this.availableList = availableList;
    }

    getAvailableList() {
        return this.availableList;
    }

    setLeadTime(leadTime) {
        this.leadTime = leadTime;
    }

    getLeadTime() {
        return this.leadTime;
    }

    setOnHand(onHand) {
        this.onHand = onHand;
    }

    getOnHand() {
        return this.onHand;
    }

    resizeLists() {
        // Resize the lists according to the weekAmount variable. Fill empty slots with 0s
        for (let array of [
            this.anticipatedDemandList,
            this.productionList,
            this.availableList,
        ]) {
            while (this.weekAmount > array.length) {
                array.push(0);
            }

            array.length = this.weekAmount;
        }
    }

    calculateMps() {
        // Calculate product availability in the MPS
        for (let i = 0; i < this.weekAmount; i++) {
            if (i == 0) {
                this.availableList[i] =
                    this.onHand -
                    this.anticipatedDemandList[i] +
                    this.productionList[i];
            } else {
                this.availableList[i] =
                    this.availableList[i - 1] -
                    this.anticipatedDemandList[i] +
                    this.productionList[i];
            }
        }
    }
}
