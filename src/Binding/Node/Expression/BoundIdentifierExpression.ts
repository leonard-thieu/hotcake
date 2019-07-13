import { BoundSymbol } from '../../BoundSymbol';
import { Type } from '../../Type/Type';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundIdentifierExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IdentifierExpression;

    identifier?: BoundSymbol = undefined;
    typeArguments?: Type[] = undefined;
}
