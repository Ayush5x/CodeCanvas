/**
 * Code Generator for Doubly Linked List
 * Generates C code based on the current state of nodes
 */

export const generateDoublyLinkedListCode = (nodes) => {
  if (!nodes || nodes.length === 0) {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for doubly linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* prev;             // Pointer to previous node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->prev = NULL;
    newNode->next = NULL;
    return newNode;
}

// Doubly Linked List structure
struct DoublyLinkedList {
    struct Node* head;             // Pointer to first node
    struct Node* tail;             // Pointer to last node
};

// Initialize empty list
struct DoublyLinkedList* createList() {
    struct DoublyLinkedList* list = (struct DoublyLinkedList*)malloc(sizeof(struct DoublyLinkedList));
    list->head = NULL;
    list->tail = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->prev = NULL;                      // Set prev to null

    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->next = list->head;            // Point to current head
        list->head->prev = newNode;            // Current head's prev points to new node
        list->head = newNode;                  // Update head pointer
    }
    printf("Inserted %d at beginning\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->prev = list->tail;            // New node's prev points to current tail
        list->tail->next = newNode;            // Current tail's next points to new node
        list->tail = newNode;                  // Update tail pointer
    }
    printf("Inserted %d at end\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct DoublyLinkedList* list, int value, int position) {
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Insert at beginning
        insertAtBeginning(list, value);
        return;
    }
    
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    struct Node* current = list->head;         // Start from head
    int i = 0;
    while (i < position - 1 && current != NULL) {
        current = current->next;               // Traverse to position
        i++;
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        free(newNode);
        return;
    }
    
    if (current->next == NULL) {               // Insert at end
        insertAtEnd(list, value);
        free(newNode);                         // Free the extra node since insertAtEnd creates one
        return;
    }
    
    newNode->next = current->next;             // Link new node to next node
    newNode->prev = current;                   // Link new node to current node
    current->next->prev = newNode;             // Update next node's prev pointer
    current->next = newNode;                   // Update current node's next pointer
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct DoublyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->head;    // Store reference
    
    if (list->head == list->tail) {            // Only one node
        list->head = NULL;                     // List becomes empty
        list->tail = NULL;
    } else {
        list->head = list->head->next;         // Move head pointer
        list->head->prev = NULL;               // New head's prev is NULL
    }
    
    free(nodeToDelete);                        // Free memory
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct DoublyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->tail;    // Store reference
    
    if (list->head == list->tail) {            // Only one node
        list->head = NULL;                     // List becomes empty
        list->tail = NULL;
    } else {
        list->tail = list->tail->prev;         // Move tail pointer
        list->tail->next = NULL;               // New tail's next is NULL
    }
    
    free(nodeToDelete);                        // Free memory
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct DoublyLinkedList* list, int position) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Delete from beginning
        deleteFromBeginning(list);
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    if (current == list->tail) {               // Last node
        deleteFromEnd(list);
        return;
    }
    
    current->prev->next = current->next;       // Update previous node's next
    current->next->prev = current->prev;       // Update next node's prev
    
    free(current);                             // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list from head to tail
void displayForward(struct DoublyLinkedList* list) {
    printf("List (forward): ");
    struct Node* current = list->head;
    while (current != NULL) {
        printf("%d <-> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

// Display the list from tail to head
void displayBackward(struct DoublyLinkedList* list) {
    printf("List (backward): ");
    struct Node* current = list->tail;
    while (current != NULL) {
        printf("%d <-> ", current->data);
        current = current->prev;
    }
    printf("NULL\\n");
}`;
  }

  // Create code for an existing list with nodes
  let code = `#include <stdio.h>
#include <stdlib.h>

// Node structure for doubly linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* prev;             // Pointer to previous node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->prev = NULL;
    newNode->next = NULL;
    return newNode;
}

// Doubly Linked List structure
struct DoublyLinkedList {
    struct Node* head;             // Pointer to first node
    struct Node* tail;             // Pointer to last node
};

// Initialize empty list
struct DoublyLinkedList* createList() {
    struct DoublyLinkedList* list = (struct DoublyLinkedList*)malloc(sizeof(struct DoublyLinkedList));
    list->head = NULL;
    list->tail = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->prev = NULL;                      // Set prev to null

    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->next = list->head;            // Point to current head
        list->head->prev = newNode;            // Current head's prev points to new node
        list->head = newNode;                  // Update head pointer
    }
    printf("Inserted %d at beginning\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct DoublyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        list->tail = newNode;                  // Node also becomes tail
    } else {                                   // List has nodes
        newNode->prev = list->tail;            // New node's prev points to current tail
        list->tail->next = newNode;            // Current tail's next points to new node
        list->tail = newNode;                  // Update tail pointer
    }
    printf("Inserted %d at end\\n", value);
}`;

  // Add sample operations for existing nodes
  if (nodes && nodes.length > 0) {
    code += `

// Sample operations for the current state
int main() {
    struct DoublyLinkedList* list = createList();
    
    // Creating initial list state
`;
    
    // Generate code for each node
    nodes.forEach((node, index) => {
      code += `    insertAtEnd(list, ${node.data});  // Node at position ${index}\n`;
    });

    code += `
    // Display the list
    displayForward(list);
    displayBackward(list);
    
    return 0;
}`;
  }

  return code;
};
