// coffee.js: "Coffee Loop", a 14.5 s vertical Short (1080×1920). See STORYBOARD.md.
//   A (0–4.5):    asleep at the kitchen counter → the steam wakes Clawd → one big gulp → a beat → eyes snap open → flash.
//   B (4.5–9.3):  supercharged: an energy burst, the mug flung away, hops, a spin, a leap off the top → grey wipe.
//   C (9.3–14.5): Clawd drops back to the counter, the mug lands too, dizzy, battery drains into the same slump as the
//                 opening… new steam curls up, one eye opens, iris closes (and the video loops into the iris opening).
(() => {
  const G = 1330, CX = 440, U = 46, MUGX = 840;        // counter line, Clawd's spot and size, the mug's spot
  const MS = 70;                                       // mug half-width
  const CRASH = [mixCol(PAL.indigo, PAL.paper, .35), mixCol(PAL.sky, PAL.indigo, .45)];

  // ---------- props ----------
  // The mug, drawn around its centre. full: 0..1 coffee showing at the rim.
  function mug(x, y, s = 1, rot = 0, o = {}) {
    boilSeed(o.key || 'mug');
    push(); translate(x, y); rotate(rot); scale(s);
    const sw = o.sw ?? 1.1;
    paint(ribbon([[MS - 8, -48], [MS + 42, -40], [MS + 46, 10], [MS + 8, 36]], 20, 18), { wash: mixCol(PAL.cream, PAL.rose, .25), washOp: 255, ink: PAL.ink, sw: sw * .8 });
    paint(rrPts(-MS, -85, MS * 2, 170, 24, 1.5), { wash: PAL.cream, washOp: 255, fill: mixCol(PAL.cream, PAL.ochre, .4), fillOp: 60, tex: .5, ink: null });
    paint(rectPts(-MS + 4, 10, MS * 2 - 8, 34, 1.5), { wash: PAL.rose, washOp: 255, ink: null });
    paint(heartPts(0, -30, 20), { wash: PAL.rose, washOp: 255, ink: null });
    paint(rrPts(-MS, -85, MS * 2, 170, 24, 1.5), { ink: PAL.ink, sw });
    if ((o.full ?? 1) > .02) paint(ellPts(0, -80, MS - 10, 9, 18), { wash: mixCol('#6B4026', PAL.ink, .2), washOp: 255 * clamp(o.full ?? 1), ink: null });
    pop();
  }
  // Steam: three wisps rising from (x, top). amt 0..1 grows them; bend 0..1 curls the first wisp over to `to`.
  function steam(x, top, lt, amt = 1, bend = 0, to = null) {
    if (amt <= .02) return;
    for (let i = 0; i < 3; i++) {
      boilSeed('steam' + i);
      const P = [], n = 7, ox = (i - 1) * 34, h = 230 * amt * (i === 1 ? 1.15 : .9);
      for (let k = 0; k < n; k++) {
        const q = k / (n - 1);
        let px = x + ox + Math.sin(lt * 2.4 - q * 5 + i * 2.1) * 18 * q, py = top - 10 - q * h;
        if (i === 0 && bend > 0 && to) {   // the lead wisp curls over toward Clawd's nose
          const c = arcPt([x + ox, top - 10], to, 170, q);
          px = lerp(px, c[0] + Math.sin(lt * 3 - q * 4) * 8, ease(bend)); py = lerp(py, c[1], ease(bend));
        }
        P.push([px, py]);
      }
      paint(ribbon(P, 26 * amt, 4), { wash: PAL.cream, washOp: 200, ink: mixCol(PAL.cream, PAL.ink, .35), sw: .45 });
    }
  }

  // ---------- the kitchen ----------
  // day 0 = dawn (opening), 1 = cold, washed-out daylight (the crash)
  function kitchen(t, day) {
    const wall = mixCol(mixCol(PAL.sky, PAL.paper, .55), mixCol(PAL.indigo, PAL.paper, .62), day);
    boilSeed('wall');
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: wall, ink: null });
    paint(ellPts(300, 1100, 520, 380, 24, 8), { fill: mixCol(wall, PAL.ink, .15), fillOp: 60, bleed: .3, tex: .6, ink: null });
    // window
    boilSeed('window');
    const sky = mixCol('#F4C9A8', mixCol(PAL.sky, PAL.paper, .3), day);
    paint(rrPts(170, 200, 740, 660, 18, 2), { wash: mixCol(PAL.cream, wall, .3), ink: PAL.ink, sw: 1.2 });
    paint(rectPts(210, 240, 660, 580, 2), { wash: sky, fill: day < .5 ? PAL.rose : PAL.sky, fillOp: 90, bleed: .2, tex: .6, ink: null });
    boilSeed('sun');
    const sunY = lerp(780, 400, day);
    paint(ellPts(640, sunY, 90, 90, 24, 1.5), { wash: mixCol(PAL.ochre, PAL.cream, .3 + .4 * day), ink: null });
    boilSeed('hills');
    paint(ellPts(330, 860, 300, 120, 26, 4), { wash: mixCol(PAL.sap, sky, .45), ink: null });
    paint(ellPts(760, 880, 280, 110, 26, 4), { wash: mixCol(PAL.teal, sky, .5), ink: null });
    boilSeed('frame');
    paint(rectPts(210, 240, 660, 580, 2), { ink: PAL.ink, sw: 1 });
    inkLine([[540, 244], [540, 818]], 1.1, PAL.ink, 'ink', 0);
    inkLine([[214, 530], [866, 530]], 1.1, PAL.ink, 'ink', 0);
    paint(rrPts(150, 840, 780, 44, 10, 1.5), { wash: mixCol(PAL.cream, wall, .2), ink: PAL.ink, sw: 1 });
    // a little plant on the sill
    boilSeed('plant');
    for (const [a, l] of [[-.5, 60], [0, 80], [.45, 62]]) paint(ribbon([[820, 840], [820 + Math.sin(a + wob(t, .4) * .05) * l, 840 - Math.cos(a) * l]], 22, 4), { wash: PAL.sap, ink: PAL.ink, sw: .6 });
    paint(rrPts(790, 820, 60, 50, 8), { wash: PAL.clayDk, ink: PAL.ink, sw: .8 });
    // counter
    boilSeed('counter');
    const front = mixCol(mixCol(PAL.teal, PAL.paper, .35), PAL.indigo, .25 * day);
    paint(rectPts(-100, G + 40, W + 200, H - G + 200, 3), { wash: front, fill: mixCol(front, PAL.ink, .2), fillOp: 70, bleed: .05, tex: .5, ink: null });
    for (const x of [30, 545]) paint(rrPts(x, G + 110, 505, 430, 16, 2), { fill: mixCol(front, PAL.ink, .25), fillOp: 70, bleed: .04, tex: .5, ink: PAL.ink, sw: .9 });
    for (const x of [470, 610]) paint(rrPts(x, G + 230, 18, 90, 8), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    paint(rectPts(-100, G - 20, W + 200, 64, 2), { wash: mixCol(PAL.cream, PAL.ochre, .25), fill: PAL.ochre, fillOp: 30, tex: .5, ink: null });
    inkLine([[-40, G - 20], [W / 2, G - 22], [W + 40, G - 19]], 1.1, PAL.ink, 'ink', .4);
    inkLine([[-40, G + 44], [W / 2, G + 42], [W + 40, G + 45]], 1.1, PAL.ink, 'ink', .4);
  }

  // where Clawd holds the mug while drinking (side view, body-local, in u)
  const HOLD = [3.5, -5.0];

  // ---------- shot A: before coffee ----------
  function shotA(t, lt, dur) {
    const tSniff = 2.3, tTurn = 2.72, tGrab = 2.86, tGot = 3.04, tDrink = 3.1, tDown = 3.72, tTake = 4.02, tFlash = 4.3;
    const flashK = seg(lt, tFlash, dur);
    const sh = lt > tTake ? shakeXY(t, 4 + 10 * seg(lt, tTake, dur)) : [0, 0];
    camBegin(540 + sh[0], kf(lt, [[0, 1070], [dur, 1100]]) + sh[1], kf(lt, [[0, 1.2], [tDrink, 1.26], [tTake, 1.32], [dur, 1.36]]));
    kitchen(t, 0);

    // Clawd
    const mood = emotions(lt, [[0, 'sleepy'], [tSniff, 'hopeful', { lookX: .9, lookY: .3, emote: null }],
      [tDrink, 'happy', { eyes: 'closed', mouth: 'o', emote: null }], [tDown, 'neutral', { eyes: 'blank', mouth: null }],
      [tTake, 'surprised', { emote: '!!' }]], { take: 1.2 });
    let pose = {};
    if (lt >= tTurn) pose = lt < tTurn + .14 ? turn(lt, tTurn, tTurn + .14, 0, .25) : { view: 'side' };
    if (lt >= tTurn) {   // the near arm reaches for the mug, then holds it up
      const reach = ease(seg(lt, tTurn, tGrab)), lift = backOut(seg(lt, tGot, tDrink + .1)), lower = ease(seg(lt, tDown - .1, tDown + .15));
      pose.aL = lerp(lerp(-.4, .3, reach), 1.15, lift) - .4 * lower;
    }
    const drinking = lt > tDrink && lt < tDown;
    const gulps = [3.25, 3.42, 3.59].reduce((s, g) => s + Math.max(0, Math.sin(clamp((lt - g) / .14) * Math.PI)), 0);
    const cl = { ...mood, ...pose, seed: 3 };
    if (drinking) { cl.rot = -.14 * ease(seg(lt, tDrink, tDrink + .2)); cl.dy = 0; cl.sq = .06 * gulps; cl.aR = .2; }
    if (lt > tDown && lt < tTake) { cl.rot = lerp(-.14, 0, ease(seg(lt, tDown, tDown + .2))); }
    if (lt > tTake) cl.dx = (cl.dx || 0) + Math.sin(lt * 90) * .12;   // buzzing
    // the mug rides on the body (o.draw) once it's in hand, so it follows every squash and lean
    const tilt = lt < tDrink ? -.15 : lt < tDown ? lerp(-.15, -1.05, ease(seg(lt, tDrink, tDrink + .25))) : lerp(-1.05, -.1, ease(seg(lt, tDown, tDown + .2)));
    const full = 1 - seg(lt, tDrink + .15, tDown);
    if (lt >= tGot) cl.draw = (u, sw) => { push(); translate(HOLD[0] * u, HOLD[1] * u); rotate(tilt + (lt > tTake ? Math.sin(lt * 70) * .05 : 0)); scale(u / U); mug(0, 0, 1, 0, { full, key: 'mugheld' }); pop(); };
    clawd(CX, G, U, cl);

    // the mug on the counter, then snatched in an arc into Clawd's hand
    if (lt < tGot) {
      const k = easeIn(seg(lt, tGrab, tGot)), p = arcPt([MUGX, G - 85], [CX + HOLD[0] * U, G + HOLD[1] * U], 90, k);
      mug(p[0], p[1], 1, lerp(0, -.15, k), { full: 1 });
      if (k > 0) for (let i = 1; i < 4; i++) { boilSeed('speed' + i); inkLine([[p[0] + 90 + i * 30, p[1] - 40 + i * 25], [p[0] + 170 + i * 40, p[1] - 40 + i * 25]], .7, PAL.ink, 'inkfine', 0); }
    }
    // steam: rises, curls to Clawd's nose, and is gone once the mug is snatched
    const nose = [CX + 2.4 * U, G - 5.2 * U];
    if (lt < tGot) steam(MUGX, G - 170, lt, seg(lt, .2, 1.2) * (1 - seg(lt, tGrab, tGot)), seg(lt, 1.4, 2.3), nose);

    const eye = toScreen(600, G - 190);   // between Clawd and the mug: the iris frames both
    camEnd();
    if (lt < .6) iris(...eye, lerp(0, 1700, easeIn(lt / .6)));   // the loop opens on the iris the end closes with
    flash(flashK * flashK, PAL.cream);
  }

  // ---------- shot B: supercharged ----------
  function shotB(t, lt, dur) {
    const u = 50, gx = 540, gy = 1380;
    const tThrow = .35, tHop = 1.1, tSpin = 2.7, tLeap = 4.05;
    const beat = pulse(t, 5), sh = shakeXY(t, 6 + 8 * beat);
    camBegin(540 + sh[0], 980 + sh[1], 1.0 + .03 * beat + .05 * seg(lt, tSpin, tLeap));
    // the energy burst: rays turning around Clawd, flaring on every beat
    boilSeed('burst');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: mixCol(PAL.cream, PAL.ochre, .2), ink: null });
    const c = [gx, gy - 4 * u], n = 14, spin = lt * .7 + lt * lt * .12;
    for (let i = 0; i < n; i += 2) {
      boilSeed('ray' + i);
      const a = spin + i * TAU / n, b = a + TAU / n;
      paint([c, [c[0] + Math.cos(a) * 2600, c[1] + Math.sin(a) * 2600], [c[0] + Math.cos(b) * 2600, c[1] + Math.sin(b) * 2600]], { wash: mixCol(PAL.violet, PAL.rose, .25 + .45 * beat), ink: null });
    }
    glow(c[0], c[1], 520 + 160 * beat, '#FFE6A0', .55);
    boilSeed('rings');
    for (let k = 0; k < 3; k++) { const r = 180 + 520 * frac(lt * .9 + k / 3); paint(ellPts(c[0], c[1], r, r, 36, 4), { ink: PAL.cream, sw: 1.4 * (1 - r / 700) + .2 }); }
    boilSeed('spot');
    paint(ellPts(gx, gy + 30, 420, 80, 30, 3), { wash: mixCol(PAL.indigo, PAL.violet, .4), ink: PAL.ink, sw: 1 });

    const mood = emotions(lt, [[0, 'starstruck', { emote: '!!' }], [tHop - .05, 'excited'], [tSpin, 'starstruck', { emote: 'stars' }]], { take: .8 });
    const cl = { ...mood, seed: 3 };
    if (lt < tHop) { cl.dx = (mood.dx || 0) + Math.sin(lt * 80) * .15; cl.aR = lt < tThrow ? lerp(.6, 1.3, ease(seg(lt, .1, tThrow))) : lerp(1.6, .6, ease(seg(lt, tThrow, tThrow + .4))); }
    else if (lt < tSpin) {   // hops on the beat, each higher than the last
      const hops = [[tHop, 1.55, 2.2], [1.6, 2.05, 3.2], [2.1, 2.6, 4.4]];
      let j = { dy: 0, sq: 0 }; for (const [a, b, h] of hops) if (lt > a - .15 && lt < b + .2) j = jump(lt, a, b, h);
      cl.dy = j.dy; cl.sq = j.sq; cl.aL = cl.aR = .4 + 1.0 * Math.min(1, -j.dy / 2);
    } else if (lt < tLeap) {   // a drawn spin that keeps speeding up
      const s = lt - tSpin, head = s * 1.2 + s * s * 1.6, speed = 1.2 + 3.2 * s;
      Object.assign(cl, spinView(head)); cl.smear = clamp((speed - 2) / 3) * .8; cl.smearDir = 0;
      cl.dy = -Math.abs(Math.sin(head * TAU)) * .8; cl.aL = cl.aR = .8 + .5 * Math.sin(head * TAU * 2);
    } else {   // crouch, then launch straight up out of the top of the frame
      const s = lt - tLeap;
      cl.sq = s < .15 ? .25 * ease(s / .15) : -.35 * (1 - seg(s, .15, .5));
      cl.dy = s < .15 ? 0 : -60 * easeIn(seg(s, .15, .75)); cl.aL = cl.aR = s < .15 ? -.5 : 1.5;
      cl.smear = s > .15 ? .6 : 0; cl.smearDir = 0; cl.noShadow = s > .3;
    }
    clawd(gx, gy, u, cl);
    // the mug: in Clawd's raised hand, then flung away spinning
    if (lt < tThrow) {
      const a = cl.aR ?? .2, tip = [gx + (cl.dx || 0) * u + 5.45 * u + Math.cos(a) * 2.2 * u, gy + (cl.dy || 0) * u - 4.5 * u - Math.sin(a) * 2.2 * u];
      mug(tip[0] + 20, tip[1] - 40, u / U, .2, { full: 0 });
    } else if (lt < tThrow + .9) {
      const k = seg(lt, tThrow, tThrow + .9), p = arcPt([gx + 7 * u, gy - 8 * u], [1350, -250], 450, k);
      mug(p[0], p[1], u / U * (1 - .3 * k), .2 + k * 14, { full: 0 });
    }
    camEnd();
    flash(Math.pow(1 - seg(lt, 0, .3), 2), PAL.cream);
    boilSeed('transition');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, CRASH);
  }

  // ---------- shot C: the crash ----------
  function shotC(t, lt, dur) {
    const tLand = .55, tMug = 1.05, tDizzy = 1.35, tDrain = 2.5, tSteam = 3.55, tPeek = 4.25, tIris = 4.4;
    camBegin(540, kf(lt, [[0, 1070], [dur, 1090]]), kf(lt, [[0, 1.2], [tIris, 1.26]]));
    kitchen(t, 1);

    const mood = emotions(lt, [[0, 'excited'], [tDizzy, 'dizzy'], [tDrain, 'sleepy'],
      [tPeek, 'sleepy', { eyes: ['sleepy', 'wide'], lookX: 1, lookY: .2, emote: null }]], { take: .8 });
    const cl = { ...mood, seed: 3 };
    if (lt < tLand) { cl.dy = -40 * Math.pow(1 - lt / tLand, 2); cl.sq = -.2; cl.aL = cl.aR = 1.4; cl.noShadow = lt < .3; }
    else {
      const a = lt - tLand; cl.sq = (mood.sq || 0) + .3 * Math.exp(-a * 7) * Math.cos(a * 18);
      if (lt < tDizzy) cl.dy = (mood.dy || 0) * seg(lt, tLand + .2, tDizzy);
    }
    if (lt > tDrain) {   // the battery drains: a slow melt down into the opening's slump
      const m = ease(seg(lt, tDrain, tDrain + 1.0));
      cl.sq = (cl.sq || 0) + .14 * m; cl.gloom = .35 * m * (1 - seg(lt, tPeek, tPeek + .3)); cl.tint = 'blue'; cl.tintK = .35 * m;
    }
    const shake = lt > tLand && lt < tLand + .25 ? shakeXY(t, 8 * (1 - (lt - tLand) / .25)) : [0, 0];
    clawd(CX + shake[0], G, U, cl);

    // the mug falls back out of the sky and lands upright on its spot, empty… until the steam comes back
    const mk = seg(lt, tLand + .05, tMug);
    if (lt > tLand + .05) {
      const y = lt < tMug ? lerp(-300, G - 85, easeIn(mk)) : G - 85, a = lt - tMug, bounce = lt > tMug ? Math.exp(-a * 8) * Math.cos(a * 22) : 0;
      mug(MUGX, y - Math.max(0, bounce) * 30, 1, lt < tMug ? (1 - mk) * 5 : .08 * Math.sin(a * 20) * Math.exp(-a * 6), { full: seg(lt, tSteam, tSteam + .4) });
      if (lt > tMug && lt < tMug + .35) { boilSeed('clink'); const q = seg(lt, tMug, tMug + .35); for (let i = 0; i < 5; i++) { const ang = Math.PI + .3 + i * .6; inkLine([[MUGX + Math.cos(ang) * (90 + 40 * q), G - 10 + Math.sin(ang) * (30 + 20 * q)], [MUGX + Math.cos(ang) * (110 + 60 * q), G - 10 + Math.sin(ang) * (40 + 30 * q)]], .9 * (1 - q), PAL.ink, 'inkfine', 0); } }
    }
    steam(MUGX, G - 170, lt, seg(lt, tSteam, tSteam + .7));

    const eye = toScreen(600, G - 190);
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, CRASH);
    if (lt > tIris) {
      const r = lt < tIris + .35 ? lerp(1700, 560, ease(seg(lt, tIris, tIris + .35))) : lt < dur - .3 ? lerp(560, 530, seg(lt, tIris + .35, dur - .3)) : lerp(530, 0, easeIn(seg(lt, dur - .3, dur - .02)));
      iris(...eye, r);
    }
  }

  shots([[0, shotA], [4.5, shotB], [9.3, shotC]]);
})();
