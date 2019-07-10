import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';

export abstract class BoundExpression extends BoundNode {
    type: Type = undefined!;
}
