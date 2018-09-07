import { Node } from '../Node';
import { AccessibilityDirective } from './AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from './AliasDirectiveSequence';
import { ClassDeclaration } from './ClassDeclaration';
import { ClassMethodDeclaration } from './ClassMethodDeclaration';
import { DataDeclaration } from './DataDeclaration';
import { DataDeclarationList } from './DataDeclarationList';
import { FriendDirective } from './FriendDirective';
import { FunctionDeclaration } from './FunctionDeclaration';
import { ImportStatement } from './ImportStatement';
import { InterfaceDeclaration } from './InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './InterfaceMethodDeclaration';
import { ModuleDeclaration } from './ModuleDeclaration';
import { PreprocessorModuleDeclaration } from './PreprocessorModuleDeclaration';
import { StrictDirective } from './StrictDirective';
import { TypeDeclaration } from './TypeDeclaration';
import { TypeParameter } from './TypeParameter';

export abstract class Declaration extends Node {

}

export type Declarations =
    AccessibilityDirective |
    AliasDirectiveSequence | AliasDirective |
    ClassDeclaration |
    ClassMethodDeclaration |
    DataDeclaration |
    DataDeclarationList |
    FriendDirective |
    FunctionDeclaration |
    ImportStatement |
    InterfaceDeclaration |
    InterfaceMethodDeclaration |
    ModuleDeclaration |
    PreprocessorModuleDeclaration |
    StrictDirective |
    TypeDeclaration |
    TypeParameter
    ;
