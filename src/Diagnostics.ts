import { Binder } from './Binding/Binder';
import { BoundIdentifiableDeclaration } from './Binding/BoundSymbol';
import { BoundNodeKind, BoundNodes } from './Binding/Node/BoundNodes';
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
    return function (_target: Binder, _propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (
            this: Binder,
            parent_node: BoundNodes | BoundIdentifiableDeclaration,
            node_name?: BoundIdentifiableDeclaration | string,
            ...args: any[]
        ) {
            let name: string
            if (typeof node_name === 'string') {
                name = node_name;
            } else {
                if (node_name &&
                    node_name.identifier
                ) {
                    name = node_name.identifier.name;
                } else {
                    name = (parent_node as BoundIdentifiableDeclaration).identifier.name;
                }
            }

            this.project.diagnostics.traceInstantiatingStart(kind, name);
            const retVal = method.call(this, parent_node, node_name, ...args);
            this.project.diagnostics.traceInstantiatingEnd();

            return retVal;
        };
    };
}
