import { assertNever } from "./assertNever";
import { DataDeclaration } from "./Node/DataDeclaration";
import { DataDeclarationList } from "./Node/DataDeclarationList";
import { Expression } from "./Node/Expression/Expression";
import { Module } from "./Node/Module";
import { ModulePath } from "./Node/ModulePath";
import { Node } from "./Node/Node";
import { QualifiedIdentifier } from "./Node/QualifiedIdentifier";
import { AccessibilityDirective } from "./Node/Statement/AccessibilityDirective";
import { AliasDirective } from "./Node/Statement/AliasDirective";
import { ClassDeclaration } from "./Node/Statement/ClassDeclaration";
import { ClassMethodDeclaration } from "./Node/Statement/ClassMethodDeclaration";
import { FriendDirective } from "./Node/Statement/FriendDirective";
import { FunctionDeclaration } from "./Node/Statement/FunctionDeclaration";
import { ImportStatement } from "./Node/Statement/ImportStatement";
import { InterfaceDeclaration } from "./Node/Statement/InterfaceDeclaration";
import { InterfaceMethodDeclaration } from "./Node/Statement/InterfaceMethodDeclaration";
import { StrictDirective } from "./Node/Statement/StrictDirective";
import { ParseContext } from "./ParseContext";
import { ParserBase } from "./ParserBase";
import { SkippedToken } from "./SkippedToken";
import { Token } from "./Token";
import { TokenKind } from "./TokenKind";

export class Parser extends ParserBase {
    parse(filePath: string, document: string, tokens: Token[]): Module {
        this.tokens = [...tokens];
        this.position = 0;

        return this.parseModule(filePath, document);
    }

    private parseModule(filePath: string, document: string): Module {
        const module = new Module();
        module.filePath = filePath;
        module.document = document;

        module.members = this.parseList(module, ParseContext.ModuleMembers);

        return module;
    }

    // #region Core

    private currentParseContext: ParseContext;

    private parseList(parent: Node, parseContext: ParseContext): Array<Expression | Token> {
        const savedParseContext = this.currentParseContext;
        this.currentParseContext |= parseContext;

        const parseListElementFn = this.getParseListElementFn(parseContext);

        const nodes: Array<Expression | Token> = [];
        while (true) {
            const token = this.getToken();
            
            if (this.isListTerminator(token, parseContext)) {
                break;
            }
            
            if (this.isValidListElement(token, parseContext)) {
                const element = parseListElementFn(parent);
                nodes.push(element);

                continue;
            }

            if (this.isValidInEnclosingContexts(token)) {
                break;
            }

            const skippedToken = new SkippedToken(token);
            nodes.push(skippedToken);
            this.advanceToken();
        }

        this.currentParseContext = savedParseContext;

        return nodes;
    }

    private isListTerminator(token: Token, parseContext: ParseContext): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case ParseContext.ModuleMembers: {
                return false;
            }
            case ParseContext.InterfaceMembers:
            case ParseContext.ClassMembers:
            case ParseContext.BlockStatements: {
                return token.kind === TokenKind.EndKeyword;
            }
            case ParseContext.DataDeclarationListMembers: {
                return token.kind !== TokenKind.Identifier &&
                    token.kind !== TokenKind.Comma;
            }
        }

        return assertNever(parseContext);
    }

    private isValidListElement(token: Token, parseContext: ParseContext): boolean {
        switch (parseContext) {
            case ParseContext.ModuleMembers: {
                return this.isModuleMemberStart(token);
            }
            case ParseContext.InterfaceMembers: {
                return this.isInterfaceMemberStart(token);
            }
            case ParseContext.ClassMembers: {
                return this.isClassMemberStart(token);
            }
            case ParseContext.BlockStatements: {
                return this.isBlockStatementStart(token);
            }
            case ParseContext.DataDeclarationListMembers: {
                return this.isDataDeclarationStart(token);
            }
        }

        return assertNever(parseContext);
    }

    private isModuleMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.StrictKeyword:
            case TokenKind.ImportKeyword:
            case TokenKind.FriendKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword:
            case TokenKind.AliasKeyword:
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.InterfaceKeyword:
            case TokenKind.ClassKeyword: {
                return true;
            }
        }

        return false;
    }

    private isInterfaceMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.MethodKeyword: {
                return true;
            }
        }

        return false;
    }
    
    private isClassMemberStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.MethodKeyword: {
                return true;
            }
        }

        return false;
    }

    private isBlockStatementStart(token: Token): boolean {
        return false;
    }
    
    private isDataDeclarationStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private getParseListElementFn(parseContext: ParseContext): ParseListElementFn {
        switch (parseContext) {
            case ParseContext.ModuleMembers: {
                return this.parseModuleMember;
            }
            case ParseContext.InterfaceMembers: {
                return this.parseInterfaceMember;
            }
            case ParseContext.ClassMembers: {
                return this.parseClassMember;
            }
            case ParseContext.BlockStatements: {
                return () => { throw new Error(); };
            }
            case ParseContext.DataDeclarationListMembers: {
                return this.parseDataDeclarationListMember;
            }
        }

        return assertNever(parseContext);
    }

    private parseModuleMember = (parent: Node) => {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.StrictKeyword: {
                return this.parseStrictDirective(parent);
            }
            case TokenKind.ImportKeyword: {
                return this.parseImportStatement(parent);
            }
            case TokenKind.FriendKeyword: {
                return this.parseFriendDirective(parent);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword: {
                return this.parseAccessibilityDirective(parent);
            }
            case TokenKind.AliasKeyword: {
                return this.parseAliasDirective(parent);
            }
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword: {
                return this.parseDataDeclarationList(parent);
            }
            case TokenKind.FunctionKeyword: {
                return this.parseFunctionDeclaration(parent);
            }
            case TokenKind.InterfaceKeyword: {
                return this.parseInterfaceDeclaration(parent);
            }
            case TokenKind.ClassKeyword: {
                return this.parseClassDeclaration(parent);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseStrictDirective(parent: Node): StrictDirective {
        const strictDirective = new StrictDirective();
        strictDirective.parent = parent;
        strictDirective.strictKeyword = this.eat(TokenKind.StrictKeyword);

        return strictDirective;
    }

    private parseImportStatement(parent: Node): ImportStatement {
        const importStatement = new ImportStatement();
        importStatement.parent = parent;
        importStatement.importKeyword = this.eat(TokenKind.ImportKeyword);

        if (this.getToken().kind === TokenKind.QuotationMark) {
            importStatement.nativeFilePath = this.parseStringLiteral(importStatement);
        } else {
            importStatement.modulePath = this.parseModulePath(importStatement);
        }

        return importStatement;
    }

    private parseFriendDirective(parent: Node): FriendDirective {
        const friendDirective = new FriendDirective();
        friendDirective.parent = parent;
        friendDirective.friendKeyword = this.eat(TokenKind.FriendKeyword);
        friendDirective.modulePath = this.parseModulePath(friendDirective);

        return friendDirective;
    }

    private parseAccessibilityDirective(parent: Node): AccessibilityDirective {
        const accessibilityDirective = new AccessibilityDirective();
        accessibilityDirective.parent = parent;
        accessibilityDirective.accessibilityKeyword = this.eat(TokenKind.PrivateKeyword, TokenKind.PublicKeyword, TokenKind.ExternKeyword);

        if (accessibilityDirective.accessibilityKeyword.kind === TokenKind.ExternKeyword) {
            accessibilityDirective.externPrivateKeyword = this.eatOptional(TokenKind.PrivateKeyword);
        }

        return accessibilityDirective;
    }

    private parseAliasDirective(parent: Node): AliasDirective {
        /**
         * TODO: Comma separated aliases allowed?
         * TODO: Explicit data type declaration allowed?
         */

        const aliasDirective = new AliasDirective();
        aliasDirective.parent = parent;
        aliasDirective.aliasKeyword = this.eat(TokenKind.AliasKeyword);
        aliasDirective.name = this.eat(TokenKind.Identifier);
        aliasDirective.equalsSign = this.eat(TokenKind.EqualsSign);
        aliasDirective.target = this.parseQualifiedIdentifier(aliasDirective);

        return aliasDirective;
    }

    private parseFunctionDeclaration(parent: Node): FunctionDeclaration {
        const functionDeclaration = new FunctionDeclaration();
        functionDeclaration.parent = parent;
        functionDeclaration.functionKeyword = this.eat(TokenKind.FunctionKeyword);
        functionDeclaration.name = this.eat(TokenKind.Identifier);

        if (this.getToken().kind !== TokenKind.OpeningParenthesis) {
            functionDeclaration.colon = this.eatOptional(TokenKind.Colon);
            functionDeclaration.returnType = this.parseQualifiedIdentifier(functionDeclaration);   
        }

        functionDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        functionDeclaration.parameters = this.parseDataDeclarationList(functionDeclaration);        
        functionDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);
        functionDeclaration.statements = this.parseList(functionDeclaration, ParseContext.BlockStatements);
        functionDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        functionDeclaration.endFunctionKeyword = this.eatOptional(TokenKind.FunctionKeyword);

        return functionDeclaration;
    }

    private parseInterfaceDeclaration(parent: Node): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = this.eat(TokenKind.InterfaceKeyword);
        interfaceDeclaration.name = this.eat(TokenKind.Identifier);
        // TODO: Extends
        interfaceDeclaration.members = this.parseList(interfaceDeclaration, ParseContext.InterfaceMembers);
        interfaceDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        interfaceDeclaration.endInterfaceKeyword = this.eatOptional(TokenKind.InterfaceKeyword);

        return interfaceDeclaration;
    }

    private parseInterfaceMember = (parent: Node) => {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword: {
                return this.parseDataDeclarationList(parent);
            }
            case TokenKind.MethodKeyword: {
                return this.parseInterfaceMethod(parent);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseInterfaceMethod(parent: Node): InterfaceMethodDeclaration {
        const interfaceMethodDeclaration = new InterfaceMethodDeclaration();
        interfaceMethodDeclaration.parent = parent;
        interfaceMethodDeclaration.methodKeyword = this.eat(TokenKind.MethodKeyword);
        interfaceMethodDeclaration.name = this.eat(TokenKind.Identifier);

        if (this.getToken().kind !== TokenKind.OpeningParenthesis) {
            interfaceMethodDeclaration.colon = this.eatOptional(TokenKind.Colon);
            interfaceMethodDeclaration.returnType = this.parseQualifiedIdentifier(interfaceMethodDeclaration);
        }

        interfaceMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        interfaceMethodDeclaration.parameters = this.parseDataDeclarationList(interfaceMethodDeclaration);        
        interfaceMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return interfaceMethodDeclaration;
    }

    private parseClassDeclaration(parent: Node): ClassDeclaration {
        const classDeclaration = new ClassDeclaration();
        classDeclaration.parent = parent;
        classDeclaration.classKeyword = this.eat(TokenKind.ClassKeyword);
        // TODO: Generic parameters
        // TODO: Extends
        // TODO: Implements
        classDeclaration.members = this.parseList(classDeclaration, ParseContext.ClassMembers);
        classDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        classDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);

        return classDeclaration;
    }

    private parseClassMember = (parent: Node) => {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                return this.parseDataDeclarationList(parent);
            }
            case TokenKind.FunctionKeyword: {
                return this.parseFunctionDeclaration(parent);
            }
            case TokenKind.MethodKeyword: {
                return this.parseClassMethodDeclaration(parent);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseClassMethodDeclaration(parent: Node): ClassMethodDeclaration {
        const classMethodDeclaration = new ClassMethodDeclaration();
        classMethodDeclaration.parent = parent;
        classMethodDeclaration.methodKeyword = this.eat(TokenKind.MethodKeyword);
        classMethodDeclaration.name = this.eat(TokenKind.Identifier);

        if (this.getToken().kind !== TokenKind.OpeningParenthesis) {
            classMethodDeclaration.colon = this.eatOptional(TokenKind.Colon);
            classMethodDeclaration.returnType = this.parseQualifiedIdentifier(classMethodDeclaration);   
        }

        classMethodDeclaration.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        classMethodDeclaration.parameters = this.parseDataDeclarationList(classMethodDeclaration);        
        classMethodDeclaration.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);
        classMethodDeclaration.statements = this.parseList(classMethodDeclaration, ParseContext.BlockStatements);
        classMethodDeclaration.endKeyword = this.eat(TokenKind.EndKeyword);
        classMethodDeclaration.endMethodKeyword = this.eatOptional(TokenKind.MethodKeyword);

        return classMethodDeclaration;
    }

    private parseModulePath(parent: Node): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;

        let lastTokenKind: TokenKind | undefined;
        while (true) {
            const token = this.getToken();
            if (token.kind === TokenKind.Identifier) {
                if (lastTokenKind !== undefined &&
                    lastTokenKind !== TokenKind.Period) {
                    console.error(`Did not expect ${JSON.stringify(token.kind)} to follow ${JSON.stringify(lastTokenKind)}`);
                    break;
                }

                modulePath.children.push(token);
                this.advanceToken();
            } else if (token.kind === TokenKind.Period) {
                if (lastTokenKind !== undefined &&
                    lastTokenKind !== TokenKind.Identifier) {
                    console.error(`Did not expect ${JSON.stringify(token.kind)} to follow ${JSON.stringify(lastTokenKind)}`);
                    break;
                }

                modulePath.children.push(token);
                this.advanceToken();
            } else {
                break;
            }
        }
        
        return modulePath;
    }

    private parseDataDeclarationList(parent: Node): DataDeclarationList {
        const dataDeclarationList = new DataDeclarationList();
        dataDeclarationList.parent = parent;
        dataDeclarationList.dataDeclarationKeyword = this.eatOptional(TokenKind.ConstKeyword, TokenKind.GlobalKeyword, TokenKind.FieldKeyword, TokenKind.LocalKeyword);
        dataDeclarationList.children = this.parseList(dataDeclarationList, ParseContext.DataDeclarationListMembers) as typeof dataDeclarationList.children;

        // HACK: parseList eats the closing parenthesis as a SkippedToken. Pop it off and rewind.
        const lastChild = dataDeclarationList.children[dataDeclarationList.children.length - 1];
        if (lastChild && lastChild.kind === TokenKind.ClosingParenthesis) {
            dataDeclarationList.children.pop();
            this.position--;
        }

        return dataDeclarationList;
    }

    private parseDataDeclarationListMember = (parent: Node) => {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                return this.parseDataDeclaration(parent);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return token;
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    private parseDataDeclaration(parent: Node): DataDeclaration {
        const dataDeclaration = new DataDeclaration();
        dataDeclaration.parent = parent;
        dataDeclaration.name = this.eat(TokenKind.Identifier);

        dataDeclaration.colonEqualsSign = this.eatOptional(TokenKind.ColonEqualsSign);

        if (dataDeclaration.colonEqualsSign === null) {
            dataDeclaration.colon = this.eatOptional(TokenKind.Colon);

            if (dataDeclaration.colon !== null) {
                dataDeclaration.longhandType = this.parseQualifiedIdentifier(dataDeclaration);
            } else {
                dataDeclaration.shorthandType = this.eatOptional(TokenKind.DollarSign, TokenKind.QuestionMark, TokenKind.NumberSign, TokenKind.PercentSign);
            }

            dataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        }

        dataDeclaration.expression = this.parseExpression(dataDeclaration);

        return dataDeclaration;
    }

    private parseQualifiedIdentifier(parent: Node): QualifiedIdentifier {
        const qualifiedIdentifier = new QualifiedIdentifier();
        qualifiedIdentifier.parent = parent;
        qualifiedIdentifier.modulePath = this.parseModulePath(qualifiedIdentifier);
        
        const modulePathChildren = qualifiedIdentifier.modulePath.children;
        if (modulePathChildren.length > 0) {
            qualifiedIdentifier.identifier = modulePathChildren.pop()!;
            qualifiedIdentifier.scopeMemberAccessOperator = modulePathChildren.pop() || null;
        } else {
            const token = this.getToken();
            switch (token.kind) {
                case TokenKind.StringKeyword:
                case TokenKind.BoolKeyword:
                case TokenKind.FloatKeyword:
                case TokenKind.IntKeyword:
                case TokenKind.ObjectKeyword:
                case TokenKind.ThrowableKeyword:
                case TokenKind.VoidKeyword: {
                    qualifiedIdentifier.identifier = token;
                    this.advanceToken();
                    break;
                }            
                default: {
                    qualifiedIdentifier.identifier = new SkippedToken(token);
                    break;
                }
            }
        }

        return qualifiedIdentifier;
    }

    private isValidInEnclosingContexts(token: Token): boolean {
        for (let i = 0; i < 32; i++) {
            const parseContext = 1 << i;
            if (this.isInParseContext(parseContext)) {
                if (this.isValidListElement(token, parseContext) ||
                    this.isListTerminator(token, parseContext)) {
                    return true;
                }
            }
        }

        return false;
    }

    private isInParseContext(parseContext: number): boolean {
        return (this.currentParseContext & parseContext) === 1;
    }

    // #endregion
}

type ParseListElementFn = (parent: Node) => Node | Token;
