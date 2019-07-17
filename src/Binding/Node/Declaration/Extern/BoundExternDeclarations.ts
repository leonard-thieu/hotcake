import { BoundExternClassDeclaration } from './BoundExternClassDeclaration';
import { BoundExternClassMethodDeclaration } from './BoundExternClassMethodDeclaration';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './BoundExternFunctionDeclaration';

export type BoundExternDeclarations =
    | BoundExternDataDeclaration
    | BoundExternFunctionDeclaration
    | BoundExternClassDeclaration
    | BoundExternClassMethodDeclaration
    ;
