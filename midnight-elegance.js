import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.animate([
  {opacity: 1, clipPath: 'inset(0 0 0 0)', offset: 0},
  {opacity: 1, clipPath: 'inset(0 0 0 0)', offset: .68},
  {opacity: 0, clipPath: 'inset(0 0 100% 0)'},
], {duration: 1820, easing: 'cubic-bezier(.45,0,.28,1)', fill: 'forwards'}));
