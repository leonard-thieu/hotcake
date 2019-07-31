import { ArrayType } from './ArrayType';
import { BoolType } from './BoolType';
import { FloatType } from './FloatType';
import { FunctionGroupType, FunctionType, MethodGroupType, MethodType } from './FunctionLikeType';
import { IntType } from './IntType';
import { ModuleType } from './ModuleType';
import { NullType } from "./NullType";
import { ObjectType } from './ObjectType';
import { StringType } from './StringType';
import { TypeParameterType } from './TypeParameterType';
import { VoidType } from './VoidType';

export type Types =
    | ArrayType
    | BoolType
    | FloatType
    | FunctionType
    | FunctionGroupType
    | IntType
    | MethodType
    | MethodGroupType
    | ModuleType
    | NullType
    | ObjectType
    | StringType
    | TypeParameterType
    | VoidType
    ;

export type IntrinsicType =
    | NullType
    | BoolType
    | IntType
    | FloatType
    | VoidType
    | ArrayType
    ;
