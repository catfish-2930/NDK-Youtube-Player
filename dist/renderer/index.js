
const __pluginCss = ".youtube-plugin-page{position:relative;width:100%;height:100%;min-height:0;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto auto;gap:10px;color:#fff}.youtube-plugin-page.has-state{grid-template-rows:auto 1fr auto auto}.youtube-plugin-title{width:220px;border-radius:999px;padding:8px 22px;background:linear-gradient(90deg,#55c7df,#695ce8);text-align:center;font-size:21px;font-weight:800}.youtube-video-grid{min-height:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:12px 12px;overflow:hidden;align-content:stretch;-ms-overflow-style:none;scrollbar-width:none}.youtube-video-grid::-webkit-scrollbar{width:0;height:0;display:none}.youtube-state{position:absolute;top:50%;left:50%;z-index:2;transform:translate(-50%,-50%);border-radius:999px;padding:12px 18px;background:#00000070;color:#ffffffe6;font-size:16px;font-weight:800}.youtube-loading-state{display:inline-flex;align-items:center;gap:10px}.youtube-spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,.32);border-top-color:#fff;border-radius:50%;animation:youtube-spin .8s linear infinite}@keyframes youtube-spin{to{transform:rotate(360deg)}}.youtube-video-card{container-type:inline-size;display:grid;grid-template-rows:auto minmax(0,auto) auto;gap:clamp(5px,1.8cqw,8px);align-content:start;height:100%;min-height:0;min-width:0;border:0;padding:0;background:transparent;color:#fff;text-align:left;cursor:pointer}.youtube-video-card:disabled{cursor:wait}.youtube-video-thumb{position:relative;width:100%;aspect-ratio:16 / 9;min-height:0;overflow:hidden;border-radius:8px;display:flex;align-items:flex-end;justify-content:flex-start;padding:10px;background:linear-gradient(135deg,#27304f,#5a6eb8);box-shadow:0 10px 24px #00000057}.youtube-video-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.youtube-video-thumb:before{content:\"\";position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,.28),transparent 34%),radial-gradient(circle at 78% 24%,rgba(255,255,255,.34),transparent 24%),linear-gradient(180deg,transparent 45%,rgba(0,0,0,.52))}.youtube-video-action{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 9px;background:#0000009e;color:#fff;font-size:12px;font-weight:800;text-shadow:0 3px 10px rgba(0,0,0,.55)}.youtube-video-thumb.has-progress .youtube-video-action{margin-bottom:34px}.youtube-video-meta{display:grid;gap:clamp(2px,.9cqw,4px);min-width:0}.youtube-video-name{margin:0;font-size:clamp(12px,9.2cqw,16px);font-weight:700;line-height:1.18;min-height:2.36em;max-height:2.36em;display:-webkit-box;overflow:hidden;line-clamp:2;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-shadow:0 2px 6px rgba(0,0,0,.22)}.youtube-video-artist{margin:0;display:block;line-height:1.2;height:1.2em;overflow:hidden;color:#ffffffb8;font-size:clamp(10px,7.2cqw,13px);font-weight:700;text-overflow:ellipsis;white-space:nowrap}.youtube-video-progress{position:absolute;left:10px;right:10px;bottom:8px;z-index:2;display:grid;gap:4px;border-radius:8px;padding:5px 7px;background:#00000094;box-shadow:0 8px 18px #00000047;pointer-events:none}.youtube-video-progress-meta{display:flex;justify-content:space-between;gap:8px;overflow:hidden;color:#fff;font-size:clamp(9px,6.8cqw,11px);font-weight:800;line-height:1;text-shadow:0 2px 8px rgba(0,0,0,.55)}.youtube-video-progress-meta span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.youtube-video-progress-track{height:4px;overflow:hidden;border-radius:999px;background:#ffffff3d}.youtube-video-progress-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#55d3e2,#ef75c8);transition:width .18s ease}.youtube-video-progress.done .youtube-video-progress-track span{background:linear-gradient(90deg,#3bd58f,#63d45e)}.youtube-video-progress.error .youtube-video-progress-track span{background:linear-gradient(90deg,#ff5277,#ff8b5f)}.youtube-plugin-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-top:0}.youtube-search-wrap{display:flex;align-items:center;gap:10px;width:min(520px,42vw)}.youtube-search-input{flex:1;min-width:0;height:40px;border:0;border-radius:999px;padding:0 18px;background:#ffffff7a;color:#1f2d5a;font-size:16px;font-weight:700;outline:none}.youtube-search-input::placeholder{color:#1f2d5a94}.youtube-search-button{width:44px;height:44px;border:2px solid rgba(255,255,255,.82);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#df6fb1,#c9569d);color:#fff;cursor:pointer}.youtube-pagination{display:flex;align-items:center;gap:20px;font-size:18px;font-weight:800}.youtube-pagination button{min-width:126px;height:36px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:6px;background:linear-gradient(90deg,#e9785b,#ec79ce);color:#fff;font-size:17px;font-weight:800;cursor:pointer}.youtube-pagination button:disabled{opacity:.62;cursor:default}.youtube-disclaimer{color:#fff36d;font-size:13px;font-weight:800}.youtube-context-overlay{position:absolute;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#0000009e;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}.youtube-context-menu{display:flex;flex-direction:column;gap:14px;min-width:280px;max-width:380px;width:30%;border-radius:16px;padding:18px 18px 16px;background:linear-gradient(160deg,#1e2a52,#13183a);box-shadow:0 24px 64px #0000009e;border:1px solid rgba(255,255,255,.1)}.youtube-context-menu-thumb{width:100%;aspect-ratio:16 / 9;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#27304f,#5a6eb8)}.youtube-context-menu-thumb img{width:100%;height:100%;object-fit:cover}.youtube-context-menu-title{font-size:15px;font-weight:800;line-height:1.28;color:#fff;display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}.youtube-context-menu-actions{display:flex;flex-direction:column;gap:8px}.youtube-context-option{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;border:0;border-radius:999px;padding:0 18px;background:#ffffff1f;color:#fff;font-size:16px;font-weight:800;cursor:pointer;transition:background .12s}.youtube-context-option:active{background:#ffffff38}.youtube-context-option.danger{background:linear-gradient(90deg,#ff4e6a,#ff7940)}.youtube-context-option.danger:active{filter:brightness(1.15)}.youtube-toast{position:absolute;left:50%;bottom:48px;transform:translate(-50%);max-width:720px;border-radius:999px;padding:10px 18px;background:#000000b8;color:#fff;text-align:center;font-size:14px}@media(max-width:1100px){.youtube-video-grid{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr))}.youtube-plugin-footer{align-items:flex-start;flex-direction:column}.youtube-search-wrap{width:100%}}@media(max-width:820px){.youtube-video-grid{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}}@media(max-width:560px){.youtube-video-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(5,minmax(0,1fr))}}\n";
const __pluginStyleId = "youtube-player";
if (typeof document !== 'undefined' && !document.querySelector('style[data-plugin-renderer="' + __pluginStyleId + '"]')) {
  const style = document.createElement('style');
  style.dataset.pluginRenderer = __pluginStyleId;
  style.textContent = __pluginCss;
  document.head.appendChild(style);
}

const N = globalThis.__karaokePluginShared?.ReactJsxRuntime;
if (!N)
  throw new Error("Host React JSX runtime is not available.");
N.Fragment;
const a = N.jsx, c = N.jsxs;
N.jsxDEV || N.jsx;
function ie(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var W = { exports: {} }, F, B;
function ue() {
  if (B) return F;
  B = 1;
  var r = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return F = r, F;
}
var z, U;
function ce() {
  if (U) return z;
  U = 1;
  var r = /* @__PURE__ */ ue();
  function s() {
  }
  function d() {
  }
  return d.resetWarningCache = s, z = function() {
    function o(g, b, v, m, f, C) {
      if (C !== r) {
        var p = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw p.name = "Invariant Violation", p;
      }
    }
    o.isRequired = o;
    function u() {
      return o;
    }
    var h = {
      array: o,
      bigint: o,
      bool: o,
      func: o,
      number: o,
      object: o,
      string: o,
      symbol: o,
      any: o,
      arrayOf: u,
      element: o,
      elementType: o,
      instanceOf: u,
      node: o,
      objectOf: u,
      oneOf: u,
      oneOfType: u,
      shape: u,
      exact: u,
      checkPropTypes: d,
      resetWarningCache: s
    };
    return h.PropTypes = h, h;
  }, z;
}
var H;
function le() {
  return H || (H = 1, W.exports = /* @__PURE__ */ ce()()), W.exports;
}
var de = /* @__PURE__ */ le();
const J = /* @__PURE__ */ ie(de), n = globalThis.__karaokePluginShared?.React;
if (!n)
  throw new Error("Host React runtime is not available.");
n.Children;
n.Component;
n.Fragment;
n.Profiler;
n.PureComponent;
n.StrictMode;
n.Suspense;
n.cloneElement;
const pe = n.createContext, K = n.createElement;
n.createRef;
const G = n.forwardRef;
n.isValidElement;
n.lazy;
n.memo;
n.startTransition;
n.use;
n.useActionState;
n.useCallback;
const he = n.useContext;
n.useDebugValue;
n.useDeferredValue;
const me = n.useEffect;
n.useId;
n.useImperativeHandle;
n.useInsertionEffect;
n.useLayoutEffect;
n.useMemo;
n.useOptimistic;
n.useReducer;
const X = n.useRef, y = n.useState;
n.useSyncExternalStore;
n.useTransition;
const Q = (...r) => r.filter((s, d, o) => !!s && s.trim() !== "" && o.indexOf(s) === d).join(" ").trim();
const ye = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const be = (r) => r.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (s, d, o) => o ? o.toUpperCase() : d.toLowerCase()
);
const Z = (r) => {
  const s = be(r);
  return s.charAt(0).toUpperCase() + s.slice(1);
};
var D = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const fe = (r) => {
  for (const s in r)
    if (s.startsWith("aria-") || s === "role" || s === "title")
      return !0;
  return !1;
}, ge = pe({}), ve = () => he(ge), Ce = G(
  ({ color: r, size: s, strokeWidth: d, absoluteStrokeWidth: o, className: u = "", children: h, iconNode: g, ...b }, v) => {
    const {
      size: m = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: C = !1,
      color: p = "currentColor",
      className: k = ""
    } = ve() ?? {}, w = o ?? C ? Number(d ?? f) * 24 / Number(s ?? m) : d ?? f;
    return K(
      "svg",
      {
        ref: v,
        ...D,
        width: s ?? m ?? D.width,
        height: s ?? m ?? D.height,
        stroke: r ?? p,
        strokeWidth: w,
        className: Q("lucide", k, u),
        ...!h && !fe(b) && { "aria-hidden": "true" },
        ...b
      },
      [
        ...g.map(([I, S]) => K(I, S)),
        ...Array.isArray(h) ? h : [h]
      ]
    );
  }
);
const P = (r, s) => {
  const d = G(
    ({ className: o, ...u }, h) => K(Ce, {
      ref: h,
      iconNode: s,
      className: Q(
        `lucide-${ye(Z(r))}`,
        `lucide-${r}`,
        o
      ),
      ...u
    })
  );
  return d.displayName = Z(r), d;
};
const Ne = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], xe = P("chevron-left", Ne);
const Te = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Pe = P("chevron-right", Te);
const ke = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], we = P("download", ke);
const Se = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], Re = P("search", Se);
const Ee = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], _e = P("x", Ee);
function Me({ onEnqueueMedia: r, KeyboardComponent: s }) {
  const [o, u] = y(""), [h, g] = y(!1), [b, v] = y([]), [m, f] = y(!0), [C, p] = y(""), [k, w] = y({}), [I, S] = y({}), [R, L] = y(null), E = X(null), _ = X(!1), [x, $] = y(1), [j, O] = y(!1), [ee, q] = y(1), M = async (e = "", t = 1) => {
    f(!0), p("");
    try {
      const i = e ? "plugin:youtube-player:search" : "plugin:youtube-player:recommend", T = e ? { query: e, page: t, pageSize: 10 } : { page: t, pageSize: 10 }, l = await window.api.plugins.invoke(i, T);
      if (!l?.ok) {
        v([]), $(1), O(!1), q(1), p(l?.error || "YouTube plugin is not installed.");
        return;
      }
      v(Array.isArray(l.videos) ? l.videos : []), $(Math.max(1, Number(l.page || t || 1))), O(!!l.hasNext), q(
        Number.isFinite(Number(l.totalPages)) ? Math.max(1, Number(l.totalPages)) : Math.max(1, Number(l.page || t || 1))
      );
    } catch (i) {
      v([]), $(1), O(!1), q(1), p(i.message || "YouTube plugin is not installed.");
    } finally {
      f(!1);
    }
  };
  me(() => {
    let e = !0;
    M("", 1).catch(() => {
      e && f(!1);
    });
    const t = window.api.plugins.onPluginJobProgress("youtube-player", (i) => {
      S((T) => {
        const l = { ...T };
        return i.status === "done" || i.status === "error" ? (delete l[i.videoId], l) : (l[i.videoId] = i, l);
      });
    });
    return () => {
      e = !1, t();
    };
  }, []);
  const V = () => {
    M(o.trim(), 1);
  }, te = (e) => {
    if (e === "BACKSPACE") {
      u((t) => t.slice(0, -1));
      return;
    }
    if (e === "CLEAR") {
      u("");
      return;
    }
    if (e === "SPACE") {
      u((t) => `${t} `);
      return;
    }
    u((t) => `${t}${e}`);
  }, ne = (e) => {
    e && u((t) => `${t}${e}`);
  }, oe = () => {
    g(!1), V();
  }, re = () => {
    m || x <= 1 || M(o.trim(), x - 1);
  }, ae = () => {
    m || !j || M(o.trim(), x + 1);
  }, Y = (e) => {
    _.current = !1, E.current = setTimeout(() => {
      _.current = !0, L(e);
    }, 500);
  }, A = () => {
    E.current && (clearTimeout(E.current), E.current = null);
  }, se = async (e) => {
    if (_.current) {
      _.current = !1;
      return;
    }
    if (!(!e?.id || k[e.id])) {
      w((t) => ({
        ...t,
        [e.id]: !0
      })), p(""), S((t) => {
        const i = { ...t };
        return delete i[e.id], i;
      });
      try {
        const t = await window.api.plugins.invoke("plugin:youtube-player:download", e);
        if (!t?.ok) {
          p(t?.error || "Stream preparation failed.");
          return;
        }
        const i = await r(t.mediaItem);
        if (!i?.ok) {
          p(i?.error || "Failed to add video to queue.");
          return;
        }
        p(`${t.mediaItem.title} added to queue.`);
      } catch (t) {
        p(t.message || "Stream preparation failed.");
      } finally {
        w((t) => {
          const i = { ...t };
          return delete i[e.id], i;
        });
      }
    }
  };
  return /* @__PURE__ */ c("section", { className: `youtube-plugin-page ${m || b.length === 0 ? "has-state" : ""}`, children: [
    /* @__PURE__ */ a("div", { className: "youtube-plugin-title", children: "推荐榜" }),
    /* @__PURE__ */ a("div", { className: "youtube-video-grid", children: m ? /* @__PURE__ */ c("div", { className: "youtube-state youtube-loading-state", children: [
      /* @__PURE__ */ a("span", { className: "youtube-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ a("span", { children: "Loading YouTube videos..." })
    ] }) : b.length === 0 ? /* @__PURE__ */ a("div", { className: "youtube-state", children: "No videos. Install the YouTube plugin or try another search." }) : b.map((e) => {
      const t = I[e.id], i = !!k[e.id];
      return /* @__PURE__ */ c(
        "button",
        {
          className: "youtube-video-card",
          type: "button",
          disabled: i,
          onClick: () => se(e),
          onMouseDown: () => Y(e),
          onMouseUp: A,
          onMouseLeave: A,
          onTouchStart: () => Y(e),
          onTouchEnd: A,
          onTouchCancel: A,
          children: [
            /* @__PURE__ */ c("div", { className: `youtube-video-thumb ${t ? "has-progress" : ""}`, children: [
              e.thumbnail ? /* @__PURE__ */ a(
                "img",
                {
                  src: e.thumbnail,
                  alt: "",
                  loading: "lazy",
                  referrerPolicy: "no-referrer",
                  onError: (T) => {
                    T.currentTarget.style.display = "none";
                  }
                }
              ) : null,
              /* @__PURE__ */ c("span", { className: "youtube-video-action", children: [
                /* @__PURE__ */ a(we, { size: 18 }),
                i ? "处理中" : "下载"
              ] }),
              t ? /* @__PURE__ */ c("span", { className: `youtube-video-progress ${t.status || ""}`, children: [
                /* @__PURE__ */ c("span", { className: "youtube-video-progress-meta", children: [
                  /* @__PURE__ */ a("span", { children: t.speed || t.status || "" }),
                  /* @__PURE__ */ c("span", { children: [
                    Math.max(0, Math.min(100, Math.round(t.percent || 0))),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ a("span", { className: "youtube-video-progress-track", children: /* @__PURE__ */ a(
                  "span",
                  {
                    style: { width: `${Math.max(0, Math.min(100, t.percent || 0))}%` }
                  }
                ) })
              ] }) : null
            ] }),
            /* @__PURE__ */ c("div", { className: "youtube-video-meta", children: [
              /* @__PURE__ */ a("div", { className: "youtube-video-name", children: e.title }),
              /* @__PURE__ */ a("div", { className: "youtube-video-artist", children: e.artist || "-" })
            ] })
          ]
        },
        e.id
      );
    }) }),
    /* @__PURE__ */ c("div", { className: "youtube-plugin-footer", children: [
      /* @__PURE__ */ c("div", { className: "youtube-search-wrap", children: [
        /* @__PURE__ */ a(
          "input",
          {
            className: "youtube-search-input",
            value: o,
            onChange: (e) => u(e.target.value),
            onClick: () => g(!0),
            onFocus: () => g(!0),
            onKeyDown: (e) => {
              e.key === "Enter" && V();
            },
            inputMode: "none",
            placeholder: "请输入字母 / YOUTUBE ID 搜索"
          }
        ),
        /* @__PURE__ */ a("button", { className: "youtube-search-button", type: "button", onClick: V, children: /* @__PURE__ */ a(Re, { size: 34 }) })
      ] }),
      /* @__PURE__ */ c("div", { className: "youtube-pagination", children: [
        /* @__PURE__ */ c("button", { type: "button", disabled: m || x <= 1, onClick: re, children: [
          /* @__PURE__ */ a(xe, { size: 22 }),
          "上一页"
        ] }),
        /* @__PURE__ */ c("span", { children: [
          x,
          " / ",
          j ? "..." : ee
        ] }),
        /* @__PURE__ */ c("button", { type: "button", disabled: m || !j, onClick: ae, children: [
          "下一页",
          /* @__PURE__ */ a(Pe, { size: 22 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "youtube-disclaimer", children: "免责声明：YouTube 功能仅作为实验用途，无法确保播放成功；播放效果可能会因内容限制、网络状况或平台兼容性而有所差异。" }),
    R ? /* @__PURE__ */ a(
      "div",
      {
        className: "youtube-context-overlay",
        onClick: () => L(null),
        children: /* @__PURE__ */ c(
          "div",
          {
            className: "youtube-context-menu",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ a("div", { className: "youtube-context-menu-thumb", children: R.thumbnail ? /* @__PURE__ */ a(
                "img",
                {
                  src: R.thumbnail,
                  alt: "",
                  referrerPolicy: "no-referrer"
                }
              ) : null }),
              /* @__PURE__ */ a("div", { className: "youtube-context-menu-title", children: R.title }),
              /* @__PURE__ */ a("div", { className: "youtube-context-menu-actions", children: /* @__PURE__ */ c(
                "button",
                {
                  className: "youtube-context-option",
                  type: "button",
                  onClick: () => L(null),
                  children: [
                    /* @__PURE__ */ a(_e, { size: 18 }),
                    "关闭"
                  ]
                }
              ) })
            ]
          }
        )
      }
    ) : null,
    C ? /* @__PURE__ */ a("div", { className: "youtube-toast", children: C }) : null,
    s ? /* @__PURE__ */ a(
      s,
      {
        visible: h,
        onKey: te,
        onText: ne,
        onConfirm: oe,
        displayValue: o
      }
    ) : null
  ] });
}
Me.propTypes = {
  onEnqueueMedia: J.func.isRequired,
  KeyboardComponent: J.elementType
};
export {
  Me as default
};
