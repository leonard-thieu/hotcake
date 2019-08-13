import { Node } from '../Nodes';
import { AccessibilityDirective } from './AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from './AliasDirectiveSequence';
import { ClassDeclaration, ClassMethodDeclaration } from './ClassDeclaration';
import { DataDeclaration, DataDeclarationSequence } from './DataDeclarationSequence';
import { ExternClassDeclaration } from './ExternClassDeclaration';
import { ExternDeclarations } from './ExternDeclarations';
import { FriendDirective } from './FriendDirective';
import { FunctionDeclaration } from './FunctionDeclaration';
import { ImportStatement } from './ImportStatement';
import { InterfaceDeclaration, InterfaceMethodDeclaration } from './InterfaceDeclaration';
import { ModuleDeclaration } from './ModuleDeclaration';
import { PreprocessorModuleDeclaration } from './PreprocessorModuleDeclaration';
import { StrictDirective } from './StrictDirective';
import { TypeParameter } from './TypeParameter';

export abstract class Declaration extends Node { }

export type Declarations =
    | PreprocessorModuleDeclaration
    | ModuleDeclaration
    | StrictDirective
    | AccessibilityDirective
    | FriendDirective
    | ImportStatement
    | AliasDirectiveSequence | AliasDirective
    | ExternDeclarations
    | DataDeclarationSequence | DataDeclaration
    | FunctionDeclaration
    | InterfaceDeclaration | InterfaceMethodDeclaration
    | ClassDeclaration | ClassMethodDeclaration | TypeParameter
    ;

export type TypeDeclaration =
    | ExternClassDeclaration
    | InterfaceDeclaration
    | ClassDeclaration
    | TypeParameter
    ;
