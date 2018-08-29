export enum ParseContext {
    ModuleMembers = 1,
    InterfaceMembers = 2,
    ClassMembers = 4,
    BlockStatements = 8,
    IfStatementStatements = 16,
    DataDeclarationListMembers = 32,
}
