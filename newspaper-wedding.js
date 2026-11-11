import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.animate([
  {opacity: 1, offset: 0},
  {opacity: 1, offset: .57},
  {opacity: 0},
], {duration: 1680, easing: 'ease-in-out', fill: 'forwards'}));
