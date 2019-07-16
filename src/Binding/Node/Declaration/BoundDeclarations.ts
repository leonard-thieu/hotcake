import { BoundClassDeclaration } from './BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './BoundDataDeclaration';
import { BoundFunctionDeclaration } from './BoundFunctionDeclaration';
import { BoundInterfaceDeclaration } from './BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration } from './BoundModuleDeclaration';
import { BoundExternDeclarations } from './Extern/BoundExternDeclarations';

export type BoundDeclarations =
    BoundModuleDeclaration |
    BoundExternDeclarations |
    BoundDataDeclaration |
    BoundFunctionDeclaration |
    BoundInterfaceDeclaration |
    BoundInterfaceMethodDeclaration |
    BoundClassDeclaration |
    BoundClassMethodDeclaration
    ;
