import { Token } from '../Token/Token';
import { ModulePath } from './ModulePath';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class QualifiedIdentifier extends Node {
    static CHILD_NAMES: (keyof QualifiedIdentifier)[] = [
        'modulePath',
        'scopeMemberAccessOperator',
        'identifier',
    ];

    readonly kind = NodeKind.QualifiedIdentifier;

    modulePath: ModulePath;
    scopeMemberAccessOperator: Token | null = null;
    identifier: Token;
}
