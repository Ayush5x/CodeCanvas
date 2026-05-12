/**
 * Code Generator for Circular Linked List
 * Generates C code based on the current state of nodes
 */

export const generateCircularLinkedListCode = (nodes) => {
  if (!nodes || nodes.length === 0) {
    return `#include <stdio.h>
#include <stdlib.h>

// Node structure for circular linked list
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

// Circular Linked List structure
struct CircularLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct CircularLinkedList* createList() {
    struct CircularLinkedList* list = (struct CircularLinkedList*)malloc(sizeof(struct CircularLinkedList));
    list->head = NULL;
    return list;
}

// Insert element at beginning of list
void insertAtBeginning(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        newNode->next = newNode;               // Points to itself
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        newNode->next = list->head;            // New node points to head
        current->next = newNode;               // Last node points to new node
        list->head = newNode;                  // Update head pointer
    }
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        newNode->next = newNode;               // Points to itself
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        current->next = newNode;               // Last node points to new node
        newNode->next = list->head;            // New node points to head
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct CircularLinkedList* list, int value, int position) {
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Insert at beginning
        insertAtBeginning(list, value);
        return;
    }
    
    if (list->head == NULL) {                  // Empty list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position - 1; i++) {
        current = current->next;               // Traverse to position
        if (current == list->head) {           // Full circle
            printf("Position out of range\\n");
            free(newNode);
            return;
        }
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct CircularLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == list->head) {      // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
    } else {                                   // Multiple nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        struct Node* nodeToDelete = list->head; // Store reference
        current->next = list->head->next;      // Update last node's link
        list->head = list->head->next;         // Move head pointer
        free(nodeToDelete);                    // Free memory
    }
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct CircularLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == list->head) {      // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
    } else {                                   // Multiple nodes
        struct Node* current = list->head;     // Start from head
        while (current->next->next != list->head) { // Find second last
            current = current->next;
        }
        struct Node* nodeToDelete = current->next; // Store reference
        current->next = list->head;            // Update link to head
        free(nodeToDelete);                    // Free memory
    }
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct CircularLinkedList* list, int position) {
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
    for (int i = 0; i < position - 1; i++) {
        current = current->next;               // Traverse to position
        if (current->next == list->head) {     // Full circle
            printf("Position out of range\\n");
            return;
        }
    }
    
    if (current->next == list->head) {         // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct CircularLinkedList* list) {
    if (list->head == NULL) {
        printf("Empty list\\n");
        return;
    }
    
    struct Node* current = list->head;
    do {
        printf("%d -> ", current->data);
        current = current->next;
    } while (current != list->head);
    printf("(back to head)\\n");
}

int main() {
    struct CircularLinkedList* list = createList();
    
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

// Node structure for circular linked list
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

// Circular Linked List structure
struct CircularLinkedList {
    struct Node* head;             // Pointer to first node
};

// Initialize empty list
struct CircularLinkedList* createList() {
    struct CircularLinkedList* list = (struct CircularLinkedList*)malloc(sizeof(struct CircularLinkedList));
    list->head = NULL;
    return list;
}

//  Insert element at beginning of list
void insertAtBeginning(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        newNode->next = newNode;               // Points to itself
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        newNode->next = list->head;            // New node points to head
        current->next = newNode;               // Last node points to new node
        list->head = newNode;                  // Update head pointer
    }
    printf("Inserted %d\\n", value);
}

// Insert element at end of list
void insertAtEnd(struct CircularLinkedList* list, int value) {
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    if (list->head == NULL) {                  // Check if empty
        list->head = newNode;                  // Node becomes head
        newNode->next = newNode;               // Points to itself
    } else {                                   // List has nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        current->next = newNode;               // Last node points to new node
        newNode->next = list->head;            // New node points to head
    }
    printf("Inserted %d\\n", value);
}

// Insert element at specific position
void insertAtPosition(struct CircularLinkedList* list, int value, int position) {
    if (position < 0) {                        // Validate position
        printf("Position cannot be negative\\n");
        return;
    }
    
    if (position == 0) {                       // Insert at beginning
        insertAtBeginning(list, value);
        return;
    }
    
    if (list->head == NULL) {                  // Empty list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* newNode = createNode(value);  // Allocate memory
    newNode->data = value;                     // Set data
    
    struct Node* current = list->head;         // Start from head
    for (int i = 0; i < position - 1; i++) {
        current = current->next;               // Traverse to position
        if (current == list->head) {           // Full circle
            printf("Position out of range\\n");
            free(newNode);
            return;
        }
    }
    
    newNode->next = current->next;             // Link new node
    current->next = newNode;                   // Update previous link
    printf("Inserted %d at position %d\\n", value, position);
}

// Delete element from beginning
void deleteFromBeginning(struct CircularLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == list->head) {      // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
    } else {                                   // Multiple nodes
        struct Node* current = list->head;     // Start from head
        while (current->next != list->head) {  // Find last node
            current = current->next;
        }
        struct Node* nodeToDelete = list->head; // Store reference
        current->next = list->head->next;      // Update last node's link
        list->head = list->head->next;         // Move head pointer
        free(nodeToDelete);                    // Free memory
    }
    printf("Deleted from beginning\\n");
}

// Delete element from end
void deleteFromEnd(struct CircularLinkedList* list) {
    if (list->head == NULL) {                  // Check if empty
        printf("List is empty\\n");
        return;
    }
    
    if (list->head->next == list->head) {      // Only one node
        free(list->head);                      // Free memory
        list->head = NULL;                     // List becomes empty
    } else {                                   // Multiple nodes
        struct Node* current = list->head;     // Start from head
        while (current->next->next != list->head) { // Find second last
            current = current->next;
        }
        struct Node* nodeToDelete = current->next; // Store reference
        current->next = list->head;            // Update link to head
        free(nodeToDelete);                    // Free memory
    }
    printf("Deleted from end\\n");
}

// Delete element from specific position
void deleteFromPosition(struct CircularLinkedList* list, int position) {
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
    for (int i = 0; i < position - 1; i++) {
        current = current->next;               // Traverse to position
        if (current->next == list->head) {     // Full circle
            printf("Position out of range\\n");
            return;
        }
    }
    
    if (current->next == list->head) {         // Position beyond list
        printf("Position out of range\\n");
        return;
    }
    
    struct Node* nodeToDelete = current->next; // Store reference
    current->next = nodeToDelete->next;        // Update link
    free(nodeToDelete);                        // Free memory
    printf("Deleted from position %d\\n", position);
}

// Display the list
void display(struct CircularLinkedList* list) {
    if (list->head == NULL) {
        printf("Empty list\\n");
        return;
    }
    
    struct Node* current = list->head;
    do {
        printf("%d -> ", current->data);
        current = current->next;
    } while (current != list->head);
    printf("(back to head)\\n");
}

int main() {
    struct CircularLinkedList* list = createList();
    
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
