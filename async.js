'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        let numberOfJob = 0;
        let results = [];
        if (jobs.length === 0) {
            resolve(results);
        }
        for (let count = 0; count < parallelNum; count++) {
            numberOfJob += 1;
            startWorking(jobs[numberOfJob - 1], numberOfJob - 1);
        }

        function startWorking(job, index) {
            let finish = result => finishWorking(result, index);
            new Promise((resolveOfJob, rejectOfJob) => {
                job().then(resolveOfJob, rejectOfJob);
                setTimeout(rejectOfJob, timeout, new Error('Promise timeout'));
            }).then(finish)
                .then(null, finish);
        }

        function finishWorking(result, index) {
            results[index] = result;
            if (results.length === jobs.length) {
                resolve(results);

                return true;
            }
            if (numberOfJob < jobs.length) {
                numberOfJob += 1;
                startWorking(jobs[numberOfJob - 1], numberOfJob - 1);
            }
        }
    });
}
