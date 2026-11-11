import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.querySelector('.wf-frost').animate([
  {opacity: 1, filter: 'blur(0px)', offset: 0},
  {opacity: .85, filter: 'blur(2px)', offset: .27},
  {opacity: 0, filter: 'blur(11px)'},
], {duration: 1780, easing: 'ease-in-out', fill: 'forwards'}));
