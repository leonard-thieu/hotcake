import { EqualsSignToken } from '../../../Token/Token';
import { MissableStringLiteral } from '../../Expression/StringLiteral';
import { Declaration } from '../Declaration';
import { ExternClassDeclaration } from './ExternClassDeclaration';
import { ExternClassMethodDeclaration } from './ExternClassMethodDeclaration';
import { ExternDataDeclaration } from './ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';

export abstract class ExternDeclaration extends Declaration {
    equalsSign: EqualsSignToken | null = null;
    nativeSymbol: MissableStringLiteral | null = null;
}

export type ExternDeclarations =
    ExternClassDeclaration |
    ExternClassMethodDeclaration |
    ExternFunctionDeclaration |
    ExternDataDeclaration
    ;
