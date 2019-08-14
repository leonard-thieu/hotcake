import { MissingToken } from '../../Token/MissingToken';
import { EqualsSignToken } from '../../Token/Tokens';
import { StringLiteralExpression } from '../Expression/StringLiteralExpression';
import { Declaration } from './Declarations';
import { ExternClassDeclaration, ExternClassMethodDeclaration } from './ExternClassDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationSequence } from './ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

export abstract class ExternDeclaration extends Declaration {
    equalsSign?: EqualsSignToken = undefined!;
    nativeSymbol?: StringLiteralExpression | MissingToken = undefined!;
}

export type ExternDeclarations =
    | ExternDataDeclarationSequence | ExternDataDeclaration
    | ExternFunctionDeclaration
    | ExternClassDeclaration | ExternClassMethodDeclaration
    ;
