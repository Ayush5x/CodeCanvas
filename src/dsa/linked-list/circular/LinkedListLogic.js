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
      pointers,
      list: this.toArray(),
      memoryPool: [...this.memoryPool]
    });
    await this.checkPause();
    await new Promise(resolve => setTimeout(resolve, this.getDelay()));
  }

  toArray() {
    const arr = [];
    if (!this.head) return arr;
    
    let curr = this.head;
    const visited = new Set();
    
    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
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
    const newNode = this._allocate(value);
    if (!newNode) return;
    await this._step(2, { newNode });

    await this._step(3, { newNode });
    if (!this.head) {
      this.head = newNode;
      await this._step(4, { newNode });
      newNode.next = this.head;
      await this._step(5, { newNode });
      this.size++;
      await this._step(-1);
      return;
    }

    await this._step(8, { newNode });
    if (index === 0) {
      let curr = this.head;
      await this._step(9, { newNode, curr });
      
      while (curr.next !== this.head) {
        await this._step(10, { newNode, curr });
        curr = curr.next;
        await this._step(11, { newNode, curr });
      }
      await this._step(10, { newNode, curr });

      newNode.next = this.head;
      await this._step(13, { newNode, curr });

      curr.next = newNode;
      await this._step(14, { newNode, curr });

      this.head = newNode;
      await this._step(15, { newNode, curr });
      
      this.size++;
      await this._step(-1);
      return;
    }

    let curr = this.head;
    await this._step(18, { newNode, curr });

    for (let i = 0; i < index - 1; i++) {
      await this._step(19, { newNode, curr, i });
      curr = curr.next;
      await this._step(20, { newNode, curr, i });
    }
    await this._step(19, { newNode, curr });

    newNode.next = curr.next;
    await this._step(22, { newNode, curr });

    curr.next = newNode;
    await this._step(23, { newNode, curr });
    
    this.size++;
    await this._step(-1);
  }

  async delete(index) {
    if (!this.head) return;
    await this._step(2);
    await this._step(3);
    if (index === 0) {
      await this._step(4);
      if (this.head.next === this.head) {
        const toDelete = this.head;
        this.head = null;
        await this._step(5);
        this._free(toDelete);
        this.size--;
        await this._step(-1);
        return;
      }

      let curr = this.head;
      await this._step(8, { curr });

      while (curr.next !== this.head) {
        await this._step(9, { curr });
        curr = curr.next;
        await this._step(10, { curr });
      }
      await this._step(9, { curr });

      const toDelete = this.head;
      curr.next = this.head.next;
      await this._step(12, { curr });

      this.head = this.head.next;
      await this._step(13, { curr });
      
      this._free(toDelete);
      this.size--;
      await this._step(-1);
      return;
    }

    let curr = this.head;
    await this._step(16, { curr });

    for (let i = 0; i < index - 1; i++) {
      await this._step(17, { curr, i });
      curr = curr.next;
      await this._step(18, { curr, i });
    }
    await this._step(17, { curr });

    if (curr.next) {
      const toDelete = curr.next;
      curr.next = curr.next.next;
      await this._step(20, { curr });
      this._free(toDelete);
    }
    
    this.size--;
    await this._step(-1);
  }

  async search(value) {
    if (!this.head) return null;
    await this._step(2);

    let curr = this.head;
    await this._step(3, { curr });

    do {
      await this._step(4, { curr });
      await this._step(5, { curr });
      if (curr.value === value) {
        await this._step(-1, { found: curr });
        return curr;
      }
      curr = curr.next;
      await this._step(6, { curr });
    } while (curr !== this.head);
    
    await this._step(7, { curr });
    await this._step(8);
    await this._step(-1);
    return null;
  }

  async traverse() {
    if (!this.head) return;
    await this._step(2);

    let curr = this.head;
    await this._step(3, { curr });

    do {
      await this._step(4, { curr });
      await this._step(5, { curr });
      curr = curr.next;
      await this._step(6, { curr });
    } while (curr !== this.head);
    
    await this._step(7, { curr });
    await this._step(-1);
  }
}
