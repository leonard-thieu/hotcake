import { Types } from '../../Type/Types';
import { BoundNode } from '../BoundNode';

export abstract class BoundExpression extends BoundNode {
    type: Types = undefined!;
}
