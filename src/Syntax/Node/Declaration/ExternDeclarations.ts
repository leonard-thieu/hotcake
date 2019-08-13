import { EqualsSignToken } from '../../Token/Tokens';
import { MissableStringLiteralExpression } from '../Expression/StringLiteralExpression';
import { Declaration } from './Declarations';
import { ExternClassDeclaration, ExternClassMethodDeclaration } from './ExternClassDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationSequence } from './ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

export abstract class ExternDeclaration extends Declaration {
    equalsSign?: EqualsSignToken = undefined;
    nativeSymbol?: MissableStringLiteralExpression = undefined;
}

export type ExternDeclarations =
    | ExternDataDeclarationSequence | ExternDataDeclaration
    | ExternFunctionDeclaration
    | ExternClassDeclaration | ExternClassMethodDeclaration
    ;
