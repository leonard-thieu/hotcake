import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundDataDeclaration } from '../Declaration/BoundDataDeclaration';
import { BoundStatements } from './BoundStatements';

// #region Bound try statement

export class BoundTryStatement extends BoundNode {
    readonly kind = BoundNodeKind.TryStatement;

    readonly locals = new BoundSymbolTable();

    statements: BoundStatements[] = undefined!;
    catchClauses: BoundCatchClause[] = undefined!;
}

// #endregion

// #region Bound catch clause

export class BoundCatchClause extends BoundNode {
    readonly kind = BoundNodeKind.CatchClause;

    readonly locals = new BoundSymbolTable();

    parameter: BoundDataDeclaration = undefined!;
    statements: BoundStatements[] = undefined!;
}

// #endregion
