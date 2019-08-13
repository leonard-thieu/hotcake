import { DiagnosticBag } from '../../../Diagnostics';
import { SkippedToken } from '../../Token/SkippedToken';
import { EOFToken, NewlineToken } from '../../Token/Tokens';
import { NodeKind } from '../Nodes';
import { AccessibilityDirective } from './AccessibilityDirective';
import { AliasDirectiveSequence } from './AliasDirectiveSequence';
import { ClassDeclaration } from './ClassDeclaration';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declarations';
import { ExternClassDeclaration } from './ExternClassDeclaration';
import { ExternDataDeclarationSequence } from './ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternFunctionDeclaration';
import { FriendDirective } from './FriendDirective';
import { FunctionDeclaration } from './FunctionDeclaration';
import { ImportStatement } from './ImportStatement';
import { InterfaceDeclaration } from './InterfaceDeclaration';
import { PreprocessorModuleDeclaration } from './PreprocessorModuleDeclaration';
import { StrictDirective } from './StrictDirective';

export const ModuleDeclarationChildNames: ReadonlyArray<keyof ModuleDeclaration> = [
    'strictNewlines',
    'strictDirective',
    'headerMembers',
    'members',
    'eofToken',
];

export class ModuleDeclaration extends Declaration {
    preprocessorModuleDeclaration: PreprocessorModuleDeclaration = undefined!;

    get filePath(): string {
        return this.preprocessorModuleDeclaration.filePath;
    }

    get document(): string {
        return this.preprocessorModuleDeclaration.document;
    }

    readonly kind = NodeKind.ModuleDeclaration;

    strictNewlines: NewlineToken[] = undefined!;
    strictDirective?: StrictDirective = undefined;
    headerMembers: ModuleDeclarationHeaderMember[] = undefined!;
    members: ModuleDeclarationMember[] = undefined!;
    eofToken: EOFToken = undefined!;

    readonly parseDiagnostics = new DiagnosticBag();
}

export type ModuleDeclarationHeaderMember =
    | ImportStatement
    | AccessibilityDirective
    | FriendDirective
    | AliasDirectiveSequence
    | NewlineToken
    | SkippedToken
    ;

export type ModuleDeclarationMember =
    | AccessibilityDirective
    | ExternDataDeclarationSequence
    | ExternFunctionDeclaration
    | ExternClassDeclaration
    | DataDeclarationSequence
    | FunctionDeclaration
    | InterfaceDeclaration
    | ClassDeclaration
    | NewlineToken
    | SkippedToken
    ;