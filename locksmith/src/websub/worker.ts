import { run } from 'graphile-worker'
import config from '../config/config'
import {
  addRenewalJobs,
  addRenewalJobsWeekly,
} from './tasks/renewal/addRenewalJobs'
import { cryptoRenewalJob } from './tasks/renewal/cryptoRenewalJob'
import { fiatRenewalJob } from './tasks/renewal/fiatRenewalJob'
import { addKeyJobs } from './tasks/addKeyJobs'
import { addHookJobs } from './tasks/hooks/addHookJobs'
import { sendHook } from './tasks/hooks/sendHook'
import { sendEmail } from './tasks/sendEmail'

const crontabProduction = `
*/5 * * * * addRenewalJobs
0 0 * * 0 addRenewalJobsWeekly
*/5 * * * * addKeyJobs
*/5 * * * * addHookJobs
`

const cronTabTesting = `
*/1 * * * * addRenewalJobs
0 0 * * * addRenewalJobsWeekly
*/1 * * * * addKeyJobs
*/1 * * * * addHookJobs
`

const crontab = config.isProduction ? crontabProduction : cronTabTesting

async function main() {
  const runner = await run({
    connectionString: config.databaseUrl,
    crontab,
    concurrency: 5,
    noHandleSignals: false,
    pollInterval: 1000,
    taskList: {
      addRenewalJobs,
      addRenewalJobsWeekly,
      addKeyJobs,
      addHookJobs,
      sendHook,
      sendEmail,
      fiatRenewalJob,
      cryptoRenewalJob,
    },
  })

  await runner.promise
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
