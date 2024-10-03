import { init } from '@emailjs/browser';

import { NEXT_PUBLIC_EMAILJS_PUBLIC_KEY } from '@/constants/env';

init({
  publicKey: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  // Do not allow headless browsers
  blockHeadless: true,
  limitRate: {
    // Set the limit rate for the application
    // Allow 1 request per 5s
    throttle: 5000,
  },
});
