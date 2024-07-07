import { onMounted, onBeforeUnmount, defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { C as CustomButton, _ as _export_sfc } from "../main.mjs";
import { u as useSeatSizeStore } from "./useSeatSizeStore-CSBNU2BA.js";
import { storeToRefs } from "pinia";
import confetti from "canvas-confetti";
import "vite-ssg";
import "vue-router";
import "@unhead/vue";
import "pinia-plugin-persistedstate";
const waitMs = (ms) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  })
);
const useEventListener = (instance = window, type, listener) => {
  onMounted(() => instance.addEventListener(type, listener));
  onBeforeUnmount(() => instance.removeEventListener(type, listener));
};
const DEFAULT_SHUFFLE_DELAY_MS = 50, SHUFFLE_DELAY_START_AFTER_NUMBERS = 50, SHUFFLE_DELAY_INCREASE = 1.025, SHUFFLE_END_DELAY = 950;
const SHUFFLE_SOUND_VOLUME = 5, SHUFFLE_SOUND_PLAYBACK_RATE = 3, SHUFFLE_DONE_SOUND_PLAYBACK_RATE = 1.5;
const ROULETTE_AUDIO_LOCATION = "/sounds/roulette.mp3", ROULETTE_DONE_AUDIO_LOCATION = "/sounds/roulette-done.mp3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RandomPickSeat",
  __ssrInlineRender: true,
  setup(__props) {
    let audioContext, gainNode;
    let rouletteAudioBuffer, rouletteDoneAudioBuffer;
    let isUnmounted = false;
    const seatSizeStore = useSeatSizeStore();
    const { shuffleSeats } = seatSizeStore;
    const { seatData } = storeToRefs(seatSizeStore);
    const pickingState = ref("initial");
    const confettiCanvas = ref(null);
    let confettiInstance;
    onMounted(() => {
      if (confettiCanvas.value === null)
        return;
      confettiInstance = confetti.create(confettiCanvas.value, {
        resize: true,
        useWorker: true
      });
    });
    onBeforeUnmount(() => confettiInstance.reset());
    const launchConfetti = () => confettiInstance({
      scalar: 1.5,
      shapes: ["circle"],
      spread: 300,
      particleCount: 250,
      origin: {
        x: 0.5,
        y: 0.5
      }
    });
    const startRandomPick = async () => {
      if (pickingState.value === "picking")
        return;
      pickingState.value = "picking";
      let shuffleDelay = DEFAULT_SHUFFLE_DELAY_MS, startDelayRemaining = SHUFFLE_DELAY_START_AFTER_NUMBERS;
      while (!isUnmounted && shuffleDelay <= SHUFFLE_END_DELAY) {
        shuffleSeats();
        playSound(rouletteAudioBuffer, { playbackRate: SHUFFLE_SOUND_PLAYBACK_RATE });
        await waitMs(shuffleDelay);
        if (startDelayRemaining <= 0)
          shuffleDelay **= SHUFFLE_DELAY_INCREASE;
        else
          startDelayRemaining--;
      }
      if (!isUnmounted) {
        playSound(rouletteDoneAudioBuffer, { playbackRate: SHUFFLE_DONE_SOUND_PLAYBACK_RATE });
        pickingState.value = "done";
        launchConfetti();
      } else {
        pickingState.value = "idle";
      }
    };
    const playSound = (buffer, options) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      if (options == null ? void 0 : options.playbackRate)
        source.playbackRate.value = options.playbackRate;
      source.connect(gainNode);
      source.start();
    };
    const loadAudioBuffer = async (fileUrl) => {
      const response = await fetch(fileUrl);
      const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer());
      return audioBuffer;
    };
    onMounted(async () => {
      audioContext = new AudioContext();
      gainNode = audioContext.createGain();
      gainNode.gain.value = SHUFFLE_SOUND_VOLUME;
      gainNode.connect(audioContext.destination);
      rouletteAudioBuffer = await loadAudioBuffer(ROULETTE_AUDIO_LOCATION);
      rouletteDoneAudioBuffer = await loadAudioBuffer(ROULETTE_DONE_AUDIO_LOCATION);
    });
    onBeforeUnmount(() => isUnmounted = true);
    const containerRef = ref(null), isFullscreen = ref(false);
    const toggleFullscreen = () => {
      var _a;
      if (document.fullscreenElement === null)
        (_a = containerRef.value) == null ? void 0 : _a.requestFullscreen({
          navigationUI: "hide"
        });
      else
        document.exitFullscreen();
    };
    useEventListener(
      document,
      "fullscreenchange",
      () => isFullscreen.value = document.fullscreenElement !== null
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.container,
        ref_key: "containerRef",
        ref: containerRef
      }, _attrs))}><canvas class="${ssrRenderClass(_ctx.$style["confetti-canvas"])}"></canvas><div class="${ssrRenderClass(_ctx.$style["scroll-view-container"])}"><div class="${ssrRenderClass([_ctx.$style["table-container"], { [_ctx.$style.done]: pickingState.value === "done" }])}"><span class="${ssrRenderClass(_ctx.$style["top-indicator"])}"></span><div class="${ssrRenderClass(_ctx.$style.table)}"><!--[-->`);
      ssrRenderList(unref(seatData), (row2, rowIndex) => {
        _push(`<div class="${ssrRenderClass(_ctx.$style.row)}"><!--[-->`);
        ssrRenderList(row2, (column, columnIndex) => {
          _push(`<div class="${ssrRenderClass([_ctx.$style.seat, { [_ctx.$style.excluded]: column.isExcluded }])}">${ssrInterpolate(column.assignedNumber)}</div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div><div class="${ssrRenderClass(_ctx.$style["button-container"])}">`);
      _push(ssrRenderComponent(CustomButton, { onClick: toggleFullscreen }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(!isFullscreen.value ? "전체화면으로 보기" : "전체화면 나가기")}`);
          } else {
            return [
              createTextVNode(toDisplayString(!isFullscreen.value ? "전체화면으로 보기" : "전체화면 나가기"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(CustomButton, {
        onClick: startRandomPick,
        disabled: pickingState.value === "picking",
        loading: pickingState.value === "picking"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`뽑기`);
          } else {
            return [
              createTextVNode("뽑기")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></main>`);
    };
  }
});
const container = "_container_11p3y_1";
const done = "_done_11p3y_44";
const table = "_table_11p3y_33";
const row = "_row_11p3y_68";
const seat = "_seat_11p3y_73";
const excluded = "_excluded_11p3y_85";
const style0 = {
  container,
  "confetti-canvas": "_confetti-canvas_11p3y_13",
  "scroll-view-container": "_scroll-view-container_11p3y_23",
  "table-container": "_table-container_11p3y_33",
  done,
  "roulette-done-animation": "_roulette-done-animation_11p3y_1",
  "top-indicator": "_top-indicator_11p3y_56",
  table,
  row,
  seat,
  excluded,
  "button-container": "_button-container_11p3y_100"
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/sections/RandomPickSeat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RandomPickSeat = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  RandomPickSeat as default
};
