import test from 'node:test';
import assert from 'node:assert/strict';
import core from '../lib/attribution-core.cjs';
const first='2026-11-02T00:00:00.000Z',last='2026-11-03T00:00:00.000Z';
test('outbound history preserves the original visit, later campaign and opaque click IDs',()=>{
 const a=core.capture(null,'?utm_source=fb&utm_medium=paid&utm_campaign=a&ctwa_clid=AbCd','/article','',first);
 const b=core.capture(a,'?utm_source=ig&utm_medium=paid&utm_campaign=b','/other','',last);
 const url=new URL(core.decorateUrl('https://wabog.com/?ref=keep#plans',b));
 const history=JSON.parse(url.searchParams.get('wbg_touches'));
 assert.deepEqual(history.map(t=>t.utm_campaign),['a','b']);
 assert.equal(history[0].click_id,'AbCd');assert.equal(history[1].click_id,undefined);
 assert.equal(url.searchParams.get('ref'),'keep');assert.equal(url.hash,'#plans');
 const received=core.capture(null,url.search,'/','',last);
 assert.equal(received.touches.length,2);assert.equal(received.first.seen_at,first);
});
test('unknown payload fields and invalid envelope dates are never forwarded',()=>{
 const data=core.capture(null,'?wbg_touches='+encodeURIComponent(JSON.stringify([{utm_source:'fb',seen_at:first,email:'private@local.test'}])),'/','',last);
 assert(!core.appUrl(data).includes('private'));
 assert.equal(core.capture(null,'?wbg_touches=bad','/','',last).first,undefined);
});
