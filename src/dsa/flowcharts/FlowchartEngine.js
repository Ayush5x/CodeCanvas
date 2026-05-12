export class FlowchartEngine {
  constructor(onSync, onWait) {
    this.onSync = onSync;
    this.onWait = onWait;
    this.callStack = [];
    this.activeNode = null;
    this.activeEdge = null;
    this.isHalted = false;
    this.callId = 0;
  }

  halt() {
    this.isHalted = true;
  }

  async syncNode(nodeId, edgeId = null, extraLocals = {}, status = 'active') {
    if (this.isHalted) throw new Error("Halted");
    
    this.activeNode = nodeId;
    this.activeEdge = edgeId;
    this.status = status;
    
    if (this.callStack.length > 0) {
      const top = this.callStack[this.callStack.length - 1];
      top.locals = { ...top.locals, ...extraLocals };
    }
    
    this.onSync({
      activeNode: this.activeNode,
      activeEdge: this.activeEdge,
      status: this.status,
      callStack: [...this.callStack]
    });
    
    await this.onWait();
    if (this.isHalted) throw new Error("Halted");
  }

  async runFactorial(n) {
    this.callId++;
    const frame = { id: this.callId, n, locals: {} };
    this.callStack.push(frame);

    await this.syncNode('n_start', 'e_start_dec');
    await this.syncNode('n_dec', null, {}, 'decision');
    
    if (n <= 1) {
      await this.syncNode('n_dec', 'e_dec_base', {}, 'base');
      await this.syncNode('n_base', 'e_base_end', {}, 'return');
      await this.syncNode('n_end');
      
      const ret = 1;
      this.callStack.pop();
      return ret;
    } else {
      await this.syncNode('n_dec', 'e_dec_rec', {}, 'recursive');
      await this.syncNode('n_rec', 'e_rec_loop', {}, 'recursive');
      
      const childRes = await this.runFactorial(n - 1);
      
      if (this.isHalted) throw new Error("Halted");
      frame.locals.childRes = childRes;
      
      await this.syncNode('n_rec', 'e_rec_mul', {}, 'process');
      frame.locals.result = n * childRes;
      await this.syncNode('n_mul', 'e_mul_end', {}, 'return');
      await this.syncNode('n_end');
      
      const ret = n * childRes;
      this.callStack.pop();
      return ret;
    }
  }

  async runBinarySearch(arr, target, low, high) {
    this.callId++;
    const frame = { id: this.callId, low, high, locals: {} };
    this.callStack.push(frame);

    await this.syncNode('bs_start', 'bs_start_mid');
    
    if (low > high) {
      await this.syncNode('bs_end', null, {}, 'fail');
      this.callStack.pop();
      return -1;
    }

    const mid = Math.floor((low + high) / 2);
    frame.locals.mid = mid;
    frame.locals.val = arr[mid];

    await this.syncNode('bs_mid', 'bs_mid_dec', {}, 'process');
    await this.syncNode('bs_dec', null, {}, 'decision');

    if (arr[mid] === target) {
      await this.syncNode('bs_dec', 'bs_dec_found', {}, 'success');
      await this.syncNode('bs_end');
      this.callStack.pop();
      return mid;
    } else if (arr[mid] > target) {
      await this.syncNode('bs_dec', 'bs_dec_left', {}, 'process');
      await this.syncNode('bs_update_high', 'bs_loop', {}, 'recursive');
      const res = await this.runBinarySearch(arr, target, low, mid - 1);
      this.callStack.pop();
      return res;
    } else {
      await this.syncNode('bs_dec', 'bs_dec_right', {}, 'process');
      await this.syncNode('bs_update_low', 'bs_loop', {}, 'recursive');
      const res = await this.runBinarySearch(arr, target, mid + 1, high);
      this.callStack.pop();
      return res;
    }
  }

  async runGCD(a, b) {
    this.callId++;
    const frame = { id: this.callId, a, b, locals: {} };
    this.callStack.push(frame);

    await this.syncNode('gcd_start', 'gcd_start_dec');
    await this.syncNode('gcd_dec', null, {}, 'decision');

    if (b === 0) {
      await this.syncNode('gcd_dec', 'gcd_dec_base', {}, 'success');
      await this.syncNode('gcd_end');
      this.callStack.pop();
      return a;
    } else {
      await this.syncNode('gcd_dec', 'gcd_dec_rec', {}, 'process');
      const rem = a % b;
      frame.locals.rem = rem;
      await this.syncNode('gcd_mod', 'gcd_loop', {}, 'recursive');
      const res = await this.runGCD(b, rem);
      this.callStack.pop();
      return res;
    }
  }

  async runGrahamScan(points) {
    this.callId++;
    const frame = { id: this.callId, points_count: points.length, locals: {} };
    this.callStack.push(frame);

    await this.syncNode('gs_start', 'gs_start_check');
    
    for (let i = 0; i < points.length; i++) {
      frame.locals.index = i;
      await this.syncNode('gs_check', null, {}, 'decision');
      
      const isLeftTurn = Math.random() > 0.5;
      if (isLeftTurn) {
        await this.syncNode('gs_check', 'gs_check_left', {}, 'success');
        await this.syncNode('gs_push', 'gs_loop', {}, 'process');
      } else {
        await this.syncNode('gs_check', 'gs_check_right', {}, 'fail');
        await this.syncNode('gs_pop', 'gs_loop', {}, 'process');
      }
    }

    await this.syncNode('gs_end');
    this.callStack.pop();
  }
}
