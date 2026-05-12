class Node {
  constructor(value, address) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.id = Math.random().toString(36).substr(2, 9);
    this.address = address;
  }
}

export class LinkedListLogic {
  constructor(onUpdate, getDelay, checkPause) {
    this.head = null;
    this.tail = null;
    this.onUpdate = onUpdate;
    this.getDelay = getDelay;
    this.checkPause = checkPause;
    this.size = 0;
    
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
    if (!node) return;
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
      tail: this.tail,
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
        nextAddr: curr.next ? curr.next.address : 'NULL',
        prevAddr: curr.prev ? curr.prev.address : 'NULL'
      });
      curr = curr.next;
    }
    return arr;
  }

  async pushFront(value) {
    // line 2: const newNode = new Node(value);
    const newNode = this._allocate(value);
    if (!newNode) return;
    await this._step(2, { newNode });

    // line 3: if (!this.head) {
    await this._step(3, { newNode });
    if (!this.head) {
      // line 4: this.head = this.tail = newNode;
      this.head = this.tail = newNode;
      await this._step(4, { newNode });
      this.size++;
      await this._step(-1);
      return;
    }

    // line 7: newNode.next = this.head;
    newNode.next = this.head;
    await this._step(7, { newNode });

    // line 8: this.head.prev = newNode;
    this.head.prev = newNode;
    await this._step(8, { newNode });

    // line 9: this.head = newNode;
    this.head = newNode;
    await this._step(9, { newNode });
    
    this.size++;
    await this._step(-1);
  }

  async pushBack(value) {
    // line 2: const newNode = new Node(value);
    const newNode = this._allocate(value);
    if (!newNode) return;
    await this._step(2, { newNode });

    // line 3: if (!this.tail) {
    await this._step(3, { newNode });
    if (!this.tail) {
      // line 4: this.head = this.tail = newNode;
      this.head = this.tail = newNode;
      await this._step(4, { newNode });
      this.size++;
      await this._step(-1);
      return;
    }

    // line 7: newNode.prev = this.tail;
    newNode.prev = this.tail;
    await this._step(7, { newNode });

    // line 8: this.tail.next = newNode;
    this.tail.next = newNode;
    await this._step(8, { newNode });

    // line 9: this.tail = newNode;
    this.tail = newNode;
    await this._step(9, { newNode });
    
    this.size++;
    await this._step(-1);
  }

  async popFront() {
    // line 2: if (!this.head) return;
    await this._step(2);
    if (!this.head) return;

    // line 3: const toDelete = this.head;
    const toDelete = this.head;
    await this._step(3, { toDelete });

    // line 4: if (this.head === this.tail) {
    await this._step(4, { toDelete });
    if (this.head === this.tail) {
      // line 5: this.head = this.tail = null;
      this.head = this.tail = null;
      await this._step(5, { toDelete });
    } else {
      // line 7: this.head = this.head.next;
      this.head = this.head.next;
      await this._step(7, { toDelete });
      // line 8: this.head.prev = null;
      this.head.prev = null;
      await this._step(8, { toDelete });
    }
    
    this._free(toDelete);
    this.size--;
    await this._step(-1);
  }

  async popBack() {
    // line 2: if (!this.tail) return;
    await this._step(2);
    if (!this.tail) return;

    // line 3: const toDelete = this.tail;
    const toDelete = this.tail;
    await this._step(3, { toDelete });

    // line 4: if (this.head === this.tail) {
    await this._step(4, { toDelete });
    if (this.head === this.tail) {
      // line 5: this.head = this.tail = null;
      this.head = this.tail = null;
      await this._step(5, { toDelete });
    } else {
      // line 7: this.tail = this.tail.prev;
      this.tail = this.tail.prev;
      await this._step(7, { toDelete });
      // line 8: this.tail.next = null;
      this.tail.next = null;
      await this._step(8, { toDelete });
    }
    
    this._free(toDelete);
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
}
