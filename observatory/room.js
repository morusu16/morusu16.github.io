(() => {
  const room=document.querySelector('.laboratory');
  const smoke=document.createElementNS('http://www.w3.org/2000/svg','svg');
  smoke.classList.add('smoke-volume');
  smoke.setAttribute('viewBox','0 0 1671 941');
  smoke.setAttribute('preserveAspectRatio','xMidYMid slice');
  smoke.setAttribute('aria-hidden','true');
  smoke.setAttribute('focusable','false');
  // Fixed artwork only; no profile or visitor text is interpolated into SVG.
  smoke.innerHTML=`<defs>
    <filter id="smoke-curl" x="-60%" y="-40%" width="220%" height="200%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".009 .015" numOctaves="2" seed="7" result="eddies"><animate attributeName="baseFrequency" values=".009 .015;.013 .011;.01 .018;.009 .015" dur="32s" repeatCount="indefinite"/></feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="eddies" scale="48" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="8"/>
    </filter>
    <linearGradient id="smoke-fade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#abd9d2" stop-opacity="0"/><stop offset=".2" stop-color="#b8e0d7" stop-opacity=".7"/><stop offset=".64" stop-color="#b0d4d4" stop-opacity=".4"/><stop offset="1" stop-color="#abcdd3" stop-opacity="0"/></linearGradient>
  </defs>
  <g filter="url(#smoke-curl)" fill="url(#smoke-fade)">
    <g class="smoke-plume plume-a"><path d="M525 644 C510 592 574 570 538 520 C492 461 553 457 529 408 C508 365 486 355 507 318 C518 295 534 281 514 251 C589 275 594 320 563 357 C539 389 590 425 573 465 C559 501 600 536 565 574 C541 600 554 619 550 644 Z"/><path opacity=".5" d="M541 638 C577 585 503 559 548 501 C593 442 529 406 552 350 C583 296 537 274 548 245 C487 283 520 326 501 362 C472 415 540 445 513 489 C482 538 540 581 529 638 Z"/></g>
    <g class="smoke-plume plume-b"><path d="M1009 682 C996 622 1058 602 1022 552 C982 500 1040 458 1001 424 C956 383 1012 347 976 302 C1050 318 1069 367 1030 404 C1009 427 1084 473 1043 514 C1014 551 1081 590 1047 627 C1030 645 1044 660 1037 682 Z"/></g>
    <g class="smoke-plume plume-c"><path d="M1487 680 C1451 637 1524 588 1467 538 C1430 498 1480 468 1457 432 C1422 387 1464 356 1435 311 C1507 339 1517 380 1490 416 C1458 461 1540 491 1505 538 C1475 581 1543 621 1514 650 L1510 680 Z"/></g>
  </g>`;
  room.append(smoke);
  const motion=document.querySelector('#motion');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let chosenPause=reduced.matches;
  function animationState(){
    const pause=chosenPause||document.hidden||reduced.matches;
    document.body.classList.toggle('motion-paused',pause);
    if(pause)smoke.pauseAnimations?.();else smoke.unpauseAnimations?.();
  }
  function update(paused){chosenPause=paused;animationState();motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'霧の動きを再開':'霧の動きを止める';}
  update(reduced.matches);
  motion.onclick=()=>update(motion.getAttribute('aria-pressed')!=='true');
  document.addEventListener('visibilitychange',animationState);
  reduced.addEventListener('change',()=>update(reduced.matches));
})();
