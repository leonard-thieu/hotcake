import { BoundSymbol } from '../../BoundSymbol';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundIdentifierExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IdentifierExpression;

    parent: BoundNode = undefined!;

    identifier?: BoundSymbol = undefined;
    typeArguments?: Type[] = undefined;
}
