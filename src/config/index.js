/**
 * Merge (deep) multiple objects into the target object.
 */
Object.merge = (target, ...source) => {
  const mg = (t, s) => {
    s = s || {};
    Object.keys(s).forEach((k) => {
      const sv = s[k];
      if (!Array.isArray(sv) && typeof sv === 'object') {
        t[k] = t[k] || {};
        mg(t[k], sv);
      } else {
        t[k] = sv;
      }
    });
  };

  target = target || {};
  for (let i = 0; i < source.length; i += 1) {
    mg(target, source[i]);
  }

  return target;
};

Object.hasValue = (o) => {
  if ([undefined, null].indexOf(o) >= 0) return false;
  if (typeof o !== 'object' && !!o) return true;

  if (typeof o === 'object') {
    for (let j = 0; j < Object.keys(o).length; j += 1) {
      if (Object.hasValue(o[Object.keys(o)[j]])) return true;
    }
  }

  return false;
};

Object.nestValue = (obj, p) => {
  if (!obj || !p) return undefined;

  if (p === '.') return obj;

  let v = obj;
  const pList = p.split('.');

  for (let i = 0; i < pList.length; i += 1) {
    const pl = pList[i];

    if (v[pl]) v = v[pl];
    else { return undefined; }
  }

  return v;
};

Object.setValue = (obj, n, v) => {
  if (!obj || !n) return undefined;

  let t = obj;
  const nList = n.split('.');
  for (let i = 0; i < nList.length; i += 1) {
    const nl = nList[i];

    if (i < nList.length - 1) {
      if (!t[nl]) {
        t[nl] = typeof nList[i + 1] === 'number' ? [] : {};
      }
      t = t[nl];
    } else {
      t[nl] = v;
    }
  }

  return obj;
};

import config from './config.default';

const allConfigs = {};

const configContext = require.context('./', true, /\/config.[a-z]+.js$/);
const contextKeys = configContext.keys();
for (let i = 0; i < contextKeys.length; i += 1) {
  let cn = contextKeys[i];
  cn = cn.substr('./config.'.length);
  cn = cn.substr(0, cn.length - 3);

  if (cn && !allConfigs[cn]) {
    allConfigs[cn] = configContext(contextKeys[i]).default;
  }
}

const finalConfig = Object.merge(config, allConfigs[`${process.env.env || 'development'}`]);

export default finalConfig;
