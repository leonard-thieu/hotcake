import process = require('process');
import glob = require('glob');
import path = require('path');
import { spawn } from 'child_process';
import { performance } from 'perf_hooks';
import commondir = require('commondir');

// Based on the amount of time it takes to parse an empty file.
const OVERHEAD = 160;
const NO_BANANAS = false;

const inputFilesPattern = process.argv[2];

glob(inputFilesPattern, async (err, items) => {
    function getErrors(path: string): PathErrors {
        if (!errors.get(path)) {
            errors.set(path, []);
        }

        return errors.get(path)!;
    }

    const totalStartTime = performance.now();
    let totalFiles = 0;

    const errors: Map<string, PathErrors> = new Map();

    const paths = items;
    const cDir = commondir(paths);

    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        const rPath = path.relative(cDir, p);

        if (NO_BANANAS) {
            const pathSegments = rPath.split(path.sep);
            if (pathSegments.findIndex((value) => value === 'bananas') !== -1) {
                console.log(`Skipping ${rPath}...`);

                continue;
            }
        }

        totalFiles++;
        console.log(`Parsing ${rPath}...`);

        const proc = new Promise((resolve) => {
            const startTime = performance.now();

            const grun = spawn('cmd.exe', [
                '/c',
                'grun.bat',
                'MonkeyX',
                'moduleDeclaration',
                p,
            ], {
                cwd: 'gen',
            });

            const maxTime = 60 * 1000;
            const timeout = setTimeout(() => {
                console.log(`Maximum time of ${maxTime} ms exceeded.`);

                spawn('taskkill', [
                    '/pid',
                    grun.pid.toString(),
                    '/f',
                    '/t',
                ]);

                resolve();
            }, maxTime);

            grun.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            grun.stderr.on('data', (data) => {
                const d = data.toString();

                console.log(d);
                getErrors(rPath).push(d);
            });

            grun.on('exit', (code) => {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);

                if (code !== 0) {
                    console.log(`Exited with code ${code}.`);
                }

                getErrors(rPath).exitCode = code;
                getErrors(rPath).executionTime = duration;

                clearTimeout(timeout);

                resolve();
            });
        });

        await proc;
    }

    for (let [path, pathErrors] of errors) {
        if (pathErrors.length > 0) {
            console.log(` -- ${path}`);

            if (pathErrors.exitCode !== 0) {
                console.log(`Exited with code ${pathErrors.exitCode}.`);
            }

            if (pathErrors.executionTime! > 500 + OVERHEAD) {
                console.log(`Execution took ${pathErrors.executionTime} ms.`);
            }

            for (let i = 0; i < pathErrors.length; i++) {
                const pathError = pathErrors[i];
                console.log(pathError);
            }
        }
    }

    const totalEndTime = performance.now();
    const totalDuration = Math.round((totalEndTime - totalStartTime) / 1000);
    // Exclude overhead that would not be incurred in a real application.
    const totalOverhead = (OVERHEAD * totalFiles) / 1000;
    const totalDurationWithoutOverhead = Math.round(totalDuration - totalOverhead);

    console.log(`Project parsed in ${totalDuration} s (${totalDurationWithoutOverhead} s without overhead).`);
});

interface PathErrors extends Array<string> {
    exitCode?: number;
    executionTime?: number;
}
