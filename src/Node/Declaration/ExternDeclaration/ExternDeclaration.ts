import { EqualsSignToken } from '../../../Token/Token';
import { MissableStringLiteralExpression } from '../../Expression/StringLiteralExpression';
import { Declaration } from '../Declaration';
import { ExternClassDeclaration } from './ExternClassDeclaration';
import { ExternClassMethodDeclaration } from './ExternClassMethodDeclaration';
import { ExternDataDeclaration } from './ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

export abstract class ExternDeclaration extends Declaration {
    equalsSign?: EqualsSignToken = undefined;
    nativeSymbol?: MissableStringLiteralExpression = undefined;
}

export type ExternDeclarations =
    ExternClassDeclaration |
    ExternClassMethodDeclaration |
    ExternFunctionDeclaration |
    ExternDataDeclaration
    ;
