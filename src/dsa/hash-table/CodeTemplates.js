export const getHashCode = (hashType, probeType) => {
  const hashLogic = {
    division: "key % size",
    midSquare: "parseInt((key * key).toString().substr(Math.floor((key * key).toString().length/2)-1, 2)) % size",
    folding: "key.toString().split('').reduce((a, b) => a + parseInt(b), 0) % size"
  };

  const probeLogic = {
    linear: "(hash + i) % size",
    quadratic: "(hash + i * i) % size",
    double: "(hash + i * secondaryHash(key)) % size"
  };

  return `async insert(key) {
  const hash = ${hashLogic[hashType]};
  let index = hash % size;
  let i = 0;

  while (table[index] !== null) {
    i++;
    index = ${probeLogic[probeType]};
    if (i >= size) return "Overflow";
  }

  table[index] = key;
}`;
};

export const HASH_CODE = {
  // Keeping these for reference or other parts of the app
  hashFunctions: {
    division: `(key) => key % size`,
    midSquare: `(key) => {
  const square = (k * k).toString();
  return parseInt(square.substr(Math.floor(square.length/2)-1, 2)) % size;
}`,
    folding: `(key) => {
  return key.toString().split('').reduce((a,b) => a + parseInt(b), 0) % size;
}`
  },
  collisionResolution: {
    linear: `(hash, i) => (hash + i) % size`,
    quadratic: `(hash, i) => (hash + i * i) % size`,
    double: `(hash, i) => (hash + i * h2(key)) % size`
  }
};
