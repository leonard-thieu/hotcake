import { BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration } from '../BoundFunctionLikeGroupDeclaration';
import { BoundExternClassDeclaration } from './BoundExternClassDeclaration';
import { BoundExternClassMethodDeclaration } from './BoundExternClassMethodDeclaration';
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
