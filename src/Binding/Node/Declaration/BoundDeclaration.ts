import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';

export type BoundDeclarations =
    BoundModuleDeclaration |
    BoundFunctionDeclaration |
    BoundDataDeclaration
    ;