import { CommaToken, NewlineToken } from '../Token/Tokens';
import { Node, NodeKind } from './Nodes';

export const CommaSeparatorChildNames: ReadonlyArray<keyof CommaSeparator> = [
    'separator',
    'newlines',
];

export class CommaSeparator extends Node {
    readonly kind = NodeKind.CommaSeparator;

    separator: CommaToken = undefined!;
    newlines: NewlineToken[] = undefined!;
}
