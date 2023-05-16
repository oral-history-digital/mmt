import Rollbar from 'rollbar';

import config from './config.js';
import packageJson from '../package.json' assert { type: 'json' };
const packageVersion = packageJson.version;

export default function monitoring() {
  const { rollbarAccessToken } = config.monitoring;

  if (!rollbarAccessToken) {
    console.info('No Rollbar access token found. Error monitoring will not work.');
  }

  const rollbar = new Rollbar({
    accessToken: rollbarAccessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      code_version: packageVersion,
    },
  })

  return rollbar.errorHandler();
}
