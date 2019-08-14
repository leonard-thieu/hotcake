import { executeBinderTestCases, executeParserTestCases, executePreprocessorParserTestCases, executePreprocessorTokenizerTestCases, getFrameworkDirectory } from './shared';

const name = 'MonkeyX';
const casesPath = getFrameworkDirectory();

executePreprocessorTokenizerTestCases(name, casesPath);
executePreprocessorParserTestCases(name, casesPath);
executeParserTestCases(name, casesPath);
executeBinderTestCases(name, casesPath);
