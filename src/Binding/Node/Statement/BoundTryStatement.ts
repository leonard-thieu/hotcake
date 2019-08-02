import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundDataDeclaration } from '../Declaration/BoundDataDeclaration';
import { BoundStatements } from './BoundStatements';

export class BoundTryStatement extends BoundNode {
    readonly kind = BoundNodeKind.TryStatement;

    readonly locals = new BoundSymbolTable();

    statements: BoundStatements[] = undefined!;
    catchClauses: BoundCatchClause[] = undefined!;
}

export class BoundCatchClause extends BoundNode {
    readonly kind = BoundNodeKind.CatchClause;

    readonly locals = new BoundSymbolTable();

    parameter: BoundDataDeclaration = undefined!;
    statements: BoundStatements[] = undefined!;
}
