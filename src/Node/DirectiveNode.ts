import { Token } from "../Token";
import { Node } from "./Node";

export abstract class DirectiveNode extends Node {
    numberSign: Token | null = null;
}
