
const __pluginCss = ".youtube-plugin-page{position:relative;width:100%;height:100%;min-height:0;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto auto;gap:10px;color:#fff}.youtube-plugin-page.has-state{grid-template-rows:auto 1fr auto auto}.youtube-plugin-title{width:220px;border-radius:999px;padding:8px 22px;background:linear-gradient(90deg,#55c7df,#695ce8);text-align:center;font-size:21px;font-weight:800}.youtube-video-grid{min-height:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:12px 12px;overflow:hidden;align-content:stretch;-ms-overflow-style:none;scrollbar-width:none}.youtube-video-grid::-webkit-scrollbar{width:0;height:0;display:none}.youtube-state{position:absolute;top:50%;left:50%;z-index:2;transform:translate(-50%,-50%);border-radius:999px;padding:12px 18px;background:#00000070;color:#ffffffe6;font-size:16px;font-weight:800}.youtube-loading-state{display:inline-flex;align-items:center;gap:10px}.youtube-spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,.32);border-top-color:#fff;border-radius:50%;animation:youtube-spin .8s linear infinite}@keyframes youtube-spin{to{transform:rotate(360deg)}}.youtube-video-card{container-type:inline-size;display:grid;grid-template-rows:auto minmax(0,auto) auto;gap:clamp(5px,1.8cqw,8px);align-content:start;height:100%;min-height:0;min-width:0;border:0;padding:0;background:transparent;color:#fff;text-align:left;cursor:pointer}.youtube-video-card:disabled{cursor:wait}.youtube-video-thumb{position:relative;width:100%;aspect-ratio:16 / 9;min-height:0;overflow:hidden;border-radius:8px;display:flex;align-items:flex-end;justify-content:flex-start;padding:10px;background:linear-gradient(135deg,#27304f,#5a6eb8);box-shadow:0 10px 24px #00000057}.youtube-video-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.youtube-video-thumb:before{content:\"\";position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,.28),transparent 34%),radial-gradient(circle at 78% 24%,rgba(255,255,255,.34),transparent 24%),linear-gradient(180deg,transparent 45%,rgba(0,0,0,.52))}.youtube-video-action{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 9px;background:#0000009e;color:#fff;font-size:12px;font-weight:800;text-shadow:0 3px 10px rgba(0,0,0,.55)}.youtube-video-meta{display:grid;gap:clamp(2px,.9cqw,4px);min-width:0}.youtube-video-name{margin:0;font-size:clamp(12px,9.2cqw,16px);font-weight:700;line-height:1.18;min-height:2.36em;max-height:2.36em;display:-webkit-box;overflow:hidden;line-clamp:2;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-shadow:0 2px 6px rgba(0,0,0,.22)}.youtube-video-artist{margin:0;display:block;line-height:1.2;height:1.2em;overflow:hidden;color:#ffffffb8;font-size:clamp(10px,7.2cqw,13px);font-weight:700;text-overflow:ellipsis;white-space:nowrap}.youtube-plugin-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-top:0}.youtube-search-wrap{display:flex;align-items:center;gap:10px;width:min(520px,42vw)}.youtube-search-input{flex:1;min-width:0;height:40px;border:0;border-radius:999px;padding:0 18px;background:#ffffff7a;color:#1f2d5a;font-size:16px;font-weight:700;outline:none}.youtube-search-input::placeholder{color:#1f2d5a94}.youtube-search-button{width:44px;height:44px;border:2px solid rgba(255,255,255,.82);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#df6fb1,#c9569d);color:#fff;cursor:pointer}.youtube-pagination{display:flex;align-items:center;gap:20px;font-size:18px;font-weight:800}.youtube-pagination button{min-width:126px;height:36px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:6px;background:linear-gradient(90deg,#e9785b,#ec79ce);color:#fff;font-size:17px;font-weight:800;cursor:pointer}.youtube-pagination button:disabled{opacity:.62;cursor:default}.youtube-disclaimer{color:#fff36d;font-size:13px;font-weight:800}.youtube-context-overlay{position:absolute;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#0000009e;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}.youtube-context-menu{display:flex;flex-direction:column;gap:14px;min-width:280px;max-width:380px;width:30%;border-radius:16px;padding:18px 18px 16px;background:linear-gradient(160deg,#1e2a52,#13183a);box-shadow:0 24px 64px #0000009e;border:1px solid rgba(255,255,255,.1)}.youtube-context-menu-thumb{width:100%;aspect-ratio:16 / 9;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#27304f,#5a6eb8)}.youtube-context-menu-thumb img{width:100%;height:100%;object-fit:cover}.youtube-context-menu-title{font-size:15px;font-weight:800;line-height:1.28;color:#fff;display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}.youtube-context-menu-actions{display:flex;flex-direction:column;gap:8px}.youtube-context-option{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;border:0;border-radius:999px;padding:0 18px;background:#ffffff1f;color:#fff;font-size:16px;font-weight:800;cursor:pointer;transition:background .12s}.youtube-context-option:active{background:#ffffff38}.youtube-context-option.danger{background:linear-gradient(90deg,#ff4e6a,#ff7940)}.youtube-context-option.danger:active{filter:brightness(1.15)}.youtube-toast{position:absolute;left:50%;bottom:48px;transform:translate(-50%);max-width:720px;border-radius:999px;padding:10px 18px;background:#000000b8;color:#fff;text-align:center;font-size:14px}@media(max-width:1100px){.youtube-video-grid{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr))}.youtube-plugin-footer{align-items:flex-start;flex-direction:column}.youtube-search-wrap{width:100%}}@media(max-width:820px){.youtube-video-grid{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}}@media(max-width:560px){.youtube-video-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(5,minmax(0,1fr))}}\n";
const __pluginStyleId = "youtube-player";
if (typeof document !== 'undefined' && !document.querySelector('style[data-plugin-renderer="' + __pluginStyleId + '"]')) {
  const style = document.createElement('style');
  style.dataset.pluginRenderer = __pluginStyleId;
  style.textContent = __pluginCss;
  document.head.appendChild(style);
}

const T = globalThis.__karaokePluginShared?.ReactJsxRuntime;
if (!T)
  throw new Error("Host React JSX runtime is not available.");
T.Fragment;
const s = T.jsx, l = T.jsxs;
T.jsxDEV || T.jsx;
function ie(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var V = { exports: {} }, W, B;
function ue() {
  if (B) return W;
  B = 1;
  var r = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return W = r, W;
}
var F, U;
function ce() {
  if (U) return F;
  U = 1;
  var r = /* @__PURE__ */ ue();
  function a() {
  }
  function d() {
  }
  return d.resetWarningCache = a, F = function() {
    function n(g, b, v, m, f, C) {
      if (C !== r) {
        var p = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw p.name = "Invariant Violation", p;
      }
    }
    n.isRequired = n;
    function u() {
      return n;
    }
    var h = {
      array: n,
      bigint: n,
      bool: n,
      func: n,
      number: n,
      object: n,
      string: n,
      symbol: n,
      any: n,
      arrayOf: u,
      element: n,
      elementType: n,
      instanceOf: u,
      node: n,
      objectOf: u,
      oneOf: u,
      oneOfType: u,
      shape: u,
      exact: u,
      checkPropTypes: d,
      resetWarningCache: a
    };
    return h.PropTypes = h, h;
  }, F;
}
var H;
function le() {
  return H || (H = 1, V.exports = /* @__PURE__ */ ce()()), V.exports;
}
var de = /* @__PURE__ */ le();
const J = /* @__PURE__ */ ie(de), t = globalThis.__karaokePluginShared?.React;
if (!t)
  throw new Error("Host React runtime is not available.");
t.Children;
t.Component;
t.Fragment;
t.Profiler;
t.PureComponent;
t.StrictMode;
t.Suspense;
t.cloneElement;
const pe = t.createContext, D = t.createElement;
t.createRef;
const G = t.forwardRef;
t.isValidElement;
t.lazy;
t.memo;
t.startTransition;
t.use;
t.useActionState;
t.useCallback;
const he = t.useContext;
t.useDebugValue;
t.useDeferredValue;
const me = t.useEffect;
t.useId;
t.useImperativeHandle;
t.useInsertionEffect;
t.useLayoutEffect;
t.useMemo;
t.useOptimistic;
t.useReducer;
const X = t.useRef, y = t.useState;
t.useSyncExternalStore;
t.useTransition;
const Q = (...r) => r.filter((a, d, n) => !!a && a.trim() !== "" && n.indexOf(a) === d).join(" ").trim();
const ye = (r) => r.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const be = (r) => r.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (a, d, n) => n ? n.toUpperCase() : d.toLowerCase()
);
const Z = (r) => {
  const a = be(r);
  return a.charAt(0).toUpperCase() + a.slice(1);
};
var z = {
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
  for (const a in r)
    if (a.startsWith("aria-") || a === "role" || a === "title")
      return !0;
  return !1;
}, ge = pe({}), ve = () => he(ge), Ce = G(
  ({ color: r, size: a, strokeWidth: d, absoluteStrokeWidth: n, className: u = "", children: h, iconNode: g, ...b }, v) => {
    const {
      size: m = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: C = !1,
      color: p = "currentColor",
      className: P = ""
    } = ve() ?? {}, k = n ?? C ? Number(d ?? f) * 24 / Number(a ?? m) : d ?? f;
    return D(
      "svg",
      {
        ref: v,
        ...z,
        width: a ?? m ?? z.width,
        height: a ?? m ?? z.height,
        stroke: r ?? p,
        strokeWidth: k,
        className: Q("lucide", P, u),
        ...!h && !fe(b) && { "aria-hidden": "true" },
        ...b
      },
      [
        ...g.map(([K, w]) => D(K, w)),
        ...Array.isArray(h) ? h : [h]
      ]
    );
  }
);
const N = (r, a) => {
  const d = G(
    ({ className: n, ...u }, h) => D(Ce, {
      ref: h,
      iconNode: a,
      className: Q(
        `lucide-${ye(Z(r))}`,
        `lucide-${r}`,
        n
      ),
      ...u
    })
  );
  return d.displayName = Z(r), d;
};
const Te = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]], xe = N("chevron-left", Te);
const Ne = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Pe = N("chevron-right", Ne);
const ke = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], we = N("download", ke);
const Se = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], Re = N("search", Se);
const Ee = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], _e = N("x", Ee);
function Ae({ onEnqueueMedia: r, KeyboardComponent: a }) {
  const [n, u] = y(""), [h, g] = y(!1), [b, v] = y([]), [m, f] = y(!0), [C, p] = y(""), [P, k] = y({}), [K, w] = y({}), [S, I] = y(null), R = X(null), E = X(!1), [x, L] = y(1), [M, j] = y(!1), [ee, O] = y(1), _ = async (e = "", o = 1) => {
    f(!0), p("");
    try {
      const i = e ? "plugin:youtube-player:search" : "plugin:youtube-player:recommend", $ = e ? { query: e, page: o, pageSize: 10 } : { page: o, pageSize: 10 }, c = await window.api.plugins.invoke(i, $);
      if (!c?.ok) {
        v([]), L(1), j(!1), O(1), p(c?.error || "YouTube plugin is not installed.");
        return;
      }
      v(Array.isArray(c.videos) ? c.videos : []), L(Math.max(1, Number(c.page || o || 1))), j(!!c.hasNext), O(
        Number.isFinite(Number(c.totalPages)) ? Math.max(1, Number(c.totalPages)) : Math.max(1, Number(c.page || o || 1))
      );
    } catch (i) {
      v([]), L(1), j(!1), O(1), p(i.message || "YouTube plugin is not installed.");
    } finally {
      f(!1);
    }
  };
  me(() => {
    let e = !0;
    _("", 1).catch(() => {
      e && f(!1);
    });
    const o = window.api.plugins.onPluginJobProgress("youtube-player", (i) => {
      w(($) => {
        const c = { ...$ };
        return i.status === "done" || i.status === "error" ? (delete c[i.videoId], c) : (c[i.videoId] = i, c);
      });
    });
    return () => {
      e = !1, o();
    };
  }, []);
  const q = () => {
    _(n.trim(), 1);
  }, te = (e) => {
    if (e === "BACKSPACE") {
      u((o) => o.slice(0, -1));
      return;
    }
    if (e === "CLEAR") {
      u("");
      return;
    }
    if (e === "SPACE") {
      u((o) => `${o} `);
      return;
    }
    u((o) => `${o}${e}`);
  }, ne = (e) => {
    e && u((o) => `${o}${e}`);
  }, oe = () => {
    g(!1), q();
  }, re = () => {
    m || x <= 1 || _(n.trim(), x - 1);
  }, ae = () => {
    m || !M || _(n.trim(), x + 1);
  }, Y = (e) => {
    E.current = !1, R.current = setTimeout(() => {
      E.current = !0, I(e);
    }, 500);
  }, A = () => {
    R.current && (clearTimeout(R.current), R.current = null);
  }, se = async (e) => {
    if (E.current) {
      E.current = !1;
      return;
    }
    if (!(!e?.id || P[e.id])) {
      k((o) => ({
        ...o,
        [e.id]: !0
      })), p(""), w((o) => {
        const i = { ...o };
        return delete i[e.id], i;
      });
      try {
        const o = await window.api.plugins.invoke("plugin:youtube-player:download", e);
        if (!o?.ok) {
          p(o?.error || "Stream preparation failed.");
          return;
        }
        const i = await r(o.mediaItem);
        if (!i?.ok) {
          p(i?.error || "Failed to add video to queue.");
          return;
        }
        p(`${o.mediaItem.title} added to queue.`);
      } catch (o) {
        p(o.message || "Stream preparation failed.");
      } finally {
        k((o) => {
          const i = { ...o };
          return delete i[e.id], i;
        });
      }
    }
  };
  return /* @__PURE__ */ l("section", { className: `youtube-plugin-page ${m || b.length === 0 ? "has-state" : ""}`, children: [
    /* @__PURE__ */ s("div", { className: "youtube-plugin-title", children: "推荐榜" }),
    /* @__PURE__ */ s("div", { className: "youtube-video-grid", children: m ? /* @__PURE__ */ l("div", { className: "youtube-state youtube-loading-state", children: [
      /* @__PURE__ */ s("span", { className: "youtube-spinner", "aria-hidden": "true" }),
      /* @__PURE__ */ s("span", { children: "Loading YouTube videos..." })
    ] }) : b.length === 0 ? /* @__PURE__ */ s("div", { className: "youtube-state", children: "No videos. Install the YouTube plugin or try another search." }) : b.map((e) => {
      const o = !!P[e.id];
      return /* @__PURE__ */ l(
        "button",
        {
          className: "youtube-video-card",
          type: "button",
          disabled: o,
          onClick: () => se(e),
          onMouseDown: () => Y(e),
          onMouseUp: A,
          onMouseLeave: A,
          onTouchStart: () => Y(e),
          onTouchEnd: A,
          onTouchCancel: A,
          children: [
            /* @__PURE__ */ l("div", { className: "youtube-video-thumb", children: [
              e.thumbnail ? /* @__PURE__ */ s(
                "img",
                {
                  src: e.thumbnail,
                  alt: "",
                  loading: "lazy",
                  referrerPolicy: "no-referrer",
                  onError: (i) => {
                    i.currentTarget.style.display = "none";
                  }
                }
              ) : null,
              /* @__PURE__ */ l("span", { className: "youtube-video-action", children: [
                /* @__PURE__ */ s(we, { size: 18 }),
                o ? "处理中" : "下载"
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "youtube-video-meta", children: [
              /* @__PURE__ */ s("div", { className: "youtube-video-name", children: e.title }),
              /* @__PURE__ */ s("div", { className: "youtube-video-artist", children: e.artist || "-" })
            ] })
          ]
        },
        e.id
      );
    }) }),
    /* @__PURE__ */ l("div", { className: "youtube-plugin-footer", children: [
      /* @__PURE__ */ l("div", { className: "youtube-search-wrap", children: [
        /* @__PURE__ */ s(
          "input",
          {
            className: "youtube-search-input",
            value: n,
            onChange: (e) => u(e.target.value),
            onClick: () => g(!0),
            onFocus: () => g(!0),
            onKeyDown: (e) => {
              e.key === "Enter" && q();
            },
            inputMode: "none",
            placeholder: "请输入字母 / YOUTUBE ID 搜索"
          }
        ),
        /* @__PURE__ */ s("button", { className: "youtube-search-button", type: "button", onClick: q, children: /* @__PURE__ */ s(Re, { size: 34 }) })
      ] }),
      /* @__PURE__ */ l("div", { className: "youtube-pagination", children: [
        /* @__PURE__ */ l("button", { type: "button", disabled: m || x <= 1, onClick: re, children: [
          /* @__PURE__ */ s(xe, { size: 22 }),
          "上一页"
        ] }),
        /* @__PURE__ */ l("span", { children: [
          x,
          " / ",
          M ? "..." : ee
        ] }),
        /* @__PURE__ */ l("button", { type: "button", disabled: m || !M, onClick: ae, children: [
          "下一页",
          /* @__PURE__ */ s(Pe, { size: 22 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "youtube-disclaimer", children: "免责声明：YouTube 功能仅作为实验用途，无法确保播放成功；播放效果可能会因内容限制、网络状况或平台兼容性而有所差异。" }),
    S ? /* @__PURE__ */ s(
      "div",
      {
        className: "youtube-context-overlay",
        onClick: () => I(null),
        children: /* @__PURE__ */ l(
          "div",
          {
            className: "youtube-context-menu",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ s("div", { className: "youtube-context-menu-thumb", children: S.thumbnail ? /* @__PURE__ */ s(
                "img",
                {
                  src: S.thumbnail,
                  alt: "",
                  referrerPolicy: "no-referrer"
                }
              ) : null }),
              /* @__PURE__ */ s("div", { className: "youtube-context-menu-title", children: S.title }),
              /* @__PURE__ */ s("div", { className: "youtube-context-menu-actions", children: /* @__PURE__ */ l(
                "button",
                {
                  className: "youtube-context-option",
                  type: "button",
                  onClick: () => I(null),
                  children: [
                    /* @__PURE__ */ s(_e, { size: 18 }),
                    "关闭"
                  ]
                }
              ) })
            ]
          }
        )
      }
    ) : null,
    C ? /* @__PURE__ */ s("div", { className: "youtube-toast", children: C }) : null,
    a ? /* @__PURE__ */ s(
      a,
      {
        visible: h,
        onKey: te,
        onText: ne,
        onConfirm: oe,
        displayValue: n
      }
    ) : null
  ] });
}
Ae.propTypes = {
  onEnqueueMedia: J.func.isRequired,
  KeyboardComponent: J.elementType
};
export {
  Ae as default
};
