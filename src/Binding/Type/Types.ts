import { ArrayType } from './ArrayType';
import { BoolType } from './BoolType';
import { FloatType } from './FloatType';
import { GenericType } from './GenericType';
import { IntType } from './IntType';
import { ModuleType } from './ModuleType';
import { ObjectType } from './ObjectType';
import { StringType } from './StringType';
import { VoidType } from './VoidType';

export type Types =
    | ArrayType
    | BoolType
    | FloatType
    | GenericType
    | IntType
    | ModuleType
    | ObjectType
    | StringType
    | VoidType
    ;
