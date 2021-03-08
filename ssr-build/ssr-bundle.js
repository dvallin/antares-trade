module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/antares-trade/",n(n.s="QfWi")}({HteQ:function(t,e){t.exports=require("preact")},Ncyu:function(t,e,n){},QfWi:function(t,e,n){"use strict";n.r(e);n("Wz0F"),n("Ncyu");var r=n("HteQ");function o(t){return"innerRadius"in t}function i(t,e,n,r){var o=t-n,i=e-r;return o*o+i*i}function s(t,e,n,r){return Math.sqrt(i(t,e,n,r))}function u(t,e,n,r){void 0===n&&(n=0),void 0===r&&(r=0);var o=t-n,i=e-r;return{radius:Math.sqrt(o*o+i*i),phi:Math.atan2(i,o)}}var c={lastUpdate:Date.now(),currentSystem:"sol",systems:{sol:{sol:{radius:0,phi:0,speed:0},mercury:{radius:192,phi:0,speed:5e-5},venus:{radius:360,phi:0,speed:1e-4},earth:{radius:498,phi:0,speed:1e-4,sub:{spaceStation1:{radius:.3,phi:0,speed:.01},moon:{radius:1.3,phi:0,speed:.001}}},mars:{radius:756,phi:0,speed:5e-5},asteroidBelt1:{innerRadius:850,outerRadius:2200},jupiter:{radius:2592,phi:0,speed:5e-5},saturn:{radius:4680,phi:0,speed:5e-5},uranus:{radius:9720,phi:0,speed:5e-5},neptune:{radius:14760,phi:0,speed:5e-5},pluto:{radius:19800,phi:0,speed:5e-5}}}},a=function(t,e,n){var r=t.starSystems.systems[e];if(void 0!==n){var i=function t(e,n){for(var r=0,i=Object.entries(e);r<i.length;r++){var s=i[r],u=s[0],c=s[1];if(!o(c)){if(u===n)return c;if(c.sub){var a=t(c.sub,n);if(a)return a}}}}(r,n);void 0!==i&&(void 0===i.sub&&(i.sub={}),r=i.sub)}return r},l=function(t,e,n){return function t(e,n){if(Object.keys(e).find((function(t){return t===n})))return e;for(var r=0,i=Object.values(e);r<i.length;r++){var s=i[r];if(!o(s)&&s.sub){var u=t(s.sub,n);if(void 0!==u)return u}}}(t.starSystems.systems[e],n)},f=function(t){var e=Date.now(),n=(e-t.starSystems.lastUpdate)/1e3;t.starSystems.lastUpdate=e,Object.values(t.starSystems.systems).forEach((function(t){return function t(e,n){Object.values(n).map((function(n){o(n)||(n.sub&&t(e,n.sub),n.phi+=n.speed*e)}))}(n,t)}))},p=function(t){return"string"==typeof t},d={lastUpdate:Date.now(),movements:{},positions:{sol:{system:"sol",x:0,y:0},mercury:{system:"sol",x:192,y:0},venus:{system:"sol",x:360,y:0},earth:{system:"sol",x:498,y:0},moon:{system:"sol",x:499.3,y:0},spaceStation1:{system:"sol",x:498.3,y:0},mars:{system:"sol",x:756,y:0},jupiter:{system:"sol",x:2592,y:0},saturn:{system:"sol",x:4680,y:0},uranus:{system:"sol",x:9720,y:0},neptune:{system:"sol",x:14760,y:0},pluto:{system:"sol",x:19800,y:0},ship1:{system:"sol",x:398,y:0},ship2:{system:"sol",x:756,y:50},ship3:{system:"sol",x:498,y:20}}},h=function t(e,n,r,i,s){void 0===i&&(i=0),void 0===s&&(s=0),Object.entries(r).map((function(r){var u=r[0],c=r[1];if(!o(c)){var a=y(e,u),l=function(t,e,n){return void 0===e&&(e=0),void 0===n&&(n=0),[t.radius*Math.cos(t.phi)+e,t.radius*Math.sin(t.phi)+n]}(c,i,s),f=l[0],p=l[1];c.sub&&t(e,n,c.sub,a.x,a.y),e.dynamics.positions[u]={system:a.system,x:f,y:p},c.sub&&function t(e,n,r,i){void 0===r&&(r=0),void 0===i&&(i=0),Object.entries(n).map((function(s){var u=s[0],c=s[1];if(!o(c)){var a=y(e,u),l=a.x+r,f=a.y+i;e.dynamics.positions[u]={system:a.system,x:l,y:f},c.sub&&t(e,n,r,i)}}))}(e,c.sub,f-a.x,p-a.y)}}))},y=function t(e,n){return p(n)?t(e,e.dynamics.positions[n]):n},m=function(t,e,n,r,o){if(!(e<=0)){var i=y(t,n),s=y(t,r),c=s.x-i.x,l=s.y-i.y,f=Math.sqrt(c*c+l*l),d=o*e;f<d?(p(r)||function(t,e,n,r){return function(o){var i=a(o,e,r),s=y(o,t),c=void 0!==r?y(o,r):{system:e,x:0,y:0},l=u(s.x,s.y,c.x,c.y);i[t]={radius:l.radius,phi:l.phi,speed:n}}}(n,r.system,5e-5,void 0)(t),t.dynamics.positions[n]=r,delete t.dynamics.movements[n]):(t.dynamics.positions[n]={system:i.system,x:i.x+c/f*d,y:i.y+l/f*d},t.dynamics.movements[n].eta=f/o)}},v=function(t){var e=Date.now(),n=(e-t.dynamics.lastUpdate)/1e3;t.dynamics.lastUpdate=e,Object.entries(t.dynamics.movements).forEach((function(e){var r=e[0],o=e[1];return m(t,n,r,o.to,o.v)})),Object.values(t.starSystems.systems).forEach((function(e){return h(t,n,e)}))};function b(t,e){return Object.entries(t.dynamics.positions).map((function(e){var n=e[0],r=e[1];return{id:n,position:y(t,r)}})).filter((function(n){var r=n.position;return y(t,r).system===e})).map((function(t){return t.id}))}function _(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){e.forEach((function(e){return e(t)}))}}var O=function(t,e,n){return _((function(e){return(n=t,r=e.starSystems.currentSystem,function(t){var e=l(t,r,n);e&&delete e[n]})(e);var n,r}),function(t,e,n){return function(r){r.dynamics.movements[t]={to:e,v:n,eta:0}}}(t,e,n))};function j(t){for(var e=arguments.length,n=Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];throw Error("[Immer] minified error nr: "+t+(n.length?" "+n.map((function(t){return"'"+t+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function g(t){return!!t&&!!t[ct]}function x(t){return!!t&&(function(t){if(!t||"object"!=typeof t)return!1;var e=Object.getPrototypeOf(t);return!e||e===Object.prototype}(t)||Array.isArray(t)||!!t[ut]||!!t.constructor[ut]||E(t)||N(t))}function S(t,e,n){void 0===n&&(n=!1),0===w(t)?(n?Object.keys:at)(t).forEach((function(r){n&&"symbol"==typeof r||e(r,t[r],t)})):t.forEach((function(n,r){return e(r,n,t)}))}function w(t){var e=t[ct];return e?e.i>3?e.i-4:e.i:Array.isArray(t)?1:E(t)?2:N(t)?3:0}function P(t,e){return 2===w(t)?t.has(e):Object.prototype.hasOwnProperty.call(t,e)}function k(t,e){return 2===w(t)?t.get(e):t[e]}function A(t,e,n){var r=w(t);2===r?t.set(e,n):3===r?(t.delete(e),t.add(n)):t[e]=n}function M(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e}function E(t){return rt&&t instanceof Map}function N(t){return ot&&t instanceof Set}function F(t){return t.o||t.t}function D(t){if(Array.isArray(t))return Array.prototype.slice.call(t);var e=lt(t);delete e[ct];for(var n=at(e),r=0;r<n.length;r++){var o=n[r],i=e[o];!1===i.writable&&(i.writable=!0,i.configurable=!0),(i.get||i.set)&&(e[o]={configurable:!0,writable:!0,enumerable:i.enumerable,value:t[o]})}return Object.create(Object.getPrototypeOf(t),e)}function H(t,e){return void 0===e&&(e=!1),C(t)||g(t)||!x(t)||(w(t)>1&&(t.set=t.add=t.clear=t.delete=R),Object.freeze(t),e&&S(t,(function(t,e){return H(e,!0)}),!0)),t}function R(){j(2)}function C(t){return null==t||"object"!=typeof t||Object.isFrozen(t)}function W(t){var e=ft[t];return e||j(18,t),e}function T(){return et}function U(t,e){e&&(W("Patches"),t.u=[],t.s=[],t.v=e)}function z(t){I(t),t.p.forEach(X),t.p=null}function I(t){t===et&&(et=t.l)}function B(t){return et={p:[],l:et,h:t,m:!0,_:0}}function X(t){var e=t[ct];0===e.i||1===e.i?e.j():e.g=!0}function Y(t,e){e._=e.p.length;var n=e.p[0],r=void 0!==t&&t!==n;return e.h.O||W("ES5").S(e,t,r),r?(n[ct].P&&(z(e),j(4)),x(t)&&(t=q(e,t),e.l||Q(e,t)),e.u&&W("Patches").M(n[ct],t,e.u,e.s)):t=q(e,n,[]),z(e),e.u&&e.v(e.u,e.s),t!==st?t:void 0}function q(t,e,n){if(C(e))return e;var r=e[ct];if(!r)return S(e,(function(o,i){return K(t,r,e,o,i,n)}),!0),e;if(r.A!==t)return e;if(!r.P)return Q(t,r.t,!0),r.t;if(!r.I){r.I=!0,r.A._--;var o=4===r.i||5===r.i?r.o=D(r.k):r.o;S(3===r.i?new Set(o):o,(function(e,i){return K(t,r,o,e,i,n)})),Q(t,o,!1),n&&t.u&&W("Patches").R(r,n,t.u,t.s)}return r.o}function K(t,e,n,r,o,i){if(g(o)){var s=q(t,o,i&&e&&3!==e.i&&!P(e.D,r)?i.concat(r):void 0);if(A(n,r,s),!g(s))return;t.m=!1}if(x(o)&&!C(o)){if(!t.h.N&&t._<1)return;q(t,o),e&&e.A.l||Q(t,o)}}function Q(t,e,n){void 0===n&&(n=!1),t.h.N&&t.m&&H(e,n)}function $(t,e){var n=t[ct];return(n?F(n):t)[e]}function J(t,e){if(e in t)for(var n=Object.getPrototypeOf(t);n;){var r=Object.getOwnPropertyDescriptor(n,e);if(r)return r;n=Object.getPrototypeOf(n)}}function V(t){t.P||(t.P=!0,t.l&&V(t.l))}function G(t){t.o||(t.o=D(t.t))}function L(t,e,n){var r=E(e)?W("MapSet").T(e,n):N(e)?W("MapSet").F(e,n):t.O?function(t,e){var n=Array.isArray(t),r={i:n?1:0,A:e?e.A:T(),P:!1,I:!1,D:{},l:e,t:t,k:null,o:null,j:null,C:!1},o=r,i=pt;n&&(o=[r],i=dt);var s=Proxy.revocable(o,i),u=s.revoke,c=s.proxy;return r.k=c,r.j=u,c}(e,n):W("ES5").J(e,n);return(n?n.A:T()).p.push(r),r}function Z(t,e){switch(e){case 2:return new Map(t);case 3:return Array.from(t)}return D(t)}var tt,et,nt="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),rt="undefined"!=typeof Map,ot="undefined"!=typeof Set,it="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,st=nt?Symbol.for("immer-nothing"):((tt={})["immer-nothing"]=!0,tt),ut=nt?Symbol.for("immer-draftable"):"__$immer_draftable",ct=nt?Symbol.for("immer-state"):"__$immer_state",at=("undefined"!=typeof Symbol&&Symbol.iterator,"undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:Object.getOwnPropertyNames),lt=Object.getOwnPropertyDescriptors||function(t){var e={};return at(t).forEach((function(n){e[n]=Object.getOwnPropertyDescriptor(t,n)})),e},ft={},pt={get:function(t,e){if(e===ct)return t;var n=F(t);if(!P(n,e))return function(t,e,n){var r,o=J(e,n);return o?"value"in o?o.value:null===(r=o.get)||void 0===r?void 0:r.call(t.k):void 0}(t,n,e);var r=n[e];return t.I||!x(r)?r:r===$(t.t,e)?(G(t),t.o[e]=L(t.A.h,r,t)):r},has:function(t,e){return e in F(t)},ownKeys:function(t){return Reflect.ownKeys(F(t))},set:function(t,e,n){var r=J(F(t),e);if(null==r?void 0:r.set)return r.set.call(t.k,n),!0;if(!t.P){var o=$(F(t),e),i=null==o?void 0:o[ct];if(i&&i.t===n)return t.o[e]=n,t.D[e]=!1,!0;if(M(n,o)&&(void 0!==n||P(t.t,e)))return!0;G(t),V(t)}return t.o[e]=n,t.D[e]=!0,!0},deleteProperty:function(t,e){return void 0!==$(t.t,e)||e in t.t?(t.D[e]=!1,G(t),V(t)):delete t.D[e],t.o&&delete t.o[e],!0},getOwnPropertyDescriptor:function(t,e){var n=F(t),r=Reflect.getOwnPropertyDescriptor(n,e);return r?{writable:!0,configurable:1!==t.i||"length"!==e,enumerable:r.enumerable,value:n[e]}:r},defineProperty:function(){j(11)},getPrototypeOf:function(t){return Object.getPrototypeOf(t.t)},setPrototypeOf:function(){j(12)}},dt={};S(pt,(function(t,e){dt[t]=function(){return arguments[0]=arguments[0][0],e.apply(this,arguments)}})),dt.deleteProperty=function(t,e){return pt.deleteProperty.call(this,t[0],e)},dt.set=function(t,e,n){return pt.set.call(this,t[0],e,n,t[0])};var ht=new(function(){function t(t){this.O=it,this.N=!0,"boolean"==typeof(null==t?void 0:t.useProxies)&&this.setUseProxies(t.useProxies),"boolean"==typeof(null==t?void 0:t.autoFreeze)&&this.setAutoFreeze(t.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this)}var e=t.prototype;return e.produce=function(t,e,n){if("function"==typeof t&&"function"!=typeof e){var r=e;e=t;var o=this;return function(t){var n=this;void 0===t&&(t=r);for(var i=arguments.length,s=Array(i>1?i-1:0),u=1;u<i;u++)s[u-1]=arguments[u];return o.produce(t,(function(t){var r;return(r=e).call.apply(r,[n,t].concat(s))}))}}var i;if("function"!=typeof e&&j(6),void 0!==n&&"function"!=typeof n&&j(7),x(t)){var s=B(this),u=L(this,t,void 0),c=!0;try{i=e(u),c=!1}finally{c?z(s):I(s)}return"undefined"!=typeof Promise&&i instanceof Promise?i.then((function(t){return U(s,n),Y(t,s)}),(function(t){throw z(s),t})):(U(s,n),Y(i,s))}if(!t||"object"!=typeof t){if((i=e(t))===st)return;return void 0===i&&(i=t),this.N&&H(i,!0),i}j(21,t)},e.produceWithPatches=function(t,e){var n,r,o=this;return"function"==typeof t?function(e){for(var n=arguments.length,r=Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return o.produceWithPatches(e,(function(e){return t.apply(void 0,[e].concat(r))}))}:[this.produce(t,e,(function(t,e){n=t,r=e})),n,r]},e.createDraft=function(t){x(t)||j(8),g(t)&&(t=function(t){return g(t)||j(22,t),function t(e){if(!x(e))return e;var n,r=e[ct],o=w(e);if(r){if(!r.P&&(r.i<4||!W("ES5").K(r)))return r.t;r.I=!0,n=Z(e,o),r.I=!1}else n=Z(e,o);return S(n,(function(e,o){r&&k(r.t,e)===o||A(n,e,t(o))})),3===o?new Set(n):n}(t)}(t));var e=B(this),n=L(this,t,void 0);return n[ct].C=!0,I(e),n},e.finishDraft=function(t,e){var n=(t&&t[ct]).A;return U(n,e),Y(void 0,n)},e.setAutoFreeze=function(t){this.N=t},e.setUseProxies=function(t){t&&!it&&j(20),this.O=t},e.applyPatches=function(t,e){var n;for(n=e.length-1;n>=0;n--){var r=e[n];if(0===r.path.length&&"replace"===r.op){t=r.value;break}}var o=W("Patches").$;return g(t)?o(t,e):this.produce(t,(function(t){return o(t,e.slice(n+1))}))},t}()),yt=ht.produce;ht.produceWithPatches.bind(ht),ht.setAutoFreeze.bind(ht),ht.setUseProxies.bind(ht),ht.applyPatches.bind(ht),ht.createDraft.bind(ht),ht.finishDraft.bind(ht);function mt(t,e,n,r,o,i,s){void 0===s&&(s=.1);var u=t.w*Math.sign(-e)*s,c=t.h*Math.sign(-e)*s,a=u*n/o,l=c*r/i;return{x:t.x+a,y:t.y+l,w:t.w-u,h:t.h-c}}function vt(t,e,n,r){return void 0===r&&(r=.002),{x:t.x-e*t.w*r,y:t.y-n*t.h*r,w:t.w,h:t.h}}var bt,_t,Ot,jt={selected:void 0,state:void 0,subState:void 0,focused:void 0,viewBox:{x:-1e3,y:-1e3,w:2e3,h:2e3}},gt=function(t){return function(e){e.map.selected=t,e.map.focused=t}},xt=function(t){return function(e){e.map.viewBox=t}},St=function(t,e){return _((function(n){var r=n.map.selected;r&&O(r,t,e)(n)}),(function(t){delete t.map.state,delete t.map.subState,t.map.focused=t.map.selected}))},wt=function(t){if(void 0!==t.map.focused){var e=y(t,t.map.focused);void 0!==e&&(t.map.viewBox=(n=t.map.viewBox,r=e.x,o=e.y,yt(n,(function(t){t.x=r-t.w/2,t.y=o-t.h/2}))))}var n,r,o},Pt=0,kt=[],At=r.options.__b,Mt=r.options.__r,Et=r.options.diffed,Nt=r.options.__c,Ft=r.options.unmount;function Dt(t,e){r.options.__h&&r.options.__h(_t,t,Pt||e),Pt=0;var n=_t.__H||(_t.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({}),n.__[t]}function Ht(t){return Pt=1,Rt(Bt,t)}function Rt(t,e,n){var r=Dt(bt++,2);return r.t=t,r.__c||(r.__=[n?n(e):Bt(void 0,e),function(t){var e=r.t(r.__[0],t);r.__[0]!==e&&(r.__=[e,r.__[1]],r.__c.setState({}))}],r.__c=_t),r.__}function Ct(t,e){var n=Dt(bt++,7);return It(n.__H,e)&&(n.__=t(),n.__H=e,n.__h=t),n.__}function Wt(){kt.forEach((function(t){if(t.__P)try{t.__H.__h.forEach(Ut),t.__H.__h.forEach(zt),t.__H.__h=[]}catch(e){t.__H.__h=[],r.options.__e(e,t.__v)}})),kt=[]}r.options.__b=function(t){_t=null,At&&At(t)},r.options.__r=function(t){Mt&&Mt(t),bt=0;var e=(_t=t.__c).__H;e&&(e.__h.forEach(Ut),e.__h.forEach(zt),e.__h=[])},r.options.diffed=function(t){Et&&Et(t);var e=t.__c;e&&e.__H&&e.__H.__h.length&&(1!==kt.push(e)&&Ot===r.options.requestAnimationFrame||((Ot=r.options.requestAnimationFrame)||function(t){var e,n=function(){clearTimeout(r),Tt&&cancelAnimationFrame(e),setTimeout(t)},r=setTimeout(n,100);Tt&&(e=requestAnimationFrame(n))})(Wt)),_t=void 0},r.options.__c=function(t,e){e.some((function(t){try{t.__h.forEach(Ut),t.__h=t.__h.filter((function(t){return!t.__||zt(t)}))}catch(n){e.some((function(t){t.__h&&(t.__h=[])})),e=[],r.options.__e(n,t.__v)}})),Nt&&Nt(t,e)},r.options.unmount=function(t){Ft&&Ft(t);var e=t.__c;if(e&&e.__H)try{e.__H.__.forEach(Ut)}catch(t){r.options.__e(t,e.__v)}};var Tt="function"==typeof requestAnimationFrame;function Ut(t){var e=_t;"function"==typeof t.__c&&t.__c(),_t=e}function zt(t){var e=_t;t.__c=t.__(),_t=e}function It(t,e){return!t||t.length!==e.length||e.some((function(e,n){return e!==t[n]}))}function Bt(t,e){return"function"==typeof e?e(t):e}var Xt=function(t){return{name:t}},Yt={type:"planet",radius:.008},qt={type:"planet",radius:.008},Kt={type:"gas-giant",radius:.23},Qt={type:"artificial",radius:1e-5},$t={starSystems:c,map:jt,names:{names:{sol:Xt("Sol"),mercury:Xt("Mercury"),venus:Xt("Venus"),earth:Xt("Earth"),mars:Xt("Mars"),jupiter:Xt("Jupiter"),saturn:Xt("Saturn"),uranus:Xt("Uranus"),neptune:Xt("Neptune"),pluto:Xt("Pluto"),moon:Xt("Moon"),ship1:Xt("Pirate Interceptor"),ship2:Xt("Frigate Mk1"),ship3:Xt("Heavy Freighter Mk2"),spaceStation1:Xt("Earth Trading Station")}},bodies:{bodies:{sol:{type:"star",radius:2.3},mercury:Yt,venus:qt,earth:qt,moon:{type:"moon",radius:.006},mars:qt,jupiter:Kt,saturn:Kt,uranus:Kt,neptune:Kt,pluto:Yt,ship1:Qt,ship2:Qt,ship3:Qt,spaceStation1:{type:"artificial",radius:1e-4}}},dynamics:d,ships:{controllable:{ship1:{by:"ai"},ship2:{by:"player"},ship3:{by:"player"},spaceStation1:{by:"ai"}},specs:{ship1:{type:"fighter",speed:.7},ship2:{type:"fighter",speed:.6},ship3:{type:"freighter",speed:.2},spaceStation1:{type:"station",speed:.01}}}},Jt=Object(r.createContext)([$t,function(){}]);function Vt(t){var e=Rt((function(e,n){var r=yt(e,(function(t){n(t)}));return t.onChange&&t.onChange(r),r}),t.initialState?t.initialState():$t),n=e[0],o=e[1];return Object(r.h)(Jt.Provider,{value:[n,o]},t.children)}function Gt(){return function(t){var e=_t.context[t.__c],n=Dt(bt++,9);return n.__c=t,e?(null==n.__&&(n.__=!0,e.sub(_t)),e.props.value):t.__}(Jt)}function Lt(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function Zt(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?Lt(Object(n),!0).forEach((function(e){te(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Lt(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function te(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var ee="#f1f1f1",ne="#98de00",re="#fd5d77",oe="#473b6b",ie={vectorEffect:"non-scaling-stroke"},se=function(t){return Object(r.h)("path",{className:"belt",fill:"url(#asteroids)",d:"\nM "+t.cx+", "+t.cy+" \nm 0 -"+t.outerRadius+"\na "+t.outerRadius+" "+t.outerRadius+" 0 1 0 1 0\nz\nm -1 "+(t.outerRadius-t.innerRadius)+"    \na "+t.innerRadius+" "+t.innerRadius+" 0 1 1 -1 0     \nZ",style:ie})},ue=function t(e){var n=Gt()[0];return Object(r.h)("g",null,Object.entries(e.system).map((function(i){var s=i[0],u=i[1];if(o(u))return Object(r.h)("g",{id:s},Object(r.h)(se,{innerRadius:u.innerRadius,outerRadius:u.outerRadius,cx:e.cx,cy:e.cy}));var c=y(n,s);return Object(r.h)("g",{id:s},Object(r.h)("circle",{id:s+"-orbit",cx:e.cx,cy:e.cy,r:u.radius,fill:"none",style:ie}),u.sub&&Object(r.h)(t,{system:u.sub,cx:c.x,cy:c.y}))})))},ce=function(){var t=Gt(),e=t[0],n=t[1],o=function(t,e){return Object.entries(t.dynamics.movements).map((function(e){var n=e[0],r=e[1];return{id:n,from:y(t,n),to:y(t,r.to)}})).filter((function(t){var n=t.from,r=t.to;return n.system===e||r.system===e}))}(e,e.starSystems.currentSystem);return Object(r.h)("g",null,o.map((function(t){var o=t.id,i=t.from,s=t.to;return Object(r.h)("g",{key:o},Object(r.h)("line",{onClick:function(t){void 0===e.map.state&&(t.stopPropagation(),n(gt(o)))},id:o+"-trajectory",x1:i.x,y1:i.y,x2:s.x,y2:s.y,style:Zt(Zt({},ie),{},{stroke:ne,strokeDasharray:"4",strokeWidth:3,pointerEvents:"auto"})}))})))},ae=function(){var t=Gt(),e=t[0],n=t[1],o=b(e,e.starSystems.currentSystem);return Object(r.h)("g",null,o.map((function(t){var o=y(e,t),i=e.bodies.bodies[t];return Object(r.h)("g",{key:t,id:t},Object(r.h)("circle",{id:t+"-body",cx:o.x,cy:o.y,r:i.radius,fill:re,stroke:ee,style:Zt(Zt({},ie),{},{strokeWidth:e.map.selected?2:0})}),Object(r.h)("circle",{id:t+"-body-bounding-box",onClick:function(r){if(void 0===e.map.state)r.stopPropagation(),n(gt(t));else if("select_dockable_location"===e.map.subState){var o=e.map.selected;void 0!==o&&t!==o&&(r.stopPropagation(),n(St(t,e.ships.specs[o].speed)))}},cx:o.x,cy:o.y,r:2*i.radius,fill:"none",stroke:"none",style:{pointerEvents:"visible"}}))})))};function le(t){return[[t.clientX,t.clientY]]}function fe(t){for(var e=[],n=0;n<t.touches.length;n++){var r=t.touches[n];e.push([r.clientX,r.clientY])}return e}var pe=function(){var t=Gt(),e=t[0],n=t[1],o=Ht(void 0),i=o[0],u=o[1],c=function(t){return Pt=5,Ct((function(){return{current:t}}),[])}(null),a=e.map.viewBox,l=a.w/800,f=a.h/800;return Object(r.h)("svg",{viewBox:a.x+" "+a.y+" "+a.w+" "+a.h,ref:c,onWheel:function(t){n(xt(mt(a,t.deltaY,t.offsetX,t.offsetY,c.current.clientWidth,c.current.clientHeight))),t.preventDefault()},onClick:function(t){if(!i&&void 0!==e.map.subState&&"select_navigable_location"===e.map.subState){var r,o=c.current.createSVGPoint();o.x=t.x,o.y=t.y;var s=o.matrixTransform(null==(r=c.current.getScreenCTM())?void 0:r.inverse()),a=e.map.selected;void 0!==a&&n(St({system:e.starSystems.currentSystem,x:s.x,y:s.y},e.ships.specs[a].speed))}u(void 0)},onTouchStart:function(t){u(fe(t))},onTouchMove:function(t){if(i&&t.touches.length>0){if(1===t.touches.length&&1===i.length){var e=t.touches[0];n(xt(vt(a,e.clientX-i[0][0],e.clientY-i[0][1])))}else if(t.touches.length>1&&i.length===t.touches.length){var r=t.touches[0],o=t.touches[1],l=s(i[0][0],i[0][1],i[1][0],i[1][1]),f=s(r.clientX,r.clientY,o.clientX,o.clientY);n(xt(mt(a,l-f,r.clientX,r.clientY,c.current.clientWidth,c.current.clientHeight)))}u(fe(t)),t.preventDefault()}},onTouchCancel:function(){return u(void 0)},onTouchEnd:function(){return u(void 0)},onMouseDown:function(t){void 0===e.map.state&&n((function(t){delete t.map.selected,delete t.map.focused})),u(le(t))},onMouseUp:function(){return u(void 0)},onMouseLeave:function(){return u(void 0)},onMouseMove:function(t){i&&(n(xt(vt(a,t.movementX,t.movementY))),u(le(t)))}},Object(r.h)("pattern",{id:"asteroids",x:"0",y:"0",width:10*l,height:10*f,patternUnits:"userSpaceOnUse"},Object(r.h)("rect",{x:6*l,y:-5*f,width:2*l,height:2*f,transform:"rotate(45)",style:ie,fill:oe,stroke:oe})),Object(r.h)("g",null,Object(r.h)(ue,{system:e.starSystems.systems[e.starSystems.currentSystem],cx:0,cy:0}),Object(r.h)(ae,null),Object(r.h)(ce,null)))};var de=function(t){var e=Gt()[0],n=Ht([]),o=n[0],i=n[1];return Object(r.h)("div",{class:"list-group"},Object(r.h)("div",{class:"btn-group",role:"group","aria-label":"Basic example"},Object(r.h)("button",{type:"button",class:"btn btn-primary",onClick:function(){return i([])}},"all"),Object(r.h)("button",{type:"button",class:"btn btn-primary",onClick:function(){return i(["fighter","freighter"])}},"ships"),Object(r.h)("button",{type:"button",class:"btn btn-primary",onClick:function(){return i(["station"])}},"stations"),Object(r.h)("button",{type:"button",class:"btn btn-primary",onClick:function(){return i(["star","gas-giant","moon","planet"])}},"bodies")),t.objects.filter((function(t){var n;return 0===o.length||o.includes(e.bodies.bodies[t].type)||o.includes(null==(n=e.ships.specs[t])?void 0:n.type)})).sort((function(t){var n;return"player"===(null==(n=e.ships.controllable[t])?void 0:n.by)?1:2})).map((function(n){var o,i,s="player"===(null==(o=e.ships.controllable[n])?void 0:o.by)?"font-weight-bold":"font-weight-normal";return Object(r.h)("a",{href:"#",class:"list-group-item list-group-item-action "+s,key:n,onClick:function(){return t.onSelect(n)},style:{cursor:"pointer"}},function(t,e){switch(t.bodies.bodies[e].type){case"artificial":switch(t.ships.specs[e].type){case"fighter":return"≛";case"freighter":return"⊔";case"station":return"⌂"}break;case"gas-giant":return"♄";case"moon":return"☽︎";case"planet":return"♁";case"star":return"☉"}}(e,n)," ",(null==(i=e.names.names[n])?void 0:i.name)||n)})))},he=function(t){var e=Gt()[0];return Object(r.h)(de,{onSelect:t.onSelect,objects:b(e,e.starSystems.currentSystem)})},ye=function(t){var e=Gt()[0],n=e.map.selected||"",o=y(e,n),s=o?function(t,e){return Object.entries(t.dynamics.positions).map((function(e){var n=e[0],r=e[1];return{id:n,position:y(t,r)}})).filter((function(t){return t.position.system===e.system})).map((function(t){var n=t.id,r=t.position;return{id:n,dist:i(r.x,r.y,e.x,e.y)}})).sort((function(t,e){return t.dist-e.dist})).map((function(t){return t.id}))}(e,o):[];return Object(r.h)(de,{onSelect:t.onSelect,objects:s.filter((function(t){return t!==n}))})},me=function(t){if(p(t.location)){var e,n=Gt()[0];return Object(r.h)("span",null,(null==(e=n.names.names[t.location])?void 0:e.name)||"unkown location")}var o=u(t.location.x,t.location.y);return Object(r.h)(r.Fragment,null,t.location.system," (",Object(r.h)("span",null,o.radius.toFixed(0)),"ls,",Object(r.h)("span",null,o.phi.toFixed(2)),"θ)")};var ve=Object(r.h)("div",null,"select a navigable location from the map"),be=function(){var t=Gt(),e=t[0],n=t[1],o=e.map.selected;if(!o)return Object(r.h)("span",null,"Nothing selected");switch(e.map.state){case"dock_at":return function(t,e,n){return Object(r.h)("div",null,Object(r.h)(ye,{onSelect:function(r){n(St(r,e.ships.specs[t].speed))}}))}(o,e,n);case"move_to":return ve;default:return function(t,e,n){var o,i,s,u=e.names.names[t],c=e.dynamics.positions[t],a=e.dynamics.movements[t],l=e.ships.controllable[t];return Object(r.h)("div",{className:"container"},Object(r.h)("div",{className:"row"},Object(r.h)("h1",{className:"col-sm-auto",onClick:function(){return n((function(t){delete t.map.selected,delete t.map.focused}))},style:{cursor:"pointer"}},"<<"),u?Object(r.h)("h1",{className:"col-sm"},u.name):Object(r.h)(r.Fragment,null)),Object(r.h)("div",{className:"row"},c?Object(r.h)("p",{class:"lead col-sm"},Object(r.h)(me,{location:c})):Object(r.h)(r.Fragment,null)),Object(r.h)("div",{className:"row"},a?Object(r.h)("p",{className:"col-sm"},"traveling to ",Object(r.h)(me,{location:a.to})," ETA ",(o={seconds:a.eta},i=function(t){var e={seconds:t.seconds||0,minutes:t.minutes||0,hours:t.hours||0,days:t.days||0};return e.seconds>=60&&(e.minutes+=e.seconds/60,e.seconds%=60),e.minutes>=60&&(e.hours+=e.hours/60,e.minutes%=60),e.hours>=24&&(e.days+=e.days/24,e.days%=24),e}(o),s="",i.days>0&&(s+=i.days.toFixed(0)+"d"),i.hours>0&&(s+=i.hours.toFixed(0)+"h"),i.minutes>0&&(s+=i.minutes.toFixed(0)+"m"),i.seconds>0&&(s+=i.seconds.toFixed(0)+"s"),s)):Object(r.h)(r.Fragment,null)),Object(r.h)("div",{className:"row"},void 0!==l&&"player"===l.by?Object(r.h)("div",{className:"col-sm"},Object(r.h)("div",null,"you own this ship"),Object(r.h)("div",{class:"btn-group mr-2",role:"group","aria-label":"First group"},Object(r.h)("button",{class:"btn btn-primary",onClick:function(){return n((function(t){t.map.state="move_to",t.map.subState="select_navigable_location",delete t.map.focused}))}},"move to"),Object(r.h)("button",{class:"btn btn-primary",onClick:function(){return n((function(t){t.map.state="dock_at",t.map.subState="select_dockable_location",delete t.map.focused}))}},"dock at"))):Object(r.h)("div",{className:"col-sm"},"owned by ",(null==l?void 0:l.by)||"noone")))}(o,e,n)}},_e=function(){var t=Gt(),e=t[0],n=t[1];return e.map.selected?Object(r.h)(be,null):Object(r.h)(he,{onSelect:function(t){return n(gt(t))}})},Oe=function(){var t,e=Gt()[0],n=[(t=e.map.viewBox).x+t.w/2,t.y+t.h/2],o={system:e.starSystems.currentSystem,x:n[0],y:n[1]};return Object(r.h)("h1",{className:"text-center"},Object(r.h)(me,{location:o}))},je=function(){var t,e,n,o=Gt()[1];return t=function(){o(O("ship2","earth",.7));var t=setInterval((function(){o(_(f,v,wt))}),10);return function(){return clearInterval(t)}},e=[o],n=Dt(bt++,3),!r.options.__s&&It(n.__H,e)&&(n.__=t,n.__H=e,_t.__H.__h.push(n)),Object(r.h)("div",{className:"container-fluid"},Object(r.h)("div",{className:"row"},Object(r.h)("div",{className:"col"},Object(r.h)(Oe,null))),Object(r.h)("div",{className:"row"},Object(r.h)("div",{className:"col-lg-9 order-first order-lg-last"},Object(r.h)(pe,null)),Object(r.h)("div",{className:"col-lg-3 "},Object(r.h)(_e,null))))};e.default=function(){return Object(r.h)(Vt,null,Object(r.h)(je,null))}},Wz0F:function(t,e,n){}});
//# sourceMappingURL=ssr-bundle.js.map