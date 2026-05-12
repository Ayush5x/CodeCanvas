export class RecursionEngine {
  constructor(onStateChange, onWait) {
    this.onStateChange = onStateChange;
    this.onWait = onWait;
    this.nodes = {}; // id -> node details
    this.stack = []; // array of active node ids
    this.edges = []; // array of {from, to, status: 'call' | 'return'}
    this.callCount = 0;
    this.isHalted = false;
    // For Tower of Hanoi
    this.pegs = { A: [], B: [], C: [] };
  }

  initPegs(n) {
    this.pegs = {
      A: Array.from({ length: n }, (_, i) => n - i),
      B: [],
      C: []
    };
  }

  halt() {
    this.isHalted = true;
  }

  async _sync() {
    if (this.isHalted) throw new Error("Halted");
    this.onStateChange({
      nodes: { ...this.nodes },
      stack: [...this.stack],
      edges: [...this.edges],
      pegs: { A: [...this.pegs.A], B: [...this.pegs.B], C: [...this.pegs.C] }
    });
    await this.onWait();
    if (this.isHalted) throw new Error("Halted");
  }

  async pushFrame(parentId, name, args) {
    this.callCount++;
    const id = `node-${this.callCount}`;
    const node = {
      id,
      parentId,
      name,
      args,
      locals: {},
      status: 'active', // 'active', 'waiting', 'base-case', 'returned'
      returnValue: null
    };
    this.nodes[id] = node;
    this.stack.push(id);
    
    if (parentId) {
      this.edges.push({ from: parentId, to: id, status: 'call' });
    }
    
    await this._sync();
    return id;
  }

  async updateLocals(id, locals) {
    if (this.nodes[id]) {
      this.nodes[id].locals = { ...this.nodes[id].locals, ...locals };
      this.nodes[id].status = 'active'; // wakes up
      await this._sync();
    }
  }

  async setWaiting(id) {
    if (this.nodes[id]) {
      this.nodes[id].status = 'waiting';
      await this._sync();
    }
  }

  async highlightBaseCase(id) {
    if (this.nodes[id]) {
      this.nodes[id].status = 'base-case';
      await this._sync();
    }
  }

  async popFrame(id, returnValue) {
    if (this.nodes[id]) {
      this.nodes[id].returnValue = returnValue;
      this.nodes[id].status = 'returned';
      
      // Update edge to return
      const edge = this.edges.find(e => e.to === id);
      if (edge) edge.status = 'return';

      // Remove from stack
      this.stack = this.stack.filter(s => s !== id);
      await this._sync();
    }
  }

  // Algorithm: Fibonacci
  async runFibonacci(n, parentId = null) {
    const id = await this.pushFrame(parentId, 'fib', { n });

    if (n <= 1) {
      await this.highlightBaseCase(id);
      await this.popFrame(id, n);
      return n;
    }

    await this.setWaiting(id);
    const left = await this.runFibonacci(n - 1, id);
    
    await this.updateLocals(id, { left });

    await this.setWaiting(id);
    const right = await this.runFibonacci(n - 2, id);

    await this.updateLocals(id, { left, right });

    const result = left + right;
    await this.popFrame(id, result);
    return result;
  }

  // Algorithm: Factorial
  async runFactorial(n, parentId = null) {
    const id = await this.pushFrame(parentId, 'fact', { n });

    if (n <= 1) {
      await this.highlightBaseCase(id);
      await this.popFrame(id, 1);
      return 1;
    }

    await this.setWaiting(id);
    const childRes = await this.runFactorial(n - 1, id);

    await this.updateLocals(id, { 'fact(n-1)': childRes });
    
    const result = n * childRes;
    await this.popFrame(id, result);
    return result;
  }

  // Algorithm: Tribonacci
  async runTribonacci(n, parentId = null) {
    const id = await this.pushFrame(parentId, 'trib', { n });

    if (n === 0) {
      await this.highlightBaseCase(id);
      await this.popFrame(id, 0);
      return 0;
    }
    if (n <= 2) {
      await this.highlightBaseCase(id);
      await this.popFrame(id, 1);
      return 1;
    }

    await this.setWaiting(id);
    const n1 = await this.runTribonacci(n - 1, id);
    
    await this.updateLocals(id, { 't(n-1)': n1 });

    await this.setWaiting(id);
    const n2 = await this.runTribonacci(n - 2, id);

    await this.updateLocals(id, { 't(n-1)': n1, 't(n-2)': n2 });

    await this.setWaiting(id);
    const n3 = await this.runTribonacci(n - 3, id);

    await this.updateLocals(id, { 't(n-1)': n1, 't(n-2)': n2, 't(n-3)': n3 });

    const result = n1 + n2 + n3;
    await this.popFrame(id, result);
    return result;
  }

  // Algorithm: Tower of Hanoi
  async runHanoi(n, source = 'A', auxiliary = 'B', destination = 'C', parentId = null) {
    const id = await this.pushFrame(parentId, 'hanoi', { n, from: source, to: destination });

    if (n === 1) {
      await this.setWaiting(id);
      // Move disk
      const disk = this.pegs[source].pop();
      this.pegs[destination].push(disk);
      await this.highlightBaseCase(id);
      await this.popFrame(id, `Move ${source}→${destination}`);
      return;
    }

    await this.setWaiting(id);
    await this.runHanoi(n - 1, source, destination, auxiliary, id);
    
    // Move largest disk
    await this.updateLocals(id, { action: `Moving disk ${n}` });
    const disk = this.pegs[source].pop();
    this.pegs[destination].push(disk);
    await this._sync();

    await this.setWaiting(id);
    await this.runHanoi(n - 1, auxiliary, source, destination, id);

    await this.popFrame(id, `Done`);
  }
}
