import { EOFToken, Tokens } from '../../Token/Token';
import { AssignmentDirective } from '../Directive/AssignmentDirective';
import { ErrorDirective } from '../Directive/ErrorDirective';
import { IfDirective } from '../Directive/IfDirective';
import { PrintDirective } from '../Directive/PrintDirective';
import { RemDirective } from '../Directive/RemDirective';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export const PreprocessorModuleDeclarationChildNames: ReadonlyArray<keyof PreprocessorModuleDeclaration> = [
    'members',
    'eofToken',
];

export class PreprocessorModuleDeclaration extends Declaration {
    filePath: string = undefined!;
    document: string = undefined!;

    readonly kind = NodeKind.PreprocessorModuleDeclaration;

    members: PreprocessorModuleDeclarationMember[] = undefined!;
    eofToken: EOFToken = undefined!;
}

export type PreprocessorModuleDeclarationMember =
    | AssignmentDirective
    | ErrorDirective
    | IfDirective
    | PrintDirective
    | RemDirective
    | Tokens
    ;
