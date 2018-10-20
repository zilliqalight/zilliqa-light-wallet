import { backgroundPage as debugBackgroundPage } from './debugBackgroundPage';
import { backgroundPage as chromeBackgroundPage } from './chromeBackgroundPage';

let backgroundPage;
if (process.env.NODE_ENV === 'development') {
  backgroundPage = debugBackgroundPage;
} else {
  backgroundPage = chromeBackgroundPage;
}

export { backgroundPage };
