import { MrpCalculator } from "./MrpCalculator.js";

export var mrpCalculator = new MrpCalculator();

export function calculateMrps() {
    mrpCalculator.calculateMrps();
}
