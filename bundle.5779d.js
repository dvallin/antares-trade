!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(t){return e[t]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/antares-trade/",t(t.s="mdyV")}({Ncyu:function(){},QfWi:function(e,t,n){"use strict";function r(e){return"innerRadius"in e}function o(e,t,n,r){var o=e-n,i=t-r;return o*o+i*i}function i(e,t,n,r){return Math.sqrt(o(e,t,n,r))}function u(e,t,n,r){void 0===n&&(n=0),void 0===r&&(r=0);var o=e-n,i=t-r;return{radius:Math.sqrt(o*o+i*i),phi:Math.atan2(i,o)}}function c(e,t){return Object.entries(e.dynamics.positions).map((function(t){return{id:t[0],position:he(e,t[1])}})).filter((function(n){return he(e,n.position).system===t})).map((function(e){return e.id}))}function s(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){t.forEach((function(t){return t(e)}))}}function a(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];throw Error("[Immer] minified error nr: "+e+(n.length?" "+n.map((function(e){return"'"+e+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function l(e){return!!e&&!!e[Pe]}function f(e){return!!e&&(function(e){if(!e||"object"!=typeof e)return!1;var t=Object.getPrototypeOf(e);return!t||t===Object.prototype}(e)||Array.isArray(e)||!!e[ke]||!!e.constructor[ke]||m(e)||b(e))}function _(e,t,n){void 0===n&&(n=!1),0===p(e)?(n?Object.keys:we)(e).forEach((function(r){n&&"symbol"==typeof r||t(r,e[r],e)})):e.forEach((function(n,r){return t(r,n,e)}))}function p(e){var t=e[Pe];return t?t.i>3?t.i-4:t.i:Array.isArray(e)?1:m(e)?2:b(e)?3:0}function d(e,t){return 2===p(e)?e.has(t):Object.prototype.hasOwnProperty.call(e,t)}function y(e,t){return 2===p(e)?e.get(t):e[t]}function h(e,t,n){var r=p(e);2===r?e.set(t,n):3===r?(e.delete(t),e.add(n)):e[t]=n}function v(e,t){return e===t?0!==e||1/e==1/t:e!=e&&t!=t}function m(e){return Oe&&e instanceof Map}function b(e){return je&&e instanceof Set}function g(e){return e.o||e.t}function O(e){if(Array.isArray(e))return Array.prototype.slice.call(e);var t=Ce(e);delete t[Pe];for(var n=we(t),r=0;r<n.length;r++){var o=n[r],i=t[o];!1===i.writable&&(i.writable=!0,i.configurable=!0),(i.get||i.set)&&(t[o]={configurable:!0,writable:!0,enumerable:i.enumerable,value:e[o]})}return Object.create(Object.getPrototypeOf(e),t)}function j(e,t){return void 0===t&&(t=!1),S(e)||l(e)||!f(e)||(p(e)>1&&(e.set=e.add=e.clear=e.delete=x),t&&_(e,(function(e,t){return j(t,!0)}),!0)),e}function x(){a(2)}function S(e){return null==e||"object"!=typeof e||Object.isFrozen(e)}function k(e){var t=Ae[e];return t||a(18,e),t}function P(){return ce}function w(e,t){t&&(k("Patches"),e.u=[],e.s=[],e.v=t)}function C(e){A(e),e.p.forEach(E),e.p=null}function A(e){e===ce&&(ce=e.l)}function D(e){return ce={p:[],l:ce,h:e,m:!0,_:0}}function E(e){var t=e[Pe];0===t.i||1===t.i?t.j():t.g=!0}function M(e,t){t._=t.p.length;var n=t.p[0],r=void 0!==e&&e!==n;return t.h.O||k("ES5").S(t,e,r),r?(n[Pe].P&&(C(t),a(4)),f(e)&&(e=N(t,e),t.l||T(t,e)),t.u&&k("Patches").M(n[Pe],e,t.u,t.s)):e=N(t,n,[]),C(t),t.u&&t.v(t.u,t.s),e!==Se?e:void 0}function N(e,t,n){if(S(t))return t;var r=t[Pe];if(!r)return _(t,(function(o,i){return F(e,r,t,o,i,n)}),!0),t;if(r.A!==e)return t;if(!r.P)return T(e,r.t,!0),r.t;if(!r.I){r.I=!0,r.A._--;var o=4===r.i||5===r.i?r.o=O(r.k):r.o;_(3===r.i?new Set(o):o,(function(t,i){return F(e,r,o,t,i,n)})),T(e,o,!1),n&&e.u&&k("Patches").R(r,n,e.u,e.s)}return r.o}function F(e,t,n,r,o,i){if(l(o)){var u=N(e,o,i&&t&&3!==t.i&&!d(t.D,r)?i.concat(r):void 0);if(h(n,r,u),!l(u))return;e.m=!1}if(f(o)&&!S(o)){if(!e.h.N&&e._<1)return;N(e,o),t&&t.A.l||T(e,o)}}function T(e,t,n){void 0===n&&(n=!1),e.h.N&&e.m&&j(t,n)}function R(e,t){var n=e[Pe];return(n?g(n):e)[t]}function U(e,t){if(t in e)for(var n=Object.getPrototypeOf(e);n;){var r=Object.getOwnPropertyDescriptor(n,t);if(r)return r;n=Object.getPrototypeOf(n)}}function W(e){e.P||(e.P=!0,e.l&&W(e.l))}function H(e){e.o||(e.o=O(e.t))}function I(e,t,n){var r=m(t)?k("MapSet").T(t,n):b(t)?k("MapSet").F(t,n):e.O?function(e,t){var n=Array.isArray(e),r={i:n?1:0,A:t?t.A:P(),P:!1,I:!1,D:{},l:t,t:e,k:null,o:null,j:null,C:!1},o=r,i=De;n&&(o=[r],i=Ee);var u=Proxy.revocable(o,i),c=u.revoke,s=u.proxy;return r.k=s,r.j=c,s}(t,n):k("ES5").J(t,n);return(n?n.A:P()).p.push(r),r}function L(e,t){switch(t){case 2:return new Map(e);case 3:return Array.from(e)}return O(e)}function B(e,t,n,r,o,i,u){void 0===u&&(u=.1);var c=e.w*Math.sign(-t)*u,s=e.h*Math.sign(-t)*u;return{x:e.x+c*n/o,y:e.y+s*r/i,w:e.w-c,h:e.h-s}}function z(e,t,n,r){return void 0===r&&(r=.002),{x:e.x-t*e.w*r,y:e.y-n*e.h*r,w:e.w,h:e.h}}function X(e,t){se.e.__h&&se.e.__h(Ne,e,Be||t),Be=0;var n=Ne.__H||(Ne.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function Y(e){return Be=1,q(Q,e)}function q(e,t,n){var r=X(Me++,2);return r.t=e,r.__c||(r.__=[n?n(t):Q(void 0,t),function(e){var t=r.t(r.__[0],e);r.__[0]!==t&&(r.__=[t,r.__[1]],r.__c.setState({}))}],r.__c=Ne),r.__}function K(e,t){var n=X(Me++,7);return J(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function V(){ze.forEach((function(e){if(e.__P)try{e.__H.__h.forEach($),e.__H.__h.forEach(G),e.__H.__h=[]}catch(t){e.__H.__h=[],se.e.__e(t,e.__v)}})),ze=[]}function $(e){var t=Ne;"function"==typeof e.__c&&e.__c(),Ne=t}function G(e){var t=Ne;e.__c=e.__(),Ne=t}function J(e,t){return!e||e.length!==t.length||t.some((function(t,n){return t!==e[n]}))}function Q(e,t){return"function"==typeof t?t(e):t}function Z(e){var t=q((function(t,n){var r=Re(t,(function(e){n(e)}));return e.onChange&&e.onChange(r),r}),e.initialState?e.initialState():tt),n=t[0],r=t[1];return Object(se.c)(nt.Provider,{value:[n,r]},e.children)}function ee(){return function(e){var t=Ne.context[e.__c],n=X(Me++,9);return n.__c=e,t?(null==n.__&&(n.__=!0,t.sub(Ne)),t.props.value):e.__}(nt)}function te(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ne(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?te(Object(n),!0).forEach((function(t){re(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):te(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function re(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function oe(e){return[[e.clientX,e.clientY]]}function ie(e){for(var t=[],n=0;n<e.touches.length;n++){var r=e.touches[n];t.push([r.clientX,r.clientY])}return t}n.r(t);n("Wz0F"),n("Ncyu");var ue,ce,se=n("hosL"),ae={lastUpdate:Date.now(),currentSystem:"sol",systems:{sol:{sol:{radius:0,phi:0,speed:0},mercury:{radius:192,phi:0,speed:5e-5},venus:{radius:360,phi:0,speed:1e-4},earth:{radius:498,phi:0,speed:1e-4,sub:{spaceStation1:{radius:.3,phi:0,speed:.01},moon:{radius:1.3,phi:0,speed:.001}}},mars:{radius:756,phi:0,speed:5e-5},asteroidBelt1:{innerRadius:850,outerRadius:2200},jupiter:{radius:2592,phi:0,speed:5e-5},saturn:{radius:4680,phi:0,speed:5e-5},uranus:{radius:9720,phi:0,speed:5e-5},neptune:{radius:14760,phi:0,speed:5e-5},pluto:{radius:19800,phi:0,speed:5e-5}}}},le=function(e,t,n){var o=e.starSystems.systems[t];if(void 0!==n){var i=function e(t,n){for(var o=0,i=Object.entries(t);o<i.length;o++){var u=i[o],c=u[0],s=u[1];if(!r(s)){if(c===n)return s;if(s.sub){var a=e(s.sub,n);if(a)return a}}}}(o,n);void 0!==i&&(void 0===i.sub&&(i.sub={}),o=i.sub)}return o},fe=function(e,t,n){return function e(t,n){if(Object.keys(t).find((function(e){return e===n})))return t;for(var o=0,i=Object.values(t);o<i.length;o++){var u=i[o];if(!r(u)&&u.sub){var c=e(u.sub,n);if(void 0!==c)return c}}}(e.starSystems.systems[t],n)},_e=function(e){var t=Date.now(),n=(t-e.starSystems.lastUpdate)/1e3;e.starSystems.lastUpdate=t,Object.values(e.starSystems.systems).forEach((function(e){return function e(t,n){Object.values(n).map((function(n){r(n)||(n.sub&&e(t,n.sub),n.phi+=n.speed*t)}))}(n,e)}))},pe=function(e){return"string"==typeof e},de={lastUpdate:Date.now(),movements:{},positions:{sol:{system:"sol",x:0,y:0},mercury:{system:"sol",x:192,y:0},venus:{system:"sol",x:360,y:0},earth:{system:"sol",x:498,y:0},moon:{system:"sol",x:499.3,y:0},spaceStation1:{system:"sol",x:498.3,y:0},mars:{system:"sol",x:756,y:0},jupiter:{system:"sol",x:2592,y:0},saturn:{system:"sol",x:4680,y:0},uranus:{system:"sol",x:9720,y:0},neptune:{system:"sol",x:14760,y:0},pluto:{system:"sol",x:19800,y:0},ship1:{system:"sol",x:398,y:0},ship2:{system:"sol",x:756,y:50},ship3:{system:"sol",x:498,y:20}}},ye=function e(t,n,o,i,u){void 0===i&&(i=0),void 0===u&&(u=0),Object.entries(o).map((function(o){var c=o[0],s=o[1];if(!r(s)){var a=he(t,c),l=function(e,t,n){return void 0===t&&(t=0),void 0===n&&(n=0),[e.radius*Math.cos(e.phi)+t,e.radius*Math.sin(e.phi)+n]}(s,i,u),f=l[0],_=l[1];s.sub&&e(t,n,s.sub,a.x,a.y),t.dynamics.positions[c]={system:a.system,x:f,y:_},s.sub&&function e(t,n,o,i){void 0===o&&(o=0),void 0===i&&(i=0),Object.entries(n).map((function(u){var c=u[0],s=u[1];if(!r(s)){var a=he(t,c);t.dynamics.positions[c]={system:a.system,x:a.x+o,y:a.y+i},s.sub&&e(t,n,o,i)}}))}(t,s.sub,f-a.x,_-a.y)}}))},he=function e(t,n){return pe(n)?e(t,t.dynamics.positions[n]):n},ve=function(e,t,n,r,o){if(!(t<=0)){var i=he(e,n),c=he(e,r),s=c.x-i.x,a=c.y-i.y,l=Math.sqrt(s*s+a*a),f=o*t;l<f?(pe(r)||function(e,t,n,r){return function(o){var i=le(o,t,r),c=he(o,e),s=void 0!==r?he(o,r):{system:t,x:0,y:0},a=u(c.x,c.y,s.x,s.y);i[e]={radius:a.radius,phi:a.phi,speed:n}}}(n,r.system,5e-5,void 0)(e),e.dynamics.positions[n]=r,delete e.dynamics.movements[n]):(e.dynamics.positions[n]={system:i.system,x:i.x+s/l*f,y:i.y+a/l*f},e.dynamics.movements[n].eta=l/o)}},me=function(e){var t=Date.now(),n=(t-e.dynamics.lastUpdate)/1e3;e.dynamics.lastUpdate=t,Object.entries(e.dynamics.movements).forEach((function(t){var r=t[1];return ve(e,n,t[0],r.to,r.v)})),Object.values(e.starSystems.systems).forEach((function(t){return ye(e,n,t)}))},be=function(e,t,n){return s((function(t){return(n=e,r=t.starSystems.currentSystem,function(e){var t=fe(e,r,n);t&&delete t[n]})(t);var n,r}),function(e,t,n){return function(r){r.dynamics.movements[e]={to:t,v:n,eta:0}}}(e,t,n))},ge="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),Oe="undefined"!=typeof Map,je="undefined"!=typeof Set,xe="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,Se=ge?Symbol.for("immer-nothing"):((ue={})["immer-nothing"]=!0,ue),ke=ge?Symbol.for("immer-draftable"):"__$immer_draftable",Pe=ge?Symbol.for("immer-state"):"__$immer_state",we=("undefined"!=typeof Symbol&&Symbol,"undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:Object.getOwnPropertyNames),Ce=Object.getOwnPropertyDescriptors||function(e){var t={};return we(e).forEach((function(n){t[n]=Object.getOwnPropertyDescriptor(e,n)})),t},Ae={},De={get:function(e,t){if(t===Pe)return e;var n=g(e);if(!d(n,t))return function(e,t,n){var r,o=U(t,n);return o?"value"in o?o.value:null===(r=o.get)||void 0===r?void 0:r.call(e.k):void 0}(e,n,t);var r=n[t];return e.I||!f(r)?r:r===R(e.t,t)?(H(e),e.o[t]=I(e.A.h,r,e)):r},has:function(e,t){return t in g(e)},ownKeys:function(e){return Reflect.ownKeys(g(e))},set:function(e,t,n){var r=U(g(e),t);if(null==r?void 0:r.set)return r.set.call(e.k,n),!0;if(!e.P){var o=R(g(e),t),i=null==o?void 0:o[Pe];if(i&&i.t===n)return e.o[t]=n,e.D[t]=!1,!0;if(v(n,o)&&(void 0!==n||d(e.t,t)))return!0;H(e),W(e)}return e.o[t]=n,e.D[t]=!0,!0},deleteProperty:function(e,t){return void 0!==R(e.t,t)||t in e.t?(e.D[t]=!1,H(e),W(e)):delete e.D[t],e.o&&delete e.o[t],!0},getOwnPropertyDescriptor:function(e,t){var n=g(e),r=Reflect.getOwnPropertyDescriptor(n,t);return r?{writable:!0,configurable:1!==e.i||"length"!==t,enumerable:r.enumerable,value:n[t]}:r},defineProperty:function(){a(11)},getPrototypeOf:function(e){return Object.getPrototypeOf(e.t)},setPrototypeOf:function(){a(12)}},Ee={};_(De,(function(e,t){Ee[e]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}})),Ee.deleteProperty=function(e,t){return De.deleteProperty.call(this,e[0],t)},Ee.set=function(e,t,n){return De.set.call(this,e[0],t,n,e[0])};var Me,Ne,Fe,Te=new(function(){function e(e){this.O=xe,this.N=!0,"boolean"==typeof(null==e?void 0:e.useProxies)&&this.setUseProxies(e.useProxies),"boolean"==typeof(null==e?void 0:e.autoFreeze)&&this.setAutoFreeze(e.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this)}var t=e.prototype;return t.produce=function(e,t,n){if("function"==typeof e&&"function"!=typeof t){var r=t;t=e;var o=this;return function(e){var n=this;void 0===e&&(e=r);for(var i=arguments.length,u=Array(i>1?i-1:0),c=1;c<i;c++)u[c-1]=arguments[c];return o.produce(e,(function(e){var r;return(r=t).call.apply(r,[n,e].concat(u))}))}}var i;if("function"!=typeof t&&a(6),void 0!==n&&"function"!=typeof n&&a(7),f(e)){var u=D(this),c=I(this,e,void 0),s=!0;try{i=t(c),s=!1}finally{s?C(u):A(u)}return"undefined"!=typeof Promise&&i instanceof Promise?i.then((function(e){return w(u,n),M(e,u)}),(function(e){throw C(u),e})):(w(u,n),M(i,u))}if(!e||"object"!=typeof e){if((i=t(e))===Se)return;return void 0===i&&(i=e),this.N&&j(i,!0),i}a(21,e)},t.produceWithPatches=function(e,t){var n,r,o=this;return"function"==typeof e?function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return o.produceWithPatches(t,(function(t){return e.apply(void 0,[t].concat(r))}))}:[this.produce(e,t,(function(e,t){n=e,r=t})),n,r]},t.createDraft=function(e){f(e)||a(8),l(e)&&(e=function(e){return l(e)||a(22,e),function e(t){if(!f(t))return t;var n,r=t[Pe],o=p(t);if(r){if(!r.P&&(r.i<4||!k("ES5").K(r)))return r.t;r.I=!0,n=L(t,o),r.I=!1}else n=L(t,o);return _(n,(function(t,o){r&&y(r.t,t)===o||h(n,t,e(o))})),3===o?new Set(n):n}(e)}(e));var t=D(this),n=I(this,e,void 0);return n[Pe].C=!0,A(t),n},t.finishDraft=function(e,t){var n=(e&&e[Pe]).A;return w(n,t),M(void 0,n)},t.setAutoFreeze=function(e){this.N=e},t.setUseProxies=function(e){e&&!xe&&a(20),this.O=e},t.applyPatches=function(e,t){var n;for(n=t.length-1;n>=0;n--){var r=t[n];if(0===r.path.length&&"replace"===r.op){e=r.value;break}}var o=k("Patches").$;return l(e)?o(e,t):this.produce(e,(function(e){return o(e,t.slice(n+1))}))},e}()),Re=Te.produce,Ue=(Te.produceWithPatches.bind(Te),Te.setAutoFreeze.bind(Te),Te.setUseProxies.bind(Te),Te.applyPatches.bind(Te),Te.createDraft.bind(Te),Te.finishDraft.bind(Te),{selected:void 0,state:void 0,subState:void 0,focused:void 0,viewBox:{x:-1e3,y:-1e3,w:2e3,h:2e3}}),We=function(e){return function(t){t.map.selected=e,t.map.focused=e}},He=function(e){return function(t){t.map.viewBox=e}},Ie=function(e,t){return s((function(n){var r=n.map.selected;r&&be(r,e,t)(n)}),(function(e){delete e.map.state,delete e.map.subState,e.map.focused=e.map.selected}))},Le=function(e){if(void 0!==e.map.focused){var t=he(e,e.map.focused);void 0!==t&&(e.map.viewBox=(n=t.x,r=t.y,Re(e.map.viewBox,(function(e){e.x=n-e.w/2,e.y=r-e.h/2}))))}var n,r},Be=0,ze=[],Xe=se.e.__b,Ye=se.e.__r,qe=se.e.diffed,Ke=se.e.__c,Ve=se.e.unmount;se.e.__b=function(e){Ne=null,Xe&&Xe(e)},se.e.__r=function(e){Ye&&Ye(e),Me=0;var t=(Ne=e.__c).__H;t&&(t.__h.forEach($),t.__h.forEach(G),t.__h=[])},se.e.diffed=function(e){qe&&qe(e);var t=e.__c;t&&t.__H&&t.__H.__h.length&&(1!==ze.push(t)&&Fe===se.e.requestAnimationFrame||((Fe=se.e.requestAnimationFrame)||function(e){var t,n=function(){clearTimeout(r),$e&&cancelAnimationFrame(t),setTimeout(e)},r=setTimeout(n,100);$e&&(t=requestAnimationFrame(n))})(V)),Ne=void 0},se.e.__c=function(e,t){t.some((function(e){try{e.__h.forEach($),e.__h=e.__h.filter((function(e){return!e.__||G(e)}))}catch(n){t.some((function(e){e.__h&&(e.__h=[])})),t=[],se.e.__e(n,e.__v)}})),Ke&&Ke(e,t)},se.e.unmount=function(e){Ve&&Ve(e);var t=e.__c;if(t&&t.__H)try{t.__H.__.forEach($)}catch(e){se.e.__e(e,t.__v)}};var $e="function"==typeof requestAnimationFrame,Ge=function(e){return{name:e}},Je={type:"planet",radius:.008},Qe={type:"planet",radius:.008},Ze={type:"gas-giant",radius:.23},et={type:"artificial",radius:1e-5},tt={starSystems:ae,map:Ue,names:{names:{sol:Ge("Sol"),mercury:Ge("Mercury"),venus:Ge("Venus"),earth:Ge("Earth"),mars:Ge("Mars"),jupiter:Ge("Jupiter"),saturn:Ge("Saturn"),uranus:Ge("Uranus"),neptune:Ge("Neptune"),pluto:Ge("Pluto"),moon:Ge("Moon"),ship1:Ge("Pirate Interceptor"),ship2:Ge("Frigate Mk1"),ship3:Ge("Heavy Freighter Mk2"),spaceStation1:Ge("Earth Trading Station")}},bodies:{bodies:{sol:{type:"star",radius:2.3},mercury:Je,venus:Qe,earth:Qe,moon:{type:"moon",radius:.006},mars:Qe,jupiter:Ze,saturn:Ze,uranus:Ze,neptune:Ze,pluto:Je,ship1:et,ship2:et,ship3:et,spaceStation1:{type:"artificial",radius:1e-4}}},dynamics:de,ships:{controllable:{ship1:{by:"ai"},ship2:{by:"player"},ship3:{by:"player"},spaceStation1:{by:"ai"}},specs:{ship1:{type:"fighter",speed:.7},ship2:{type:"fighter",speed:.6},ship3:{type:"freighter",speed:.2},spaceStation1:{type:"station",speed:.01}}}},nt=Object(se.b)([tt,function(){}]),rt="#f1f1f1",ot="#98de00",it="#fd5d77",ut="#473b6b",ct={vectorEffect:"non-scaling-stroke"},st=function(e){return Object(se.c)("path",{className:"belt",fill:"url(#asteroids)",d:"\nM "+e.cx+", "+e.cy+" \nm 0 -"+e.outerRadius+"\na "+e.outerRadius+" "+e.outerRadius+" 0 1 0 1 0\nz\nm -1 "+(e.outerRadius-e.innerRadius)+"    \na "+e.innerRadius+" "+e.innerRadius+" 0 1 1 -1 0     \nZ",style:ct})},at=function e(t){var n=ee()[0];return Object(se.c)("g",null,Object.entries(t.system).map((function(o){var i=o[0],u=o[1];if(r(u))return Object(se.c)("g",{id:i},Object(se.c)(st,{innerRadius:u.innerRadius,outerRadius:u.outerRadius,cx:t.cx,cy:t.cy}));var c=he(n,i);return Object(se.c)("g",{id:i},Object(se.c)("circle",{id:i+"-orbit",cx:t.cx,cy:t.cy,r:u.radius,fill:"none",style:ct}),u.sub&&Object(se.c)(e,{system:u.sub,cx:c.x,cy:c.y}))})))},lt=function(){var e=ee(),t=e[0],n=e[1],r=function(e,t){return Object.entries(e.dynamics.movements).map((function(t){var n=t[0],r=t[1];return{id:n,from:he(e,n),to:he(e,r.to)}})).filter((function(e){return e.from.system===t||e.to.system===t}))}(t,t.starSystems.currentSystem);return Object(se.c)("g",null,r.map((function(e){var r=e.id,o=e.from,i=e.to;return Object(se.c)("g",{key:r},Object(se.c)("line",{onClick:function(e){void 0===t.map.state&&(e.stopPropagation(),n(We(r)))},id:r+"-trajectory",x1:o.x,y1:o.y,x2:i.x,y2:i.y,style:ne(ne({},ct),{},{stroke:ot,strokeDasharray:"4",strokeWidth:3,pointerEvents:"auto"})}))})))},ft=function(){var e=ee(),t=e[0],n=e[1],r=c(t,t.starSystems.currentSystem);return Object(se.c)("g",null,r.map((function(e){var r=he(t,e),o=t.bodies.bodies[e];return Object(se.c)("g",{key:e,id:e},Object(se.c)("circle",{id:e+"-body",cx:r.x,cy:r.y,r:o.radius,fill:it,stroke:rt,style:ne(ne({},ct),{},{strokeWidth:t.map.selected?2:0})}),Object(se.c)("circle",{id:e+"-body-bounding-box",onClick:function(r){if(void 0===t.map.state)r.stopPropagation(),n(We(e));else if("select_dockable_location"===t.map.subState){var o=t.map.selected;void 0!==o&&e!==o&&(r.stopPropagation(),n(Ie(e,t.ships.specs[o].speed)))}},cx:r.x,cy:r.y,r:2*o.radius,fill:"none",stroke:"none",style:{pointerEvents:"visible"}}))})))},_t=function(){var e=ee(),t=e[0],n=e[1],r=Y(void 0),o=r[0],u=r[1],c=function(e){return Be=5,K((function(){return{current:e}}),[])}(null),s=t.map.viewBox,a=s.w/800,l=s.h/800;return Object(se.c)("svg",{viewBox:s.x+" "+s.y+" "+s.w+" "+s.h,ref:c,onWheel:function(e){n(He(B(s,e.deltaY,e.offsetX,e.offsetY,c.current.clientWidth,c.current.clientHeight))),e.preventDefault()},onClick:function(e){if(!o&&void 0!==t.map.subState&&"select_navigable_location"===t.map.subState){var r,i=c.current.createSVGPoint();i.x=e.x,i.y=e.y;var s=i.matrixTransform(null==(r=c.current.getScreenCTM())?void 0:r.inverse()),a=t.map.selected;void 0!==a&&n(Ie({system:t.starSystems.currentSystem,x:s.x,y:s.y},t.ships.specs[a].speed))}u(void 0)},onTouchStart:function(e){u(ie(e))},onTouchMove:function(e){if(o&&e.touches.length>0){if(1===e.touches.length&&1===o.length){var t=e.touches[0];n(He(z(s,t.clientX-o[0][0],t.clientY-o[0][1])))}else if(e.touches.length>1&&o.length===e.touches.length){var r=e.touches[0],a=e.touches[1],l=i(o[0][0],o[0][1],o[1][0],o[1][1]),f=i(r.clientX,r.clientY,a.clientX,a.clientY);n(He(B(s,l-f,r.clientX,r.clientY,c.current.clientWidth,c.current.clientHeight)))}u(ie(e)),e.preventDefault()}},onTouchCancel:function(){return u(void 0)},onTouchEnd:function(){return u(void 0)},onMouseDown:function(e){void 0===t.map.state&&n((function(e){delete e.map.selected,delete e.map.focused})),u(oe(e))},onMouseUp:function(){return u(void 0)},onMouseLeave:function(){return u(void 0)},onMouseMove:function(e){o&&(n(He(z(s,e.movementX,e.movementY))),u(oe(e)))}},Object(se.c)("pattern",{id:"asteroids",x:"0",y:"0",width:10*a,height:10*l,patternUnits:"userSpaceOnUse"},Object(se.c)("rect",{x:6*a,y:-5*l,width:2*a,height:2*l,transform:"rotate(45)",style:ct,fill:ut,stroke:ut})),Object(se.c)("g",null,Object(se.c)(at,{system:t.starSystems.systems[t.starSystems.currentSystem],cx:0,cy:0}),Object(se.c)(ft,null),Object(se.c)(lt,null)))},pt=function(e){var t=ee()[0],n=Y([]),r=n[0],o=n[1];return Object(se.c)("div",{class:"list-group"},Object(se.c)("div",{class:"btn-group",role:"group","aria-label":"Basic example"},Object(se.c)("button",{type:"button",class:"btn btn-primary",onClick:function(){return o([])}},"all"),Object(se.c)("button",{type:"button",class:"btn btn-primary",onClick:function(){return o(["fighter","freighter"])}},"ships"),Object(se.c)("button",{type:"button",class:"btn btn-primary",onClick:function(){return o(["station"])}},"stations"),Object(se.c)("button",{type:"button",class:"btn btn-primary",onClick:function(){return o(["star","gas-giant","moon","planet"])}},"bodies")),e.objects.filter((function(e){var n;return 0===r.length||r.includes(t.bodies.bodies[e].type)||r.includes(null==(n=t.ships.specs[e])?void 0:n.type)})).sort((function(e){var n;return"player"===(null==(n=t.ships.controllable[e])?void 0:n.by)?1:2})).map((function(n){var r,o,i="player"===(null==(r=t.ships.controllable[n])?void 0:r.by)?"font-weight-bold":"font-weight-normal";return Object(se.c)("a",{href:"#",class:"list-group-item list-group-item-action "+i,key:n,onClick:function(){return e.onSelect(n)},style:{cursor:"pointer"}},function(e,t){switch(e.bodies.bodies[t].type){case"artificial":switch(e.ships.specs[t].type){case"fighter":return"≛";case"freighter":return"⊔";case"station":return"⌂"}break;case"gas-giant":return"♄";case"moon":return"☽︎";case"planet":return"♁";case"star":return"☉"}}(t,n)," ",(null==(o=t.names.names[n])?void 0:o.name)||n)})))},dt=function(e){var t=ee()[0];return Object(se.c)(pt,{onSelect:e.onSelect,objects:c(t,t.starSystems.currentSystem)})},yt=function(e){var t=ee()[0],n=t.map.selected||"",r=he(t,n),i=r?function(e,t){return Object.entries(e.dynamics.positions).map((function(t){return{id:t[0],position:he(e,t[1])}})).filter((function(e){return e.position.system===t.system})).map((function(e){var n=e.position;return{id:e.id,dist:o(n.x,n.y,t.x,t.y)}})).sort((function(e,t){return e.dist-t.dist})).map((function(e){return e.id}))}(t,r):[];return Object(se.c)(pt,{onSelect:e.onSelect,objects:i.filter((function(e){return e!==n}))})},ht=function(e){if(pe(e.location)){var t,n=ee()[0];return Object(se.c)("span",null,(null==(t=n.names.names[e.location])?void 0:t.name)||"unkown location")}var r=u(e.location.x,e.location.y);return Object(se.c)(se.a,null,e.location.system," (",Object(se.c)("span",null,r.radius.toFixed(0)),"ls,",Object(se.c)("span",null,r.phi.toFixed(2)),"θ)")},vt=Object(se.c)("div",null,"select a navigable location from the map"),mt=function(){var e=ee(),t=e[0],n=e[1],r=t.map.selected;if(!r)return Object(se.c)("span",null,"Nothing selected");switch(t.map.state){case"dock_at":return function(e,t,n){return Object(se.c)("div",null,Object(se.c)(yt,{onSelect:function(r){n(Ie(r,t.ships.specs[e].speed))}}))}(r,t,n);case"move_to":return vt;default:return function(e,t,n){var r,o,i=t.names.names[e],u=t.dynamics.positions[e],c=t.dynamics.movements[e],s=t.ships.controllable[e];return Object(se.c)("div",{className:"container"},Object(se.c)("div",{className:"row"},Object(se.c)("h1",{className:"col-sm-auto",onClick:function(){return n((function(e){delete e.map.selected,delete e.map.focused}))},style:{cursor:"pointer"}},"<<"),i?Object(se.c)("h1",{className:"col-sm"},i.name):Object(se.c)(se.a,null)),Object(se.c)("div",{className:"row"},u?Object(se.c)("p",{class:"lead col-sm"},Object(se.c)(ht,{location:u})):Object(se.c)(se.a,null)),Object(se.c)("div",{className:"row"},c?Object(se.c)("p",{className:"col-sm"},"traveling to ",Object(se.c)(ht,{location:c.to})," ETA ",(r=function(e){var t={seconds:e.seconds||0,minutes:e.minutes||0,hours:e.hours||0,days:e.days||0};return t.seconds>=60&&(t.minutes+=t.seconds/60,t.seconds%=60),t.minutes>=60&&(t.hours+=t.hours/60,t.minutes%=60),t.hours>=24&&(t.days+=t.days/24,t.days%=24),t}({seconds:c.eta}),o="",r.days>0&&(o+=r.days.toFixed(0)+"d"),r.hours>0&&(o+=r.hours.toFixed(0)+"h"),r.minutes>0&&(o+=r.minutes.toFixed(0)+"m"),r.seconds>0&&(o+=r.seconds.toFixed(0)+"s"),o)):Object(se.c)(se.a,null)),Object(se.c)("div",{className:"row"},void 0!==s&&"player"===s.by?Object(se.c)("div",{className:"col-sm"},Object(se.c)("div",null,"you own this ship"),Object(se.c)("div",{class:"btn-group mr-2",role:"group","aria-label":"First group"},Object(se.c)("button",{class:"btn btn-primary",onClick:function(){return n((function(e){e.map.state="move_to",e.map.subState="select_navigable_location",delete e.map.focused}))}},"move to"),Object(se.c)("button",{class:"btn btn-primary",onClick:function(){return n((function(e){e.map.state="dock_at",e.map.subState="select_dockable_location",delete e.map.focused}))}},"dock at"))):Object(se.c)("div",{className:"col-sm"},"owned by ",(null==s?void 0:s.by)||"noone")))}(r,t,n)}},bt=function(){var e=ee(),t=e[1];return e[0].map.selected?Object(se.c)(mt,null):Object(se.c)(dt,{onSelect:function(e){return t(We(e))}})},gt=function(){var e,t=ee()[0],n=[(e=t.map.viewBox).x+e.w/2,e.y+e.h/2],r={system:t.starSystems.currentSystem,x:n[0],y:n[1]};return Object(se.c)("h1",{className:"text-center"},Object(se.c)(ht,{location:r}))},Ot=function(){var e,t,n,r=ee()[1];return e=function(){r(be("ship2","earth",.7));var e=setInterval((function(){r(s(_e,me,Le))}),10);return function(){return clearInterval(e)}},t=[r],n=X(Me++,3),!se.e.__s&&J(n.__H,t)&&(n.__=e,n.__H=t,Ne.__H.__h.push(n)),Object(se.c)("div",{className:"container-fluid"},Object(se.c)("div",{className:"row"},Object(se.c)("div",{className:"col"},Object(se.c)(gt,null))),Object(se.c)("div",{className:"row"},Object(se.c)("div",{className:"col-lg-9 order-first order-lg-last"},Object(se.c)(_t,null)),Object(se.c)("div",{className:"col-lg-3 "},Object(se.c)(bt,null))))};t.default=function(){return Object(se.c)(Z,null,Object(se.c)(Ot,null))}},Wz0F:function(){},hosL:function(e,t,n){"use strict";function r(e,t){for(var n in t)e[n]=t[n];return e}function o(e){var t=e.parentNode;t&&t.removeChild(e)}function i(e,t,n){var r,o,i,c=arguments,s={};for(i in t)"key"==i?r=t[i]:"ref"==i?o=t[i]:s[i]=t[i];if(arguments.length>3)for(n=[n],i=3;i<arguments.length;i++)n.push(c[i]);if(null!=n&&(s.children=n),"function"==typeof e&&null!=e.defaultProps)for(i in e.defaultProps)void 0===s[i]&&(s[i]=e.defaultProps[i]);return u(e,s,r,o,null)}function u(e,t,n,r,o){var i={type:e,props:t,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++A.__v:o};return null!=A.vnode&&A.vnode(i),i}function c(e){return e.children}function s(e,t){this.props=e,this.context=t}function a(e,t){if(null==t)return e.__?a(e.__,e.__.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e)return n.__e;return"function"==typeof e.type?a(e):null}function l(e){var t,n;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e){e.__e=e.__c.base=n.__e;break}return l(e)}}function f(e){(!e.__d&&(e.__d=!0)&&D.push(e)&&!_.__r++||M!==A.debounceRendering)&&((M=A.debounceRendering)||E)(_)}function _(){for(var e;_.__r=D.length;)e=D.sort((function(e,t){return e.__v.__b-t.__v.__b})),D=[],e.some((function(e){var t,n,o,i,u,c;e.__d&&(u=(i=(t=e).__v).__e,(c=t.__P)&&(n=[],(o=r({},i)).__v=i.__v+1,g(c,i,o,t.__n,void 0!==c.ownerSVGElement,null!=i.__h?[u]:null,n,null==u?a(i):u,i.__h),O(n,i),i.__e!=u&&l(i)))}))}function p(e,t,n,r,o,i,s,l,f,_){var p,h,v,m,b,O,j,k=r&&r.__k||T,P=k.length;for(n.__k=[],p=0;p<t.length;p++)if(null!=(m=n.__k[p]=null==(m=t[p])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m?u(null,m,null,null,m):Array.isArray(m)?u(c,{children:m},null,null,null):m.__b>0?u(m.type,m.props,m.key,null,m.__v):m)){if(m.__=n,m.__b=n.__b+1,null===(v=k[p])||v&&m.key==v.key&&m.type===v.type)k[p]=void 0;else for(h=0;h<P;h++){if((v=k[h])&&m.key==v.key&&m.type===v.type){k[h]=void 0;break}v=null}g(e,m,v=v||F,o,i,s,l,f,_),b=m.__e,(h=m.ref)&&v.ref!=h&&(j||(j=[]),v.ref&&j.push(v.ref,null,m),j.push(h,m.__c||b,m)),null!=b?(null==O&&(O=b),"function"==typeof m.type&&null!=m.__k&&m.__k===v.__k?m.__d=f=d(m,f,e):f=y(e,m,v,k,b,f),_||"option"!==n.type?"function"==typeof n.type&&(n.__d=f):e.value=""):f&&v.__e==f&&f.parentNode!=e&&(f=a(v))}for(n.__e=O,p=P;p--;)null!=k[p]&&("function"==typeof n.type&&null!=k[p].__e&&k[p].__e==n.__d&&(n.__d=a(r,p+1)),S(k[p],k[p]));if(j)for(p=0;p<j.length;p++)x(j[p],j[++p],j[++p])}function d(e,t,n){var r,o;for(r=0;r<e.__k.length;r++)(o=e.__k[r])&&(o.__=e,t="function"==typeof o.type?d(o,t,n):y(n,o,o,e.__k,o.__e,t));return t}function y(e,t,n,r,o,i){var u,c,s;if(void 0!==t.__d)u=t.__d,t.__d=void 0;else if(null==n||o!=i||null==o.parentNode)e:if(null==i||i.parentNode!==e)e.appendChild(o),u=null;else{for(c=i,s=0;(c=c.nextSibling)&&s<r.length;s+=2)if(c==o)break e;e.insertBefore(o,i),u=i}return void 0!==u?u:o.nextSibling}function h(e,t,n){"-"===t[0]?e.setProperty(t,n):e[t]=null==n?"":"number"!=typeof n||R.test(t)?n:n+"px"}function v(e,t,n,r,o){var i;e:if("style"===t)if("string"==typeof n)e.style.cssText=n;else{if("string"==typeof r&&(e.style.cssText=r=""),r)for(t in r)n&&t in n||h(e.style,t,"");if(n)for(t in n)r&&n[t]===r[t]||h(e.style,t,n[t])}else if("o"===t[0]&&"n"===t[1])i=t!==(t=t.replace(/Capture$/,"")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=n,n?r||e.addEventListener(t,i?b:m,i):e.removeEventListener(t,i?b:m,i);else if("dangerouslySetInnerHTML"!==t){if(o)t=t.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==t&&"list"!==t&&"form"!==t&&"download"!==t&&t in e)try{e[t]=null==n?"":n;break e}catch(e){}"function"==typeof n||(null!=n&&(!1!==n||"a"===t[0]&&"r"===t[1])?e.setAttribute(t,n):e.removeAttribute(t))}}function m(e){this.l[e.type+!1](A.event?A.event(e):e)}function b(e){this.l[e.type+!0](A.event?A.event(e):e)}function g(e,t,n,o,i,u,a,l,f){var _,d,y,h,v,m,b,g,O,x,S,P=t.type;if(void 0!==t.constructor)return null;null!=n.__h&&(f=n.__h,l=t.__e=n.__e,t.__h=null,u=[l]),(_=A.__b)&&_(t);try{e:if("function"==typeof P){if(g=t.props,O=(_=P.contextType)&&o[_.__c],x=_?O?O.props.value:_.__:o,n.__c?b=(d=t.__c=n.__c).__=d.__E:("prototype"in P&&P.prototype.render?t.__c=d=new P(g,x):(t.__c=d=new s(g,x),d.constructor=P,d.render=k),O&&O.sub(d),d.props=g,d.state||(d.state={}),d.context=x,d.__n=o,y=d.__d=!0,d.__h=[]),null==d.__s&&(d.__s=d.state),null!=P.getDerivedStateFromProps&&(d.__s==d.state&&(d.__s=r({},d.__s)),r(d.__s,P.getDerivedStateFromProps(g,d.__s))),h=d.props,v=d.state,y)null==P.getDerivedStateFromProps&&null!=d.componentWillMount&&d.componentWillMount(),null!=d.componentDidMount&&d.__h.push(d.componentDidMount);else{if(null==P.getDerivedStateFromProps&&g!==h&&null!=d.componentWillReceiveProps&&d.componentWillReceiveProps(g,x),!d.__e&&null!=d.shouldComponentUpdate&&!1===d.shouldComponentUpdate(g,d.__s,x)||t.__v===n.__v){d.props=g,d.state=d.__s,t.__v!==n.__v&&(d.__d=!1),d.__v=t,t.__e=n.__e,t.__k=n.__k,d.__h.length&&a.push(d);break e}null!=d.componentWillUpdate&&d.componentWillUpdate(g,d.__s,x),null!=d.componentDidUpdate&&d.__h.push((function(){d.componentDidUpdate(h,v,m)}))}d.context=x,d.props=g,d.state=d.__s,(_=A.__r)&&_(t),d.__d=!1,d.__v=t,d.__P=e,_=d.render(d.props,d.state,d.context),d.state=d.__s,null!=d.getChildContext&&(o=r(r({},o),d.getChildContext())),y||null==d.getSnapshotBeforeUpdate||(m=d.getSnapshotBeforeUpdate(h,v)),S=null!=_&&_.type===c&&null==_.key?_.props.children:_,p(e,Array.isArray(S)?S:[S],t,n,o,i,u,a,l,f),d.base=t.__e,t.__h=null,d.__h.length&&a.push(d),b&&(d.__E=d.__=null),d.__e=!1}else null==u&&t.__v===n.__v?(t.__k=n.__k,t.__e=n.__e):t.__e=j(n.__e,t,n,o,i,u,a,f);(_=A.diffed)&&_(t)}catch(e){t.__v=null,(f||null!=u)&&(t.__e=l,t.__h=!!f,u[u.indexOf(l)]=null),A.__e(e,t,n)}}function O(e,t){A.__c&&A.__c(t,e),e.some((function(t){try{e=t.__h,t.__h=[],e.some((function(e){e.call(t)}))}catch(e){A.__e(e,t.__v)}}))}function j(e,t,n,r,i,u,c,s){var a,l,f,_,d=n.props,y=t.props,h=t.type,m=0;if("svg"===h&&(i=!0),null!=u)for(;m<u.length;m++)if((a=u[m])&&(a===e||(h?a.localName==h:3==a.nodeType))){e=a,u[m]=null;break}if(null==e){if(null===h)return document.createTextNode(y);e=i?document.createElementNS("http://www.w3.org/2000/svg",h):document.createElement(h,y.is&&y),u=null,s=!1}if(null===h)d===y||s&&e.data===y||(e.data=y);else{if(u=u&&T.slice.call(e.childNodes),l=(d=n.props||F).dangerouslySetInnerHTML,f=y.dangerouslySetInnerHTML,!s){if(null!=u)for(d={},_=0;_<e.attributes.length;_++)d[e.attributes[_].name]=e.attributes[_].value;(f||l)&&(f&&(l&&f.__html==l.__html||f.__html===e.innerHTML)||(e.innerHTML=f&&f.__html||""))}if(function(e,t,n,r,o){var i;for(i in n)"children"===i||"key"===i||i in t||v(e,i,null,n[i],r);for(i in t)o&&"function"!=typeof t[i]||"children"===i||"key"===i||"value"===i||"checked"===i||n[i]===t[i]||v(e,i,t[i],n[i],r)}(e,y,d,i,s),f)t.__k=[];else if(m=t.props.children,p(e,Array.isArray(m)?m:[m],t,n,r,i&&"foreignObject"!==h,u,c,e.firstChild,s),null!=u)for(m=u.length;m--;)null!=u[m]&&o(u[m]);s||("value"in y&&void 0!==(m=y.value)&&(m!==e.value||"progress"===h&&!m)&&v(e,"value",m,d.value,!1),"checked"in y&&void 0!==(m=y.checked)&&m!==e.checked&&v(e,"checked",m,d.checked,!1))}return e}function x(e,t,n){try{"function"==typeof e?e(t):e.current=t}catch(e){A.__e(e,n)}}function S(e,t,n){var r,i,u;if(A.unmount&&A.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||x(r,null,t)),n||"function"==typeof e.type||(n=null!=(i=e.__e)),e.__e=e.__d=void 0,null!=(r=e.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){A.__e(e,t)}r.base=r.__P=null}if(r=e.__k)for(u=0;u<r.length;u++)r[u]&&S(r[u],t,n);null!=i&&o(i)}function k(e,t,n){return this.constructor(e,n)}function P(e,t,n){var r,o,u;A.__&&A.__(e,t),o=(r="function"==typeof n)?null:n&&n.__k||t.__k,u=[],g(t,e=(!r&&n||t).__k=i(c,null,[e]),o||F,F,void 0!==t.ownerSVGElement,!r&&n?[n]:o?null:t.firstChild?T.slice.call(t.childNodes):null,u,!r&&n?n:o?o.__e:t.firstChild,r),O(u,e)}function w(e,t){P(e,t,w)}function C(e,t){var n={__c:t="__cC"+N++,__:e,Consumer:function(e,t){return e.children(t)},Provider:function(e){var n,r;return this.getChildContext||(n=[],(r={})[t]=this,this.getChildContext=function(){return r},this.shouldComponentUpdate=function(e){this.props.value!==e.value&&n.some(f)},this.sub=function(e){n.push(e);var t=e.componentWillUnmount;e.componentWillUnmount=function(){n.splice(n.indexOf(e),1),t&&t.call(e)}}),e.children}};return n.Provider.__=n.Consumer.contextType=n}n.d(t,"f",(function(){return P})),n.d(t,"d",(function(){return w})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return C})),n.d(t,"e",(function(){return A}));var A,D,E,M,N,F={},T=[],R=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;A={__e:function(e,t){for(var n,r,o;t=t.__;)if((n=t.__c)&&!n.__)try{if((r=n.constructor)&&null!=r.getDerivedStateFromError&&(n.setState(r.getDerivedStateFromError(e)),o=n.__d),null!=n.componentDidCatch&&(n.componentDidCatch(e),o=n.__d),o)return n.__E=n}catch(t){e=t}throw e},__v:0},s.prototype.setState=function(e,t){var n;n=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=r({},this.state),"function"==typeof e&&(e=e(r({},n),this.props)),e&&r(n,e),null!=e&&this.__v&&(t&&this.__h.push(t),f(this))},s.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),f(this))},s.prototype.render=c,D=[],E="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,_.__r=0,N=0},mdyV:function(e,t,n){"use strict";n.r(t);var r=n("hosL"),o=r.c,i=r.f,u=r.d,c=function(e){return e&&e.default?e.default:e},s=function(e){return"/"===e[e.length-1]?e:e+"/"};if("serviceWorker"in navigator&&navigator.serviceWorker.register(n.p+"sw.js"),"function"==typeof c(n("QfWi"))){var a=document.getElementById("preact_root")||document.body.firstElementChild;0,function(){var e=c(n("QfWi")),t={},r=document.querySelector('[type="__PREACT_CLI_DATA__"]');r&&(t=JSON.parse(decodeURI(r.innerHTML)).preRenderData||t);var l={preRenderData:t},f=t.url?s(t.url):"",_=u&&f===s(location.pathname);a=(_?u:i)(o(e,{CLI_DATA:l}),document.body,a)}()}}});
//# sourceMappingURL=bundle.5779d.js.map