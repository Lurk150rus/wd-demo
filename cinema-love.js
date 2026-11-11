import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.animate([
  {opacity: 1, offset: 0},
  {opacity: 1, offset: .83},
  {opacity: 0},
], {duration: 1800, easing: 'linear', fill: 'forwards'}));
