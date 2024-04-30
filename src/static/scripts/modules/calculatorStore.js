import { MpsCalculator } from "./mpsCalculator.js";
import { MrpCalculator } from "./mrpCalculator.js";

export var mpsCalculator = new MpsCalculator();
export var mrpCalculator = new MrpCalculator(mpsCalculator);
