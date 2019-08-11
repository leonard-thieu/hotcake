import { Node } from '../Nodes';
import { AccessibilityDirective } from './AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from './AliasDirectiveSequence';
import { ClassDeclaration, ClassMethodDeclaration } from './ClassDeclaration';
import { DataDeclaration, DataDeclarationSequence } from './DataDeclarationSequence';
import { ExternClassDeclaration } from './ExternDeclaration/ExternClassDeclaration';
import { ExternDataDeclarationSequence } from './ExternDeclaration/ExternDataDeclarationSequence';
import { ExternDeclarations } from './ExternDeclaration/ExternDeclaration';
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
    | ExternDeclarations
    | ExternDataDeclarationSequence
    | AccessibilityDirective
    | AliasDirectiveSequence | AliasDirective
    | ClassDeclaration
    | ClassMethodDeclaration
    | DataDeclarationSequence | DataDeclaration
    | FriendDirective
    | FunctionDeclaration
    | ImportStatement
    | InterfaceDeclaration
    | InterfaceMethodDeclaration
    | ModuleDeclaration
    | PreprocessorModuleDeclaration
    | StrictDirective
    | TypeParameter
    ;

export type TypeDeclaration =
    | ExternClassDeclaration
    | InterfaceDeclaration
    | ClassDeclaration
    | TypeParameter
    ;
