import glob = require('glob');
import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import { orderBy } from 'natural-orderby';

export function executeTestCases(options: TestCaseOptions): void;
export function executeTestCases(type: string, ext: string, testCallback: TestCallback): void;

export function executeTestCases(type: TestCaseOptions | string, ext?: string, testCallback?: TestCallback): void {
    let name: string;
    let casesPath: string;
    let outputBasePath: string;
    let skippedCases: string[] | undefined;

    if (typeof type !== 'string') {
        const options = type;
        name = options.name;
        casesPath = options.casesPath;
        outputBasePath = options.outputBasePath;
        ext = options.ext;
        testCallback = options.testCallback;
    } else {
        name = type;
        casesPath = path.join(__dirname, 'cases', type);
        outputBasePath = casesPath;
        skippedCases = require(`./${type}.skipped.json`);
    }

    describe(name, function () {
        const casesGlobPath = path.join(casesPath, '**', '*.monkey');
        const sourcePaths = orderBy(glob.sync(casesGlobPath));

        for (const sourcePath of sourcePaths) {
            const sourceRelativePath = path.relative(casesPath, sourcePath);
            const outputPath = path.join(outputBasePath, sourceRelativePath) + `.${ext}.json`;
            mkdirp.sync(path.dirname(outputPath));

            let _it: Mocha.PendingTestFunction = it;
            if (skippedCases && skippedCases.includes(sourceRelativePath)) {
                _it = xit;
                try {
                    fs.unlinkSync(outputPath);
                } catch (error) {
                    switch (error.code) {
                        case 'ENOENT': { break; }
                        default: { throw error; }
                    }
                }
            }

            // TODO: Should this fail/warn if baselines have changed?
            _it(sourceRelativePath, function () {
                const contents = fs.readFileSync(sourcePath, 'utf8');
                const result = testCallback!(contents);

                const json = JSON.stringify(result, null, 2);
                fs.writeFileSync(outputPath, json);
            });
        }
    });
}

interface TestCaseOptions {
    name: string;
    casesPath: string;
    outputBasePath: string;
    ext: string;
    testCallback: TestCallback;
}

type TestCallback = (contents: string) => any;
