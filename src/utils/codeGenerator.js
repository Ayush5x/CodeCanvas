export const generateCppCode = (nodes) => {
  // Base code structure with methods implemented
  const baseCode = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
//Auth:oGhostyyy
//Go to Line 122 to watch the code update, note indexing is 0 based 

typedef struct Node {
    char data[100];        // Data stored in the node
    struct Node* prev;     // Pointer to the previous node
    struct Node* next;     // Pointer to the next node
} Node;

typedef struct {
    Node* head;            // Pointer to the head of the list
    Node* tail;            // Pointer to the tail of the list
    int size;              // Size of the list
} DoublyLinkedList;

// Function to create a new node
Node* createNode(const char* value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (newNode) {
        strcpy(newNode->data, value);
        newNode->prev = NULL;
        newNode->next = NULL;
    }
    return newNode;
}

// Function to initialize an empty list
DoublyLinkedList* createList() {
    DoublyLinkedList* list = (DoublyLinkedList*)malloc(sizeof(DoublyLinkedList));
    if (list) {
        list->head = NULL;
        list->tail = NULL;
        list->size = 0;
    }
    return list;
}

// Function to insert at the beginning
void insertAtBeginning(DoublyLinkedList* list, const char* value) {
    Node* newNode = createNode(value);
    if (!newNode) return;
    
    if (list->head == NULL) {
        list->head = list->tail = newNode;  // If list is empty, set head and tail to new node
    } else {
        newNode->next = list->head;         // Link new node to the current head
        list->head->prev = newNode;         // Link current head's previous to new node
        list->head = newNode;               // Update head to new node
    }
    list->size++;                           // Increase the size of the list
}

// Function to insert at the end
void insertAtEnd(DoublyLinkedList* list, const char* value) {
    Node* newNode = createNode(value);
    if (!newNode) return;
    
    if (list->tail == NULL) {
        list->head = list->tail = newNode;  // If list is empty, set head and tail to new node
    } else {
        list->tail->next = newNode;         // Link current tail to new node
        newNode->prev = list->tail;         // Link new node's previous to current tail
        list->tail = newNode;               // Update tail to new node
    }
    list->size++;                           // Increase the size of the list
}

// Function to insert at a specific position
void insertAtPosition(DoublyLinkedList* list, const char* value, int position) {
    if (position < 0 || position > list->size) {    // Check for valid position
        printf("Invalid position\\n");
        return;                                      // Return if invalid
    }

    if (position == 0) {
        insertAtBeginning(list, value);              // Insert at the beginning
        return;
    }

    if (position == list->size) {
        insertAtEnd(list, value);                    // Insert at the end
        return;
    }

    Node* newNode = createNode(value);               // Create a new node
    if (!newNode) return;
    
    Node* current = list->head;                      // Start from the head

    for (int i = 0; i < position - 1; ++i) {
        current = current->next;                     // Traverse to the position
    }

    newNode->next = current->next;                   // Link new node to the next node
    newNode->prev = current;                         // Link new node's previous to current
    current->next->prev = newNode;                   // Link next node's previous to new node
    current->next = newNode;                         // Link current node to new node

    list->size++;                                    // Increase the size of the list
}

// Function to delete a node with specific value
void deleteNode(DoublyLinkedList* list, const char* value) {
    if (list->head == NULL) return;                  // List is empty

    Node* current = list->head;
    while (current != NULL && strcmp(current->data, value) != 0) { // Traverse the list
        current = current->next;
    }

    if (current == NULL) return;                     // Node not found

    if (current == list->head) {
        list->head = list->head->next;               // Move head to the next node
        if (list->head != NULL) list->head->prev = NULL; // Update head's previous
    } else if (current == list->tail) {
        list->tail = list->tail->prev;               // Move tail to the previous node
        if (list->tail != NULL) list->tail->next = NULL; // Update tail's next
    } else {
        current->prev->next = current->next;         // Link previous node to next node
        current->next->prev = current->prev;         // Link next node to previous node
    }

    free(current);                                   // Free the memory
    list->size--;                                    // Decrease the size of the list
} 

// Function to display the list
void display(DoublyLinkedList* list) {
    if (list->head == NULL) {
        printf("List is empty\\n");
        return;                                      // Check if the list is empty
    }

    Node* current = list->head;
    while (current != NULL) {                        // Traverse the list
        printf("%s", current->data);                 // Print the data
        if (current->next != NULL) {
            printf(" <-> ");                         // Print the separator
        }
        current = current->next;                     // Move to the next node
    }
    printf("\\n");                                  // Print a new line
}

// Function to free the entire list
void freeList(DoublyLinkedList* list) {
    Node* current = list->head;
    while (current != NULL) {
        Node* next = current->next;
        free(current);
        current = next;
    }
    free(list);
}

int main() { //The Code executes over here
    DoublyLinkedList* list = createList();

    // Operations will be added here based on visualization state

    printf("Current list: ");
    display(list);

    freeList(list);
    return 0;
}`;

  // Generate operations based on current nodes, this lets us update code dynamically
  let operations = '';

  nodes.forEach((node, index) => {
    if (index === 0) {
      operations += `\\n    insertAtBeginning(list, "${node.data}");`;
    } else if (index === nodes.length - 1 && node.action === 'insertAtPosition') {
      // Ensure insertAtPosition is used if explicitly chosen for the last index
      operations += `\\n    insertAtPosition(list, "${node.data}", ${index});`;
    } else if (index === nodes.length - 1) {
      operations += `\\n    insertAtEnd(list, "${node.data}");`;
    } else {
      operations += `\\n    insertAtPosition(list, "${node.data}", ${index});`;
    }
  });

  // Insert operations into the code
  return baseCode.replace('// Operations will be added here based on visualization state', operations);
};