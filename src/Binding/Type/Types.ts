import { ArrayType } from './ArrayType';
import { BoolType } from './BoolType';
import { FloatType } from './FloatType';
import { FunctionLikeGroupType, FunctionLikeType } from './FunctionLikeType';
import { IntType } from './IntType';
import { ModuleType } from './ModuleType';
import { ObjectType } from './ObjectType';
import { StringType } from './StringType';
import { TypeParameterType } from './TypeParameterType';
import { VoidType } from './VoidType';

export type Types =
    | ArrayType
    | BoolType
    | FloatType
    | FunctionLikeType
    | FunctionLikeGroupType
    | IntType
    | ModuleType
    | ObjectType
    | StringType
    | TypeParameterType
    | VoidType
    ;
