import { EqualsSignToken } from '../../../Token/Tokens';
import { MissableStringLiteralExpression } from '../../Expression/StringLiteralExpression';
import { Declaration } from '../Declarations';
import { ExternClassDeclaration, ExternClassMethodDeclaration } from './ExternClassDeclaration';
import { ExternDataDeclaration } from './ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

export abstract class ExternDeclaration extends Declaration {
    equalsSign?: EqualsSignToken = undefined;
    nativeSymbol?: MissableStringLiteralExpression = undefined;
}

export type ExternDeclarations =
    | ExternClassDeclaration
    | ExternClassMethodDeclaration
    | ExternFunctionDeclaration
    | ExternDataDeclaration
    ;
