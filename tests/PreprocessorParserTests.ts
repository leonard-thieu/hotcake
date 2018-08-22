import { PreprocessorParser } from '../src/PreprocessorParser';
import { executeTestCases } from './shared';

executeTestCases('PreprocessorParser', 'tree', (contents) => {
    const parser = new PreprocessorParser();

    return parser.parse(contents);
});
