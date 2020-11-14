if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
        }

        F.prototype = o;
        return new F()
    }
}
var ua = {
    toString: function () {
        return navigator.userAgent
    }, test: function (s) {
        return this.toString().toLowerCase().indexOf(s.toLowerCase()) > -1
    }
};
ua.version = (ua.toString().toLowerCase().match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
ua.webkit = ua.test('webkit');
ua.gecko = ua.test('gecko') && !ua.webkit;
ua.opera = ua.test('opera');
ua.ie = ua.test('msie') && !ua.opera;
ua.ie6 = ua.ie && document.compatMode && typeof document.documentElement.style.maxHeight === 'undefined';
ua.ie7 = ua.ie && document.documentElement && typeof document.documentElement.style.maxHeight !== 'undefined' && typeof XDomainRequest === 'undefined';
ua.ie8 = ua.ie && typeof XDomainRequest !== 'undefined';
var domReady = function () {
    var fns = [];
    var init = function () {
        if (!arguments.callee.done) {
            arguments.callee.done = true;
            for (var i = 0; i < fns.length; i++) {
                fns[i]()
            }
        }
    };
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', init, false)
    }
    if (ua.ie) {
        (function () {
            try {
                document.documentElement.doScroll('left');
                document.body.length
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return
            }
            init()
        })();
        document.onreadystatechange = function () {
            if (document.readyState === 'complete') {
                document.onreadystatechange = null;
                init()
            }
        }
    }
    if (ua.webkit && document.readyState) {
        (function () {
            if (document.readyState !== 'loading') {
                init()
            } else {
                setTimeout(arguments.callee, 10)
            }
        })()
    }
    window.onload = init;
    return function (fn) {
        if (typeof fn === 'function') {
            if (init.done) {
                fn()
            } else {
                fns[fns.length] = fn
            }
        }
        return fn
    }
}();
var cssHelper = function () {
    var regExp = {
        BLOCKS: /[^\s{;][^{;]*\{(?:[^{}]*\{[^{}]*\}[^{}]*|[^{}]*)*\}/g,
        BLOCKS_INSIDE: /[^\s{][^{]*\{[^{}]*\}/g,
        DECLARATIONS: /[a-zA-Z\-]+[^;]*:[^;]+;/g,
        RELATIVE_URLS: /url\(['"]?([^\/\)'"][^:\)'"]+)['"]?\)/g,
        REDUNDANT_COMPONENTS: /(?:\/\*([^*\\\\]|\*(?!\/))+\*\/|@import[^;]+;|@-moz-document\s*url-prefix\(\)\s*{(([^{}])+{([^{}])+}([^{}])+)+})/g,
        REDUNDANT_WHITESPACE: /\s*(,|:|;|\{|\})\s*/g,
        WHITESPACE_IN_PARENTHESES: /\(\s*(\S*)\s*\)/g,
        MORE_WHITESPACE: /\s{2,}/g,
        FINAL_SEMICOLONS: /;\}/g,
        NOT_WHITESPACE: /\S+/g
    };
    var parsed, parsing = false;
    var waiting = [];
    var wait = function (fn) {
        if (typeof fn === 'function') {
            waiting[waiting.length] = fn
        }
    };
    var ready = function () {
        for (var i = 0; i < waiting.length; i++) {
            waiting[i](parsed)
        }
    };
    var events = {};
    var broadcast = function (n, v) {
        if (events[n]) {
            var listeners = events[n].listeners;
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i](v)
                }
            }
        }
    };
    var requestText = function (url, fnSuccess, fnFailure) {
        if (ua.ie && !window.XMLHttpRequest) {
            window.XMLHttpRequest = function () {
                return new ActiveXObject('Microsoft.XMLHTTP')
            }
        }
        if (!XMLHttpRequest) {
            return ''
        }
        var r = new XMLHttpRequest();
        try {
            r.open('get', url, true);
            r.setRequestHeader('X_REQUESTED_WITH', 'XMLHttpRequest')
        } catch (e) {
            fnFailure();
            return
        }
        var done = false;
        setTimeout(function () {
            done = true
        }, 5000);
        document.documentElement.style.cursor = 'progress';
        r.onreadystatechange = function () {
            if (r.readyState === 4 && !done) {
                if (!r.status && location.protocol === 'file:' || (r.status >= 200 && r.status < 300) || r.status === 304 || navigator.userAgent.indexOf('Safari') > -1 && typeof r.status === 'undefined') {
                    fnSuccess(r.responseText)
                } else {
                    fnFailure()
                }
                document.documentElement.style.cursor = '';
                r = null
            }
        };
        r.send('')
    };
    var sanitize = function (text) {
        text = text.replace(regExp.REDUNDANT_COMPONENTS, '');
        text = text.replace(regExp.REDUNDANT_WHITESPACE, '$1');
        text = text.replace(regExp.WHITESPACE_IN_PARENTHESES, '($1)');
        text = text.replace(regExp.MORE_WHITESPACE, ' ');
        text = text.replace(regExp.FINAL_SEMICOLONS, '}');
        return text
    };
    var objects = {
        stylesheet: function (el) {
            var o = {};
            var amqs = [], mqls = [], rs = [], rsw = [];
            var s = el.cssHelperText;
            var attr = el.getAttribute('media');
            if (attr) {
                var qts = attr.toLowerCase().split(',')
            } else {
                var qts = ['all']
            }
            for (var i = 0; i < qts.length; i++) {
                amqs[amqs.length] = objects.mediaQuery(qts[i], o)
            }
            var blocks = s.match(regExp.BLOCKS);
            if (blocks !== null) {
                for (var i = 0; i < blocks.length; i++) {
                    if (blocks[i].substring(0, 7) === '@media ') {
                        var mql = objects.mediaQueryList(blocks[i], o);
                        rs = rs.concat(mql.getRules());
                        mqls[mqls.length] = mql
                    } else {
                        rs[rs.length] = rsw[rsw.length] = objects.rule(blocks[i], o, null)
                    }
                }
            }
            o.element = el;
            o.getCssText = function () {
                return s
            };
            o.getAttrMediaQueries = function () {
                return amqs
            };
            o.getMediaQueryLists = function () {
                return mqls
            };
            o.getRules = function () {
                return rs
            };
            o.getRulesWithoutMQ = function () {
                return rsw
            };
            return o
        }, mediaQueryList: function (s, stsh) {
            var o = {};
            var idx = s.indexOf('{');
            var lt = s.substring(0, idx);
            s = s.substring(idx + 1, s.length - 1);
            var mqs = [], rs = [];
            var qts = lt.toLowerCase().substring(7).split(',');
            for (var i = 0; i < qts.length; i++) {
                mqs[mqs.length] = objects.mediaQuery(qts[i], o)
            }
            var rts = s.match(regExp.BLOCKS_INSIDE);
            if (rts !== null) {
                for (i = 0; i < rts.length; i++) {
                    rs[rs.length] = objects.rule(rts[i], stsh, o)
                }
            }
            o.type = 'mediaQueryList';
            o.getMediaQueries = function () {
                return mqs
            };
            o.getRules = function () {
                return rs
            };
            o.getListText = function () {
                return lt
            };
            o.getCssText = function () {
                return s
            };
            return o
        }, mediaQuery: function (s, listOrSheet) {
            s = s || '';
            var mql, stsh;
            if (listOrSheet.type === 'mediaQueryList') {
                mql = listOrSheet
            } else {
                stsh = listOrSheet
            }
            var not = false, type;
            var expr = [];
            var valid = true;
            var tokens = s.match(regExp.NOT_WHITESPACE);
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (!type && (token === 'not' || token === 'only')) {
                    if (token === 'not') {
                        not = true
                    }
                } else if (!type) {
                    type = token
                } else if (token.charAt(0) === '(') {
                    var pair = token.substring(1, token.length - 1).split(':');
                    expr[expr.length] = {mediaFeature: pair[0], value: pair[1] || null}
                }
            }
            return {
                getQueryText: function () {
                    return s
                }, getAttrStyleSheet: function () {
                    return stsh || null
                }, getList: function () {
                    return mql || null
                }, getValid: function () {
                    return valid
                }, getNot: function () {
                    return not
                }, getMediaType: function () {
                    return type
                }, getExpressions: function () {
                    return expr
                }
            }
        }, rule: function (s, stsh, mql) {
            var o = {};
            var idx = s.indexOf('{');
            var st = s.substring(0, idx);
            var ss = st.split(',');
            var ds = [];
            var dts = s.substring(idx + 1, s.length - 1).split(';');
            for (var i = 0; i < dts.length; i++) {
                ds[ds.length] = objects.declaration(dts[i], o)
            }
            o.getStylesheet = function () {
                return stsh || null
            };
            o.getMediaQueryList = function () {
                return mql || null
            };
            o.getSelectors = function () {
                return ss
            };
            o.getSelectorText = function () {
                return st
            };
            o.getDeclarations = function () {
                return ds
            };
            o.getPropertyValue = function (n) {
                for (var i = 0; i < ds.length; i++) {
                    if (ds[i].getProperty() === n) {
                        return ds[i].getValue()
                    }
                }
                return null
            };
            return o
        }, declaration: function (s, r) {
            var idx = s.indexOf(':');
            var p = s.substring(0, idx);
            var v = s.substring(idx + 1);
            return {
                getRule: function () {
                    return r || null
                }, getProperty: function () {
                    return p
                }, getValue: function () {
                    return v
                }
            }
        }
    };
    var parseText = function (el) {
        if (typeof el.cssHelperText !== 'string') {
            return
        }
        var o = {stylesheet: null, mediaQueryLists: [], rules: [], selectors: {}, declarations: [], properties: {}};
        var stsh = o.stylesheet = objects.stylesheet(el);
        var mqls = o.mediaQueryLists = stsh.getMediaQueryLists();
        var ors = o.rules = stsh.getRules();
        var oss = o.selectors;
        var collectSelectors = function (r) {
            var ss = r.getSelectors();
            for (var i = 0; i < ss.length; i++) {
                var n = ss[i];
                if (!oss[n]) {
                    oss[n] = []
                }
                oss[n][oss[n].length] = r
            }
        };
        for (i = 0; i < ors.length; i++) {
            collectSelectors(ors[i])
        }
        var ods = o.declarations;
        for (i = 0; i < ors.length; i++) {
            ods = o.declarations = ods.concat(ors[i].getDeclarations())
        }
        var ops = o.properties;
        for (i = 0; i < ods.length; i++) {
            var n = ods[i].getProperty();
            if (!ops[n]) {
                ops[n] = []
            }
            ops[n][ops[n].length] = ods[i]
        }
        el.cssHelperParsed = o;
        parsed[parsed.length] = el;
        return o
    };
    var parseEmbedded = function (el, s) {
        return;
        el.cssHelperText = sanitize(s || el.innerHTML);
        return parseText(el)
    };
    var parse = function () {
        parsing = true;
        parsed = [];
        var linked = [];
        var finish = function () {
            for (var i = 0; i < linked.length; i++) {
                parseText(linked[i])
            }
            var styles = document.getElementsByTagName('style');
            for (i = 0; i < styles.length; i++) {
                parseEmbedded(styles[i])
            }
            parsing = false;
            ready()
        };
        var links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.getAttribute('rel').indexOf('style') > -1 && link.href && link.href.length !== 0 && !link.disabled) {
                linked[linked.length] = link
            }
        }
        if (linked.length > 0) {
            var c = 0;
            var checkForFinish = function () {
                c++;
                if (c === linked.length) {
                    finish()
                }
            };
            var processLink = function (link) {
                var href = link.href;
                requestText(href, function (text) {
                    text = sanitize(text).replace(regExp.RELATIVE_URLS, 'url(' + href.substring(0, href.lastIndexOf('/')) + '/$1)');
                    link.cssHelperText = text;
                    checkForFinish()
                }, checkForFinish)
            };
            for (i = 0; i < linked.length; i++) {
                processLink(linked[i])
            }
        } else {
            finish()
        }
    };
    var types = {
        stylesheets: 'array',
        mediaQueryLists: 'array',
        rules: 'array',
        selectors: 'object',
        declarations: 'array',
        properties: 'object'
    };
    var collections = {
        stylesheets: null,
        mediaQueryLists: null,
        rules: null,
        selectors: null,
        declarations: null,
        properties: null
    };
    var addToCollection = function (name, v) {
        if (collections[name] !== null) {
            if (types[name] === 'array') {
                return (collections[name] = collections[name].concat(v))
            } else {
                var c = collections[name];
                for (var n in v) {
                    if (v.hasOwnProperty(n)) {
                        if (!c[n]) {
                            c[n] = v[n]
                        } else {
                            c[n] = c[n].concat(v[n])
                        }
                    }
                }
                return c
            }
        }
    };
    var collect = function (name) {
        collections[name] = (types[name] === 'array') ? [] : {};
        for (var i = 0; i < parsed.length; i++) {
            var pname = name === 'stylesheets' ? 'stylesheet' : name;
            addToCollection(name, parsed[i].cssHelperParsed[pname])
        }
        return collections[name]
    };
    var getViewportSize = function (d) {
        if (typeof window.innerWidth != 'undefined') {
            return window['inner' + d]
        } else if (typeof document.documentElement !== 'undefined' && typeof document.documentElement.clientWidth !== 'undefined' && document.documentElement.clientWidth != 0) {
            return document.documentElement['client' + d]
        }
    };
    return {
        addStyle: function (s, mediaTypes, process) {
            var el;
            var styleElId = 'css-mediaqueries-js';
            var styleMedia = '';
            var styleEl = document.getElementById(styleElId);
            if (mediaTypes && mediaTypes.length > 0) {
                styleMedia = mediaTypes.join(',');
                styleElId += styleMedia
            }
            if (null !== styleEl) {
                el = styleEl
            } else {
                el = document.createElement('style');
                el.setAttribute('type', 'text/css');
                el.setAttribute('id', styleElId);
                el.setAttribute('media', styleMedia);
                document.getElementsByTagName('head')[0].appendChild(el)
            }
            if (el.styleSheet) {
                el.styleSheet.cssText += s
            } else {
                el.appendChild(document.createTextNode(s))
            }
            el.addedWithCssHelper = true;
            if (typeof process === 'undefined' || process === true) {
                cssHelper.parsed(function (parsed) {
                    var o = parseEmbedded(el, s);
                    for (var n in o) {
                        if (o.hasOwnProperty(n)) {
                            addToCollection(n, o[n])
                        }
                    }
                    broadcast('newStyleParsed', el)
                })
            } else {
                el.parsingDisallowed = true
            }
            return el
        }, removeStyle: function (el) {
            if (el.parentNode) return el.parentNode.removeChild(el)
        }, parsed: function (fn) {
            if (parsing) {
                wait(fn)
            } else {
                if (typeof parsed !== 'undefined') {
                    if (typeof fn === 'function') {
                        fn(parsed)
                    }
                } else {
                    wait(fn);
                    parse()
                }
            }
        }, stylesheets: function (fn) {
            cssHelper.parsed(function (parsed) {
                fn(collections.stylesheets || collect('stylesheets'))
            })
        }, mediaQueryLists: function (fn) {
            cssHelper.parsed(function (parsed) {
                fn(collections.mediaQueryLists || collect('mediaQueryLists'))
            })
        }, rules: function (fn) {
            cssHelper.parsed(function (parsed) {
                fn(collections.rules || collect('rules'))
            })
        }, selectors: function (fn) {
            cssHelper.parsed(function (parsed) {
                fn(collections.selectors || collect('selectors'))
            })
        }, declarations: function (fn) {
            cssHelper.parsed(function (parsed) {
                fn(collections.declarations || collect('declarations'))
            })
        }, properties: function (fn) {
            cssHelper.parsed(function (parsed) {
                fn(collections.properties || collect('properties'))
            })
        }, broadcast: broadcast, addListener: function (n, fn) {
            if (typeof fn === 'function') {
                if (!events[n]) {
                    events[n] = {listeners: []}
                }
                events[n].listeners[events[n].listeners.length] = fn
            }
        }, removeListener: function (n, fn) {
            if (typeof fn === 'function' && events[n]) {
                var ls = events[n].listeners;
                for (var i = 0; i < ls.length; i++) {
                    if (ls[i] === fn) {
                        ls.splice(i, 1);
                        i -= 1
                    }
                }
            }
        }, getViewportWidth: function () {
            return getViewportSize('Width')
        }, getViewportHeight: function () {
            return getViewportSize('Height')
        }
    }
}();
domReady(function enableCssMediaQueries() {
    var meter;
    var regExp = {
        LENGTH_UNIT: /[0-9]+(em|ex|px|in|cm|mm|pt|pc)$/,
        RESOLUTION_UNIT: /[0-9]+(dpi|dpcm)$/,
        ASPECT_RATIO: /^[0-9]+\/[0-9]+$/,
        ABSOLUTE_VALUE: /^[0-9]*(\.[0-9]+)*$/
    };
    var styles = [];
    var nativeSupport = function () {
        var id = 'css3-mediaqueries-test';
        var el = document.createElement('div');
        el.id = id;
        var style = cssHelper.addStyle('@media all and (width) { #' + id + ' { width: 1px !important; } }', [], false);
        document.body.appendChild(el);
        var ret = el.offsetWidth === 1;
        style.parentNode.removeChild(style);
        el.parentNode.removeChild(el);
        nativeSupport = function () {
            return ret
        };
        return ret
    };
    var createMeter = function () {
        meter = document.createElement('div');
        meter.style.cssText = 'position:absolute;top:-9999em;left:-9999em;margin:0;border:none;padding:0;width:1em;font-size:1em;';
        document.body.appendChild(meter);
        if (meter.offsetWidth !== 16) {
            meter.style.fontSize = 16 / meter.offsetWidth + 'em'
        }
        meter.style.width = ''
    };
    var measure = function (value) {
        meter.style.width = value;
        var amount = meter.offsetWidth;
        meter.style.width = '';
        return amount
    };
    var testMediaFeature = function (feature, value) {
        var l = feature.length;
        var min = (feature.substring(0, 4) === 'min-');
        var max = (!min && feature.substring(0, 4) === 'max-');
        if (value !== null) {
            var valueType;
            var amount;
            if (regExp.LENGTH_UNIT.exec(value)) {
                valueType = 'length';
                amount = measure(value)
            } else if (regExp.RESOLUTION_UNIT.exec(value)) {
                valueType = 'resolution';
                amount = parseInt(value, 10);
                var unit = value.substring((amount + '').length)
            } else if (regExp.ASPECT_RATIO.exec(value)) {
                valueType = 'aspect-ratio';
                amount = value.split('/')
            } else if (regExp.ABSOLUTE_VALUE) {
                valueType = 'absolute';
                amount = value
            } else {
                valueType = 'unknown'
            }
        }
        var width, height;
        if ('device-width' === feature.substring(l - 12, l)) {
            width = screen.width;
            if (value !== null) {
                if (valueType === 'length') {
                    return ((min && width >= amount) || (max && width < amount) || (!min && !max && width === amount))
                } else {
                    return false
                }
            } else {
                return width > 0
            }
        } else if ('device-height' === feature.substring(l - 13, l)) {
            height = screen.height;
            if (value !== null) {
                if (valueType === 'length') {
                    return ((min && height >= amount) || (max && height < amount) || (!min && !max && height === amount))
                } else {
                    return false
                }
            } else {
                return height > 0
            }
        } else if ('width' === feature.substring(l - 5, l)) {
            width = document.documentElement.clientWidth || document.body.clientWidth;
            if (value !== null) {
                if (valueType === 'length') {
                    return ((min && width >= amount) || (max && width < amount) || (!min && !max && width === amount))
                } else {
                    return false
                }
            } else {
                return width > 0
            }
        } else if ('height' === feature.substring(l - 6, l)) {
            height = document.documentElement.clientHeight || document.body.clientHeight;
            if (value !== null) {
                if (valueType === 'length') {
                    return ((min && height >= amount) || (max && height < amount) || (!min && !max && height === amount))
                } else {
                    return false
                }
            } else {
                return height > 0
            }
        } else if ('orientation' === feature.substring(l - 11, l)) {
            width = document.documentElement.clientWidth || document.body.clientWidth;
            height = document.documentElement.clientHeight || document.body.clientHeight;
            if (valueType === 'absolute') {
                return (amount === 'portrait') ? (width <= height) : (width > height)
            } else {
                return false
            }
        } else if ('aspect-ratio' === feature.substring(l - 12, l)) {
            width = document.documentElement.clientWidth || document.body.clientWidth;
            height = document.documentElement.clientHeight || document.body.clientHeight;
            var curRatio = width / height;
            var ratio = amount[1] / amount[0];
            if (valueType === 'aspect-ratio') {
                return ((min && curRatio >= ratio) || (max && curRatio < ratio) || (!min && !max && curRatio === ratio))
            } else {
                return false
            }
        } else if ('device-aspect-ratio' === feature.substring(l - 19, l)) {
            return valueType === 'aspect-ratio' && screen.width * amount[1] === screen.height * amount[0]
        } else if ('color-index' === feature.substring(l - 11, l)) {
            var colors = Math.pow(2, screen.colorDepth);
            if (value !== null) {
                if (valueType === 'absolute') {
                    return ((min && colors >= amount) || (max && colors < amount) || (!min && !max && colors === amount))
                } else {
                    return false
                }
            } else {
                return colors > 0
            }
        } else if ('color' === feature.substring(l - 5, l)) {
            var color = screen.colorDepth;
            if (value !== null) {
                if (valueType === 'absolute') {
                    return ((min && color >= amount) || (max && color < amount) || (!min && !max && color === amount))
                } else {
                    return false
                }
            } else {
                return color > 0
            }
        } else if ('resolution' === feature.substring(l - 10, l)) {
            var res;
            if (unit === 'dpcm') {
                res = measure('1cm')
            } else {
                res = measure('1in')
            }
            if (value !== null) {
                if (valueType === 'resolution') {
                    return ((min && res >= amount) || (max && res < amount) || (!min && !max && res === amount))
                } else {
                    return false
                }
            } else {
                return res > 0
            }
        } else {
            return false
        }
    };
    var testMediaQuery = function (mq) {
        var test = mq.getValid();
        var expressions = mq.getExpressions();
        var l = expressions.length;
        if (l > 0) {
            for (var i = 0; i < l && test; i++) {
                test = testMediaFeature(expressions[i].mediaFeature, expressions[i].value)
            }
            var not = mq.getNot();
            return (test && !not || not && !test)
        }
        return test
    };
    var testMediaQueryList = function (mql, ts) {
        var mqs = mql.getMediaQueries();
        var t = {};
        for (var i = 0; i < mqs.length; i++) {
            var type = mqs[i].getMediaType();
            if (mqs[i].getExpressions().length === 0) {
                continue
            }
            var typeAllowed = true;
            if (type !== 'all' && ts && ts.length > 0) {
                typeAllowed = false;
                for (var j = 0; j < ts.length; j++) {
                    if (ts[j] === type) {
                        typeAllowed = true
                    }
                }
            }
            if (typeAllowed && testMediaQuery(mqs[i])) {
                t[type] = true
            }
        }
        var s = [], c = 0;
        for (var n in t) {
            if (t.hasOwnProperty(n)) {
                if (c > 0) {
                    s[c++] = ','
                }
                s[c++] = n
            }
        }
        if (s.length > 0) {
            styles[styles.length] = cssHelper.addStyle('@media ' + s.join('') + '{' + mql.getCssText() + '}', ts, false)
        }
    };
    var testMediaQueryLists = function (mqls, ts) {
        for (var i = 0; i < mqls.length; i++) {
            testMediaQueryList(mqls[i], ts)
        }
    };
    var testStylesheet = function (stsh) {
        var amqs = stsh.getAttrMediaQueries();
        var allPassed = false;
        var t = {};
        for (var i = 0; i < amqs.length; i++) {
            if (testMediaQuery(amqs[i])) {
                t[amqs[i].getMediaType()] = amqs[i].getExpressions().length > 0
            }
        }
        var ts = [], tswe = [];
        for (var n in t) {
            if (t.hasOwnProperty(n)) {
                ts[ts.length] = n;
                if (t[n]) {
                    tswe[tswe.length] = n
                }
                if (n === 'all') {
                    allPassed = true
                }
            }
        }
        if (tswe.length > 0) {
            styles[styles.length] = cssHelper.addStyle(stsh.getCssText(), tswe, false)
        }
        var mqls = stsh.getMediaQueryLists();
        if (allPassed) {
            testMediaQueryLists(mqls)
        } else {
            testMediaQueryLists(mqls, ts)
        }
    };
    var testStylesheets = function (stshs) {
        for (var i = 0; i < stshs.length; i++) {
            testStylesheet(stshs[i])
        }
        if (ua.ie) {
            document.documentElement.style.display = 'block';
            setTimeout(function () {
                document.documentElement.style.display = ''
            }, 0);
            setTimeout(function () {
                cssHelper.broadcast('cssMediaQueriesTested')
            }, 100)
        } else {
            cssHelper.broadcast('cssMediaQueriesTested')
        }
    };
    var test = function () {
        for (var i = 0; i < styles.length; i++) {
            cssHelper.removeStyle(styles[i])
        }
        styles = [];
        cssHelper.stylesheets(testStylesheets)
    };
    var scrollbarWidth = 0;
    var checkForResize = function () {
        var cvpw = cssHelper.getViewportWidth();
        var cvph = cssHelper.getViewportHeight();
        if (ua.ie) {
            var el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.top = '-9999em';
            el.style.overflow = 'scroll';
            document.body.appendChild(el);
            scrollbarWidth = el.offsetWidth - el.clientWidth;
            document.body.removeChild(el)
        }
        var timer;
        var resizeHandler = function () {
            var vpw = cssHelper.getViewportWidth();
            var vph = cssHelper.getViewportHeight();
            if (Math.abs(vpw - cvpw) > scrollbarWidth || Math.abs(vph - cvph) > scrollbarWidth) {
                cvpw = vpw;
                cvph = vph;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    if (!nativeSupport()) {
                        test()
                    } else {
                        cssHelper.broadcast('cssMediaQueriesTested')
                    }
                }, 500)
            }
        };
        window.onresize = function () {
            var x = window.onresize || function () {
            };
            return function () {
                x();
                resizeHandler()
            }
        }()
    };
    var docEl = document.documentElement;
    docEl.style.marginLeft = '-32767px';
    setTimeout(function () {
        docEl.style.marginLeft = ''
    }, 5000);
    return function () {
        if (!nativeSupport()) {
            cssHelper.addListener('newStyleParsed', function (el) {
                testStylesheet(el.cssHelperParsed.stylesheet)
            });
            cssHelper.addListener('cssMediaQueriesTested', function () {
                if (ua.ie) {
                    docEl.style.width = '1px'
                }
                setTimeout(function () {
                    docEl.style.width = '';
                    docEl.style.marginLeft = ''
                }, 0);
                cssHelper.removeListener('cssMediaQueriesTested', arguments.callee)
            });
            createMeter();
            test()
        } else {
            docEl.style.marginLeft = ''
        }
        checkForResize()
    }
}());
try {
    document.execCommand('BackgroundImageCache', false, true)
} catch (e) {
}
(function (e, t) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(t)
    } else if (typeof exports === "object") {
        module.exports = t()
    } else {
        e.returnExports = t()
    }
})(this, function () {
    var e = Function.call;
    var t = Object.prototype;
    var r = e.bind(t.hasOwnProperty);
    var n = e.bind(t.propertyIsEnumerable);
    var o = e.bind(t.toString);
    var i;
    var c;
    var f;
    var a;
    var l = r(t, "__defineGetter__");
    if (l) {
        i = e.bind(t.__defineGetter__);
        c = e.bind(t.__defineSetter__);
        f = e.bind(t.__lookupGetter__);
        a = e.bind(t.__lookupSetter__)
    }
    var u = function isPrimitive(e) {
        return e == null || typeof e !== "object" && typeof e !== "function"
    };
    if (!Object.getPrototypeOf) {
        Object.getPrototypeOf = function getPrototypeOf(e) {
            var r = e.__proto__;
            if (r || r === null) {
                return r
            } else if (o(e.constructor) === "[object Function]") {
                return e.constructor.prototype
            } else if (e instanceof Object) {
                return t
            } else {
                return null
            }
        }
    }
    var p = function doesGetOwnPropertyDescriptorWork(e) {
        try {
            e.sentinel = 0;
            return Object.getOwnPropertyDescriptor(e, "sentinel").value === 0
        } catch (t) {
            return false
        }
    };
    if (Object.defineProperty) {
        var s = p({});
        var b = typeof document === "undefined" || p(document.createElement("div"));
        if (!b || !s) {
            var O = Object.getOwnPropertyDescriptor
        }
    }
    if (!Object.getOwnPropertyDescriptor || O) {
        var d = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(e, o) {
            if (u(e)) {
                throw new TypeError(d + e)
            }
            if (O) {
                try {
                    return O.call(Object, e, o)
                } catch (i) {
                }
            }
            var c;
            if (!r(e, o)) {
                return c
            }
            c = {enumerable: n(e, o), configurable: true};
            if (l) {
                var p = e.__proto__;
                var s = e !== t;
                if (s) {
                    e.__proto__ = t
                }
                var b = f(e, o);
                var y = a(e, o);
                if (s) {
                    e.__proto__ = p
                }
                if (b || y) {
                    if (b) {
                        c.get = b
                    }
                    if (y) {
                        c.set = y
                    }
                    return c
                }
            }
            c.value = e[o];
            c.writable = true;
            return c
        }
    }
    if (!Object.getOwnPropertyNames) {
        Object.getOwnPropertyNames = function getOwnPropertyNames(e) {
            return Object.keys(e)
        }
    }
    if (!Object.create) {
        var y;
        var j = !({__proto__: null} instanceof Object);
        var v = function shouldUseActiveX() {
            if (!document.domain) {
                return false
            }
            try {
                return !!new ActiveXObject("htmlfile")
            } catch (e) {
                return false
            }
        };
        var _ = function getEmptyViaActiveX() {
            var e;
            var t;
            t = new ActiveXObject("htmlfile");
            var r = "script";
            t.write("<" + r + "></" + r + ">");
            t.close();
            e = t.parentWindow.Object.prototype;
            t = null;
            return e
        };
        var w = function getEmptyViaIFrame() {
            var e = document.createElement("iframe");
            var t = document.body || document.documentElement;
            var r;
            e.style.display = "none";
            t.appendChild(e);
            e.src = "javascript:";
            r = e.contentWindow.Object.prototype;
            t.removeChild(e);
            e = null;
            return r
        };
        if (j || typeof document === "undefined") {
            y = function () {
                return {__proto__: null}
            }
        } else {
            y = function () {
                var e = v() ? _() : w();
                delete e.constructor;
                delete e.hasOwnProperty;
                delete e.propertyIsEnumerable;
                delete e.isPrototypeOf;
                delete e.toLocaleString;
                delete e.toString;
                delete e.valueOf;
                var t = function Empty() {
                };
                t.prototype = e;
                y = function () {
                    return new t
                };
                return new t
            }
        }
        Object.create = function create(e, t) {
            var r;
            var n = function Type() {
            };
            if (e === null) {
                r = y()
            } else {
                if (e !== null && u(e)) {
                    throw new TypeError("Object prototype may only be an Object or null")
                }
                n.prototype = e;
                r = new n;
                r.__proto__ = e
            }
            if (t !== void 0) {
                Object.defineProperties(r, t)
            }
            return r
        }
    }
    var m = function doesDefinePropertyWork(e) {
        try {
            Object.defineProperty(e, "sentinel", {});
            return "sentinel" in e
        } catch (t) {
            return false
        }
    };
    if (Object.defineProperty) {
        var P = m({});
        var E = typeof document === "undefined" || m(document.createElement("div"));
        if (!P || !E) {
            var h = Object.defineProperty, g = Object.defineProperties
        }
    }
    if (!Object.defineProperty || h) {
        var z = "Property description must be an object: ";
        var T = "Object.defineProperty called on non-object: ";
        var x = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function defineProperty(e, r, n) {
            if (u(e)) {
                throw new TypeError(T + e)
            }
            if (u(n)) {
                throw new TypeError(z + n)
            }
            if (h) {
                try {
                    return h.call(Object, e, r, n)
                } catch (o) {
                }
            }
            if ("value" in n) {
                if (l && (f(e, r) || a(e, r))) {
                    var p = e.__proto__;
                    e.__proto__ = t;
                    delete e[r];
                    e[r] = n.value;
                    e.__proto__ = p
                } else {
                    e[r] = n.value
                }
            } else {
                var s = "get" in n;
                var b = "set" in n;
                if (!l && (s || b)) {
                    throw new TypeError(x)
                }
                if (s) {
                    i(e, r, n.get)
                }
                if (b) {
                    c(e, r, n.set)
                }
            }
            return e
        }
    }
    if (!Object.defineProperties || g) {
        Object.defineProperties = function defineProperties(e, t) {
            if (g) {
                try {
                    return g.call(Object, e, t)
                } catch (r) {
                }
            }
            Object.keys(t).forEach(function (r) {
                if (r !== "__proto__") {
                    Object.defineProperty(e, r, t[r])
                }
            });
            return e
        }
    }
    if (!Object.seal) {
        Object.seal = function seal(e) {
            if (Object(e) !== e) {
                throw new TypeError("Object.seal can only be called on Objects.")
            }
            return e
        }
    }
    if (!Object.freeze) {
        Object.freeze = function freeze(e) {
            if (Object(e) !== e) {
                throw new TypeError("Object.freeze can only be called on Objects.")
            }
            return e
        }
    }
    try {
        Object.freeze(function () {
        })
    } catch (S) {
        Object.freeze = function (e) {
            return function freeze(t) {
                if (typeof t === "function") {
                    return t
                } else {
                    return e(t)
                }
            }
        }(Object.freeze)
    }
    if (!Object.preventExtensions) {
        Object.preventExtensions = function preventExtensions(e) {
            if (Object(e) !== e) {
                throw new TypeError("Object.preventExtensions can only be called on Objects.")
            }
            return e
        }
    }
    if (!Object.isSealed) {
        Object.isSealed = function isSealed(e) {
            if (Object(e) !== e) {
                throw new TypeError("Object.isSealed can only be called on Objects.")
            }
            return false
        }
    }
    if (!Object.isFrozen) {
        Object.isFrozen = function isFrozen(e) {
            if (Object(e) !== e) {
                throw new TypeError("Object.isFrozen can only be called on Objects.")
            }
            return false
        }
    }
    if (!Object.isExtensible) {
        Object.isExtensible = function isExtensible(e) {
            if (Object(e) !== e) {
                throw new TypeError("Object.isExtensible can only be called on Objects.")
            }
            var t = "";
            while (r(e, t)) {
                t += "?"
            }
            e[t] = true;
            var n = r(e, t);
            delete e[t];
            return n
        }
    }
});
(function (t, r) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(r)
    } else if (typeof exports === "object") {
        module.exports = r()
    } else {
        t.returnExports = r()
    }
})(this, function () {
    var t = Array;
    var r = t.prototype;
    var e = Object;
    var n = e.prototype;
    var i = Function;
    var a = i.prototype;
    var o = String;
    var f = o.prototype;
    var u = Number;
    var l = u.prototype;
    var s = r.slice;
    var c = r.splice;
    var v = r.push;
    var h = r.unshift;
    var p = r.concat;
    var y = r.join;
    var d = a.call;
    var g = a.apply;
    var w = Math.max;
    var b = Math.min;
    var T = n.toString;
    var m = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
    var D;
    var S = Function.prototype.toString, x = /^\s*class /, O = function isES6ClassFn(t) {
        try {
            var r = S.call(t);
            var e = r.replace(/\/\/.*\n/g, "");
            var n = e.replace(/\/\*[.\s\S]*\*\//g, "");
            var i = n.replace(/\n/gm, " ").replace(/ {2}/g, " ");
            return x.test(i)
        } catch (a) {
            return false
        }
    }, j = function tryFunctionObject(t) {
        try {
            if (O(t)) {
                return false
            }
            S.call(t);
            return true
        } catch (r) {
            return false
        }
    }, E = "[object Function]", I = "[object GeneratorFunction]", D = function isCallable(t) {
        if (!t) {
            return false
        }
        if (typeof t !== "function" && typeof t !== "object") {
            return false
        }
        if (m) {
            return j(t)
        }
        if (O(t)) {
            return false
        }
        var r = T.call(t);
        return r === E || r === I
    };
    var M;
    var U = RegExp.prototype.exec, F = function tryRegexExec(t) {
        try {
            U.call(t);
            return true
        } catch (r) {
            return false
        }
    }, N = "[object RegExp]";
    M = function isRegex(t) {
        if (typeof t !== "object") {
            return false
        }
        return m ? F(t) : T.call(t) === N
    };
    var C;
    var k = String.prototype.valueOf, A = function tryStringObject(t) {
        try {
            k.call(t);
            return true
        } catch (r) {
            return false
        }
    }, R = "[object String]";
    C = function isString(t) {
        if (typeof t === "string") {
            return true
        }
        if (typeof t !== "object") {
            return false
        }
        return m ? A(t) : T.call(t) === R
    };
    var P = e.defineProperty && function () {
        try {
            var t = {};
            e.defineProperty(t, "x", {enumerable: false, value: t});
            for (var r in t) {
                return false
            }
            return t.x === t
        } catch (n) {
            return false
        }
    }();
    var $ = function (t) {
        var r;
        if (P) {
            r = function (t, r, n, i) {
                if (!i && r in t) {
                    return
                }
                e.defineProperty(t, r, {configurable: true, enumerable: false, writable: true, value: n})
            }
        } else {
            r = function (t, r, e, n) {
                if (!n && r in t) {
                    return
                }
                t[r] = e
            }
        }
        return function defineProperties(e, n, i) {
            for (var a in n) {
                if (t.call(n, a)) {
                    r(e, a, n[a], i)
                }
            }
        }
    }(n.hasOwnProperty);
    var J = function isPrimitive(t) {
        var r = typeof t;
        return t === null || r !== "object" && r !== "function"
    };
    var Y = u.isNaN || function isActualNaN(t) {
        return t !== t
    };
    var Z = {
        ToInteger: function ToInteger(t) {
            var r = +t;
            if (Y(r)) {
                r = 0
            } else if (r !== 0 && r !== 1 / 0 && r !== -(1 / 0)) {
                r = (r > 0 || -1) * Math.floor(Math.abs(r))
            }
            return r
        }, ToPrimitive: function ToPrimitive(t) {
            var r, e, n;
            if (J(t)) {
                return t
            }
            e = t.valueOf;
            if (D(e)) {
                r = e.call(t);
                if (J(r)) {
                    return r
                }
            }
            n = t.toString;
            if (D(n)) {
                r = n.call(t);
                if (J(r)) {
                    return r
                }
            }
            throw new TypeError
        }, ToObject: function (t) {
            if (t == null) {
                throw new TypeError("can't convert " + t + " to object")
            }
            return e(t)
        }, ToUint32: function ToUint32(t) {
            return t >>> 0
        }
    };
    var z = function Empty() {
    };
    $(a, {
        bind: function bind(t) {
            var r = this;
            if (!D(r)) {
                throw new TypeError("Function.prototype.bind called on incompatible " + r)
            }
            var n = s.call(arguments, 1);
            var a;
            var o = function () {
                if (this instanceof a) {
                    var i = g.call(r, this, p.call(n, s.call(arguments)));
                    if (e(i) === i) {
                        return i
                    }
                    return this
                } else {
                    return g.call(r, t, p.call(n, s.call(arguments)))
                }
            };
            var f = w(0, r.length - n.length);
            var u = [];
            for (var l = 0; l < f; l++) {
                v.call(u, "$" + l)
            }
            a = i("binder", "return function (" + y.call(u, ",") + "){ return binder.apply(this, arguments); }")(o);
            if (r.prototype) {
                z.prototype = r.prototype;
                a.prototype = new z;
                z.prototype = null
            }
            return a
        }
    });
    var G = d.bind(n.hasOwnProperty);
    var B = d.bind(n.toString);
    var H = d.bind(s);
    var W = g.bind(s);
    var L = d.bind(f.slice);
    var X = d.bind(f.split);
    var q = d.bind(f.indexOf);
    var K = d.bind(v);
    var Q = d.bind(n.propertyIsEnumerable);
    var V = d.bind(r.sort);
    var _ = t.isArray || function isArray(t) {
        return B(t) === "[object Array]"
    };
    var tt = [].unshift(0) !== 1;
    $(r, {
        unshift: function () {
            h.apply(this, arguments);
            return this.length
        }
    }, tt);
    $(t, {isArray: _});
    var rt = e("a");
    var et = rt[0] !== "a" || !(0 in rt);
    var nt = function properlyBoxed(t) {
        var r = true;
        var e = true;
        var n = false;
        if (t) {
            try {
                t.call("foo", function (t, e, n) {
                    if (typeof n !== "object") {
                        r = false
                    }
                });
                t.call([1], function () {
                    "use strict";
                    e = typeof this === "string"
                }, "x")
            } catch (i) {
                n = true
            }
        }
        return !!t && !n && r && e
    };
    $(r, {
        forEach: function forEach(t) {
            var r = Z.ToObject(this);
            var e = et && C(this) ? X(this, "") : r;
            var n = -1;
            var i = Z.ToUint32(e.length);
            var a;
            if (arguments.length > 1) {
                a = arguments[1]
            }
            if (!D(t)) {
                throw new TypeError("Array.prototype.forEach callback must be a function")
            }
            while (++n < i) {
                if (n in e) {
                    if (typeof a === "undefined") {
                        t(e[n], n, r)
                    } else {
                        t.call(a, e[n], n, r)
                    }
                }
            }
        }
    }, !nt(r.forEach));
    $(r, {
        map: function map(r) {
            var e = Z.ToObject(this);
            var n = et && C(this) ? X(this, "") : e;
            var i = Z.ToUint32(n.length);
            var a = t(i);
            var o;
            if (arguments.length > 1) {
                o = arguments[1]
            }
            if (!D(r)) {
                throw new TypeError("Array.prototype.map callback must be a function")
            }
            for (var f = 0; f < i; f++) {
                if (f in n) {
                    if (typeof o === "undefined") {
                        a[f] = r(n[f], f, e)
                    } else {
                        a[f] = r.call(o, n[f], f, e)
                    }
                }
            }
            return a
        }
    }, !nt(r.map));
    $(r, {
        filter: function filter(t) {
            var r = Z.ToObject(this);
            var e = et && C(this) ? X(this, "") : r;
            var n = Z.ToUint32(e.length);
            var i = [];
            var a;
            var o;
            if (arguments.length > 1) {
                o = arguments[1]
            }
            if (!D(t)) {
                throw new TypeError("Array.prototype.filter callback must be a function")
            }
            for (var f = 0; f < n; f++) {
                if (f in e) {
                    a = e[f];
                    if (typeof o === "undefined" ? t(a, f, r) : t.call(o, a, f, r)) {
                        K(i, a)
                    }
                }
            }
            return i
        }
    }, !nt(r.filter));
    $(r, {
        every: function every(t) {
            var r = Z.ToObject(this);
            var e = et && C(this) ? X(this, "") : r;
            var n = Z.ToUint32(e.length);
            var i;
            if (arguments.length > 1) {
                i = arguments[1]
            }
            if (!D(t)) {
                throw new TypeError("Array.prototype.every callback must be a function")
            }
            for (var a = 0; a < n; a++) {
                if (a in e && !(typeof i === "undefined" ? t(e[a], a, r) : t.call(i, e[a], a, r))) {
                    return false
                }
            }
            return true
        }
    }, !nt(r.every));
    $(r, {
        some: function some(t) {
            var r = Z.ToObject(this);
            var e = et && C(this) ? X(this, "") : r;
            var n = Z.ToUint32(e.length);
            var i;
            if (arguments.length > 1) {
                i = arguments[1]
            }
            if (!D(t)) {
                throw new TypeError("Array.prototype.some callback must be a function")
            }
            for (var a = 0; a < n; a++) {
                if (a in e && (typeof i === "undefined" ? t(e[a], a, r) : t.call(i, e[a], a, r))) {
                    return true
                }
            }
            return false
        }
    }, !nt(r.some));
    var it = false;
    if (r.reduce) {
        it = typeof r.reduce.call("es5", function (t, r, e, n) {
            return n
        }) === "object"
    }
    $(r, {
        reduce: function reduce(t) {
            var r = Z.ToObject(this);
            var e = et && C(this) ? X(this, "") : r;
            var n = Z.ToUint32(e.length);
            if (!D(t)) {
                throw new TypeError("Array.prototype.reduce callback must be a function")
            }
            if (n === 0 && arguments.length === 1) {
                throw new TypeError("reduce of empty array with no initial value")
            }
            var i = 0;
            var a;
            if (arguments.length >= 2) {
                a = arguments[1]
            } else {
                do {
                    if (i in e) {
                        a = e[i++];
                        break
                    }
                    if (++i >= n) {
                        throw new TypeError("reduce of empty array with no initial value")
                    }
                } while (true)
            }
            for (; i < n; i++) {
                if (i in e) {
                    a = t(a, e[i], i, r)
                }
            }
            return a
        }
    }, !it);
    var at = false;
    if (r.reduceRight) {
        at = typeof r.reduceRight.call("es5", function (t, r, e, n) {
            return n
        }) === "object"
    }
    $(r, {
        reduceRight: function reduceRight(t) {
            var r = Z.ToObject(this);
            var e = et && C(this) ? X(this, "") : r;
            var n = Z.ToUint32(e.length);
            if (!D(t)) {
                throw new TypeError("Array.prototype.reduceRight callback must be a function")
            }
            if (n === 0 && arguments.length === 1) {
                throw new TypeError("reduceRight of empty array with no initial value")
            }
            var i;
            var a = n - 1;
            if (arguments.length >= 2) {
                i = arguments[1]
            } else {
                do {
                    if (a in e) {
                        i = e[a--];
                        break
                    }
                    if (--a < 0) {
                        throw new TypeError("reduceRight of empty array with no initial value")
                    }
                } while (true)
            }
            if (a < 0) {
                return i
            }
            do {
                if (a in e) {
                    i = t(i, e[a], a, r)
                }
            } while (a--);
            return i
        }
    }, !at);
    var ot = r.indexOf && [0, 1].indexOf(1, 2) !== -1;
    $(r, {
        indexOf: function indexOf(t) {
            var r = et && C(this) ? X(this, "") : Z.ToObject(this);
            var e = Z.ToUint32(r.length);
            if (e === 0) {
                return -1
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Z.ToInteger(arguments[1])
            }
            n = n >= 0 ? n : w(0, e + n);
            for (; n < e; n++) {
                if (n in r && r[n] === t) {
                    return n
                }
            }
            return -1
        }
    }, ot);
    var ft = r.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    $(r, {
        lastIndexOf: function lastIndexOf(t) {
            var r = et && C(this) ? X(this, "") : Z.ToObject(this);
            var e = Z.ToUint32(r.length);
            if (e === 0) {
                return -1
            }
            var n = e - 1;
            if (arguments.length > 1) {
                n = b(n, Z.ToInteger(arguments[1]))
            }
            n = n >= 0 ? n : e - Math.abs(n);
            for (; n >= 0; n--) {
                if (n in r && t === r[n]) {
                    return n
                }
            }
            return -1
        }
    }, ft);
    var ut = function () {
        var t = [1, 2];
        var r = t.splice();
        return t.length === 2 && _(r) && r.length === 0
    }();
    $(r, {
        splice: function splice(t, r) {
            if (arguments.length === 0) {
                return []
            } else {
                return c.apply(this, arguments)
            }
        }
    }, !ut);
    var lt = function () {
        var t = {};
        r.splice.call(t, 0, 0, 1);
        return t.length === 1
    }();
    $(r, {
        splice: function splice(t, r) {
            if (arguments.length === 0) {
                return []
            }
            var e = arguments;
            this.length = w(Z.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof r !== "number") {
                e = H(arguments);
                if (e.length < 2) {
                    K(e, this.length - t)
                } else {
                    e[1] = Z.ToInteger(r)
                }
            }
            return c.apply(this, e)
        }
    }, !lt);
    var st = function () {
        var r = new t(1e5);
        r[8] = "x";
        r.splice(1, 1);
        return r.indexOf("x") === 7
    }();
    var ct = function () {
        var t = 256;
        var r = [];
        r[t] = "a";
        r.splice(t + 1, 0, "b");
        return r[t] === "a"
    }();
    $(r, {
        splice: function splice(t, r) {
            var e = Z.ToObject(this);
            var n = [];
            var i = Z.ToUint32(e.length);
            var a = Z.ToInteger(t);
            var f = a < 0 ? w(i + a, 0) : b(a, i);
            var u = b(w(Z.ToInteger(r), 0), i - f);
            var l = 0;
            var s;
            while (l < u) {
                s = o(f + l);
                if (G(e, s)) {
                    n[l] = e[s]
                }
                l += 1
            }
            var c = H(arguments, 2);
            var v = c.length;
            var h;
            if (v < u) {
                l = f;
                var p = i - u;
                while (l < p) {
                    s = o(l + u);
                    h = o(l + v);
                    if (G(e, s)) {
                        e[h] = e[s]
                    } else {
                        delete e[h]
                    }
                    l += 1
                }
                l = i;
                var y = i - u + v;
                while (l > y) {
                    delete e[l - 1];
                    l -= 1
                }
            } else if (v > u) {
                l = i - u;
                while (l > f) {
                    s = o(l + u - 1);
                    h = o(l + v - 1);
                    if (G(e, s)) {
                        e[h] = e[s]
                    } else {
                        delete e[h]
                    }
                    l -= 1
                }
            }
            l = f;
            for (var d = 0; d < c.length; ++d) {
                e[l] = c[d];
                l += 1
            }
            e.length = i - u + v;
            return n
        }
    }, !st || !ct);
    var vt = r.join;
    var ht;
    try {
        ht = Array.prototype.join.call("123", ",") !== "1,2,3"
    } catch (pt) {
        ht = true
    }
    if (ht) {
        $(r, {
            join: function join(t) {
                var r = typeof t === "undefined" ? "," : t;
                return vt.call(C(this) ? X(this, "") : this, r)
            }
        }, ht)
    }
    var yt = [1, 2].join(undefined) !== "1,2";
    if (yt) {
        $(r, {
            join: function join(t) {
                var r = typeof t === "undefined" ? "," : t;
                return vt.call(this, r)
            }
        }, yt)
    }
    var dt = function push(t) {
        var r = Z.ToObject(this);
        var e = Z.ToUint32(r.length);
        var n = 0;
        while (n < arguments.length) {
            r[e + n] = arguments[n];
            n += 1
        }
        r.length = e + n;
        return e + n
    };
    var gt = function () {
        var t = {};
        var r = Array.prototype.push.call(t, undefined);
        return r !== 1 || t.length !== 1 || typeof t[0] !== "undefined" || !G(t, 0)
    }();
    $(r, {
        push: function push(t) {
            if (_(this)) {
                return v.apply(this, arguments)
            }
            return dt.apply(this, arguments)
        }
    }, gt);
    var wt = function () {
        var t = [];
        var r = t.push(undefined);
        return r !== 1 || t.length !== 1 || typeof t[0] !== "undefined" || !G(t, 0)
    }();
    $(r, {push: dt}, wt);
    $(r, {
        slice: function (t, r) {
            var e = C(this) ? X(this, "") : this;
            return W(e, arguments)
        }
    }, et);
    var bt = function () {
        try {
            [1, 2].sort(null);
            [1, 2].sort({});
            return true
        } catch (t) {
        }
        return false
    }();
    var Tt = function () {
        try {
            [1, 2].sort(/a/);
            return false
        } catch (t) {
        }
        return true
    }();
    var mt = function () {
        try {
            [1, 2].sort(undefined);
            return true
        } catch (t) {
        }
        return false
    }();
    $(r, {
        sort: function sort(t) {
            if (typeof t === "undefined") {
                return V(this)
            }
            if (!D(t)) {
                throw new TypeError("Array.prototype.sort callback must be a function")
            }
            return V(this, t)
        }
    }, bt || !mt || !Tt);
    var Dt = !Q({toString: null}, "toString");
    var St = Q(function () {
    }, "prototype");
    var xt = !G("x", "0");
    var Ot = function (t) {
        var r = t.constructor;
        return r && r.prototype === t
    };
    var jt = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true
    };
    var Et = function () {
        if (typeof window === "undefined") {
            return false
        }
        for (var t in window) {
            try {
                if (!jt["$" + t] && G(window, t) && window[t] !== null && typeof window[t] === "object") {
                    Ot(window[t])
                }
            } catch (r) {
                return true
            }
        }
        return false
    }();
    var It = function (t) {
        if (typeof window === "undefined" || !Et) {
            return Ot(t)
        }
        try {
            return Ot(t)
        } catch (r) {
            return false
        }
    };
    var Mt = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];
    var Ut = Mt.length;
    var Ft = function isArguments(t) {
        return B(t) === "[object Arguments]"
    };
    var Nt = function isArguments(t) {
        return t !== null && typeof t === "object" && typeof t.length === "number" && t.length >= 0 && !_(t) && D(t.callee)
    };
    var Ct = Ft(arguments) ? Ft : Nt;
    $(e, {
        keys: function keys(t) {
            var r = D(t);
            var e = Ct(t);
            var n = t !== null && typeof t === "object";
            var i = n && C(t);
            if (!n && !r && !e) {
                throw new TypeError("Object.keys called on a non-object")
            }
            var a = [];
            var f = St && r;
            if (i && xt || e) {
                for (var u = 0; u < t.length; ++u) {
                    K(a, o(u))
                }
            }
            if (!e) {
                for (var l in t) {
                    if (!(f && l === "prototype") && G(t, l)) {
                        K(a, o(l))
                    }
                }
            }
            if (Dt) {
                var s = It(t);
                for (var c = 0; c < Ut; c++) {
                    var v = Mt[c];
                    if (!(s && v === "constructor") && G(t, v)) {
                        K(a, v)
                    }
                }
            }
            return a
        }
    });
    var kt = e.keys && function () {
        return e.keys(arguments).length === 2
    }(1, 2);
    var At = e.keys && function () {
        var t = e.keys(arguments);
        return arguments.length !== 1 || t.length !== 1 || t[0] !== 1
    }(1);
    var Rt = e.keys;
    $(e, {
        keys: function keys(t) {
            if (Ct(t)) {
                return Rt(H(t))
            } else {
                return Rt(t)
            }
        }
    }, !kt || At);
    var Pt = new Date(-0xc782b5b342b24).getUTCMonth() !== 0;
    var $t = new Date(-0x55d318d56a724);
    var Jt = new Date(14496624e5);
    var Yt = $t.toUTCString() !== "Mon, 01 Jan -45875 11:59:59 GMT";
    var Zt;
    var zt;
    var Gt = $t.getTimezoneOffset();
    if (Gt < -720) {
        Zt = $t.toDateString() !== "Tue Jan 02 -45875";
        zt = !/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/.test(Jt.toString())
    } else {
        Zt = $t.toDateString() !== "Mon Jan 01 -45875";
        zt = !/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/.test(Jt.toString())
    }
    var Bt = d.bind(Date.prototype.getFullYear);
    var Ht = d.bind(Date.prototype.getMonth);
    var Wt = d.bind(Date.prototype.getDate);
    var Lt = d.bind(Date.prototype.getUTCFullYear);
    var Xt = d.bind(Date.prototype.getUTCMonth);
    var qt = d.bind(Date.prototype.getUTCDate);
    var Kt = d.bind(Date.prototype.getUTCDay);
    var Qt = d.bind(Date.prototype.getUTCHours);
    var Vt = d.bind(Date.prototype.getUTCMinutes);
    var _t = d.bind(Date.prototype.getUTCSeconds);
    var tr = d.bind(Date.prototype.getUTCMilliseconds);
    var rr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var er = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var nr = function daysInMonth(t, r) {
        return Wt(new Date(r, t, 0))
    };
    $(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Bt(this);
            if (t < 0 && Ht(this) > 11) {
                return t + 1
            }
            return t
        }, getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Bt(this);
            var r = Ht(this);
            if (t < 0 && r > 11) {
                return 0
            }
            return r
        }, getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Bt(this);
            var r = Ht(this);
            var e = Wt(this);
            if (t < 0 && r > 11) {
                if (r === 12) {
                    return e
                }
                var n = nr(0, t + 1);
                return n - e + 1
            }
            return e
        }, getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Lt(this);
            if (t < 0 && Xt(this) > 11) {
                return t + 1
            }
            return t
        }, getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Lt(this);
            var r = Xt(this);
            if (t < 0 && r > 11) {
                return 0
            }
            return r
        }, getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Lt(this);
            var r = Xt(this);
            var e = qt(this);
            if (t < 0 && r > 11) {
                if (r === 12) {
                    return e
                }
                var n = nr(0, t + 1);
                return n - e + 1
            }
            return e
        }
    }, Pt);
    $(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = Kt(this);
            var r = qt(this);
            var e = Xt(this);
            var n = Lt(this);
            var i = Qt(this);
            var a = Vt(this);
            var o = _t(this);
            return rr[t] + ", " + (r < 10 ? "0" + r : r) + " " + er[e] + " " + n + " " + (i < 10 ? "0" + i : i) + ":" + (a < 10 ? "0" + a : a) + ":" + (o < 10 ? "0" + o : o) + " GMT"
        }
    }, Pt || Yt);
    $(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = this.getDay();
            var r = this.getDate();
            var e = this.getMonth();
            var n = this.getFullYear();
            return rr[t] + " " + er[e] + " " + (r < 10 ? "0" + r : r) + " " + n
        }
    }, Pt || Zt);
    if (Pt || zt) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError("this is not a Date object.")
            }
            var t = this.getDay();
            var r = this.getDate();
            var e = this.getMonth();
            var n = this.getFullYear();
            var i = this.getHours();
            var a = this.getMinutes();
            var o = this.getSeconds();
            var f = this.getTimezoneOffset();
            var u = Math.floor(Math.abs(f) / 60);
            var l = Math.floor(Math.abs(f) % 60);
            return rr[t] + " " + er[e] + " " + (r < 10 ? "0" + r : r) + " " + n + " " + (i < 10 ? "0" + i : i) + ":" + (a < 10 ? "0" + a : a) + ":" + (o < 10 ? "0" + o : o) + " GMT" + (f > 0 ? "-" : "+") + (u < 10 ? "0" + u : u) + (l < 10 ? "0" + l : l)
        };
        if (P) {
            e.defineProperty(Date.prototype, "toString", {configurable: true, enumerable: false, writable: true})
        }
    }
    var ir = -621987552e5;
    var ar = "-000001";
    var or = Date.prototype.toISOString && new Date(ir).toISOString().indexOf(ar) === -1;
    var fr = Date.prototype.toISOString && new Date(-1).toISOString() !== "1969-12-31T23:59:59.999Z";
    var ur = d.bind(Date.prototype.getTime);
    $(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(ur(this))) {
                throw new RangeError("Date.prototype.toISOString called on non-finite value.")
            }
            var t = Lt(this);
            var r = Xt(this);
            t += Math.floor(r / 12);
            r = (r % 12 + 12) % 12;
            var e = [r + 1, qt(this), Qt(this), Vt(this), _t(this)];
            t = (t < 0 ? "-" : t > 9999 ? "+" : "") + L("00000" + Math.abs(t), 0 <= t && t <= 9999 ? -4 : -6);
            for (var n = 0; n < e.length; ++n) {
                e[n] = L("00" + e[n], -2)
            }
            return t + "-" + H(e, 0, 2).join("-") + "T" + H(e, 2).join(":") + "." + L("000" + tr(this), -3) + "Z"
        }
    }, or || fr);
    var lr = function () {
        try {
            return Date.prototype.toJSON && new Date(NaN).toJSON() === null && new Date(ir).toJSON().indexOf(ar) !== -1 && Date.prototype.toJSON.call({
                toISOString: function () {
                    return true
                }
            })
        } catch (t) {
            return false
        }
    }();
    if (!lr) {
        Date.prototype.toJSON = function toJSON(t) {
            var r = e(this);
            var n = Z.ToPrimitive(r);
            if (typeof n === "number" && !isFinite(n)) {
                return null
            }
            var i = r.toISOString;
            if (!D(i)) {
                throw new TypeError("toISOString property is not callable")
            }
            return i.call(r)
        }
    }
    var sr = Date.parse("+033658-09-27T01:46:40.000Z") === 1e15;
    var cr = !isNaN(Date.parse("2012-04-04T24:00:00.500Z")) || !isNaN(Date.parse("2012-11-31T23:59:59.000Z")) || !isNaN(Date.parse("2012-12-31T23:59:60.000Z"));
    var vr = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
    if (vr || cr || !sr) {
        var hr = Math.pow(2, 31) - 1;
        var pr = Y(new Date(1970, 0, 1, 0, 0, 0, hr + 1).getTime());
        Date = function (t) {
            var r = function Date(e, n, i, a, f, u, l) {
                var s = arguments.length;
                var c;
                if (this instanceof t) {
                    var v = u;
                    var h = l;
                    if (pr && s >= 7 && l > hr) {
                        var p = Math.floor(l / hr) * hr;
                        var y = Math.floor(p / 1e3);
                        v += y;
                        h -= y * 1e3
                    }
                    c = s === 1 && o(e) === e ? new t(r.parse(e)) : s >= 7 ? new t(e, n, i, a, f, v, h) : s >= 6 ? new t(e, n, i, a, f, v) : s >= 5 ? new t(e, n, i, a, f) : s >= 4 ? new t(e, n, i, a) : s >= 3 ? new t(e, n, i) : s >= 2 ? new t(e, n) : s >= 1 ? new t(e instanceof t ? +e : e) : new t
                } else {
                    c = t.apply(this, arguments)
                }
                if (!J(c)) {
                    $(c, {constructor: r}, true)
                }
                return c
            };
            var e = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$");
            var n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
            var i = function dayFromMonth(t, r) {
                var e = r > 1 ? 1 : 0;
                return n[r] + Math.floor((t - 1969 + e) / 4) - Math.floor((t - 1901 + e) / 100) + Math.floor((t - 1601 + e) / 400) + 365 * (t - 1970)
            };
            var a = function toUTC(r) {
                var e = 0;
                var n = r;
                if (pr && n > hr) {
                    var i = Math.floor(n / hr) * hr;
                    var a = Math.floor(i / 1e3);
                    e += a;
                    n -= a * 1e3
                }
                return u(new t(1970, 0, 1, 0, 0, e, n))
            };
            for (var f in t) {
                if (G(t, f)) {
                    r[f] = t[f]
                }
            }
            $(r, {now: t.now, UTC: t.UTC}, true);
            r.prototype = t.prototype;
            $(r.prototype, {constructor: r}, true);
            var l = function parse(r) {
                var n = e.exec(r);
                if (n) {
                    var o = u(n[1]), f = u(n[2] || 1) - 1, l = u(n[3] || 1) - 1, s = u(n[4] || 0), c = u(n[5] || 0),
                        v = u(n[6] || 0), h = Math.floor(u(n[7] || 0) * 1e3), p = Boolean(n[4] && !n[8]),
                        y = n[9] === "-" ? 1 : -1, d = u(n[10] || 0), g = u(n[11] || 0), w;
                    var b = c > 0 || v > 0 || h > 0;
                    if (s < (b ? 24 : 25) && c < 60 && v < 60 && h < 1e3 && f > -1 && f < 12 && d < 24 && g < 60 && l > -1 && l < i(o, f + 1) - i(o, f)) {
                        w = ((i(o, f) + l) * 24 + s + d * y) * 60;
                        w = ((w + c + g * y) * 60 + v) * 1e3 + h;
                        if (p) {
                            w = a(w)
                        }
                        if (-864e13 <= w && w <= 864e13) {
                            return w
                        }
                    }
                    return NaN
                }
                return t.parse.apply(this, arguments)
            };
            $(r, {parse: l});
            return r
        }(Date)
    }
    if (!Date.now) {
        Date.now = function now() {
            return (new Date).getTime()
        }
    }
    var yr = l.toFixed && (8e-5.toFixed(3) !== "0.000" || .9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 0xde0b6b3a7640080.toFixed(0) !== "1000000000000000128");
    var dr = {
        base: 1e7, size: 6, data: [0, 0, 0, 0, 0, 0], multiply: function multiply(t, r) {
            var e = -1;
            var n = r;
            while (++e < dr.size) {
                n += t * dr.data[e];
                dr.data[e] = n % dr.base;
                n = Math.floor(n / dr.base)
            }
        }, divide: function divide(t) {
            var r = dr.size;
            var e = 0;
            while (--r >= 0) {
                e += dr.data[r];
                dr.data[r] = Math.floor(e / t);
                e = e % t * dr.base
            }
        }, numToString: function numToString() {
            var t = dr.size;
            var r = "";
            while (--t >= 0) {
                if (r !== "" || t === 0 || dr.data[t] !== 0) {
                    var e = o(dr.data[t]);
                    if (r === "") {
                        r = e
                    } else {
                        r += L("0000000", 0, 7 - e.length) + e
                    }
                }
            }
            return r
        }, pow: function pow(t, r, e) {
            return r === 0 ? e : r % 2 === 1 ? pow(t, r - 1, e * t) : pow(t * t, r / 2, e)
        }, log: function log(t) {
            var r = 0;
            var e = t;
            while (e >= 4096) {
                r += 12;
                e /= 4096
            }
            while (e >= 2) {
                r += 1;
                e /= 2
            }
            return r
        }
    };
    var gr = function toFixed(t) {
        var r, e, n, i, a, f, l, s;
        r = u(t);
        r = Y(r) ? 0 : Math.floor(r);
        if (r < 0 || r > 20) {
            throw new RangeError("Number.toFixed called with invalid number of decimals")
        }
        e = u(this);
        if (Y(e)) {
            return "NaN"
        }
        if (e <= -1e21 || e >= 1e21) {
            return o(e)
        }
        n = "";
        if (e < 0) {
            n = "-";
            e = -e
        }
        i = "0";
        if (e > 1e-21) {
            a = dr.log(e * dr.pow(2, 69, 1)) - 69;
            f = a < 0 ? e * dr.pow(2, -a, 1) : e / dr.pow(2, a, 1);
            f *= 4503599627370496;
            a = 52 - a;
            if (a > 0) {
                dr.multiply(0, f);
                l = r;
                while (l >= 7) {
                    dr.multiply(1e7, 0);
                    l -= 7
                }
                dr.multiply(dr.pow(10, l, 1), 0);
                l = a - 1;
                while (l >= 23) {
                    dr.divide(1 << 23);
                    l -= 23
                }
                dr.divide(1 << l);
                dr.multiply(1, 1);
                dr.divide(2);
                i = dr.numToString()
            } else {
                dr.multiply(0, f);
                dr.multiply(1 << -a, 0);
                i = dr.numToString() + L("0.00000000000000000000", 2, 2 + r)
            }
        }
        if (r > 0) {
            s = i.length;
            if (s <= r) {
                i = n + L("0.0000000000000000000", 0, r - s + 2) + i
            } else {
                i = n + L(i, 0, s - r) + "." + L(i, s - r)
            }
        } else {
            i = n + i
        }
        return i
    };
    $(l, {toFixed: gr}, yr);
    var wr = function () {
        try {
            return 1..toPrecision(undefined) === "1"
        } catch (t) {
            return true
        }
    }();
    var br = l.toPrecision;
    $(l, {
        toPrecision: function toPrecision(t) {
            return typeof t === "undefined" ? br.call(this) : br.call(this, t)
        }
    }, wr);
    if ("ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || "tesst".split(/(s)*/)[1] === "t" || "test".split(/(?:)/, -1).length !== 4 || "".split(/.?/).length || ".".split(/()()/).length > 1) {
        (function () {
            var t = typeof /()??/.exec("")[1] === "undefined";
            var r = Math.pow(2, 32) - 1;
            f.split = function (e, n) {
                var i = String(this);
                if (typeof e === "undefined" && n === 0) {
                    return []
                }
                if (!M(e)) {
                    return X(this, e, n)
                }
                var a = [];
                var o = (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "") + (e.sticky ? "y" : ""),
                    f = 0, u, l, s, c;
                var h = new RegExp(e.source, o + "g");
                if (!t) {
                    u = new RegExp("^" + h.source + "$(?!\\s)", o)
                }
                var p = typeof n === "undefined" ? r : Z.ToUint32(n);
                l = h.exec(i);
                while (l) {
                    s = l.index + l[0].length;
                    if (s > f) {
                        K(a, L(i, f, l.index));
                        if (!t && l.length > 1) {
                            l[0].replace(u, function () {
                                for (var t = 1; t < arguments.length - 2; t++) {
                                    if (typeof arguments[t] === "undefined") {
                                        l[t] = void 0
                                    }
                                }
                            })
                        }
                        if (l.length > 1 && l.index < i.length) {
                            v.apply(a, H(l, 1))
                        }
                        c = l[0].length;
                        f = s;
                        if (a.length >= p) {
                            break
                        }
                    }
                    if (h.lastIndex === l.index) {
                        h.lastIndex++
                    }
                    l = h.exec(i)
                }
                if (f === i.length) {
                    if (c || !h.test("")) {
                        K(a, "")
                    }
                } else {
                    K(a, L(i, f))
                }
                return a.length > p ? H(a, 0, p) : a
            }
        })()
    } else if ("0".split(void 0, 0).length) {
        f.split = function split(t, r) {
            if (typeof t === "undefined" && r === 0) {
                return []
            }
            return X(this, t, r)
        }
    }
    var Tr = f.replace;
    var mr = function () {
        var t = [];
        "x".replace(/x(.)?/g, function (r, e) {
            K(t, e)
        });
        return t.length === 1 && typeof t[0] === "undefined"
    }();
    if (!mr) {
        f.replace = function replace(t, r) {
            var e = D(r);
            var n = M(t) && /\)[*?]/.test(t.source);
            if (!e || !n) {
                return Tr.call(this, t, r)
            } else {
                var i = function (e) {
                    var n = arguments.length;
                    var i = t.lastIndex;
                    t.lastIndex = 0;
                    var a = t.exec(e) || [];
                    t.lastIndex = i;
                    K(a, arguments[n - 2], arguments[n - 1]);
                    return r.apply(this, a)
                };
                return Tr.call(this, t, i)
            }
        }
    }
    var Dr = f.substr;
    var Sr = "".substr && "0b".substr(-1) !== "b";
    $(f, {
        substr: function substr(t, r) {
            var e = t;
            if (t < 0) {
                e = w(this.length + t, 0)
            }
            return Dr.call(this, e, r)
        }
    }, Sr);
    var xr = "	\n\x0B\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff";
    var Or = "\u200b";
    var jr = "[" + xr + "]";
    var Er = new RegExp("^" + jr + jr + "*");
    var Ir = new RegExp(jr + jr + "*$");
    var Mr = f.trim && (xr.trim() || !Or.trim());
    $(f, {
        trim: function trim() {
            if (typeof this === "undefined" || this === null) {
                throw new TypeError("can't convert " + this + " to object")
            }
            return o(this).replace(Er, "").replace(Ir, "")
        }
    }, Mr);
    var Ur = d.bind(String.prototype.trim);
    var Fr = f.lastIndexOf && "abc\u3042\u3044".lastIndexOf("\u3042\u3044", 2) !== -1;
    $(f, {
        lastIndexOf: function lastIndexOf(t) {
            if (typeof this === "undefined" || this === null) {
                throw new TypeError("can't convert " + this + " to object")
            }
            var r = o(this);
            var e = o(t);
            var n = arguments.length > 1 ? u(arguments[1]) : NaN;
            var i = Y(n) ? Infinity : Z.ToInteger(n);
            var a = b(w(i, 0), r.length);
            var f = e.length;
            var l = a + f;
            while (l > 0) {
                l = w(0, l - f);
                var s = q(L(r, l, a + f), e);
                if (s !== -1) {
                    return l + s
                }
            }
            return -1
        }
    }, Fr);
    var Nr = f.lastIndexOf;
    $(f, {
        lastIndexOf: function lastIndexOf(t) {
            return Nr.apply(this, arguments)
        }
    }, f.lastIndexOf.length !== 1);
    if (parseInt(xr + "08") !== 8 || parseInt(xr + "0x16") !== 22) {
        parseInt = function (t) {
            var r = /^[\-+]?0[xX]/;
            return function parseInt(e, n) {
                var i = Ur(String(e));
                var a = u(n) || (r.test(i) ? 16 : 10);
                return t(i, a)
            }
        }(parseInt)
    }
    if (1 / parseFloat("-0") !== -Infinity) {
        parseFloat = function (t) {
            return function parseFloat(r) {
                var e = Ur(String(r));
                var n = t(e);
                return n === 0 && L(e, 0, 1) === "-" ? -0 : n
            }
        }(parseFloat)
    }
    if (String(new RangeError("test")) !== "RangeError: test") {
        var Cr = function toString() {
            if (typeof this === "undefined" || this === null) {
                throw new TypeError("can't convert " + this + " to object")
            }
            var t = this.name;
            if (typeof t === "undefined") {
                t = "Error"
            } else if (typeof t !== "string") {
                t = o(t)
            }
            var r = this.message;
            if (typeof r === "undefined") {
                r = ""
            } else if (typeof r !== "string") {
                r = o(r)
            }
            if (!t) {
                return r
            }
            if (!r) {
                return t
            }
            return t + ": " + r
        };
        Error.prototype.toString = Cr
    }
    if (P) {
        var kr = function (t, r) {
            if (Q(t, r)) {
                var e = Object.getOwnPropertyDescriptor(t, r);
                if (e.configurable) {
                    e.enumerable = false;
                    Object.defineProperty(t, r, e)
                }
            }
        };
        kr(Error.prototype, "message");
        if (Error.prototype.message !== "") {
            Error.prototype.message = ""
        }
        kr(Error.prototype, "name")
    }
    if (String(/a/gim) !== "/a/gim") {
        var Ar = function toString() {
            var t = "/" + this.source + "/";
            if (this.global) {
                t += "g"
            }
            if (this.ignoreCase) {
                t += "i"
            }
            if (this.multiline) {
                t += "m"
            }
            return t
        };
        RegExp.prototype.toString = Ar
    }
});
!function (a, b) {
    function c(a, b) {
        var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
        return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
    }

    function d() {
        var a = t.elements;
        return "string" == typeof a ? a.split(" ") : a
    }

    function e(a, b) {
        var c = t.elements;
        "string" != typeof c && (c = c.join(" ")), "string" != typeof a && (a = a.join(" ")), t.elements = c + " " + a, j(b)
    }

    function f(a) {
        var b = s[a[q]];
        return b || (b = {}, r++, a[q] = r, s[r] = b), b
    }

    function g(a, c, d) {
        if (c || (c = b), l) return c.createElement(a);
        d || (d = f(c));
        var e;
        return e = d.cache[a] ? d.cache[a].cloneNode() : p.test(a) ? (d.cache[a] = d.createElem(a)).cloneNode() : d.createElem(a), !e.canHaveChildren || o.test(a) || e.tagUrn ? e : d.frag.appendChild(e)
    }

    function h(a, c) {
        if (a || (a = b), l) return a.createDocumentFragment();
        c = c || f(a);
        for (var e = c.frag.cloneNode(), g = 0, h = d(), i = h.length; i > g; g++) e.createElement(h[g]);
        return e
    }

    function i(a, b) {
        b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) {
            return t.shivMethods ? g(c, a, b) : b.createElem(c)
        }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + d().join().replace(/[\w\-:]+/g, function (a) {
            return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
        }) + ");return n}")(t, b.frag)
    }

    function j(a) {
        a || (a = b);
        var d = f(a);
        return !t.shivCSS || k || d.hasCSS || (d.hasCSS = !!c(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), l || i(a, d), a
    }

    var k, l, m = "3.7.3", n = a.html5 || {}, o = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
        p = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
        q = "_html5shiv", r = 0, s = {};
    !function () {
        try {
            var a = b.createElement("a");
            a.innerHTML = "<xyz></xyz>", k = "hidden" in a, l = 1 == a.childNodes.length || function () {
                b.createElement("a");
                var a = b.createDocumentFragment();
                return "undefined" == typeof a.cloneNode || "undefined" == typeof a.createDocumentFragment || "undefined" == typeof a.createElement
            }()
        } catch (c) {
            k = !0, l = !0
        }
    }();
    var t = {
        elements: n.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
        version: m,
        shivCSS: n.shivCSS !== !1,
        supportsUnknownElements: l,
        shivMethods: n.shivMethods !== !1,
        type: "default",
        shivDocument: j,
        createElement: g,
        createDocumentFragment: h,
        addElements: e
    };
    a.html5 = t, j(b), "object" == typeof module && module.exports && (module.exports = t)
}("undefined" != typeof window ? window : this, document);
!function (a) {
    "use strict";
    a.matchMedia = a.matchMedia || function (a) {
        var b, c = a.documentElement, d = c.firstElementChild || c.firstChild, e = a.createElement("body"),
            f = a.createElement("div");
        return f.id = "mq-test-1", f.style.cssText = "position:absolute;top:-100em", e.style.background = "none", e.appendChild(f), function (a) {
            return f.innerHTML = '&shy;<style media="' + a + '"> #mq-test-1 { width: 42px; }</style>', c.insertBefore(e, d), b = 42 === f.offsetWidth, c.removeChild(e), {
                matches: b,
                media: a
            }
        }
    }(a.document)
}(this), function (a) {
    "use strict";

    function b() {
        u(!0)
    }

    var c = {};
    a.respond = c, c.update = function () {
    };
    var d = [], e = function () {
        var b = !1;
        try {
            b = new a.XMLHttpRequest
        } catch (c) {
            b = new a.ActiveXObject("Microsoft.XMLHTTP")
        }
        return function () {
            return b
        }
    }(), f = function (a, b) {
        var c = e();
        c && (c.open("GET", a, !0), c.onreadystatechange = function () {
            4 !== c.readyState || 200 !== c.status && 304 !== c.status || b(c.responseText)
        }, 4 !== c.readyState && c.send(null))
    };
    if (c.ajax = f, c.queue = d, c.regex = {
        media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
        keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
        urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
        findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
        only: /(only\s+)?([a-zA-Z]+)\s?/,
        minw: /\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/,
        maxw: /\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/
    }, c.mediaQueriesSupported = a.matchMedia && null !== a.matchMedia("only all") && a.matchMedia("only all").matches, !c.mediaQueriesSupported) {
        var g, h, i, j = a.document, k = j.documentElement, l = [], m = [], n = [], o = {}, p = 30,
            q = j.getElementsByTagName("head")[0] || k, r = j.getElementsByTagName("base")[0],
            s = q.getElementsByTagName("link"), t = function () {
                var a, b = j.createElement("div"), c = j.body, d = k.style.fontSize, e = c && c.style.fontSize, f = !1;
                return b.style.cssText = "position:absolute;font-size:1em;width:1em", c || (c = f = j.createElement("body"), c.style.background = "none"), k.style.fontSize = "100%", c.style.fontSize = "100%", c.appendChild(b), f && k.insertBefore(c, k.firstChild), a = b.offsetWidth, f ? k.removeChild(c) : c.removeChild(b), k.style.fontSize = d, e && (c.style.fontSize = e), a = i = parseFloat(a)
            }, u = function (b) {
                var c = "clientWidth", d = k[c], e = "CSS1Compat" === j.compatMode && d || j.body[c] || d, f = {},
                    o = s[s.length - 1], r = (new Date).getTime();
                if (b && g && p > r - g) return a.clearTimeout(h), h = a.setTimeout(u, p), void 0;
                g = r;
                for (var v in l) if (l.hasOwnProperty(v)) {
                    var w = l[v], x = w.minw, y = w.maxw, z = null === x, A = null === y, B = "em";
                    x && (x = parseFloat(x) * (x.indexOf(B) > -1 ? i || t() : 1)), y && (y = parseFloat(y) * (y.indexOf(B) > -1 ? i || t() : 1)), w.hasquery && (z && A || !(z || e >= x) || !(A || y >= e)) || (f[w.media] || (f[w.media] = []), f[w.media].push(m[w.rules]))
                }
                for (var C in n) n.hasOwnProperty(C) && n[C] && n[C].parentNode === q && q.removeChild(n[C]);
                n.length = 0;
                for (var D in f) if (f.hasOwnProperty(D)) {
                    var E = j.createElement("style"), F = f[D].join("\n");
                    E.type = "text/css", E.media = D, q.insertBefore(E, o.nextSibling), E.styleSheet ? E.styleSheet.cssText = F : E.appendChild(j.createTextNode(F)), n.push(E)
                }
            }, v = function (a, b, d) {
                var e = a.replace(c.regex.keyframes, "").match(c.regex.media), f = e && e.length || 0;
                b = b.substring(0, b.lastIndexOf("/"));
                var g = function (a) {
                    return a.replace(c.regex.urls, "$1" + b + "$2$3")
                }, h = !f && d;
                b.length && (b += "/"), h && (f = 1);
                for (var i = 0; f > i; i++) {
                    var j, k, n, o;
                    h ? (j = d, m.push(g(a))) : (j = e[i].match(c.regex.findStyles) && RegExp.$1, m.push(RegExp.$2 && g(RegExp.$2))), n = j.split(","), o = n.length;
                    for (var p = 0; o > p; p++) k = n[p], l.push({
                        media: k.split("(")[0].match(c.regex.only) && RegExp.$2 || "all",
                        rules: m.length - 1,
                        hasquery: k.indexOf("(") > -1,
                        minw: k.match(c.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                        maxw: k.match(c.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
                    })
                }
                u()
            }, w = function () {
                if (d.length) {
                    var b = d.shift();
                    f(b.href, function (c) {
                        v(c, b.href, b.media), o[b.href] = !0, a.setTimeout(function () {
                            w()
                        }, 0)
                    })
                }
            }, x = function () {
                for (var b = 0; b < s.length; b++) {
                    var c = s[b], e = c.href, f = c.media, g = c.rel && "stylesheet" === c.rel.toLowerCase();
                    e && g && !o[e] && (c.styleSheet && c.styleSheet.rawCssText ? (v(c.styleSheet.rawCssText, e, f), o[e] = !0) : (!/^([a-zA-Z:]*\/\/)/.test(e) && !r || e.replace(RegExp.$1, "").split("/")[0] === a.location.host) && ("//" === e.substring(0, 2) && (e = a.location.protocol + e), d.push({
                        href: e,
                        media: f
                    })))
                }
                w()
            };
        x(), c.update = x, c.getEmValue = t, a.addEventListener ? a.addEventListener("resize", b, !1) : a.attachEvent && a.attachEvent("onresize", b)
    }
}(this);
(function (win) {
    var ieUserAgent = navigator.userAgent.match(/MSIE (\d+)/);
    if (!ieUserAgent) {
        return false
    }
    var doc = document;
    var root = doc.documentElement;
    var xhr = getXHRObject();
    var ieVersion = ieUserAgent[1];
    if (doc.compatMode != 'CSS1Compat' || ieVersion < 6 || ieVersion > 8 || !xhr) {
        return
    }
    var selectorEngines = {
        "NW": "*.Dom.select",
        "MooTools": "$$",
        "DOMAssistant": "*.$",
        "Prototype": "$$",
        "YAHOO": "*.util.Selector.query",
        "Sizzle": "*",
        "jQuery": "*",
        "dojo": "*.query"
    };
    var selectorMethod;
    var enabledWatchers = [];
    var domPatches = [];
    var ie6PatchID = 0;
    var patchIE6MultipleClasses = true;
    var namespace = "slvzr";
    var RE_COMMENT = /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g;
    var RE_IMPORT = /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g;
    var RE_ASSET_URL = /(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g;
    var RE_PSEUDO_STRUCTURAL = /^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/;
    var RE_PSEUDO_ELEMENTS = /:(:first-(?:line|letter))/g;
    var RE_SELECTOR_GROUP = /((?:^|(?:\s*})+)(?:\s*@media[^{]+{)?)\s*([^\{]*?[\[:][^{]+)/g;
    var RE_SELECTOR_PARSE = /([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g;
    var RE_LIBRARY_INCOMPATIBLE_PSEUDOS = /(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g;
    var RE_PATCH_CLASS_NAME_REPLACE = /[^\w-]/g;
    var RE_INPUT_ELEMENTS = /^(INPUT|SELECT|TEXTAREA|BUTTON)$/;
    var RE_INPUT_CHECKABLE_TYPES = /^(checkbox|radio)$/;
    var BROKEN_ATTR_IMPLEMENTATIONS = ieVersion > 6 ? /[\$\^*]=(['"])\1/ : null;
    var RE_TIDY_TRAILING_WHITESPACE = /([(\[+~])\s+/g;
    var RE_TIDY_LEADING_WHITESPACE = /\s+([)\]+~])/g;
    var RE_TIDY_CONSECUTIVE_WHITESPACE = /\s+/g;
    var RE_TIDY_TRIM_WHITESPACE = /^\s*((?:[\S\s]*\S)?)\s*$/;
    var EMPTY_STRING = "";
    var SPACE_STRING = " ";
    var PLACEHOLDER_STRING = "$1";

    function patchStyleSheet(cssText) {
        return cssText.replace(RE_PSEUDO_ELEMENTS, PLACEHOLDER_STRING).replace(RE_SELECTOR_GROUP, function (m, prefix, selectorText) {
            var selectorGroups = selectorText.split(",");
            for (var c = 0, cs = selectorGroups.length; c < cs; c++) {
                var selector = normalizeSelectorWhitespace(selectorGroups[c]) + SPACE_STRING;
                var patches = [];
                selectorGroups[c] = selector.replace(RE_SELECTOR_PARSE, function (match, combinator, pseudo, attribute, index) {
                    if (combinator) {
                        if (patches.length > 0) {
                            domPatches.push({selector: selector.substring(0, index), patches: patches})
                            patches = []
                        }
                        return combinator
                    } else {
                        var patch = (pseudo) ? patchPseudoClass(pseudo) : patchAttribute(attribute);
                        if (patch) {
                            patches.push(patch);
                            return "." + patch.className
                        }
                        return match
                    }
                })
            }
            return prefix + selectorGroups.join(",")
        })
    };

    function patchAttribute(attr) {
        return (!BROKEN_ATTR_IMPLEMENTATIONS || BROKEN_ATTR_IMPLEMENTATIONS.test(attr)) ? {
            className: createClassName(attr),
            applyClass: true
        } : null
    };

    function patchPseudoClass(pseudo) {
        var applyClass = true;
        var className = createClassName(pseudo.slice(1));
        var isNegated = pseudo.substring(0, 5) == ":not(";
        var activateEventName;
        var deactivateEventName;
        if (isNegated) {
            pseudo = pseudo.slice(5, -1)
        }
        var bracketIndex = pseudo.indexOf("(")
        if (bracketIndex > -1) {
            pseudo = pseudo.substring(0, bracketIndex)
        }
        if (pseudo.charAt(0) == ":") {
            switch (pseudo.slice(1)) {
                case"root":
                    applyClass = function (e) {
                        return isNegated ? e != root : e == root
                    }
                    break;
                case"target":
                    if (ieVersion == 8) {
                        applyClass = function (e) {
                            var handler = function () {
                                var hash = location.hash;
                                var hashID = hash.slice(1);
                                return isNegated ? (hash == EMPTY_STRING || e.id != hashID) : (hash != EMPTY_STRING && e.id == hashID)
                            };
                            addEvent(win, "hashchange", function () {
                                toggleElementClass(e, className, handler())
                            })
                            return handler()
                        }
                        break
                    }
                    return false;
                case"checked":
                    applyClass = function (e) {
                        if (RE_INPUT_CHECKABLE_TYPES.test(e.type)) {
                            addEvent(e, "propertychange", function () {
                                if (event.propertyName == "checked") {
                                    toggleElementClass(e, className, e.checked !== isNegated)
                                }
                            })
                        }
                        return e.checked !== isNegated
                    }
                    break;
                case"disabled":
                    isNegated = !isNegated;
                case"enabled":
                    applyClass = function (e) {
                        if (RE_INPUT_ELEMENTS.test(e.tagName)) {
                            addEvent(e, "propertychange", function () {
                                if (event.propertyName == "$disabled") {
                                    toggleElementClass(e, className, e.$disabled === isNegated)
                                }
                            });
                            enabledWatchers.push(e);
                            e.$disabled = e.disabled;
                            return e.disabled === isNegated
                        }
                        return pseudo == ":enabled" ? isNegated : !isNegated
                    }
                    break;
                case"focus":
                    activateEventName = "focus";
                    deactivateEventName = "blur";
                case"hover":
                    if (!activateEventName) {
                        activateEventName = "mouseenter";
                        deactivateEventName = "mouseleave"
                    }
                    applyClass = function (e) {
                        addEvent(e, isNegated ? deactivateEventName : activateEventName, function () {
                            toggleElementClass(e, className, true)
                        })
                        addEvent(e, isNegated ? activateEventName : deactivateEventName, function () {
                            toggleElementClass(e, className, false)
                        })
                        return isNegated
                    }
                    break;
                default:
                    if (!RE_PSEUDO_STRUCTURAL.test(pseudo)) {
                        return false
                    }
                    break
            }
        }
        return {className: className, applyClass: applyClass}
    };

    function applyPatches() {
        var elms, selectorText, patches, domSelectorText;
        for (var c = 0; c < domPatches.length; c++) {
            selectorText = domPatches[c].selector;
            patches = domPatches[c].patches;
            domSelectorText = selectorText.replace(RE_LIBRARY_INCOMPATIBLE_PSEUDOS, EMPTY_STRING);
            if (domSelectorText == EMPTY_STRING || domSelectorText.charAt(domSelectorText.length - 1) == SPACE_STRING) {
                domSelectorText += "*"
            }
            try {
                elms = selectorMethod(domSelectorText)
            } catch (ex) {
                log("Selector '" + selectorText + "' threw exception '" + ex + "'")
            }
            if (elms) {
                for (var d = 0, dl = elms.length; d < dl; d++) {
                    var elm = elms[d];
                    var cssClasses = elm.className;
                    for (var f = 0, fl = patches.length; f < fl; f++) {
                        var patch = patches[f];
                        if (!hasPatch(elm, patch)) {
                            if (patch.applyClass && (patch.applyClass === true || patch.applyClass(elm) === true)) {
                                cssClasses = toggleClass(cssClasses, patch.className, true)
                            }
                        }
                    }
                    elm.className = cssClasses
                }
            }
        }
    };

    function hasPatch(elm, patch) {
        return new RegExp("(^|\\s)" + patch.className + "(\\s|$)").test(elm.className)
    };

    function createClassName(className) {
        return namespace + "-" + ((ieVersion == 6 && patchIE6MultipleClasses) ? ie6PatchID++ : className.replace(RE_PATCH_CLASS_NAME_REPLACE, function (a) {
            return a.charCodeAt(0)
        }))
    };

    function log(message) {
        if (win.console) {
            win.console.log(message)
        }
    };

    function trim(text) {
        return text.replace(RE_TIDY_TRIM_WHITESPACE, PLACEHOLDER_STRING)
    };

    function normalizeWhitespace(text) {
        return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE, SPACE_STRING)
    };

    function normalizeSelectorWhitespace(selectorText) {
        return normalizeWhitespace(selectorText.replace(RE_TIDY_TRAILING_WHITESPACE, PLACEHOLDER_STRING).replace(RE_TIDY_LEADING_WHITESPACE, PLACEHOLDER_STRING))
    };

    function toggleElementClass(elm, className, on) {
        var oldClassName = elm.className;
        var newClassName = toggleClass(oldClassName, className, on);
        if (newClassName != oldClassName) {
            elm.className = newClassName;
            elm.parentNode.className += EMPTY_STRING
        }
    };

    function toggleClass(classList, className, on) {
        var re = RegExp("(^|\\s)" + className + "(\\s|$)");
        var classExists = re.test(classList);
        if (on) {
            return classExists ? classList : classList + SPACE_STRING + className
        } else {
            return classExists ? trim(classList.replace(re, PLACEHOLDER_STRING)) : classList
        }
    };

    function addEvent(elm, eventName, eventHandler) {
        elm.attachEvent("on" + eventName, eventHandler)
    };

    function getXHRObject() {
        if (win.XMLHttpRequest) {
            return new XMLHttpRequest
        }
        try {
            return new ActiveXObject('Microsoft.XMLHTTP')
        } catch (e) {
            return null
        }
    };

    function loadStyleSheet(url) {
        xhr.open("GET", url, false);
        xhr.send();
        return (xhr.status == 200) ? xhr.responseText : EMPTY_STRING
    };

    function resolveUrl(url, contextUrl, ignoreSameOriginPolicy) {
        function getProtocol(url) {
            return url.substring(0, url.indexOf("//"))
        };

        function getProtocolAndHost(url) {
            return url.substring(0, url.indexOf("/", 8))
        };
        if (!contextUrl) {
            contextUrl = baseUrl
        }
        if (url.substring(0, 2) == "//") {
            url = getProtocol(contextUrl) + url
        }
        if (/^https?:\/\//i.test(url)) {
            return !ignoreSameOriginPolicy && getProtocolAndHost(contextUrl) != getProtocolAndHost(url) ? null : url
        }
        if (url.charAt(0) == "/") {
            return getProtocolAndHost(contextUrl) + url
        }
        var contextUrlPath = contextUrl.split(/[?#]/)[0];
        if (url.charAt(0) != "?" && contextUrlPath.charAt(contextUrlPath.length - 1) != "/") {
            contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1)
        }
        return contextUrlPath + url
    };

    function parseStyleSheet(url) {
        if (url) {
            return loadStyleSheet(url).replace(RE_COMMENT, EMPTY_STRING).replace(RE_IMPORT, function (match, quoteChar, importUrl, quoteChar2, importUrl2, media) {
                var cssText = parseStyleSheet(resolveUrl(importUrl || importUrl2, url));
                return (media) ? "@media " + media + " {" + cssText + "}" : cssText
            }).replace(RE_ASSET_URL, function (match, isBehavior, quoteChar, assetUrl) {
                quoteChar = quoteChar || EMPTY_STRING;
                return isBehavior ? match : " url(" + quoteChar + resolveUrl(assetUrl, url, true) + quoteChar + ") "
            })
        }
        return EMPTY_STRING
    };

    function getStyleSheets() {
        var url, stylesheet;
        for (var c = 0; c < doc.styleSheets.length; c++) {
            stylesheet = doc.styleSheets[c];
            if (stylesheet.href != EMPTY_STRING) {
                url = resolveUrl(stylesheet.href);
                if (url) {
                    stylesheet.cssText = stylesheet["rawCssText"] = patchStyleSheet(parseStyleSheet(url))
                }
            }
        }
    };

    function init() {
        applyPatches();
        if (enabledWatchers.length > 0) {
            setInterval(function () {
                for (var c = 0, cl = enabledWatchers.length; c < cl; c++) {
                    var e = enabledWatchers[c];
                    if (e.disabled !== e.$disabled) {
                        if (e.disabled) {
                            e.disabled = false;
                            e.$disabled = true;
                            e.disabled = true
                        } else {
                            e.$disabled = e.disabled
                        }
                    }
                }
            }, 250)
        }
    };var baseTags = doc.getElementsByTagName("BASE");
    var baseUrl = (baseTags.length > 0) ? baseTags[0].href : doc.location.href;
    getStyleSheets();
    ContentLoaded(win, function () {
        for (var engine in selectorEngines) {
            var members, member, context = win;
            if (win[engine]) {
                members = selectorEngines[engine].replace("*", engine).split(".");
                while ((member = members.shift()) && (context = context[member])) {
                }
                if (typeof context == "function") {
                    selectorMethod = context;
                    init();
                    return
                }
            }
        }
    });

    function ContentLoaded(win, fn) {
        var done = false, top = true, init = function (e) {
            if (e.type == "readystatechange" && doc.readyState != "complete") return;
            (e.type == "load" ? win : doc).detachEvent("on" + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e)
        }, poll = function () {
            try {
                root.doScroll("left")
            } catch (e) {
                setTimeout(poll, 50);
                return
            }
            init('poll')
        };
        if (doc.readyState == "complete") fn.call(win, EMPTY_STRING); else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !win.frameElement
                } catch (e) {
                }
                if (top) poll()
            }
            addEvent(doc, "readystatechange", init);
            addEvent(win, "load", init)
        }
    }
})(this);