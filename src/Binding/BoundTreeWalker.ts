import { areElementsSame } from '../util';
import { BoundNodeKind, BoundNodeKindToBoundNodeMap, BoundNodes } from './Node/BoundNodes';
import { BoundClassDeclaration } from './Node/Declaration/BoundClassDeclaration';
import { BoundExternClassDeclaration } from './Node/Declaration/BoundExternClassDeclaration';
import { BoundMethodGroupDeclaration } from './Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration } from './Node/Declaration/BoundInterfaceDeclaration';
import { BoundModuleDeclaration } from './Node/Declaration/BoundModuleDeclaration';
import { Types } from './Type/Types';

export namespace BoundTreeWalker {
    export function getClosest<TKind extends BoundNodeKind>(
        node: BoundNodes,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] | undefined {
        let closest: BoundNodes | undefined = node;

        do {
            if (!kinds.length) {
                return closest;
            }

            for (const kind of kinds) {
                if (closest.kind === kind) {
                    return closest;
                }
            }

            closest = closest.parent;
        } while (closest);
    }

    export function getModule(node: BoundNodes): BoundModuleDeclaration {
        return getClosest(node, BoundNodeKind.ModuleDeclaration)!;
    }

    export function getImportedModules(boundModule: BoundModuleDeclaration) {
        function getImportedModulesImpl(boundModule: BoundModuleDeclaration) {
            importedModules.add(boundModule);

            for (const importedModule of boundModule.importedModules) {
                if (!importedModules.has(importedModule)) {
                    getImportedModulesImpl(importedModule);
                }
            }
        }

        const importedModules = new Set<BoundModuleDeclaration>();

        getImportedModulesImpl(boundModule);
        importedModules.delete(boundModule);

        return importedModules;
    }

    export function getMethod(
        methodContainer: BoundMethodContainerDeclaration,
        name: string,
        checkReturnType: (returnType: Types) => boolean = () => true,
        ...parameters: Types[]
    ) {
        const methodGroup = methodContainer.locals.get(name);
        if (methodGroup) {
            switch (methodGroup.kind) {
                case BoundNodeKind.ExternClassMethodGroupDeclaration:
                case BoundNodeKind.InterfaceMethodGroupDeclaration:
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    return getOverload(methodGroup.overloads, checkReturnType, parameters);
                }
            }
        }
    }

    type BoundMethodContainerDeclaration =
        | BoundExternClassDeclaration
        | BoundInterfaceDeclaration
        | BoundClassDeclaration
        ;

    function getOverload(
        overloads: BoundMethodGroupDeclaration['overloads'],
        checkReturnType: (returnType: Types) => boolean,
        parameters: Types[],
    ) {
        for (const [, overload] of overloads) {
            if (checkReturnType(overload.returnType.type)) {
                if (areElementsSame(overload.parameters, parameters,
                    (overloadParameter, parameter) => overloadParameter.type === parameter
                )) {
                    return overload;
                }
            }
        }
    }
}
