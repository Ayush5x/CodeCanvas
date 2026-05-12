// Linked List operations and utilities
import { MEMORY_POOL_SIZE } from '../../../constants';
import { generateMemoryAddress } from '../../../utils/helpers';

// Memory management for linked list visualization
export class LinkedListMemoryManager {
  constructor(poolSize = MEMORY_POOL_SIZE) {
    this.poolSize = poolSize;
    this.memoryAddresses = Array(poolSize).fill().map((_, i) => 
      generateMemoryAddress(i)
    );
    this.memoryPool = this.initializeMemoryPool();
  }

  initializeMemoryPool() {
    return Array(this.poolSize).fill().map((_, index) => ({
      address: this.memoryAddresses[index],
      inUse: false,
      index
    }));
  }

  getNextAvailableIndex() {
    for (let i = 0; i < this.poolSize; i++) {
      if (!this.memoryPool[i].inUse) {
        return i;
      }
    }
    return -1;
  }

  allocateMemory(data) {
    if (!data || data.toString().trim() === '') {
      throw new Error('Invalid data provided for memory allocation');
    }

    const availableSlot = this.getNextAvailableIndex();

    if (availableSlot === -1) {
      throw new Error('Memory pool is full! Cannot allocate more memory.');
    }

    // Mark slot as used
    this.memoryPool[availableSlot].inUse = true;

    return {
      data: data.toString().trim(),
      address: this.memoryAddresses[availableSlot],
      memoryIndex: availableSlot,
      prev: null,
      next: null
    };
  }

  freeMemory(memoryIndex) {
    if (memoryIndex === null || memoryIndex === undefined || 
        memoryIndex < 0 || memoryIndex >= this.poolSize) {
      console.warn('Invalid memory index provided for deallocation:', memoryIndex);
      return;
    }

    if (this.memoryPool[memoryIndex]) {
      this.memoryPool[memoryIndex].inUse = false;
    }
  }

  getMemoryStats() {
    const used = this.memoryPool.filter(slot => slot.inUse).length;
    const free = this.poolSize - used;
    return { used, free, total: this.poolSize };
  }

  detectMemoryLeaks(nodes) {
    const usedAddresses = new Set(nodes.map(node => node.memoryIndex));
    const allocatedSlots = this.memoryPool
      .filter(slot => slot.inUse)
      .map(slot => slot.index);
    
    return allocatedSlots.filter(index => !usedAddresses.has(index))
      .map(index => this.memoryAddresses[index]);
  }
}

// Linked List operations
export class DoublyLinkedList {
  constructor() {
    this.nodes = [];
    this.memoryManager = new LinkedListMemoryManager();
  }

  insertAtBeginning(data) {
    const newNode = this.memoryManager.allocateMemory(data);
    
    if (this.nodes.length > 0) {
      newNode.next = this.nodes[0].memoryIndex;
      this.nodes[0].prev = newNode.memoryIndex;
      this.nodes.unshift(newNode);
    } else {
      this.nodes = [newNode];
    }
    
    return this.nodes;
  }

  insertAtEnd(data) {
    const newNode = this.memoryManager.allocateMemory(data);
    
    if (this.nodes.length > 0) {
      newNode.prev = this.nodes[this.nodes.length - 1].memoryIndex;
      this.nodes[this.nodes.length - 1].next = newNode.memoryIndex;
      this.nodes.push(newNode);
    } else {
      this.nodes = [newNode];
    }
    
    return this.nodes;
  }

  insertAtPosition(data, position) {
    if (position === 0) {
      return this.insertAtBeginning(data);
    }
    
    if (position === this.nodes.length) {
      return this.insertAtEnd(data);
    }
    
    if (position < 0 || position > this.nodes.length) {
      throw new Error(`Invalid position: ${position}`);
    }

    const newNode = this.memoryManager.allocateMemory(data);
    
    newNode.prev = this.nodes[position - 1].memoryIndex;
    newNode.next = this.nodes[position].memoryIndex;

    this.nodes[position - 1].next = newNode.memoryIndex;
    this.nodes[position].prev = newNode.memoryIndex;

    this.nodes.splice(position, 0, newNode);
    
    return this.nodes;
  }

  deleteAtBeginning() {
    if (this.nodes.length === 0) {
      throw new Error('List is empty! Cannot delete.');
    }

    const deletedNode = this.nodes[0];
    this.memoryManager.freeMemory(deletedNode.memoryIndex);

    if (this.nodes.length === 1) {
      this.nodes = [];
    } else {
      this.nodes[1].prev = null;
      this.nodes.shift();
    }

    return this.nodes;
  }

  deleteAtEnd() {
    if (this.nodes.length === 0) {
      throw new Error('List is empty! Cannot delete.');
    }

    const deletedNode = this.nodes[this.nodes.length - 1];
    this.memoryManager.freeMemory(deletedNode.memoryIndex);

    if (this.nodes.length === 1) {
      this.nodes = [];
    } else {
      this.nodes[this.nodes.length - 2].next = null;
      this.nodes.pop();
    }

    return this.nodes;
  }

  deleteAtPosition(position) {
    if (position < 0 || position >= this.nodes.length) {
      throw new Error(`Invalid position: ${position}`);
    }

    if (position === 0) {
      return this.deleteAtBeginning();
    }

    if (position === this.nodes.length - 1) {
      return this.deleteAtEnd();
    }

    const deletedNode = this.nodes[position];
    this.memoryManager.freeMemory(deletedNode.memoryIndex);

    this.nodes[position - 1].next = this.nodes[position + 1].memoryIndex;
    this.nodes[position + 1].prev = this.nodes[position - 1].memoryIndex;

    this.nodes.splice(position, 1);

    return this.nodes;
  }

  clear() {
    this.nodes.forEach(node => {
      this.memoryManager.freeMemory(node.memoryIndex);
    });
    this.nodes = [];
    return this.nodes;
  }

  getMemoryStats() {
    return this.memoryManager.getMemoryStats();
  }

  getMemoryPool() {
    return this.memoryManager.memoryPool;
  }

  detectMemoryLeaks() {
    return this.memoryManager.detectMemoryLeaks(this.nodes);
  }
}
