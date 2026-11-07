"use strict";
const rows = [...require('./001-046.cjs'), ...require('./047-092.cjs'), ...require('./093-137.cjs')];
module.exports = rows.map(([id, scope, steps, negative, limitation]) => ({id, scope, steps, negative, limitation}));
