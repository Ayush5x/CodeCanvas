class Node {
  constructor(value, address) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.id = Math.random().toString(36).substr(2, 9);
    this.address = address;
  }
}

export class HashLogic {
  constructor(size, hashType, probeType, onUpdate, getDelay, checkPause) {
    this.size = size;
    this.hashType = hashType;
    this.probeType = probeType;
    this.table = Array(size).fill(null);
    this.onUpdate = onUpdate;
    this.getDelay = getDelay;
    this.checkPause = checkPause;
  }

  async _step(line, data = {}) {
    this.onUpdate({
      line,
      table: [...this.table],
      ...data
    });
    await this.checkPause();
    await new Promise(resolve => setTimeout(resolve, this.getDelay()));
  }

  calculateHash(key) {
    const k = parseInt(key) || 0;
    switch (this.hashType) {
      case 'division':
        return k;
      case 'midSquare':
        const square = (k * k).toString();
        const start = Math.max(0, Math.floor(square.length / 2) - 1);
        return parseInt(square.substr(start, 2)) || 0;
      case 'folding':
        const str = k.toString();
        let sum = 0;
        for (let i = 0; i < str.length; i += 2) {
          sum += parseInt(str.substr(i, 2)) || 0;
        }
        return sum;
      default:
        return k;
    }
  }

  getSecondaryHash(key) {
    const k = parseInt(key) || 0;
    const R = this.size > 7 ? 7 : 3;
    return R - (k % R);
  }

  calculateIndex(hash, i, key) {
    const h = parseInt(hash);
    const k = parseInt(key);
    switch (this.probeType) {
      case 'linear':
        return (h + i) % this.size;
      case 'quadratic':
        return (h + i * i) % this.size;
      case 'double':
        const h2 = this.getSecondaryHash(k);
        return (h + i * h2) % this.size;
      default:
        return (h + i) % this.size;
    }
  }

  async insert(key) {
    const k = parseInt(key);
    if (isNaN(k)) return;

    // line 2: const hash = this.calculateHash(key);
    const hash = this.calculateHash(k);
    await this._step(2, { 
      message: `Initial Hash: ${hash}`, 
      math: `hash(${k}) = ${hash}`,
      highlightedIndex: -1
    });

    // line 3: let index = hash % this.size;
    let index = hash % this.size;
    await this._step(3, { 
      message: `Initial Index: ${index}`, 
      math: `${hash} % ${this.size} = ${index}`,
      highlightedIndex: index
    });

    // line 4: let i = 0;
    let i = 0;
    await this._step(4, { highlightedIndex: index });

    // line 6: while (this.table[index] !== null) {
    while (this.table[index] !== null) {
      await this._step(6, { 
        message: `Collision at index ${index}!`, 
        collisionIndex: index,
        highlightedIndex: index
      });

      // line 7: i++;
      i++;
      await this._step(7, { highlightedIndex: index });

      if (i >= this.size) {
        // line 9: if (i >= this.size) return;
        await this._step(9, { message: "Table Full! Overflow.", math: "Error" });
        return;
      }

      // line 8: index = this.probe(hash, i);
      const prevIndex = index;
      index = this.calculateIndex(hash, i, k);
      
      let probeMath = "";
      if (this.probeType === 'linear') probeMath = `(${hash} + ${i}) % ${this.size} = ${index}`;
      else if (this.probeType === 'quadratic') probeMath = `(${hash} + ${i}²) % ${this.size} = ${index}`;
      else probeMath = `(${hash} + ${i} * ${this.getSecondaryHash(k)}) % ${this.size} = ${index}`;

      await this._step(8, { 
        message: `Probing index ${index}...`, 
        math: probeMath,
        highlightedIndex: index,
        collisionIndex: prevIndex
      });
    }

    // line 6 (exit loop)
    await this._step(6, { message: `Found empty slot at index ${index}`, highlightedIndex: index });

    // line 12: this.table[index] = key;
    this.table[index] = k;
    await this._step(12, { 
      message: `Inserted ${k} at index ${index}`, 
      math: `table[${index}] = ${k}`,
      highlightedIndex: index,
      success: true
    });

    await this._step(-1);
  }
}
