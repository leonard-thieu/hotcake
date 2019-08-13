import { BoundAliasDirective } from './BoundAliasDirective';
import { BoundClassDeclaration, BoundClassMethodDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundDirectory } from './BoundDirectory';
import { BoundExternClassDeclaration, BoundExternClassMethodDeclaration } from './BoundExternClassDeclaration';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './BoundExternFunctionDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration, BoundFunctionGroupDeclaration, BoundInterfaceMethodGroupDeclaration } from "./BoundFunctionLikeGroupDeclaration";
import { BoundInterfaceDeclaration, BoundInterfaceMethodDeclaration } from './BoundInterfaceDeclaration';
import { BoundIntrinsicTypeDeclaration } from './BoundIntrinsicTypeDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundTypeParameter } from './BoundTypeParameter';

export type BoundDeclarations =
    | BoundDirectory
    | BoundIntrinsicTypeDeclaration
    | BoundModuleDeclaration
    | BoundAliasDirective
    | BoundExternDataDeclaration
    | BoundExternFunctionDeclaration
    | BoundExternFunctionGroupDeclaration
    | BoundExternClassDeclaration
    | BoundExternClassMethodDeclaration
    | BoundExternClassMethodGroupDeclaration
    | BoundDataDeclaration
    | BoundFunctionDeclaration
    | BoundFunctionGroupDeclaration
    | BoundInterfaceDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundInterfaceMethodGroupDeclaration
    | BoundClassDeclaration
    | BoundClassMethodDeclaration
    | BoundClassMethodGroupDeclaration
    | BoundTypeParameter
    ;

export type BoundTypeReferenceDeclaration =
    | BoundIntrinsicTypeDeclaration
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    | BoundTypeParameter
    ;
