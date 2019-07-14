import { BoundSymbol } from '../../BoundSymbol';
import { Types } from '../../Type/Types';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from './BoundExpression';

export class BoundIdentifierExpression extends BoundExpression {
    readonly kind = BoundNodeKind.IdentifierExpression;

    identifier?: BoundSymbol = undefined;
    typeArguments?: Types[] = undefined;
}
