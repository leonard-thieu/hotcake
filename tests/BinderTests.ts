import path = require('path');
import { executeBinderTestCases, getCasePaths } from './shared';

const name = 'Binder';
const rootPath = path.resolve(__dirname, 'cases', name);
const casePaths = getCasePaths(rootPath);

executeBinderTestCases(name, rootPath, casePaths);
