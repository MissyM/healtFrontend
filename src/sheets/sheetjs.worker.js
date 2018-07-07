import * as XLSX from 'xlsx'

self.postMessage({t:'ready'});
self.onmessage = function(evt) {
var v;
try { v = XLSX.read(evt.data.d, evt.data.b); }
    catch(e) { self.postMessage({t:"e",d:e.stack}); }
    self.postMessage({t:evt.data.t, d:JSON.stringify(v)});
}
