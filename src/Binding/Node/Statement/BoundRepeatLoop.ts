import { BoundSymbolTable } from '../../BoundSymbol';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpressions } from '../Expression/BoundExpressions';
import { BoundStatements } from './BoundStatements';

export class BoundRepeatLoop extends BoundNode {
    readonly kind = BoundNodeKind.RepeatLoop;

    locals: BoundSymbolTable = undefined!;

    expression?: BoundExpressions = undefined;
    statements: BoundStatements[] = undefined!;
}
