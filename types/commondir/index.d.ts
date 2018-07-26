// Type definitions for commondir 1.0
// Project: https://github.com/substack/node-commondir
// Definitions by: Leonard Thieu <https://github.com/leonard-thieu>

declare module 'commondir' {
    function commondir(basedir: string, relativePaths: string[]): string;
    function commondir(absolutePaths: string[]): string;

    export = commondir;
}
