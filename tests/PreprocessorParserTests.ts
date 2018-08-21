import { executeTestCases } from './shared';
import { PreprocessorParser } from '../src/PreprocessorParser';

executeTestCases('PreprocessorParser', 'tree', (contents) => {
    const parser = new PreprocessorParser();
    
    return parser.parse(contents);
});
