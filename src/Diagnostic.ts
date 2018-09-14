import { DiagnosticKinds } from './DiagnosticKind';

export class Diagnostic {
    constructor(
        public readonly kind: DiagnosticKinds,
        public readonly message: string,
        public readonly start: number,
        public readonly length: number,
    ) { }
}
