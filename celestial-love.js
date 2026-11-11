import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.animate([
  {opacity: 1, offset: 0},
  {opacity: 1, offset: .72},
  {opacity: 0},
], {duration: 1840, easing: 'ease-in-out', fill: 'forwards'}));
