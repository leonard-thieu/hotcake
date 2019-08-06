import { BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration } from '../BoundFunctionLikeGroupDeclaration';
import { BoundExternClassDeclaration, BoundExternClassMethodDeclaration } from './BoundExternClassDeclaration';
import { BoundExternDataDeclaration } from './BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './BoundExternFunctionDeclaration';

export type BoundExternDeclarations =
    | BoundExternDataDeclaration
    | BoundExternFunctionDeclaration
    | BoundExternFunctionGroupDeclaration
    | BoundExternClassDeclaration
    | BoundExternClassMethodDeclaration
    | BoundExternClassMethodGroupDeclaration
    ;
