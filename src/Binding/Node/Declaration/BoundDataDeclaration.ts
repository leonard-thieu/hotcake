import { BoundSymbol } from '../../Binder';
import { Type } from '../../Type/Type';
import { BoundNode } from '../BoundNode';
import { BoundNodeKind } from '../BoundNodeKind';
import { BoundExpression } from '../Expression/BoundExpression';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';

export class BoundDataDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.DataDeclaration;

    parent: BoundFunctionDeclaration = undefined!;

    get scope() {
        return this.parent;
    }

    identifier: BoundSymbol = undefined!;
    type: Type = undefined!;
    expression?: BoundExpression = undefined;
}
