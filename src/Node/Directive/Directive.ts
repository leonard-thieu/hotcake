import { Token } from "../../Token";
import { Node } from "../Node";

export abstract class Directive extends Node {
    numberSign: Token | null = null;
}
