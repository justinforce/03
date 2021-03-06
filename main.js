import { setter } from "./state";
import { times } from "./utility";
import * as Background from "./Background";
import * as Balls from "./Balls";
import * as Texture from "./Texture";
import * as Timing from "./Timing";
import draw from "./drawing";

import BEACH_SRC from "./beach.jpg";

const TEXTURE_SRC = BEACH_SRC;
const TEXTURE_ENABLED = false;

const IDEAL_FRAMES_PER_SECOND = 60;
const IDEAL_STEPS_PER_FRAME = 1;
const MAX_FRAME_SKIP = 2;
const WIDTH = 192;
const HEIGHT = 108;
const MAX_BALLS = 100;
const BALL_COLORS = ["white", "cyan", "magenta", "yellow"];

const update = (state, timestamp) => {
  const { width, height, timing, texture, balls } = state;
  Timing.update({
    timing,
    timestamp,
    set: setter(timing)
  });
  times(timing.steps, () => {
    Texture.update({ texture, width, height, timing, set: setter(texture) });
    Balls.update({ balls, width, height, timing, set: setter(balls) });
  });
};

const step = state => timestamp => {
  update(state, timestamp);
  draw(state);
  window.requestAnimationFrame(step(state));
};

const initialState = () => {
  const [width, height] = [WIDTH, HEIGHT];
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const now = performance.now();
  const timing = Timing.initialState(
    IDEAL_FRAMES_PER_SECOND,
    IDEAL_STEPS_PER_FRAME,
    MAX_FRAME_SKIP,
    now
  );
  const background = Background.initialState("#334", WIDTH, HEIGHT);
  const texture = Texture.initialState({
    width: WIDTH,
    height: HEIGHT,
    src: TEXTURE_SRC,
    enabled: TEXTURE_ENABLED
  });
  const balls = Balls.initialState(MAX_BALLS, WIDTH, HEIGHT, BALL_COLORS);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  return {
    background,
    balls,
    canvas,
    ctx,
    height,
    texture,
    timing,
    width
  };
};

const state = initialState();
window.requestAnimationFrame(step(state));
