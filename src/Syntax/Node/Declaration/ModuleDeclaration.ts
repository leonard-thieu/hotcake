import { DiagnosticBag } from '../../../Diagnostics';
import { SkippedToken } from '../../Token/SkippedToken';
import { EOFToken, NewlineToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { AccessibilityDirective } from './AccessibilityDirective';
import { AliasDirectiveSequence } from './AliasDirectiveSequence';
import { ClassDeclaration } from './ClassDeclaration';
import { DataDeclarationSequence } from './DataDeclarationSequence';
import { Declaration } from './Declaration';
import { ExternClassDeclaration } from './ExternDeclaration/ExternClassDeclaration';
import { ExternDataDeclarationSequence } from './ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './ExternDeclaration/ExternFunctionDeclaration';
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
    | FriendDirective
    | AliasDirectiveSequence
    | AccessibilityDirective
    | NewlineToken
    | SkippedToken
    ;

export type ModuleDeclarationMember =
    | AccessibilityDirective
    | DataDeclarationSequence
    | ExternDataDeclarationSequence
    | FunctionDeclaration
    | ExternFunctionDeclaration
    | InterfaceDeclaration
    | ClassDeclaration
    | ExternClassDeclaration
    | NewlineToken
    | SkippedToken
    ;