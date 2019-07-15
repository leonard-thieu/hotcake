import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';
import { BoundStatements } from './BoundStatements';

export class BoundForLoop extends BoundNode {
    readonly kind = BoundNodeKind.ForLoop;

    locals: BoundSymbolTable = undefined!;

    statement: BoundStatements = undefined!;
    lastValueExpression?: BoundExpression = undefined;
    stepValueExpression?: BoundExpression = undefined;

    statements: BoundStatements[] = undefined!;
}
