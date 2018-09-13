import { AccessibilityDirective, AccessibilityKeywordToken } from './Node/Declaration/AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence, MissableDeclarationReferenceIdentifier } from './Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from './Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from './Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence, MissableDataDeclaration } from './Node/Declaration/DataDeclarationSequence';
import { ExternClassDeclaration } from './Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternClassMethodDeclaration } from './Node/Declaration/ExternDeclaration/ExternClassMethodDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationKeywordToken, ExternDataDeclarationSequence } from './Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FriendDirective } from './Node/Declaration/FriendDirective';
import { FunctionDeclaration } from './Node/Declaration/FunctionDeclaration';
import { ImportStatement } from './Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from './Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from './Node/Declaration/ModuleDeclaration';
import { StrictDirective } from './Node/Declaration/StrictDirective';
import { LonghandTypeDeclaration, ShorthandTypeDeclaration, ShorthandTypeToken } from './Node/Declaration/TypeDeclaration';
import { TypeParameter } from './Node/Declaration/TypeParameter';
import { Expressions, MissableExpression } from './Node/Expression/Expression';
import { IdentifierStartToken } from './Node/Identifier';
import { ModulePath } from './Node/ModulePath';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ContinueStatement } from './Node/Statement/ContinueStatement';
import { DataDeclarationSequenceStatement } from './Node/Statement/DataDeclarationSequenceStatement';
import { EmptyStatement } from './Node/Statement/EmptyStatement';
import { ExitStatement } from './Node/Statement/ExitStatement';
import { ExpressionStatement } from './Node/Statement/ExpressionStatement';
import { ForLoop, NumericForLoopHeader } from './Node/Statement/ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from './Node/Statement/IfStatement';
import { RepeatLoop } from './Node/Statement/RepeatLoop';
import { ReturnStatement } from './Node/Statement/ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from './Node/Statement/SelectStatement';
import { Statement } from './Node/Statement/Statement';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchStatement, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { ParseContext, ParseContextElementMapBase, ParseContextKind, ParserBase } from './ParserBase';
import { MissingToken } from './Token/MissingToken';
import { AliasKeywordToken, CaseKeywordToken, CatchKeywordToken, ClassKeywordToken, ColonToken, ConstKeywordToken, ContinueKeywordToken, DefaultKeywordToken, ElseIfKeywordToken, ElseKeywordToken, ExitKeywordToken, ForKeywordToken, FriendKeywordToken, FunctionKeywordToken, IfKeywordToken, ImportKeywordToken, InterfaceKeywordToken, LocalKeywordToken, MethodKeywordToken, RepeatKeywordToken, ReturnKeywordToken, SelectKeywordToken, StrictKeywordToken, ThrowKeywordToken, Tokens, TryKeywordToken, WhileKeywordToken } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Parser extends ParserBase {
    private document: string = undefined!;
    private accessibility: AccessibilityKeywordToken['kind'] = undefined!;
    private moduleIdentifiers: string[] = undefined!;

    parse(filePath: string, document: string, tokens: Tokens[]): ModuleDeclaration {
        this.tokens = [...tokens];
        this.position = 0;
        this.parseContexts = [];
        this.document = document;
        this.accessibility = TokenKind.PublicKeyword;
        this.moduleIdentifiers = [];

        return this.parseModuleDeclaration(filePath, document);
    }

    private parseModuleDeclaration(filePath: string, document: string): ModuleDeclaration {
        const moduleDeclaration = new ModuleDeclaration();
        moduleDeclaration.filePath = filePath;
        moduleDeclaration.document = document;

        moduleDeclaration.members = this.parseList(moduleDeclaration.kind, moduleDeclaration);

        return moduleDeclaration;
    }

    // #region Module members

    private isModuleMembersListTerminator(): boolean {
        return false;
    }

    private isModuleMemberStart(token: Tokens): boolean {
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
            case TokenKind.ClassKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseModuleMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.StrictKeyword: {
                this.advanceToken();

                return this.parseStrictDirective(parent, token);
            }
            case TokenKind.ImportKeyword: {
                this.advanceToken();

                return this.parseImportStatement(parent, token);
            }
            case TokenKind.FriendKeyword: {
                this.advanceToken();

                return this.parseFriendDirective(parent, token);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ExternKeyword: {
                this.advanceToken();

                this.accessibility = token.kind;

                return this.parseAccessibilityDirective(parent, token);
            }
            case TokenKind.AliasKeyword: {
                this.advanceToken();

                return this.parseAliasDirectiveSequence(parent, token);
            }
            case TokenKind.ConstKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.GlobalKeyword: {
                this.advanceToken();

                if (this.accessibility === TokenKind.ExternKeyword) {
                    return this.parseExternDataDeclarationSequence(parent, token);
                }

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                if (this.accessibility === TokenKind.ExternKeyword) {
                    return this.parseExternFunctionDeclaration(parent, token);
                }

                return this.parseFunctionDeclaration(parent, token);
            }
            case TokenKind.InterfaceKeyword: {
                this.advanceToken();

                return this.parseInterfaceDeclaration(parent, token);
            }
            case TokenKind.ClassKeyword: {
                this.advanceToken();

                if (this.accessibility === TokenKind.ExternKeyword) {
                    return this.parseExternClassDeclaration(parent, token);
                }

                return this.parseClassDeclaration(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    private parseExternDataDeclarationSequence(parent: Nodes, dataDeclarationKeyword: ExternDataDeclarationKeywordToken): ExternDataDeclarationSequence {
        const externDataDeclarationSequence = new ExternDataDeclarationSequence();
        externDataDeclarationSequence.parent = parent;
        externDataDeclarationSequence.dataDeclarationKeyword = dataDeclarationKeyword;
        externDataDeclarationSequence.children = this.parseList(externDataDeclarationSequence.kind, externDataDeclarationSequence, TokenKind.Comma);

        return externDataDeclarationSequence;
    }

    private parseExternFunctionDeclaration(parent: Nodes, functionKeyword: FunctionKeywordToken): ExternFunctionDeclaration {
        const externFunctionDeclaration = new ExternFunctionDeclaration();
        externFunctionDeclaration.parent = parent;
        externFunctionDeclaration.functionKeyword = functionKeyword;
        externFunctionDeclaration.identifier = this.parseMissableIdentifier(externFunctionDeclaration)
        externFunctionDeclaration.returnType = this.parseTypeDeclaration(externFunctionDeclaration);
        externFunctionDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        externFunctionDeclaration.parameters = this.parseList(ParseContextKind.DataDeclarationSequence, externFunctionDeclaration, TokenKind.Comma);
        externFunctionDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        externFunctionDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externFunctionDeclaration.equalsSign) {
            externFunctionDeclaration.nativeSymbol = this.parseMissableStringLiteral(externFunctionDeclaration);
        }

        return externFunctionDeclaration;
    }

    private parseExternClassDeclaration(parent: Nodes, classKeyword: ClassKeywordToken): ExternClassDeclaration {
        const externClassDeclaration = new ExternClassDeclaration();
        externClassDeclaration.parent = parent;
        externClassDeclaration.classKeyword = classKeyword;
        externClassDeclaration.identifier = this.parseMissableIdentifier(externClassDeclaration);

        externClassDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (externClassDeclaration.extendsKeyword) {
            externClassDeclaration.baseType = this.eatOptional(TokenKind.NullKeyword);
            if (!externClassDeclaration.baseType) {
                externClassDeclaration.baseType = this.parseMissableTypeReference(externClassDeclaration);
            }
        }

        externClassDeclaration.attribute = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword);
        externClassDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externClassDeclaration.equalsSign) {
            externClassDeclaration.nativeSymbol = this.parseMissableStringLiteral(externClassDeclaration);
        }
        externClassDeclaration.members = this.parseList(externClassDeclaration.kind, externClassDeclaration);
        externClassDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (externClassDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            externClassDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);
        }

        return externClassDeclaration;
    }

    private parseStrictDirective(parent: Nodes, strictKeyword: StrictKeywordToken): StrictDirective {
        const strictDirective = new StrictDirective();
        strictDirective.parent = parent;
        strictDirective.strictKeyword = strictKeyword;

        return strictDirective;
    }

    private parseImportStatement(parent: Nodes, importKeyword: ImportKeywordToken): ImportStatement {
        const importStatement = new ImportStatement();
        importStatement.parent = parent;
        importStatement.importKeyword = importKeyword;

        const token = this.getToken();
        switch (token.kind) {
            // Native file path
            case TokenKind.QuotationMark: {
                this.advanceToken();

                importStatement.path = this.parseStringLiteral(importStatement, token);
                break;
            }
            // Module path
            case TokenKind.Identifier: {
                importStatement.path = this.parseModulePath(importStatement);

                // Needed when parsing Alias directives.
                // Allows disambiguation between a module identifier and a type identifier.
                const moduleIdentifier = importStatement.path.children[importStatement.path.children.length - 1];
                if (moduleIdentifier.kind === TokenKind.Identifier) {
                    this.moduleIdentifiers.push(moduleIdentifier.getText(this.document));
                }
                break;
            }
            default: {
                importStatement.path = new MissingToken(token.fullStart, TokenKind.ImportStatementPath);
                break;
            }
        }

        return importStatement;
    }

    private parseFriendDirective(parent: Nodes, friendKeyword: FriendKeywordToken): FriendDirective {
        const friendDirective = new FriendDirective();
        friendDirective.parent = parent;
        friendDirective.friendKeyword = friendKeyword;
        friendDirective.modulePath = this.parseModulePath(friendDirective);

        return friendDirective;
    }

    // #region Module path

    private parseModulePath(parent: Nodes): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;
        modulePath.children = this.parseList(ParseContextKind.ModulePathSequence, modulePath, TokenKind.Period);

        return modulePath;
    }

    private isModulePathSequenceTerminator(token: Tokens): boolean {
        return !this.isModulePathSequenceMemberStart(token);
    }

    protected isModulePathSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Period: {
                return true;
            }
        }

        return false;
    }

    protected parseModulePathSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Period: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    private parseAliasDirectiveSequence(parent: Nodes, aliasKeyword: AliasKeywordToken): AliasDirectiveSequence {
        const aliasDirectiveSequence = new AliasDirectiveSequence();
        aliasDirectiveSequence.parent = parent;
        aliasDirectiveSequence.aliasKeyword = aliasKeyword;
        aliasDirectiveSequence.children = this.parseList(aliasDirectiveSequence.kind, aliasDirectiveSequence, TokenKind.Comma);

        return aliasDirectiveSequence;
    }

    private parseInterfaceDeclaration(parent: Nodes, interfaceKeyword: InterfaceKeywordToken): InterfaceDeclaration {
        const interfaceDeclaration = new InterfaceDeclaration();
        interfaceDeclaration.parent = parent;
        interfaceDeclaration.interfaceKeyword = interfaceKeyword;
        interfaceDeclaration.identifier = this.parseMissableIdentifier(interfaceDeclaration);
        interfaceDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (interfaceDeclaration.extendsKeyword) {
            interfaceDeclaration.baseTypes = this.parseList(ParseContextKind.TypeReferenceSequence, interfaceDeclaration, TokenKind.Comma);
        }
        interfaceDeclaration.members = this.parseList(interfaceDeclaration.kind, interfaceDeclaration);
        interfaceDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (interfaceDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            interfaceDeclaration.endInterfaceKeyword = this.eatOptional(TokenKind.InterfaceKeyword);
        }

        return interfaceDeclaration;
    }

    private parseClassDeclaration(parent: Nodes, classKeyword: ClassKeywordToken): ClassDeclaration {
        const classDeclaration = new ClassDeclaration();
        classDeclaration.parent = parent;
        classDeclaration.classKeyword = classKeyword;
        classDeclaration.identifier = this.parseMissableIdentifier(classDeclaration);

        classDeclaration.lessThanSign = this.eatOptional(TokenKind.LessThanSign);
        if (classDeclaration.lessThanSign) {
            classDeclaration.typeParameters = this.parseList(ParseContextKind.TypeParameterSequence, classDeclaration, TokenKind.Comma);
            classDeclaration.greaterThanSign = this.eatMissable(TokenKind.GreaterThanSign);
        }

        classDeclaration.extendsKeyword = this.eatOptional(TokenKind.ExtendsKeyword);
        if (classDeclaration.extendsKeyword) {
            classDeclaration.baseType = this.parseMissableTypeReference(classDeclaration);
        }

        classDeclaration.implementsKeyword = this.eatOptional(TokenKind.ImplementsKeyword);
        if (classDeclaration.implementsKeyword) {
            classDeclaration.implementedTypes = this.parseList(ParseContextKind.TypeReferenceSequence, classDeclaration, TokenKind.Comma);
        }

        classDeclaration.attribute = this.eatOptional(TokenKind.AbstractKeyword, TokenKind.FinalKeyword);
        classDeclaration.members = this.parseList(classDeclaration.kind, classDeclaration);
        classDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (classDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            classDeclaration.endClassKeyword = this.eatOptional(TokenKind.ClassKeyword);
        }

        return classDeclaration;
    }

    // #endregion

    // #region Extern data declaration sequence members

    private isExternDataDeclarationSequenceTerminator(token: Tokens): boolean {
        return !this.isExternDataDeclarationSequenceMemberStart(token);
    }

    private isExternDataDeclarationSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseExternDataDeclarationSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseExternDataDeclaration(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseExternDataDeclaration(parent: Nodes, identifierStart: IdentifierStartToken): ExternDataDeclaration {
        const externDataDeclaration = new ExternDataDeclaration();
        externDataDeclaration.parent = parent;
        externDataDeclaration.identifier = this.parseIdentifier(parent, identifierStart);
        externDataDeclaration.type = this.parseTypeDeclaration(externDataDeclaration);
        externDataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externDataDeclaration.equalsSign) {
            externDataDeclaration.nativeSymbol = this.parseMissableStringLiteral(externDataDeclaration);
        }

        return externDataDeclaration;
    }

    // #endregion

    // #region Extern Class declaration members

    private isExternClassDeclarationMembersListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    private isExternClassDeclarationMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseExternClassDeclarationMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                this.advanceToken();

                return this.parseAccessibilityDirective(parent, token);
            }
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                this.advanceToken();

                return this.parseExternDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                return this.parseExternFunctionDeclaration(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseExternClassMethodDeclaration(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    private parseExternClassMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): ExternClassMethodDeclaration {
        const externClassMethodDeclaration = new ExternClassMethodDeclaration();
        externClassMethodDeclaration.parent = parent;
        externClassMethodDeclaration.methodKeyword = methodKeyword;
        externClassMethodDeclaration.identifier = this.parseMissableIdentifier(externClassMethodDeclaration);
        externClassMethodDeclaration.returnType = this.parseTypeDeclaration(externClassMethodDeclaration);
        externClassMethodDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        externClassMethodDeclaration.parameters = this.parseList(ParseContextKind.DataDeclarationSequence, externClassMethodDeclaration, TokenKind.Comma);
        externClassMethodDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        externClassMethodDeclaration.attributes = this.parseList(ParseContextKind.ClassMethodAttributes, externClassMethodDeclaration, /*delimiter*/ null);
        externClassMethodDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign);
        if (externClassMethodDeclaration.equalsSign) {
            externClassMethodDeclaration.nativeSymbol = this.parseMissableStringLiteral(externClassMethodDeclaration);
        }

        return externClassMethodDeclaration;
    }

    // #endregion

    // #region Alias directive members

    private isAliasDirectiveSequenceTerminator(token: Tokens): boolean {
        return !this.isAliasDirectiveSequenceMemberStart(token);
    }

    private isAliasDirectiveSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseAliasDirectiveSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseAliasDirective(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseAliasDirective(parent: Nodes, identifierStart: IdentifierStartToken): AliasDirective {
        const aliasDirective = new AliasDirective();
        aliasDirective.parent = parent;
        aliasDirective.identifier = this.parseIdentifier(aliasDirective, identifierStart);
        aliasDirective.equalsSign = this.eatMissable(TokenKind.EqualsSign);

        // Parse module identifier
        const identifierStartToken1 = this.getToken();
        if (identifierStartToken1.kind === TokenKind.Identifier &&
            this.moduleIdentifiers.includes(identifierStartToken1.getText(this.document))) {
            this.advanceToken();
            aliasDirective.moduleIdentifier = identifierStartToken1;
            aliasDirective.moduleScopeMemberAccessOperator = this.eatMissable(TokenKind.Period);
        }

        // Parse type identifier
        const identifierStartToken2 = this.getToken();
        if (identifierStartToken2.kind === TokenKind.CommercialAt && this.getToken(2).kind === TokenKind.Period ||
            identifierStartToken2.kind === TokenKind.Identifier && this.getToken(1).kind === TokenKind.Period) {
            this.advanceToken();
            aliasDirective.typeIdentifier = this.parseIdentifier(aliasDirective, identifierStartToken2);
            aliasDirective.typeScopeMemberAccessOperator = this.eat(TokenKind.Period);
        }

        // Parse target
        let target: MissableDeclarationReferenceIdentifier | undefined = this.eatOptional(TokenKind.IntKeyword, TokenKind.FloatKeyword, TokenKind.StringKeyword);
        if (!target) {
            target = this.parseMissableIdentifier(aliasDirective);
        }
        aliasDirective.target = target;

        return aliasDirective;
    }

    // #endregion

    // #region Interface members

    private isInterfaceMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isInterfaceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseInterfaceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseInterfaceMethodDeclaration(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    private parseInterfaceMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): InterfaceMethodDeclaration {
        const interfaceMethodDeclaration = new InterfaceMethodDeclaration();
        interfaceMethodDeclaration.parent = parent;
        interfaceMethodDeclaration.methodKeyword = methodKeyword;
        interfaceMethodDeclaration.identifier = this.parseMissableIdentifier(interfaceMethodDeclaration)
        interfaceMethodDeclaration.returnType = this.parseTypeDeclaration(interfaceMethodDeclaration);
        interfaceMethodDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        interfaceMethodDeclaration.parameters = this.parseList(ParseContextKind.DataDeclarationSequence, interfaceMethodDeclaration, TokenKind.Comma);
        interfaceMethodDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);

        return interfaceMethodDeclaration;
    }

    // #endregion

    // #region Class members

    private isClassMembersListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isClassMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FunctionKeyword:
            case TokenKind.FieldKeyword:
            case TokenKind.MethodKeyword:
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword:
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    private parseClassMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.GlobalKeyword:
            case TokenKind.FieldKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequence(parent, token);
            }
            case TokenKind.FunctionKeyword: {
                this.advanceToken();

                return this.parseFunctionDeclaration(parent, token);
            }
            case TokenKind.MethodKeyword: {
                this.advanceToken();

                return this.parseClassMethodDeclaration(parent, token);
            }
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                this.advanceToken();

                return this.parseAccessibilityDirective(parent, token);
            }
        }

        return this.parseNewlineListMember(parent);
    }

    private parseClassMethodDeclaration(parent: Nodes, methodKeyword: MethodKeywordToken): ClassMethodDeclaration {
        const classMethodDeclaration = new ClassMethodDeclaration();
        classMethodDeclaration.parent = parent;
        classMethodDeclaration.methodKeyword = methodKeyword;
        const newKeyword = this.eatOptional(TokenKind.NewKeyword);
        if (newKeyword) {
            classMethodDeclaration.identifier = newKeyword;
        } else {
            classMethodDeclaration.identifier = this.parseMissableIdentifier(classMethodDeclaration);
            classMethodDeclaration.returnType = this.parseTypeDeclaration(classMethodDeclaration);
        }
        classMethodDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        classMethodDeclaration.parameters = this.parseList(ParseContextKind.DataDeclarationSequence, classMethodDeclaration, TokenKind.Comma);
        classMethodDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);

        classMethodDeclaration.attributes = this.parseList(ParseContextKind.ClassMethodAttributes, classMethodDeclaration, /*delimiter*/ null);
        if (classMethodDeclaration.attributes.findIndex(attribute => attribute.kind === TokenKind.AbstractKeyword) === -1) {
            classMethodDeclaration.statements = this.parseList(classMethodDeclaration.kind, classMethodDeclaration);
            classMethodDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
            if (classMethodDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
                classMethodDeclaration.endMethodKeyword = this.eatOptional(TokenKind.MethodKeyword);
            }
        }

        return classMethodDeclaration;
    }

    // #region Class method attributes

    private isClassMethodAttributesTerminator(token: Tokens): boolean {
        return !this.isClassMethodAttributeStart(token);
    }

    private isClassMethodAttributeStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.AbstractKeyword:
            case TokenKind.FinalKeyword:
            case TokenKind.PropertyKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseClassMethodAttribute(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.AbstractKeyword:
            case TokenKind.FinalKeyword:
            case TokenKind.PropertyKeyword: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #endregion

    // #region Statements

    private isBlockStatementsListTerminator(token: Tokens): boolean {
        return token.kind === TokenKind.EndKeyword;
    }

    private isStatementStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.LocalKeyword:
            case TokenKind.ReturnKeyword:
            case TokenKind.IfKeyword:
            case TokenKind.SelectKeyword:
            case TokenKind.WhileKeyword:
            case TokenKind.RepeatKeyword:
            case TokenKind.ForKeyword:
            case TokenKind.ContinueKeyword:
            case TokenKind.ExitKeyword:
            case TokenKind.ThrowKeyword:
            case TokenKind.TryKeyword:
            case TokenKind.Semicolon:
            case TokenKind.Newline: {
                return true;
            }
        }

        return this.isExpressionStart(token);
    }

    private parseStatement(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ConstKeyword:
            case TokenKind.LocalKeyword: {
                this.advanceToken();

                return this.parseDataDeclarationSequenceStatement(parent, token);
            }
            case TokenKind.ReturnKeyword: {
                this.advanceToken();

                return this.parseReturnStatement(parent, token);
            }
            case TokenKind.IfKeyword: {
                this.advanceToken();

                return this.parseIfStatement(parent, token);
            }
            case TokenKind.SelectKeyword: {
                this.advanceToken();

                return this.parseSelectStatement(parent, token);
            }
            case TokenKind.CaseKeyword: {
                this.advanceToken();

                return this.parseCaseStatement(parent, token);
            }
            case TokenKind.DefaultKeyword: {
                this.advanceToken();

                return this.parseDefaultStatement(parent, token);
            }
            case TokenKind.WhileKeyword: {
                this.advanceToken();

                return this.parseWhileLoop(parent, token);
            }
            case TokenKind.RepeatKeyword: {
                this.advanceToken();

                return this.parseRepeatLoop(parent, token);
            }
            case TokenKind.ForKeyword: {
                this.advanceToken();

                return this.parseForLoop(parent, token);
            }
            case TokenKind.ContinueKeyword: {
                this.advanceToken();

                return this.parseContinueStatement(parent, token);
            }
            case TokenKind.ExitKeyword: {
                this.advanceToken();

                return this.parseExitStatement(parent, token);
            }
            case TokenKind.ThrowKeyword: {
                this.advanceToken();

                return this.parseThrowStatement(parent, token);
            }
            case TokenKind.TryKeyword: {
                this.advanceToken();

                return this.parseTryStatement(parent, token);
            }
            case TokenKind.Semicolon:
            case TokenKind.Newline: {
                return this.parseEmptyStatement(parent);
            }
        }

        return this.parseExpressionStatement(parent);
    }

    private parseDataDeclarationSequenceStatement(
        parent: Nodes,
        dataDeclarationKeyword: ConstKeywordToken | LocalKeywordToken
    ): DataDeclarationSequenceStatement {
        const dataDeclarationSequenceStatement = new DataDeclarationSequenceStatement();
        dataDeclarationSequenceStatement.parent = parent;
        dataDeclarationSequenceStatement.dataDeclarationSequence = this.parseDataDeclarationSequence(dataDeclarationSequenceStatement, dataDeclarationKeyword);
        dataDeclarationSequenceStatement.terminator = this.eatStatementTerminator(dataDeclarationSequenceStatement);

        return dataDeclarationSequenceStatement;
    }

    private parseReturnStatement(parent: Nodes, returnKeyword: ReturnKeywordToken): ReturnStatement {
        const returnStatement = new ReturnStatement();
        returnStatement.parent = parent;
        returnStatement.returnKeyword = returnKeyword;
        // TODO: Is there sufficient information at this point to determine whether the return expression is required?
        if (this.isExpressionStart(this.getToken())) {
            returnStatement.expression = this.parseExpression(returnStatement);
        }
        returnStatement.terminator = this.eatStatementTerminator(returnStatement);

        return returnStatement;
    }

    // #region If statement

    private parseIfStatement(parent: Nodes, ifKeyword: IfKeywordToken): IfStatement {
        const ifStatement = new IfStatement();
        ifStatement.parent = parent;
        ifStatement.ifKeyword = ifKeyword;
        ifStatement.expression = this.parseExpression(ifStatement);
        ifStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);

        if (this.getToken().kind === TokenKind.Newline) {
            ifStatement.statements = this.parseList(ifStatement.kind, ifStatement);
            ifStatement.elseIfStatements = this.parseList(ParseContextKind.ElseIfStatementList, ifStatement, /*delimiter*/ null);

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseStatement = this.parseElseStatement(ifStatement, elseKeyword);
            }

            ifStatement.endKeyword = this.eatMissable(TokenKind.EndIfKeyword, TokenKind.EndKeyword);
            if (ifStatement.endKeyword.kind === TokenKind.EndKeyword) {
                ifStatement.endIfKeyword = this.eatOptional(TokenKind.IfKeyword);
            }
        } else {
            ifStatement.isSingleLine = true;
            ifStatement.statements = [this.parseStatement(ifStatement)] as typeof ifStatement.statements;

            const elseKeyword = this.getToken();
            if (elseKeyword.kind === TokenKind.ElseKeyword) {
                this.advanceToken();

                ifStatement.elseStatement = this.parseElseStatement(ifStatement, elseKeyword);
            }
        }

        ifStatement.terminator = this.eatStatementTerminator(ifStatement);

        return ifStatement;
    }

    // #region ElseIf statement list members

    private isElseIfStatementListTerminator(token: Tokens): boolean {
        return !this.isElseIfStatementListMemberStart(token);
    }

    private isElseIfStatementListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ElseIfKeyword: {
                return true;
            }
            case TokenKind.ElseKeyword: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.IfKeyword: {
                        return true;
                    }
                }
                break;
            }
        }

        return false;
    }

    private parseElseIfStatementListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.ElseIfKeyword: {
                this.advanceToken();

                return this.parseElseIfStatement(parent, token);
            }
            case TokenKind.ElseKeyword: {
                const nextToken = this.getToken(1);
                switch (nextToken.kind) {
                    case TokenKind.IfKeyword: {
                        this.advanceToken();
                        this.advanceToken();

                        return this.parseElseIfStatement(parent, token, nextToken);
                    }
                }
                break;
            }
        }

        return this.parseCore(parent, token);
    }

    private parseElseIfStatement(
        parent: Nodes,
        elseIfKeyword: ElseIfKeywordToken | ElseKeywordToken,
        ifKeyword?: IfKeywordToken,
    ): ElseIfStatement {
        const elseIfStatement = new ElseIfStatement();
        elseIfStatement.parent = parent;
        elseIfStatement.elseIfKeyword = elseIfKeyword;
        elseIfStatement.ifKeyword = ifKeyword;
        elseIfStatement.expression = this.parseExpression(elseIfStatement);
        elseIfStatement.thenKeyword = this.eatOptional(TokenKind.ThenKeyword);
        elseIfStatement.statements = this.parseList(elseIfStatement.kind, elseIfStatement);

        return elseIfStatement;
    }

    // #endregion

    private parseElseStatement(parent: IfStatement, elseKeyword: ElseKeywordToken): ElseStatement {
        const elseStatement = new ElseStatement();
        elseStatement.parent = parent;
        elseStatement.elseKeyword = elseKeyword;

        if (!elseStatement.isSingleLine) {
            elseStatement.statements = this.parseList(elseStatement.kind, elseStatement);
        } else {
            elseStatement.statements = [this.parseStatement(elseStatement)] as typeof elseStatement.statements;
        }

        return elseStatement;
    }

    private isIfOrElseIfOrElseStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ElseIfKeyword:
            case TokenKind.ElseKeyword:
            case TokenKind.EndIfKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Select statement

    private parseSelectStatement(parent: Nodes, selectKeyword: SelectKeywordToken): SelectStatement {
        const selectStatement = new SelectStatement();
        selectStatement.parent = parent;
        selectStatement.selectKeyword = selectKeyword;
        selectStatement.expression = this.parseExpression(selectStatement);
        selectStatement.newlines = this.parseList(ParseContextKind.NewlineList, selectStatement, /*delimiter*/ null);
        selectStatement.caseStatements = this.parseList(ParseContextKind.CaseStatementList, selectStatement, /*delimiter*/ null);

        const defaultKeyword = this.getToken();
        if (defaultKeyword.kind === TokenKind.DefaultKeyword) {
            this.advanceToken();

            selectStatement.defaultStatement = this.parseDefaultStatement(selectStatement, defaultKeyword);
        }

        selectStatement.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (selectStatement.endKeyword.kind === TokenKind.EndKeyword) {
            selectStatement.endSelectKeyword = this.eatOptional(TokenKind.SelectKeyword);
        }
        selectStatement.terminator = this.eatStatementTerminator(selectStatement);

        return selectStatement;
    }

    // #region Case statement list members

    private isCaseStatementListTerminator(token: Tokens): boolean {
        return !this.isCaseStatementListMemberStart(token);
    }

    private isCaseStatementListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CaseKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseCaseStatementListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.CaseKeyword: {
                this.advanceToken();

                return this.parseCaseStatement(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseCaseStatement(parent: Nodes, caseKeyword: CaseKeywordToken): CaseStatement {
        const caseStatement = new CaseStatement();
        caseStatement.parent = parent;
        caseStatement.caseKeyword = caseKeyword;
        caseStatement.expressions = this.parseList(ParseContextKind.ExpressionSequence, caseStatement, TokenKind.Comma);
        caseStatement.statements = this.parseList(caseStatement.kind, caseStatement);

        return caseStatement;
    }

    // #endregion

    private parseDefaultStatement(parent: Nodes, defaultKeyword: DefaultKeywordToken): DefaultStatement {
        const defaultStatement = new DefaultStatement();
        defaultStatement.parent = parent;
        defaultStatement.defaultKeyword = defaultKeyword;
        defaultStatement.statements = this.parseList(defaultStatement.kind, defaultStatement);

        return defaultStatement;
    }

    private isCaseOrDefaultStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CaseKeyword:
            case TokenKind.DefaultKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Loops

    // #region While loop

    private parseWhileLoop(parent: Nodes, whileKeyword: WhileKeywordToken): WhileLoop {
        const whileLoop = new WhileLoop();
        whileLoop.parent = parent;
        whileLoop.whileKeyword = whileKeyword;
        whileLoop.expression = this.parseExpression(whileLoop);
        whileLoop.statements = this.parseList(whileLoop.kind, whileLoop);
        whileLoop.endKeyword = this.eatMissable(TokenKind.WendKeyword, TokenKind.EndKeyword);
        if (whileLoop.endKeyword.kind === TokenKind.EndKeyword) {
            whileLoop.endWhileKeyword = this.eatOptional(TokenKind.WhileKeyword);
        }
        whileLoop.terminator = this.eatStatementTerminator(whileLoop);

        return whileLoop;
    }

    private isWhileLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.WendKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Repeat loop

    private parseRepeatLoop(parent: Nodes, repeatKeyword: RepeatKeywordToken): RepeatLoop {
        const repeatLoop = new RepeatLoop();
        repeatLoop.parent = parent;
        repeatLoop.repeatKeyword = repeatKeyword;
        repeatLoop.statements = this.parseList(repeatLoop.kind, repeatLoop);
        repeatLoop.foreverOrUntilKeyword = this.eatMissable(TokenKind.ForeverKeyword, TokenKind.UntilKeyword);
        if (repeatLoop.foreverOrUntilKeyword.kind === TokenKind.UntilKeyword) {
            repeatLoop.untilExpression = this.parseExpression(repeatLoop);
        }
        repeatLoop.terminator = this.eatStatementTerminator(repeatLoop);

        return repeatLoop;
    }

    private isRepeatLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.ForeverKeyword:
            case TokenKind.UntilKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region For loop

    private parseForLoop(parent: Nodes, forKeyword: ForKeywordToken): ForLoop {
        const forLoop = new ForLoop();
        forLoop.parent = parent;
        forLoop.forKeyword = forKeyword;
        forLoop.header = this.parseForLoopHeader(forLoop);
        forLoop.statements = this.parseList(forLoop.kind, forLoop);
        forLoop.endKeyword = this.eatMissable(TokenKind.NextKeyword, TokenKind.EndKeyword);
        if (forLoop.endKeyword.kind === TokenKind.EndKeyword) {
            forLoop.endForKeyword = this.eatOptional(TokenKind.ForKeyword);
        }
        forLoop.terminator = this.eatStatementTerminator(forLoop);

        return forLoop;
    }

    private parseForLoopHeader(parent: ForLoop) {
        let loopVariableExpression: DataDeclarationSequenceStatement | MissableExpression;
        const token = this.getToken();
        if (token.kind === TokenKind.LocalKeyword) {
            this.advanceToken();

            loopVariableExpression = this.parseDataDeclarationSequenceStatement(parent, token);
            const declaration = loopVariableExpression.dataDeclarationSequence.children[0];
            if (declaration &&
                declaration.kind === NodeKind.DataDeclaration &&
                declaration.eachInKeyword) {
                return loopVariableExpression;
            }
        } else {
            const position = this.position;
            loopVariableExpression = this.parseExpression(parent);
            switch (loopVariableExpression.kind) {
                case NodeKind.AssignmentExpression: {
                    if (loopVariableExpression.eachInKeyword) {
                        return loopVariableExpression;
                    }
                    break;
                }
                default: {
                    // TODO: Implement better error handling for incomplete For loop header.
                    //       Returning a MissingToken causes the expression to be parsed as part of the For loop body.
                    //       Possible solutions:
                    //       * Refactor expression parsing to force an (incomplete) AssignmentExpression to be returned.
                    //       * Construct an (incomplete) AssignmentExpression from the expression returned.
                    //       * Return a SkippedToken covering the range of the expression.
                    //         * Requires being able to calculate the length of the expression.
                    this.position = position;

                    return new MissingToken(token.fullStart, TokenKind.ForLoopHeader);
                }
            }
        }

        const numericForLoopHeader = new NumericForLoopHeader();
        numericForLoopHeader.parent = parent;
        numericForLoopHeader.loopVariableExpression = loopVariableExpression;

        numericForLoopHeader.toOrUntilKeyword = this.eatMissable(TokenKind.ToKeyword, TokenKind.UntilKeyword);
        numericForLoopHeader.lastValueExpression = this.parseExpression(numericForLoopHeader);

        numericForLoopHeader.stepKeyword = this.eatOptional(TokenKind.StepKeyword);
        if (numericForLoopHeader.stepKeyword) {
            numericForLoopHeader.stepValueExpression = this.parseExpression(numericForLoopHeader);
        }

        return numericForLoopHeader;
    }

    private isForLoopStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NextKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    private parseContinueStatement(parent: Nodes, continueKeyword: ContinueKeywordToken): ContinueStatement {
        const continueStatement = new ContinueStatement();
        continueStatement.parent = parent;
        continueStatement.continueKeyword = continueKeyword;
        continueStatement.terminator = this.eatStatementTerminator(continueStatement);

        return continueStatement;
    }

    private parseExitStatement(parent: Nodes, exitKeyword: ExitKeywordToken): ExitStatement {
        const exitStatement = new ExitStatement();
        exitStatement.parent = parent;
        exitStatement.exitKeyword = exitKeyword;
        exitStatement.terminator = this.eatStatementTerminator(exitStatement);

        return exitStatement;
    }

    // #endregion

    private parseThrowStatement(parent: Nodes, throwKeyword: ThrowKeywordToken): ThrowStatement {
        const throwStatement = new ThrowStatement();
        throwStatement.parent = parent;
        throwStatement.throwKeyword = throwKeyword;
        throwStatement.expression = this.parseExpression(throwStatement);
        throwStatement.terminator = this.eatStatementTerminator(throwStatement);

        return throwStatement;
    }

    // #region Try statement

    private parseTryStatement(parent: Nodes, tryKeyword: TryKeywordToken): TryStatement {
        const tryStatement = new TryStatement();
        tryStatement.parent = parent;
        tryStatement.tryKeyword = tryKeyword;
        tryStatement.statements = this.parseList(tryStatement.kind, tryStatement);
        tryStatement.catchStatements = this.parseList(ParseContextKind.CatchStatementList, tryStatement, /*delimiter*/ null);
        tryStatement.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (tryStatement.endKeyword.kind === TokenKind.EndKeyword) {
            tryStatement.endTryKeyword = this.eatOptional(TokenKind.TryKeyword);
        }
        tryStatement.terminator = this.eatStatementTerminator(tryStatement);

        return tryStatement;
    }

    // #region Catch statement list members

    private isCatchStatementListTerminator(token: Tokens): boolean {
        return !this.isCatchStatementListMemberStart(token);
    }

    private isCatchStatementListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CatchKeyword: {
                return true;
            }
        }

        return false;
    }

    private parseCatchStatementListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.CatchKeyword: {
                this.advanceToken();

                return this.parseCatchStatement(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseCatchStatement(parent: Nodes, catchKeyword: CatchKeywordToken): CatchStatement {
        const catchStatement = new CatchStatement();
        catchStatement.parent = parent;
        catchStatement.catchKeyword = catchKeyword;
        catchStatement.parameter = this.parseMissableDataDeclaration(catchStatement);
        catchStatement.statements = this.parseList(catchStatement.kind, catchStatement);

        return catchStatement;
    }

    // #endregion

    private isTryStatementStatementsListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.CatchKeyword:
            case TokenKind.EndKeyword: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    private parseExpressionStatement(parent: Nodes): ExpressionStatement {
        const expressionStatement = new ExpressionStatement();
        expressionStatement.parent = parent;
        expressionStatement.expression = this.parseExpression(expressionStatement);
        expressionStatement.terminator = this.eatStatementTerminator(expressionStatement);

        return expressionStatement;
    }

    private parseEmptyStatement(parent: Nodes): EmptyStatement {
        const emptyStatement = new EmptyStatement();
        emptyStatement.parent = parent;
        emptyStatement.terminator = this.eatStatementTerminator(emptyStatement);

        return emptyStatement;
    }

    // #endregion

    // #region Common

    private parseAccessibilityDirective(parent: Nodes, accessibilityKeyword: AccessibilityKeywordToken): AccessibilityDirective {
        const accessibilityDirective = new AccessibilityDirective();
        accessibilityDirective.parent = parent;
        accessibilityDirective.accessibilityKeyword = accessibilityKeyword;
        if (accessibilityDirective.accessibilityKeyword.kind === TokenKind.ExternKeyword) {
            accessibilityDirective.externPrivateKeyword = this.eatOptional(TokenKind.PrivateKeyword);
        }

        return accessibilityDirective;
    }

    private parseFunctionDeclaration(parent: Nodes, functionKeyword: FunctionKeywordToken): FunctionDeclaration {
        const functionDeclaration = new FunctionDeclaration();
        functionDeclaration.parent = parent;
        functionDeclaration.functionKeyword = functionKeyword;
        functionDeclaration.identifier = this.parseMissableIdentifier(functionDeclaration);
        functionDeclaration.returnType = this.parseTypeDeclaration(functionDeclaration);
        functionDeclaration.openingParenthesis = this.eatMissable(TokenKind.OpeningParenthesis);
        functionDeclaration.parameters = this.parseList(ParseContextKind.DataDeclarationSequence, functionDeclaration, TokenKind.Comma);
        functionDeclaration.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        functionDeclaration.statements = this.parseList(functionDeclaration.kind, functionDeclaration);
        functionDeclaration.endKeyword = this.eatMissable(TokenKind.EndKeyword);
        if (functionDeclaration.endKeyword.kind === TokenKind.EndKeyword) {
            functionDeclaration.endFunctionKeyword = this.eatOptional(TokenKind.FunctionKeyword);
        }

        return functionDeclaration;
    }

    private parseDataDeclarationSequence(parent: Nodes, dataDeclarationKeyword: DataDeclarationKeywordToken): DataDeclarationSequence {
        const dataDeclarationSequence = new DataDeclarationSequence();
        dataDeclarationSequence.parent = parent;
        dataDeclarationSequence.dataDeclarationKeyword = dataDeclarationKeyword;
        dataDeclarationSequence.children = this.parseList(ParseContextKind.DataDeclarationSequence, dataDeclarationSequence, TokenKind.Comma);

        return dataDeclarationSequence;
    }

    // #region Data declaration sequence members

    private isDataDeclarationSequenceTerminator(token: Tokens): boolean {
        return !this.isDataDeclarationSequenceMemberStart(token);
    }

    private isDataDeclarationSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseDataDeclarationSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseDataDeclaration(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseMissableDataDeclaration(parent: Nodes): MissableDataDeclaration {
        const name = this.getToken();
        switch (name.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseDataDeclaration(parent, name);
            }
        }

        return new MissingToken(name.fullStart, NodeKind.DataDeclaration);
    }

    private parseDataDeclaration(parent: Nodes, identifierStart: IdentifierStartToken): DataDeclaration {
        const dataDeclaration = new DataDeclaration();
        dataDeclaration.parent = parent;
        dataDeclaration.identifier = this.parseIdentifier(dataDeclaration, identifierStart);
        dataDeclaration.type = this.parseTypeDeclaration(dataDeclaration);
        if (parent.kind === NodeKind.DataDeclarationSequence &&
            parent.dataDeclarationKeyword.kind === TokenKind.ConstKeyword) {
            dataDeclaration.equalsSign = this.eatMissable(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
            dataDeclaration.expression = this.parseExpression(dataDeclaration);
        } else {
            dataDeclaration.equalsSign = this.eatOptional(TokenKind.EqualsSign, TokenKind.ColonEqualsSign);
            if (dataDeclaration.equalsSign) {
                dataDeclaration.eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);
                dataDeclaration.expression = this.parseExpression(dataDeclaration);
            }
        }

        return dataDeclaration;
    }

    // #endregion

    // #region Type declaration

    private parseTypeDeclaration(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.QuestionMark:
            case TokenKind.PercentSign:
            case TokenKind.NumberSign:
            case TokenKind.DollarSign: {
                this.advanceToken();

                return this.parseShorthandTypeDeclaration(parent, token);
            }
            case TokenKind.OpeningSquareBracket: {
                return this.parseShorthandTypeDeclaration(parent);
            }
            case TokenKind.Colon: {
                this.advanceToken();

                return this.parseLonghandTypeDeclaration(parent, token);
            }
        }

        return undefined;
    }

    private parseShorthandTypeDeclaration(parent: Nodes, shorthandType?: ShorthandTypeToken): ShorthandTypeDeclaration {
        const shorthandTypeDeclaration = new ShorthandTypeDeclaration();
        shorthandTypeDeclaration.parent = parent;
        shorthandTypeDeclaration.shorthandType = shorthandType;
        shorthandTypeDeclaration.arrayTypeDeclarations = this.parseList(ParseContextKind.ArrayTypeDeclarationList, shorthandTypeDeclaration, /*delimiter*/ null);

        return shorthandTypeDeclaration;
    }

    private parseLonghandTypeDeclaration(parent: Nodes, colon: ColonToken): LonghandTypeDeclaration {
        const longhandTypeDeclaration = new LonghandTypeDeclaration();
        longhandTypeDeclaration.parent = parent;
        longhandTypeDeclaration.colon = colon;
        longhandTypeDeclaration.typeReference = this.parseMissableTypeReference(longhandTypeDeclaration);

        return longhandTypeDeclaration;
    }

    // #endregion

    // #region Type parameter sequence

    private isTypeParameterSequenceTerminator(token: Tokens): boolean {
        return !this.isTypeParameterSequenceMemberStart(token);
    }

    private isTypeParameterSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.Comma: {
                return true;
            }
        }

        return false;
    }

    private parseTypeParameterSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseTypeParameter(parent, token);
            }
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    private parseTypeParameter(parent: Nodes, identifierStart: IdentifierStartToken): TypeParameter {
        const typeParameter = new TypeParameter();
        typeParameter.parent = parent;
        typeParameter.identifier = this.parseIdentifier(typeParameter, identifierStart);

        return typeParameter;
    }

    // #endregion

    protected isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        // Parentheses-less invocations are only valid in expression statements.
        const parent = expression.parent;
        if (parent && parent.kind === NodeKind.ExpressionStatement) {
            return this.isExpressionSequenceMemberStart(token);
        }

        return false;
    }

    private isInlineStatement(statement: Statement): boolean {
        let parent = statement.parent!;

        switch (parent.kind) {
            case NodeKind.IfStatement:
            case NodeKind.ElseStatement: {
                return parent.isSingleLine;
            }
            case NodeKind.ForLoop: {
                // Checks if this statement is the header.
                const currentParseContext = this.parseContexts[this.parseContexts.length - 1];

                return currentParseContext !== NodeKind.ForLoop;
            }
            case NodeKind.NumericForLoopHeader: {
                return true;
            }
        }

        return false;
    }

    // #endregion

    // #region Core

    protected isListTerminator(parseContext: ParseContext, token: Tokens): boolean {
        parseContext = parseContext as ParserParseContext;

        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.isModuleMembersListTerminator();
            }
            case NodeKind.ExternDataDeclarationSequence: {
                return this.isExternDataDeclarationSequenceTerminator(token);
            }
            case NodeKind.ExternClassDeclaration: {
                return this.isExternClassDeclarationMembersListTerminator(token);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.isInterfaceMembersListTerminator(token);
            }
            case NodeKind.ClassDeclaration: {
                return this.isClassMembersListTerminator(token);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration: {
                return this.isBlockStatementsListTerminator(token);
            }
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement: {
                return this.isIfOrElseIfOrElseStatementStatementsListTerminator(token);
            }
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement: {
                return this.isCaseOrDefaultStatementStatementsListTerminator(token);
            }
            case NodeKind.WhileLoop: {
                return this.isWhileLoopStatementsListTerminator(token);
            }
            case NodeKind.RepeatLoop: {
                return this.isRepeatLoopStatementsListTerminator(token);
            }
            case NodeKind.ForLoop: {
                return this.isForLoopStatementsListTerminator(token);
            }
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.isTryStatementStatementsListTerminator(token);
            }
            case NodeKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceTerminator(token);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.isModulePathSequenceTerminator(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceTerminator(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceTerminator(token);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.isClassMethodAttributesTerminator(token);
            }
            case ParseContextKind.ElseIfStatementList: {
                return this.isElseIfStatementListTerminator(token);
            }
            case ParseContextKind.CaseStatementList: {
                return this.isCaseStatementListTerminator(token);
            }
            case ParseContextKind.CatchStatementList: {
                return this.isCatchStatementListTerminator(token);
            }
        }

        return super.isListTerminatorCore(parseContext, token);
    }

    protected isValidListElement(parseContext: ParseContext, token: Tokens): boolean {
        parseContext = parseContext as ParserParseContext;

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.isModuleMemberStart(token);
            }
            case NodeKind.ExternDataDeclarationSequence: {
                return this.isExternDataDeclarationSequenceMemberStart(token);
            }
            case NodeKind.ExternClassDeclaration: {
                return this.isExternClassDeclarationMemberStart(token);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.isInterfaceMemberStart(token);
            }
            case NodeKind.ClassDeclaration: {
                return this.isClassMemberStart(token);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement:
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.isStatementStart(token);
            }
            case NodeKind.AliasDirectiveSequence: {
                return this.isAliasDirectiveSequenceMemberStart(token);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.isModulePathSequenceMemberStart(token);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.isDataDeclarationSequenceMemberStart(token);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.isTypeParameterSequenceMemberStart(token);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.isClassMethodAttributeStart(token);
            }
            case ParseContextKind.ElseIfStatementList: {
                return this.isElseIfStatementListMemberStart(token);
            }
            case ParseContextKind.CaseStatementList: {
                return this.isCaseStatementListMemberStart(token);
            }
            case ParseContextKind.CatchStatementList: {
                return this.isCatchStatementListMemberStart(token);
            }
        }

        return super.isValidListElementCore(parseContext, token);
    }

    protected parseListElement(parseContext: ParseContext, parent: Nodes) {
        parseContext = parseContext as ParserParseContext;

        switch (parseContext) {
            case NodeKind.ModuleDeclaration: {
                return this.parseModuleMember(parent);
            }
            case NodeKind.ExternDataDeclarationSequence: {
                return this.parseExternDataDeclarationSequenceMember(parent);
            }
            case NodeKind.ExternClassDeclaration: {
                return this.parseExternClassDeclarationMember(parent);
            }
            case NodeKind.InterfaceDeclaration: {
                return this.parseInterfaceMember(parent);
            }
            case NodeKind.ClassDeclaration: {
                return this.parseClassMember(parent);
            }
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.IfStatement:
            case NodeKind.ElseIfStatement:
            case NodeKind.ElseStatement:
            case NodeKind.CaseStatement:
            case NodeKind.DefaultStatement:
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ForLoop:
            case NodeKind.TryStatement:
            case NodeKind.CatchStatement: {
                return this.parseStatement(parent);
            }
            case NodeKind.AliasDirectiveSequence: {
                return this.parseAliasDirectiveSequenceMember(parent);
            }
            case ParseContextKind.ModulePathSequence: {
                return this.parseModulePathSequenceMember(parent);
            }
            case ParseContextKind.DataDeclarationSequence: {
                return this.parseDataDeclarationSequenceMember(parent);
            }
            case ParseContextKind.TypeParameterSequence: {
                return this.parseTypeParameterSequenceMember(parent);
            }
            case ParseContextKind.ClassMethodAttributes: {
                return this.parseClassMethodAttribute(parent);
            }
            case ParseContextKind.ElseIfStatementList: {
                return this.parseElseIfStatementListMember(parent);
            }
            case ParseContextKind.CaseStatementList: {
                return this.parseCaseStatementListMember(parent);
            }
            case ParseContextKind.CatchStatementList: {
                return this.parseCatchStatementListMember(parent);
            }
        }

        return super.parseListElementCore(parseContext, parent);
    }

    private eatStatementTerminator(statement: Statement) {
        if (!this.isInlineStatement(statement)) {
            return this.eatOptional(TokenKind.Newline, TokenKind.Semicolon);
        }

        return undefined;
    }

    // #endregion
}

// #region Parse contexts

interface ParserParseContextElementMap extends ParseContextElementMapBase {
    [NodeKind.ModuleDeclaration]: ReturnType<Parser['parseModuleMember']>;
    [NodeKind.ExternDataDeclarationSequence]: ReturnType<Parser['parseExternDataDeclarationSequenceMember']>;
    [NodeKind.ExternClassDeclaration]: ReturnType<Parser['parseExternClassDeclarationMember']>;
    [NodeKind.InterfaceDeclaration]: ReturnType<Parser['parseInterfaceMember']>;
    [NodeKind.ClassDeclaration]: ReturnType<Parser['parseClassMember']>;
    [NodeKind.ClassMethodDeclaration]: ReturnType<Parser['parseStatement']>;
    [NodeKind.IfStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ElseIfStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ElseStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.CaseStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.DefaultStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.WhileLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.RepeatLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.ForLoop]: ReturnType<Parser['parseStatement']>;
    [NodeKind.TryStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.CatchStatement]: ReturnType<Parser['parseStatement']>;
    [NodeKind.FunctionDeclaration]: ReturnType<Parser['parseStatement']>;
    [NodeKind.AliasDirectiveSequence]: ReturnType<Parser['parseAliasDirectiveSequenceMember']>;
    [ParseContextKind.ModulePathSequence]: ReturnType<Parser['parseModulePathSequenceMember']>;
    [ParseContextKind.DataDeclarationSequence]: ReturnType<Parser['parseDataDeclarationSequenceMember']>;
    [ParseContextKind.TypeParameterSequence]: ReturnType<Parser['parseTypeParameterSequenceMember']>;
    [ParseContextKind.ClassMethodAttributes]: ReturnType<Parser['parseClassMethodAttribute']>;
    [ParseContextKind.ElseIfStatementList]: ReturnType<Parser['parseElseIfStatementListMember']>;
    [ParseContextKind.CaseStatementList]: ReturnType<Parser['parseCaseStatementListMember']>;
    [ParseContextKind.CatchStatementList]: ReturnType<Parser['parseCatchStatementListMember']>;
}

type ParserParseContext = keyof ParserParseContextElementMap;

const _ParseContextKind: { -readonly [P in keyof typeof ParseContextKind]: typeof ParseContextKind[P]; } = ParseContextKind;
_ParseContextKind.ModulePathSequence = 'ModulePathSequence' as ParseContextKind.ModulePathSequence;
_ParseContextKind.DataDeclarationSequence = 'DataDeclarationSequence' as ParseContextKind.DataDeclarationSequence;
_ParseContextKind.TypeParameterSequence = 'TypeParameterSequence' as ParseContextKind.TypeParameterSequence;
_ParseContextKind.ClassMethodAttributes = 'ClassMethodAttributes' as ParseContextKind.ClassMethodAttributes;
_ParseContextKind.ElseIfStatementList = 'ElseIfStatementList' as ParseContextKind.ElseIfStatementList;
_ParseContextKind.CaseStatementList = 'CaseStatementList' as ParseContextKind.CaseStatementList;
_ParseContextKind.CatchStatementList = 'CatchStatementList' as ParseContextKind.CatchStatementList;

declare module './ParserBase' {
    enum ParseContextKind {
        ModulePathSequence = 'ModulePathSequence',
        DataDeclarationSequence = 'DataDeclarationSequence',
        TypeParameterSequence = 'TypeParameterSequence',
        ClassMethodAttributes = 'ClassMethodAttributes',
        ElseIfStatementList = 'ElseIfStatementList',
        CaseStatementList = 'CaseStatementList',
        CatchStatementList = 'CatchStatementList',
    }

    interface ParseContextElementMap extends ParserParseContextElementMap { }
}

// #endregion
