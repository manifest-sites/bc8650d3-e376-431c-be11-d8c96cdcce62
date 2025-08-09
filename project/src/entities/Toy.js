import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Toy.json";
export const Toy = createEntityClient("Toy", schema);
