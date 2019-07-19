import { CommaToken, NewlineToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export const CommaSeparatorChildNames: ReadonlyArray<keyof CommaSeparator> = [
    'separator',
    'newlines',
];

export class CommaSeparator extends Node {
    readonly kind = NodeKind.CommaSeparator;

    separator: CommaToken = undefined!;
    newlines: NewlineToken[] = undefined!;
}
