import { Binder } from './Binding/Binder';
import { BoundIdentifiableDeclaration } from './Binding/BoundSymbol';
import { BoundNodeKind, BoundNodes } from './Binding/Node/BoundNodes';
import { BoundTypeReferenceDeclaration } from './Binding/Node/Declaration/BoundDeclarations';
import { MissableIdentifier } from './Syntax/Node/Identifier';
import { Nodes } from './Syntax/Node/Nodes';
import { NewKeywordToken } from './Syntax/Token/Tokens';

export class Diagnostic {
    constructor(
        readonly kind: DiagnosticKind,
        readonly message: string,
        readonly start: number,
        readonly length: number,
    ) { }
}

export enum DiagnosticKind {
    Error = 'Error',
    Trace = 'Trace',
}

export class DiagnosticBag extends Set<Diagnostic> {
    private tabLevel = 0;
    private readonly tab = '  ';

    trace(message: string): void {
        const diagnostic = new Diagnostic(DiagnosticKind.Trace, this.tab.repeat(this.tabLevel) + message, /*start*/ 0, /*length*/ 0);
        this.add(diagnostic);
    }

    traceBindingPhase1Start(kind: BoundNodeKind, name: string) {
        this.trace(`- BIND1 ${kind} (${name})`);
        this.tabLevel++;
    }

    traceBindingPhase1End() {
        this.trace(`complete: true`);
        this.tabLevel--;
    }

    traceBindingPhase2Start(kind: BoundNodeKind, name: string) {
        this.trace(`- BIND2 ${kind} (${name})`);
        this.tabLevel++;
    }

    traceBindingPhase2End() {
        this.trace(`complete: true`);
        this.tabLevel--;
    }

    traceInstantiatingStart(kind: BoundNodeKind, name: string) {
        this.trace(`- INST ${kind} (${name})`);
        this.tabLevel++;
    }

    traceInstantiatingEnd() {
        this.trace(`complete: true`);
        this.tabLevel--;
    }
}

export function traceBindingPhase1(kind: BoundNodeKind) {
    return function (_target: Binder, _propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        type IdentifiableNode = Extract<
            Nodes,
            {
                identifier: MissableIdentifier | NewKeywordToken;
            }
        >;
        descriptor.value = function (this: Binder, parent: BoundNodes, node: IdentifiableNode | string, ...args: any[]) {
            let name: string
            if (typeof node === 'string') {
                name = node;
            } else {
                name = this.getIdentifierText(node.identifier);
            }

            this.project.diagnostics.traceBindingPhase1Start(kind, name);
            const retVal = method.call(this, parent, node, ...args);
            this.project.diagnostics.traceBindingPhase1End();

            return retVal;
        };
    };
}

export function traceBindingPhase2(kind: BoundNodeKind) {
    return function (_target: Binder, _propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        type IdentifiableNode = Extract<
            Nodes,
            {
                identifier: MissableIdentifier | NewKeywordToken;
            }
        >;
        descriptor.value = function (this: Binder, parent: BoundNodes, node: IdentifiableNode | string, ...args: any[]) {
            let name: string
            if (typeof node === 'string') {
                name = node;
            } else if (typeof node === 'function' || !node) {
                name = (parent as BoundIdentifiableDeclaration).identifier.name;
            } else {
                name = this.getIdentifierText(node.identifier);
            }

            this.project.diagnostics.traceBindingPhase2Start(kind, name);
            const retVal = method.call(this, parent, node, ...args);
            this.project.diagnostics.traceBindingPhase2End();

            return retVal;
        };
    };
}

export function traceInstantiating(kind: BoundNodeKind) {
    return function (_target: Binder, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (
            this: Binder,
            arg1: BoundNodes | BoundIdentifiableDeclaration | BoundTypeReferenceDeclaration,
            arg2?: BoundIdentifiableDeclaration | string,
            ...args: any[]
        ) {
            let name: string
            if (propertyKey === 'instantiateArrayType') {
                const elementType = arg1 as BoundTypeReferenceDeclaration;
                name = elementType.identifier.name + '[]';
            } else if (typeof arg2 === 'string') {
                name = arg2;
            } else if (
                arg2 &&
                arg2.identifier
            ) {
                name = arg2.identifier.name;
            } else {
                name = (arg1 as BoundIdentifiableDeclaration).identifier.name;
            }

            this.project.diagnostics.traceInstantiatingStart(kind, name);
            const retVal = method.call(this, arg1, arg2, ...args);
            this.project.diagnostics.traceInstantiatingEnd();

            return retVal;
        };
    };
}
