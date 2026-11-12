import {initializeOpening} from './occasion-opening.js';

initializeOpening(dialog => dialog.querySelector('.ob-tide').animate([
  {transform: 'translateY(0)', opacity: 1, offset: 0},
  {transform: 'translateY(3%)', opacity: 1, offset: .19, easing: 'cubic-bezier(.42,0,.24,1)'},
  {transform: 'translateY(-58%)', opacity: .96, offset: .72},
  {transform: 'translateY(-114%)', opacity: 0}
], {duration: 1530, fill: 'forwards', easing: 'ease-in-out'}));
