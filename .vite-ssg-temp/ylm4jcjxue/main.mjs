import { ViteSSG } from "vite-ssg";
import { defineStore, storeToRefs, createPinia } from "pinia";
import { resolveComponent, useSSRContext, defineComponent, mergeProps, unref, withCtx, createTextVNode, defineAsyncComponent, computed, ref, watch, createVNode, openBlock, createBlock, toDisplayString, resolveDynamicComponent } from "vue";
import { ssrRenderComponent, ssrRenderSlotInner, ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderVNode } from "vue/server-renderer";
import { createRouter, createWebHistory } from "vue-router";
import { useHead } from "@unhead/vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$8 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_RouterView = resolveComponent("RouterView");
  _push(ssrRenderComponent(_component_RouterView, _attrs, null, _parent));
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SlideTransition",
  __ssrInlineRender: true,
  props: {
    enterY: { default: "10px" },
    duration: { default: 0.4 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ({ style: {
        "--536293f2": _ctx.$props.enterY,
        "--0bd6f4c5": _ctx.$props.duration
      } });
      ssrRenderSlotInner(_ctx.$slots, "default", {}, null, _push, _parent, null, true);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/common/SlideTransition.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const SlideTransition = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-365948d4"]]);
const container$4 = "_container_uqyja_1";
const indicator = "_indicator_uqyja_12";
const style0$5 = {
  container: container$4,
  indicator,
  "loading-animation": "_loading-animation_uqyja_1"
};
const _sfc_main$6 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: _ctx.$style.container
  }, _attrs))}><span class="${ssrRenderClass(_ctx.$style.indicator)}"></span></div>`);
}
const cssModules$5 = {
  "$style": style0$5
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/common/LoadingIndicator.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const LoadingIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$1], ["__cssModules", cssModules$5]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ShadowButton",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    warning: { type: Boolean },
    loading: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.container
      }, _attrs))}><button${ssrRenderAttrs(mergeProps(_ctx.$props, {
        class: [_ctx.$style.button, { [_ctx.$style.warning]: _ctx.warning }, { [_ctx.$style.loading]: _ctx.loading }]
      }))}><div class="${ssrRenderClass(_ctx.$style.slot)}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      if (_ctx.loading) {
        _push(ssrRenderComponent(LoadingIndicator, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div>`);
    };
  }
});
const container$3 = "_container_1kql4_1";
const button$1 = "_button_1kql4_13";
const warning = "_warning_1kql4_26";
const loading = "_loading_1kql4_39";
const slot = "_slot_1kql4_39";
const style0$4 = {
  container: container$3,
  button: button$1,
  warning,
  loading,
  slot
};
const cssModules$4 = {
  "$style": style0$4
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/common/ShadowButton.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const CustomButton = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__cssModules", cssModules$4]]);
const _sfc_main$4 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 98 96"
  }, _attrs))}><path fill="currentColor" fill-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" clip-rule="evenodd"></path></svg>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/GitHubIcon.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const GitHubIcon = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender]]);
const PROJECT_REPO_URL = "https://github.com/pyj-pd/random-seat";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "MainView",
  __ssrInlineRender: true,
  setup(__props) {
    const { setCurrentSectionId } = useSectionStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.container
      }, _attrs))}><h2 class="${ssrRenderClass(_ctx.$style.title)}">무작위 자리 뽑기</h2><div class="${ssrRenderClass(_ctx.$style["button-container"])}">`);
      _push(ssrRenderComponent(CustomButton, {
        onClick: () => unref(setCurrentSectionId)("size-settings")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`시작하기`);
          } else {
            return [
              createTextVNode("시작하기")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass(_ctx.$style["link-container"])}"><a${ssrRenderAttr("href", unref(PROJECT_REPO_URL))} target="_blank">`);
      _push(ssrRenderComponent(GitHubIcon, { height: 17 }, null, _parent));
      _push(`</a></div></main>`);
    };
  }
});
const container$2 = "_container_1b03m_1";
const title = "_title_1b03m_8";
const style0$3 = {
  container: container$2,
  title,
  "title-animation": "_title-animation_1b03m_1",
  "button-container": "_button-container_1b03m_24",
  "link-container": "_link-container_1b03m_25"
};
const cssModules$3 = {
  "$style": style0$3
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/sections/MainView.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const MainView = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__cssModules", cssModules$3]]);
const sections = {
  "main-view": {
    title: "메인 화면",
    showTitle: false,
    component: MainView,
    fullscreen: false
  },
  "size-settings": {
    title: "행과 열 설정",
    component: defineAsyncComponent(() => import("./assets/SizeSettings-DVgDLlPd.js"))
  },
  "random-pick-seat": {
    title: "무작위 자리 뽑기",
    component: defineAsyncComponent(() => import("./assets/RandomPickSeat-DVrlFEZV.js"))
  }
};
const defaultSectionId = "main-view";
const useSectionStore = defineStore("section", {
  state: () => ({
    currentSectionId: defaultSectionId,
    sectionHistory: []
  }),
  getters: {
    currentSectionData: (state) => sections[state.currentSectionId]
  },
  actions: {
    /**
     * Set section id, and add the section id to navigation history.
     * @param sectionId Section id to set to.
     * @param history Whether to save into the navigation history.
     */
    setCurrentSectionId(sectionId, history = true) {
      if (history)
        this.sectionHistory.push(this.currentSectionId);
      this.currentSectionId = sectionId;
    },
    /**
     * Navigate to the last section saved in the navigation history.
     */
    navigateToLastSection() {
      if (this.sectionHistory.length < 1)
        return;
      const lastSectionId = this.sectionHistory[this.sectionHistory.length - 1];
      this.sectionHistory.splice(this.sectionHistory.length - 1, 1);
      this.setCurrentSectionId(lastSectionId, false);
    }
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "NormalButton",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    animation: { type: Boolean, default: true },
    vertical: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps(_ctx.$props, {
        class: [
          _ctx.$style.button,
          { [_ctx.$style.animated]: _ctx.$props.animation },
          { [_ctx.$style.vertical]: _ctx.$props.vertical }
        ]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const button = "_button_db7dh_1";
const animated = "_animated_db7dh_15";
const vertical = "_vertical_db7dh_31";
const style0$2 = {
  button,
  animated,
  vertical
};
const cssModules$2 = {
  "$style": style0$2
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/common/NormalButton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const NormalButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__cssModules", cssModules$2]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NavigationBar",
  __ssrInlineRender: true,
  setup(__props) {
    const sectionStore = useSectionStore();
    const { navigateToLastSection } = sectionStore;
    const { currentSectionId, currentSectionData } = storeToRefs(sectionStore);
    const isBackButtonVisible = computed(() => currentSectionId.value !== defaultSectionId);
    const titleRefresh = ref(0);
    watch(currentSectionId, () => {
      titleRefresh.value++;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.container
      }, _attrs))} data-v-3c34f260><div class="${ssrRenderClass(_ctx.$style["back-button-container"])}" data-v-3c34f260>`);
      if (isBackButtonVisible.value) {
        _push(ssrRenderComponent(NormalButton, {
          onClick: unref(navigateToLastSection),
          "aria-label": "뒤로가기",
          class: _ctx.$style["back-button"],
          animation: false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass(_ctx.$style["back-arrow-icon"])}" data-v-3c34f260${_scopeId}></span>`);
            } else {
              return [
                createVNode("span", {
                  class: _ctx.$style["back-arrow-icon"]
                }, null, 2)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass(_ctx.$style["title-container"])}" data-v-3c34f260>`);
      _push(ssrRenderComponent(SlideTransition, { "enter-y": "5px" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="${ssrRenderClass(_ctx.$style["section-title"])}" data-v-3c34f260${_scopeId}>${ssrInterpolate(unref(currentSectionData).title)}</span>`);
          } else {
            return [
              (openBlock(), createBlock("span", {
                key: titleRefresh.value,
                class: _ctx.$style["section-title"]
              }, toDisplayString(unref(currentSectionData).title), 3))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const container$1 = "_container_1ws7e_1";
const style0$1 = {
  container: container$1,
  "back-button-container": "_back-button-container_1ws7e_10",
  "back-button": "_back-button_1ws7e_10",
  "back-arrow-icon": "_back-arrow-icon_1ws7e_23",
  "title-container": "_title-container_1ws7e_32",
  "section-title": "_section-title_1ws7e_36"
};
const cssModules$1 = {
  "$style": style0$1
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/NavigationBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const NavigationBar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__cssModules", cssModules$1], ["__scopeId", "data-v-3c34f260"]]);
const DEFAULT_SEAT_DATA = {
  assignedNumber: null,
  isExcluded: false
};
const initializeSeatData = (columnSize, rowSize, originalData) => {
  if (originalData === void 0)
    return [...new Array(rowSize)].map(() => Array(columnSize).fill(DEFAULT_SEAT_DATA));
  if (originalData.length < rowSize)
    originalData.unshift(
      ...Array(rowSize - originalData.length).fill(
        Array(columnSize).fill(DEFAULT_SEAT_DATA)
      )
    );
  else if (originalData.length > rowSize)
    originalData.splice(rowSize);
  const newSeatData = originalData.map((row) => {
    const newRow = [...row];
    if (newRow.length < columnSize) {
      newRow.push(...Array(columnSize - newRow.length).fill(DEFAULT_SEAT_DATA));
    } else if (newRow.length > columnSize) {
      newRow.splice(columnSize);
    }
    return newRow;
  });
  return newSeatData;
};
const getTotalNumberOfSeats = (data) => data.flat().filter((seat) => !seat.isExcluded).length;
const getShuffledSeatData = (data) => {
  const totalNumber = getTotalNumberOfSeats(data);
  const randomNumbers = Array.from(Array(totalNumber).keys(), (n) => n + 1);
  randomNumbers.sort(() => Math.random() - 0.5);
  let currentIndex = 0;
  const newData = data.map(
    (row) => row.map((seat) => {
      if (seat.isExcluded)
        return { ...seat, assignedNumber: null };
      const newSeat = {
        ...seat,
        assignedNumber: randomNumbers[currentIndex]
      };
      currentIndex++;
      return newSeat;
    })
  );
  return newData;
};
const DEFAULT_COLUMN_SIZE = 6, DEFAULT_ROW_SIZE = 5, DEFAULT_SEAT_ROW_DATA = initializeSeatData(DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE);
const MAX_SEAT_COLUMN_SIZE = 10, MIN_SEAT_COLUMN_SIZE = 2;
const MAX_SEAT_ROW_SIZE = 10, MIN_SEAT_ROW_SIZE = 2;
const MIN_SEAT_NUMBER = 2;
const SEAT_DATA_LOCAL_STORAGE_KEY = "seat-data-state";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HomeView",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "무작위 자리 뽑기",
      meta: [
        {
          name: "description",
          content: `최대 ${MAX_SEAT_COLUMN_SIZE}×${MAX_SEAT_ROW_SIZE} 크기의 자리를 무작위로 배치해 보세요.`
        }
      ],
      link: [
        {
          rel: "icon",
          href: "/favicon.svg"
        }
      ]
    });
    const sectionStore = useSectionStore();
    const { currentSectionId, currentSectionData } = storeToRefs(sectionStore);
    watch(currentSectionId, () => {
      window.scrollTo({
        top: 0
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.container
      }, _attrs))}>`);
      _push(ssrRenderComponent(NavigationBar, null, null, _parent));
      _push(`<div class="${ssrRenderClass(_ctx.$style["view-container"])}">`);
      _push(ssrRenderComponent(SlideTransition, {
        class: _ctx.$style.view
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(currentSectionData).component), null, null), _parent2, _scopeId);
          } else {
            return [
              (openBlock(), createBlock(resolveDynamicComponent(unref(currentSectionData).component)))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const container = "_container_x4pua_1";
const view = "_view_x4pua_9";
const style0 = {
  container,
  "view-container": "_view-container_x4pua_9",
  view
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/HomeView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  }
];
createRouter({
  history: createWebHistory("/"),
  routes
});
const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, routes: routes2, isClient, initialState }) => {
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
  }
);
export {
  CustomButton as C,
  DEFAULT_COLUMN_SIZE as D,
  MAX_SEAT_ROW_SIZE as M,
  NormalButton as N,
  SEAT_DATA_LOCAL_STORAGE_KEY as S,
  _export_sfc as _,
  MAX_SEAT_COLUMN_SIZE as a,
  MIN_SEAT_NUMBER as b,
  DEFAULT_ROW_SIZE as c,
  createApp,
  DEFAULT_SEAT_ROW_DATA as d,
  getShuffledSeatData as e,
  MIN_SEAT_COLUMN_SIZE as f,
  getTotalNumberOfSeats as g,
  MIN_SEAT_ROW_SIZE as h,
  initializeSeatData as i,
  useSectionStore as u
};
