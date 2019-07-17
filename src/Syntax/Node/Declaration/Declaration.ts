import { Node } from '../Node';
import { AccessibilityDirective } from './AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from './AliasDirectiveSequence';
import { ClassDeclaration } from './ClassDeclaration';
import { ClassMethodDeclaration } from './ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationSequence } from './DataDeclarationSequence';
import { ExternDataDeclarationSequence } from './ExternDeclaration/ExternDataDeclarationSequence';
import { ExternDeclarations } from './ExternDeclaration/ExternDeclaration';
import { FriendDirective } from './FriendDirective';
import { FunctionDeclaration } from './FunctionDeclaration';
import { ImportStatement } from './ImportStatement';
import { InterfaceDeclaration } from './InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './InterfaceMethodDeclaration';
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
