import { BoundSymbol } from '../../BoundSymbol';
import { ArrayType } from '../../Type/ArrayType';
import { BoolType } from '../../Type/BoolType';
import { FloatType } from '../../Type/FloatType';
import { IntType } from '../../Type/IntType';
import { NullType } from '../../Type/NullType';
import { VoidType } from '../../Type/VoidType';
import { BoundNode, BoundNodeKind } from '../BoundNodes';

export class BoundIntrinsicTypeDeclaration extends BoundNode {
    readonly kind = BoundNodeKind.IntrinsicType;

    identifier: BoundSymbol = undefined!;
    type: IntrinsicType = undefined!;
}

type IntrinsicType =
    | NullType
    | BoolType
    | IntType
    | FloatType
    | VoidType
    | ArrayType
    ;
