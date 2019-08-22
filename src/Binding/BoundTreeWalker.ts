import { areElementsSame, assertNever } from '../util';
import { BoundNodeKind, BoundNodeKindToBoundNodeMap, BoundNodes } from './Node/BoundNodes';
import { BoundMethodContainerDeclaration } from './Node/Declaration/BoundDeclarations';
import { BoundModuleDeclaration } from './Node/Declaration/BoundModuleDeclaration';
import { BoundIdentifierExpression } from './Node/Expression/BoundIdentifierExpression';
import { BoundMethodDeclaration } from './Type/FunctionLikeType';
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

    export function getImportedModules(boundModule: BoundModuleDeclaration): Set<BoundModuleDeclaration> {
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

    export function getSpecialMethod(
        methodContainer: BoundMethodContainerDeclaration,
        name: string,
        checkReturnType: (returnType: Types) => boolean = () => true,
        ...parameters: Types[]
    ): BoundMethodDeclaration | undefined {
        const methodGroup = methodContainer.locals.get(name,
            BoundNodeKind.ExternClassMethodGroupDeclaration,
            BoundNodeKind.InterfaceMethodGroupDeclaration,
            BoundNodeKind.ClassMethodGroupDeclaration,
        );
        if (methodGroup) {
            for (const [, overload] of methodGroup.overloads) {
                if (checkReturnType(overload.returnType.type)) {
                    if (areElementsSame(overload.parameters, parameters,
                        (overloadParameter, parameter) => overloadParameter.type === parameter
                    )) {
                        return overload;
                    }
                }
            }
        } else {
            switch (methodContainer.kind) {
                case BoundNodeKind.ExternClassDeclaration:
                case BoundNodeKind.ClassDeclaration: {
                    if (methodContainer.superType) {
                        return getSpecialMethod(methodContainer.superType, name, checkReturnType, ...parameters);
                    }
                    break;
                }
                case BoundNodeKind.InterfaceDeclaration: {
                    if (methodContainer.implementedTypes) {
                        for (const implementedType of methodContainer.implementedTypes) {
                            const overload = getSpecialMethod(implementedType, name, checkReturnType, ...parameters);
                            if (overload) {
                                return overload;
                            }
                        }
                    }
                    break;
                }
                default: { return assertNever(methodContainer); }
            }
        }
    }

    export function isInvoked(identifierExpression: BoundIdentifierExpression): boolean {
        let { parent } = identifierExpression;

        while (parent) {
            switch (parent.kind) {
                case BoundNodeKind.ScopeMemberAccessExpression:
                case BoundNodeKind.IndexExpression:
                case BoundNodeKind.SliceExpression: {
                    parent = parent.parent;
                    break;
                }
                case BoundNodeKind.InvokeExpression: { return !parent.invocableExpression; }
                default: { return false; }
            }
        }

        return false;
    }
}
