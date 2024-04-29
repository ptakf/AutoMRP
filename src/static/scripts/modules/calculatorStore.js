import { MpsCalculator } from "./MpsCalculator.js";
import { MrpCalculator } from "./MrpCalculator.js";

export var mpsCalculator = new MpsCalculator();
export var mrpCalculator = new MrpCalculator(mpsCalculator);
