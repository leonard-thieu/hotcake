import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode, BoundNodeKind } from '../BoundNodes';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

// #region Bound if statement

export class BoundIfStatement extends BoundNode {
    readonly kind = BoundNodeKind.IfStatement;

    readonly locals = new BoundSymbolTable();

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
    elseIfClauses?: BoundElseIfClause[] = undefined!;
    elseClause?: BoundElseClause = undefined!;
}

// #endregion

// #region Bound else if clause

export class BoundElseIfClause extends BoundNode {
    readonly kind = BoundNodeKind.ElseIfClause;

    readonly locals = new BoundSymbolTable();

    expression: BoundExpressions = undefined!;
    statements: BoundStatements[] = undefined!;
}

// #endregion

// #region Bound else clause

export class BoundElseClause extends BoundNode {
    readonly kind = BoundNodeKind.ElseClause;

    readonly locals = new BoundSymbolTable();

    statements: BoundStatements[] = undefined!;
}

// #endregion
