/**
 * Code Generator for Singly Linked List
 * Generates C code based on the current state of nodes
 */

export const generateSinglyLinkedListCode = (nodes) => {
  if (!nodes || nodes.length === 0) {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for singly linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

// Singly Linked List structure
struct SinglyLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct SinglyLinkedList* createList() {
    struct SinglyLinkedList* list = (struct SinglyLinkedList*)malloc(sizeof(struct SinglyLinkedList));
    list->head = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = list->head;                // Point to current head
    list->head = newNode;                      // Update head pointer
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != NULL) {        // Traverse to end
            current = current->next;
        }
        current->next = newNode;               // Link to new node
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct SinglyLinkedList* list, int value, int position) {
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
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        free(newNode);
        return;
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->head;    // Store reference
    list->head = list->head->next;             // Move head pointer
    free(nodeToDelete);                        // Free memory
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == NULL) {            // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
        printf("Deleted from end\\n");
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    while (current->next->next != NULL) {     // Find second last
        current = current->next;
    }
    
    free(current->next);                       // Free last node
    current->next = NULL;                      // Update link
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct SinglyLinkedList* list, int position) {
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
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL || current->next == NULL) { // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct SinglyLinkedList* list) {
    struct Node* current = list->head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

int main() {
    struct SinglyLinkedList* list = createList();
    
    // Example operations based on current state
    ${generateOperationsFromNodes(nodes)}
    
    printf("Final list: ");
    display(list);
    
    return 0;
}`;
  }

  // Generate operations based on the current nodes
  return `#include <stdio.h>
#include <stdlib.h>

// Node structure for singly linked list
struct Node {
    int data;                      // Data stored in the node
    struct Node* next;             // Pointer to next node
};

// Create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

// Singly Linked List structure
struct SinglyLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct SinglyLinkedList* createList() {
    struct SinglyLinkedList* list = (struct SinglyLinkedList*)malloc(sizeof(struct SinglyLinkedList));
    list->head = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = list->head;                // Point to current head
    list->head = newNode;                      // Update head pointer
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct SinglyLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    newNode->next = NULL;                      // Set next to null
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != NULL) {        // Traverse to end
            current = current->next;
        }
        current->next = newNode;               // Link to new node
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct SinglyLinkedList* list, int value, int position) {
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
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL) {                     // Position beyond list
        printf("Position out of range\\n");
        free(newNode);
        return;
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    struct Node* nodeToDelete = list->head;    // Store reference
    list->head = list->head->next;             // Move head pointer
    free(nodeToDelete);                        // Free memory
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct SinglyLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == NULL) {            // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
        printf("Deleted from end\\n");
        return;
    }
    
    struct Node* current = list->head;         // Start from head
    while (current->next->next != NULL) {     // Find second last
        current = current->next;
    }
    
    free(current->next);                       // Free last node
    current->next = NULL;                      // Update link
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct SinglyLinkedList* list, int position) {
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
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;               // Traverse to position
    }
    
    if (current == NULL || current->next == NULL) { // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct SinglyLinkedList* list) {
    struct Node* current = list->head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

int main() {
    struct SinglyLinkedList* list = createList();
    
    // Example operations based on current state
    ${generateOperationsFromNodes(nodes)}
    
    printf("Final list: ");
    display(list);
    
    return 0;
}`;
};

// Helper function to generate operations from node array
function generateOperationsFromNodes(nodes) {
  if (!nodes || nodes.length === 0) {
    return `// No operations yet - use the visualizer to add nodes
    printf("Empty list created\\n");`;
  }

  const operations = nodes.map((node, index) => {
    if (index === 0) {
      return `insertAtBeginning(list, ${node.data});`;
    } else {
      return `insertAtEnd(list, ${node.data});`;
    }
  });

  return operations.join('\n    ');
}
