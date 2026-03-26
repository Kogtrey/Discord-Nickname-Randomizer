// util/random.js
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickDifferent(oldValue, values) {
    if (!values || values.length === 0) return null;

    if (values.length === 1) {
        return values[0] === oldValue ? null : values[0];
    }

    const filtered = values.filter(v => v !== oldValue);
    if (filtered.length === 0) return null;

    return pickRandom(filtered);
}

module.exports = { pickRandom, pickDifferent };