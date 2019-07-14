import path = require('path');
import { executeBinderTestCases } from './shared';

const name = 'Binder';

executeBinderTestCases(name, path.resolve(__dirname, 'cases', name));
