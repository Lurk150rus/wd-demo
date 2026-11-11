import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.animate([
  {opacity: 1, offset: 0},
  {opacity: 1, offset: .67},
  {opacity: 0},
], {duration: 1710, easing: 'ease-in-out', fill: 'forwards'}));
