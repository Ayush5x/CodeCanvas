export const CIR_CODE = {
  insert: `async insert(value, index) {
  const newNode = new Node(value);
  if (!this.head) {
    this.head = newNode;
    newNode.next = this.head;
    return;
  }
  if (index === 0) {
    let curr = this.head;
    while (curr.next !== this.head) {
      curr = curr.next;
    }
    newNode.next = this.head;
    curr.next = newNode;
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
  if (!this.head) return;
  if (index === 0) {
    if (this.head.next === this.head) {
      this.head = null;
      return;
    }
    let curr = this.head;
    while (curr.next !== this.head) {
      curr = curr.next;
    }
    curr.next = this.head.next;
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
  if (!this.head) return null;
  let curr = this.head;
  do {
    if (curr.value === value) return curr;
    curr = curr.next;
  } while (curr !== this.head);
  return null;
}`,
  traverse: `async traverse() {
  if (!this.head) return;
  let curr = this.head;
  do {
    // Process curr.value
    curr = curr.next;
  } while (curr !== this.head);
}`
};
