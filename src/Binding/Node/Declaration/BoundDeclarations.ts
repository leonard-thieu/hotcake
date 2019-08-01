import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundDirectory } from './BoundDirectory';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundFunctionGroupDeclaration, BoundInterfaceMethodGroupDeclaration } from "./BoundFunctionLikeGroupDeclaration";
import { BoundImportStatement } from './BoundImportStatement';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundIntrinsicTypeDeclaration } from './BoundIntrinsicTypeDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundTypeParameter } from './BoundTypeParameter';
import { BoundExternClassDeclaration } from './Extern/BoundExternClassDeclaration';
import { BoundExternDeclarations } from './Extern/BoundExternDeclarations';

export type BoundDeclarations =
    | BoundDirectory
    | BoundIntrinsicTypeDeclaration
    | BoundModuleDeclaration
    | BoundImportStatement
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
