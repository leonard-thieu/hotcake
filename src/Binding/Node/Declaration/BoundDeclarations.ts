import { BoundAliasDirective } from './BoundAliasDirective';
import { BoundClassDeclaration, BoundClassMethodDeclaration } from './BoundClassDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundDirectory } from './BoundDirectory';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundFunctionGroupDeclaration, BoundInterfaceMethodGroupDeclaration } from "./BoundFunctionLikeGroupDeclaration";
import { BoundInterfaceDeclaration, BoundInterfaceMethodDeclaration } from './BoundInterfaceDeclaration';
import { BoundIntrinsicTypeDeclaration } from './BoundIntrinsicTypeDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundTypeParameter } from './BoundTypeParameter';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternDeclarations } from './Extern/BoundExternDeclarations';

export type BoundDeclarations =
    | BoundDirectory
    | BoundIntrinsicTypeDeclaration
    | BoundModuleDeclaration
    | BoundAliasDirective
    | BoundExternDeclarations
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
