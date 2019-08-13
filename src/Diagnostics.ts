import { Binder } from './Binding/Binder';
import { BoundNodeKind, BoundNodes } from './Binding/Node/BoundNodes';
import { BoundDeclarations, BoundTypeReferenceDeclaration } from './Binding/Node/Declaration/BoundDeclarations';
import { MissableIdentifier } from './Syntax/Node/Identifier';
import { Nodes } from './Syntax/Node/Nodes';
import { NewKeywordToken } from './Syntax/Token/Tokens';
import { getText } from './util';

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
        const diagnostic = new Diagnostic(
            DiagnosticKind.Trace,
            this.tab.repeat(this.tabLevel) + message,
            /*start*/ 0,
            /*length*/ 0,
        );
        this.add(diagnostic);
    }

    traceBindingStart(kind: BoundNodeKind, name: string) {
        this.trace(`- BIND ${kind} (${name})`);
        this.tabLevel++;
    }

    traceBindingEnd() {
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

export function traceBinding(kind: BoundNodeKind) {
    return function (_target: Binder, _propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        type IdentifiableNode = Extract<
            Nodes,
            {
                identifier: MissableIdentifier | NewKeywordToken;
            }
        >;
        descriptor.value = function (this: Binder, parent: BoundNodes, node: string | IdentifiableNode, ...args: any[]) {
            let name: string
            if (typeof node === 'string') {
                name = node;
            } else {
                name = getText(node.identifier, parent);
            }

            this.project.diagnostics.traceBindingStart(kind, name);
            const retVal = method.call(this, parent, node, ...args);
            this.project.diagnostics.traceBindingEnd();

            return retVal;
        };
    };
}

export function traceInstantiating(kind: BoundNodeKind) {
    return function (_target: Binder, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (
            this: Binder,
            arg1: BoundNodes | BoundDeclarations | BoundTypeReferenceDeclaration,
            arg2?: BoundDeclarations | string,
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
                name = (arg1 as BoundDeclarations).identifier.name;
            }

            this.project.diagnostics.traceInstantiatingStart(kind, name);
            const retVal = method.call(this, arg1, arg2, ...args);
            this.project.diagnostics.traceInstantiatingEnd();

            return retVal;
        };
    };
}
