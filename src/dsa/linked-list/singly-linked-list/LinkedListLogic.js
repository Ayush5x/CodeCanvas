class Node {
  constructor(value, address) {
    this.value = value;
    this.next = null;
    this.id = Math.random().toString(36).substr(2, 9);
    this.address = address;
  }
}

export class LinkedListLogic {
  constructor(onUpdate, getDelay, checkPause) {
    this.head = null;
    this.onUpdate = onUpdate;
    this.getDelay = getDelay;
    this.checkPause = checkPause;
    this.size = 0;
    
    // Initialize a stable memory pool
    this.memoryPool = Array(16).fill().map((_, i) => ({
      address: `0x${(i * 256).toString(16).toUpperCase().padStart(4, '0')}`,
      inUse: false,
      nodeId: null
    }));
  }

  _allocate(value) {
    const slot = this.memoryPool.find(s => !s.inUse);
    if (!slot) return null;
    slot.inUse = true;
    const newNode = new Node(value, slot.address);
    slot.nodeId = newNode.id;
    return newNode;
  }

  _free(node) {
    const slot = this.memoryPool.find(s => s.address === node.address);
    if (slot) {
      slot.inUse = false;
      slot.nodeId = null;
    }
  }

  async _step(line, pointers = {}) {
    this.onUpdate({
      line,
      head: this.head,
      pointers,
      list: this.toArray(),
      memoryPool: [...this.memoryPool]
    });
    await this.checkPause();
    await new Promise(resolve => setTimeout(resolve, this.getDelay()));
  }

  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push({ 
        value: curr.value, 
        id: curr.id, 
        address: curr.address,
        nextId: curr.next ? curr.next.id : null,
        nextAddr: curr.next ? curr.next.address : 'NULL'
      });
      curr = curr.next;
    }
    return arr;
  }

  async insert(value, index) {
    // line 2: const newNode = new Node(value);
    const newNode = this._allocate(value);
    if (!newNode) return;
    await this._step(2, { newNode });

    // line 3: if (index === 0) {
    await this._step(3, { newNode });
    if (index === 0) {
      // line 4: newNode.next = this.head;
      newNode.next = this.head;
      await this._step(4, { newNode });
      // line 5: this.head = newNode;
      this.head = newNode;
      await this._step(5, { newNode });
      this.size++;
      await this._step(-1);
      return;
    }

    // line 8: let curr = this.head;
    let curr = this.head;
    await this._step(8, { newNode, curr });

    // line 9: for (let i = 0; i < index - 1; i++) {
    for (let i = 0; i < index - 1; i++) {
      await this._step(9, { newNode, curr, i });
      // line 10: curr = curr.next;
      curr = curr.next;
      await this._step(10, { newNode, curr, i });
    }
    await this._step(9, { newNode, curr });

    // line 12: newNode.next = curr.next;
    newNode.next = curr.next;
    await this._step(12, { newNode, curr });

    // line 13: curr.next = newNode;
    curr.next = newNode;
    await this._step(13, { newNode, curr });
    
    this.size++;
    await this._step(-1);
  }

  async delete(index) {
    if (this.size === 0) return;
    
    // line 2: if (index === 0) {
    await this._step(2);
    if (index === 0) {
      const toDelete = this.head;
      // line 3: this.head = this.head.next;
      this.head = this.head.next;
      await this._step(3);
      this._free(toDelete);
      this.size--;
      await this._step(-1);
      return;
    }

    // line 6: let curr = this.head;
    let curr = this.head;
    await this._step(6, { curr });

    // line 7: for (let i = 0; i < index - 1; i++) {
    for (let i = 0; i < index - 1; i++) {
      await this._step(7, { curr, i });
      // line 8: curr = curr.next;
      curr = curr.next;
      await this._step(8, { curr, i });
    }
    await this._step(7, { curr });

    // line 10: curr.next = curr.next.next;
    if (curr.next) {
      const toDelete = curr.next;
      curr.next = curr.next.next;
      await this._step(10, { curr });
      this._free(toDelete);
    } else {
      await this._step(10, { curr });
    }

    this.size--;
    await this._step(-1);
  }

  async search(value) {
    // line 2: let curr = this.head;
    let curr = this.head;
    await this._step(2, { curr });

    // line 3: while (curr) {
    while (curr) {
      await this._step(3, { curr });
      // line 4: if (curr.value === value) return curr;
      await this._step(4, { curr });
      if (curr.value === value) {
        await this._step(-1, { found: curr });
        return curr;
      }
      // line 5: curr = curr.next;
      curr = curr.next;
      await this._step(5, { curr });
    }
    await this._step(3, { curr });

    // line 7: return null;
    await this._step(7);
    await this._step(-1);
    return null;
  }

  async reverse() {
    // line 2: let prev = null;
    let prev = null;
    await this._step(2, { prev });

    // line 3: let curr = this.head;
    let curr = this.head;
    await this._step(3, { prev, curr });

    // line 4: let next = null;
    let next = null;
    await this._step(4, { prev, curr, next });

    // line 5: while (curr) {
    while (curr) {
      await this._step(5, { prev, curr, next });
      
      // line 6: next = curr.next;
      next = curr.next;
      await this._step(6, { prev, curr, next });

      // line 7: curr.next = prev;
      curr.next = prev;
      await this._step(7, { prev, curr, next });

      // line 8: prev = curr;
      prev = curr;
      await this._step(8, { prev, curr, next });

      // line 9: curr = next;
      curr = next;
      await this._step(9, { prev, curr, next });
    }
    await this._step(5, { prev, curr, next });

    // line 11: this.head = prev;
    this.head = prev;
    await this._step(11, { head: this.head });

    await this._step(-1);
  }
}
