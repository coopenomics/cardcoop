import { boot } from 'quasar/wrappers';
import { App } from 'vue';
import { Router } from 'vue-router';
import { NODE_ENV } from 'src/shared/config';
import Tracker from '@openreplay/tracker';
import trackerAssist from '@openreplay/tracker-assist'
import { useSessionStore } from 'src/entities/Session';
export default boot(
  ({ app, router }: { app: App<Element>; router: Router }) => {
    console.log('on senstry loader!')
    if ((NODE_ENV as string) === 'production') {
      const session = useSessionStore()

      const tracker = new Tracker({
        projectKey: 'mgaCVSShnDNbPRFDZehd',
      });

      if (session.username)
        tracker.setUserID(session.username)

      // .start() returns a promise
      tracker.start().then(sessionData => console.log(sessionData) ).catch(e => console.error('on tracker: ', e) )
      tracker.use(trackerAssist({}));
    }
  }
);
