const fs = require('fs');
const src = fs.readFileSync('C:/Users/86135/WorkBuddy/Claw/worklog/index.html', 'utf8');
const out = [];

for (const fn of ['delTask', 'delGo', 'delKb']) {
  const m = src.match(new RegExp('function ' + fn + '\\(seq\\) \\{[\\s\\S]*?\\n\\}'));
  if (!m) { out.push(fn + ': 未找到'); continue; }
  out.push('=== ' + fn + ' ===');
  out.push(m[0]);
  out.push('  字符串比较过滤: ' + /String\(x\.seq\) !== String\(/.test(m[0]));
  out.push('  空值保护: ' + /\(t\.desc \|\| ""\)|\(g\.title \|\| ""\)/.test(m[0]));
  out.push('');
}

const arr = [
  { seq: 1, customer: 'A', desc: '数字序号' },
  { seq: '2', customer: 'B', desc: '文本序号' },
  { seq: 3, customer: 'C', desc: '' },
];
const newDel = (seq, list) => {
  const t = list.find(x => x.seq === seq) || list.find(x => String(x.seq) === String(seq));
  if (!t) return list;
  return list.filter(x => String(x.seq) !== String(t.seq));
};
const oldDel = (seq, list) => list.filter(x => x.seq !== seq);

out.push('=== 模拟删除序号 "2"（文本型）===');
out.push('新实现剩余: ' + JSON.stringify(newDel('2', arr).map(x => x.customer)));
out.push('旧实现剩余: ' + JSON.stringify(oldDel('2', arr).map(x => x.customer)) + '  <- 旧版文本序号删不掉');
out.push('');
out.push('=== 模拟删数字序号 1 ===');
out.push('新实现剩余: ' + JSON.stringify(newDel(1, arr).map(x => x.customer)));
out.push('旧实现剩余: ' + JSON.stringify(oldDel(1, arr).map(x => x.customer)));
out.push('');
out.push('=== 空描述不再抛错 ===');
try {
  const t = { desc: null };
  const s = (t.desc || '').slice(0, 40);
  out.push('安全: 取到 "' + s + '"');
} catch (e) { out.push('抛错: ' + e.message); }

fs.writeFileSync('C:/Users/86135/WorkBuddy/Claw/worklog/_del_out.txt', out.join('\n'), 'utf8');
console.log('done');
