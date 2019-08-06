import { BoundNodeKind } from './BoundNodeKind';
import { BoundDeclarations } from './Declaration/BoundDeclarations';
import { BoundExpressions } from './Expression/BoundExpressions';
import { BoundElseClause, BoundElseIfClause } from './Statement/BoundIfStatement';
import { BoundCaseClause, BoundDefaultClause } from './Statement/BoundSelectStatement';
import { BoundStatements } from './Statement/BoundStatements';
import { BoundCatchClause } from './Statement/BoundTryStatement';

export abstract class BoundNode {
    abstract readonly kind: BoundNodeKind = undefined!;
    parent?: BoundNodes = undefined;
}

export type BoundNodes =
    | BoundDeclarations
    | BoundStatements
    | BoundElseIfClause | BoundElseClause
    | BoundCaseClause | BoundDefaultClause
    | BoundCatchClause
    | BoundExpressions
    ;

export type BoundNodeKindToBoundNodeMap = {
    [K in keyof typeof BoundNodeKind]: Extract<BoundNodes, { kind: K; }>;
}
