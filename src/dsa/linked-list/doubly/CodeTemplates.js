export const DDL_CODE = {
  pushFront: `async pushFront(value) {
  const newNode = new Node(value);
  if (!this.head) {
    this.head = this.tail = newNode;
    return;
  }
  newNode.next = this.head;
  this.head.prev = newNode;
  this.head = newNode;
}`,
  pushBack: `async pushBack(value) {
  const newNode = new Node(value);
  if (!this.tail) {
    this.head = this.tail = newNode;
    return;
  }
  newNode.prev = this.tail;
  this.tail.next = newNode;
  this.tail = newNode;
}`,
  popFront: `async popFront() {
  if (!this.head) return;
  const toDelete = this.head;
  if (this.head === this.tail) {
    this.head = this.tail = null;
  } else {
    this.head = this.head.next;
    this.head.prev = null;
  }
  return toDelete;
}`,
  popBack: `async popBack() {
  if (!this.tail) return;
  const toDelete = this.tail;
  if (this.head === this.tail) {
    this.head = this.tail = null;
  } else {
    this.tail = this.tail.prev;
    this.tail.next = null;
  }
  return toDelete;
}`,
  search: `async search(value) {
  let curr = this.head;
  while (curr) {
    if (curr.value === value) return curr;
    curr = curr.next;
  }
  return null;
}`
};
