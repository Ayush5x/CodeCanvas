export const SILL_CODE = {
  insert: `async insert(value, index) {
  const newNode = new Node(value);
  if (index === 0) {
    newNode.next = this.head;
    this.head = newNode;
    return;
  }
  let curr = this.head;
  for (let i = 0; i < index - 1; i++) {
    curr = curr.next;
  }
  newNode.next = curr.next;
  curr.next = newNode;
}`,
  delete: `async delete(index) {
  if (index === 0) {
    this.head = this.head.next;
    return;
  }
  let curr = this.head;
  for (let i = 0; i < index - 1; i++) {
    curr = curr.next;
  }
  curr.next = curr.next.next;
}`,
  search: `async search(value) {
  let curr = this.head;
  while (curr) {
    if (curr.value === value) return curr;
    curr = curr.next;
  }
  return null;
}`,
  reverse: `async reverse() {
  let prev = null;
  let curr = this.head;
  let next = null;
  while (curr) {
    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  this.head = prev;
}`
};
