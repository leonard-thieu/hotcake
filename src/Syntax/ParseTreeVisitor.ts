import { assertNever } from '../assertNever';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ErrorableToken } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class ParseTreeVisitor {
    // #region Nodes

    getNodeFullStart(node: Nodes) {
        const firstToken = this.getNodeFirstToken(node);

        return firstToken.fullStart;
    }

    getNodeEnd(node: Nodes) {
        const lastToken = this.getNodeLastToken(node);

        return lastToken.end;
    }

    private getNodeFirstToken(node: Nodes) {
        return this.getChildTokens(node).next().value;
    }

    private getNodeLastToken(node: Nodes) {
        let lastToken: ErrorableToken;

        for (const token of this.getChildTokens(node)) {
            lastToken = token;
        }

        return lastToken!;
    }

    getNodeAt(node: Nodes, offset: number) {
        while (true) {
            const childNode = this.getChildNodeAt(node, offset);
            if (!childNode) {
                break;
            }

            node = childNode;
        }

        return node;
    }

    getChildNodeAt(node: Nodes, offset: number) {
        for (const child of this.getChildNodes(node)) {
            const childFullStart = this.getNodeFullStart(child);
            const childEnd = this.getNodeEnd(child);
            if (childFullStart <= offset && offset < childEnd) {
                return child;
            }
        }
    }

    * getChildNodes(node: Nodes): IterableIterator<Nodes> {
        switch (node.kind) {
            case NodeKind.PreprocessorModuleDeclaration: {
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.IfDirective: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                for (const elseIfDirective of node.elseIfDirectives) {
                    yield elseIfDirective;
                }
                if (node.elseDirective) {
                    yield node.elseDirective;
                }
                break;
            }
            case NodeKind.ElseIfDirective: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.ElseDirective: {
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.RemDirective: {
                for (const child of node.children) {
                    if (isNode(child)) {
                        yield child;
                    }
                }
                break;
            }
            case NodeKind.PrintDirective: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.ErrorDirective: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.AssignmentDirective: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.ModuleDeclaration: {
                if (node.strictDirective) {
                    yield node.strictDirective;
                }
                for (const headerMember of node.headerMembers) {
                    if (isNode(headerMember)) {
                        yield headerMember;
                    }
                }
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.ExternDataDeclarationSequence: {
                for (const child of node.children) {
                    yield child;
                }
                break;
            }
            case NodeKind.ExternDataDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.type) {
                    yield node.type;
                }
                break;
            }
            case NodeKind.ExternFunctionDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.returnType) {
                    yield node.returnType;
                }
                yield node.parameters;
                break;
            }
            case NodeKind.ExternClassDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.baseType) {
                    if (isNode(node.baseType)) {
                        yield node.baseType;
                    }
                }
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.ExternClassMethodDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.returnType) {
                    yield node.returnType;
                }
                yield node.parameters;
                break;
            }
            case NodeKind.ImportStatement: {
                if (isNode(node.path)) {
                    yield node.path;
                }
                break;
            }
            case NodeKind.FriendDirective: {
                yield node.modulePath;
                break;
            }
            case NodeKind.AliasDirectiveSequence: {
                for (const child of node.children) {
                    yield child;
                }
                break;
            }
            case NodeKind.AliasDirective: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.typeIdentifier) {
                    if (isNode(node.typeIdentifier)) {
                        yield node.typeIdentifier;
                    }
                }
                if (isNode(node.target)) {
                    yield node.target;
                }
                break;
            }
            case NodeKind.DataDeclarationSequence: {
                for (const child of node.children) {
                    yield child;
                }
                break;
            }
            case NodeKind.DataDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.type) {
                    yield node.type;
                }
                if (node.expression) {
                    if (isNode(node.expression)) {
                        yield node.expression;
                    }
                }
                break;
            }
            case NodeKind.FunctionDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.returnType) {
                    yield node.returnType;
                }
                yield node.parameters;
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.InterfaceDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.baseTypes) {
                    for (const baseType of node.baseTypes) {
                        yield baseType;
                    }
                }
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.InterfaceMethodDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.returnType) {
                    yield node.returnType;
                }
                yield node.parameters;
                break;
            }
            case NodeKind.ClassDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.typeParameters) {
                    for (const typeParameter of node.typeParameters) {
                        yield typeParameter;
                    }
                }
                if (node.baseType) {
                    if (isNode(node.baseType)) {
                        yield node.baseType;
                    }
                }
                if (node.implementedTypes) {
                    for (const implementedType of node.implementedTypes) {
                        yield implementedType;
                    }
                }
                for (const member of node.members) {
                    if (isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.ClassMethodDeclaration: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.returnType) {
                    yield node.returnType;
                }
                yield node.parameters;
                if (node.statements) {
                    for (const statement of node.statements) {
                        if (isNode(statement)) {
                            yield statement;
                        }
                    }
                }
                break;
            }
            case NodeKind.DataDeclarationSequenceStatement: {
                yield node.dataDeclarationSequence;
                break;
            }
            case NodeKind.ReturnStatement: {
                if (node.expression) {
                    if (isNode(node.expression)) {
                        yield node.expression;
                    }
                }
                break;
            }
            case NodeKind.IfStatement: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                if (node.elseIfClauses) {
                    for (const elseIfClause of node.elseIfClauses) {
                        yield elseIfClause;
                    }
                }
                if (node.elseClause) {
                    yield node.elseClause;
                }
                break;
            }
            case NodeKind.ElseIfClause: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.ElseClause: {
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.SelectStatement: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                for (const caseClause of node.caseClauses) {
                    yield caseClause;
                }
                if (node.defaultClause) {
                    yield node.defaultClause;
                }
                break;
            }
            case NodeKind.CaseClause: {
                for (const expression of node.expressions) {
                    if (isNode(expression)) {
                        yield expression;
                    }
                }
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.DefaultClause: {
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.WhileLoop: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.RepeatLoop: {
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                if (node.untilExpression) {
                    if (isNode(node.untilExpression)) {
                        yield node.untilExpression;
                    }
                }
                break;
            }
            case NodeKind.ForLoop: {
                if (isNode(node.header)) {
                    yield node.header;
                }
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.NumericForLoopHeader: {
                yield node.loopVariableExpression;
                if (isNode(node.lastValueExpression)) {
                    yield node.lastValueExpression;
                }
                if (node.stepValueExpression) {
                    if (isNode(node.stepValueExpression)) {
                        yield node.stepValueExpression;
                    }
                }
                break;
            }
            case NodeKind.ThrowStatement: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.TryStatement: {
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                for (const catchClause of node.catchClauses) {
                    yield catchClause;
                }
                break;
            }
            case NodeKind.CatchClause: {
                if (isNode(node.parameter)) {
                    yield node.parameter;
                }
                for (const statement of node.statements) {
                    if (isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.ExpressionStatement: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.NewExpression: {
                if (isNode(node.type)) {
                    yield node.type;
                }
                break;
            }
            case NodeKind.StringLiteralExpression: {
                for (const child of node.children) {
                    if (isNode(child)) {
                        yield child;
                    }
                }
                break;
            }
            case NodeKind.ArrayLiteralExpression: {
                for (const expression of node.expressions) {
                    if (isNode(expression)) {
                        yield expression;
                    }
                }
                break;
            }
            case NodeKind.IdentifierExpression: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.typeArguments) {
                    for (const typeArgument of node.typeArguments) {
                        yield typeArgument;
                    }
                }
                break;
            }
            case NodeKind.ScopeMemberAccessExpression: {
                yield node.scopableExpression;
                if (isNode(node.member)) {
                    yield node.member;
                }
                break;
            }
            case NodeKind.InvokeExpression: {
                yield node.invokableExpression;
                for (const argument of node.arguments) {
                    if (isNode(argument)) {
                        yield argument;
                    }
                }
                break;
            }
            case NodeKind.IndexExpression: {
                yield node.indexableExpression;
                if (isNode(node.indexExpressionExpression)) {
                    yield node.indexExpressionExpression;
                }
                break;
            }
            case NodeKind.SliceExpression: {
                yield node.sliceableExpression;
                if (node.startExpression) {
                    yield node.startExpression;
                }
                if (node.endExpression) {
                    yield node.endExpression;
                }
                break;
            }
            case NodeKind.GroupingExpression: {
                if (isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.UnaryExpression: {
                if (isNode(node.operand)) {
                    yield node.operand;
                }
                break;
            }
            case NodeKind.BinaryExpression: {
                if (isNode(node.leftOperand)) {
                    yield node.leftOperand;
                }
                if (isNode(node.rightOperand)) {
                    yield node.rightOperand;
                }
                break;
            }
            case NodeKind.AssignmentExpression: {
                if (isNode(node.leftOperand)) {
                    yield node.leftOperand;
                }
                if (isNode(node.rightOperand)) {
                    yield node.rightOperand;
                }
                break;
            }
            case NodeKind.ArrayTypeAnnotation: {
                if (node.expression) {
                    if (isNode(node.expression)) {
                        yield node.expression;
                    }
                }
                break;
            }
            case NodeKind.ShorthandTypeAnnotation: {
                for (const arrayTypeAnnotation of node.arrayTypeAnnotations) {
                    yield arrayTypeAnnotation;
                }
                break;
            }
            case NodeKind.LonghandTypeAnnotation: {
                if (isNode(node.typeReference)) {
                    yield node.typeReference;
                }
                break;
            }
            case NodeKind.TypeReference: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.typeArguments) {
                    for (const typeArgument of node.typeArguments) {
                        yield typeArgument;
                    }
                }
                for (const arrayTypeAnnotation of node.arrayTypeAnnotations) {
                    yield arrayTypeAnnotation;
                }
                break;
            }
            case NodeKind.TypeParameter: {
                if (isNode(node.identifier)) {
                    yield node.identifier;
                }
                break;
            }
            case NodeKind.StrictDirective:
            case NodeKind.AccessibilityDirective:
            case NodeKind.ContinueStatement:
            case NodeKind.ExitStatement:
            case NodeKind.EmptyStatement:
            case NodeKind.ConfigurationTag:
            case NodeKind.NullExpression:
            case NodeKind.BooleanLiteralExpression:
            case NodeKind.SelfExpression:
            case NodeKind.SuperExpression:
            case NodeKind.IntegerLiteralExpression:
            case NodeKind.FloatLiteralExpression:
            case NodeKind.GlobalScopeExpression:
            case NodeKind.ModulePath:
            case NodeKind.EscapedIdentifier:
            case NodeKind.CommaSeparator: {
                // Only has tokens
                break;
            }
            default: {
                assertNever(node);
                break;
            }
        }
    }

    // #endregion

    // #region Tokens

    getChildTokenAt(node: Nodes, offset: number) {
        for (const child of this.getChildTokens(node)) {
            if (child.fullStart <= offset && offset < child.end) {
                return child;
            }
        }
    }

    * getChildTokens(node: Nodes): IterableIterator<ErrorableToken> {
        switch (node.kind) {
            case NodeKind.PreprocessorModuleDeclaration: {
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                yield node.eofToken;
                break;
            }
            case NodeKind.IfDirective: {
                yield node.numberSign;
                yield node.ifDirectiveKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                yield node.endDirectiveNumberSign;
                yield node.endDirectiveKeyword;
                if (node.endIfDirectiveKeyword) {
                    yield node.endIfDirectiveKeyword;
                }
                break;
            }
            case NodeKind.ElseIfDirective: {
                yield node.numberSign;
                yield node.elseIfDirectiveKeyword;
                if (node.ifDirectiveKeyword) {
                    yield node.ifDirectiveKeyword;
                }
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.ElseDirective: {
                yield node.numberSign;
                yield node.elseDirectiveKeyword;
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                break;
            }
            case NodeKind.RemDirective: {
                yield node.numberSign;
                yield node.remDirectiveKeyword;
                for (const child of node.children) {
                    if (!isNode(child)) {
                        yield child;
                    }
                }
                yield node.endDirectiveNumberSign;
                yield node.endDirectiveKeyword;
                if (node.endIfDirectiveKeyword) {
                    yield node.endIfDirectiveKeyword;
                }
                break;
            }
            case NodeKind.PrintDirective: {
                yield node.numberSign;
                yield node.printDirectiveKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.ErrorDirective: {
                yield node.numberSign;
                yield node.errorDirectiveKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.AssignmentDirective: {
                yield node.numberSign;
                yield node.name;
                yield node.operator;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                break;
            }
            case NodeKind.ModuleDeclaration: {
                for (const strictNewline of node.strictNewlines) {
                    yield strictNewline;
                }
                for (const headerMember of node.headerMembers) {
                    if (!isNode(headerMember)) {
                        yield headerMember;
                    }
                }
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                yield node.eofToken;
                break;
            }
            case NodeKind.ExternDataDeclarationSequence: {
                yield node.dataDeclarationKeyword;
                break;
            }
            case NodeKind.ExternDataDeclaration: {
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.equalsSign) {
                    yield node.equalsSign;
                }
                if (node.nativeSymbol) {
                    if (!isNode(node.nativeSymbol)) {
                        yield node.nativeSymbol;
                    }
                }
                break;
            }
            case NodeKind.ExternFunctionDeclaration: {
                yield node.functionKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                yield node.openingParenthesis;
                yield node.closingParenthesis;
                if (node.equalsSign) {
                    yield node.equalsSign;
                }
                if (node.nativeSymbol) {
                    if (!isNode(node.nativeSymbol)) {
                        yield node.nativeSymbol;
                    }
                }
                break;
            }
            case NodeKind.ExternClassDeclaration: {
                yield node.classKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.extendsKeyword) {
                    yield node.extendsKeyword;
                }
                if (node.baseType) {
                    if (!isNode(node.baseType)) {
                        yield node.baseType;
                    }
                }
                if (node.attribute) {
                    yield node.attribute;
                }
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                yield node.endKeyword;
                if (node.endClassKeyword) {
                    yield node.endClassKeyword;
                }
                if (node.equalsSign) {
                    yield node.equalsSign;
                }
                if (node.nativeSymbol) {
                    if (!isNode(node.nativeSymbol)) {
                        yield node.nativeSymbol;
                    }
                }
                break;
            }
            case NodeKind.ExternClassMethodDeclaration: {
                yield node.methodKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                yield node.openingParenthesis;
                yield node.closingParenthesis;
                for (const attribute of node.attributes) {
                    yield attribute;
                }
                if (node.equalsSign) {
                    yield node.equalsSign;
                }
                if (node.nativeSymbol) {
                    if (!isNode(node.nativeSymbol)) {
                        yield node.nativeSymbol;
                    }
                }
                break;
            }
            case NodeKind.StrictDirective: {
                yield node.strictKeyword;
                break;
            }
            case NodeKind.ImportStatement: {
                yield node.importKeyword;
                if (!isNode(node.path)) {
                    yield node.path;
                }
                break;
            }
            case NodeKind.FriendDirective: {
                yield node.friendKeyword;
                break;
            }
            case NodeKind.AccessibilityDirective: {
                yield node.accessibilityKeyword;
                if (node.externPrivateKeyword) {
                    yield node.externPrivateKeyword;
                }
                break;
            }
            case NodeKind.AliasDirectiveSequence: {
                yield node.aliasKeyword;
                break;
            }
            case NodeKind.AliasDirective: {
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                yield node.equalsSign;
                if (node.moduleIdentifier) {
                    yield node.moduleIdentifier;
                }
                if (node.moduleScopeMemberAccessOperator) {
                    yield node.moduleScopeMemberAccessOperator;
                }
                if (node.typeIdentifier) {
                    if (!isNode(node.typeIdentifier)) {
                        yield node.typeIdentifier;
                    }
                }
                if (node.typeScopeMemberAccessOperator) {
                    yield node.typeScopeMemberAccessOperator;
                }
                if (!isNode(node.target)) {
                    yield node.target;
                }
                break;
            }
            case NodeKind.DataDeclarationSequence: {
                if (node.dataDeclarationKeyword) {
                    yield node.dataDeclarationKeyword;
                }
                break;
            }
            case NodeKind.DataDeclaration: {
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.equalsSign) {
                    yield node.equalsSign;
                }
                if (node.eachInKeyword) {
                    yield node.eachInKeyword;
                }
                if (node.expression) {
                    if (!isNode(node.expression)) {
                        yield node.expression;
                    }
                }
                break;
            }
            case NodeKind.FunctionDeclaration: {
                yield node.functionKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                yield node.openingParenthesis;
                yield node.closingParenthesis;
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                yield node.endKeyword;
                if (node.endFunctionKeyword) {
                    yield node.endFunctionKeyword;
                }
                break;
            }
            case NodeKind.InterfaceDeclaration: {
                yield node.interfaceKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.extendsKeyword) {
                    yield node.extendsKeyword;
                }
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                yield node.endKeyword;
                if (node.endInterfaceKeyword) {
                    yield node.endInterfaceKeyword;
                }
                break;
            }
            case NodeKind.InterfaceMethodDeclaration: {
                yield node.methodKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                yield node.openingParenthesis;
                yield node.closingParenthesis;
                break;
            }
            case NodeKind.ClassDeclaration: {
                yield node.classKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.lessThanSign) {
                    yield node.lessThanSign;
                }
                if (node.greaterThanSign) {
                    yield node.greaterThanSign;
                }
                if (node.extendsKeyword) {
                    yield node.extendsKeyword;
                }
                if (node.baseType) {
                    if (!isNode(node.baseType)) {
                        yield node.baseType;
                    }
                }
                if (node.implementsKeyword) {
                    yield node.implementsKeyword;
                }
                if (node.attribute) {
                    yield node.attribute;
                }
                for (const member of node.members) {
                    if (!isNode(member)) {
                        yield member;
                    }
                }
                yield node.endKeyword;
                if (node.endClassKeyword) {
                    yield node.endClassKeyword;
                }
                break;
            }
            case NodeKind.ClassMethodDeclaration: {
                yield node.methodKeyword;
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                yield node.openingParenthesis;
                yield node.closingParenthesis;
                for (const attribute of node.attributes) {
                    yield attribute;
                }
                if (node.statements) {
                    for (const statement of node.statements) {
                        if (!isNode(statement)) {
                            yield statement;
                        }
                    }
                }
                if (node.endKeyword) {
                    yield node.endKeyword;
                }
                if (node.endMethodKeyword) {
                    yield node.endMethodKeyword;
                }
                break;
            }
            case NodeKind.DataDeclarationSequenceStatement: {
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.ReturnStatement: {
                yield node.returnKeyword;
                if (node.expression) {
                    if (!isNode(node.expression)) {
                        yield node.expression;
                    }
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.IfStatement: {
                yield node.ifKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                if (node.thenKeyword) {
                    yield node.thenKeyword;
                }
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                if (node.endKeyword) {
                    yield node.endKeyword;
                }
                if (node.endIfKeyword) {
                    yield node.endIfKeyword;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.ElseIfClause: {
                yield node.elseIfKeyword;
                if (node.ifKeyword) {
                    yield node.ifKeyword;
                }
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                if (node.thenKeyword) {
                    yield node.thenKeyword;
                }
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.ElseClause: {
                yield node.elseKeyword;
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.SelectStatement: {
                yield node.selectKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                for (const newline of node.newlines) {
                    yield newline;
                }
                yield node.endKeyword;
                if (node.endSelectKeyword) {
                    yield node.endSelectKeyword;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.CaseClause: {
                yield node.caseKeyword;
                for (const expression of node.expressions) {
                    if (!isNode(expression)) {
                        yield expression;
                    }
                }
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.DefaultClause: {
                yield node.defaultKeyword;
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.WhileLoop: {
                yield node.whileKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                yield node.endKeyword;
                if (node.endWhileKeyword) {
                    yield node.endWhileKeyword;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.RepeatLoop: {
                yield node.repeatKeyword;
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                yield node.foreverOrUntilKeyword;
                if (node.untilExpression) {
                    if (!isNode(node.untilExpression)) {
                        yield node.untilExpression;
                    }
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.ForLoop: {
                yield node.forKeyword;
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                yield node.endKeyword;
                if (node.endForKeyword) {
                    yield node.endForKeyword;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.NumericForLoopHeader: {
                yield node.toOrUntilKeyword;
                if (!isNode(node.lastValueExpression)) {
                    yield node.lastValueExpression;
                }
                if (node.stepKeyword) {
                    yield node.stepKeyword;
                }
                if (node.stepValueExpression) {
                    if (!isNode(node.stepValueExpression)) {
                        yield node.stepValueExpression;
                    }
                }
                break;
            }
            case NodeKind.ContinueStatement: {
                yield node.continueKeyword;
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.ExitStatement: {
                yield node.exitKeyword;
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.ThrowStatement: {
                yield node.throwKeyword;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.TryStatement: {
                yield node.tryKeyword;
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                yield node.endKeyword;
                if (node.endTryKeyword) {
                    yield node.endTryKeyword;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.CatchClause: {
                yield node.catchKeyword;
                if (!isNode(node.parameter)) {
                    yield node.parameter;
                }
                for (const statement of node.statements) {
                    if (!isNode(statement)) {
                        yield statement;
                    }
                }
                break;
            }
            case NodeKind.ExpressionStatement: {
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.EmptyStatement: {
                if (node.terminator) {
                    yield node.terminator;
                }
                break;
            }
            case NodeKind.NewExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.newKeyword;
                if (!isNode(node.type)) {
                    yield node.type;
                }
                break;
            }
            case NodeKind.NullExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.nullKeyword;
                break;
            }
            case NodeKind.BooleanLiteralExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.value;
                break;
            }
            case NodeKind.SelfExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.selfKeyword;
                break;
            }
            case NodeKind.SuperExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.superKeyword;
                break;
            }
            case NodeKind.IntegerLiteralExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.value;
                break;
            }
            case NodeKind.FloatLiteralExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.value;
                break;
            }
            case NodeKind.StringLiteralExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.startQuotationMark;
                for (const child of node.children) {
                    if (!isNode(child)) {
                        yield child;
                    }
                }
                yield node.endQuotationMark;
                break;
            }
            case NodeKind.ConfigurationTag: {
                yield node.startToken;
                if (node.name) {
                    yield node.name;
                }
                yield node.endToken;
                break;
            }
            case NodeKind.ArrayLiteralExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.openingSquareBracket;
                for (const leadingNewline of node.leadingNewlines) {
                    yield leadingNewline;
                }
                yield node.closingSquareBracket;
                break;
            }
            case NodeKind.IdentifierExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                if (node.lessThanSign) {
                    yield node.lessThanSign;
                }
                if (node.greaterThanSign) {
                    yield node.greaterThanSign;
                }
                break;
            }
            case NodeKind.ScopeMemberAccessExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.scopeMemberAccessOperator;
                if (!isNode(node.member)) {
                    yield node.member;
                }
                break;
            }
            case NodeKind.InvokeExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                if (node.openingParenthesis) {
                    yield node.openingParenthesis;
                }
                if (node.leadingNewlines) {
                    for (const leadingNewline of node.leadingNewlines) {
                        yield leadingNewline;
                    }
                }
                for (const argument of node.arguments) {
                    if (!isNode(argument)) {
                        yield argument;
                    }
                }
                if (node.closingParenthesis) {
                    yield node.closingParenthesis;
                }
                break;
            }
            case NodeKind.IndexExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.openingSquareBracket;
                if (!isNode(node.indexExpressionExpression)) {
                    yield node.indexExpressionExpression;
                }
                yield node.closingSquareBracket;
                break;
            }
            case NodeKind.SliceExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.openingSquareBracket;
                yield node.sliceOperator;
                yield node.closingSquareBracket;
                break;
            }
            case NodeKind.GroupingExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.openingParenthesis;
                if (!isNode(node.expression)) {
                    yield node.expression;
                }
                yield node.closingParenthesis;
                break;
            }
            case NodeKind.UnaryExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                yield node.operator;
                if (!isNode(node.operand)) {
                    yield node.operand;
                }
                break;
            }
            case NodeKind.BinaryExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                if (!isNode(node.leftOperand)) {
                    yield node.leftOperand;
                }
                yield node.operator;
                if (!isNode(node.rightOperand)) {
                    yield node.rightOperand;
                }
                break;
            }
            case NodeKind.AssignmentExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                if (!isNode(node.leftOperand)) {
                    yield node.leftOperand;
                }
                yield node.operator;
                if (node.eachInKeyword) {
                    yield node.eachInKeyword;
                }
                if (!isNode(node.rightOperand)) {
                    yield node.rightOperand;
                }
                break;
            }
            case NodeKind.GlobalScopeExpression: {
                if (node.newlines) {
                    for (const newline of node.newlines) {
                        yield newline;
                    }
                }
                break;
            }
            case NodeKind.ModulePath: {
                for (const child of node.children) {
                    yield child;
                }
                if (!isNode(node.moduleIdentifier)) {
                    yield node.moduleIdentifier;
                }
                break;
            }
            case NodeKind.ArrayTypeAnnotation: {
                yield node.openingSquareBracket;
                if (node.expression) {
                    if (!isNode(node.expression)) {
                        yield node.expression;
                    }
                }
                yield node.closingSquareBracket;
                break;
            }
            case NodeKind.ShorthandTypeAnnotation: {
                if (node.shorthandType) {
                    yield node.shorthandType;
                }
                break;
            }
            case NodeKind.LonghandTypeAnnotation: {
                yield node.colon;
                if (!isNode(node.typeReference)) {
                    yield node.typeReference;
                }
                break;
            }
            case NodeKind.TypeReference: {
                if (node.moduleIdentifier) {
                    yield node.moduleIdentifier;
                }
                if (node.scopeMemberAccessOperator) {
                    yield node.scopeMemberAccessOperator;
                }
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                if (node.lessThanSign) {
                    yield node.lessThanSign;
                }
                if (node.greaterThanSign) {
                    yield node.greaterThanSign;
                }
                break;
            }
            case NodeKind.TypeParameter: {
                if (!isNode(node.identifier)) {
                    yield node.identifier;
                }
                break;
            }
            case NodeKind.EscapedIdentifier: {
                yield node.commercialAt;
                if (!isNode(node.name)) {
                    yield node.name;
                }
                break;
            }
            case NodeKind.CommaSeparator: {
                yield node.separator;
                for (const newline of node.newlines) {
                    yield newline;
                }
                break;
            }
            default: {
                assertNever(node);
                break;
            }
        }
    }

    // #endregion
}

function isNode(nodeOrToken: Nodes | ErrorableToken): nodeOrToken is Nodes {
    switch (nodeOrToken.kind) {
        case NodeKind.PreprocessorModuleDeclaration:
        case NodeKind.IfDirective:
        case NodeKind.ElseIfDirective:
        case NodeKind.ElseDirective:
        case NodeKind.RemDirective:
        case NodeKind.PrintDirective:
        case NodeKind.ErrorDirective:
        case NodeKind.AssignmentDirective:
        case NodeKind.ModuleDeclaration:
        case NodeKind.ExternDataDeclarationSequence:
        case NodeKind.ExternDataDeclaration:
        case NodeKind.ExternFunctionDeclaration:
        case NodeKind.ExternClassDeclaration:
        case NodeKind.ExternClassMethodDeclaration:
        case NodeKind.StrictDirective:
        case NodeKind.ImportStatement:
        case NodeKind.FriendDirective:
        case NodeKind.AccessibilityDirective:
        case NodeKind.AliasDirectiveSequence:
        case NodeKind.AliasDirective:
        case NodeKind.DataDeclarationSequence:
        case NodeKind.DataDeclaration:
        case NodeKind.FunctionDeclaration:
        case NodeKind.InterfaceDeclaration:
        case NodeKind.InterfaceMethodDeclaration:
        case NodeKind.ClassDeclaration:
        case NodeKind.ClassMethodDeclaration:
        case NodeKind.DataDeclarationSequenceStatement:
        case NodeKind.ReturnStatement:
        case NodeKind.IfStatement:
        case NodeKind.ElseIfClause:
        case NodeKind.ElseClause:
        case NodeKind.SelectStatement:
        case NodeKind.CaseClause:
        case NodeKind.DefaultClause:
        case NodeKind.WhileLoop:
        case NodeKind.RepeatLoop:
        case NodeKind.ForLoop:
        case NodeKind.NumericForLoopHeader:
        case NodeKind.ContinueStatement:
        case NodeKind.ExitStatement:
        case NodeKind.ThrowStatement:
        case NodeKind.TryStatement:
        case NodeKind.CatchClause:
        case NodeKind.ExpressionStatement:
        case NodeKind.EmptyStatement:
        case NodeKind.NewExpression:
        case NodeKind.NullExpression:
        case NodeKind.BooleanLiteralExpression:
        case NodeKind.SelfExpression:
        case NodeKind.SuperExpression:
        case NodeKind.IntegerLiteralExpression:
        case NodeKind.FloatLiteralExpression:
        case NodeKind.StringLiteralExpression:
        case NodeKind.ConfigurationTag:
        case NodeKind.ArrayLiteralExpression:
        case NodeKind.IdentifierExpression:
        case NodeKind.ScopeMemberAccessExpression:
        case NodeKind.InvokeExpression:
        case NodeKind.IndexExpression:
        case NodeKind.SliceExpression:
        case NodeKind.GroupingExpression:
        case NodeKind.UnaryExpression:
        case NodeKind.BinaryExpression:
        case NodeKind.AssignmentExpression:
        case NodeKind.GlobalScopeExpression:
        case NodeKind.ModulePath:
        case NodeKind.ArrayTypeAnnotation:
        case NodeKind.ShorthandTypeAnnotation:
        case NodeKind.LonghandTypeAnnotation:
        case NodeKind.TypeReference:
        case NodeKind.TypeParameter:
        case NodeKind.EscapedIdentifier:
        case NodeKind.CommaSeparator: {
            return true;
        }

        case TokenKind.Unknown:
        case TokenKind.EOF:
        case TokenKind.Newline:
        case TokenKind.IntegerLiteral:
        case TokenKind.FloatLiteral:
        case TokenKind.StringLiteralText:
        case TokenKind.EscapeNull:
        case TokenKind.EscapeCharacterTabulation:
        case TokenKind.EscapeLineFeedLf:
        case TokenKind.EscapeCarriageReturnCr:
        case TokenKind.EscapeQuotationMark:
        case TokenKind.EscapeTilde:
        case TokenKind.EscapeUnicodeHexValue:
        case TokenKind.InvalidEscapeSequence:
        case TokenKind.ConfigurationTagStart:
        case TokenKind.ConfigurationTagEnd:
        case TokenKind.IfDirectiveKeyword:
        case TokenKind.ElseIfDirectiveKeyword:
        case TokenKind.ElseDirectiveKeyword:
        case TokenKind.EndDirectiveKeyword:
        case TokenKind.RemDirectiveKeyword:
        case TokenKind.RemDirectiveBody:
        case TokenKind.PrintDirectiveKeyword:
        case TokenKind.ErrorDirectiveKeyword:
        case TokenKind.ConfigurationVariable:
        case TokenKind.QuotationMark:
        case TokenKind.NumberSign:
        case TokenKind.DollarSign:
        case TokenKind.PercentSign:
        case TokenKind.Ampersand:
        case TokenKind.OpeningParenthesis:
        case TokenKind.ClosingParenthesis:
        case TokenKind.Asterisk:
        case TokenKind.PlusSign:
        case TokenKind.Comma:
        case TokenKind.HyphenMinus:
        case TokenKind.Period:
        case TokenKind.Slash:
        case TokenKind.Colon:
        case TokenKind.Semicolon:
        case TokenKind.LessThanSign:
        case TokenKind.EqualsSign:
        case TokenKind.GreaterThanSign:
        case TokenKind.QuestionMark:
        case TokenKind.CommercialAt:
        case TokenKind.OpeningSquareBracket:
        case TokenKind.ClosingSquareBracket:
        case TokenKind.VerticalBar:
        case TokenKind.Tilde:
        case TokenKind.PeriodPeriod:
        case TokenKind.AmpersandEqualsSign:
        case TokenKind.AsteriskEqualsSign:
        case TokenKind.PlusSignEqualsSign:
        case TokenKind.HyphenMinusEqualsSign:
        case TokenKind.SlashEqualsSign:
        case TokenKind.ColonEqualsSign:
        case TokenKind.LessThanSignEqualsSign:
        case TokenKind.GreaterThanSignEqualsSign:
        case TokenKind.VerticalBarEqualsSign:
        case TokenKind.TildeEqualsSign:
        case TokenKind.ShlKeywordEqualsSign:
        case TokenKind.ShrKeywordEqualsSign:
        case TokenKind.ModKeywordEqualsSign:
        case TokenKind.LessThanSignGreaterThanSign:
        case TokenKind.Identifier:
        case TokenKind.VoidKeyword:
        case TokenKind.StrictKeyword:
        case TokenKind.PublicKeyword:
        case TokenKind.PrivateKeyword:
        case TokenKind.ProtectedKeyword:
        case TokenKind.FriendKeyword:
        case TokenKind.PropertyKeyword:
        case TokenKind.BoolKeyword:
        case TokenKind.IntKeyword:
        case TokenKind.FloatKeyword:
        case TokenKind.StringKeyword:
        case TokenKind.ArrayKeyword:
        case TokenKind.ObjectKeyword:
        case TokenKind.ModKeyword:
        case TokenKind.ContinueKeyword:
        case TokenKind.ExitKeyword:
        case TokenKind.IncludeKeyword:
        case TokenKind.ImportKeyword:
        case TokenKind.ModuleKeyword:
        case TokenKind.ExternKeyword:
        case TokenKind.NewKeyword:
        case TokenKind.SelfKeyword:
        case TokenKind.SuperKeyword:
        case TokenKind.EachInKeyword:
        case TokenKind.TrueKeyword:
        case TokenKind.FalseKeyword:
        case TokenKind.NullKeyword:
        case TokenKind.NotKeyword:
        case TokenKind.ExtendsKeyword:
        case TokenKind.AbstractKeyword:
        case TokenKind.FinalKeyword:
        case TokenKind.SelectKeyword:
        case TokenKind.CaseKeyword:
        case TokenKind.DefaultKeyword:
        case TokenKind.ConstKeyword:
        case TokenKind.LocalKeyword:
        case TokenKind.GlobalKeyword:
        case TokenKind.FieldKeyword:
        case TokenKind.MethodKeyword:
        case TokenKind.FunctionKeyword:
        case TokenKind.ClassKeyword:
        case TokenKind.AndKeyword:
        case TokenKind.OrKeyword:
        case TokenKind.ShlKeyword:
        case TokenKind.ShrKeyword:
        case TokenKind.EndKeyword:
        case TokenKind.IfKeyword:
        case TokenKind.ThenKeyword:
        case TokenKind.ElseKeyword:
        case TokenKind.ElseIfKeyword:
        case TokenKind.EndIfKeyword:
        case TokenKind.WhileKeyword:
        case TokenKind.WendKeyword:
        case TokenKind.RepeatKeyword:
        case TokenKind.UntilKeyword:
        case TokenKind.ForeverKeyword:
        case TokenKind.ForKeyword:
        case TokenKind.ToKeyword:
        case TokenKind.StepKeyword:
        case TokenKind.NextKeyword:
        case TokenKind.ReturnKeyword:
        case TokenKind.InterfaceKeyword:
        case TokenKind.ImplementsKeyword:
        case TokenKind.InlineKeyword:
        case TokenKind.AliasKeyword:
        case TokenKind.TryKeyword:
        case TokenKind.CatchKeyword:
        case TokenKind.ThrowKeyword:
        case TokenKind.ThrowableKeyword:
        case TokenKind.Missing:
        case TokenKind.Skipped: {
            return false;
        }

        default: {
            return assertNever(nodeOrToken);
        }
    }
}
