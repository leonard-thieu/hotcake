import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundDirectory } from './BoundDirectory';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundImportStatement } from './BoundImportStatement';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundTypeParameter } from './BoundTypeParameter';
import { BoundExternDeclarations } from './Extern/BoundExternDeclarations';

export type BoundDeclarations =
    | BoundDirectory
    | BoundModuleDeclaration
    | BoundImportStatement
    | BoundExternDeclarations
    | BoundDataDeclaration
    | BoundFunctionDeclaration
    | BoundInterfaceDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundClassDeclaration
    | BoundClassMethodDeclaration
    | BoundTypeParameter
    ;

export type BoundTypedDeclarations =
    | BoundDirectory
    | BoundModuleDeclaration
    | BoundExternDeclarations
    | BoundDataDeclaration
    | BoundFunctionDeclaration
    | BoundInterfaceDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundClassDeclaration
    | BoundClassMethodDeclaration
    | BoundTypeParameter
    ;
