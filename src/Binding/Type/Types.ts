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

export enum TypeKind {
    Array = 'Array',
    Bool = 'Bool',
    Float = 'Float',
    Function = 'Function',
    FunctionGroup = 'FunctionGroup',
    Int = 'Int',
    Method = 'Method',
    MethodGroup = 'MethodGroup',
    Module = 'Module',
    Null = 'Null',
    String = 'String',
    Object = 'Object',
    TypeParameter = 'TypeParameter',
    Void = 'Void',
}

export type DefaultableType =
    | BoolType
    | IntType
    | FloatType
    | StringType
    | ArrayType
    | ObjectType
    ;
