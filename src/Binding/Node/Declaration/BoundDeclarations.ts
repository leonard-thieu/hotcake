import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';

export type BoundDeclarations =
    BoundModuleDeclaration |
    BoundInterfaceDeclaration |
    BoundInterfaceMethodDeclaration |
    BoundClassDeclaration |
    BoundClassMethodDeclaration |
    BoundFunctionDeclaration |
    BoundDataDeclaration
    ;