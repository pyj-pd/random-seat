import { mergeProps, useSSRContext, defineComponent, ref, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, Fragment } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc, u as useSectionStore, N as NormalButton, M as MAX_SEAT_ROW_SIZE, a as MAX_SEAT_COLUMN_SIZE, C as CustomButton, b as MIN_SEAT_NUMBER, D as DEFAULT_COLUMN_SIZE, c as DEFAULT_ROW_SIZE } from "../main.mjs";
import { u as useSeatSizeStore } from "./useSeatSizeStore-CSBNU2BA.js";
import { storeToRefs } from "pinia";
import "vite-ssg";
import "vue-router";
import "@unhead/vue";
import "pinia-plugin-persistedstate";
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    xmlns: "http://www.w3.org/2000/svg",
    overflow: "visible",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "50",
    viewBox: "509 149 500 515"
  }, _attrs))}><path d="M1009 664c-.305-137.807-112.209-249.594-250-249.594S509.305 526.193 509 664h500Z" class="fills"></path><path d="M1009 664c-.305-137.807-112.209-249.594-250-249.594S509.305 526.193 509 664h500Z"></path><ellipse cx="759.001" cy="281.703" rx="132.619" ry="132.703"></ellipse><g class="strokes"><g class="inner-stroke-shape"><defs><clipPath id="d"><use href="#c"></use></clipPath><ellipse id="c" cx="759.001" cy="281.703" rx="132.619" ry="132.703"></ellipse></defs><use clip-path="url(&#39;#d&#39;)" href="#c"></use></g></g></svg>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/PersonIcon.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PersonIcon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const svg = "_svg_1xzc4_1";
const style0$1 = {
  svg
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    class: _ctx.$style.svg,
    viewBox: "0 0 100 100",
    xmlns: "http://www.w3.org/2000/svg",
    preserveAspectRatio: "none",
    fill: "transparent",
    stroke: "currentColor",
    "stroke-width": "10"
  }, _attrs))}><path d="M0,0 L100,100 Z"></path><path d="M0,100 L100,0 Z"></path></svg>`);
}
const cssModules$1 = {
  "$style": style0$1
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/XShape.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const XShape = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__cssModules", cssModules$1]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SizeSettings",
  __ssrInlineRender: true,
  setup(__props) {
    const seatSizeStore = useSeatSizeStore();
    const { setSize, setSeatData, removeSeatLine } = seatSizeStore;
    const { setCurrentSectionId } = useSectionStore();
    const { columnSize, rowSize, seatData, getSeatData, totalSeatNumber } = storeToRefs(seatSizeStore);
    const rowUpdateRefresh = ref(null), columnUpdateRefresh = ref(null);
    const toggleSeat = (position) => {
      if (totalSeatNumber.value <= MIN_SEAT_NUMBER)
        return;
      const currentSeatData = getSeatData.value(position);
      setSeatData(position, { ...currentSeatData, isExcluded: !currentSeatData.isExcluded });
    };
    const resetSeatData = () => {
      setSize(DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE, false);
      rowUpdateRefresh.value = null;
      columnUpdateRefresh.value = null;
    };
    const addRow = () => {
      setSize(columnSize.value, rowSize.value + 1, true);
      rowUpdateRefresh.value ?? (rowUpdateRefresh.value = 0);
      rowUpdateRefresh.value++;
      columnUpdateRefresh.value = null;
    }, addColumn = () => {
      setSize(columnSize.value + 1, rowSize.value, true);
      rowUpdateRefresh.value = null;
      columnUpdateRefresh.value ?? (columnUpdateRefresh.value = 0);
      columnUpdateRefresh.value++;
    };
    const removeRow = (index) => {
      removeSeatLine("row", index);
      rowUpdateRefresh.value = null;
    }, removeColumn = (index) => {
      removeSeatLine("column", index);
      columnUpdateRefresh.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.container
      }, _attrs))}><div class="${ssrRenderClass(_ctx.$style.title)}"><h2>제외하고 싶은 자리를 클릭해주세요.</h2><p> 자리를 눌러 해당 자리를 제외할 수 있으며<br>행과 열 숫자를 클릭해 해당 줄을 삭제할 수 있습니다. </p></div><div class="${ssrRenderClass(_ctx.$style["table-scroll-view-container"])}"><div class="${ssrRenderClass(_ctx.$style["table-container"])}"><div class="${ssrRenderClass(_ctx.$style["table-info-container"])}"><div class="${ssrRenderClass(_ctx.$style["seat-number"])}"><span>자리 수: <b>${ssrInterpolate(unref(totalSeatNumber))}/${ssrInterpolate(unref(columnSize) * unref(rowSize))}석</b></span></div><div class="${ssrRenderClass(_ctx.$style["table-top"])}"><span>상단</span></div></div><table class="${ssrRenderClass(_ctx.$style.table)}"><tr><th scope="col" class="${ssrRenderClass(_ctx.$style["no-style"])}"></th><!--[-->`);
      ssrRenderList(unref(columnSize), (column) => {
        _push(`<th scope="col">`);
        _push(ssrRenderComponent(NormalButton, {
          onClick: () => removeColumn(column - 1),
          class: _ctx.$style["header-button"],
          animation: false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(column)}`);
            } else {
              return [
                createTextVNode(toDisplayString(column), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</th>`);
      });
      _push(`<!--]--></tr><tr><td class="${ssrRenderClass(_ctx.$style["no-style"])}"></td>`);
      if (unref(rowSize) < unref(MAX_SEAT_ROW_SIZE)) {
        _push(`<td${ssrRenderAttr("colspan", unref(columnSize))} class="${ssrRenderClass(_ctx.$style["line-button-container"])}">`);
        _push(ssrRenderComponent(NormalButton, {
          onClick: addRow,
          class: _ctx.$style["line-button"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`+`);
            } else {
              return [
                createTextVNode("+")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</td>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tr><!--[-->`);
      ssrRenderList(unref(seatData), (row, rowIndex) => {
        _push(`<tr><th scope="row">`);
        _push(ssrRenderComponent(NormalButton, {
          onClick: () => removeRow(rowIndex),
          class: _ctx.$style["header-button"],
          animation: false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(rowIndex + 1)}`);
            } else {
              return [
                createTextVNode(toDisplayString(rowIndex + 1), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</th><!--[-->`);
        ssrRenderList(row, (column, columnIndex) => {
          _push(`<td>`);
          _push(ssrRenderComponent(NormalButton, {
            onClick: () => toggleSeat([columnIndex, rowIndex]),
            class: [
              _ctx.$style["seat-button"],
              {
                [_ctx.$style.new]: rowIndex === 0 && rowUpdateRefresh.value !== null || columnIndex === unref(columnSize) - 1 && columnUpdateRefresh.value !== null
              },
              {
                [_ctx.$style.excluded]: column.isExcluded
              }
            ],
            key: rowUpdateRefresh.value ?? columnUpdateRefresh.value ?? 0,
            animation: false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (column.assignedNumber) {
                  _push2(`<!--[-->${ssrInterpolate(column.assignedNumber)}<!--]-->`);
                } else if (!column.isExcluded) {
                  _push2(ssrRenderComponent(PersonIcon, null, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(XShape, {
                    class: _ctx.$style["x-shape"]
                  }, null, _parent2, _scopeId));
                }
              } else {
                return [
                  column.assignedNumber ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createTextVNode(toDisplayString(column.assignedNumber), 1)
                  ], 64)) : !column.isExcluded ? (openBlock(), createBlock(PersonIcon, { key: 1 })) : (openBlock(), createBlock(XShape, {
                    key: 2,
                    class: _ctx.$style["x-shape"]
                  }, null, 8, ["class"]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td>`);
        });
        _push(`<!--]-->`);
        if (rowIndex === 0 && unref(columnSize) < unref(MAX_SEAT_COLUMN_SIZE)) {
          _push(`<td rowspan="0" class="${ssrRenderClass([_ctx.$style["line-button-container"], _ctx.$style.vertical])}"><div>`);
          _push(ssrRenderComponent(NormalButton, {
            onClick: addColumn,
            class: [_ctx.$style["line-button"], _ctx.$style.vertical],
            vertical: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`+`);
              } else {
                return [
                  createTextVNode("+")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr>`);
      });
      _push(`<!--]--></table></div></div><div class="${ssrRenderClass(_ctx.$style["action-button-container"])}">`);
      _push(ssrRenderComponent(CustomButton, {
        onClick: resetSeatData,
        warning: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`초기화`);
          } else {
            return [
              createTextVNode("초기화")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(CustomButton, {
        onClick: () => unref(setCurrentSectionId)("random-pick-seat")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`다음으로`);
          } else {
            return [
              createTextVNode("다음으로")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></main>`);
    };
  }
});
const container = "_container_1alwl_1";
const title = "_title_1alwl_10";
const table = "_table_1alwl_18";
const excluded = "_excluded_1alwl_89";
const vertical = "_vertical_1alwl_128";
const style0 = {
  container,
  title,
  "table-info-container": "_table-info-container_1alwl_18",
  "seat-number": "_seat-number_1alwl_26",
  "table-scroll-view-container": "_table-scroll-view-container_1alwl_35",
  "table-container": "_table-container_1alwl_42",
  "table-top": "_table-top_1alwl_52",
  table,
  "no-style": "_no-style_1alwl_68",
  "seat-button": "_seat-button_1alwl_74",
  "new": "_new_1alwl_86",
  "seat-initial-animation": "_seat-initial-animation_1alwl_1",
  excluded,
  "x-shape": "_x-shape_1alwl_102",
  "header-button": "_header-button_1alwl_115",
  "line-button-container": "_line-button-container_1alwl_125",
  vertical,
  "line-button": "_line-button_1alwl_125",
  "action-button-container": "_action-button-container_1alwl_153"
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/home/sections/SizeSettings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SizeSettings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  SizeSettings as default
};
