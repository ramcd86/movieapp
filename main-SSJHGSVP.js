var Gh = Object.defineProperty,
  qh = Object.defineProperties;
var Yh = Object.getOwnPropertyDescriptors;
var Gc = Object.getOwnPropertySymbols;
var Zh = Object.prototype.hasOwnProperty,
  Qh = Object.prototype.propertyIsEnumerable;
var qc = (e, t, r) =>
    t in e
      ? Gh(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (e[t] = r),
  m = (e, t) => {
    for (var r in (t ||= {})) Zh.call(t, r) && qc(e, r, t[r]);
    if (Gc) for (var r of Gc(t)) Qh.call(t, r) && qc(e, r, t[r]);
    return e;
  },
  Z = (e, t) => qh(e, Yh(t));
var Ur = (e, t, r) =>
  new Promise((n, o) => {
    var i = (c) => {
        try {
          a(r.next(c));
        } catch (u) {
          o(u);
        }
      },
      s = (c) => {
        try {
          a(r.throw(c));
        } catch (u) {
          o(u);
        }
      },
      a = (c) => (c.done ? n(c.value) : Promise.resolve(c.value).then(i, s));
    a((r = r.apply(e, t)).next());
  });
var Yc = null;
var Fi = 1,
  Zc = Symbol("SIGNAL");
function k(e) {
  let t = Yc;
  return (Yc = e), t;
}
var Qc = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Xh(e) {
  if (!(ji(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Fi)) {
    if (!e.producerMustRecompute(e) && !ki(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Fi);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Fi);
  }
}
function Xc(e) {
  return e && (e.nextProducerIndex = 0), k(e);
}
function Jc(e, t) {
  if (
    (k(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (ji(e))
      for (let r = e.nextProducerIndex; r < e.producerNode.length; r++)
        Li(e.producerNode[r], e.producerIndexOfThis[r]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function ki(e) {
  $r(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let r = e.producerNode[t],
      n = e.producerLastReadVersion[t];
    if (n !== r.version || (Xh(r), n !== r.version)) return !0;
  }
  return !1;
}
function Kc(e) {
  if (($r(e), ji(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Li(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Li(e, t) {
  if ((Jh(e), $r(e), e.liveConsumerNode.length === 1))
    for (let n = 0; n < e.producerNode.length; n++)
      Li(e.producerNode[n], e.producerIndexOfThis[n]);
  let r = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[r]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[r]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let n = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    $r(o), (o.producerIndexOfThis[n] = t);
  }
}
function ji(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function $r(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Jh(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function Kh() {
  throw new Error();
}
var ep = Kh;
function eu(e) {
  ep = e;
}
function T(e) {
  return typeof e == "function";
}
function zt(e) {
  let r = e((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var Hr = zt(
  (e) =>
    function (r) {
      e(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, o) => `${o + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function Fn(e, t) {
  if (e) {
    let r = e.indexOf(t);
    0 <= r && e.splice(r, 1);
  }
}
var K = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let i of r) i.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (T(n))
        try {
          n();
        } catch (i) {
          t = i instanceof Hr ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            tu(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Hr ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Hr(t);
    }
  }
  add(t) {
    var r;
    if (t && t !== this)
      if (this.closed) tu(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: r } = this;
    return r === t || (Array.isArray(r) && r.includes(t));
  }
  _addParent(t) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(t), r) : r ? [r, t] : t;
  }
  _removeParent(t) {
    let { _parentage: r } = this;
    r === t ? (this._parentage = null) : Array.isArray(r) && Fn(r, t);
  }
  remove(t) {
    let { _finalizers: r } = this;
    r && Fn(r, t), t instanceof e && t._removeParent(this);
  }
};
K.EMPTY = (() => {
  let e = new K();
  return (e.closed = !0), e;
})();
var Vi = K.EMPTY;
function zr(e) {
  return (
    e instanceof K ||
    (e && "closed" in e && T(e.remove) && T(e.add) && T(e.unsubscribe))
  );
}
function tu(e) {
  T(e) ? e() : e.unsubscribe();
}
var Oe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Wt = {
  setTimeout(e, t, ...r) {
    let { delegate: n } = Wt;
    return n?.setTimeout ? n.setTimeout(e, t, ...r) : setTimeout(e, t, ...r);
  },
  clearTimeout(e) {
    let { delegate: t } = Wt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Wr(e) {
  Wt.setTimeout(() => {
    let { onUnhandledError: t } = Oe;
    if (t) t(e);
    else throw e;
  });
}
function kn() {}
var nu = Bi("C", void 0, void 0);
function ru(e) {
  return Bi("E", void 0, e);
}
function ou(e) {
  return Bi("N", e, void 0);
}
function Bi(e, t, r) {
  return { kind: e, value: t, error: r };
}
var Mt = null;
function Gt(e) {
  if (Oe.useDeprecatedSynchronousErrorHandling) {
    let t = !Mt;
    if ((t && (Mt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: r, error: n } = Mt;
      if (((Mt = null), r)) throw n;
    }
  } else e();
}
function iu(e) {
  Oe.useDeprecatedSynchronousErrorHandling &&
    Mt &&
    ((Mt.errorThrown = !0), (Mt.error = e));
}
var Tt = class extends K {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), zr(t) && t.add(this))
          : (this.destination = rp);
    }
    static create(t, r, n) {
      return new qt(t, r, n);
    }
    next(t) {
      this.isStopped ? $i(ou(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? $i(ru(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? $i(nu, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  tp = Function.prototype.bind;
function Ui(e, t) {
  return tp.call(e, t);
}
var Hi = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(t);
        } catch (n) {
          Gr(n);
        }
    }
    error(t) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(t);
        } catch (n) {
          Gr(n);
        }
      else Gr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (r) {
          Gr(r);
        }
    }
  },
  qt = class extends Tt {
    constructor(t, r, n) {
      super();
      let o;
      if (T(t) || !t)
        o = { next: t ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let i;
        this && Oe.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && Ui(t.next, i),
              error: t.error && Ui(t.error, i),
              complete: t.complete && Ui(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Hi(o);
    }
  };
function Gr(e) {
  Oe.useDeprecatedSynchronousErrorHandling ? iu(e) : Wr(e);
}
function np(e) {
  throw e;
}
function $i(e, t) {
  let { onStoppedNotification: r } = Oe;
  r && Wt.setTimeout(() => r(e, t));
}
var rp = { closed: !0, next: kn, error: np, complete: kn };
var Yt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ye(e) {
  return e;
}
function zi(...e) {
  return Wi(e);
}
function Wi(e) {
  return e.length === 0
    ? ye
    : e.length === 1
    ? e[0]
    : function (r) {
        return e.reduce((n, o) => o(n), r);
      };
}
var V = (() => {
  class e {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new e();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, o) {
      let i = ip(r) ? r : new qt(r, n, o);
      return (
        Gt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = su(n)),
        new n((o, i) => {
          let s = new qt({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [Yt]() {
      return this;
    }
    pipe(...r) {
      return Wi(r)(this);
    }
    toPromise(r) {
      return (
        (r = su(r)),
        new r((n, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => n(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function su(e) {
  var t;
  return (t = e ?? Oe.Promise) !== null && t !== void 0 ? t : Promise;
}
function op(e) {
  return e && T(e.next) && T(e.error) && T(e.complete);
}
function ip(e) {
  return (e && e instanceof Tt) || (op(e) && zr(e));
}
function Gi(e) {
  return T(e?.lift);
}
function L(e) {
  return (t) => {
    if (Gi(t))
      return t.lift(function (r) {
        try {
          return e(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function j(e, t, r, n, o) {
  return new qi(e, t, r, n, o);
}
var qi = class extends Tt {
  constructor(t, r, n, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function Zt() {
  return L((e, t) => {
    let r = null;
    e._refCount++;
    let n = j(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        r = null;
        return;
      }
      let o = e._connection,
        i = r;
      (r = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(n), n.closed || (r = e.connect());
  });
}
var Qt = class extends V {
  constructor(t, r) {
    super(),
      (this.source = t),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Gi(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new K();
      let r = this.getSubject();
      t.add(
        this.source.subscribe(
          j(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        t.closed && ((this._connection = null), (t = K.EMPTY));
    }
    return t;
  }
  refCount() {
    return Zt()(this);
  }
};
var au = zt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var fe = (() => {
    class e extends V {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new qr(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new au();
      }
      next(r) {
        Gt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        Gt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        Gt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: o, observers: i } = this;
        return n || o
          ? Vi
          : ((this.currentObservers = null),
            i.push(r),
            new K(() => {
              (this.currentObservers = null), Fn(i, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: o, isStopped: i } = this;
        n ? r.error(o) : i && r.complete();
      }
      asObservable() {
        let r = new V();
        return (r.source = this), r;
      }
    }
    return (e.create = (t, r) => new qr(t, r)), e;
  })(),
  qr = class extends fe {
    constructor(t, r) {
      super(), (this.destination = t), (this.source = r);
    }
    next(t) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, t);
    }
    error(t) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, t);
    }
    complete() {
      var t, r;
      (r =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        r === void 0 ||
        r.call(t);
    }
    _subscribe(t) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(t)) !== null && n !== void 0
        ? n
        : Vi;
    }
  };
var ee = class extends fe {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let r = super._subscribe(t);
    return !r.closed && t.next(this._value), r;
  }
  getValue() {
    let { hasError: t, thrownError: r, _value: n } = this;
    if (t) throw r;
    return this._throwIfClosed(), n;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var De = new V((e) => e.complete());
function cu(e) {
  return e && T(e.schedule);
}
function uu(e) {
  return e[e.length - 1];
}
function lu(e) {
  return T(uu(e)) ? e.pop() : void 0;
}
function ut(e) {
  return cu(uu(e)) ? e.pop() : void 0;
}
function fu(e, t, r, n) {
  function o(i) {
    return i instanceof r
      ? i
      : new r(function (s) {
          s(i);
        });
  }
  return new (r || (r = Promise))(function (i, s) {
    function a(l) {
      try {
        u(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(a, c);
    }
    u((n = n.apply(e, t || [])).next());
  });
}
function du(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    r = t && e[t],
    n = 0;
  if (r) return r.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function St(e) {
  return this instanceof St ? ((this.v = e), this) : new St(e);
}
function hu(e, t, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(e, t || []),
    o,
    i = [];
  return (
    (o = {}),
    s("next"),
    s("throw"),
    s("return"),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    n[f] &&
      (o[f] = function (h) {
        return new Promise(function (g, C) {
          i.push([f, h, g, C]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      c(n[f](h));
    } catch (g) {
      d(i[0][3], g);
    }
  }
  function c(f) {
    f.value instanceof St
      ? Promise.resolve(f.value.v).then(u, l)
      : d(i[0][2], f);
  }
  function u(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function pu(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    r;
  return t
    ? t.call(e)
    : ((e = typeof du == "function" ? du(e) : e[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(i) {
    r[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (u) {
      i({ value: u, done: a });
    }, s);
  }
}
var Yr = (e) => e && typeof e.length == "number" && typeof e != "function";
function Zr(e) {
  return T(e?.then);
}
function Qr(e) {
  return T(e[Yt]);
}
function Xr(e) {
  return Symbol.asyncIterator && T(e?.[Symbol.asyncIterator]);
}
function Jr(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function sp() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Kr = sp();
function eo(e) {
  return T(e?.[Kr]);
}
function to(e) {
  return hu(this, arguments, function* () {
    let r = e.getReader();
    try {
      for (;;) {
        let { value: n, done: o } = yield St(r.read());
        if (o) return yield St(void 0);
        yield yield St(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function no(e) {
  return T(e?.getReader);
}
function oe(e) {
  if (e instanceof V) return e;
  if (e != null) {
    if (Qr(e)) return ap(e);
    if (Yr(e)) return cp(e);
    if (Zr(e)) return up(e);
    if (Xr(e)) return gu(e);
    if (eo(e)) return lp(e);
    if (no(e)) return dp(e);
  }
  throw Jr(e);
}
function ap(e) {
  return new V((t) => {
    let r = e[Yt]();
    if (T(r.subscribe)) return r.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function cp(e) {
  return new V((t) => {
    for (let r = 0; r < e.length && !t.closed; r++) t.next(e[r]);
    t.complete();
  });
}
function up(e) {
  return new V((t) => {
    e.then(
      (r) => {
        t.closed || (t.next(r), t.complete());
      },
      (r) => t.error(r)
    ).then(null, Wr);
  });
}
function lp(e) {
  return new V((t) => {
    for (let r of e) if ((t.next(r), t.closed)) return;
    t.complete();
  });
}
function gu(e) {
  return new V((t) => {
    fp(e, t).catch((r) => t.error(r));
  });
}
function dp(e) {
  return gu(to(e));
}
function fp(e, t) {
  var r, n, o, i;
  return fu(this, void 0, void 0, function* () {
    try {
      for (r = pu(e); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        n && !n.done && (i = r.return) && (yield i.call(r));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function ge(e, t, r, n = 0, o = !1) {
  let i = t.schedule(function () {
    r(), o ? e.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((e.add(i), !o)) return i;
}
function ro(e, t = 0) {
  return L((r, n) => {
    r.subscribe(
      j(
        n,
        (o) => ge(n, e, () => n.next(o), t),
        () => ge(n, e, () => n.complete(), t),
        (o) => ge(n, e, () => n.error(o), t)
      )
    );
  });
}
function oo(e, t = 0) {
  return L((r, n) => {
    n.add(e.schedule(() => r.subscribe(n), t));
  });
}
function mu(e, t) {
  return oe(e).pipe(oo(t), ro(t));
}
function vu(e, t) {
  return oe(e).pipe(oo(t), ro(t));
}
function yu(e, t) {
  return new V((r) => {
    let n = 0;
    return t.schedule(function () {
      n === e.length
        ? r.complete()
        : (r.next(e[n++]), r.closed || this.schedule());
    });
  });
}
function Du(e, t) {
  return new V((r) => {
    let n;
    return (
      ge(r, t, () => {
        (n = e[Kr]()),
          ge(
            r,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              i ? r.complete() : r.next(o);
            },
            0,
            !0
          );
      }),
      () => T(n?.return) && n.return()
    );
  });
}
function io(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new V((r) => {
    ge(r, t, () => {
      let n = e[Symbol.asyncIterator]();
      ge(
        r,
        t,
        () => {
          n.next().then((o) => {
            o.done ? r.complete() : r.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function wu(e, t) {
  return io(to(e), t);
}
function Cu(e, t) {
  if (e != null) {
    if (Qr(e)) return mu(e, t);
    if (Yr(e)) return yu(e, t);
    if (Zr(e)) return vu(e, t);
    if (Xr(e)) return io(e, t);
    if (eo(e)) return Du(e, t);
    if (no(e)) return wu(e, t);
  }
  throw Jr(e);
}
function q(e, t) {
  return t ? Cu(e, t) : oe(e);
}
function I(...e) {
  let t = ut(e);
  return q(e, t);
}
function Xt(e, t) {
  let r = T(e) ? e : () => e,
    n = (o) => o.error(r());
  return new V(t ? (o) => t.schedule(n, 0, o) : n);
}
function Yi(e) {
  return !!e && (e instanceof V || (T(e.lift) && T(e.subscribe)));
}
var Ke = zt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function x(e, t) {
  return L((r, n) => {
    let o = 0;
    r.subscribe(
      j(n, (i) => {
        n.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: hp } = Array;
function pp(e, t) {
  return hp(t) ? e(...t) : e(t);
}
function bu(e) {
  return x((t) => pp(e, t));
}
var { isArray: gp } = Array,
  { getPrototypeOf: mp, prototype: vp, keys: yp } = Object;
function Iu(e) {
  if (e.length === 1) {
    let t = e[0];
    if (gp(t)) return { args: t, keys: null };
    if (Dp(t)) {
      let r = yp(t);
      return { args: r.map((n) => t[n]), keys: r };
    }
  }
  return { args: e, keys: null };
}
function Dp(e) {
  return e && typeof e == "object" && mp(e) === vp;
}
function Eu(e, t) {
  return e.reduce((r, n, o) => ((r[n] = t[o]), r), {});
}
function so(...e) {
  let t = ut(e),
    r = lu(e),
    { args: n, keys: o } = Iu(e);
  if (n.length === 0) return q([], t);
  let i = new V(wp(n, t, o ? (s) => Eu(o, s) : ye));
  return r ? i.pipe(bu(r)) : i;
}
function wp(e, t, r = ye) {
  return (n) => {
    Mu(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          Mu(
            t,
            () => {
              let u = q(e[c], t),
                l = !1;
              u.subscribe(
                j(
                  n,
                  (d) => {
                    (i[c] = d), l || ((l = !0), a--), a || n.next(r(i.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function Mu(e, t, r) {
  e ? ge(r, e, t) : t();
}
function Tu(e, t, r, n, o, i, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !c.length && !u && t.complete();
    },
    h = (C) => (u < n ? g(C) : c.push(C)),
    g = (C) => {
      i && t.next(C), u++;
      let b = !1;
      oe(r(C, l++)).subscribe(
        j(
          t,
          (v) => {
            o?.(v), i ? h(v) : t.next(v);
          },
          () => {
            b = !0;
          },
          void 0,
          () => {
            if (b)
              try {
                for (u--; c.length && u < n; ) {
                  let v = c.shift();
                  s ? ge(t, s, () => g(v)) : g(v);
                }
                f();
              } catch (v) {
                t.error(v);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      j(t, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function te(e, t, r = 1 / 0) {
  return T(t)
    ? te((n, o) => x((i, s) => t(n, i, o, s))(oe(e(n, o))), r)
    : (typeof t == "number" && (r = t), L((n, o) => Tu(n, o, e, r)));
}
function Zi(e = 1 / 0) {
  return te(ye, e);
}
function Su() {
  return Zi(1);
}
function Jt(...e) {
  return Su()(q(e, ut(e)));
}
function ao(e) {
  return new V((t) => {
    oe(e()).subscribe(t);
  });
}
function we(e, t) {
  return L((r, n) => {
    let o = 0;
    r.subscribe(j(n, (i) => e.call(t, i, o++) && n.next(i)));
  });
}
function lt(e) {
  return L((t, r) => {
    let n = null,
      o = !1,
      i;
    (n = t.subscribe(
      j(r, void 0, void 0, (s) => {
        (i = oe(e(s, lt(e)(t)))),
          n ? (n.unsubscribe(), (n = null), i.subscribe(r)) : (o = !0);
      })
    )),
      o && (n.unsubscribe(), (n = null), i.subscribe(r));
  });
}
function xu(e, t, r, n, o) {
  return (i, s) => {
    let a = r,
      c = t,
      u = 0;
    i.subscribe(
      j(
        s,
        (l) => {
          let d = u++;
          (c = a ? e(c, l, d) : ((a = !0), l)), n && s.next(c);
        },
        o &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function dt(e, t) {
  return T(t) ? te(e, t, 1) : te(e, 1);
}
function ft(e) {
  return L((t, r) => {
    let n = !1;
    t.subscribe(
      j(
        r,
        (o) => {
          (n = !0), r.next(o);
        },
        () => {
          n || r.next(e), r.complete();
        }
      )
    );
  });
}
function et(e) {
  return e <= 0
    ? () => De
    : L((t, r) => {
        let n = 0;
        t.subscribe(
          j(r, (o) => {
            ++n <= e && (r.next(o), e <= n && r.complete());
          })
        );
      });
}
function Qi(e) {
  return x(() => e);
}
function co(e = Cp) {
  return L((t, r) => {
    let n = !1;
    t.subscribe(
      j(
        r,
        (o) => {
          (n = !0), r.next(o);
        },
        () => (n ? r.complete() : r.error(e()))
      )
    );
  });
}
function Cp() {
  return new Ke();
}
function xt(e) {
  return L((t, r) => {
    try {
      t.subscribe(r);
    } finally {
      r.add(e);
    }
  });
}
function He(e, t) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      e ? we((o, i) => e(o, i, n)) : ye,
      et(1),
      r ? ft(t) : co(() => new Ke())
    );
}
function Kt(e) {
  return e <= 0
    ? () => De
    : L((t, r) => {
        let n = [];
        t.subscribe(
          j(
            r,
            (o) => {
              n.push(o), e < n.length && n.shift();
            },
            () => {
              for (let o of n) r.next(o);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function Xi(e, t) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      e ? we((o, i) => e(o, i, n)) : ye,
      Kt(1),
      r ? ft(t) : co(() => new Ke())
    );
}
function Ji(e, t) {
  return L(xu(e, t, arguments.length >= 2, !0));
}
function Ki(...e) {
  let t = ut(e);
  return L((r, n) => {
    (t ? Jt(e, r, t) : Jt(e, r)).subscribe(n);
  });
}
function Ce(e, t) {
  return L((r, n) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && n.complete();
    r.subscribe(
      j(
        n,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          oe(e(c, l)).subscribe(
            (o = j(
              n,
              (d) => n.next(t ? t(c, d, l, u++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function es(e) {
  return L((t, r) => {
    oe(e).subscribe(j(r, () => r.complete(), kn)), !r.closed && t.subscribe(r);
  });
}
function ie(e, t, r) {
  let n = T(e) || t || r ? { next: e, error: t, complete: r } : e;
  return n
    ? L((o, i) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        o.subscribe(
          j(
            i,
            (c) => {
              var u;
              (u = n.next) === null || u === void 0 || u.call(n, c), i.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = n.complete) === null || c === void 0 || c.call(n),
                i.complete();
            },
            (c) => {
              var u;
              (a = !1),
                (u = n.error) === null || u === void 0 || u.call(n, c),
                i.error(c);
            },
            () => {
              var c, u;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)),
                (u = n.finalize) === null || u === void 0 || u.call(n);
            }
          )
        );
      })
    : ye;
}
var ll = "https://g.co/ng/security#xss",
  E = class extends Error {
    constructor(t, r) {
      super(Po(t, r)), (this.code = t);
    }
  };
function Po(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Fo(e) {
  return { toString: e }.toString();
}
var Ln = globalThis;
function $(e) {
  for (let t in e) if (e[t] === $) return t;
  throw Error("Could not find renamed property on target object.");
}
function Ie(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(Ie).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let r = t.indexOf(`
`);
  return r === -1 ? t : t.substring(0, r);
}
function gs(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
var bp = $({ __forward_ref__: $ });
function dl(e) {
  return (
    (e.__forward_ref__ = dl),
    (e.toString = function () {
      return Ie(this());
    }),
    e
  );
}
function Ne(e) {
  return fl(e) ? e() : e;
}
function fl(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(bp) && e.__forward_ref__ === dl
  );
}
function y(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function rr(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function ko(e) {
  return _u(e, pl) || _u(e, gl);
}
function hl(e) {
  return ko(e) !== null;
}
function _u(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Ip(e) {
  let t = e && (e[pl] || e[gl]);
  return t || null;
}
function Au(e) {
  return e && (e.hasOwnProperty(Nu) || e.hasOwnProperty(Ep)) ? e[Nu] : null;
}
var pl = $({ ɵprov: $ }),
  Nu = $({ ɵinj: $ }),
  gl = $({ ngInjectableDef: $ }),
  Ep = $({ ngInjectorDef: $ }),
  A = class {
    constructor(t, r) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = y({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function ml(e) {
  return e && !!e.ɵproviders;
}
var Mp = $({ ɵcmp: $ }),
  Tp = $({ ɵdir: $ }),
  Sp = $({ ɵpipe: $ }),
  xp = $({ ɵmod: $ }),
  mo = $({ ɵfac: $ }),
  jn = $({ __NG_ELEMENT_ID__: $ }),
  Ru = $({ __NG_ENV_ID__: $ });
function Vn(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function _p(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : Vn(e);
}
function Ap(e, t) {
  let r = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new E(-200, e);
}
function na(e, t) {
  throw new E(-201, !1);
}
var R = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(R || {}),
  ms;
function vl() {
  return ms;
}
function Ae(e) {
  let t = ms;
  return (ms = e), t;
}
function yl(e, t, r) {
  let n = ko(e);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & R.Optional) return null;
  if (t !== void 0) return t;
  na(e, "Injector");
}
var Np = {},
  Bn = Np,
  Rp = "__NG_DI_FLAG__",
  vo = "ngTempTokenPath",
  Op = "ngTokenPath",
  Pp = /\n/gm,
  Fp = "\u0275",
  Ou = "__source",
  rn;
function kp() {
  return rn;
}
function ht(e) {
  let t = rn;
  return (rn = e), t;
}
function Lp(e, t = R.Default) {
  if (rn === void 0) throw new E(-203, !1);
  return rn === null
    ? yl(e, void 0, t)
    : rn.get(e, t & R.Optional ? null : void 0, t);
}
function _(e, t = R.Default) {
  return (vl() || Lp)(Ne(e), t);
}
function p(e, t = R.Default) {
  return _(e, Lo(t));
}
function Lo(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function vs(e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let n = Ne(e[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new E(900, !1);
      let o,
        i = R.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = jp(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(_(o, i));
    } else t.push(_(n));
  }
  return t;
}
function jp(e) {
  return e[Rp];
}
function Vp(e, t, r, n) {
  let o = e[vo];
  throw (
    (t[Ou] && o.unshift(t[Ou]),
    (e.message = Bp(
      `
` + e.message,
      o,
      r,
      n
    )),
    (e[Op] = o),
    (e[vo] = null),
    e)
  );
}
function Bp(e, t, r, n = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Fp
      ? e.slice(2)
      : e;
  let o = Ie(t);
  if (Array.isArray(t)) o = t.map(Ie).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : Ie(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${o}]: ${e.replace(
    Pp,
    `
  `
  )}`;
}
function an(e, t) {
  let r = e.hasOwnProperty(mo);
  return r ? e[mo] : null;
}
function ra(e, t) {
  e.forEach((r) => (Array.isArray(r) ? ra(r, t) : t(r)));
}
function Dl(e, t, r) {
  t >= e.length ? e.push(r) : e.splice(t, 0, r);
}
function yo(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Up(e, t, r, n) {
  let o = e.length;
  if (o == t) e.push(r, n);
  else if (o === 1) e.push(n, e[0]), (e[0] = r);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = r), (e[t + 1] = n);
  }
}
function jo(e, t, r) {
  let n = or(e, t);
  return n >= 0 ? (e[n | 1] = r) : ((n = ~n), Up(e, n, t, r)), n;
}
function ts(e, t) {
  let r = or(e, t);
  if (r >= 0) return e[r | 1];
}
function or(e, t) {
  return $p(e, t, 1);
}
function $p(e, t, r) {
  let n = 0,
    o = e.length >> r;
  for (; o !== n; ) {
    let i = n + ((o - n) >> 1),
      s = e[i << r];
    if (t === s) return i << r;
    s > t ? (o = i) : (n = i + 1);
  }
  return ~(o << r);
}
var Un = {},
  be = [],
  cn = new A(""),
  wl = new A("", -1),
  Cl = new A(""),
  Do = class {
    get(t, r = Bn) {
      if (r === Bn) {
        let n = new Error(`NullInjectorError: No provider for ${Ie(t)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  },
  bl = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(bl || {}),
  Ge = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(Ge || {}),
  gt = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(gt || {});
function Hp(e, t, r) {
  let n = e.length;
  for (;;) {
    let o = e.indexOf(t, r);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === n || e.charCodeAt(o + i) <= 32) return o;
    }
    r = o + 1;
  }
}
function ys(e, t, r) {
  let n = 0;
  for (; n < r.length; ) {
    let o = r[n];
    if (typeof o == "number") {
      if (o !== 0) break;
      n++;
      let i = r[n++],
        s = r[n++],
        a = r[n++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = r[++n];
      Wp(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), n++;
    }
  }
  return n;
}
function zp(e) {
  return e === 3 || e === 4 || e === 6;
}
function Wp(e) {
  return e.charCodeAt(0) === 64;
}
function oa(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let r = -1;
      for (let n = 0; n < t.length; n++) {
        let o = t[n];
        typeof o == "number"
          ? (r = o)
          : r === 0 ||
            (r === -1 || r === 2
              ? Pu(e, r, o, null, t[++n])
              : Pu(e, r, o, null, null));
      }
    }
  return e;
}
function Pu(e, t, r, n, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (n === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, n !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, r),
    n !== null && e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o);
}
var Il = "ng-template";
function Gp(e, t, r, n) {
  let o = 0;
  if (n) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Hp(t[o + 1].toLowerCase(), r, 0) !== -1)
        return !0;
  } else if (ia(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === r) return !0;
  }
  return !1;
}
function ia(e) {
  return e.type === 4 && e.value !== Il;
}
function qp(e, t, r) {
  let n = e.type === 4 && !r ? Il : e.value;
  return t === n;
}
function Yp(e, t, r) {
  let n = 4,
    o = e.attrs,
    i = o !== null ? Xp(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !Pe(n) && !Pe(c)) return !1;
      if (s && Pe(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (c !== "" && !qp(e, c, r)) || (c === "" && t.length === 1))
        ) {
          if (Pe(n)) return !1;
          s = !0;
        }
      } else if (n & 8) {
        if (o === null || !Gp(e, o, c, r)) {
          if (Pe(n)) return !1;
          s = !0;
        }
      } else {
        let u = t[++a],
          l = Zp(c, o, ia(e), r);
        if (l === -1) {
          if (Pe(n)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), n & 2 && u !== d)
          ) {
            if (Pe(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Pe(n) || s;
}
function Pe(e) {
  return (e & 1) === 0;
}
function Zp(e, t, r, n) {
  if (t === null) return -1;
  let o = 0;
  if (n || !r) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Jp(t, e);
}
function Qp(e, t, r = !1) {
  for (let n = 0; n < t.length; n++) if (Yp(e, t[n], r)) return !0;
  return !1;
}
function Xp(e) {
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    if (zp(r)) return t;
  }
  return e.length;
}
function Jp(e, t) {
  let r = e.indexOf(4);
  if (r > -1)
    for (r++; r < e.length; ) {
      let n = e[r];
      if (typeof n == "number") return -1;
      if (n === t) return r;
      r++;
    }
  return -1;
}
function Fu(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Kp(e) {
  let t = e[0],
    r = 1,
    n = 2,
    o = "",
    i = !1;
  for (; r < e.length; ) {
    let s = e[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = e[++r];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (o += "." + s) : n & 4 && (o += " " + s);
    else
      o !== "" && !Pe(s) && ((t += Fu(i, o)), (o = "")),
        (n = s),
        (i = i || !Pe(n));
    r++;
  }
  return o !== "" && (t += Fu(i, o)), t;
}
function eg(e) {
  return e.map(Kp).join(",");
}
function tg(e) {
  let t = [],
    r = [],
    n = 1,
    o = 2;
  for (; n < e.length; ) {
    let i = e[n];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++n]) : o === 8 && r.push(i);
    else {
      if (!Pe(o)) break;
      o = i;
    }
    n++;
  }
  return { attrs: t, classes: r };
}
function Q(e) {
  return Fo(() => {
    let t = xl(e),
      r = Z(m({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === bl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ge.Emulated,
        styles: e.styles || be,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    _l(r);
    let n = e.dependencies;
    return (
      (r.directiveDefs = Lu(n, !1)), (r.pipeDefs = Lu(n, !0)), (r.id = og(r)), r
    );
  });
}
function ng(e) {
  return At(e) || El(e);
}
function rg(e) {
  return e !== null;
}
function ir(e) {
  return Fo(() => ({
    type: e.type,
    bootstrap: e.bootstrap || be,
    declarations: e.declarations || be,
    imports: e.imports || be,
    exports: e.exports || be,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function ku(e, t) {
  if (e == null) return Un;
  let r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let o = e[n],
        i,
        s,
        a = gt.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((r[i] = a !== gt.None ? [n, a] : n), (t[i] = s)) : (r[i] = n);
    }
  return r;
}
function sa(e) {
  return Fo(() => {
    let t = xl(e);
    return _l(t), t;
  });
}
function At(e) {
  return e[Mp] || null;
}
function El(e) {
  return e[Tp] || null;
}
function Ml(e) {
  return e[Sp] || null;
}
function Tl(e) {
  let t = At(e) || El(e) || Ml(e);
  return t !== null ? t.standalone : !1;
}
function Sl(e, t) {
  let r = e[xp] || null;
  if (!r && t === !0)
    throw new Error(`Type ${Ie(e)} does not have '\u0275mod' property.`);
  return r;
}
function xl(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || Un,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || be,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ku(e.inputs, t),
    outputs: ku(e.outputs),
    debugInfo: null,
  };
}
function _l(e) {
  e.features?.forEach((t) => t(e));
}
function Lu(e, t) {
  if (!e) return null;
  let r = t ? Ml : ng;
  return () => (typeof e == "function" ? e() : e).map((n) => r(n)).filter(rg);
}
function og(e) {
  let t = 0,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of r) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function pn(e) {
  return { ɵproviders: e };
}
function ig(...e) {
  return { ɵproviders: Al(!0, e), ɵfromNgModule: !0 };
}
function Al(e, ...t) {
  let r = [],
    n = new Set(),
    o,
    i = (s) => {
      r.push(s);
    };
  return (
    ra(t, (s) => {
      let a = s;
      Ds(a, i, [], n) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Nl(o, i),
    r
  );
}
function Nl(e, t) {
  for (let r = 0; r < e.length; r++) {
    let { ngModule: n, providers: o } = e[r];
    aa(o, (i) => {
      t(i, n);
    });
  }
}
function Ds(e, t, r, n) {
  if (((e = Ne(e)), !e)) return !1;
  let o = null,
    i = Au(e),
    s = !i && At(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Au(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = n.has(o);
  if (s) {
    if (a) return !1;
    if ((n.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) Ds(u, t, r, n);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      n.add(o);
      let u;
      try {
        ra(i.imports, (l) => {
          Ds(l, t, r, n) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Nl(u, t);
    }
    if (!a) {
      let u = an(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: be }, o),
        t({ provide: Cl, useValue: o, multi: !0 }, o),
        t({ provide: cn, useValue: () => _(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = e;
      aa(c, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function aa(e, t) {
  for (let r of e)
    ml(r) && (r = r.ɵproviders), Array.isArray(r) ? aa(r, t) : t(r);
}
var sg = $({ provide: String, useValue: $ });
function Rl(e) {
  return e !== null && typeof e == "object" && sg in e;
}
function ag(e) {
  return !!(e && e.useExisting);
}
function cg(e) {
  return !!(e && e.useFactory);
}
function ws(e) {
  return typeof e == "function";
}
var Vo = new A(""),
  lo = {},
  ug = {},
  ns;
function ca() {
  return ns === void 0 && (ns = new Do()), ns;
}
var me = class {},
  $n = class extends me {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, r, n, o) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        bs(t, (s) => this.processProvider(s)),
        this.records.set(wl, en(void 0, this)),
        o.has("environment") && this.records.set(me, en(void 0, this));
      let i = this.records.get(Vo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Cl, be, R.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = k(null);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let r = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of r) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          k(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let r = ht(this),
        n = Ae(void 0),
        o;
      try {
        return t();
      } finally {
        ht(r), Ae(n);
      }
    }
    get(t, r = Bn, n = R.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(Ru))) return t[Ru](this);
      n = Lo(n);
      let o,
        i = ht(this),
        s = Ae(void 0);
      try {
        if (!(n & R.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let u = gg(t) && ko(t);
            u && this.injectableDefInScope(u)
              ? (c = en(Cs(t), lo))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = n & R.Self ? ca() : this.parent;
        return (r = n & R.Optional && r === Bn ? null : r), a.get(t, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[vo] = a[vo] || []).unshift(Ie(t)), i)) throw a;
          return Vp(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Ae(s), ht(i);
      }
    }
    resolveInjectorInitializers() {
      let t = k(null),
        r = ht(this),
        n = Ae(void 0),
        o;
      try {
        let i = this.get(cn, be, R.Self);
        for (let s of i) s();
      } finally {
        ht(r), Ae(n), k(t);
      }
    }
    toString() {
      let t = [],
        r = this.records;
      for (let n of r.keys()) t.push(Ie(n));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new E(205, !1);
    }
    processProvider(t) {
      t = Ne(t);
      let r = ws(t) ? t : Ne(t && t.provide),
        n = dg(t);
      if (!ws(t) && t.multi === !0) {
        let o = this.records.get(r);
        o ||
          ((o = en(void 0, lo, !0)),
          (o.factory = () => vs(o.multi)),
          this.records.set(r, o)),
          (r = t),
          o.multi.push(t);
      }
      this.records.set(r, n);
    }
    hydrate(t, r) {
      let n = k(null);
      try {
        return (
          r.value === lo && ((r.value = ug), (r.value = r.factory())),
          typeof r.value == "object" &&
            r.value &&
            pg(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        );
      } finally {
        k(n);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let r = Ne(t.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(t) {
      let r = this._onDestroyHooks.indexOf(t);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function Cs(e) {
  let t = ko(e),
    r = t !== null ? t.factory : an(e);
  if (r !== null) return r;
  if (e instanceof A) throw new E(204, !1);
  if (e instanceof Function) return lg(e);
  throw new E(204, !1);
}
function lg(e) {
  if (e.length > 0) throw new E(204, !1);
  let r = Ip(e);
  return r !== null ? () => r.factory(e) : () => new e();
}
function dg(e) {
  if (Rl(e)) return en(void 0, e.useValue);
  {
    let t = fg(e);
    return en(t, lo);
  }
}
function fg(e, t, r) {
  let n;
  if (ws(e)) {
    let o = Ne(e);
    return an(o) || Cs(o);
  } else if (Rl(e)) n = () => Ne(e.useValue);
  else if (cg(e)) n = () => e.useFactory(...vs(e.deps || []));
  else if (ag(e)) n = () => _(Ne(e.useExisting));
  else {
    let o = Ne(e && (e.useClass || e.provide));
    if (hg(e)) n = () => new o(...vs(e.deps));
    else return an(o) || Cs(o);
  }
  return n;
}
function en(e, t, r = !1) {
  return { factory: e, value: t, multi: r ? [] : void 0 };
}
function hg(e) {
  return !!e.deps;
}
function pg(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function gg(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof A);
}
function bs(e, t) {
  for (let r of e)
    Array.isArray(r) ? bs(r, t) : r && ml(r) ? bs(r.ɵproviders, t) : t(r);
}
function rt(e, t) {
  e instanceof $n && e.assertNotDestroyed();
  let r,
    n = ht(e),
    o = Ae(void 0);
  try {
    return t();
  } finally {
    ht(n), Ae(o);
  }
}
function mg() {
  return vl() !== void 0 || kp() != null;
}
function vg(e) {
  return typeof e == "function";
}
var ot = 0,
  O = 1,
  M = 2,
  le = 3,
  Fe = 4,
  Ve = 5,
  Hn = 6,
  zn = 7,
  ue = 8,
  un = 9,
  ke = 10,
  de = 11,
  Wn = 12,
  ju = 13,
  gn = 14,
  Le = 15,
  Bo = 16,
  tn = 17,
  ln = 18,
  Uo = 19,
  Ol = 20,
  pt = 21,
  rs = 22,
  Nt = 23,
  je = 25,
  Pl = 1;
var Rt = 7,
  wo = 8,
  Co = 9,
  he = 10,
  ua = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(ua || {});
function on(e) {
  return Array.isArray(e) && typeof e[Pl] == "object";
}
function it(e) {
  return Array.isArray(e) && e[Pl] === !0;
}
function Fl(e) {
  return (e.flags & 4) !== 0;
}
function $o(e) {
  return e.componentOffset > -1;
}
function la(e) {
  return (e.flags & 1) === 1;
}
function sr(e) {
  return !!e.template;
}
function yg(e) {
  return (e[M] & 512) !== 0;
}
var Is = class {
  constructor(t, r, n) {
    (this.previousValue = t), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function kl(e, t, r, n) {
  t !== null ? t.applyValueToInputSignal(t, n) : (e[r] = n);
}
function Ho() {
  return Ll;
}
function Ll(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = wg), Dg;
}
Ho.ngInherit = !0;
function Dg() {
  let e = Vl(this),
    t = e?.current;
  if (t) {
    let r = e.previous;
    if (r === Un) e.previous = t;
    else for (let n in t) r[n] = t[n];
    (e.current = null), this.ngOnChanges(t);
  }
}
function wg(e, t, r, n, o) {
  let i = this.declaredInputs[n],
    s = Vl(e) || Cg(e, { previous: Un, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[i];
  (a[i] = new Is(u && u.currentValue, r, c === Un)), kl(e, t, o, r);
}
var jl = "__ngSimpleChanges__";
function Vl(e) {
  return e[jl] || null;
}
function Cg(e, t) {
  return (e[jl] = t);
}
var Vu = null;
var ze = function (e, t, r) {
    Vu?.(e, t, r);
  },
  bg = "svg",
  Ig = "math",
  Eg = !1;
function Mg() {
  return Eg;
}
function qe(e) {
  for (; Array.isArray(e); ) e = e[ot];
  return e;
}
function Bl(e, t) {
  return qe(t[e]);
}
function Be(e, t) {
  return qe(t[e.index]);
}
function da(e, t) {
  return e.data[t];
}
function Lt(e, t) {
  let r = t[e];
  return on(r) ? r : r[ot];
}
function fa(e) {
  return (e[M] & 128) === 128;
}
function Tg(e) {
  return it(e[le]);
}
function bo(e, t) {
  return t == null ? null : e[t];
}
function Ul(e) {
  e[tn] = 0;
}
function Sg(e) {
  e[M] & 1024 || ((e[M] |= 1024), fa(e) && Gn(e));
}
function xg(e, t) {
  for (; e > 0; ) (t = t[gn]), e--;
  return t;
}
function ha(e) {
  return !!(e[M] & 9216 || e[Nt]?.dirty);
}
function Es(e) {
  e[ke].changeDetectionScheduler?.notify(1),
    ha(e)
      ? Gn(e)
      : e[M] & 64 &&
        (Mg()
          ? ((e[M] |= 1024), Gn(e))
          : e[ke].changeDetectionScheduler?.notify());
}
function Gn(e) {
  e[ke].changeDetectionScheduler?.notify();
  let t = qn(e);
  for (; t !== null && !(t[M] & 8192 || ((t[M] |= 8192), !fa(t))); ) t = qn(t);
}
function $l(e, t) {
  if ((e[M] & 256) === 256) throw new E(911, !1);
  e[pt] === null && (e[pt] = []), e[pt].push(t);
}
function _g(e, t) {
  if (e[pt] === null) return;
  let r = e[pt].indexOf(t);
  r !== -1 && e[pt].splice(r, 1);
}
function qn(e) {
  let t = e[le];
  return it(t) ? t[le] : t;
}
var P = { lFrame: Ql(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Ag() {
  return P.lFrame.elementDepthCount;
}
function Ng() {
  P.lFrame.elementDepthCount++;
}
function Rg() {
  P.lFrame.elementDepthCount--;
}
function Hl() {
  return P.bindingsEnabled;
}
function Og() {
  return P.skipHydrationRootTNode !== null;
}
function Pg(e) {
  return P.skipHydrationRootTNode === e;
}
function Fg() {
  P.skipHydrationRootTNode = null;
}
function H() {
  return P.lFrame.lView;
}
function st() {
  return P.lFrame.tView;
}
function mn(e) {
  return (P.lFrame.contextLView = e), e[ue];
}
function vn(e) {
  return (P.lFrame.contextLView = null), e;
}
function at() {
  let e = zl();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function zl() {
  return P.lFrame.currentTNode;
}
function kg() {
  let e = P.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function ar(e, t) {
  let r = P.lFrame;
  (r.currentTNode = e), (r.isParent = t);
}
function Wl() {
  return P.lFrame.isParent;
}
function Lg() {
  P.lFrame.isParent = !1;
}
function jg() {
  let e = P.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function Vg() {
  return P.lFrame.bindingIndex;
}
function Bg(e) {
  return (P.lFrame.bindingIndex = e);
}
function zo() {
  return P.lFrame.bindingIndex++;
}
function Gl(e) {
  let t = P.lFrame,
    r = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), r;
}
function Ug() {
  return P.lFrame.inI18n;
}
function $g(e, t) {
  let r = P.lFrame;
  (r.bindingIndex = r.bindingRootIndex = e), Ms(t);
}
function Hg() {
  return P.lFrame.currentDirectiveIndex;
}
function Ms(e) {
  P.lFrame.currentDirectiveIndex = e;
}
function zg(e) {
  let t = P.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function ql(e) {
  P.lFrame.currentQueryIndex = e;
}
function Wg(e) {
  let t = e[O];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ve] : null;
}
function Yl(e, t, r) {
  if (r & R.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(r & R.Host); )
      if (((o = Wg(i)), o === null || ((i = i[gn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let n = (P.lFrame = Zl());
  return (n.currentTNode = t), (n.lView = e), !0;
}
function pa(e) {
  let t = Zl(),
    r = e[O];
  (P.lFrame = t),
    (t.currentTNode = r.firstChild),
    (t.lView = e),
    (t.tView = r),
    (t.contextLView = e),
    (t.bindingIndex = r.bindingStartIndex),
    (t.inI18n = !1);
}
function Zl() {
  let e = P.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Ql(e) : t;
}
function Ql(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function Xl() {
  let e = P.lFrame;
  return (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var Jl = Xl;
function ga() {
  let e = Xl();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Gg(e) {
  return (P.lFrame.contextLView = xg(e, P.lFrame.contextLView))[ue];
}
function vt() {
  return P.lFrame.selectedIndex;
}
function Ot(e) {
  P.lFrame.selectedIndex = e;
}
function Kl() {
  let e = P.lFrame;
  return da(e.tView, e.selectedIndex);
}
function qg() {
  return P.lFrame.currentNamespace;
}
var ed = !0;
function ma() {
  return ed;
}
function va(e) {
  ed = e;
}
function Yg(e, t, r) {
  let { ngOnChanges: n, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (n) {
    let s = Ll(t);
    (r.preOrderHooks ??= []).push(e, s),
      (r.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (r.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((r.preOrderHooks ??= []).push(e, i),
      (r.preOrderCheckHooks ??= []).push(e, i));
}
function ya(e, t) {
  for (let r = t.directiveStart, n = t.directiveEnd; r < n; r++) {
    let i = e.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-r, s),
      a &&
        ((e.contentHooks ??= []).push(r, a),
        (e.contentCheckHooks ??= []).push(r, a)),
      c && (e.viewHooks ??= []).push(-r, c),
      u &&
        ((e.viewHooks ??= []).push(r, u), (e.viewCheckHooks ??= []).push(r, u)),
      l != null && (e.destroyHooks ??= []).push(r, l);
  }
}
function fo(e, t, r) {
  td(e, t, 3, r);
}
function ho(e, t, r, n) {
  (e[M] & 3) === r && td(e, t, r, n);
}
function os(e, t) {
  let r = e[M];
  (r & 3) === t && ((r &= 16383), (r += 1), (e[M] = r));
}
function td(e, t, r, n) {
  let o = n !== void 0 ? e[tn] & 65535 : 0,
    i = n ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), n != null && a >= n)) break;
    } else
      t[c] < 0 && (e[tn] += 65536),
        (a < i || i == -1) &&
          (Zg(e, r, t, c), (e[tn] = (e[tn] & 4294901760) + c + 2)),
        c++;
}
function Bu(e, t) {
  ze(4, e, t);
  let r = k(null);
  try {
    t.call(e);
  } finally {
    k(r), ze(5, e, t);
  }
}
function Zg(e, t, r, n) {
  let o = r[n] < 0,
    i = r[n + 1],
    s = o ? -r[n] : r[n],
    a = e[s];
  o
    ? e[M] >> 14 < e[tn] >> 16 &&
      (e[M] & 3) === t &&
      ((e[M] += 16384), Bu(a, i))
    : Bu(a, i);
}
var sn = -1,
  Yn = class {
    constructor(t, r, n) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function Qg(e) {
  return e instanceof Yn;
}
function Xg(e) {
  return (e.flags & 8) !== 0;
}
function Jg(e) {
  return (e.flags & 16) !== 0;
}
function nd(e) {
  return e !== sn;
}
function Io(e) {
  return e & 32767;
}
function Kg(e) {
  return e >> 16;
}
function Eo(e, t) {
  let r = Kg(e),
    n = t;
  for (; r > 0; ) (n = n[gn]), r--;
  return n;
}
var Ts = !0;
function Uu(e) {
  let t = Ts;
  return (Ts = e), t;
}
var em = 256,
  rd = em - 1,
  od = 5,
  tm = 0,
  We = {};
function nm(e, t, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(jn) && (n = r[jn]),
    n == null && (n = r[jn] = tm++);
  let o = n & rd,
    i = 1 << o;
  t.data[e + (o >> od)] |= i;
}
function id(e, t) {
  let r = sd(e, t);
  if (r !== -1) return r;
  let n = t[O];
  n.firstCreatePass &&
    ((e.injectorIndex = t.length),
    is(n.data, e),
    is(t, null),
    is(n.blueprint, null));
  let o = Da(e, t),
    i = e.injectorIndex;
  if (nd(o)) {
    let s = Io(o),
      a = Eo(o, t),
      c = a[O].data;
    for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
  }
  return (t[i + 8] = o), i;
}
function is(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function sd(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Da(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let r = 0,
    n = null,
    o = t;
  for (; o !== null; ) {
    if (((n = dd(o)), n === null)) return sn;
    if ((r++, (o = o[gn]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return sn;
}
function rm(e, t, r) {
  nm(e, t, r);
}
function ad(e, t, r) {
  if (r & R.Optional || e !== void 0) return e;
  na(t, "NodeInjector");
}
function cd(e, t, r, n) {
  if (
    (r & R.Optional && n === void 0 && (n = null), !(r & (R.Self | R.Host)))
  ) {
    let o = e[un],
      i = Ae(void 0);
    try {
      return o ? o.get(t, n, r & R.Optional) : yl(t, n, r & R.Optional);
    } finally {
      Ae(i);
    }
  }
  return ad(n, t, r);
}
function ud(e, t, r, n = R.Default, o) {
  if (e !== null) {
    if (t[M] & 2048 && !(n & R.Self)) {
      let s = cm(e, t, r, n, We);
      if (s !== We) return s;
    }
    let i = ld(e, t, r, n, We);
    if (i !== We) return i;
  }
  return cd(t, r, n, o);
}
function ld(e, t, r, n, o) {
  let i = sm(r);
  if (typeof i == "function") {
    if (!Yl(t, e, n)) return n & R.Host ? ad(o, r, n) : cd(t, r, n, o);
    try {
      let s;
      if (((s = i(n)), s == null && !(n & R.Optional))) na(r);
      else return s;
    } finally {
      Jl();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = sd(e, t),
      c = sn,
      u = n & R.Host ? t[Le][Ve] : null;
    for (
      (a === -1 || n & R.SkipSelf) &&
      ((c = a === -1 ? Da(e, t) : t[a + 8]),
      c === sn || !Hu(n, !1)
        ? (a = -1)
        : ((s = t[O]), (a = Io(c)), (t = Eo(c, t))));
      a !== -1;

    ) {
      let l = t[O];
      if ($u(i, a, l.data)) {
        let d = om(a, t, r, s, n, u);
        if (d !== We) return d;
      }
      (c = t[a + 8]),
        c !== sn && Hu(n, t[O].data[a + 8] === u) && $u(i, a, t)
          ? ((s = l), (a = Io(c)), (t = Eo(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function om(e, t, r, n, o, i) {
  let s = t[O],
    a = s.data[e + 8],
    c = n == null ? $o(a) && Ts : n != s && (a.type & 3) !== 0,
    u = o & R.Host && i === a,
    l = im(a, s, r, c, u);
  return l !== null ? Zn(t, s, l, a) : We;
}
function im(e, t, r, n, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    u = e.directiveEnd,
    l = i >> 20,
    d = n ? a : a + l,
    f = o ? a + l : u;
  for (let h = d; h < f; h++) {
    let g = s[h];
    if ((h < c && r === g) || (h >= c && g.type === r)) return h;
  }
  if (o) {
    let h = s[c];
    if (h && sr(h) && h.type === r) return c;
  }
  return null;
}
function Zn(e, t, r, n) {
  let o = e[r],
    i = t.data;
  if (Qg(o)) {
    let s = o;
    s.resolving && Ap(_p(i[r]));
    let a = Uu(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? Ae(s.injectImpl) : null,
      l = Yl(e, n, R.Default);
    try {
      (o = e[r] = s.factory(void 0, i, e, n)),
        t.firstCreatePass && r >= n.directiveStart && Yg(r, i[r], t);
    } finally {
      u !== null && Ae(u), Uu(a), (s.resolving = !1), Jl();
    }
  }
  return o;
}
function sm(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(jn) ? e[jn] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & rd : am) : t;
}
function $u(e, t, r) {
  let n = 1 << e;
  return !!(r[t + (e >> od)] & n);
}
function Hu(e, t) {
  return !(e & R.Self) && !(e & R.Host && t);
}
var _t = class {
  constructor(t, r) {
    (this._tNode = t), (this._lView = r);
  }
  get(t, r, n) {
    return ud(this._tNode, this._lView, t, Lo(n), r);
  }
};
function am() {
  return new _t(at(), H());
}
function wa(e) {
  return Fo(() => {
    let t = e.prototype.constructor,
      r = t[mo] || Ss(t),
      n = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== n; ) {
      let i = o[mo] || Ss(o);
      if (i && i !== r) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Ss(e) {
  return fl(e)
    ? () => {
        let t = Ss(Ne(e));
        return t && t();
      }
    : an(e);
}
function cm(e, t, r, n, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[M] & 2048 && !(s[M] & 512); ) {
    let a = ld(i, s, r, n | R.Self, We);
    if (a !== We) return a;
    let c = i.parent;
    if (!c) {
      let u = s[Ol];
      if (u) {
        let l = u.get(r, We, n);
        if (l !== We) return l;
      }
      (c = dd(s)), (s = s[gn]);
    }
    i = c;
  }
  return o;
}
function dd(e) {
  let t = e[O],
    r = t.type;
  return r === 2 ? t.declTNode : r === 1 ? e[Ve] : null;
}
function zu(e, t = null, r = null, n) {
  let o = fd(e, t, r, n);
  return o.resolveInjectorInitializers(), o;
}
function fd(e, t = null, r = null, n, o = new Set()) {
  let i = [r || be, ig(e)];
  return (
    (n = n || (typeof e == "object" ? void 0 : Ie(e))),
    new $n(i, t || ca(), n || null, o)
  );
}
var cr = (() => {
  let t = class t {
    static create(n, o) {
      if (Array.isArray(n)) return zu({ name: "" }, o, n, "");
      {
        let i = n.name ?? "";
        return zu({ name: i }, n.parent, n.providers, i);
      }
    }
  };
  (t.THROW_IF_NOT_FOUND = Bn),
    (t.NULL = new Do()),
    (t.ɵprov = y({ token: t, providedIn: "any", factory: () => _(wl) })),
    (t.__NG_ELEMENT_ID__ = -1);
  let e = t;
  return e;
})();
var um = "ngOriginalError";
function ss(e) {
  return e[um];
}
var tt = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let r = this._findOriginalError(t);
      this._console.error("ERROR", t),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(t) {
      let r = t && ss(t);
      for (; r && ss(r); ) r = ss(r);
      return r || null;
    }
  },
  hd = new A("", {
    providedIn: "root",
    factory: () => p(tt).handleError.bind(void 0),
  }),
  pd = (() => {
    let t = class t {};
    (t.__NG_ELEMENT_ID__ = lm), (t.__NG_ENV_ID__ = (n) => n);
    let e = t;
    return e;
  })(),
  xs = class extends pd {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return $l(this._lView, t), () => _g(this._lView, t);
    }
  };
function lm() {
  return new xs(H());
}
function dm() {
  return Ca(at(), H());
}
function Ca(e, t) {
  return new Wo(Be(e, t));
}
var Wo = (() => {
  let t = class t {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  t.__NG_ELEMENT_ID__ = dm;
  let e = t;
  return e;
})();
var _s = class extends fe {
  constructor(t = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = t),
      mg() && (this.destroyRef = p(pd, { optional: !0 }) ?? void 0);
  }
  emit(t) {
    let r = k(null);
    try {
      super.next(t);
    } finally {
      k(r);
    }
  }
  subscribe(t, r, n) {
    let o = t,
      i = r || (() => null),
      s = n;
    if (t && typeof t == "object") {
      let c = t;
      (o = c.next?.bind(c)), (i = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((i = as(i)), o && (o = as(o)), s && (s = as(s)));
    let a = super.subscribe({ next: o, error: i, complete: s });
    return t instanceof K && t.add(a), a;
  }
};
function as(e) {
  return (t) => {
    setTimeout(e, void 0, t);
  };
}
var se = _s;
function gd(e) {
  return (e.flags & 128) === 128;
}
var md = new Map(),
  fm = 0;
function hm() {
  return fm++;
}
function pm(e) {
  md.set(e[Uo], e);
}
function gm(e) {
  md.delete(e[Uo]);
}
var Wu = "__ngContext__";
function Pt(e, t) {
  on(t) ? ((e[Wu] = t[Uo]), pm(t)) : (e[Wu] = t);
}
function vd(e) {
  return Dd(e[Wn]);
}
function yd(e) {
  return Dd(e[Fe]);
}
function Dd(e) {
  for (; e !== null && !it(e); ) e = e[Fe];
  return e;
}
var As;
function wd(e) {
  As = e;
}
function mm() {
  if (As !== void 0) return As;
  if (typeof document < "u") return document;
  throw new E(210, !1);
}
var ba = new A("", { providedIn: "root", factory: () => vm }),
  vm = "ng",
  Ia = new A(""),
  yt = new A("", { providedIn: "platform", factory: () => "unknown" });
var Ea = new A("", {
  providedIn: "root",
  factory: () =>
    mm().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var ym = "h",
  Dm = "b";
var wm = () => null;
function Ma(e, t, r = !1) {
  return wm(e, t, r);
}
var Cd = !1,
  Cm = new A("", { providedIn: "root", factory: () => Cd });
var Mo = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ll})`;
  }
};
function ur(e) {
  return e instanceof Mo ? e.changingThisBreaksApplicationSecurity : e;
}
function bd(e, t) {
  let r = bm(e);
  if (r != null && r !== t) {
    if (r === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${r} (see ${ll})`);
  }
  return r === t;
}
function bm(e) {
  return (e instanceof Mo && e.getTypeName()) || null;
}
var Im = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Id(e) {
  return (e = String(e)), e.match(Im) ? e : "unsafe:" + e;
}
var Ta = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(Ta || {});
function Go(e) {
  let t = Em();
  return t ? t.sanitize(Ta.URL, e) || "" : bd(e, "URL") ? ur(e) : Id(Vn(e));
}
function Em() {
  let e = H();
  return e && e[ke].sanitizer;
}
function Ed(e) {
  return e instanceof Function ? e() : e;
}
var nt = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(nt || {}),
  Mm;
function Sa(e, t) {
  return Mm(e, t);
}
function nn(e, t, r, n, o) {
  if (n != null) {
    let i,
      s = !1;
    it(n) ? (i = n) : on(n) && ((s = !0), (n = n[ot]));
    let a = qe(n);
    e === 0 && r !== null
      ? o == null
        ? xd(t, r, a)
        : To(t, r, a, o || null, !0)
      : e === 1 && r !== null
      ? To(t, r, a, o || null, !0)
      : e === 2
      ? $m(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && zm(t, e, i, r, o);
  }
}
function Tm(e, t) {
  return e.createText(t);
}
function Sm(e, t, r) {
  e.setValue(t, r);
}
function Md(e, t, r) {
  return e.createElement(t, r);
}
function xm(e, t) {
  Td(e, t), (t[ot] = null), (t[Ve] = null);
}
function _m(e, t, r, n, o, i) {
  (n[ot] = o), (n[Ve] = t), Yo(e, n, r, 1, o, i);
}
function Td(e, t) {
  t[ke].changeDetectionScheduler?.notify(1), Yo(e, t, t[de], 2, null, null);
}
function Am(e) {
  let t = e[Wn];
  if (!t) return cs(e[O], e);
  for (; t; ) {
    let r = null;
    if (on(t)) r = t[Wn];
    else {
      let n = t[he];
      n && (r = n);
    }
    if (!r) {
      for (; t && !t[Fe] && t !== e; ) on(t) && cs(t[O], t), (t = t[le]);
      t === null && (t = e), on(t) && cs(t[O], t), (r = t && t[Fe]);
    }
    t = r;
  }
}
function Nm(e, t, r, n) {
  let o = he + n,
    i = r.length;
  n > 0 && (r[o - 1][Fe] = t),
    n < i - he
      ? ((t[Fe] = r[o]), Dl(r, he + n, t))
      : (r.push(t), (t[Fe] = null)),
    (t[le] = r);
  let s = t[Bo];
  s !== null && r !== s && Rm(s, t);
  let a = t[ln];
  a !== null && a.insertView(e), Es(t), (t[M] |= 128);
}
function Rm(e, t) {
  let r = e[Co],
    o = t[le][le][Le];
  t[Le] !== o && (e[M] |= ua.HasTransplantedViews),
    r === null ? (e[Co] = [t]) : r.push(t);
}
function Sd(e, t) {
  let r = e[Co],
    n = r.indexOf(t);
  r.splice(n, 1);
}
function Qn(e, t) {
  if (e.length <= he) return;
  let r = he + t,
    n = e[r];
  if (n) {
    let o = n[Bo];
    o !== null && o !== e && Sd(o, n), t > 0 && (e[r - 1][Fe] = n[Fe]);
    let i = yo(e, he + t);
    xm(n[O], n);
    let s = i[ln];
    s !== null && s.detachView(i[O]),
      (n[le] = null),
      (n[Fe] = null),
      (n[M] &= -129);
  }
  return n;
}
function qo(e, t) {
  if (!(t[M] & 256)) {
    let r = t[de];
    r.destroyNode && Yo(e, t, r, 3, null, null), Am(t);
  }
}
function cs(e, t) {
  if (t[M] & 256) return;
  let r = k(null);
  try {
    (t[M] &= -129),
      (t[M] |= 256),
      t[Nt] && Kc(t[Nt]),
      Pm(e, t),
      Om(e, t),
      t[O].type === 1 && t[de].destroy();
    let n = t[Bo];
    if (n !== null && it(t[le])) {
      n !== t[le] && Sd(n, t);
      let o = t[ln];
      o !== null && o.detachView(e);
    }
    gm(t);
  } finally {
    k(r);
  }
}
function Om(e, t) {
  let r = e.cleanup,
    n = t[zn];
  if (r !== null)
    for (let i = 0; i < r.length - 1; i += 2)
      if (typeof r[i] == "string") {
        let s = r[i + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (i += 2);
      } else {
        let s = n[r[i + 1]];
        r[i].call(s);
      }
  n !== null && (t[zn] = null);
  let o = t[pt];
  if (o !== null) {
    t[pt] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function Pm(e, t) {
  let r;
  if (e != null && (r = e.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let o = t[r[n]];
      if (!(o instanceof Yn)) {
        let i = r[n + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            ze(4, a, c);
            try {
              c.call(a);
            } finally {
              ze(5, a, c);
            }
          }
        else {
          ze(4, o, i);
          try {
            i.call(o);
          } finally {
            ze(5, o, i);
          }
        }
      }
    }
}
function Fm(e, t, r) {
  return km(e, t.parent, r);
}
function km(e, t, r) {
  let n = t;
  for (; n !== null && n.type & 40; ) (t = n), (n = t.parent);
  if (n === null) return r[ot];
  {
    let { componentOffset: o } = n;
    if (o > -1) {
      let { encapsulation: i } = e.data[n.directiveStart + o];
      if (i === Ge.None || i === Ge.Emulated) return null;
    }
    return Be(n, r);
  }
}
function To(e, t, r, n, o) {
  e.insertBefore(t, r, n, o);
}
function xd(e, t, r) {
  e.appendChild(t, r);
}
function Gu(e, t, r, n, o) {
  n !== null ? To(e, t, r, n, o) : xd(e, t, r);
}
function Lm(e, t, r, n) {
  e.removeChild(t, r, n);
}
function xa(e, t) {
  return e.parentNode(t);
}
function jm(e, t) {
  return e.nextSibling(t);
}
function Vm(e, t, r) {
  return Um(e, t, r);
}
function Bm(e, t, r) {
  return e.type & 40 ? Be(e, r) : null;
}
var Um = Bm,
  qu;
function _a(e, t, r, n) {
  let o = Fm(e, n, t),
    i = t[de],
    s = n.parent || t[Ve],
    a = Vm(s, n, t);
  if (o != null)
    if (Array.isArray(r))
      for (let c = 0; c < r.length; c++) Gu(i, o, r[c], a, !1);
    else Gu(i, o, r, a, !1);
  qu !== void 0 && qu(i, n, t, r, o);
}
function po(e, t) {
  if (t !== null) {
    let r = t.type;
    if (r & 3) return Be(t, e);
    if (r & 4) return Ns(-1, e[t.index]);
    if (r & 8) {
      let n = t.child;
      if (n !== null) return po(e, n);
      {
        let o = e[t.index];
        return it(o) ? Ns(-1, o) : qe(o);
      }
    } else {
      if (r & 32) return Sa(t, e)() || qe(e[t.index]);
      {
        let n = _d(e, t);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let o = qn(e[Le]);
          return po(o, n);
        } else return po(e, t.next);
      }
    }
  }
  return null;
}
function _d(e, t) {
  if (t !== null) {
    let n = e[Le][Ve],
      o = t.projection;
    return n.projection[o];
  }
  return null;
}
function Ns(e, t) {
  let r = he + e + 1;
  if (r < t.length) {
    let n = t[r],
      o = n[O].firstChild;
    if (o !== null) return po(n, o);
  }
  return t[Rt];
}
function $m(e, t, r) {
  let n = xa(e, t);
  n && Lm(e, n, t, r);
}
function Aa(e, t, r, n, o, i, s) {
  for (; r != null; ) {
    let a = n[r.index],
      c = r.type;
    if (
      (s && t === 0 && (a && Pt(qe(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (c & 8) Aa(e, t, r.child, n, o, i, !1), nn(t, e, o, a, i);
      else if (c & 32) {
        let u = Sa(r, n),
          l;
        for (; (l = u()); ) nn(t, e, o, l, i);
        nn(t, e, o, a, i);
      } else c & 16 ? Hm(e, t, n, r, o, i) : nn(t, e, o, a, i);
    r = s ? r.projectionNext : r.next;
  }
}
function Yo(e, t, r, n, o, i) {
  Aa(r, n, e.firstChild, t, o, i, !1);
}
function Hm(e, t, r, n, o, i) {
  let s = r[Le],
    c = s[Ve].projection[n.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      nn(t, e, o, l, i);
    }
  else {
    let u = c,
      l = s[le];
    gd(n) && (u.flags |= 128), Aa(e, t, u, l, o, i, !0);
  }
}
function zm(e, t, r, n, o) {
  let i = r[Rt],
    s = qe(r);
  i !== s && nn(t, e, n, i, o);
  for (let a = he; a < r.length; a++) {
    let c = r[a];
    Yo(c[O], c, e, t, n, i);
  }
}
function Wm(e, t, r, n, o) {
  if (t) o ? e.addClass(r, n) : e.removeClass(r, n);
  else {
    let i = n.indexOf("-") === -1 ? void 0 : nt.DashCase;
    o == null
      ? e.removeStyle(r, n, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= nt.Important)),
        e.setStyle(r, n, o, i));
  }
}
function Gm(e, t, r) {
  e.setAttribute(t, "style", r);
}
function Ad(e, t, r) {
  r === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", r);
}
function Nd(e, t, r) {
  let { mergedAttrs: n, classes: o, styles: i } = r;
  n !== null && ys(e, t, n),
    o !== null && Ad(e, t, o),
    i !== null && Gm(e, t, i);
}
var Ue = {};
function S(e = 1) {
  Rd(st(), H(), vt() + e, !1);
}
function Rd(e, t, r, n) {
  if (!n)
    if ((t[M] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && fo(t, i, r);
    } else {
      let i = e.preOrderHooks;
      i !== null && ho(t, i, 0, r);
    }
  Ot(r);
}
function Na(e, t = R.Default) {
  let r = H();
  if (r === null) return _(e, t);
  let n = at();
  return ud(n, r, Ne(e), t);
}
function Od(e, t, r, n, o, i) {
  let s = k(null);
  try {
    let a = null;
    o & gt.SignalBased && (a = t[n][Zc]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & gt.HasDecoratorInputTransform &&
        (i = e.inputTransforms[n].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, r, n) : kl(t, a, n, i);
  } finally {
    k(s);
  }
}
function qm(e, t) {
  let r = e.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let o = r[n];
        if (o < 0) Ot(~o);
        else {
          let i = o,
            s = r[++n],
            a = r[++n];
          $g(s, i);
          let c = t[i];
          a(2, c);
        }
      }
    } finally {
      Ot(-1);
    }
}
function Zo(e, t, r, n, o, i, s, a, c, u, l) {
  let d = t.blueprint.slice();
  return (
    (d[ot] = o),
    (d[M] = n | 4 | 128 | 8 | 64),
    (u !== null || (e && e[M] & 2048)) && (d[M] |= 2048),
    Ul(d),
    (d[le] = d[gn] = e),
    (d[ue] = r),
    (d[ke] = s || (e && e[ke])),
    (d[de] = a || (e && e[de])),
    (d[un] = c || (e && e[un]) || null),
    (d[Ve] = i),
    (d[Uo] = hm()),
    (d[Hn] = l),
    (d[Ol] = u),
    (d[Le] = t.type == 2 ? e[Le] : d),
    d
  );
}
function Qo(e, t, r, n, o) {
  let i = e.data[t];
  if (i === null) (i = Ym(e, t, r, n, o)), Ug() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = r), (i.value = n), (i.attrs = o);
    let s = kg();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return ar(i, !0), i;
}
function Ym(e, t, r, n, o) {
  let i = zl(),
    s = Wl(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = Km(e, a, r, t, n, o));
  return (
    e.firstChild === null && (e.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function Pd(e, t, r, n) {
  if (r === 0) return -1;
  let o = t.length;
  for (let i = 0; i < r; i++) t.push(n), e.blueprint.push(n), e.data.push(null);
  return o;
}
function Fd(e, t, r, n, o) {
  let i = vt(),
    s = n & 2;
  try {
    Ot(-1), s && t.length > je && Rd(e, t, je, !1), ze(s ? 2 : 0, o), r(n, o);
  } finally {
    Ot(i), ze(s ? 3 : 1, o);
  }
}
function kd(e, t, r) {
  if (Fl(t)) {
    let n = k(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = r[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      k(n);
    }
  }
}
function Ld(e, t, r) {
  Hl() && (iv(e, t, r, Be(r, t)), (r.flags & 64) === 64 && Hd(e, t, r));
}
function jd(e, t, r = Be) {
  let n = t.localNames;
  if (n !== null) {
    let o = t.index + 1;
    for (let i = 0; i < n.length; i += 2) {
      let s = n[i + 1],
        a = s === -1 ? r(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Vd(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Ra(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function Ra(e, t, r, n, o, i, s, a, c, u, l) {
  let d = je + n,
    f = d + o,
    h = Zm(d, f),
    g = typeof u == "function" ? u() : u;
  return (h[O] = {
    type: e,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: g,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Zm(e, t) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(n < e ? null : Ue);
  return r;
}
function Qm(e, t, r, n) {
  let i = n.get(Cm, Cd) || r === Ge.ShadowDom,
    s = e.selectRootElement(t, i);
  return Xm(s), s;
}
function Xm(e) {
  Jm(e);
}
var Jm = () => null;
function Km(e, t, r, n, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Og() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Yu(e, t, r, n, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    n ??= {};
    let a,
      c = gt.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      u = o[i];
    }
    e === 0 ? Zu(n, r, u, a, c) : Zu(n, r, u, a);
  }
  return n;
}
function Zu(e, t, r, n, o) {
  let i;
  e.hasOwnProperty(r) ? (i = e[r]).push(t, n) : (i = e[r] = [t, n]),
    o !== void 0 && i.push(o);
}
function ev(e, t, r) {
  let n = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = n; l < o; l++) {
    let d = i[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      g = f ? f.outputs : null;
    (c = Yu(0, d.inputs, l, c, h)), (u = Yu(1, d.outputs, l, u, g));
    let C = c !== null && s !== null && !ia(t) ? pv(c, l, s) : null;
    a.push(C);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = u);
}
function tv(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function Bd(e, t, r, n, o, i, s, a) {
  let c = Be(t, r),
    u = t.inputs,
    l;
  !a && u != null && (l = u[n])
    ? (Oa(e, r, l, n, o), $o(t) && nv(r, t.index))
    : t.type & 3
    ? ((n = tv(n)),
      (o = s != null ? s(o, t.value || "", n) : o),
      i.setProperty(c, n, o))
    : t.type & 12;
}
function nv(e, t) {
  let r = Lt(t, e);
  r[M] & 16 || (r[M] |= 64);
}
function Ud(e, t, r, n) {
  if (Hl()) {
    let o = n === null ? null : { "": -1 },
      i = av(e, r),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && $d(e, t, r, s, o, a),
      o && cv(r, n, o);
  }
  r.mergedAttrs = oa(r.mergedAttrs, r.attrs);
}
function $d(e, t, r, n, o, i) {
  for (let u = 0; u < n.length; u++) rm(id(r, t), e, n[u].type);
  lv(r, e.data.length, n.length);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = Pd(e, t, n.length, null);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    (r.mergedAttrs = oa(r.mergedAttrs, l.hostAttrs)),
      dv(e, r, t, c, l),
      uv(c, l, o),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  ev(e, r, i);
}
function rv(e, t, r, n, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    ov(s) != a && s.push(a), s.push(r, n, i);
  }
}
function ov(e) {
  let t = e.length;
  for (; t > 0; ) {
    let r = e[--t];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function iv(e, t, r, n) {
  let o = r.directiveStart,
    i = r.directiveEnd;
  $o(r) && fv(t, r, e.data[o + r.componentOffset]),
    e.firstCreatePass || id(r, t),
    Pt(n, t);
  let s = r.initialInputs;
  for (let a = o; a < i; a++) {
    let c = e.data[a],
      u = Zn(t, e, a, r);
    if ((Pt(u, t), s !== null && hv(t, a - o, u, c, r, s), sr(c))) {
      let l = Lt(r.index, t);
      l[ue] = Zn(t, e, a, r);
    }
  }
}
function Hd(e, t, r) {
  let n = r.directiveStart,
    o = r.directiveEnd,
    i = r.index,
    s = Hg();
  try {
    Ot(i);
    for (let a = n; a < o; a++) {
      let c = e.data[a],
        u = t[a];
      Ms(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          sv(c, u);
    }
  } finally {
    Ot(-1), Ms(s);
  }
}
function sv(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function av(e, t) {
  let r = e.directiveRegistry,
    n = null,
    o = null;
  if (r)
    for (let i = 0; i < r.length; i++) {
      let s = r[i];
      if (Qp(t, s.selectors, !1))
        if ((n || (n = []), sr(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              n.unshift(...a, s);
            let c = a.length;
            Rs(e, t, c);
          } else n.unshift(s), Rs(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, n, o), n.push(s);
    }
  return n === null ? null : [n, o];
}
function Rs(e, t, r) {
  (t.componentOffset = r), (e.components ??= []).push(t.index);
}
function cv(e, t, r) {
  if (t) {
    let n = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = r[t[o + 1]];
      if (i == null) throw new E(-301, !1);
      n.push(t[o], i);
    }
  }
}
function uv(e, t, r) {
  if (r) {
    if (t.exportAs)
      for (let n = 0; n < t.exportAs.length; n++) r[t.exportAs[n]] = e;
    sr(t) && (r[""] = e);
  }
}
function lv(e, t, r) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + r),
    (e.providerIndexes = t);
}
function dv(e, t, r, n, o) {
  e.data[n] = o;
  let i = o.factory || (o.factory = an(o.type, !0)),
    s = new Yn(i, sr(o), Na);
  (e.blueprint[n] = s), (r[n] = s), rv(e, t, n, Pd(e, r, o.hostVars, Ue), o);
}
function fv(e, t, r) {
  let n = Be(t, e),
    o = Vd(r),
    i = e[ke].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = Xo(
    e,
    Zo(e, o, null, s, n, t, null, i.createRenderer(n, r), null, null, null)
  );
  e[t.index] = a;
}
function hv(e, t, r, n, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      Od(n, r, c, u, l, d);
    }
}
function pv(e, t, r) {
  let n = null,
    o = 0;
  for (; o < r.length; ) {
    let i = r[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      n === null && (n = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          n.push(i, s[a + 1], s[a + 2], r[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return n;
}
function zd(e, t, r, n) {
  return [e, !0, 0, t, null, n, null, r, null, null];
}
function Wd(e, t) {
  let r = e.contentQueries;
  if (r !== null) {
    let n = k(null);
    try {
      for (let o = 0; o < r.length; o += 2) {
        let i = r[o],
          s = r[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          ql(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      k(n);
    }
  }
}
function Xo(e, t) {
  return e[Wn] ? (e[ju][Fe] = t) : (e[Wn] = t), (e[ju] = t), t;
}
function Os(e, t, r) {
  ql(0);
  let n = k(null);
  try {
    t(e, r);
  } finally {
    k(n);
  }
}
function gv(e) {
  return e[zn] || (e[zn] = []);
}
function mv(e) {
  return e.cleanup || (e.cleanup = []);
}
function Gd(e, t) {
  let r = e[un],
    n = r ? r.get(tt, null) : null;
  n && n.handleError(t);
}
function Oa(e, t, r, n, o) {
  for (let i = 0; i < r.length; ) {
    let s = r[i++],
      a = r[i++],
      c = r[i++],
      u = t[s],
      l = e.data[s];
    Od(l, u, n, a, c, o);
  }
}
function qd(e, t, r) {
  let n = Bl(t, e);
  Sm(e[de], n, r);
}
function vv(e, t) {
  let r = Lt(t, e),
    n = r[O];
  yv(n, r);
  let o = r[ot];
  o !== null && r[Hn] === null && (r[Hn] = Ma(o, r[un])), Pa(n, r, r[ue]);
}
function yv(e, t) {
  for (let r = t.length; r < e.blueprint.length; r++) t.push(e.blueprint[r]);
}
function Pa(e, t, r) {
  pa(t);
  try {
    let n = e.viewQuery;
    n !== null && Os(1, n, r);
    let o = e.template;
    o !== null && Fd(e, t, o, 1, r),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[ln]?.finishViewCreation(e),
      e.staticContentQueries && Wd(e, t),
      e.staticViewQueries && Os(2, e.viewQuery, r);
    let i = e.components;
    i !== null && Dv(t, i);
  } catch (n) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      n)
    );
  } finally {
    (t[M] &= -5), ga();
  }
}
function Dv(e, t) {
  for (let r = 0; r < t.length; r++) vv(e, t[r]);
}
function Fa(e, t, r, n) {
  let o = k(null);
  try {
    let i = t.tView,
      a = e[M] & 4096 ? 4096 : 16,
      c = Zo(
        e,
        i,
        r,
        a,
        null,
        t,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null
      ),
      u = e[t.index];
    c[Bo] = u;
    let l = e[ln];
    return l !== null && (c[ln] = l.createEmbeddedView(i)), Pa(i, c, r), c;
  } finally {
    k(o);
  }
}
function Yd(e, t) {
  let r = he + t;
  if (r < e.length) return e[r];
}
function Xn(e, t) {
  return !t || t.firstChild === null || gd(e);
}
function Jo(e, t, r, n = !0) {
  let o = t[O];
  if ((Nm(o, t, e, r), n)) {
    let s = Ns(r, e),
      a = t[de],
      c = xa(a, e[Rt]);
    c !== null && _m(o, e[Ve], a, t, c, s);
  }
  let i = t[Hn];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Zd(e, t) {
  let r = Qn(e, t);
  return r !== void 0 && qo(r[O], r), r;
}
function So(e, t, r, n, o = !1) {
  for (; r !== null; ) {
    let i = t[r.index];
    i !== null && n.push(qe(i)), it(i) && wv(i, n);
    let s = r.type;
    if (s & 8) So(e, t, r.child, n);
    else if (s & 32) {
      let a = Sa(r, t),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = _d(t, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = qn(t[Le]);
        So(c[O], c, a, n, !0);
      }
    }
    r = o ? r.projectionNext : r.next;
  }
  return n;
}
function wv(e, t) {
  for (let r = he; r < e.length; r++) {
    let n = e[r],
      o = n[O].firstChild;
    o !== null && So(n[O], n, o, t);
  }
  e[Rt] !== e[ot] && t.push(e[Rt]);
}
var Qd = [];
function Cv(e) {
  return e[Nt] ?? bv(e);
}
function bv(e) {
  let t = Qd.pop() ?? Object.create(Ev);
  return (t.lView = e), t;
}
function Iv(e) {
  e.lView[Nt] !== e && ((e.lView = null), Qd.push(e));
}
var Ev = Z(m({}, Qc), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (e) => {
      Gn(e.lView);
    },
    consumerOnSignalRead() {
      this.lView[Nt] = this;
    },
  }),
  Xd = 100;
function Jd(e, t = !0, r = 0) {
  let n = e[ke],
    o = n.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    Mv(e, r);
  } catch (s) {
    throw (t && Gd(e, s), s);
  } finally {
    i || (o.end?.(), n.inlineEffectRunner?.flush());
  }
}
function Mv(e, t) {
  Ps(e, t);
  let r = 0;
  for (; ha(e); ) {
    if (r === Xd) throw new E(103, !1);
    r++, Ps(e, 1);
  }
}
function Tv(e, t, r, n) {
  let o = t[M];
  if ((o & 256) === 256) return;
  let i = !1;
  !i && t[ke].inlineEffectRunner?.flush(), pa(t);
  let s = null,
    a = null;
  !i && Sv(e) && ((a = Cv(t)), (s = Xc(a)));
  try {
    Ul(t), Bg(e.bindingStartIndex), r !== null && Fd(e, t, r, 2, n);
    let c = (o & 3) === 3;
    if (!i)
      if (c) {
        let d = e.preOrderCheckHooks;
        d !== null && fo(t, d, null);
      } else {
        let d = e.preOrderHooks;
        d !== null && ho(t, d, 0, null), os(t, 0);
      }
    if ((xv(t), Kd(t, 0), e.contentQueries !== null && Wd(e, t), !i))
      if (c) {
        let d = e.contentCheckHooks;
        d !== null && fo(t, d);
      } else {
        let d = e.contentHooks;
        d !== null && ho(t, d, 1), os(t, 1);
      }
    qm(e, t);
    let u = e.components;
    u !== null && tf(t, u, 0);
    let l = e.viewQuery;
    if ((l !== null && Os(2, l, n), !i))
      if (c) {
        let d = e.viewCheckHooks;
        d !== null && fo(t, d);
      } else {
        let d = e.viewHooks;
        d !== null && ho(t, d, 2), os(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[rs])) {
      for (let d of t[rs]) d();
      t[rs] = null;
    }
    i || (t[M] &= -73);
  } catch (c) {
    throw (Gn(t), c);
  } finally {
    a !== null && (Jc(a, s), Iv(a)), ga();
  }
}
function Sv(e) {
  return e.type !== 2;
}
function Kd(e, t) {
  for (let r = vd(e); r !== null; r = yd(r))
    for (let n = he; n < r.length; n++) {
      let o = r[n];
      ef(o, t);
    }
}
function xv(e) {
  for (let t = vd(e); t !== null; t = yd(t)) {
    if (!(t[M] & ua.HasTransplantedViews)) continue;
    let r = t[Co];
    for (let n = 0; n < r.length; n++) {
      let o = r[n],
        i = o[le];
      Sg(o);
    }
  }
}
function _v(e, t, r) {
  let n = Lt(t, e);
  ef(n, r);
}
function ef(e, t) {
  fa(e) && Ps(e, t);
}
function Ps(e, t) {
  let n = e[O],
    o = e[M],
    i = e[Nt],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && ki(i))),
    i && (i.dirty = !1),
    (e[M] &= -9217),
    s)
  )
    Tv(n, e, n.template, e[ue]);
  else if (o & 8192) {
    Kd(e, 1);
    let a = n.components;
    a !== null && tf(e, a, 1);
  }
}
function tf(e, t, r) {
  for (let n = 0; n < t.length; n++) _v(e, t[n], r);
}
function ka(e) {
  for (e[ke].changeDetectionScheduler?.notify(); e; ) {
    e[M] |= 64;
    let t = qn(e);
    if (yg(e) && !t) return e;
    e = t;
  }
  return null;
}
var dn = class {
  get rootNodes() {
    let t = this._lView,
      r = t[O];
    return So(r, t, r.firstChild, []);
  }
  constructor(t, r, n = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = r),
      (this.notifyErrorHandler = n),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[ue];
  }
  set context(t) {
    this._lView[ue] = t;
  }
  get destroyed() {
    return (this._lView[M] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[le];
      if (it(t)) {
        let r = t[wo],
          n = r ? r.indexOf(this) : -1;
        n > -1 && (Qn(t, n), yo(r, n));
      }
      this._attachedToViewContainer = !1;
    }
    qo(this._lView[O], this._lView);
  }
  onDestroy(t) {
    $l(this._lView, t);
  }
  markForCheck() {
    ka(this._cdRefInjectingView || this._lView);
  }
  detach() {
    this._lView[M] &= -129;
  }
  reattach() {
    Es(this._lView), (this._lView[M] |= 128);
  }
  detectChanges() {
    (this._lView[M] |= 1024), Jd(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new E(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    (this._appRef = null), Td(this._lView[O], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new E(902, !1);
    (this._appRef = t), Es(this._lView);
  }
};
var nS = new RegExp(`^(\\d+)*(${Dm}|${ym})*(.*)`);
var Av = () => null;
function Jn(e, t) {
  return Av(e, t);
}
var Fs = class {},
  ks = class {},
  xo = class {};
function Nv(e) {
  let t = Error(`No component factory found for ${Ie(e)}.`);
  return (t[Rv] = e), t;
}
var Rv = "ngComponent";
var Ls = class {
    resolveComponentFactory(t) {
      throw Nv(t);
    }
  },
  Ko = (() => {
    let t = class t {};
    t.NULL = new Ls();
    let e = t;
    return e;
  })(),
  Kn = class {};
var Ov = (() => {
    let t = class t {};
    t.ɵprov = y({ token: t, providedIn: "root", factory: () => null });
    let e = t;
    return e;
  })(),
  us = {};
var Qu = new Set();
function lr(e) {
  Qu.has(e) ||
    (Qu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function Xu(...e) {}
function Pv() {
  let e = typeof Ln.requestAnimationFrame == "function",
    t = Ln[e ? "requestAnimationFrame" : "setTimeout"],
    r = Ln[e ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && t && r) {
    let n = t[Zone.__symbol__("OriginalDelegate")];
    n && (t = n);
    let o = r[Zone.__symbol__("OriginalDelegate")];
    o && (r = o);
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: r };
}
var W = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new se(!1)),
        (this.onMicrotaskEmpty = new se(!1)),
        (this.onStable = new se(!1)),
        (this.onError = new se(!1)),
        typeof Zone > "u")
      )
        throw new E(908, !1);
      Zone.assertZonePatched();
      let o = this;
      (o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !n && r),
        (o.shouldCoalesceRunChangeDetection = n),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = Pv().nativeRequestAnimationFrame),
        Lv(o);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new E(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new E(909, !1);
    }
    run(t, r, n) {
      return this._inner.run(t, r, n);
    }
    runTask(t, r, n, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, Fv, Xu, Xu);
      try {
        return i.runTask(s, r, n);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, r, n) {
      return this._inner.runGuarded(t, r, n);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Fv = {};
function La(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function kv(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      Ln,
      () => {
        e.fakeTopEventTask ||
          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (e.lastRequestAnimationFrameId = -1),
                js(e),
                (e.isCheckStableRunning = !0),
                La(e),
                (e.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          e.fakeTopEventTask.invoke();
      }
    )),
    js(e));
}
function Lv(e) {
  let t = () => {
    kv(e);
  };
  e._inner = e._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, o, i, s, a) => {
      if (jv(a)) return r.invokeTask(o, i, s, a);
      try {
        return Ju(e), r.invokeTask(o, i, s, a);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && i.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Ku(e);
      }
    },
    onInvoke: (r, n, o, i, s, a, c) => {
      try {
        return Ju(e), r.invoke(o, i, s, a, c);
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), Ku(e);
      }
    },
    onHasTask: (r, n, o, i) => {
      r.hasTask(o, i),
        n === o &&
          (i.change == "microTask"
            ? ((e._hasPendingMicrotasks = i.microTask), js(e), La(e))
            : i.change == "macroTask" &&
              (e.hasPendingMacrotasks = i.macroTask));
    },
    onHandleError: (r, n, o, i) => (
      r.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1
    ),
  });
}
function js(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Ju(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Ku(e) {
  e._nesting--, La(e);
}
function jv(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0;
}
var nf = (() => {
  let t = class t {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute();
    }
    executeInternalCallbacks() {
      let n = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let o of n) o();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  t.ɵprov = y({ token: t, providedIn: "root", factory: () => new t() });
  let e = t;
  return e;
})();
function Vs(e, t, r) {
  let n = r ? e.styles : null,
    o = r ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = gs(o, a);
      else if (i == 2) {
        let c = a,
          u = t[++s];
        n = gs(n, c + ": " + u + ";");
      }
    }
  r ? (e.styles = n) : (e.stylesWithoutHost = n),
    r ? (e.classes = o) : (e.classesWithoutHost = o);
}
var _o = class extends Ko {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let r = At(t);
    return new er(r, this.ngModule);
  }
};
function el(e) {
  let t = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let n = e[r];
    n !== void 0 &&
      t.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return t;
}
function Vv(e) {
  let t = e.toLowerCase();
  return t === "svg" ? bg : t === "math" ? Ig : null;
}
var Bs = class {
    constructor(t, r) {
      (this.injector = t), (this.parentInjector = r);
    }
    get(t, r, n) {
      n = Lo(n);
      let o = this.injector.get(t, us, n);
      return o !== us || r === us ? o : this.parentInjector.get(t, r, n);
    }
  },
  er = class extends xo {
    get inputs() {
      let t = this.componentDef,
        r = t.inputTransforms,
        n = el(t.inputs);
      if (r !== null)
        for (let o of n)
          r.hasOwnProperty(o.propName) && (o.transform = r[o.propName]);
      return n;
    }
    get outputs() {
      return el(this.componentDef.outputs);
    }
    constructor(t, r) {
      super(),
        (this.componentDef = t),
        (this.ngModule = r),
        (this.componentType = t.type),
        (this.selector = eg(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(t, r, n, o) {
      let i = k(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof me ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new Bs(t, s) : t,
          c = a.get(Kn, null);
        if (c === null) throw new E(407, !1);
        let u = a.get(Ov, null),
          l = a.get(nf, null),
          d = a.get(Fs, null),
          f = {
            rendererFactory: c,
            sanitizer: u,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          h = c.createRenderer(null, this.componentDef),
          g = this.componentDef.selectors[0][0] || "div",
          C = n
            ? Qm(h, n, this.componentDef.encapsulation, a)
            : Md(h, g, Vv(g)),
          b = 512;
        this.componentDef.signals
          ? (b |= 4096)
          : this.componentDef.onPush || (b |= 16);
        let v = null;
        C !== null && (v = Ma(C, a, !0));
        let re = Ra(0, null, null, 1, 0, null, null, null, null, null, null),
          G = Zo(null, re, null, b, null, null, f, h, a, null, v);
        pa(G);
        let U, xe;
        try {
          let J = this.componentDef,
            _e,
            Ht = null;
          J.findHostDirectiveDefs
            ? ((_e = []),
              (Ht = new Map()),
              J.findHostDirectiveDefs(J, _e, Ht),
              _e.push(J))
            : (_e = [J]);
          let zh = Bv(G, C),
            Wh = Uv(zh, C, J, _e, G, f, h);
          (xe = da(re, je)),
            C && zv(h, J, C, n),
            r !== void 0 && Wv(xe, this.ngContentSelectors, r),
            (U = Hv(Wh, J, _e, Ht, G, [Gv])),
            Pa(re, G, null);
        } finally {
          ga();
        }
        return new Us(this.componentType, U, Ca(xe, G), G, xe);
      } finally {
        k(i);
      }
    }
  },
  Us = class extends ks {
    constructor(t, r, n, o, i) {
      super(),
        (this.location = n),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new dn(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, r) {
      let n = this._tNode.inputs,
        o;
      if (n !== null && (o = n[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), r))
        )
          return;
        let i = this._rootLView;
        Oa(i[O], i, o, t, r), this.previousInputValues.set(t, r);
        let s = Lt(this._tNode.index, i);
        ka(s);
      }
    }
    get injector() {
      return new _t(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Bv(e, t) {
  let r = e[O],
    n = je;
  return (e[n] = t), Qo(r, n, 2, "#host", null);
}
function Uv(e, t, r, n, o, i, s) {
  let a = o[O];
  $v(n, e, t, s);
  let c = null;
  t !== null && (c = Ma(t, o[un]));
  let u = i.rendererFactory.createRenderer(t, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = Zo(o, Vd(r), null, l, o[e.index], e, i, u, null, null, c);
  return (
    a.firstCreatePass && Rs(a, e, n.length - 1), Xo(o, d), (o[e.index] = d)
  );
}
function $v(e, t, r, n) {
  for (let o of e) t.mergedAttrs = oa(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (Vs(t, t.mergedAttrs, !0), r !== null && Nd(n, r, t));
}
function Hv(e, t, r, n, o, i) {
  let s = at(),
    a = o[O],
    c = Be(s, o);
  $d(a, o, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = Zn(o, a, d, s);
    Pt(f, o);
  }
  Hd(a, o, s), c && Pt(c, o);
  let u = Zn(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[ue] = o[ue] = u), i !== null)) for (let l of i) l(u, t);
  return kd(a, s, o), u;
}
function zv(e, t, r, n) {
  if (n) ys(e, r, ["ng-version", "17.3.6"]);
  else {
    let { attrs: o, classes: i } = tg(t.selectors[0]);
    o && ys(e, r, o), i && i.length > 0 && Ad(e, r, i.join(" "));
  }
}
function Wv(e, t, r) {
  let n = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = r[o];
    n.push(i != null ? Array.from(i) : null);
  }
}
function Gv() {
  let e = at();
  ya(H()[O], e);
}
var ei = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = qv;
  let e = t;
  return e;
})();
function qv() {
  let e = at();
  return Zv(e, H());
}
var Yv = ei,
  rf = class extends Yv {
    constructor(t, r, n) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Ca(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new _t(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Da(this._hostTNode, this._hostLView);
      if (nd(t)) {
        let r = Eo(t, this._hostLView),
          n = Io(t),
          o = r[O].data[n + 8];
        return new _t(o, r);
      } else return new _t(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let r = tl(this._lContainer);
      return (r !== null && r[t]) || null;
    }
    get length() {
      return this._lContainer.length - he;
    }
    createEmbeddedView(t, r, n) {
      let o, i;
      typeof n == "number"
        ? (o = n)
        : n != null && ((o = n.index), (i = n.injector));
      let s = Jn(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(r || {}, i, s);
      return this.insertImpl(a, o, Xn(this._hostTNode, s)), a;
    }
    createComponent(t, r, n, o, i) {
      let s = t && !vg(t),
        a;
      if (s) a = r;
      else {
        let g = r || {};
        (a = g.index),
          (n = g.injector),
          (o = g.projectableNodes),
          (i = g.environmentInjector || g.ngModuleRef);
      }
      let c = s ? t : new er(At(t)),
        u = n || this.parentInjector;
      if (!i && c.ngModule == null) {
        let C = (s ? u : this.parentInjector).get(me, null);
        C && (i = C);
      }
      let l = At(c.componentType ?? {}),
        d = Jn(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(u, o, f, i);
      return this.insertImpl(h.hostView, a, Xn(this._hostTNode, d)), h;
    }
    insert(t, r) {
      return this.insertImpl(t, r, !0);
    }
    insertImpl(t, r, n) {
      let o = t._lView;
      if (Tg(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = o[le],
            u = new rf(c, c[Ve], c[le]);
          u.detach(u.indexOf(t));
        }
      }
      let i = this._adjustIndex(r),
        s = this._lContainer;
      return Jo(s, o, i, n), t.attachToViewContainerRef(), Dl(ls(s), i, t), t;
    }
    move(t, r) {
      return this.insert(t, r);
    }
    indexOf(t) {
      let r = tl(this._lContainer);
      return r !== null ? r.indexOf(t) : -1;
    }
    remove(t) {
      let r = this._adjustIndex(t, -1),
        n = Qn(this._lContainer, r);
      n && (yo(ls(this._lContainer), r), qo(n[O], n));
    }
    detach(t) {
      let r = this._adjustIndex(t, -1),
        n = Qn(this._lContainer, r);
      return n && yo(ls(this._lContainer), r) != null ? new dn(n) : null;
    }
    _adjustIndex(t, r = 0) {
      return t ?? this.length + r;
    }
  };
function tl(e) {
  return e[wo];
}
function ls(e) {
  return e[wo] || (e[wo] = []);
}
function Zv(e, t) {
  let r,
    n = t[e.index];
  return (
    it(n) ? (r = n) : ((r = zd(n, t, null, e)), (t[e.index] = r), Xo(t, r)),
    Xv(r, t, e, n),
    new rf(r, e, t)
  );
}
function Qv(e, t) {
  let r = e[de],
    n = r.createComment(""),
    o = Be(t, e),
    i = xa(r, o);
  return To(r, i, n, jm(r, o), !1), n;
}
var Xv = ey,
  Jv = () => !1;
function Kv(e, t, r) {
  return Jv(e, t, r);
}
function ey(e, t, r, n) {
  if (e[Rt]) return;
  let o;
  r.type & 8 ? (o = qe(n)) : (o = Qv(t, r)), (e[Rt] = o);
}
var mt = class {},
  tr = class {};
var $s = class extends mt {
    constructor(t, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new _o(this));
      let o = Sl(t);
      (this._bootstrapComponents = Ed(o.bootstrap)),
        (this._r3Injector = fd(
          t,
          r,
          [
            { provide: mt, useValue: this },
            { provide: Ko, useValue: this.componentFactoryResolver },
            ...n,
          ],
          Ie(t),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(t));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Hs = class extends tr {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new $s(this.moduleType, t, []);
    }
  };
var Ao = class extends mt {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new _o(this)),
      (this.instance = null);
    let r = new $n(
      [
        ...t.providers,
        { provide: mt, useValue: this },
        { provide: Ko, useValue: this.componentFactoryResolver },
      ],
      t.parent || ca(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      t.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function ja(e, t, r = null) {
  return new Ao({
    providers: e,
    parent: t,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var yn = (() => {
  let t = class t {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new ee(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function ty(e, t, r) {
  return (e[t] = r);
}
function ny(e, t) {
  return e[t];
}
function Ft(e, t, r) {
  let n = e[t];
  return Object.is(n, r) ? !1 : ((e[t] = r), !0);
}
function ry(e, t, r, n) {
  let o = Ft(e, t, r);
  return Ft(e, t + 1, n) || o;
}
function oy(e) {
  return (e.flags & 32) === 32;
}
function iy(e, t, r, n, o, i, s, a, c) {
  let u = t.consts,
    l = Qo(t, e, 4, s || null, bo(u, a));
  Ud(t, r, l, bo(u, c)), ya(t, l);
  let d = (l.tView = Ra(
    2,
    l,
    n,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    u,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function Ee(e, t, r, n, o, i, s, a) {
  let c = H(),
    u = st(),
    l = e + je,
    d = u.firstCreatePass ? iy(l, u, c, t, r, n, o, i, s) : u.data[l];
  ar(d, !1);
  let f = sy(u, c, d, e);
  ma() && _a(u, c, f, d), Pt(f, c);
  let h = zd(f, c, f, d);
  return (
    (c[l] = h),
    Xo(c, h),
    Kv(h, d, c),
    la(d) && Ld(u, c, d),
    s != null && jd(c, d, a),
    Ee
  );
}
var sy = ay;
function ay(e, t, r, n) {
  return va(!0), t[de].createComment("");
}
function Va(e, t, r, n) {
  return Ft(e, zo(), r) ? t + Vn(r) + n : Ue;
}
function cy(e, t, r, n, o, i) {
  let s = Vg(),
    a = ry(e, s, r, o);
  return Gl(2), a ? t + Vn(r) + n + Vn(o) + i : Ue;
}
function uo(e, t) {
  return (e << 17) | (t << 2);
}
function kt(e) {
  return (e >> 17) & 32767;
}
function uy(e) {
  return (e & 2) == 2;
}
function ly(e, t) {
  return (e & 131071) | (t << 17);
}
function zs(e) {
  return e | 2;
}
function fn(e) {
  return (e & 131068) >> 2;
}
function ds(e, t) {
  return (e & -131069) | (t << 2);
}
function dy(e) {
  return (e & 1) === 1;
}
function Ws(e) {
  return e | 1;
}
function fy(e, t, r, n, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = kt(s),
    c = fn(s);
  e[n] = r;
  let u = !1,
    l;
  if (Array.isArray(r)) {
    let d = r;
    (l = d[1]), (l === null || or(d, l) > 0) && (u = !0);
  } else l = r;
  if (o)
    if (c !== 0) {
      let f = kt(e[a + 1]);
      (e[n + 1] = uo(f, a)),
        f !== 0 && (e[f + 1] = ds(e[f + 1], n)),
        (e[a + 1] = ly(e[a + 1], n));
    } else
      (e[n + 1] = uo(a, 0)), a !== 0 && (e[a + 1] = ds(e[a + 1], n)), (a = n);
  else
    (e[n + 1] = uo(c, 0)),
      a === 0 ? (a = n) : (e[c + 1] = ds(e[c + 1], n)),
      (c = n);
  u && (e[n + 1] = zs(e[n + 1])),
    nl(e, l, n, !0),
    nl(e, l, n, !1),
    hy(t, l, e, n, i),
    (s = uo(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function hy(e, t, r, n, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    or(i, t) >= 0 &&
    (r[n + 1] = Ws(r[n + 1]));
}
function nl(e, t, r, n) {
  let o = e[r + 1],
    i = t === null,
    s = n ? kt(o) : fn(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      u = e[s + 1];
    py(c, t) && ((a = !0), (e[s + 1] = n ? Ws(u) : zs(u))),
      (s = n ? kt(u) : fn(u));
  }
  a && (e[r + 1] = n ? zs(o) : Ws(o));
}
function py(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? or(e, t) >= 0
    : !1;
}
var ne = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function of(e) {
  return e.substring(ne.key, ne.keyEnd);
}
function gy(e) {
  return e.substring(ne.value, ne.valueEnd);
}
function my(e) {
  return cf(e), sf(e, hn(e, 0, ne.textEnd));
}
function sf(e, t) {
  let r = ne.textEnd;
  return r === t ? -1 : ((t = ne.keyEnd = yy(e, (ne.key = t), r)), hn(e, t, r));
}
function vy(e) {
  return cf(e), af(e, hn(e, 0, ne.textEnd));
}
function af(e, t) {
  let r = ne.textEnd,
    n = (ne.key = hn(e, t, r));
  return r === n
    ? -1
    : ((n = ne.keyEnd = Dy(e, n, r)),
      (n = rl(e, n, r, 58)),
      (n = ne.value = hn(e, n, r)),
      (n = ne.valueEnd = wy(e, n, r)),
      rl(e, n, r, 59));
}
function cf(e) {
  (ne.key = 0),
    (ne.keyEnd = 0),
    (ne.value = 0),
    (ne.valueEnd = 0),
    (ne.textEnd = e.length);
}
function hn(e, t, r) {
  for (; t < r && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function yy(e, t, r) {
  for (; t < r && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function Dy(e, t, r) {
  let n;
  for (
    ;
    t < r &&
    ((n = e.charCodeAt(t)) === 45 ||
      n === 95 ||
      ((n & -33) >= 65 && (n & -33) <= 90) ||
      (n >= 48 && n <= 57));

  )
    t++;
  return t;
}
function rl(e, t, r, n) {
  return (t = hn(e, t, r)), t < r && t++, t;
}
function wy(e, t, r) {
  let n = -1,
    o = -1,
    i = -1,
    s = t,
    a = s;
  for (; s < r; ) {
    let c = e.charCodeAt(s++);
    if (c === 59) return a;
    c === 34 || c === 39
      ? (a = s = ol(e, c, s, r))
      : t === s - 4 && i === 85 && o === 82 && n === 76 && c === 40
      ? (a = s = ol(e, 41, s, r))
      : c > 32 && (a = s),
      (i = o),
      (o = n),
      (n = c & -33);
  }
  return a;
}
function ol(e, t, r, n) {
  let o = -1,
    i = r;
  for (; i < n; ) {
    let s = e.charCodeAt(i++);
    if (s == t && o !== 92) return i;
    s == 92 && o === 92 ? (o = 0) : (o = s);
  }
  throw new Error();
}
function $e(e, t, r) {
  let n = H(),
    o = zo();
  if (Ft(n, o, t)) {
    let i = st(),
      s = Kl();
    Bd(i, s, n, e, t, n[de], r, !1);
  }
  return $e;
}
function Gs(e, t, r, n, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  Oa(e, r, i[s], s, n);
}
function Cy(e) {
  uf(df, by, e, !1);
}
function by(e, t) {
  for (let r = vy(t); r >= 0; r = af(t, r)) df(e, of(t), gy(t));
}
function Ba(e) {
  uf(Ay, Iy, e, !0);
}
function Iy(e, t) {
  for (let r = my(t); r >= 0; r = sf(t, r)) jo(e, of(t), !0);
}
function uf(e, t, r, n) {
  let o = st(),
    i = Gl(2);
  o.firstUpdatePass && Ey(o, null, i, n);
  let s = H();
  if (r !== Ue && Ft(s, i, r)) {
    let a = o.data[vt()];
    if (ff(a, n) && !lf(o, i)) {
      let c = n ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (r = gs(c, r || "")), Gs(o, a, s, r, n);
    } else Ny(o, a, s, s[de], s[i + 1], (s[i + 1] = _y(e, t, r)), n, i);
  }
}
function lf(e, t) {
  return t >= e.expandoStartIndex;
}
function Ey(e, t, r, n) {
  let o = e.data;
  if (o[r + 1] === null) {
    let i = o[vt()],
      s = lf(e, r);
    ff(i, n) && t === null && !s && (t = !1),
      (t = My(o, i, t, n)),
      fy(o, i, t, r, s, n);
  }
}
function My(e, t, r, n) {
  let o = zg(e),
    i = n ? t.residualClasses : t.residualStyles;
  if (o === null)
    (n ? t.classBindings : t.styleBindings) === 0 &&
      ((r = fs(null, e, t, r, n)), (r = nr(r, t.attrs, n)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((r = fs(o, e, t, r, n)), i === null)) {
        let c = Ty(e, t, n);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = fs(null, e, t, c[1], n)),
          (c = nr(c, t.attrs, n)),
          Sy(e, t, n, c));
      } else i = xy(e, t, n);
  }
  return (
    i !== void 0 && (n ? (t.residualClasses = i) : (t.residualStyles = i)), r
  );
}
function Ty(e, t, r) {
  let n = r ? t.classBindings : t.styleBindings;
  if (fn(n) !== 0) return e[kt(n)];
}
function Sy(e, t, r, n) {
  let o = r ? t.classBindings : t.styleBindings;
  e[kt(o)] = n;
}
function xy(e, t, r) {
  let n,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    n = nr(n, s, r);
  }
  return nr(n, t.attrs, r);
}
function fs(e, t, r, n, o) {
  let i = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((i = t[a]), (n = nr(n, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (r.directiveStylingLast = a), n;
}
function nr(e, t, r) {
  let n = r ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === n &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          jo(e, s, r ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function _y(e, t, r) {
  if (r == null || r === "") return be;
  let n = [],
    o = ur(r);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(n, o[i], !0);
  else if (typeof o == "object")
    for (let i in o) o.hasOwnProperty(i) && e(n, i, o[i]);
  else typeof o == "string" && t(n, o);
  return n;
}
function df(e, t, r) {
  jo(e, t, ur(r));
}
function Ay(e, t, r) {
  let n = String(t);
  n !== "" && !n.includes(" ") && jo(e, n, r);
}
function Ny(e, t, r, n, o, i, s, a) {
  o === Ue && (o = be);
  let c = 0,
    u = 0,
    l = 0 < o.length ? o[0] : null,
    d = 0 < i.length ? i[0] : null;
  for (; l !== null || d !== null; ) {
    let f = c < o.length ? o[c + 1] : void 0,
      h = u < i.length ? i[u + 1] : void 0,
      g = null,
      C;
    l === d
      ? ((c += 2), (u += 2), f !== h && ((g = d), (C = h)))
      : d === null || (l !== null && l < d)
      ? ((c += 2), (g = l))
      : ((u += 2), (g = d), (C = h)),
      g !== null && Ry(e, t, r, n, g, C, s, a),
      (l = c < o.length ? o[c] : null),
      (d = u < i.length ? i[u] : null);
  }
}
function Ry(e, t, r, n, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    u = c[a + 1],
    l = dy(u) ? il(c, t, r, o, fn(u), s) : void 0;
  if (!No(l)) {
    No(i) || (uy(u) && (i = il(c, null, r, o, a, s)));
    let d = Bl(vt(), r);
    Wm(n, s, d, o, i);
  }
}
function il(e, t, r, n, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      f = r[o + 1];
    f === Ue && (f = d ? be : void 0);
    let h = d ? ts(f, n) : l === n ? f : void 0;
    if ((u && !No(h) && (h = ts(c, n)), No(h) && ((a = h), s))) return a;
    let g = e[o + 1];
    o = s ? kt(g) : fn(g);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = ts(c, n));
  }
  return a;
}
function No(e) {
  return e !== void 0;
}
function ff(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var qs = class {
  destroy(t) {}
  updateValue(t, r) {}
  swap(t, r) {
    let n = Math.min(t, r),
      o = Math.max(t, r),
      i = this.detach(o);
    if (o - n > 1) {
      let s = this.detach(n);
      this.attach(n, i), this.attach(o, s);
    } else this.attach(n, i);
  }
  move(t, r) {
    this.attach(r, this.detach(t));
  }
};
function hs(e, t, r, n, o) {
  return e === r && Object.is(t, n) ? 1 : Object.is(o(e, t), o(r, n)) ? -1 : 0;
}
function Oy(e, t, r) {
  let n,
    o,
    i = 0,
    s = e.length - 1;
  if (Array.isArray(t)) {
    let a = t.length - 1;
    for (; i <= s && i <= a; ) {
      let c = e.at(i),
        u = t[i],
        l = hs(i, c, i, u, r);
      if (l !== 0) {
        l < 0 && e.updateValue(i, u), i++;
        continue;
      }
      let d = e.at(s),
        f = t[a],
        h = hs(s, d, a, f, r);
      if (h !== 0) {
        h < 0 && e.updateValue(s, f), s--, a--;
        continue;
      }
      let g = r(i, c),
        C = r(s, d),
        b = r(i, u);
      if (Object.is(b, C)) {
        let v = r(a, f);
        Object.is(v, g)
          ? (e.swap(i, s), e.updateValue(s, f), a--, s--)
          : e.move(s, i),
          e.updateValue(i, u),
          i++;
        continue;
      }
      if (((n ??= new Ro()), (o ??= al(e, i, s, r)), Ys(e, n, i, b)))
        e.updateValue(i, u), i++, s++;
      else if (o.has(b)) n.set(g, e.detach(i)), s--;
      else {
        let v = e.create(i, t[i]);
        e.attach(i, v), i++, s++;
      }
    }
    for (; i <= a; ) sl(e, n, r, i, t[i]), i++;
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      c = a.next();
    for (; !c.done && i <= s; ) {
      let u = e.at(i),
        l = c.value,
        d = hs(i, u, i, l, r);
      if (d !== 0) d < 0 && e.updateValue(i, l), i++, (c = a.next());
      else {
        (n ??= new Ro()), (o ??= al(e, i, s, r));
        let f = r(i, l);
        if (Ys(e, n, i, f)) e.updateValue(i, l), i++, s++, (c = a.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, l)), i++, s++, (c = a.next());
        else {
          let h = r(i, u);
          n.set(h, e.detach(i)), s--;
        }
      }
    }
    for (; !c.done; ) sl(e, n, r, e.length, c.value), (c = a.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  n?.forEach((a) => {
    e.destroy(a);
  });
}
function Ys(e, t, r, n) {
  return t !== void 0 && t.has(n)
    ? (e.attach(r, t.get(n)), t.delete(n), !0)
    : !1;
}
function sl(e, t, r, n, o) {
  if (Ys(e, t, n, r(n, o))) e.updateValue(n, o);
  else {
    let i = e.create(n, o);
    e.attach(n, i);
  }
}
function al(e, t, r, n) {
  let o = new Set();
  for (let i = t; i <= r; i++) o.add(n(i, e.at(i)));
  return o;
}
var Ro = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let r = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(r)
        ? (this.kvMap.set(t, this._vMap.get(r)), this._vMap.delete(r))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, r) {
    if (this.kvMap.has(t)) {
      let n = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(n); ) n = o.get(n);
      o.set(n, r);
    } else this.kvMap.set(t, r);
  }
  forEach(t) {
    for (let [r, n] of this.kvMap)
      if ((t(n, r), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(n); ) (n = o.get(n)), t(n, r);
      }
  }
};
function Me(e, t, r) {
  lr("NgControlFlow");
  let n = H(),
    o = zo(),
    i = Js(n, je + e),
    s = 0;
  if (Ft(n, o, t)) {
    let a = k(null);
    try {
      if ((Zd(i, s), t !== -1)) {
        let c = Ks(n[O], je + t),
          u = Jn(i, c.tView.ssrId),
          l = Fa(n, c, r, { dehydratedView: u });
        Jo(i, l, s, Xn(c, u));
      }
    } finally {
      k(a);
    }
  } else {
    let a = Yd(i, s);
    a !== void 0 && (a[ue] = r);
  }
}
var Zs = class {
  constructor(t, r, n) {
    (this.lContainer = t), (this.$implicit = r), (this.$index = n);
  }
  get $count() {
    return this.lContainer.length - he;
  }
};
function ti(e, t) {
  return t;
}
var Qs = class {
  constructor(t, r, n) {
    (this.hasEmptyBlock = t), (this.trackByFn = r), (this.liveCollection = n);
  }
};
function Dn(e, t, r, n, o, i, s, a, c, u, l, d, f) {
  lr("NgControlFlow");
  let h = c !== void 0,
    g = H(),
    C = a ? s.bind(g[Le][ue]) : s,
    b = new Qs(h, C);
  (g[je + e] = b), Ee(e + 1, t, r, n, o, i), h && Ee(e + 2, c, u, l, d, f);
}
var Xs = class extends qs {
  constructor(t, r, n) {
    super(),
      (this.lContainer = t),
      (this.hostLView = r),
      (this.templateTNode = n),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - he;
  }
  at(t) {
    return this.getLView(t)[ue].$implicit;
  }
  attach(t, r) {
    let n = r[Hn];
    (this.needsIndexUpdate ||= t !== this.length),
      Jo(this.lContainer, r, t, Xn(this.templateTNode, n));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), Py(this.lContainer, t)
    );
  }
  create(t, r) {
    let n = Jn(this.lContainer, this.templateTNode.tView.ssrId);
    return Fa(
      this.hostLView,
      this.templateTNode,
      new Zs(this.lContainer, r, t),
      { dehydratedView: n }
    );
  }
  destroy(t) {
    qo(t[O], t);
  }
  updateValue(t, r) {
    this.getLView(t)[ue].$implicit = r;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[ue].$index = t;
  }
  getLView(t) {
    return Fy(this.lContainer, t);
  }
};
function wn(e) {
  let t = k(null),
    r = vt();
  try {
    let n = H(),
      o = n[O],
      i = n[r];
    if (i.liveCollection === void 0) {
      let a = r + 1,
        c = Js(n, a),
        u = Ks(o, a);
      i.liveCollection = new Xs(c, n, u);
    } else i.liveCollection.reset();
    let s = i.liveCollection;
    if ((Oy(s, e, i.trackByFn), s.updateIndexes(), i.hasEmptyBlock)) {
      let a = zo(),
        c = s.length === 0;
      if (Ft(n, a, c)) {
        let u = r + 2,
          l = Js(n, u);
        if (c) {
          let d = Ks(o, u),
            f = Jn(l, d.tView.ssrId),
            h = Fa(n, d, void 0, { dehydratedView: f });
          Jo(l, h, 0, Xn(d, f));
        } else Zd(l, 0);
      }
    }
  } finally {
    k(t);
  }
}
function Js(e, t) {
  return e[t];
}
function Py(e, t) {
  return Qn(e, t);
}
function Fy(e, t) {
  return Yd(e, t);
}
function Ks(e, t) {
  return da(e, t);
}
function ky(e, t, r, n, o, i) {
  let s = t.consts,
    a = bo(s, o),
    c = Qo(t, e, 2, n, a);
  return (
    Ud(t, r, c, bo(s, i)),
    c.attrs !== null && Vs(c, c.attrs, !1),
    c.mergedAttrs !== null && Vs(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function w(e, t, r, n) {
  let o = H(),
    i = st(),
    s = je + e,
    a = o[de],
    c = i.firstCreatePass ? ky(s, i, o, t, r, n) : i.data[s],
    u = Ly(i, o, c, a, t, e);
  o[s] = u;
  let l = la(c);
  return (
    ar(c, !0),
    Nd(a, u, c),
    !oy(c) && ma() && _a(i, o, u, c),
    Ag() === 0 && Pt(u, o),
    Ng(),
    l && (Ld(i, o, c), kd(i, c, o)),
    n !== null && jd(o, c),
    w
  );
}
function D() {
  let e = at();
  Wl() ? Lg() : ((e = e.parent), ar(e, !1));
  let t = e;
  Pg(t) && Fg(), Rg();
  let r = st();
  return (
    r.firstCreatePass && (ya(r, e), Fl(e) && r.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Xg(t) &&
      Gs(r, t, H(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Jg(t) &&
      Gs(r, t, H(), t.stylesWithoutHost, !1),
    D
  );
}
function z(e, t, r, n) {
  return w(e, t, r, n), D(), z;
}
var Ly = (e, t, r, n, o, i) => (va(!0), Md(n, o, qg()));
function Cn() {
  return H();
}
var Oo = "en-US";
var jy = Oo;
function Vy(e) {
  typeof e == "string" && (jy = e.toLowerCase().replace(/_/g, "-"));
}
function ae(e, t, r, n) {
  let o = H(),
    i = st(),
    s = at();
  return Uy(i, o, o[de], s, e, t, n), ae;
}
function By(e, t, r, n) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === r && o[i + 1] === n) {
        let a = t[zn],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function Uy(e, t, r, n, o, i, s) {
  let a = la(n),
    u = e.firstCreatePass && mv(e),
    l = t[ue],
    d = gv(t),
    f = !0;
  if (n.type & 3 || s) {
    let C = Be(n, t),
      b = s ? s(C) : C,
      v = d.length,
      re = s ? (U) => s(qe(U[n.index])) : n.index,
      G = null;
    if ((!s && a && (G = By(e, t, o, n.index)), G !== null)) {
      let U = G.__ngLastListenerFn__ || G;
      (U.__ngNextListenerFn__ = i), (G.__ngLastListenerFn__ = i), (f = !1);
    } else {
      i = ul(n, t, l, i, !1);
      let U = r.listen(b, o, i);
      d.push(i, U), u && u.push(o, re, v, v + 1);
    }
  } else i = ul(n, t, l, i, !1);
  let h = n.outputs,
    g;
  if (f && h !== null && (g = h[o])) {
    let C = g.length;
    if (C)
      for (let b = 0; b < C; b += 2) {
        let v = g[b],
          re = g[b + 1],
          xe = t[v][re].subscribe(i),
          J = d.length;
        d.push(i, xe), u && u.push(o, n.index, J, -(J + 1));
      }
  }
}
function cl(e, t, r, n) {
  let o = k(null);
  try {
    return ze(6, t, r), r(n) !== !1;
  } catch (i) {
    return Gd(e, i), !1;
  } finally {
    ze(7, t, r), k(o);
  }
}
function ul(e, t, r, n, o) {
  return function i(s) {
    if (s === Function) return n;
    let a = e.componentOffset > -1 ? Lt(e.index, t) : t;
    ka(a);
    let c = cl(t, r, n, s),
      u = i.__ngNextListenerFn__;
    for (; u; ) (c = cl(t, r, u, s) && c), (u = u.__ngNextListenerFn__);
    return o && c === !1 && s.preventDefault(), c;
  };
}
function Ye(e = 1) {
  return Gg(e);
}
function Ua(e, t, r) {
  return ni(e, "", t, "", r), Ua;
}
function ni(e, t, r, n, o) {
  let i = H(),
    s = Va(i, t, r, n);
  if (s !== Ue) {
    let a = st(),
      c = Kl();
    Bd(a, c, i, e, s, i[de], o, !1);
  }
  return ni;
}
function ri(e, t, r) {
  let n = H(),
    o = Va(n, e, t, r);
  Cy(o);
}
function F(e, t = "") {
  let r = H(),
    n = st(),
    o = e + je,
    i = n.firstCreatePass ? Qo(n, o, 1, t, null) : n.data[o],
    s = $y(n, r, i, t, e);
  (r[o] = s), ma() && _a(n, r, s, i), ar(i, !1);
}
var $y = (e, t, r, n, o) => (va(!0), Tm(t[de], n));
function oi(e) {
  return Y("", e, ""), oi;
}
function Y(e, t, r) {
  let n = H(),
    o = Va(n, e, t, r);
  return o !== Ue && qd(n, vt(), o), Y;
}
function $a(e, t, r, n, o) {
  let i = H(),
    s = cy(i, e, t, r, n, o);
  return s !== Ue && qd(i, vt(), s), $a;
}
var Hy = (() => {
  let t = class t {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let o = Al(!1, n.type),
          i =
            o.length > 0
              ? ja([o], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, i);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  t.ɵprov = y({
    token: t,
    providedIn: "environment",
    factory: () => new t(_(me)),
  });
  let e = t;
  return e;
})();
function X(e) {
  lr("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(Hy).getOrCreateStandaloneInjector(e));
}
function ii(e, t, r) {
  let n = jg() + e,
    o = H();
  return o[n] === Ue ? ty(o, n, r ? t.call(r) : t()) : ny(o, n);
}
var si = (() => {
  let t = class t {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "platform" }));
  let e = t;
  return e;
})();
var hf = new A("");
function dr(e) {
  return !!e && typeof e.then == "function";
}
function pf(e) {
  return !!e && typeof e.subscribe == "function";
}
var gf = new A(""),
  mf = (() => {
    let t = class t {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, o) => {
            (this.resolve = n), (this.reject = o);
          })),
          (this.appInits = p(gf, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let i of this.appInits) {
          let s = i();
          if (dr(s)) n.push(s);
          else if (pf(s)) {
            let a = new Promise((c, u) => {
              s.subscribe({ complete: c, error: u });
            });
            n.push(a);
          }
        }
        let o = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            o();
          })
          .catch((i) => {
            this.reject(i);
          }),
          n.length === 0 && o(),
          (this.initialized = !0);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  ai = new A("");
function zy() {
  eu(() => {
    throw new E(600, !1);
  });
}
function Wy(e) {
  return e.isBoundToModule;
}
function Gy(e, t, r) {
  try {
    let n = r();
    return dr(n)
      ? n.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : n;
  } catch (n) {
    throw (t.runOutsideAngular(() => e.handleError(n)), n);
  }
}
var bn = (() => {
  let t = class t {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(hd)),
        (this.afterRenderEffectManager = p(nf)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new fe()),
        (this.afterTick = new fe()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(yn).hasPendingTasks.pipe(x((n) => !n))),
        (this._injector = p(me));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, o) {
      let i = n instanceof xo;
      if (!this._injector.get(mf).done) {
        let h = !i && Tl(n),
          g = !1;
        throw new E(405, g);
      }
      let a;
      i ? (a = n) : (a = this._injector.get(Ko).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = Wy(a) ? void 0 : this._injector.get(mt),
        u = o || a.selector,
        l = a.create(cr.NULL, [], u, c),
        d = l.location.nativeElement,
        f = l.injector.get(hf, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            ps(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(n) {
      if (this._runningTick) throw new E(101, !1);
      let o = k(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(n);
      } catch (i) {
        this.internalErrorHandler(i);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), k(o);
      }
    }
    detectChangesInAttachedViews(n) {
      let o = 0,
        i = this.afterRenderEffectManager;
      for (;;) {
        if (o === Xd) throw new E(103, !1);
        if (n) {
          let s = o === 0;
          this.beforeRender.next(s);
          for (let { _lView: a, notifyErrorHandler: c } of this._views)
            qy(a, s, c);
        }
        if (
          (o++,
          i.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => ea(s)
          ) &&
            (i.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => ea(s)
            )))
        )
          break;
      }
    }
    attachView(n) {
      let o = n;
      this._views.push(o), o.attachToAppRef(this);
    }
    detachView(n) {
      let o = n;
      ps(this._views, o), o.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let o = this._injector.get(ai, []);
      [...this._bootstrapListeners, ...o].forEach((i) => i(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => ps(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new E(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function ps(e, t) {
  let r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
function qy(e, t, r) {
  (!t && !ea(e)) || Yy(e, r, t);
}
function ea(e) {
  return ha(e);
}
function Yy(e, t, r) {
  let n;
  r ? ((n = 0), (e[M] |= 1024)) : e[M] & 64 ? (n = 0) : (n = 1), Jd(e, t, n);
}
var ta = class {
    constructor(t, r) {
      (this.ngModuleFactory = t), (this.componentFactories = r);
    }
  },
  Ha = (() => {
    let t = class t {
      compileModuleSync(n) {
        return new Hs(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let o = this.compileModuleSync(n),
          i = Sl(n),
          s = Ed(i.declarations).reduce((a, c) => {
            let u = At(c);
            return u && a.push(new er(u)), a;
          }, []);
        return new ta(o, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
var Zy = (() => {
  let t = class t {
    constructor() {
      (this.zone = p(W)), (this.applicationRef = p(bn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Qy(e) {
  return [
    { provide: W, useFactory: e },
    {
      provide: cn,
      multi: !0,
      useFactory: () => {
        let t = p(Zy, { optional: !0 });
        return () => t.initialize();
      },
    },
    {
      provide: cn,
      multi: !0,
      useFactory: () => {
        let t = p(eD);
        return () => {
          t.initialize();
        };
      },
    },
    { provide: hd, useFactory: Xy },
  ];
}
function Xy() {
  let e = p(W),
    t = p(tt);
  return (r) => e.runOutsideAngular(() => t.handleError(r));
}
function Jy(e) {
  let t = Qy(() => new W(Ky(e)));
  return pn([[], t]);
}
function Ky(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var eD = (() => {
  let t = class t {
    constructor() {
      (this.subscription = new K()),
        (this.initialized = !1),
        (this.zone = p(W)),
        (this.pendingTasks = p(yn));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              W.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            W.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function tD() {
  return (typeof $localize < "u" && $localize.locale) || Oo;
}
var za = new A("", {
  providedIn: "root",
  factory: () => p(za, R.Optional | R.SkipSelf) || tD(),
});
var vf = new A("");
var go = null;
function nD(e = [], t) {
  return cr.create({
    name: t,
    providers: [
      { provide: Vo, useValue: "platform" },
      { provide: vf, useValue: new Set([() => (go = null)]) },
      ...e,
    ],
  });
}
function rD(e = []) {
  if (go) return go;
  let t = nD(e);
  return (go = t), zy(), oD(t), t;
}
function oD(e) {
  e.get(Ia, null)?.forEach((r) => r());
}
var fr = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = iD;
  let e = t;
  return e;
})();
function iD(e) {
  return sD(at(), H(), (e & 16) === 16);
}
function sD(e, t, r) {
  if ($o(e) && !r) {
    let n = Lt(e.index, t);
    return new dn(n, n);
  } else if (e.type & 47) {
    let n = t[Le];
    return new dn(n, t);
  }
  return null;
}
function yf(e) {
  try {
    let { rootComponent: t, appProviders: r, platformProviders: n } = e,
      o = rD(n),
      i = [Jy(), ...(r || [])],
      a = new Ao({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(W);
    return c.run(() => {
      a.resolveInjectorInitializers();
      let u = a.get(tt, null),
        l;
      c.runOutsideAngular(() => {
        l = c.onError.subscribe({
          next: (h) => {
            u.handleError(h);
          },
        });
      });
      let d = () => a.destroy(),
        f = o.get(vf);
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d);
        }),
        Gy(u, c, () => {
          let h = a.get(mf);
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let g = a.get(za, Oo);
              Vy(g || Oo);
              let C = a.get(bn);
              return t !== void 0 && C.bootstrap(t), C;
            })
          );
        })
      );
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var If = null;
function In() {
  return If;
}
function Ef(e) {
  If ??= e;
}
var ci = class {};
var ve = new A(""),
  Mf = (() => {
    let t = class t {
      historyGo(n) {
        throw new Error("");
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => p(lD), providedIn: "platform" }));
    let e = t;
    return e;
  })();
var lD = (() => {
  let t = class t extends Mf {
    constructor() {
      super(),
        (this._doc = p(ve)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return In().getBaseHref(this._doc);
    }
    onPopState(n) {
      let o = In().getGlobalEventTarget(this._doc, "window");
      return (
        o.addEventListener("popstate", n, !1),
        () => o.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let o = In().getGlobalEventTarget(this._doc, "window");
      return (
        o.addEventListener("hashchange", n, !1),
        () => o.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, o, i) {
      this._history.pushState(n, o, i);
    }
    replaceState(n, o, i) {
      this._history.replaceState(n, o, i);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: () => new t(), providedIn: "platform" }));
  let e = t;
  return e;
})();
function Tf(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let r = 0;
  return (
    e.endsWith("/") && r++,
    t.startsWith("/") && r++,
    r == 2 ? e + t.substring(1) : r == 1 ? e + t : e + "/" + t
  );
}
function Df(e) {
  let t = e.match(/#|\?|$/),
    r = (t && t.index) || e.length,
    n = r - (e[r - 1] === "/" ? 1 : 0);
  return e.slice(0, n) + e.slice(r);
}
function jt(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var ui = (() => {
    let t = class t {
      historyGo(n) {
        throw new Error("");
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => p(Sf), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  dD = new A(""),
  Sf = (() => {
    let t = class t extends ui {
      constructor(n, o) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            o ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(ve).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return Tf(this._baseHref, n);
      }
      path(n = !1) {
        let o =
            this._platformLocation.pathname + jt(this._platformLocation.search),
          i = this._platformLocation.hash;
        return i && n ? `${o}${i}` : o;
      }
      pushState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + jt(s));
        this._platformLocation.pushState(n, o, a);
      }
      replaceState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + jt(s));
        this._platformLocation.replaceState(n, o, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(Mf), _(dD, 8));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
var hr = (() => {
  let t = class t {
    constructor(n) {
      (this._subject = new se()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let o = this._locationStrategy.getBaseHref();
      (this._basePath = pD(Df(wf(o)))),
        this._locationStrategy.onPopState((i) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: i.state,
            type: i.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, o = "") {
      return this.path() == this.normalize(n + jt(o));
    }
    normalize(n) {
      return t.stripTrailingSlash(hD(this._basePath, wf(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, o = "", i = null) {
      this._locationStrategy.pushState(i, "", n, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + jt(o)), i);
    }
    replaceState(n, o = "", i = null) {
      this._locationStrategy.replaceState(i, "", n, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + jt(o)), i);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((o) => {
          this._notifyUrlChangeListeners(o.url, o.state);
        })),
        () => {
          let o = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(o, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = "", o) {
      this._urlChangeListeners.forEach((i) => i(n, o));
    }
    subscribe(n, o, i) {
      return this._subject.subscribe({ next: n, error: o, complete: i });
    }
  };
  (t.normalizeQueryParams = jt),
    (t.joinWithSlash = Tf),
    (t.stripTrailingSlash = Df),
    (t.ɵfac = function (o) {
      return new (o || t)(_(ui));
    }),
    (t.ɵprov = y({ token: t, factory: () => fD(), providedIn: "root" }));
  let e = t;
  return e;
})();
function fD() {
  return new hr(_(ui));
}
function hD(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let r = t.substring(e.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : t;
}
function wf(e) {
  return e.replace(/\/index.html$/, "");
}
function pD(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, r] = e.split(/\/\/[^\/]+/);
    return r;
  }
  return e;
}
function li(e, t) {
  t = encodeURIComponent(t);
  for (let r of e.split(";")) {
    let n = r.indexOf("="),
      [o, i] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var pr = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵmod = ir({ type: t })),
      (t.ɵinj = rr({}));
    let e = t;
    return e;
  })(),
  xf = "browser",
  gD = "server";
function di(e) {
  return e === gD;
}
var En = class {};
var mr = class {},
  vr = class {},
  ct = class e {
    constructor(t) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        t
          ? typeof t == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  t
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let o = r.slice(0, n),
                          i = o.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(o, i),
                          this.headers.has(i)
                            ? this.headers.get(i).push(s)
                            : this.headers.set(i, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && t instanceof Headers
            ? ((this.headers = new Map()),
              t.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(t).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let r = this.headers.get(t.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, r) {
      return this.clone({ name: t, value: r, op: "a" });
    }
    set(t, r) {
      return this.clone({ name: t, value: r, op: "s" });
    }
    delete(t, r) {
      return this.clone({ name: t, value: r, op: "d" });
    }
    maybeSetNormalizedName(t, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((r) => {
          this.headers.set(r, t.headers.get(r)),
            this.normalizedNames.set(r, t.normalizedNames.get(r));
        });
    }
    clone(t) {
      let r = new e();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        r
      );
    }
    applyUpdate(t) {
      let r = t.name.toLowerCase();
      switch (t.op) {
        case "a":
        case "s":
          let n = t.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(t.name, r);
          let o = (t.op === "a" ? this.headers.get(r) : void 0) || [];
          o.push(...n), this.headers.set(r, o);
          break;
        case "d":
          let i = t.value;
          if (!i) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(t, r) {
      let n = (Array.isArray(r) ? r : [r]).map((i) => i.toString()),
        o = t.toLowerCase();
      this.headers.set(o, n), this.maybeSetNormalizedName(t, o);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          t(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var qa = class {
  encodeKey(t) {
    return _f(t);
  }
  encodeValue(t) {
    return _f(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function DD(e, t) {
  let r = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((o) => {
          let i = o.indexOf("="),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), ""]
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            c = r.get(s) || [];
          c.push(a), r.set(s, c);
        }),
    r
  );
}
var wD = /%(\d[a-f0-9])/gi,
  CD = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function _f(e) {
  return encodeURIComponent(e).replace(wD, (t, r) => CD[r] ?? t);
}
function fi(e) {
  return `${e}`;
}
var wt = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new qa()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = DD(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((r) => {
            let n = t.fromObject[r],
              o = Array.isArray(n) ? n.map(fi) : [fi(n)];
            this.map.set(r, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let r = this.map.get(t);
    return r ? r[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, r) {
    return this.clone({ param: t, value: r, op: "a" });
  }
  appendAll(t) {
    let r = [];
    return (
      Object.keys(t).forEach((n) => {
        let o = t[n];
        Array.isArray(o)
          ? o.forEach((i) => {
              r.push({ param: n, value: i, op: "a" });
            })
          : r.push({ param: n, value: o, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(t, r) {
    return this.clone({ param: t, value: r, op: "s" });
  }
  delete(t, r) {
    return this.clone({ param: t, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let r = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let r = new e({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(t)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let r = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              r.push(fi(t.value)), this.map.set(t.param, r);
              break;
            case "d":
              if (t.value !== void 0) {
                let n = this.map.get(t.param) || [],
                  o = n.indexOf(fi(t.value));
                o !== -1 && n.splice(o, 1),
                  n.length > 0
                    ? this.map.set(t.param, n)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Ya = class {
  constructor() {
    this.map = new Map();
  }
  set(t, r) {
    return this.map.set(t, r), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function bD(e) {
  switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function Af(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function Nf(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function Rf(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function ID(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var gr = class e {
    constructor(t, r, n, o) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = t.toUpperCase());
      let i;
      if (
        (bD(this.method) || o
          ? ((this.body = n !== void 0 ? n : null), (i = o))
          : (i = n),
        i &&
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          (this.transferCache = i.transferCache)),
        (this.headers ??= new ct()),
        (this.context ??= new Ya()),
        !this.params)
      )
        (this.params = new wt()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            c = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          Af(this.body) ||
          Nf(this.body) ||
          Rf(this.body) ||
          ID(this.body)
        ? this.body
        : this.body instanceof wt
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || Rf(this.body)
        ? null
        : Nf(this.body)
        ? this.body.type || null
        : Af(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof wt
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(t = {}) {
      let r = t.method || this.method,
        n = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.transferCache ?? this.transferCache,
        s = t.body !== void 0 ? t.body : this.body,
        a = t.withCredentials ?? this.withCredentials,
        c = t.reportProgress ?? this.reportProgress,
        u = t.headers || this.headers,
        l = t.params || this.params,
        d = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (u = Object.keys(t.setHeaders).reduce(
            (f, h) => f.set(h, t.setHeaders[h]),
            u
          )),
        t.setParams &&
          (l = Object.keys(t.setParams).reduce(
            (f, h) => f.set(h, t.setParams[h]),
            l
          )),
        new e(r, n, s, {
          params: l,
          headers: u,
          context: d,
          reportProgress: c,
          responseType: o,
          withCredentials: a,
          transferCache: i,
        })
      );
    }
  },
  Ct = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(Ct || {}),
  yr = class {
    constructor(t, r = wr.Ok, n = "OK") {
      (this.headers = t.headers || new ct()),
        (this.status = t.status !== void 0 ? t.status : r),
        (this.statusText = t.statusText || n),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  hi = class e extends yr {
    constructor(t = {}) {
      super(t), (this.type = Ct.ResponseHeader);
    }
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Dr = class e extends yr {
    constructor(t = {}) {
      super(t),
        (this.type = Ct.Response),
        (this.body = t.body !== void 0 ? t.body : null);
    }
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Dt = class extends yr {
    constructor(t) {
      super(t, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              t.url || "(unknown url)"
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  wr = (function (e) {
    return (
      (e[(e.Continue = 100)] = "Continue"),
      (e[(e.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (e[(e.Processing = 102)] = "Processing"),
      (e[(e.EarlyHints = 103)] = "EarlyHints"),
      (e[(e.Ok = 200)] = "Ok"),
      (e[(e.Created = 201)] = "Created"),
      (e[(e.Accepted = 202)] = "Accepted"),
      (e[(e.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (e[(e.NoContent = 204)] = "NoContent"),
      (e[(e.ResetContent = 205)] = "ResetContent"),
      (e[(e.PartialContent = 206)] = "PartialContent"),
      (e[(e.MultiStatus = 207)] = "MultiStatus"),
      (e[(e.AlreadyReported = 208)] = "AlreadyReported"),
      (e[(e.ImUsed = 226)] = "ImUsed"),
      (e[(e.MultipleChoices = 300)] = "MultipleChoices"),
      (e[(e.MovedPermanently = 301)] = "MovedPermanently"),
      (e[(e.Found = 302)] = "Found"),
      (e[(e.SeeOther = 303)] = "SeeOther"),
      (e[(e.NotModified = 304)] = "NotModified"),
      (e[(e.UseProxy = 305)] = "UseProxy"),
      (e[(e.Unused = 306)] = "Unused"),
      (e[(e.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (e[(e.PermanentRedirect = 308)] = "PermanentRedirect"),
      (e[(e.BadRequest = 400)] = "BadRequest"),
      (e[(e.Unauthorized = 401)] = "Unauthorized"),
      (e[(e.PaymentRequired = 402)] = "PaymentRequired"),
      (e[(e.Forbidden = 403)] = "Forbidden"),
      (e[(e.NotFound = 404)] = "NotFound"),
      (e[(e.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (e[(e.NotAcceptable = 406)] = "NotAcceptable"),
      (e[(e.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (e[(e.RequestTimeout = 408)] = "RequestTimeout"),
      (e[(e.Conflict = 409)] = "Conflict"),
      (e[(e.Gone = 410)] = "Gone"),
      (e[(e.LengthRequired = 411)] = "LengthRequired"),
      (e[(e.PreconditionFailed = 412)] = "PreconditionFailed"),
      (e[(e.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (e[(e.UriTooLong = 414)] = "UriTooLong"),
      (e[(e.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (e[(e.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (e[(e.ExpectationFailed = 417)] = "ExpectationFailed"),
      (e[(e.ImATeapot = 418)] = "ImATeapot"),
      (e[(e.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (e[(e.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (e[(e.Locked = 423)] = "Locked"),
      (e[(e.FailedDependency = 424)] = "FailedDependency"),
      (e[(e.TooEarly = 425)] = "TooEarly"),
      (e[(e.UpgradeRequired = 426)] = "UpgradeRequired"),
      (e[(e.PreconditionRequired = 428)] = "PreconditionRequired"),
      (e[(e.TooManyRequests = 429)] = "TooManyRequests"),
      (e[(e.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (e[(e.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (e[(e.InternalServerError = 500)] = "InternalServerError"),
      (e[(e.NotImplemented = 501)] = "NotImplemented"),
      (e[(e.BadGateway = 502)] = "BadGateway"),
      (e[(e.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (e[(e.GatewayTimeout = 504)] = "GatewayTimeout"),
      (e[(e.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (e[(e.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (e[(e.InsufficientStorage = 507)] = "InsufficientStorage"),
      (e[(e.LoopDetected = 508)] = "LoopDetected"),
      (e[(e.NotExtended = 510)] = "NotExtended"),
      (e[(e.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      e
    );
  })(wr || {});
function Wa(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  };
}
var Xa = (() => {
    let t = class t {
      constructor(n) {
        this.handler = n;
      }
      request(n, o, i = {}) {
        let s;
        if (n instanceof gr) s = n;
        else {
          let u;
          i.headers instanceof ct ? (u = i.headers) : (u = new ct(i.headers));
          let l;
          i.params &&
            (i.params instanceof wt
              ? (l = i.params)
              : (l = new wt({ fromObject: i.params }))),
            (s = new gr(n, o, i.body !== void 0 ? i.body : null, {
              headers: u,
              context: i.context,
              params: l,
              reportProgress: i.reportProgress,
              responseType: i.responseType || "json",
              withCredentials: i.withCredentials,
              transferCache: i.transferCache,
            }));
        }
        let a = I(s).pipe(dt((u) => this.handler.handle(u)));
        if (n instanceof gr || i.observe === "events") return a;
        let c = a.pipe(we((u) => u instanceof Dr));
        switch (i.observe || "body") {
          case "body":
            switch (s.responseType) {
              case "arraybuffer":
                return c.pipe(
                  x((u) => {
                    if (u.body !== null && !(u.body instanceof ArrayBuffer))
                      throw new Error("Response is not an ArrayBuffer.");
                    return u.body;
                  })
                );
              case "blob":
                return c.pipe(
                  x((u) => {
                    if (u.body !== null && !(u.body instanceof Blob))
                      throw new Error("Response is not a Blob.");
                    return u.body;
                  })
                );
              case "text":
                return c.pipe(
                  x((u) => {
                    if (u.body !== null && typeof u.body != "string")
                      throw new Error("Response is not a string.");
                    return u.body;
                  })
                );
              case "json":
              default:
                return c.pipe(x((u) => u.body));
            }
          case "response":
            return c;
          default:
            throw new Error(
              `Unreachable: unhandled observe type ${i.observe}}`
            );
        }
      }
      delete(n, o = {}) {
        return this.request("DELETE", n, o);
      }
      get(n, o = {}) {
        return this.request("GET", n, o);
      }
      head(n, o = {}) {
        return this.request("HEAD", n, o);
      }
      jsonp(n, o) {
        return this.request("JSONP", n, {
          params: new wt().append(o, "JSONP_CALLBACK"),
          observe: "body",
          responseType: "json",
        });
      }
      options(n, o = {}) {
        return this.request("OPTIONS", n, o);
      }
      patch(n, o, i = {}) {
        return this.request("PATCH", n, Wa(i, o));
      }
      post(n, o, i = {}) {
        return this.request("POST", n, Wa(i, o));
      }
      put(n, o, i = {}) {
        return this.request("PUT", n, Wa(i, o));
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(mr));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  ED = /^\)\]\}',?\n/,
  MD = "X-Request-URL";
function Of(e) {
  if (e.url) return e.url;
  let t = MD.toLocaleLowerCase();
  return e.headers.get(t);
}
var Ga = (() => {
    let t = class t {
      constructor() {
        (this.fetchImpl =
          p(Za, { optional: !0 })?.fetch ?? fetch.bind(globalThis)),
          (this.ngZone = p(W));
      }
      handle(n) {
        return new V((o) => {
          let i = new AbortController();
          return (
            this.doRequest(n, i.signal, o).then(Qa, (s) =>
              o.error(new Dt({ error: s }))
            ),
            () => i.abort()
          );
        });
      }
      doRequest(n, o, i) {
        return Ur(this, null, function* () {
          let s = this.createRequestInit(n),
            a;
          try {
            let g = this.fetchImpl(n.urlWithParams, m({ signal: o }, s));
            TD(g), i.next({ type: Ct.Sent }), (a = yield g);
          } catch (g) {
            i.error(
              new Dt({
                error: g,
                status: g.status ?? 0,
                statusText: g.statusText,
                url: n.urlWithParams,
                headers: g.headers,
              })
            );
            return;
          }
          let c = new ct(a.headers),
            u = a.statusText,
            l = Of(a) ?? n.urlWithParams,
            d = a.status,
            f = null;
          if (
            (n.reportProgress &&
              i.next(new hi({ headers: c, status: d, statusText: u, url: l })),
            a.body)
          ) {
            let g = a.headers.get("content-length"),
              C = [],
              b = a.body.getReader(),
              v = 0,
              re,
              G,
              U = typeof Zone < "u" && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              Ur(this, null, function* () {
                for (;;) {
                  let { done: J, value: _e } = yield b.read();
                  if (J) break;
                  if ((C.push(_e), (v += _e.length), n.reportProgress)) {
                    G =
                      n.responseType === "text"
                        ? (G ?? "") +
                          (re ??= new TextDecoder()).decode(_e, { stream: !0 })
                        : void 0;
                    let Ht = () =>
                      i.next({
                        type: Ct.DownloadProgress,
                        total: g ? +g : void 0,
                        loaded: v,
                        partialText: G,
                      });
                    U ? U.run(Ht) : Ht();
                  }
                }
              })
            );
            let xe = this.concatChunks(C, v);
            try {
              let J = a.headers.get("Content-Type") ?? "";
              f = this.parseBody(n, xe, J);
            } catch (J) {
              i.error(
                new Dt({
                  error: J,
                  headers: new ct(a.headers),
                  status: a.status,
                  statusText: a.statusText,
                  url: Of(a) ?? n.urlWithParams,
                })
              );
              return;
            }
          }
          d === 0 && (d = f ? wr.Ok : 0),
            d >= 200 && d < 300
              ? (i.next(
                  new Dr({
                    body: f,
                    headers: c,
                    status: d,
                    statusText: u,
                    url: l,
                  })
                ),
                i.complete())
              : i.error(
                  new Dt({
                    error: f,
                    headers: c,
                    status: d,
                    statusText: u,
                    url: l,
                  })
                );
        });
      }
      parseBody(n, o, i) {
        switch (n.responseType) {
          case "json":
            let s = new TextDecoder().decode(o).replace(ED, "");
            return s === "" ? null : JSON.parse(s);
          case "text":
            return new TextDecoder().decode(o);
          case "blob":
            return new Blob([o], { type: i });
          case "arraybuffer":
            return o.buffer;
        }
      }
      createRequestInit(n) {
        let o = {},
          i = n.withCredentials ? "include" : void 0;
        if (
          (n.headers.forEach((s, a) => (o[s] = a.join(","))),
          (o.Accept ??= "application/json, text/plain, */*"),
          !o["Content-Type"])
        ) {
          let s = n.detectContentTypeHeader();
          s !== null && (o["Content-Type"] = s);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: o,
          credentials: i,
        };
      }
      concatChunks(n, o) {
        let i = new Uint8Array(o),
          s = 0;
        for (let a of n) i.set(a, s), (s += a.length);
        return i;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Za = class {};
function Qa() {}
function TD(e) {
  e.then(Qa, Qa);
}
function SD(e, t) {
  return t(e);
}
function xD(e, t, r) {
  return (n, o) => rt(r, () => t(n, (i) => e(i, o)));
}
var kf = new A(""),
  _D = new A(""),
  Lf = new A("");
var Pf = (() => {
  let t = class t extends mr {
    constructor(n, o) {
      super(),
        (this.backend = n),
        (this.injector = o),
        (this.chain = null),
        (this.pendingTasks = p(yn));
      let i = p(Lf, { optional: !0 });
      this.backend = i ?? n;
    }
    handle(n) {
      if (this.chain === null) {
        let i = Array.from(
          new Set([...this.injector.get(kf), ...this.injector.get(_D, [])])
        );
        this.chain = i.reduceRight((s, a) => xD(s, a, this.injector), SD);
      }
      let o = this.pendingTasks.add();
      return this.chain(n, (i) => this.backend.handle(i)).pipe(
        xt(() => this.pendingTasks.remove(o))
      );
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)(_(vr), _(me));
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
var AD = /^\)\]\}',?\n/;
function ND(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader("X-Request-URL")
    : null;
}
var Ff = (() => {
    let t = class t {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new E(-2800, !1);
        let o = this.xhrFactory;
        return (o.ɵloadImpl ? q(o.ɵloadImpl()) : I(null)).pipe(
          Ce(
            () =>
              new V((s) => {
                let a = o.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((b, v) =>
                    a.setRequestHeader(b, v.join(","))
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let b = n.detectContentTypeHeader();
                  b !== null && a.setRequestHeader("Content-Type", b);
                }
                if (n.responseType) {
                  let b = n.responseType.toLowerCase();
                  a.responseType = b !== "json" ? b : "text";
                }
                let c = n.serializeBody(),
                  u = null,
                  l = () => {
                    if (u !== null) return u;
                    let b = a.statusText || "OK",
                      v = new ct(a.getAllResponseHeaders()),
                      re = ND(a) || n.url;
                    return (
                      (u = new hi({
                        headers: v,
                        status: a.status,
                        statusText: b,
                        url: re,
                      })),
                      u
                    );
                  },
                  d = () => {
                    let { headers: b, status: v, statusText: re, url: G } = l(),
                      U = null;
                    v !== wr.NoContent &&
                      (U =
                        typeof a.response > "u" ? a.responseText : a.response),
                      v === 0 && (v = U ? wr.Ok : 0);
                    let xe = v >= 200 && v < 300;
                    if (n.responseType === "json" && typeof U == "string") {
                      let J = U;
                      U = U.replace(AD, "");
                      try {
                        U = U !== "" ? JSON.parse(U) : null;
                      } catch (_e) {
                        (U = J),
                          xe && ((xe = !1), (U = { error: _e, text: U }));
                      }
                    }
                    xe
                      ? (s.next(
                          new Dr({
                            body: U,
                            headers: b,
                            status: v,
                            statusText: re,
                            url: G || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new Dt({
                            error: U,
                            headers: b,
                            status: v,
                            statusText: re,
                            url: G || void 0,
                          })
                        );
                  },
                  f = (b) => {
                    let { url: v } = l(),
                      re = new Dt({
                        error: b,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: v || void 0,
                      });
                    s.error(re);
                  },
                  h = !1,
                  g = (b) => {
                    h || (s.next(l()), (h = !0));
                    let v = { type: Ct.DownloadProgress, loaded: b.loaded };
                    b.lengthComputable && (v.total = b.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (v.partialText = a.responseText),
                      s.next(v);
                  },
                  C = (b) => {
                    let v = { type: Ct.UploadProgress, loaded: b.loaded };
                    b.lengthComputable && (v.total = b.total), s.next(v);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", f),
                  a.addEventListener("timeout", f),
                  a.addEventListener("abort", f),
                  n.reportProgress &&
                    (a.addEventListener("progress", g),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", C)),
                  a.send(c),
                  s.next({ type: Ct.Sent }),
                  () => {
                    a.removeEventListener("error", f),
                      a.removeEventListener("abort", f),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", f),
                      n.reportProgress &&
                        (a.removeEventListener("progress", g),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", C)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(En));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  jf = new A(""),
  RD = "XSRF-TOKEN",
  OD = new A("", { providedIn: "root", factory: () => RD }),
  PD = "X-XSRF-TOKEN",
  FD = new A("", { providedIn: "root", factory: () => PD }),
  pi = class {},
  kD = (() => {
    let t = class t {
      constructor(n, o, i) {
        (this.doc = n),
          (this.platform = o),
          (this.cookieName = i),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = li(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(ve), _(yt), _(OD));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function LD(e, t) {
  let r = e.url.toLowerCase();
  if (
    !p(jf) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return t(e);
  let n = p(pi).getToken(),
    o = p(FD);
  return (
    n != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, n) })),
    t(e)
  );
}
var Vf = (function (e) {
  return (
    (e[(e.Interceptors = 0)] = "Interceptors"),
    (e[(e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (e[(e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (e[(e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (e[(e.JsonpSupport = 4)] = "JsonpSupport"),
    (e[(e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (e[(e.Fetch = 6)] = "Fetch"),
    e
  );
})(Vf || {});
function jD(e, t) {
  return { ɵkind: e, ɵproviders: t };
}
function Bf(...e) {
  let t = [
    Xa,
    Ff,
    Pf,
    { provide: mr, useExisting: Pf },
    { provide: vr, useExisting: Ff },
    { provide: kf, useValue: LD, multi: !0 },
    { provide: jf, useValue: !0 },
    { provide: pi, useClass: kD },
  ];
  for (let r of e) t.push(...r.ɵproviders);
  return pn(t);
}
function Uf() {
  return jD(Vf.Fetch, [
    Ga,
    { provide: vr, useExisting: Ga },
    { provide: Lf, useExisting: Ga },
  ]);
}
var ec = class extends ci {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  tc = class e extends ec {
    static makeCurrent() {
      Ef(new e());
    }
    onAndCancel(t, r, n) {
      return (
        t.addEventListener(r, n),
        () => {
          t.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(t, r) {
      t.dispatchEvent(r);
    }
    remove(t) {
      t.parentNode && t.parentNode.removeChild(t);
    }
    createElement(t, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, r) {
      return r === "window"
        ? window
        : r === "document"
        ? t
        : r === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let r = BD();
      return r == null ? null : UD(r);
    }
    resetBaseElement() {
      Cr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return li(document.cookie, t);
    }
  },
  Cr = null;
function BD() {
  return (
    (Cr = Cr || document.querySelector("base")),
    Cr ? Cr.getAttribute("href") : null
  );
}
function UD(e) {
  return new URL(e, document.baseURI).pathname;
}
var $D = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  nc = new A(""),
  Wf = (() => {
    let t = class t {
      constructor(n, o) {
        (this._zone = o),
          (this._eventNameToPlugin = new Map()),
          n.forEach((i) => {
            i.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, o, i) {
        return this._findPluginFor(o).addEventListener(n, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let o = this._eventNameToPlugin.get(n);
        if (o) return o;
        if (((o = this._plugins.find((s) => s.supports(n))), !o))
          throw new E(5101, !1);
        return this._eventNameToPlugin.set(n, o), o;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(nc), _(W));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  gi = class {
    constructor(t) {
      this._doc = t;
    }
  },
  Ja = "ng-app-id",
  Gf = (() => {
    let t = class t {
      constructor(n, o, i, s = {}) {
        (this.doc = n),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = di(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let o of n)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o);
      }
      removeStyles(n) {
        for (let o of n)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((o) => o.remove()), n.clear());
        for (let o of this.getAllStyles()) this.onStyleRemoved(o);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let o of this.getAllStyles()) this.addStyleToHost(n, o);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let o of this.hostNodes) this.addStyleToHost(o, n);
      }
      onStyleRemoved(n) {
        let o = this.styleRef;
        o.get(n)?.elements?.forEach((i) => i.remove()), o.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Ja}="${this.appId}"]`);
        if (n?.length) {
          let o = new Map();
          return (
            n.forEach((i) => {
              i.textContent != null && o.set(i.textContent, i);
            }),
            o
          );
        }
        return null;
      }
      changeUsageCount(n, o) {
        let i = this.styleRef;
        if (i.has(n)) {
          let s = i.get(n);
          return (s.usage += o), s.usage;
        }
        return i.set(n, { usage: o, elements: [] }), o;
      }
      getStyleElement(n, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o);
        if (s?.parentNode === n) return i.delete(o), s.removeAttribute(Ja), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(Ja, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, o) {
        let i = this.getStyleElement(n, o),
          s = this.styleRef,
          a = s.get(o)?.elements;
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(ve), _(ba), _(Ea, 8), _(yt));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Ka = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  oc = /%COMP%/g,
  qf = "%COMP%",
  HD = `_nghost-${qf}`,
  zD = `_ngcontent-${qf}`,
  WD = !0,
  GD = new A("", { providedIn: "root", factory: () => WD });
function qD(e) {
  return zD.replace(oc, e);
}
function YD(e) {
  return HD.replace(oc, e);
}
function Yf(e, t) {
  return t.map((r) => r.replace(oc, e));
}
var $f = (() => {
    let t = class t {
      constructor(n, o, i, s, a, c, u, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = u),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = di(c)),
          (this.defaultRenderer = new br(n, a, u, this.platformIsServer));
      }
      createRenderer(n, o) {
        if (!n || !o) return this.defaultRenderer;
        this.platformIsServer &&
          o.encapsulation === Ge.ShadowDom &&
          (o = Z(m({}, o), { encapsulation: Ge.Emulated }));
        let i = this.getOrCreateRenderer(n, o);
        return (
          i instanceof mi
            ? i.applyToHost(n)
            : i instanceof Ir && i.applyStyles(),
          i
        );
      }
      getOrCreateRenderer(n, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            u = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (o.encapsulation) {
            case Ge.Emulated:
              s = new mi(u, l, o, this.appId, d, a, c, f);
              break;
            case Ge.ShadowDom:
              return new rc(u, l, n, o, a, c, this.nonce, f);
            default:
              s = new Ir(u, l, o, d, a, c, f);
              break;
          }
          i.set(o.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(
        _(Wf),
        _(Gf),
        _(ba),
        _(GD),
        _(ve),
        _(yt),
        _(W),
        _(Ea)
      );
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  br = class {
    constructor(t, r, n, o) {
      (this.eventManager = t),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, r) {
      return r
        ? this.doc.createElementNS(Ka[r] || r, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, r) {
      (Hf(t) ? t.content : t).appendChild(r);
    }
    insertBefore(t, r, n) {
      t && (Hf(t) ? t.content : t).insertBefore(r, n);
    }
    removeChild(t, r) {
      t && t.removeChild(r);
    }
    selectRootElement(t, r) {
      let n = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!n) throw new E(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, r, n, o) {
      if (o) {
        r = o + ":" + r;
        let i = Ka[o];
        i ? t.setAttributeNS(i, r, n) : t.setAttribute(r, n);
      } else t.setAttribute(r, n);
    }
    removeAttribute(t, r, n) {
      if (n) {
        let o = Ka[n];
        o ? t.removeAttributeNS(o, r) : t.removeAttribute(`${n}:${r}`);
      } else t.removeAttribute(r);
    }
    addClass(t, r) {
      t.classList.add(r);
    }
    removeClass(t, r) {
      t.classList.remove(r);
    }
    setStyle(t, r, n, o) {
      o & (nt.DashCase | nt.Important)
        ? t.style.setProperty(r, n, o & nt.Important ? "important" : "")
        : (t.style[r] = n);
    }
    removeStyle(t, r, n) {
      n & nt.DashCase ? t.style.removeProperty(r) : (t.style[r] = "");
    }
    setProperty(t, r, n) {
      t != null && (t[r] = n);
    }
    setValue(t, r) {
      t.nodeValue = r;
    }
    listen(t, r, n) {
      if (
        typeof t == "string" &&
        ((t = In().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${r}`);
      return this.eventManager.addEventListener(
        t,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(t) {
      return (r) => {
        if (r === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(r)) : t(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function Hf(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var rc = class extends br {
    constructor(t, r, n, o, i, s, a, c) {
      super(t, i, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = Yf(o.id, o.styles);
      for (let l of u) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, r) {
      return super.appendChild(this.nodeOrShadowRoot(t), r);
    }
    insertBefore(t, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(t), r, n);
    }
    removeChild(t, r) {
      return super.removeChild(this.nodeOrShadowRoot(t), r);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Ir = class extends br {
    constructor(t, r, n, o, i, s, a, c) {
      super(t, i, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = c ? Yf(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  mi = class extends Ir {
    constructor(t, r, n, o, i, s, a, c) {
      let u = o + "-" + n.id;
      super(t, r, n, i, s, a, c, u),
        (this.contentAttr = qD(u)),
        (this.hostAttr = YD(u));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, r) {
      let n = super.createElement(t, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  ZD = (() => {
    let t = class t extends gi {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, o, i) {
        return (
          n.addEventListener(o, i, !1), () => this.removeEventListener(n, o, i)
        );
      }
      removeEventListener(n, o, i) {
        return n.removeEventListener(o, i);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(ve));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  zf = ["alt", "control", "meta", "shift"],
  QD = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  XD = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  JD = (() => {
    let t = class t extends gi {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return t.parseEventName(n) != null;
      }
      addEventListener(n, o, i) {
        let s = t.parseEventName(o),
          a = t.eventCallback(s.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => In().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let o = n.toLowerCase().split("."),
          i = o.shift();
        if (o.length === 0 || !(i === "keydown" || i === "keyup")) return null;
        let s = t._normalizeKey(o.pop()),
          a = "",
          c = o.indexOf("code");
        if (
          (c > -1 && (o.splice(c, 1), (a = "code.")),
          zf.forEach((l) => {
            let d = o.indexOf(l);
            d > -1 && (o.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = i), (u.fullKey = a), u;
      }
      static matchEventFullKeyCode(n, o) {
        let i = QD[n.key] || n.key,
          s = "";
        return (
          o.indexOf("code.") > -1 && ((i = n.code), (s = "code.")),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === " " ? (i = "space") : i === "." && (i = "dot"),
              zf.forEach((a) => {
                if (a !== i) {
                  let c = XD[a];
                  c(n) && (s += a + ".");
                }
              }),
              (s += i),
              s === o)
        );
      }
      static eventCallback(n, o, i) {
        return (s) => {
          t.matchEventFullKeyCode(s, n) && i.runGuarded(() => o(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(ve));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function Zf(e, t) {
  return yf(m({ rootComponent: e }, KD(t)));
}
function KD(e) {
  return {
    appProviders: [...ow, ...(e?.providers ?? [])],
    platformProviders: rw,
  };
}
function ew() {
  tc.makeCurrent();
}
function tw() {
  return new tt();
}
function nw() {
  return wd(document), document;
}
var rw = [
  { provide: yt, useValue: xf },
  { provide: Ia, useValue: ew, multi: !0 },
  { provide: ve, useFactory: nw, deps: [] },
];
var ow = [
  { provide: Vo, useValue: "root" },
  { provide: tt, useFactory: tw, deps: [] },
  { provide: nc, useClass: ZD, multi: !0, deps: [ve, W, yt] },
  { provide: nc, useClass: JD, multi: !0, deps: [ve] },
  $f,
  Gf,
  Wf,
  { provide: Kn, useExisting: $f },
  { provide: En, useClass: $D, deps: [] },
  [],
];
var Qf = (() => {
  let t = class t {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)(_(ve));
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var N = "primary",
  jr = Symbol("RouteTitle"),
  uc = class {
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let r = this.params[t];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let r = this.params[t];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function _n(e) {
  return new uc(e);
}
function sw(e, t, r) {
  let n = r.path.split("/");
  if (
    n.length > e.length ||
    (r.pathMatch === "full" && (t.hasChildren() || n.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < n.length; i++) {
    let s = n[i],
      a = e[i];
    if (s.startsWith(":")) o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, n.length), posParams: o };
}
function aw(e, t) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; ++r) if (!Ze(e[r], t[r])) return !1;
  return !0;
}
function Ze(e, t) {
  let r = e ? lc(e) : void 0,
    n = t ? lc(t) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let o;
  for (let i = 0; i < r.length; i++)
    if (((o = r[i]), !nh(e[o], t[o]))) return !1;
  return !0;
}
function lc(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function nh(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let r = [...e].sort(),
      n = [...t].sort();
    return r.every((o, i) => n[i] === o);
  } else return e === t;
}
function rh(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function Et(e) {
  return Yi(e) ? e : dr(e) ? q(Promise.resolve(e)) : I(e);
}
var cw = { exact: ih, subset: sh },
  oh = { exact: uw, subset: lw, ignored: () => !0 };
function Xf(e, t, r) {
  return (
    cw[r.paths](e.root, t.root, r.matrixParams) &&
    oh[r.queryParams](e.queryParams, t.queryParams) &&
    !(r.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function uw(e, t) {
  return Ze(e, t);
}
function ih(e, t, r) {
  if (
    !Bt(e.segments, t.segments) ||
    !Di(e.segments, t.segments, r) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let n in t.children)
    if (!e.children[n] || !ih(e.children[n], t.children[n], r)) return !1;
  return !0;
}
function lw(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((r) => nh(e[r], t[r]))
  );
}
function sh(e, t, r) {
  return ah(e, t, t.segments, r);
}
function ah(e, t, r, n) {
  if (e.segments.length > r.length) {
    let o = e.segments.slice(0, r.length);
    return !(!Bt(o, r) || t.hasChildren() || !Di(o, r, n));
  } else if (e.segments.length === r.length) {
    if (!Bt(e.segments, r) || !Di(e.segments, r, n)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !sh(e.children[o], t.children[o], n)) return !1;
    return !0;
  } else {
    let o = r.slice(0, e.segments.length),
      i = r.slice(e.segments.length);
    return !Bt(e.segments, o) || !Di(e.segments, o, n) || !e.children[N]
      ? !1
      : ah(e.children[N], t, i, n);
  }
}
function Di(e, t, r) {
  return t.every((n, o) => oh[r](e[o].parameters, n.parameters));
}
var bt = class {
    constructor(t = new B([], {}), r = {}, n = null) {
      (this.root = t), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= _n(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return hw.serialize(this);
    }
  },
  B = class {
    constructor(t, r) {
      (this.segments = t),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return wi(this);
    }
  },
  Vt = class {
    constructor(t, r) {
      (this.path = t), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= _n(this.parameters)), this._parameterMap;
    }
    toString() {
      return uh(this);
    }
  };
function dw(e, t) {
  return Bt(e, t) && e.every((r, n) => Ze(r.parameters, t[n].parameters));
}
function Bt(e, t) {
  return e.length !== t.length ? !1 : e.every((r, n) => r.path === t[n].path);
}
function fw(e, t) {
  let r = [];
  return (
    Object.entries(e.children).forEach(([n, o]) => {
      n === N && (r = r.concat(t(o, n)));
    }),
    Object.entries(e.children).forEach(([n, o]) => {
      n !== N && (r = r.concat(t(o, n)));
    }),
    r
  );
}
var kc = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => new bi(), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  bi = class {
    parse(t) {
      let r = new fc(t);
      return new bt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(t) {
      let r = `/${Er(t.root, !0)}`,
        n = mw(t.queryParams),
        o = typeof t.fragment == "string" ? `#${pw(t.fragment)}` : "";
      return `${r}${n}${o}`;
    }
  },
  hw = new bi();
function wi(e) {
  return e.segments.map((t) => uh(t)).join("/");
}
function Er(e, t) {
  if (!e.hasChildren()) return wi(e);
  if (t) {
    let r = e.children[N] ? Er(e.children[N], !1) : "",
      n = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== N && n.push(`${o}:${Er(i, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = fw(e, (n, o) =>
      o === N ? [Er(e.children[N], !1)] : [`${o}:${Er(n, !1)}`]
    );
    return Object.keys(e.children).length === 1 && e.children[N] != null
      ? `${wi(e)}/${r[0]}`
      : `${wi(e)}/(${r.join("//")})`;
  }
}
function ch(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function vi(e) {
  return ch(e).replace(/%3B/gi, ";");
}
function pw(e) {
  return encodeURI(e);
}
function dc(e) {
  return ch(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Ci(e) {
  return decodeURIComponent(e);
}
function Jf(e) {
  return Ci(e.replace(/\+/g, "%20"));
}
function uh(e) {
  return `${dc(e.path)}${gw(e.parameters)}`;
}
function gw(e) {
  return Object.entries(e)
    .map(([t, r]) => `;${dc(t)}=${dc(r)}`)
    .join("");
}
function mw(e) {
  let t = Object.entries(e)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((o) => `${vi(r)}=${vi(o)}`).join("&")
        : `${vi(r)}=${vi(n)}`
    )
    .filter((r) => r);
  return t.length ? `?${t.join("&")}` : "";
}
var vw = /^[^\/()?;#]+/;
function ic(e) {
  let t = e.match(vw);
  return t ? t[0] : "";
}
var yw = /^[^\/()?;=#]+/;
function Dw(e) {
  let t = e.match(yw);
  return t ? t[0] : "";
}
var ww = /^[^=?&#]+/;
function Cw(e) {
  let t = e.match(ww);
  return t ? t[0] : "";
}
var bw = /^[^&#]+/;
function Iw(e) {
  let t = e.match(bw);
  return t ? t[0] : "";
}
var fc = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new B([], {})
        : new B([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (t.length > 0 || Object.keys(r).length > 0) && (n[N] = new B(t, r)),
      n
    );
  }
  parseSegment() {
    let t = ic(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new E(4009, !1);
    return this.capture(t), new Vt(Ci(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let r = Dw(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let o = ic(this.remaining);
      o && ((n = o), this.capture(n));
    }
    t[Ci(r)] = Ci(n);
  }
  parseQueryParam(t) {
    let r = Cw(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = Iw(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let o = Jf(r),
      i = Jf(n);
    if (t.hasOwnProperty(o)) {
      let s = t[o];
      Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
    } else t[o] = i;
  }
  parseParens(t) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = ic(this.remaining),
        o = this.remaining[n.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new E(4010, !1);
      let i;
      n.indexOf(":") > -1
        ? ((i = n.slice(0, n.indexOf(":"))), this.capture(i), this.capture(":"))
        : t && (i = N);
      let s = this.parseChildren();
      (r[i] = Object.keys(s).length === 1 ? s[N] : new B([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new E(4011, !1);
  }
};
function lh(e) {
  return e.segments.length > 0 ? new B([], { [N]: e }) : e;
}
function dh(e) {
  let t = {};
  for (let [n, o] of Object.entries(e.children)) {
    let i = dh(o);
    if (n === N && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (t[n] = i);
  }
  let r = new B(e.segments, t);
  return Ew(r);
}
function Ew(e) {
  if (e.numberOfChildren === 1 && e.children[N]) {
    let t = e.children[N];
    return new B(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function An(e) {
  return e instanceof bt;
}
function Mw(e, t, r = null, n = null) {
  let o = fh(e);
  return hh(o, t, r, n);
}
function fh(e) {
  let t;
  function r(i) {
    let s = {};
    for (let c of i.children) {
      let u = r(c);
      s[c.outlet] = u;
    }
    let a = new B(i.url, s);
    return i === e && (t = a), a;
  }
  let n = r(e.root),
    o = lh(n);
  return t ?? o;
}
function hh(e, t, r, n) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return sc(o, o, o, r, n);
  let i = Tw(t);
  if (i.toRoot()) return sc(o, o, new B([], {}), r, n);
  let s = Sw(i, o, e),
    a = s.processChildren
      ? Sr(s.segmentGroup, s.index, i.commands)
      : gh(s.segmentGroup, s.index, i.commands);
  return sc(o, s.segmentGroup, a, r, n);
}
function Ii(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function Ar(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function sc(e, t, r, n, o) {
  let i = {};
  n &&
    Object.entries(n).forEach(([c, u]) => {
      i[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
    });
  let s;
  e === t ? (s = r) : (s = ph(e, t, r));
  let a = lh(dh(s));
  return new bt(a, i, o);
}
function ph(e, t, r) {
  let n = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (n[o] = r) : (n[o] = ph(i, t, r));
    }),
    new B(e.segments, n)
  );
}
var Ei = class {
  constructor(t, r, n) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      t && n.length > 0 && Ii(n[0]))
    )
      throw new E(4003, !1);
    let o = n.find(Ar);
    if (o && o !== rh(n)) throw new E(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function Tw(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new Ei(!0, 0, e);
  let t = 0,
    r = !1,
    n = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, u]) => {
              a[c] = typeof u == "string" ? u.split("/") : u;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
        ? (i.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? t++
                : a != "" && o.push(a));
          }),
          o)
        : [...o, i];
    }, []);
  return new Ei(r, t, n);
}
var Sn = class {
  constructor(t, r, n) {
    (this.segmentGroup = t), (this.processChildren = r), (this.index = n);
  }
};
function Sw(e, t, r) {
  if (e.isAbsolute) return new Sn(t, !0, 0);
  if (!r) return new Sn(t, !1, NaN);
  if (r.parent === null) return new Sn(r, !0, 0);
  let n = Ii(e.commands[0]) ? 0 : 1,
    o = r.segments.length - 1 + n;
  return xw(r, o, e.numberOfDoubleDots);
}
function xw(e, t, r) {
  let n = e,
    o = t,
    i = r;
  for (; i > o; ) {
    if (((i -= o), (n = n.parent), !n)) throw new E(4005, !1);
    o = n.segments.length;
  }
  return new Sn(n, !1, o - i);
}
function _w(e) {
  return Ar(e[0]) ? e[0].outlets : { [N]: e };
}
function gh(e, t, r) {
  if (((e ??= new B([], {})), e.segments.length === 0 && e.hasChildren()))
    return Sr(e, t, r);
  let n = Aw(e, t, r),
    o = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < e.segments.length) {
    let i = new B(e.segments.slice(0, n.pathIndex), {});
    return (
      (i.children[N] = new B(e.segments.slice(n.pathIndex), e.children)),
      Sr(i, 0, o)
    );
  } else
    return n.match && o.length === 0
      ? new B(e.segments, {})
      : n.match && !e.hasChildren()
      ? hc(e, t, r)
      : n.match
      ? Sr(e, 0, o)
      : hc(e, t, r);
}
function Sr(e, t, r) {
  if (r.length === 0) return new B(e.segments, {});
  {
    let n = _w(r),
      o = {};
    if (
      Object.keys(n).some((i) => i !== N) &&
      e.children[N] &&
      e.numberOfChildren === 1 &&
      e.children[N].segments.length === 0
    ) {
      let i = Sr(e.children[N], t, r);
      return new B(e.segments, i.children);
    }
    return (
      Object.entries(n).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = gh(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        n[i] === void 0 && (o[i] = s);
      }),
      new B(e.segments, o)
    );
  }
}
function Aw(e, t, r) {
  let n = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (n >= r.length) return i;
    let s = e.segments[o],
      a = r[n];
    if (Ar(a)) break;
    let c = `${a}`,
      u = n < r.length - 1 ? r[n + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && u && typeof u == "object" && u.outlets === void 0) {
      if (!eh(c, u, s)) return i;
      n += 2;
    } else {
      if (!eh(c, {}, s)) return i;
      n++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: n };
}
function hc(e, t, r) {
  let n = e.segments.slice(0, t),
    o = 0;
  for (; o < r.length; ) {
    let i = r[o];
    if (Ar(i)) {
      let c = Nw(i.outlets);
      return new B(n, c);
    }
    if (o === 0 && Ii(r[0])) {
      let c = e.segments[t];
      n.push(new Vt(c.path, Kf(r[0]))), o++;
      continue;
    }
    let s = Ar(i) ? i.outlets[N] : `${i}`,
      a = o < r.length - 1 ? r[o + 1] : null;
    s && a && Ii(a)
      ? (n.push(new Vt(s, Kf(a))), (o += 2))
      : (n.push(new Vt(s, {})), o++);
  }
  return new B(n, {});
}
function Nw(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (t[r] = hc(new B([], {}), 0, n));
    }),
    t
  );
}
function Kf(e) {
  let t = {};
  return Object.entries(e).forEach(([r, n]) => (t[r] = `${n}`)), t;
}
function eh(e, t, r) {
  return e == r.path && Ze(t, r.parameters);
}
var xr = "imperative",
  ce = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(ce || {}),
  Re = class {
    constructor(t, r) {
      (this.id = t), (this.url = r);
    }
  },
  Nr = class extends Re {
    constructor(t, r, n = "imperative", o = null) {
      super(t, r),
        (this.type = ce.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ut = class extends Re {
    constructor(t, r, n) {
      super(t, r), (this.urlAfterRedirects = n), (this.type = ce.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Se = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(Se || {}),
  pc = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(pc || {}),
  It = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.reason = n),
        (this.code = o),
        (this.type = ce.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  $t = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.reason = n),
        (this.code = o),
        (this.type = ce.NavigationSkipped);
    }
  },
  Rr = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.error = n),
        (this.target = o),
        (this.type = ce.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Mi = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = ce.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  gc = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = ce.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  mc = class extends Re {
    constructor(t, r, n, o, i) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = ce.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  vc = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = ce.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  yc = class extends Re {
    constructor(t, r, n, o) {
      super(t, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = ce.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Dc = class {
    constructor(t) {
      (this.route = t), (this.type = ce.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  wc = class {
    constructor(t) {
      (this.route = t), (this.type = ce.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Cc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ce.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  bc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ce.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ic = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ce.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ec = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ce.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var Or = class {},
  Pr = class {
    constructor(t) {
      this.url = t;
    }
  };
var Mc = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new Ni()),
        (this.attachRef = null);
    }
  },
  Ni = (() => {
    let t = class t {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, o) {
        let i = this.getOrCreateContext(n);
        (i.outlet = o), this.contexts.set(n, i);
      }
      onChildOutletDestroyed(n) {
        let o = this.getContext(n);
        o && ((o.outlet = null), (o.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let o = this.getContext(n);
        return o || ((o = new Mc()), this.contexts.set(n, o)), o;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Ti = class {
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let r = this.pathFromRoot(t);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(t) {
      let r = Tc(t, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(t) {
      let r = Tc(t, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(t) {
      let r = Sc(t, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return Sc(t, this._root).map((r) => r.value);
    }
  };
function Tc(e, t) {
  if (e === t.value) return t;
  for (let r of t.children) {
    let n = Tc(e, r);
    if (n) return n;
  }
  return null;
}
function Sc(e, t) {
  if (e === t.value) return [t];
  for (let r of t.children) {
    let n = Sc(e, r);
    if (n.length) return n.unshift(t), n;
  }
  return [];
}
var Te = class {
  constructor(t, r) {
    (this.value = t), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Tn(e) {
  let t = {};
  return e && e.children.forEach((r) => (t[r.value.outlet] = r)), t;
}
var Si = class extends Ti {
  constructor(t, r) {
    super(t), (this.snapshot = r), jc(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function mh(e) {
  let t = Rw(e),
    r = new ee([new Vt("", {})]),
    n = new ee({}),
    o = new ee({}),
    i = new ee({}),
    s = new ee(""),
    a = new Qe(r, n, i, s, o, N, e, t.root);
  return (a.snapshot = t.root), new Si(new Te(a, []), t);
}
function Rw(e) {
  let t = {},
    r = {},
    n = {},
    o = "",
    i = new Fr([], t, n, o, r, N, e, null, {});
  return new xi("", new Te(i, []));
}
var Qe = class {
  constructor(t, r, n, o, i, s, a, c) {
    (this.urlSubject = t),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(x((u) => u[jr])) ?? I(void 0)),
      (this.url = t),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(x((t) => _n(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(x((t) => _n(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Lc(e, t, r = "emptyOnly") {
  let n,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (r === "always" ||
      o?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (n = {
          params: m(m({}, t.params), e.params),
          data: m(m({}, t.data), e.data),
          resolve: m(m(m(m({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (n = {
          params: m({}, e.params),
          data: m({}, e.data),
          resolve: m(m({}, e.data), e._resolvedData ?? {}),
        }),
    o && yh(o) && (n.resolve[jr] = o.title),
    n
  );
}
var Fr = class {
    get title() {
      return this.data?.[jr];
    }
    constructor(t, r, n, o, i, s, a, c, u) {
      (this.url = t),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = u);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= _n(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= _n(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${r}')`;
    }
  },
  xi = class extends Ti {
    constructor(t, r) {
      super(r), (this.url = t), jc(this, r);
    }
    toString() {
      return vh(this._root);
    }
  };
function jc(e, t) {
  (t.value._routerState = e), t.children.forEach((r) => jc(e, r));
}
function vh(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(vh).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function ac(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      r = e._futureSnapshot;
    (e.snapshot = r),
      Ze(t.queryParams, r.queryParams) ||
        e.queryParamsSubject.next(r.queryParams),
      t.fragment !== r.fragment && e.fragmentSubject.next(r.fragment),
      Ze(t.params, r.params) || e.paramsSubject.next(r.params),
      aw(t.url, r.url) || e.urlSubject.next(r.url),
      Ze(t.data, r.data) || e.dataSubject.next(r.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function xc(e, t) {
  let r = Ze(e.params, t.params) && dw(e.url, t.url),
    n = !e.parent != !t.parent;
  return r && !n && (!e.parent || xc(e.parent, t.parent));
}
function yh(e) {
  return typeof e.title == "string" || e.title === null;
}
var Vc = (() => {
    let t = class t {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = N),
          (this.activateEvents = new se()),
          (this.deactivateEvents = new se()),
          (this.attachEvents = new se()),
          (this.detachEvents = new se()),
          (this.parentContexts = p(Ni)),
          (this.location = p(ei)),
          (this.changeDetector = p(fr)),
          (this.environmentInjector = p(me)),
          (this.inputBinder = p(Bc, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: o, previousValue: i } = n.name;
          if (o) return;
          this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new E(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new E(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new E(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, o) {
        (this.activated = n),
          (this._activatedRoute = o),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, o) {
        if (this.isActivated) throw new E(4013, !1);
        this._activatedRoute = n;
        let i = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          u = new _c(n, c, i.injector);
        (this.activated = i.createComponent(a, {
          index: i.length,
          injector: u,
          environmentInjector: o ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵdir = sa({
        type: t,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Ho],
      }));
    let e = t;
    return e;
  })(),
  _c = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, r, n) {
      (this.route = t), (this.childContexts = r), (this.parent = n);
    }
    get(t, r) {
      return t === Qe
        ? this.route
        : t === Ni
        ? this.childContexts
        : this.parent.get(t, r);
    }
  },
  Bc = new A("");
function Ow(e, t, r) {
  let n = kr(e, t._root, r ? r._root : void 0);
  return new Si(n, t);
}
function kr(e, t, r) {
  if (r && e.shouldReuseRoute(t.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = t.value;
    let o = Pw(e, t, r);
    return new Te(n, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => kr(e, a))),
          s
        );
      }
    }
    let n = Fw(t.value),
      o = t.children.map((i) => kr(e, i));
    return new Te(n, o);
  }
}
function Pw(e, t, r) {
  return t.children.map((n) => {
    for (let o of r.children)
      if (e.shouldReuseRoute(n.value, o.value.snapshot)) return kr(e, n, o);
    return kr(e, n);
  });
}
function Fw(e) {
  return new Qe(
    new ee(e.url),
    new ee(e.params),
    new ee(e.queryParams),
    new ee(e.fragment),
    new ee(e.data),
    e.outlet,
    e.component,
    e
  );
}
var Dh = "ngNavigationCancelingError";
function wh(e, t) {
  let { redirectTo: r, navigationBehaviorOptions: n } = An(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = Ch(!1, Se.Redirect);
  return (o.url = r), (o.navigationBehaviorOptions = n), o;
}
function Ch(e, t) {
  let r = new Error(`NavigationCancelingError: ${e || ""}`);
  return (r[Dh] = !0), (r.cancellationCode = t), r;
}
function kw(e) {
  return bh(e) && An(e.url);
}
function bh(e) {
  return !!e && e[Dh];
}
var Lw = (() => {
  let t = class t {};
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [X],
      decls: 1,
      vars: 0,
      template: function (o, i) {
        o & 1 && z(0, "router-outlet");
      },
      dependencies: [Vc],
      encapsulation: 2,
    }));
  let e = t;
  return e;
})();
function jw(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = ja(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function Uc(e) {
  let t = e.children && e.children.map(Uc),
    r = t ? Z(m({}, e), { children: t }) : m({}, e);
  return (
    !r.component &&
      !r.loadComponent &&
      (t || r.loadChildren) &&
      r.outlet &&
      r.outlet !== N &&
      (r.component = Lw),
    r
  );
}
function Xe(e) {
  return e.outlet || N;
}
function Vw(e, t) {
  let r = e.filter((n) => Xe(n) === t);
  return r.push(...e.filter((n) => Xe(n) !== t)), r;
}
function Vr(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let r = t.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var Bw = (e, t, r, n) =>
    x(
      (o) => (
        new Ac(t, o.targetRouterState, o.currentRouterState, r, n).activate(e),
        o
      )
    ),
  Ac = class {
    constructor(t, r, n, o, i) {
      (this.routeReuseStrategy = t),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(t) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, t),
        ac(this.futureState.root),
        this.activateChildRoutes(r, n, t);
    }
    deactivateChildRoutes(t, r, n) {
      let o = Tn(r);
      t.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], n), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, n);
        });
    }
    deactivateRoutes(t, r, n) {
      let o = t.value,
        i = r ? r.value : null;
      if (o === i)
        if (o.component) {
          let s = n.getContext(o.outlet);
          s && this.deactivateChildRoutes(t, r, s.children);
        } else this.deactivateChildRoutes(t, r, n);
      else i && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(t, r) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, r)
        : this.deactivateRouteAndOutlet(t, r);
    }
    detachAndStoreRouteSubtree(t, r) {
      let n = r.getContext(t.value.outlet),
        o = n && t.value.component ? n.children : r,
        i = Tn(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, r) {
      let n = r.getContext(t.value.outlet),
        o = n && t.value.component ? n.children : r,
        i = Tn(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(t, r, n) {
      let o = Tn(r);
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], n),
          this.forwardEvent(new Ec(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new bc(t.value.snapshot));
    }
    activateRoutes(t, r, n) {
      let o = t.value,
        i = r ? r.value : null;
      if ((ac(o), o === i))
        if (o.component) {
          let s = n.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, r, s.children);
        } else this.activateChildRoutes(t, r, n);
      else if (o.component) {
        let s = n.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            ac(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else {
          let a = Vr(o.snapshot);
          (s.attachRef = null),
            (s.route = o),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
        }
      } else this.activateChildRoutes(t, null, n);
    }
  },
  _i = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  xn = class {
    constructor(t, r) {
      (this.component = t), (this.route = r);
    }
  };
function Uw(e, t, r) {
  let n = e._root,
    o = t ? t._root : null;
  return Mr(n, o, r, [n.value]);
}
function $w(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Rn(e, t) {
  let r = Symbol(),
    n = t.get(e, r);
  return n === r ? (typeof e == "function" && !hl(e) ? e : t.get(e)) : n;
}
function Mr(
  e,
  t,
  r,
  n,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = Tn(t);
  return (
    e.children.forEach((s) => {
      Hw(s, i[s.value.outlet], r, n.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => _r(a, r.getContext(s), o)),
    o
  );
}
function Hw(
  e,
  t,
  r,
  n,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = e.value,
    s = t ? t.value : null,
    a = r ? r.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = zw(s, i, i.routeConfig.runGuardsAndResolvers);
    c
      ? o.canActivateChecks.push(new _i(n))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? Mr(e, t, a ? a.children : null, n, o) : Mr(e, t, r, n, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new xn(a.outlet.component, s));
  } else
    s && _r(t, a, o),
      o.canActivateChecks.push(new _i(n)),
      i.component
        ? Mr(e, null, a ? a.children : null, n, o)
        : Mr(e, null, r, n, o);
  return o;
}
function zw(e, t, r) {
  if (typeof r == "function") return r(e, t);
  switch (r) {
    case "pathParamsChange":
      return !Bt(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !Bt(e.url, t.url) || !Ze(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !xc(e, t) || !Ze(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !xc(e, t);
  }
}
function _r(e, t, r) {
  let n = Tn(e),
    o = e.value;
  Object.entries(n).forEach(([i, s]) => {
    o.component
      ? t
        ? _r(s, t.children.getContext(i), r)
        : _r(s, null, r)
      : _r(s, t, r);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? r.canDeactivateChecks.push(new xn(t.outlet.component, o))
        : r.canDeactivateChecks.push(new xn(null, o))
      : r.canDeactivateChecks.push(new xn(null, o));
}
function Br(e) {
  return typeof e == "function";
}
function Ww(e) {
  return typeof e == "boolean";
}
function Gw(e) {
  return e && Br(e.canLoad);
}
function qw(e) {
  return e && Br(e.canActivate);
}
function Yw(e) {
  return e && Br(e.canActivateChild);
}
function Zw(e) {
  return e && Br(e.canDeactivate);
}
function Qw(e) {
  return e && Br(e.canMatch);
}
function Ih(e) {
  return e instanceof Ke || e?.name === "EmptyError";
}
var yi = Symbol("INITIAL_VALUE");
function Nn() {
  return Ce((e) =>
    so(e.map((t) => t.pipe(et(1), Ki(yi)))).pipe(
      x((t) => {
        for (let r of t)
          if (r !== !0) {
            if (r === yi) return yi;
            if (r === !1 || r instanceof bt) return r;
          }
        return !0;
      }),
      we((t) => t !== yi),
      et(1)
    )
  );
}
function Xw(e, t) {
  return te((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && i.length === 0
      ? I(Z(m({}, r), { guardsResult: !0 }))
      : Jw(s, n, o, e).pipe(
          te((a) => (a && Ww(a) ? Kw(n, i, e, t) : I(a))),
          x((a) => Z(m({}, r), { guardsResult: a }))
        );
  });
}
function Jw(e, t, r, n) {
  return q(e).pipe(
    te((o) => o0(o.component, o.route, r, t, n)),
    He((o) => o !== !0, !0)
  );
}
function Kw(e, t, r, n) {
  return q(t).pipe(
    dt((o) =>
      Jt(
        t0(o.route.parent, n),
        e0(o.route, n),
        r0(e, o.path, r),
        n0(e, o.route, r)
      )
    ),
    He((o) => o !== !0, !0)
  );
}
function e0(e, t) {
  return e !== null && t && t(new Ic(e)), I(!0);
}
function t0(e, t) {
  return e !== null && t && t(new Cc(e)), I(!0);
}
function n0(e, t, r) {
  let n = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!n || n.length === 0) return I(!0);
  let o = n.map((i) =>
    ao(() => {
      let s = Vr(t) ?? r,
        a = Rn(i, s),
        c = qw(a) ? a.canActivate(t, e) : rt(s, () => a(t, e));
      return Et(c).pipe(He());
    })
  );
  return I(o).pipe(Nn());
}
function r0(e, t, r) {
  let n = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => $w(s))
      .filter((s) => s !== null)
      .map((s) =>
        ao(() => {
          let a = s.guards.map((c) => {
            let u = Vr(s.node) ?? r,
              l = Rn(c, u),
              d = Yw(l) ? l.canActivateChild(n, e) : rt(u, () => l(n, e));
            return Et(d).pipe(He());
          });
          return I(a).pipe(Nn());
        })
      );
  return I(i).pipe(Nn());
}
function o0(e, t, r, n, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return I(!0);
  let s = i.map((a) => {
    let c = Vr(t) ?? o,
      u = Rn(a, c),
      l = Zw(u) ? u.canDeactivate(e, t, r, n) : rt(c, () => u(e, t, r, n));
    return Et(l).pipe(He());
  });
  return I(s).pipe(Nn());
}
function i0(e, t, r, n) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return I(!0);
  let i = o.map((s) => {
    let a = Rn(s, e),
      c = Gw(a) ? a.canLoad(t, r) : rt(e, () => a(t, r));
    return Et(c);
  });
  return I(i).pipe(Nn(), Eh(n));
}
function Eh(e) {
  return zi(
    ie((t) => {
      if (An(t)) throw wh(e, t);
    }),
    x((t) => t === !0)
  );
}
function s0(e, t, r, n) {
  let o = t.canMatch;
  if (!o || o.length === 0) return I(!0);
  let i = o.map((s) => {
    let a = Rn(s, e),
      c = Qw(a) ? a.canMatch(t, r) : rt(e, () => a(t, r));
    return Et(c);
  });
  return I(i).pipe(Nn(), Eh(n));
}
var Lr = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Ai = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Mn(e) {
  return Xt(new Lr(e));
}
function a0(e) {
  return Xt(new E(4e3, !1));
}
function c0(e) {
  return Xt(Ch(!1, Se.GuardRejected));
}
var Nc = class {
    constructor(t, r) {
      (this.urlSerializer = t), (this.urlTree = r);
    }
    lineralizeSegments(t, r) {
      let n = [],
        o = r.root;
      for (;;) {
        if (((n = n.concat(o.segments)), o.numberOfChildren === 0)) return I(n);
        if (o.numberOfChildren > 1 || !o.children[N]) return a0(t.redirectTo);
        o = o.children[N];
      }
    }
    applyRedirectCommands(t, r, n) {
      let o = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        t,
        n
      );
      if (r.startsWith("/")) throw new Ai(o);
      return o;
    }
    applyRedirectCreateUrlTree(t, r, n, o) {
      let i = this.createSegmentGroup(t, r.root, n, o);
      return new bt(
        i,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(t, r) {
      let n = {};
      return (
        Object.entries(t).forEach(([o, i]) => {
          if (typeof i == "string" && i.startsWith(":")) {
            let a = i.substring(1);
            n[o] = r[a];
          } else n[o] = i;
        }),
        n
      );
    }
    createSegmentGroup(t, r, n, o) {
      let i = this.createSegments(t, r.segments, n, o),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(t, c, n, o);
        }),
        new B(i, s)
      );
    }
    createSegments(t, r, n, o) {
      return r.map((i) =>
        i.path.startsWith(":")
          ? this.findPosParam(t, i, o)
          : this.findOrReturn(i, n)
      );
    }
    findPosParam(t, r, n) {
      let o = n[r.path.substring(1)];
      if (!o) throw new E(4001, !1);
      return o;
    }
    findOrReturn(t, r) {
      let n = 0;
      for (let o of r) {
        if (o.path === t.path) return r.splice(n), o;
        n++;
      }
      return t;
    }
  },
  Rc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function u0(e, t, r, n, o) {
  let i = $c(e, t, r);
  return i.matched
    ? ((n = jw(t, n)),
      s0(n, t, r, o).pipe(x((s) => (s === !0 ? i : m({}, Rc)))))
    : I(i);
}
function $c(e, t, r) {
  if (t.path === "**") return l0(r);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || r.length > 0)
      ? m({}, Rc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || sw)(r, e, t);
  if (!o) return m({}, Rc);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s =
    o.consumed.length > 0
      ? m(m({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: r.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function l0(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? rh(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function th(e, t, r, n) {
  return r.length > 0 && h0(e, r, n)
    ? {
        segmentGroup: new B(t, f0(n, new B(r, e.children))),
        slicedSegments: [],
      }
    : r.length === 0 && p0(e, r, n)
    ? {
        segmentGroup: new B(e.segments, d0(e, r, n, e.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new B(e.segments, e.children), slicedSegments: r };
}
function d0(e, t, r, n) {
  let o = {};
  for (let i of r)
    if (Ri(e, t, i) && !n[Xe(i)]) {
      let s = new B([], {});
      o[Xe(i)] = s;
    }
  return m(m({}, n), o);
}
function f0(e, t) {
  let r = {};
  r[N] = t;
  for (let n of e)
    if (n.path === "" && Xe(n) !== N) {
      let o = new B([], {});
      r[Xe(n)] = o;
    }
  return r;
}
function h0(e, t, r) {
  return r.some((n) => Ri(e, t, n) && Xe(n) !== N);
}
function p0(e, t, r) {
  return r.some((n) => Ri(e, t, n));
}
function Ri(e, t, r) {
  return (e.hasChildren() || t.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function g0(e, t, r, n) {
  return Xe(e) !== n && (n === N || !Ri(t, r, e)) ? !1 : $c(t, e, r).matched;
}
function m0(e, t, r) {
  return t.length === 0 && !e.children[r];
}
var Oc = class {};
function v0(e, t, r, n, o, i, s = "emptyOnly") {
  return new Pc(e, t, r, n, o, s, i).recognize();
}
var y0 = 31,
  Pc = class {
    constructor(t, r, n, o, i, s, a) {
      (this.injector = t),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Nc(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new E(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = th(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        x((r) => {
          let n = new Fr(
              [],
              Object.freeze({}),
              Object.freeze(m({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              N,
              this.rootComponentType,
              null,
              {}
            ),
            o = new Te(n, r),
            i = new xi("", o),
            s = Mw(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(i._root, null),
            { state: i, tree: s }
          );
        })
      );
    }
    match(t) {
      return this.processSegmentGroup(this.injector, this.config, t, N).pipe(
        lt((n) => {
          if (n instanceof Ai)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof Lr ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(t, r) {
      let n = t.value,
        o = Lc(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(o.params)),
        (n.data = Object.freeze(o.data)),
        t.children.forEach((i) => this.inheritParamsAndData(i, n));
    }
    processSegmentGroup(t, r, n, o) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(t, r, n)
        : this.processSegment(t, r, n, n.segments, o, !0).pipe(
            x((i) => (i instanceof Te ? [i] : []))
          );
    }
    processChildren(t, r, n) {
      let o = [];
      for (let i of Object.keys(n.children))
        i === "primary" ? o.unshift(i) : o.push(i);
      return q(o).pipe(
        dt((i) => {
          let s = n.children[i],
            a = Vw(r, i);
          return this.processSegmentGroup(t, a, s, i);
        }),
        Ji((i, s) => (i.push(...s), i)),
        ft(null),
        Xi(),
        te((i) => {
          if (i === null) return Mn(n);
          let s = Mh(i);
          return D0(s), I(s);
        })
      );
    }
    processSegment(t, r, n, o, i, s) {
      return q(r).pipe(
        dt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            r,
            a,
            n,
            o,
            i,
            s
          ).pipe(
            lt((c) => {
              if (c instanceof Lr) return I(null);
              throw c;
            })
          )
        ),
        He((a) => !!a),
        lt((a) => {
          if (Ih(a)) return m0(n, o, i) ? I(new Oc()) : Mn(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(t, r, n, o, i, s, a) {
      return g0(n, o, i, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, n, i, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(t, o, r, n, i, s)
          : Mn(o)
        : Mn(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, r, n, o, i, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: u,
        remainingSegments: l,
      } = $c(r, o, i);
      if (!a) return Mn(r);
      o.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > y0 && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, o.redirectTo, u);
      return this.applyRedirects
        .lineralizeSegments(o, d)
        .pipe(te((f) => this.processSegment(t, n, r, f.concat(l), s, !1)));
    }
    matchSegmentAgainstRoute(t, r, n, o, i) {
      let s = u0(r, n, o, t, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          Ce((a) =>
            a.matched
              ? ((t = n._injector ?? t),
                this.getChildConfig(t, n, o).pipe(
                  Ce(({ routes: c }) => {
                    let u = n._loadedInjector ?? t,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new Fr(
                        l,
                        f,
                        Object.freeze(m({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        C0(n),
                        Xe(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        b0(n)
                      ),
                      { segmentGroup: g, slicedSegments: C } = th(r, l, d, c);
                    if (C.length === 0 && g.hasChildren())
                      return this.processChildren(u, c, g).pipe(
                        x((v) => (v === null ? null : new Te(h, v)))
                      );
                    if (c.length === 0 && C.length === 0)
                      return I(new Te(h, []));
                    let b = Xe(n) === i;
                    return this.processSegment(u, c, g, C, b ? N : i, !0).pipe(
                      x((v) => new Te(h, v instanceof Te ? [v] : []))
                    );
                  })
                ))
              : Mn(r)
          )
        )
      );
    }
    getChildConfig(t, r, n) {
      return r.children
        ? I({ routes: r.children, injector: t })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? I({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : i0(t, r, n, this.urlSerializer).pipe(
              te((o) =>
                o
                  ? this.configLoader.loadChildren(t, r).pipe(
                      ie((i) => {
                        (r._loadedRoutes = i.routes),
                          (r._loadedInjector = i.injector);
                      })
                    )
                  : c0(r)
              )
            )
        : I({ routes: [], injector: t });
    }
  };
function D0(e) {
  e.sort((t, r) =>
    t.value.outlet === N
      ? -1
      : r.value.outlet === N
      ? 1
      : t.value.outlet.localeCompare(r.value.outlet)
  );
}
function w0(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function Mh(e) {
  let t = [],
    r = new Set();
  for (let n of e) {
    if (!w0(n)) {
      t.push(n);
      continue;
    }
    let o = t.find((i) => n.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...n.children), r.add(o)) : t.push(n);
  }
  for (let n of r) {
    let o = Mh(n.children);
    t.push(new Te(n.value, o));
  }
  return t.filter((n) => !r.has(n));
}
function C0(e) {
  return e.data || {};
}
function b0(e) {
  return e.resolve || {};
}
function I0(e, t, r, n, o, i) {
  return te((s) =>
    v0(e, t, r, n, s.extractedUrl, o, i).pipe(
      x(({ state: a, tree: c }) =>
        Z(m({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function E0(e, t) {
  return te((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: o },
    } = r;
    if (!o.length) return I(r);
    let i = new Set(o.map((c) => c.route)),
      s = new Set();
    for (let c of i) if (!s.has(c)) for (let u of Th(c)) s.add(u);
    let a = 0;
    return q(s).pipe(
      dt((c) =>
        i.has(c)
          ? M0(c, n, e, t)
          : ((c.data = Lc(c, c.parent, e).resolve), I(void 0))
      ),
      ie(() => a++),
      Kt(1),
      te((c) => (a === s.size ? I(r) : De))
    );
  });
}
function Th(e) {
  let t = e.children.map((r) => Th(r)).flat();
  return [e, ...t];
}
function M0(e, t, r, n) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !yh(o) && (i[jr] = o.title),
    T0(i, e, t, n).pipe(
      x(
        (s) => (
          (e._resolvedData = s), (e.data = Lc(e, e.parent, r).resolve), null
        )
      )
    )
  );
}
function T0(e, t, r, n) {
  let o = lc(e);
  if (o.length === 0) return I({});
  let i = {};
  return q(o).pipe(
    te((s) =>
      S0(e[s], t, r, n).pipe(
        He(),
        ie((a) => {
          i[s] = a;
        })
      )
    ),
    Kt(1),
    Qi(i),
    lt((s) => (Ih(s) ? De : Xt(s)))
  );
}
function S0(e, t, r, n) {
  let o = Vr(t) ?? n,
    i = Rn(e, o),
    s = i.resolve ? i.resolve(t, r) : rt(o, () => i(t, r));
  return Et(s);
}
function cc(e) {
  return Ce((t) => {
    let r = e(t);
    return r ? q(r).pipe(x(() => t)) : I(t);
  });
}
var Sh = (() => {
    let t = class t {
      buildTitle(n) {
        let o,
          i = n.root;
        for (; i !== void 0; )
          (o = this.getResolvedTitleForRoute(i) ?? o),
            (i = i.children.find((s) => s.outlet === N));
        return o;
      }
      getResolvedTitleForRoute(n) {
        return n.data[jr];
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => p(x0), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  x0 = (() => {
    let t = class t extends Sh {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let o = this.buildTitle(n);
        o !== void 0 && this.title.setTitle(o);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(Qf));
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Hc = new A("", { providedIn: "root", factory: () => ({}) }),
  zc = new A(""),
  _0 = (() => {
    let t = class t {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(Ha));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return I(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let o = Et(n.loadComponent()).pipe(
            x(xh),
            ie((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            xt(() => {
              this.componentLoaders.delete(n);
            })
          ),
          i = new Qt(o, () => new fe()).pipe(Zt());
        return this.componentLoaders.set(n, i), i;
      }
      loadChildren(n, o) {
        if (this.childrenLoaders.get(o)) return this.childrenLoaders.get(o);
        if (o._loadedRoutes)
          return I({ routes: o._loadedRoutes, injector: o._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(o);
        let s = A0(o, this.compiler, n, this.onLoadEndListener).pipe(
            xt(() => {
              this.childrenLoaders.delete(o);
            })
          ),
          a = new Qt(s, () => new fe()).pipe(Zt());
        return this.childrenLoaders.set(o, a), a;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function A0(e, t, r, n) {
  return Et(e.loadChildren()).pipe(
    x(xh),
    te((o) =>
      o instanceof tr || Array.isArray(o) ? I(o) : q(t.compileModuleAsync(o))
    ),
    x((o) => {
      n && n(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(r).injector),
            (s = i.get(zc, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Uc), injector: i }
      );
    })
  );
}
function N0(e) {
  return e && typeof e == "object" && "default" in e;
}
function xh(e) {
  return N0(e) ? e.default : e;
}
var Wc = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => p(R0), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  R0 = (() => {
    let t = class t {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, o) {
        return n;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  O0 = new A("");
var P0 = (() => {
  let t = class t {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new fe()),
        (this.transitionAbortSubject = new fe()),
        (this.configLoader = p(_0)),
        (this.environmentInjector = p(me)),
        (this.urlSerializer = p(kc)),
        (this.rootContexts = p(Ni)),
        (this.location = p(hr)),
        (this.inputBindingEnabled = p(Bc, { optional: !0 }) !== null),
        (this.titleStrategy = p(Sh)),
        (this.options = p(Hc, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = p(Wc)),
        (this.createViewTransition = p(O0, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => I(void 0)),
        (this.rootComponentType = null);
      let n = (i) => this.events.next(new Dc(i)),
        o = (i) => this.events.next(new wc(i));
      (this.configLoader.onLoadEndListener = o),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let o = ++this.navigationId;
      this.transitions?.next(Z(m(m({}, this.transitions.value), n), { id: o }));
    }
    setupNavigations(n, o, i) {
      return (
        (this.transitions = new ee({
          id: 0,
          currentUrlTree: o,
          currentRawUrl: o,
          extractedUrl: this.urlHandlingStrategy.extract(o),
          urlAfterRedirects: this.urlHandlingStrategy.extract(o),
          rawUrl: o,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: xr,
          restoredState: null,
          currentSnapshot: i.snapshot,
          targetSnapshot: null,
          currentRouterState: i,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          we((s) => s.id !== 0),
          x((s) =>
            Z(m({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          Ce((s) => {
            let a = !1,
              c = !1;
            return I(s).pipe(
              Ce((u) => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      "",
                      Se.SupersededByNewNavigation
                    ),
                    De
                  );
                (this.currentTransition = s),
                  (this.currentNavigation = {
                    id: u.id,
                    initialUrl: u.rawUrl,
                    extractedUrl: u.extractedUrl,
                    trigger: u.source,
                    extras: u.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? Z(m({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = u.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!l && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new $t(
                        u.id,
                        this.urlSerializer.serialize(u.rawUrl),
                        f,
                        pc.IgnoredSameUrlNavigation
                      )
                    ),
                    u.resolve(null),
                    De
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                  return I(u).pipe(
                    Ce((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Nr(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? De
                          : Promise.resolve(f)
                      );
                    }),
                    I0(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    ie((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = Z(
                          m({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new Mi(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: g,
                      restoredState: C,
                      extras: b,
                    } = u,
                    v = new Nr(f, this.urlSerializer.serialize(h), g, C);
                  this.events.next(v);
                  let re = mh(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      Z(m({}, u), {
                        targetSnapshot: re,
                        urlAfterRedirects: h,
                        extras: Z(m({}, b), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    I(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new $t(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        f,
                        pc.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    u.resolve(null),
                    De
                  );
                }
              }),
              ie((u) => {
                let l = new gc(
                  u.id,
                  this.urlSerializer.serialize(u.extractedUrl),
                  this.urlSerializer.serialize(u.urlAfterRedirects),
                  u.targetSnapshot
                );
                this.events.next(l);
              }),
              x(
                (u) => (
                  (this.currentTransition = s =
                    Z(m({}, u), {
                      guards: Uw(
                        u.targetSnapshot,
                        u.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              Xw(this.environmentInjector, (u) => this.events.next(u)),
              ie((u) => {
                if (((s.guardsResult = u.guardsResult), An(u.guardsResult)))
                  throw wh(this.urlSerializer, u.guardsResult);
                let l = new mc(
                  u.id,
                  this.urlSerializer.serialize(u.extractedUrl),
                  this.urlSerializer.serialize(u.urlAfterRedirects),
                  u.targetSnapshot,
                  !!u.guardsResult
                );
                this.events.next(l);
              }),
              we((u) =>
                u.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(u, "", Se.GuardRejected),
                    !1)
              ),
              cc((u) => {
                if (u.guards.canActivateChecks.length)
                  return I(u).pipe(
                    ie((l) => {
                      let d = new vc(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    Ce((l) => {
                      let d = !1;
                      return I(l).pipe(
                        E0(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        ie({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                l,
                                "",
                                Se.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    ie((l) => {
                      let d = new yc(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              cc((u) => {
                let l = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        ie((h) => {
                          d.component = h;
                        }),
                        x(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...l(h));
                  return f;
                };
                return so(l(u.targetSnapshot.root)).pipe(ft(null), et(1));
              }),
              cc(() => this.afterPreactivation()),
              Ce(() => {
                let { currentSnapshot: u, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    u.root,
                    l.root
                  );
                return d ? q(d).pipe(x(() => s)) : I(s);
              }),
              x((u) => {
                let l = Ow(
                  n.routeReuseStrategy,
                  u.targetSnapshot,
                  u.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    Z(m({}, u), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                );
              }),
              ie(() => {
                this.events.next(new Or());
              }),
              Bw(
                this.rootContexts,
                n.routeReuseStrategy,
                (u) => this.events.next(u),
                this.inputBindingEnabled
              ),
              et(1),
              ie({
                next: (u) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new Ut(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      u.targetRouterState.snapshot
                    ),
                    u.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              es(
                this.transitionAbortSubject.pipe(
                  ie((u) => {
                    throw u;
                  })
                )
              ),
              xt(() => {
                !a &&
                  !c &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Se.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              lt((u) => {
                if (((c = !0), bh(u)))
                  this.events.next(
                    new It(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u.message,
                      u.cancellationCode
                    )
                  ),
                    kw(u) ? this.events.next(new Pr(u.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Rr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(u));
                  } catch (l) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(l);
                  }
                }
                return De;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, o, i) {
      let s = new It(n.id, this.urlSerializer.serialize(n.extractedUrl), o, i);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function F0(e) {
  return e !== xr;
}
var k0 = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => p(L0), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Fc = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, r) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, r) {
      return t.routeConfig === r.routeConfig;
    }
  },
  L0 = (() => {
    let t = class t extends Fc {};
    (t.ɵfac = (() => {
      let n;
      return function (i) {
        return (n || (n = wa(t)))(i || t);
      };
    })()),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  _h = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: () => p(j0), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  j0 = (() => {
    let t = class t extends _h {
      constructor() {
        super(...arguments),
          (this.location = p(hr)),
          (this.urlSerializer = p(kc)),
          (this.options = p(Hc, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(Wc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new bt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = mh(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((o) => {
          o.type === "popstate" && n(o.url, o.state);
        });
      }
      handleRouterEvent(n, o) {
        if (n instanceof Nr) this.stateMemento = this.createStateMemento();
        else if (n instanceof $t) this.rawUrlTree = o.initialUrl;
        else if (n instanceof Mi) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !o.extras.skipLocationChange
          ) {
            let i = this.urlHandlingStrategy.merge(o.finalUrl, o.initialUrl);
            this.setBrowserUrl(i, o);
          }
        } else
          n instanceof Or
            ? ((this.currentUrlTree = o.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                o.finalUrl,
                o.initialUrl
              )),
              (this.routerState = o.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (o.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, o)))
            : n instanceof It &&
              (n.code === Se.GuardRejected || n.code === Se.NoDataFromResolver)
            ? this.restoreHistory(o)
            : n instanceof Rr
            ? this.restoreHistory(o, !0)
            : n instanceof Ut &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, o) {
        let i = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(i) || o.extras.replaceUrl) {
          let s = this.browserPageId,
            a = m(m({}, o.extras.state), this.generateNgRouterState(o.id, s));
          this.location.replaceState(i, "", a);
        } else {
          let s = m(
            m({}, o.extras.state),
            this.generateNgRouterState(o.id, this.browserPageId + 1)
          );
          this.location.go(i, "", s);
        }
      }
      restoreHistory(n, o = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let i = this.browserPageId,
            s = this.currentPageId - i;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (o && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, o) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: o }
          : { navigationId: n };
      }
    };
    (t.ɵfac = (() => {
      let n;
      return function (i) {
        return (n || (n = wa(t)))(i || t);
      };
    })()),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Tr = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(Tr || {});
function V0(e, t) {
  e.events
    .pipe(
      we(
        (r) =>
          r instanceof Ut ||
          r instanceof It ||
          r instanceof Rr ||
          r instanceof $t
      ),
      x((r) =>
        r instanceof Ut || r instanceof $t
          ? Tr.COMPLETE
          : (
              r instanceof It
                ? r.code === Se.Redirect ||
                  r.code === Se.SupersededByNewNavigation
                : !1
            )
          ? Tr.REDIRECTING
          : Tr.FAILED
      ),
      we((r) => r !== Tr.REDIRECTING),
      et(1)
    )
    .subscribe(() => {
      t();
    });
}
function B0(e) {
  throw e;
}
var U0 = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  $0 = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  On = (() => {
    let t = class t {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(si)),
          (this.stateManager = p(_h)),
          (this.options = p(Hc, { optional: !0 }) || {}),
          (this.pendingTasks = p(yn)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(P0)),
          (this.urlSerializer = p(kc)),
          (this.location = p(hr)),
          (this.urlHandlingStrategy = p(Wc)),
          (this._events = new fe()),
          (this.errorHandler = this.options.errorHandler || B0),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(k0)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(zc, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(Bc, { optional: !0 })),
          (this.eventsSubscription = new K()),
          (this.isNgZoneEnabled = p(W) instanceof W && W.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((o) => {
          try {
            let i = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (i !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(o, s),
                o instanceof It &&
                  o.code !== Se.Redirect &&
                  o.code !== Se.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (o instanceof Ut) this.navigated = !0;
              else if (o instanceof Pr) {
                let a = this.urlHandlingStrategy.merge(o.url, i.currentRawUrl),
                  c = {
                    info: i.extras.info,
                    skipLocationChange: i.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || F0(i.source),
                  };
                this.scheduleNavigation(a, xr, null, c, {
                  resolve: i.resolve,
                  reject: i.reject,
                  promise: i.promise,
                });
              }
            }
            z0(o) && this._events.next(o);
          } catch (i) {
            this.navigationTransitions.transitionAbortSubject.next(i);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              xr,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, o) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", o);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, o, i) {
        let s = { replaceUrl: !0 },
          a = i?.navigationId ? i : null;
        if (i) {
          let u = m({}, i);
          delete u.navigationId,
            delete u.ɵrouterPageId,
            Object.keys(u).length !== 0 && (s.state = u);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, o, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Uc)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, o = {}) {
        let {
            relativeTo: i,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: u,
          } = o,
          l = u ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = m(m({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = i ? i.snapshot : this.routerState.snapshot.root;
          f = fh(h);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return hh(f, n, d, l ?? null);
      }
      navigateByUrl(n, o = { skipLocationChange: !1 }) {
        let i = An(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
        return this.scheduleNavigation(s, xr, null, o);
      }
      navigate(n, o = { skipLocationChange: !1 }) {
        return H0(n), this.navigateByUrl(this.createUrlTree(n, o), o);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, o) {
        let i;
        if (
          (o === !0 ? (i = m({}, U0)) : o === !1 ? (i = m({}, $0)) : (i = o),
          An(n))
        )
          return Xf(this.currentUrlTree, n, i);
        let s = this.parseUrl(n);
        return Xf(this.currentUrlTree, s, i);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (o, [i, s]) => (s != null && (o[i] = s), o),
          {}
        );
      }
      scheduleNavigation(n, o, i, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, u, l;
        a
          ? ((c = a.resolve), (u = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              (c = f), (u = h);
            }));
        let d = this.pendingTasks.add();
        return (
          V0(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: o,
            restoredState: i,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: u,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function H0(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new E(4008, !1);
}
function z0(e) {
  return !(e instanceof Or) && !(e instanceof Pr);
}
var W0 = new A("");
function Ah(e, ...t) {
  return pn([
    { provide: zc, multi: !0, useValue: e },
    [],
    { provide: Qe, useFactory: G0, deps: [On] },
    { provide: ai, multi: !0, useFactory: q0 },
    t.map((r) => r.ɵproviders),
  ]);
}
function G0(e) {
  return e.routerState.root;
}
function q0() {
  let e = p(cr);
  return (t) => {
    let r = e.get(bn);
    if (t !== r.components[0]) return;
    let n = e.get(On),
      o = e.get(Y0);
    e.get(Z0) === 1 && n.initialNavigation(),
      e.get(Q0, null, R.Optional)?.setUpPreloading(),
      e.get(W0, null, R.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var Y0 = new A("", { factory: () => new fe() }),
  Z0 = new A("", { providedIn: "root", factory: () => 1 });
var Q0 = new A("");
var Nh = [
  {
    Title: "Double Indemnity",
    Year: "1944",
    Rated: "Approved",
    Released: "06 Jul 1944",
    Runtime: "107 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Billy Wilder",
    Writer: "Billy Wilder, Raymond Chandler, James M. Cain",
    Actors: "Fred MacMurray, Barbara Stanwyck, Edward G. Robinson",
    Plot: "A Los Angeles insurance representative lets an alluring housewife seduce him into a scheme of insurance fraud and murder that arouses the suspicion of his colleague, an insurance investigator.",
    Language: "English",
    Country: "United States",
    Awards: "Nominated for 7 Oscars. 2 wins & 9 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BOTdlNjgyZGUtOTczYi00MDdhLTljZmMtYTEwZmRiOWFkYjRhXkEyXkFqcGdeQXVyNDY2MTk1ODk@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.3/10" },
      { Source: "Rotten Tomatoes", Value: "97%" },
      { Source: "Metacritic", Value: "95/100" },
    ],
    Metascore: "95",
    imdbRating: "8.3",
    imdbVotes: "167,453",
    imdbID: "tt0036775",
    Type: "movie",
    DVD: "01 Oct 2014",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Maltese Falcon",
    Year: "1941",
    Rated: "Passed",
    Released: "18 Oct 1941",
    Runtime: "100 min",
    Genre: "Crime, Film-Noir, Mystery",
    Director: "John Huston",
    Writer: "John Huston, Dashiell Hammett",
    Actors: "Humphrey Bogart, Mary Astor, Gladys George",
    Plot: "San Francisco private detective Sam Spade takes on a case that involves him with three eccentric criminals, a gorgeous liar and their quest for a priceless statuette, with the stakes rising after his partner is murdered.",
    Language: "English",
    Country: "United States",
    Awards: "Nominated for 3 Oscars. 5 wins & 4 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZjIwNGM1ZTUtOThjYS00NDdiLTk2ZDYtNGY5YjJkNzliM2JjL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.0/10" },
      { Source: "Rotten Tomatoes", Value: "99%" },
      { Source: "Metacritic", Value: "97/100" },
    ],
    Metascore: "97",
    imdbRating: "8.0",
    imdbVotes: "166,216",
    imdbID: "tt0033870",
    Type: "movie",
    DVD: "19 May 2016",
    BoxOffice: "$18,180",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Touch of Evil",
    Year: "1958",
    Rated: "PG-13",
    Released: "23 Apr 1958",
    Runtime: "95 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Orson Welles",
    Writer: "Orson Welles, Whit Masterson, Franklin Coen",
    Actors: "Charlton Heston, Orson Welles, Janet Leigh",
    Plot: "A stark, perverse story of murder, kidnapping and police corruption in a Mexican border town.",
    Language: "English, Spanish",
    Country: "United States",
    Awards: "7 wins & 1 nomination",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BOTA1MjA3M2EtMmJjZS00OWViLTkwMTEtM2E5ZDk0NTAyNGJiXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.0/10" },
      { Source: "Rotten Tomatoes", Value: "95%" },
      { Source: "Metacritic", Value: "99/100" },
    ],
    Metascore: "99",
    imdbRating: "8.0",
    imdbVotes: "109,444",
    imdbID: "tt0052311",
    Type: "movie",
    DVD: "18 Mar 2014",
    BoxOffice: "$2,247,465",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Sunset Boulevard",
    Year: "1991",
    Rated: "N/A",
    Released: "N/A",
    Runtime: "8 min",
    Genre: "Short",
    Director: "Thomas Korschil",
    Writer: "N/A",
    Actors: "N/A",
    Plot: 'Sunset Boulevard is the attempt to simultaneously picture the two big, contradictory myths of U.S. America: the myth of unlimited individualism ("lonesome rider"), and the myth of the "melting pot". All kinds of people are all in ...',
    Language: "None",
    Country: "Austria",
    Awards: "N/A",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTg1NzE0MzM5OF5BMl5BanBnXkFtZTYwMTMyNjk5._V1_SX300.jpg",
    Ratings: [{ Source: "Internet Movie Database", Value: "8.3/10" }],
    Metascore: "N/A",
    imdbRating: "8.3",
    imdbVotes: "35",
    imdbID: "tt0158253",
    Type: "movie",
    DVD: "N/A",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Big Sleep",
    Year: "1946",
    Rated: "Passed",
    Released: "31 Aug 1946",
    Runtime: "114 min",
    Genre: "Crime, Film-Noir, Mystery",
    Director: "Howard Hawks",
    Writer: "William Faulkner, Leigh Brackett, Jules Furthman",
    Actors: "Humphrey Bogart, Lauren Bacall, John Ridgely",
    Plot: "Private detective Philip Marlowe is hired by a wealthy family. Before the complex case is over, he's seen murder, blackmail and what might be love.",
    Language: "English",
    Country: "United States",
    Awards: "2 wins",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjBmZGU2MTEtZmU5YS00ZTM3LTk4NmMtOWU4YWYyNmU4MTJjXkEyXkFqcGdeQXVyMTYwMTcxOTYy._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "96%" },
      { Source: "Metacritic", Value: "86/100" },
    ],
    Metascore: "86",
    imdbRating: "7.9",
    imdbVotes: "90,378",
    imdbID: "tt0038355",
    Type: "movie",
    DVD: "01 Sep 2008",
    BoxOffice: "$25,556",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Chinatown",
    Year: "1974",
    Rated: "R",
    Released: "20 Jun 1974",
    Runtime: "130 min",
    Genre: "Drama, Mystery, Thriller",
    Director: "Roman Polanski",
    Writer: "Robert Towne, Roman Polanski",
    Actors: "Jack Nicholson, Faye Dunaway, John Huston",
    Plot: "A private detective hired to expose an adulterer in 1930s Los Angeles finds himself caught up in a web of deceit, corruption, and murder.",
    Language: "English, Cantonese, Spanish",
    Country: "United States",
    Awards: "Won 1 Oscar. 21 wins & 24 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjJkMDZhYzItZTFhMi00ZGI4LThlNTAtZDNlYmEwNjFkNDYzXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.1/10" },
      { Source: "Rotten Tomatoes", Value: "98%" },
      { Source: "Metacritic", Value: "92/100" },
    ],
    Metascore: "92",
    imdbRating: "8.1",
    imdbVotes: "348,060",
    imdbID: "tt0071315",
    Type: "movie",
    DVD: "01 Aug 2013",
    BoxOffice: "$29,200,000",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Third Man",
    Year: "1949",
    Rated: "Approved",
    Released: "01 Feb 1950",
    Runtime: "93 min",
    Genre: "Film-Noir, Mystery, Thriller",
    Director: "Carol Reed",
    Writer: "Graham Greene, Orson Welles, Alexander Korda",
    Actors: "Orson Welles, Joseph Cotten, Alida Valli",
    Plot: "Pulp novelist Holly Martins travels to shadowy, postwar Vienna, only to find himself investigating the mysterious death of an old friend, Harry Lime.",
    Language: "English, German, Russian, French",
    Country: "United Kingdom",
    Awards: "Won 1 Oscar. 5 wins & 4 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYjE2OTdhMWUtOGJlMy00ZDViLWIzZjgtYjZkZGZmMDZjYmEyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.1/10" },
      { Source: "Rotten Tomatoes", Value: "99%" },
      { Source: "Metacritic", Value: "97/100" },
    ],
    Metascore: "97",
    imdbRating: "8.1",
    imdbVotes: "181,425",
    imdbID: "tt0041959",
    Type: "movie",
    DVD: "01 Sep 2009",
    BoxOffice: "$1,067,364",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Out of the Past",
    Year: "1947",
    Rated: "Approved",
    Released: "01 Dec 1947",
    Runtime: "97 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Jacques Tourneur",
    Writer: "Daniel Mainwaring, James M. Cain, Frank Fenton",
    Actors: "Robert Mitchum, Jane Greer, Kirk Douglas",
    Plot: "A private eye escapes his past to run a gas station in a small town, but his past catches up with him. Now he must return to the big city world of danger, corruption, double crosses, and duplicitous dames.",
    Language: "English, American Sign ",
    Country: "United States",
    Awards: "1 win",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDE0MjYxYmMtM2VhMC00MjhiLTg5NjItMDkzZGM5MGVlYjMxL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.0/10" },
      { Source: "Rotten Tomatoes", Value: "93%" },
      { Source: "Metacritic", Value: "85/100" },
    ],
    Metascore: "85",
    imdbRating: "8.0",
    imdbVotes: "40,450",
    imdbID: "tt0039689",
    Type: "movie",
    DVD: "01 Sep 2009",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Killers",
    Year: "1946",
    Rated: "Passed",
    Released: "30 Aug 1946",
    Runtime: "103 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Robert Siodmak",
    Writer: "Anthony Veiller, Ernest Hemingway, John Huston",
    Actors: "Burt Lancaster, Ava Gardner, Edmond O'Brien",
    Plot: "Hit men kill an unresisting victim, and investigator Reardon uncovers his past involvement with beautiful, deadly Kitty Collins.",
    Language: "English",
    Country: "United States",
    Awards: "Nominated for 4 Oscars. 3 wins & 4 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BOTNhNGE2ZTMtNTEyNS00OGU0LWJlN2ItNzgxZTFiZWQwOWYxXkEyXkFqcGdeQXVyMTY5Nzc4MDY@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.7/10" },
      { Source: "Rotten Tomatoes", Value: "100%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.7",
    imdbVotes: "23,580",
    imdbID: "tt0038669",
    Type: "movie",
    DVD: "30 Aug 2016",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Postman Always Rings Twice",
    Year: "1981",
    Rated: "R",
    Released: "20 Mar 1981",
    Runtime: "122 min",
    Genre: "Crime, Drama, Romance",
    Director: "Bob Rafelson",
    Writer: "David Mamet, James M. Cain",
    Actors: "Jack Nicholson, Jessica Lange, John Colicos",
    Plot: "The sensuous wife of a roadside diner proprietor and a rootless drifter begin a sordid, steamy affair and conspire to murder her Greek husband.",
    Language: "English, Greek",
    Country: "West Germany, United States",
    Awards: "1 win & 2 nominations",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDUyNmY3NDAtMzY3MC00YjgxLWEzMWMtODU3YjhkNTEzMGY2XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "6.6/10" },
      { Source: "Rotten Tomatoes", Value: "79%" },
      { Source: "Metacritic", Value: "61/100" },
    ],
    Metascore: "61",
    imdbRating: "6.6",
    imdbVotes: "25,686",
    imdbID: "tt0082934",
    Type: "movie",
    DVD: "19 Apr 2016",
    BoxOffice: "$12,376,625",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Night of the Hunter",
    Year: "1955",
    Rated: "Not Rated",
    Released: "27 Jul 1955",
    Runtime: "92 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Charles Laughton",
    Writer: "Davis Grubb, James Agee, Charles Laughton",
    Actors: "Robert Mitchum, Shelley Winters, Lillian Gish",
    Plot: "A self-proclaimed preacher marries a gullible widow whose young children are reluctant to tell him where their real dad hid the $10,000 he'd stolen in a robbery.",
    Language: "English",
    Country: "United States",
    Awards: "2 wins & 1 nomination",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDhjNzhmMTMtZTRkOC00NTdjLTg3N2ItZmQ1ZDU0NGY5OTk5XkEyXkFqcGdeQXVyNDY2MTk1ODk@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.0/10" },
      { Source: "Rotten Tomatoes", Value: "93%" },
      { Source: "Metacritic", Value: "97/100" },
    ],
    Metascore: "97",
    imdbRating: "8.0",
    imdbVotes: "96,661",
    imdbID: "tt0048424",
    Type: "movie",
    DVD: "16 Jan 2011",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Detour",
    Year: "1945",
    Rated: "Passed",
    Released: "25 Jan 1946",
    Runtime: "66 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Edgar G. Ulmer",
    Writer: "Martin Goldsmith, Martin Mooney",
    Actors: "Tom Neal, Ann Savage, Claudia Drake",
    Plot: "The life of Al Roberts, a pianist in a New York nightclub, turns into a nightmare when he decides to hitchhike to Los Angeles to visit his girlfriend.",
    Language: "English",
    Country: "United States",
    Awards: "1 win",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZDA5ZjIxMWItYTdlNC00ZGJmLTliYTctNWNhNDA1ZDQ2ZTQ1XkEyXkFqcGdeQXVyMTY5Nzc4MDY@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.3/10" },
      { Source: "Rotten Tomatoes", Value: "98%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.3",
    imdbVotes: "19,612",
    imdbID: "tt0037638",
    Type: "movie",
    DVD: "01 Feb 2016",
    BoxOffice: "$16,172",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "In a Lonely Place",
    Year: "1950",
    Rated: "Not Rated",
    Released: "01 Aug 1950",
    Runtime: "94 min",
    Genre: "Drama, Film-Noir, Mystery",
    Director: "Nicholas Ray",
    Writer: "Andrew Solt, Edmund H. North, Dorothy B. Hughes",
    Actors: "Humphrey Bogart, Gloria Grahame, Frank Lovejoy",
    Plot: "A potentially violent screenwriter is a murder suspect until his lovely neighbor clears him. However, she soon starts to have her doubts.",
    Language: "English",
    Country: "United States",
    Awards: "3 wins",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjRmZjcwZTQtYWY0ZS00ODAwLTg4YTktZDhlZDMwMTM1MGFkXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "96%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.9",
    imdbVotes: "35,161",
    imdbID: "tt0042593",
    Type: "movie",
    DVD: "25 Apr 2014",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Kiss Me Deadly",
    Year: "1955",
    Rated: "Not Rated",
    Released: "28 Apr 1955",
    Runtime: "106 min",
    Genre: "Crime, Film-Noir, Mystery",
    Director: "Robert Aldrich",
    Writer: "Mickey Spillane, A.I. Bezzerides",
    Actors: "Ralph Meeker, Albert Dekker, Paul Stewart",
    Plot: 'A doomed female hitchhiker pulls Mike Hammer into a deadly whirlpool of intrigue, revolving around a mysterious "great whatsit".',
    Language: "English, Italian, Spanish",
    Country: "United States",
    Awards: "1 win & 1 nomination",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BODAyMTQxMjg5Nl5BMl5BanBnXkFtZTcwNzUzNzA2NA@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.5/10" },
      { Source: "Rotten Tomatoes", Value: "98%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.5",
    imdbVotes: "21,885",
    imdbID: "tt0048261",
    Type: "movie",
    DVD: "N/A",
    BoxOffice: "$726,000",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Mildred Pierce",
    Year: "1945",
    Rated: "Approved",
    Released: "20 Oct 1945",
    Runtime: "111 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Michael Curtiz",
    Writer: "Ranald MacDougall, James M. Cain, William Faulkner",
    Actors: "Joan Crawford, Jack Carson, Zachary Scott",
    Plot: "A hard-working mother inches towards disaster as she divorces her husband and starts a successful restaurant business to support her spoiled daughter.",
    Language: "English, French",
    Country: "United States",
    Awards: "Won 1 Oscar. 3 wins & 6 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzljY2U2MDItYWE3Yi00OWE3LWEyMjQtMGNkZmJjNDE0NDJjXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "88%" },
      { Source: "Metacritic", Value: "88/100" },
    ],
    Metascore: "88",
    imdbRating: "7.9",
    imdbVotes: "28,659",
    imdbID: "tt0037913",
    Type: "movie",
    DVD: "31 Dec 2008",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Lady from Shanghai",
    Year: "1947",
    Rated: "Not Rated",
    Released: "14 Apr 1948",
    Runtime: "87 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Orson Welles",
    Writer: "Sherwood King, Orson Welles, William Castle",
    Actors: "Rita Hayworth, Orson Welles, Everett Sloane",
    Plot: "Fascinated by gorgeous Mrs. Bannister, seaman Michael O'Hara joins a bizarre yachting cruise, and ends up mired in a complex murder plot.",
    Language: "English, Cantonese",
    Country: "United States",
    Awards: "1 win",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNWZkNTYxZjQtN2IwZi00OGExLTg3ZDEtODNjMDFkN2Y5Y2NkL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.5/10" },
      { Source: "Rotten Tomatoes", Value: "85%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.5",
    imdbVotes: "32,954",
    imdbID: "tt0040525",
    Type: "movie",
    DVD: "01 Jan 2013",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "The Killing",
    Year: "2011\u20132014",
    Rated: "TV-14",
    Released: "03 Apr 2011",
    Runtime: "45 min",
    Genre: "Crime, Drama, Mystery",
    Director: "N/A",
    Writer: "Veena Sud",
    Actors: "Mireille Enos, Joel Kinnaman, Billy Campbell",
    Plot: "A police investigation, the saga of a grieving family, and a Seattle mayoral campaign all interlock after the body of 17-year-old Rosie Larsen is found in the trunk of a submerged car.",
    Language: "English",
    Country: "United States, Canada",
    Awards: "Nominated for 6 Primetime Emmys. 3 wins & 47 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTQ5MTUxMzU3Ml5BMl5BanBnXkFtZTgwMDU3NDYxMjE@._V1_SX300.jpg",
    Ratings: [{ Source: "Internet Movie Database", Value: "8.3/10" }],
    Metascore: "N/A",
    imdbRating: "8.3",
    imdbVotes: "122,764",
    imdbID: "tt1637727",
    Type: "series",
    totalSeasons: "4",
    Response: "True",
  },
  {
    Title: "Laura",
    Year: "1944",
    Rated: "Passed",
    Released: "01 Nov 1944",
    Runtime: "88 min",
    Genre: "Drama, Film-Noir, Mystery",
    Director: "Otto Preminger, Rouben Mamoulian",
    Writer: "Vera Caspary, Jay Dratler, Samuel Hoffenstein",
    Actors: "Gene Tierney, Dana Andrews, Clifton Webb",
    Plot: "A police detective falls in love with the woman whose murder he is investigating.",
    Language: "English",
    Country: "United States",
    Awards: "Won 1 Oscar. 5 wins & 4 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYjkxOGM5OTktNTRmZi00MjhlLWE2MDktNzY3NjY3NmRjNDUyXkEyXkFqcGdeQXVyNDY2MTk1ODk@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "100%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.9",
    imdbVotes: "51,186",
    imdbID: "tt0037008",
    Type: "movie",
    DVD: "01 Mar 2013",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Gilda",
    Year: "1946",
    Rated: "Approved",
    Released: "25 Apr 1946",
    Runtime: "110 min",
    Genre: "Drama, Film-Noir, Romance",
    Director: "Charles Vidor",
    Writer: "E.A. Ellington, Jo Eisinger, Marion Parsonnet",
    Actors: "Rita Hayworth, Glenn Ford, George Macready",
    Plot: "A small-time gambler hired to work in a Buenos Aires casino discovers his employer's new wife is his former lover.",
    Language: "English, Spanish, French, German",
    Country: "United States",
    Awards: "1 win & 1 nomination",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWUxMzViZTUtNTYxNy00YjY4LWJmMjYtMzNlOThjNjhiZmZkXkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.6/10" },
      { Source: "Rotten Tomatoes", Value: "90%" },
    ],
    Metascore: "N/A",
    imdbRating: "7.6",
    imdbVotes: "35,248",
    imdbID: "tt0038559",
    Type: "movie",
    DVD: "27 Jan 2015",
    BoxOffice: "N/A",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Strangers on a Train",
    Year: "1951",
    Rated: "PG",
    Released: "30 Jun 1951",
    Runtime: "101 min",
    Genre: "Crime, Drama, Film-Noir",
    Director: "Alfred Hitchcock",
    Writer: "Raymond Chandler, Czenzi Ormonde, Whitfield Cook",
    Actors: "Farley Granger, Robert Walker, Ruth Roman",
    Plot: "A psychopathic man tries to forcibly persuade a tennis star to agree to his theory that two strangers can get away with murder by submitting to his plan to kill the other's most-hated person.",
    Language: "English, French",
    Country: "United States",
    Awards: "Nominated for 1 Oscar. 3 wins & 2 nominations total",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNWJjOGM4NmEtNDE2YS00OGEyLTkwZWItMGM4YzdhZDZhMzNhXkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "7.9/10" },
      { Source: "Rotten Tomatoes", Value: "98%" },
      { Source: "Metacritic", Value: "88/100" },
    ],
    Metascore: "88",
    imdbRating: "7.9",
    imdbVotes: "140,615",
    imdbID: "tt0044079",
    Type: "movie",
    DVD: "15 Aug 2008",
    BoxOffice: "$26,597",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
  {
    Title: "Space Jam",
    Year: "1996",
    Rated: "PG",
    Released: "15 Nov 1996",
    Runtime: "88 min",
    Genre: "Animation, Adventure, Comedy",
    Director: "Joe Pytka",
    Writer: "Leo Benvenuti, Steve Rudnick, Timothy Harris",
    Actors: "Michael Jordan, Wayne Knight, Theresa Randle",
    Plot: "In a desperate attempt to win a basketball match and earn their freedom, the Looney Tunes seek the aid of retired basketball champion, Michael Jordan.",
    Language: "English",
    Country: "United States",
    Awards: "5 wins & 8 nominations",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYjA3ZmMwNTUtNGM2Ni00YjUyLWE5ZDYtY2Y4YzhmYzlhYWI2XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "6.5/10" },
      { Source: "Rotten Tomatoes", Value: "43%" },
      { Source: "Metacritic", Value: "59/100" },
    ],
    Metascore: "59",
    imdbRating: "6.5",
    imdbVotes: "213,443",
    imdbID: "tt0117705",
    Type: "movie",
    DVD: "15 Aug 2008",
    BoxOffice: "$90,594,962",
    Production: "N/A",
    Website: "N/A",
    Response: "True",
  },
];
var Je = class {
  setTitle(t) {
    return (this.title = t), this;
  }
  setYear(t) {
    return (this.year = t), this;
  }
  setRated(t) {
    return (this.rated = t), this;
  }
  setReleased(t) {
    return (this.released = t), this;
  }
  setRuntime(t) {
    return (this.runtime = t), this;
  }
  setGenre(t) {
    return (this.genre = t), this;
  }
  setDirector(t) {
    return (this.director = t), this;
  }
  setWriter(t) {
    return (this.writer = t), this;
  }
  setActors(t) {
    return (this.actors = t), this;
  }
  setPlot(t) {
    return (this.plot = t), this;
  }
  setLanguage(t) {
    return (this.language = t), this;
  }
  setCountry(t) {
    return (this.country = t), this;
  }
  setAwards(t) {
    return (this.awards = t), this;
  }
  setPoster(t) {
    return (this.poster = t), this;
  }
  setRatings(t) {
    return (this.ratings = t), this;
  }
  setMetascore(t) {
    return (this.metascore = t), this;
  }
  setImdbRating(t) {
    return (this.imdbRating = t), this;
  }
  setImdbVotes(t) {
    return (this.imdbVotes = t), this;
  }
  setImdbID(t) {
    return (this.imdbID = t), this;
  }
  setType(t) {
    return (this.type = t), this;
  }
  setDvd(t) {
    return (this.dvd = t), this;
  }
  setBoxOffice(t) {
    return (this.boxOffice = t), this;
  }
  setProduction(t) {
    return (this.production = t), this;
  }
  setWebsite(t) {
    return (this.website = t), this;
  }
  setResponse(t) {
    return (this.response = t), this;
  }
  getTitle() {
    return this.title;
  }
  getYear() {
    return this.year ?? "1970";
  }
  getRated() {
    return this.rated;
  }
  getReleased() {
    return this.released;
  }
  getRuntime() {
    return this.runtime;
  }
  getGenre() {
    return this.genre;
  }
  getDirector() {
    return this.director;
  }
  getWriter() {
    return this.writer;
  }
  getActors() {
    return this.actors;
  }
  getPlot() {
    return this.plot;
  }
  getLanguage() {
    return this.language;
  }
  getCountry() {
    return this.country;
  }
  getAwards() {
    return this.awards;
  }
  getPoster() {
    return this.poster;
  }
  getRatings() {
    return this.ratings;
  }
  getMetascore() {
    return this.metascore;
  }
  getImdbRating() {
    return this.imdbRating ?? "0";
  }
  getImdbVotes() {
    return this.imdbVotes;
  }
  getImdbID() {
    return this.imdbID;
  }
  getType() {
    return this.type;
  }
  getDvd() {
    return this.dvd;
  }
  getBoxOffice() {
    return this.boxOffice;
  }
  getProduction() {
    return this.production;
  }
  getWebsite() {
    return this.website;
  }
  getResponse() {
    return this.response;
  }
};
var Oi = (() => {
  let t = class t {
    constructor() {
      this.http = p(Xa);
    }
    urlBuilder(n) {
      return `https://www.omdbapi.com?apikey=8ea39b15&t=${n}`;
    }
    getMovieData(n) {
      return this.http.get(this.urlBuilder(n));
    }
    mockToMovieItems(n) {
      return n.map((o) =>
        new Je()
          .setTitle(o.Title)
          .setYear(o.Year)
          .setRated(o.Rated)
          .setReleased(o.Released)
          .setRuntime(o.Runtime)
          .setGenre(o.Genre)
          .setDirector(o.Director)
          .setWriter(o.Writer)
          .setActors(o.Actors)
          .setPlot(o.Plot)
          .setLanguage(o.Language)
          .setCountry(o.Country)
          .setPoster(o.Poster)
          .setResponse(o.Response)
          .setImdbRating(o.imdbRating)
          .setImdbVotes(o.imdbVotes)
          .setImdbID(o.imdbID)
          .setType(o.Type)
          .setDvd(o.DVD)
          .setBoxOffice(o.BoxOffice)
          .setProduction(o.Production)
          .setWebsite(o.Website)
      );
    }
    getHomePageMoviePopulation() {
      return I(this.mockToMovieItems(Nh));
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var Pn = (() => {
  let t = class t {
    constructor() {
      (this.dataService = p(Oi)),
        (this.router = p(On)),
        (this.searchString = ""),
        (this.movieSubject = new ee(new Je()));
    }
    search(n) {
      this.dataService.getMovieData(n).subscribe((o) => {
        o.Response === "False"
          ? this.router.navigate(["/error"])
          : (this.movieSubject.next(o),
            this.router.navigate(["/results"], {
              onSameUrlNavigation: "reload",
            }));
      });
    }
    getSelectedMovie() {
      return this.movieSubject.asObservable();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = y({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var Rh = (() => {
  let t = class t {
    constructor() {
      (this.placeholder = ""), (this.value = new se());
    }
    handleKeyEvent(n) {
      if (n.target) {
        let o = n.target;
        this.value.emit(o.value);
      }
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-text-input"]],
      inputs: { placeholder: "placeholder" },
      outputs: { value: "value" },
      standalone: !0,
      features: [X],
      decls: 1,
      vars: 1,
      consts: [["type", "text", 3, "input", "placeholder"]],
      template: function (o, i) {
        o & 1 &&
          (w(0, "input", 0),
          ae("input", function (a) {
            return i.handleKeyEvent(a);
          }),
          D()),
          o & 2 && $e("placeholder", i.placeholder);
      },
      styles: [
        "input[_ngcontent-%COMP%]{outline:0;border:0;display:block;width:100%;height:50px;border-radius:10px;padding:15px;font-size:22px;font-family:Montserrat;font-weight:600;box-shadow:0 10px 20px #00000026,0 10px 10px #0000001f;transition:border-color .33s ease;border:2px solid #ffffff}input[_ngcontent-%COMP%]:hover{border:2px solid #790d0d}",
      ],
      changeDetection: 0,
    }));
  let e = t;
  return e;
})();
function X0(e, t) {
  if ((e & 1 && z(0, "i"), e & 2)) {
    let r = Ye(2);
    Ba(r.iconString);
  }
}
function J0(e, t) {
  if (
    (e & 1 && (w(0, "a", 1)(1, "button"), F(2), Ee(3, X0, 1, 3, "i", 2), D()()),
    e & 2)
  ) {
    let r = Ye();
    Ua("href", r.url, Go),
      S(2),
      Y(" ", r.label, " "),
      S(),
      Me(3, r.iconString ? 3 : -1);
  }
}
function K0(e, t) {
  if ((e & 1 && z(0, "i"), e & 2)) {
    let r = Ye(2);
    Ba(r.iconString);
  }
}
function eC(e, t) {
  if (e & 1) {
    let r = Cn();
    w(0, "button", 3),
      ae("click", function () {
        mn(r);
        let o = Ye();
        return vn(o.buttonClick.emit());
      }),
      F(1),
      Ee(2, K0, 1, 3, "i", 2),
      D();
  }
  if (e & 2) {
    let r = Ye();
    S(), Y(" ", r.label, " "), S(), Me(2, r.iconString ? 2 : -1);
  }
}
var Pi = (() => {
  let t = class t {
    constructor() {
      (this.label = ""), (this.buttonClick = new se());
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-button"]],
      inputs: { iconString: "iconString", label: "label", url: "url" },
      outputs: { buttonClick: "buttonClick" },
      standalone: !0,
      features: [X],
      decls: 3,
      vars: 1,
      consts: [
        [1, "button-wrapper"],
        ["target", "_blank", 3, "href"],
        [3, "class"],
        [3, "click"],
      ],
      template: function (o, i) {
        o & 1 && (w(0, "div", 0), Ee(1, J0, 4, 3, "a", 1)(2, eC, 3, 2), D()),
          o & 2 && (S(), Me(1, i.url ? 1 : 2));
      },
      styles: [
        ".button-wrapper[_ngcontent-%COMP%]{display:block;text-align:center}.button-wrapper[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{outline:0;border:0;height:50px;border-radius:10px;padding-left:15px;padding-right:15px;font-size:22px;font-family:Montserrat;font-weight:600;background-color:#790d0d;color:#fff;box-shadow:0 14px 28px #00000040,0 10px 10px #00000038;transition:border-color .33s ease;border:2px solid #790d0d}.button-wrapper[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{border:2px solid #ffffff}",
      ],
      changeDetection: 0,
    }));
  let e = t;
  return e;
})();
var Oh = (() => {
  let t = class t {
    constructor() {
      (this.SearchService = p(Pn)),
        (this.router = p(On)),
        (this.movieQuery = "");
    }
    populateQuery(n) {
      this.movieQuery = n;
    }
    handleSearch() {
      this.SearchService.search(this.movieQuery);
    }
    goHome() {
      this.router.navigate(["/"]);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-header"]],
      standalone: !0,
      features: [X],
      decls: 9,
      vars: 3,
      consts: [
        [1, "row", "header"],
        [1, "col-4", "header__logo"],
        [
          "src",
          "./../../../movieapp/assets/moviezonelogo.png",
          "alt",
          "The movie zone!",
          3,
          "click",
        ],
        [1, "col-8", "header__search"],
        [1, "row"],
        [
          1,
          "col-md-6",
          "col-12",
          "d-flex",
          "align-items-center",
          "justify-content-center",
        ],
        [3, "value", "keyup.enter", "placeholder"],
        [3, "buttonClick", "label", "iconString"],
      ],
      template: function (o, i) {
        o & 1 &&
          (w(0, "div", 0)(1, "div", 1)(2, "img", 2),
          ae("click", function () {
            return i.goHome();
          }),
          D()(),
          w(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "app-text-input", 6),
          ae("value", function (a) {
            return i.populateQuery(a);
          })("keyup.enter", function () {
            return i.handleSearch();
          }),
          D()(),
          w(7, "div", 5)(8, "app-button", 7),
          ae("buttonClick", function () {
            return i.handleSearch();
          }),
          D()()()()()),
          o & 2 &&
            (S(6),
            $e("placeholder", "Find your movie..."),
            S(2),
            $e("label", "Search")("iconString", "bx bx-search-alt"));
      },
      dependencies: [Rh, Pi],
      styles: [
        ".header[_ngcontent-%COMP%]{height:220px}.header__logo[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;align-items:center}.header__logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:200px;width:200px;cursor:pointer}.header__search[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;align-items:center}.header__search[_ngcontent-%COMP%]   app-text-input[_ngcontent-%COMP%], .header__search[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]{min-width:180px}@media (max-width: 783px){.header__logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100px;width:100px}.header__search[_ngcontent-%COMP%]   app-text-input[_ngcontent-%COMP%], .header__search[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]{margin-top:10px;margin-bottom:10px}}",
      ],
      changeDetection: 0,
    }));
  let e = t;
  return e;
})();
var tC = () => [];
function nC(e, t) {
  e & 1 && z(0, "i", 4);
}
function rC(e, t) {
  e & 1 && z(0, "app-button", 6),
    e & 2 &&
      $e("label", "COME ON AND SLAM!")("url", "https://www.spacejam.com/1996/");
}
function oC(e, t) {
  if (e & 1) {
    let r = Cn();
    w(0, "app-button", 7),
      ae("buttonClick", function () {
        mn(r);
        let o = Ye();
        return vn(o.emitMovie.emit(o.movieItem));
      }),
      D();
  }
  e & 2 && $e("label", "View Details");
}
var Ph = (() => {
  let t = class t {
    constructor() {
      this.emitMovie = new se();
    }
    getRoundedImbdbRating() {
      let n = this.movieItem?.getImdbRating()
        ? parseInt(this.movieItem?.getImdbRating())
        : 0;
      return Math.floor(n);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-movie-tile"]],
      inputs: { movieItem: "movieItem" },
      outputs: { emitMovie: "emitMovie" },
      standalone: !0,
      features: [X],
      decls: 15,
      vars: 9,
      consts: [
        [1, "tile"],
        [1, "tile__subcontainer"],
        [1, "tile__content"],
        [1, "tile__content__rating"],
        [1, "bx", "bxs-star"],
        [1, "tile__actions"],
        [3, "label", "url"],
        [3, "buttonClick", "label"],
      ],
      template: function (o, i) {
        o & 1 &&
          (w(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h3"),
          F(4),
          D(),
          w(5, "p"),
          F(6),
          D(),
          w(7, "div", 3),
          Dn(8, nC, 1, 0, "i", 4, ti),
          w(10, "span"),
          F(11),
          D()()(),
          w(12, "div", 5),
          Ee(13, rC, 1, 2, "app-button", 6)(14, oC, 1, 1),
          D()()()),
          o & 2 &&
            (ri(
              "background-image: url('",
              i.movieItem == null ? null : i.movieItem.getPoster(),
              "');"
            ),
            S(4),
            oi(i.movieItem == null ? null : i.movieItem.getTitle()),
            S(2),
            oi(i.movieItem == null ? null : i.movieItem.getPlot()),
            S(2),
            wn(ii(8, tC).constructor(i.getRoundedImbdbRating())),
            S(3),
            $a(
              "(",
              i.movieItem == null ? null : i.movieItem.getYear(),
              ") (",
              i.getRoundedImbdbRating(),
              ") "
            ),
            S(2),
            Me(
              13,
              (i.movieItem == null ? null : i.movieItem.getTitle()) ===
                "Space Jam"
                ? 13
                : 14
            ));
      },
      dependencies: [Pi],
      styles: [
        ".tile[_ngcontent-%COMP%]{height:420px;border-radius:10px;overflow:hidden;cursor:pointer;background-position:center center;background-size:cover;padding:20px;transition:box-shadow .3s,opacity .3s;box-shadow:0 0 10px #0000001a}.tile[_ngcontent-%COMP%]:hover{box-shadow:0 0 20px #00000080}.tile__subcontainer[_ngcontent-%COMP%]{background:#ffffffe6;height:380px;border-radius:10px;padding:10px}.tile__content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{color:#790d0d;text-align:center;font-weight:600;height:60px}.tile__content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#0e0202;height:160px;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}.tile__content__rating[_ngcontent-%COMP%]{text-align:center;margin-bottom:10px}.tile__content__rating[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#790d0d;display:block}.tile__content__rating[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#790d0d}.tile__actions[_ngcontent-%COMP%]{text-align:center}",
      ],
    }));
  let e = t;
  return e;
})();
var iC = (e, t) => t.getTitle();
function sC(e, t) {
  e & 1 && z(0, "i", 5);
}
function aC(e, t) {
  e & 1 && z(0, "i", 6);
}
function cC(e, t) {
  e & 1 && z(0, "i", 5);
}
function uC(e, t) {
  e & 1 && z(0, "i", 6);
}
function lC(e, t) {
  e & 1 && z(0, "i", 5);
}
function dC(e, t) {
  e & 1 && z(0, "i", 6);
}
function fC(e, t) {
  if (e & 1) {
    let r = Cn();
    w(0, "div", 8)(1, "app-movie-tile", 9),
      ae("emitMovie", function (o) {
        mn(r);
        let i = Ye();
        return vn(i.search(o.getTitle()));
      }),
      D()();
  }
  if (e & 2) {
    let r = t.$implicit;
    S(), $e("movieItem", r);
  }
}
var Fh = (() => {
  let t = class t {
    constructor() {
      (this.activatedRoute = p(Qe)),
        (this.searchService = p(Pn)),
        (this.sort = {
          RATING: "rating",
          YEAR: "year",
          ALPHABETICALLY: "alphabetically",
        }),
        (this.sortOrder = { ASC: "asc", DESC: "desc" }),
        (this.topMoviesList = []),
        (this.sortingWorker = new Worker(
          new URL("worker-DMW2DN3Y.js", import.meta.url),
          { type: "module" }
        ));
    }
    ngOnInit() {
      (this.mockDataFromResolver$ = this.activatedRoute.data.pipe(
        x((n) => n.mainData)
      )),
        this.mockDataFromResolver$.subscribe((n) => {
          this.topMoviesList = n;
        });
    }
    search(n) {
      this.searchService.search(n ?? "");
    }
    sortBy(n) {
      switch (n) {
        case this.sort.RATING:
          (this.ratingSort =
            this.ratingSort === this.sortOrder.DESC || !this.ratingSort
              ? this.sortOrder.ASC
              : this.sortOrder.DESC),
            (this.yearSort = void 0),
            (this.alphaSort = void 0);
          break;
        case this.sort.YEAR:
          (this.yearSort =
            this.yearSort === this.sortOrder.DESC || !this.yearSort
              ? this.sortOrder.ASC
              : this.sortOrder.DESC),
            (this.alphaSort = void 0),
            (this.ratingSort = void 0);
          break;
        case this.sort.ALPHABETICALLY:
          (this.alphaSort =
            this.alphaSort === this.sortOrder.DESC || !this.alphaSort
              ? this.sortOrder.ASC
              : this.sortOrder.DESC),
            (this.yearSort = void 0),
            (this.ratingSort = void 0);
          break;
        default:
          break;
      }
      this.sortingWorker.postMessage({
        movies: this.topMoviesList,
        sortBy: n,
        rateDir: this.ratingSort,
        yearDir: this.yearSort,
        alphaDir: this.alphaSort,
      }),
        (this.sortingWorker.onmessage = ({ data: o }) => {
          this.topMoviesList = o.map((i) =>
            new Je()
              .setTitle(i.title)
              .setYear(i.year)
              .setRated(i.rated)
              .setReleased(i.released)
              .setRuntime(i.runtime)
              .setGenre(i.genre)
              .setDirector(i.director)
              .setWriter(i.writer)
              .setPlot(i.plot)
              .setLanguage(i.language)
              .setCountry(i.country)
              .setPoster(i.poster)
              .setImdbRating(i.imdbRating)
              .setImdbVotes(i.imdbVotes)
              .setImdbID(i.imdbID)
              .setType(i.type)
              .setDvd(i.dvd)
              .setBoxOffice(i.boxOffice)
              .setProduction(i.production)
              .setWebsite(i.website)
              .setResponse(i.response)
          );
        });
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-main"]],
      standalone: !0,
      features: [X],
      decls: 24,
      vars: 6,
      consts: [
        [1, "splash-welcome"],
        [1, "bx", "bxs-camera-movie"],
        [1, "row", "sort-row"],
        [1, "col-md-4", "col-12"],
        [3, "click"],
        [1, "bx", "bx-chevron-up"],
        [1, "bx", "bx-chevron-down"],
        [1, "row"],
        [1, "col-lg-4", "col-md-6", "col-12", "mb-4"],
        [3, "emitMovie", "movieItem"],
      ],
      template: function (o, i) {
        o & 1 &&
          (w(0, "main")(1, "div", 0)(2, "h2"),
          F(3, " Movies we're wild about right now! "),
          z(4, "i", 1),
          D()(),
          w(5, "div", 2)(6, "div", 3)(7, "span", 4),
          ae("click", function () {
            return i.sortBy(i.sort.ALPHABETICALLY);
          }),
          F(8, "Sort Alphabetically "),
          Ee(9, sC, 1, 0, "i", 5)(10, aC, 1, 0, "i", 6),
          D()(),
          w(11, "div", 3)(12, "span", 4),
          ae("click", function () {
            return i.sortBy(i.sort.RATING);
          }),
          F(13, "Sort by Rating "),
          Ee(14, cC, 1, 0, "i", 5)(15, uC, 1, 0, "i", 6),
          D()(),
          w(16, "div", 3)(17, "span", 4),
          ae("click", function () {
            return i.sortBy(i.sort.YEAR);
          }),
          F(18, "Sort by Year "),
          Ee(19, lC, 1, 0, "i", 5)(20, dC, 1, 0, "i", 6),
          D()()(),
          w(21, "div", 7),
          Dn(22, fC, 2, 1, "div", 8, iC),
          D()()),
          o & 2 &&
            (S(9),
            Me(9, i.alphaSort && i.alphaSort === i.sortOrder.ASC ? 9 : -1),
            S(),
            Me(10, i.alphaSort && i.alphaSort === i.sortOrder.DESC ? 10 : -1),
            S(4),
            Me(14, i.ratingSort && i.ratingSort === i.sortOrder.ASC ? 14 : -1),
            S(),
            Me(15, i.ratingSort && i.ratingSort === i.sortOrder.DESC ? 15 : -1),
            S(4),
            Me(19, i.yearSort && i.yearSort === i.sortOrder.ASC ? 19 : -1),
            S(),
            Me(20, i.yearSort && i.yearSort === i.sortOrder.DESC ? 20 : -1),
            S(2),
            wn(i.topMoviesList));
      },
      dependencies: [pr, Ph],
      styles: [
        "main[_ngcontent-%COMP%]{margin-top:120px}main[_ngcontent-%COMP%]   .splash-welcome[_ngcontent-%COMP%]{padding:10px;display:block;margin-bottom:15px;border-bottom:1px solid;color:#790d0d;text-align:center}main[_ngcontent-%COMP%]   .splash-welcome[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-weight:600}main[_ngcontent-%COMP%]   .sort-row[_ngcontent-%COMP%]{margin-bottom:15px}main[_ngcontent-%COMP%]   .sort-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;text-align:center;color:#790d0d;cursor:pointer}",
      ],
    }));
  let e = t;
  return e;
})();
var kh = (e, t) => p(Oi).getHomePageMoviePopulation();
var hC = () => [];
function pC(e, t) {
  e & 1 && z(0, "i", 5);
}
var Lh = (() => {
  let t = class t {
    constructor() {
      this.activatedRoute = p(Qe);
    }
    ngOnInit() {
      window.scrollTo(0, 0),
        this.activatedRoute.data.subscribe((n) => {
          let o = n.resultsData;
          this.selectedMovie = new Je()
            .setTitle(o.Title)
            .setYear(o.Year)
            .setRated(o.Rated)
            .setReleased(o.Released)
            .setRuntime(o.Runtime)
            .setGenre(o.Genre)
            .setDirector(o.Director)
            .setWriter(o.Writer)
            .setActors(o.Actors)
            .setAwards(o.Awards)
            .setRatings(o.Ratings)
            .setPlot(o.Plot)
            .setLanguage(o.Language)
            .setCountry(o.Country)
            .setPoster(o.Poster)
            .setResponse(o.Response)
            .setImdbRating(o.imdbRating)
            .setImdbVotes(o.imdbVotes)
            .setImdbID(o.imdbID)
            .setType(o.Type)
            .setDvd(o.DVD)
            .setBoxOffice(o.BoxOffice)
            .setProduction(o.Production)
            .setWebsite(o.Website);
        });
    }
    getRoundedImbdbRating() {
      let n = this.selectedMovie?.getImdbRating()
        ? parseInt(this.selectedMovie?.getImdbRating())
        : 0;
      return Math.floor(n);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-results"]],
      standalone: !0,
      features: [X],
      decls: 42,
      vars: 21,
      consts: [
        [1, "row", "movie-details"],
        [1, "col-md-6", "col-12", "movie-details__info"],
        [1, "movie-details__imdb"],
        [3, "href"],
        [1, "bx", "bx-right-top-arrow-circle"],
        [1, "bx", "bxs-star"],
        [1, "col-md-6", "col-12", "movie-details__banner"],
      ],
      template: function (o, i) {
        o & 1 &&
          (w(0, "main")(1, "div", 0)(2, "div", 1)(3, "h1"),
          F(4),
          D(),
          w(5, "div", 2)(6, "a", 3),
          F(7, "View in imdb "),
          D(),
          z(8, "i", 4),
          F(9, " ( "),
          Dn(10, pC, 1, 0, "i", 5, ti),
          F(12, " ) "),
          D(),
          w(13, "h2"),
          F(14),
          D(),
          w(15, "span"),
          F(16),
          D(),
          w(17, "span"),
          F(18),
          D(),
          w(19, "span"),
          F(20),
          D(),
          w(21, "span"),
          F(22),
          D(),
          w(23, "span"),
          F(24),
          D(),
          w(25, "span"),
          F(26),
          D(),
          w(27, "span"),
          F(28),
          D(),
          w(29, "span"),
          F(30),
          D(),
          w(31, "span"),
          F(32),
          D(),
          w(33, "span"),
          F(34),
          D(),
          w(35, "span"),
          F(36),
          D(),
          w(37, "span"),
          F(38),
          D(),
          w(39, "span"),
          F(40),
          D()(),
          z(41, "div", 6),
          D()()),
          o & 2 &&
            (S(4),
            Y(
              " ",
              i.selectedMovie == null ? null : i.selectedMovie.getTitle(),
              " "
            ),
            S(2),
            ni(
              "href",
              "http://www.imdb.com/title/",
              i.selectedMovie == null ? null : i.selectedMovie.getImdbID(),
              "",
              Go
            ),
            S(4),
            wn(ii(20, hC).constructor(i.getRoundedImbdbRating())),
            S(4),
            Y(
              " ",
              i.selectedMovie == null ? null : i.selectedMovie.getPlot(),
              " "
            ),
            S(2),
            Y(
              "Released in: ",
              i.selectedMovie == null ? null : i.selectedMovie.getYear(),
              ""
            ),
            S(2),
            Y(
              "Rated: ",
              i.selectedMovie == null ? null : i.selectedMovie.getRated(),
              ""
            ),
            S(2),
            Y(
              "Runtime: ",
              i.selectedMovie == null ? null : i.selectedMovie.getRuntime(),
              ""
            ),
            S(2),
            Y(
              "Genre: ",
              i.selectedMovie == null ? null : i.selectedMovie.getGenre(),
              ""
            ),
            S(2),
            Y(
              "Director: ",
              i.selectedMovie == null ? null : i.selectedMovie.getDirector(),
              ""
            ),
            S(2),
            Y(
              "Actors: ",
              i.selectedMovie == null ? null : i.selectedMovie.getActors(),
              ""
            ),
            S(2),
            Y(
              "Language(s): ",
              i.selectedMovie == null ? null : i.selectedMovie.getLanguage(),
              ""
            ),
            S(2),
            Y(
              "Country: ",
              i.selectedMovie == null ? null : i.selectedMovie.getCountry(),
              ""
            ),
            S(2),
            Y(
              "Box Office: ",
              i.selectedMovie == null ? null : i.selectedMovie.getBoxOffice(),
              ""
            ),
            S(2),
            Y(
              "Production: ",
              i.selectedMovie == null ? null : i.selectedMovie.getProduction(),
              ""
            ),
            S(2),
            Y(
              "Awards: ",
              i.selectedMovie == null ? null : i.selectedMovie.getAwards(),
              ""
            ),
            S(2),
            Y(
              "IMDB Votes: ",
              i.selectedMovie == null ? null : i.selectedMovie.getImdbVotes(),
              ""
            ),
            S(2),
            Y(
              "DVD: ",
              i.selectedMovie == null ? null : i.selectedMovie.getDvd(),
              ""
            ),
            S(),
            ri(
              "background-image: url('",
              i.selectedMovie == null ? null : i.selectedMovie.getPoster(),
              "');"
            ));
      },
      dependencies: [pr],
      styles: [
        "main[_ngcontent-%COMP%]{margin-top:120px}main[_ngcontent-%COMP%]   .movie-details__info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#790d0d;font-weight:600;margin-bottom:15px}main[_ngcontent-%COMP%]   .movie-details__info[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin-bottom:15px}main[_ngcontent-%COMP%]   .movie-details__info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;font-size:20px;margin-bottom:10px;color:#0e0202}main[_ngcontent-%COMP%]   .movie-details__imdb[_ngcontent-%COMP%]{color:#790d0d;display:flex;flex-direction:row}main[_ngcontent-%COMP%]   .movie-details__imdb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#790d0d;text-decoration:underline;font-size:20px;margin-bottom:10px;display:block}main[_ngcontent-%COMP%]   .movie-details__banner[_ngcontent-%COMP%]{background-repeat:no-repeat;background-position:center top;min-height:600px}",
      ],
    }));
  let e = t;
  return e;
})();
var jh = (e, t) => p(Pn).getSelectedMovie();
var Vh = (() => {
  let t = class t {};
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-error"]],
      standalone: !0,
      features: [X],
      decls: 7,
      vars: 0,
      consts: [
        [1, "row"],
        [1, "col-12", "error"],
      ],
      template: function (o, i) {
        o & 1 &&
          (w(0, "main")(1, "div", 0)(2, "div", 1)(3, "h1"),
          F(4, "Oops!"),
          D(),
          w(5, "h2"),
          F(6, "Something went wrong... Try again?"),
          D()()()());
      },
      styles: [
        "main[_ngcontent-%COMP%]{margin-top:120px}main[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%]{text-align:center}main[_ngcontent-%COMP%]   .error[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:66px;color:#790d0d;font-weight:600}",
      ],
    }));
  let e = t;
  return e;
})();
var Bh = [
  { path: "", component: Fh, resolve: { mainData: kh } },
  {
    path: "results",
    component: Lh,
    resolve: { resultsData: jh },
    runGuardsAndResolvers: "always",
  },
  { path: "error", component: Vh },
];
var Uh = { providers: [Ah(Bh), Bf(Uf())] };
var $h = (() => {
  let t = class t {};
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-footer"]],
      standalone: !0,
      features: [X],
      decls: 2,
      vars: 0,
      consts: [[1, "footer"]],
      template: function (o, i) {
        o & 1 &&
          (w(0, "div", 0),
          F(1, "Copyright (not really) 1970-2024 ACME Corp. (r)"),
          D());
      },
      styles: [
        ".footer[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;align-items:center;margin-top:200px;min-height:300px;background-color:#790d0d;color:#fff;font-size:22px;font-weight:600;font-family:Montserrat,sans-serif}",
      ],
    }));
  let e = t;
  return e;
})();
var Hh = (() => {
  let t = class t {
    constructor() {
      this.title = "movie-app";
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = Q({
      type: t,
      selectors: [["app-root"]],
      standalone: !0,
      features: [X],
      decls: 5,
      vars: 0,
      consts: [
        [1, "container-fluid", "layout"],
        [1, "container"],
      ],
      template: function (o, i) {
        o & 1 &&
          (w(0, "div", 0)(1, "div", 1),
          z(2, "app-header")(3, "router-outlet"),
          D()(),
          z(4, "app-footer"));
      },
      dependencies: [Vc, Oh, $h],
      styles: [
        '.layout[_ngcontent-%COMP%]{display:block;position:relative}.layout[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;width:100%;height:300px;z-index:-1;background-image:url("./media/moviezonebg-RWHHKIPR.jpg");background-repeat:no-repeat;background-position:center top;background-size:cover;border-bottom:60px solid #790d0d}',
      ],
    }));
  let e = t;
  return e;
})();
Zf(Hh, Uh).catch((e) => console.error(e));
