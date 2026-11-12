import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.querySelector('.wf-frost').animate([
  {opacity: 1, transform: 'scale(1)', offset: 0},
  {opacity: .94, transform: 'scale(1.012)', offset: .24},
  {opacity: .48, transform: 'scale(1.035)', offset: .68},
  {opacity: 0, transform: 'scale(1.055)'}
], {duration: 1570, easing: 'ease-in-out', fill: 'forwards'}));
