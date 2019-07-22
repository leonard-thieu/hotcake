import { ArrayType } from './ArrayType';
import { BoolType } from './BoolType';
import { FloatType } from './FloatType';
import { GenericType } from './GenericType';
import { IntType } from './IntType';
import { ObjectType } from './ObjectType';
import { StringType } from './StringType';
import { VoidType } from './VoidType';

export type Types =
    | ArrayType
    | BoolType
    | FloatType
    | IntType
    | GenericType
    | ObjectType
    | StringType
    | VoidType
    ;
