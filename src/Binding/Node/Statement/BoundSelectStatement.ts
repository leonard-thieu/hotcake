import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';
import { BoundStatements } from './BoundStatements';

export class BoundSelectStatement extends BoundNode {
    readonly kind = BoundNodeKind.SelectStatement;

    expression: BoundExpression = undefined!;
    caseClauses: BoundCaseClause[] = undefined!;
    defaultClause?: BoundDefaultClause = undefined;
}

export class BoundCaseClause extends BoundNode {
    readonly kind = BoundNodeKind.CaseClause;

    locals: BoundSymbolTable = undefined!;

    expressions: BoundExpression[] = undefined!;
    statements: BoundStatements[] = undefined!;
}

export class BoundDefaultClause extends BoundNode {
    readonly kind = BoundNodeKind.DefaultClause;

    locals: BoundSymbolTable = undefined!;

    statements: BoundStatements[] = undefined!;
}
