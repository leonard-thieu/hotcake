import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundExternDataDeclaration } from './Extern/BoundExternDataDeclaration';

export type BoundDeclarations =
    BoundModuleDeclaration |
    BoundExternDataDeclaration |
    BoundDataDeclaration |
    BoundFunctionDeclaration |
    BoundInterfaceDeclaration |
    BoundInterfaceMethodDeclaration |
    BoundClassDeclaration |
    BoundClassMethodDeclaration
    ;
