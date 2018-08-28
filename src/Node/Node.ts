import { NodeKind } from "./NodeKind";

export abstract class Node {
    abstract readonly kind: NodeKind;
    parent: Node | null = null;

    toJSON(): any {
        const obj: any = {
            kind: NodeKind[this.kind],
        };

        for (const childName of this.getChildNames()) {
            obj[childName] = this[childName];
        }

        return obj;
    }

    private getChildNames<K extends keyof this>(): K[] {
        const ctor = this.constructor as any;

        return ctor.CHILD_NAMES || [];
    }
}
