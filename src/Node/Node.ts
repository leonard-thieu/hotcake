export abstract class Node {
    parent: Node | undefined;

    toJSON(): any {
        const obj: any = {
            type: this.constructor.name,
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
