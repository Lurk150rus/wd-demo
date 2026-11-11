import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.querySelector('.ob-tide').animate([
  {transform: 'translateY(0)'},
  {transform: 'translateY(-115%)'},
], {duration: 1680, easing: 'cubic-bezier(.56,.05,.2,1)', fill: 'forwards'}));
