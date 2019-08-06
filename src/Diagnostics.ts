import { BoundNodeKind } from './Binding/Node/BoundNodeKind';

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

    traceBindingStart(kind: BoundNodeKind, name: string) {
        this.trace(`- BIND ${kind} (${name})`);
        this.tabLevel++;
    }

    traceBindingEnd() {
        this.trace(`complete: true`);
        this.tabLevel--;
    }

    traceInstantiateStart(kind: BoundNodeKind, name: string) {
        this.trace(`- INST ${kind} (${name})`);
        this.tabLevel++;
    }

    traceInstantiateEnd() {
        this.trace(`complete: true`);
        this.tabLevel--;
    }

}
