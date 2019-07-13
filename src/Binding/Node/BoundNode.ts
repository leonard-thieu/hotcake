import { BoundNodeKind } from './BoundNodeKind';
import { BoundDeclarations } from './Declaration/BoundDeclarations';
import { BoundExpressions } from './Expression/BoundExpressions';
import { BoundStatements } from './Statement/BoundStatements';

export abstract class BoundNode {
    abstract readonly kind: BoundNodeKind = undefined!;
    parent?: BoundNodes = undefined;
}

export type BoundNodes =
    BoundDeclarations |
    BoundStatements |
    BoundExpressions
    ;
