import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

// #region Bound select statement

export class BoundSelectStatement extends BoundNode {
    readonly kind = BoundNodeKind.SelectStatement;

    expression: BoundExpressions = undefined!;
    caseClauses: BoundCaseClause[] = undefined!;
    defaultClause?: BoundDefaultClause = undefined;
}

// #endregion

// #region Bound case clause

export class BoundCaseClause extends BoundNode {
    readonly kind = BoundNodeKind.CaseClause;

    readonly locals = new BoundSymbolTable();

    expressions: BoundExpressions[] = undefined!;
    statements: BoundStatements[] = undefined!;
}

// #endregion

// #region Bound default clause

export class BoundDefaultClause extends BoundNode {
    readonly kind = BoundNodeKind.DefaultClause;

    readonly locals = new BoundSymbolTable();

    statements: BoundStatements[] = undefined!;
}

// #endregion
