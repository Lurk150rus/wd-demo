import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.animate([
  {opacity: 1, offset: 0},
  {opacity: 1, offset: .75},
  {opacity: 0},
], {duration: 1580, easing: 'linear', fill: 'forwards'}));
