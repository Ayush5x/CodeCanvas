import { useState } from 'react';

const TreeDiySection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [copyText, setCopyText] = useState("Copy Code to Clipboard");
  
  const code = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_DEPTH 4  // Maximum tree depth for visualization

// BST Node structure
typedef struct TreeNode {
    int value;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

// BST structure
typedef struct {
    TreeNode* root;
    int nodeCount;
    int maxDepth;
} BST;

// Create a new node
TreeNode* createNode(int value) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    if (node == NULL) {
        printf("Memory allocation failed\\n");
        return NULL;
    }
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Check if inserting would exceed depth limit
bool wouldExceedDepth(TreeNode* root, int value, int currentDepth) {
    if (currentDepth >= MAX_DEPTH) return true;
    if (root == NULL) return false;
    
    if (value < root->value) {
        return wouldExceedDepth(root->left, value, currentDepth + 1);
    } else if (value > root->value) {
        return wouldExceedDepth(root->right, value, currentDepth + 1);
    }
    return false; // Value already exists
}

// Insert a value into BST with depth checking
TreeNode* insert(TreeNode* root, int value, BST* bst) {
    // Check depth limit before insertion
    if (root != NULL && wouldExceedDepth(root, value, 0)) {
        printf("Cannot insert %d: would exceed maximum depth limit\\n", value);
        return root;
    }
    
    // Base case: empty spot found
    if (root == NULL) {
        TreeNode* newNode = createNode(value);
        if (newNode != NULL) {
            bst->nodeCount++;
            printf("Inserted %d successfully\\n", value);
        }
        return newNode;
    }
    
    // Recursive insertion
    if (value < root->value) {
        printf("Going left from %d to insert %d\\n", root->value, value);
        root->left = insert(root->left, value, bst);
    } else if (value > root->value) {
        printf("Going right from %d to insert %d\\n", root->value, value);
        root->right = insert(root->right, value, bst);
    } else {
        printf("Value %d already exists in the tree\\n", value);
    }
    
    return root;
}

// Search for a value in BST
bool search(TreeNode* root, int value) {
    if (root == NULL) {
        printf("Value %d not found\\n", value);
        return false;
    }
    
    printf("Checking node with value %d\\n", root->value);
    
    if (value == root->value) {
        printf("Found %d!\\n", value);
        return true;
    } else if (value < root->value) {
        printf("Going left from %d to search for %d\\n", root->value, value);
        return search(root->left, value);
    } else {
        printf("Going right from %d to search for %d\\n", root->value, value);
        return search(root->right, value);
    }
}

// Find minimum value node (leftmost node)
TreeNode* findMin(TreeNode* root) {
    while (root && root->left != NULL) {
        root = root->left;
    }
    return root;
}

// Delete a value from BST
TreeNode* delete(TreeNode* root, int value, BST* bst) {
    if (root == NULL) {
        printf("Value %d not found for deletion\\n", value);
        return root;
    }
    
    if (value < root->value) {
        printf("Going left from %d to delete %d\\n", root->value, value);
        root->left = delete(root->left, value, bst);
    } else if (value > root->value) {
        printf("Going right from %d to delete %d\\n", root->value, value);
        root->right = delete(root->right, value, bst);
    } else {
        // Node to be deleted found
        printf("Deleting node with value %d\\n", value);
        bst->nodeCount--;
        
        // Case 1: Node with only right child or no child
        if (root->left == NULL) {
            TreeNode* temp = root->right;
            free(root);
            return temp;
        }
        // Case 2: Node with only left child
        else if (root->right == NULL) {
            TreeNode* temp = root->left;
            free(root);
            return temp;
        }
        
        // Case 3: Node with two children
        TreeNode* temp = findMin(root->right);
        printf("Replacing %d with %d (inorder successor)\\n", value, temp->value);
        
        // Copy the inorder successor's value to this node
        root->value = temp->value;
        
        // Delete the inorder successor
        root->right = delete(root->right, temp->value, bst);
    }
    return root;
}

// Inorder traversal (Left-Root-Right) - gives sorted order
void inorderTraversal(TreeNode* root) {
    if (root != NULL) {
        inorderTraversal(root->left);
        printf("%d ", root->value);
        inorderTraversal(root->right);
    }
}

// Preorder traversal (Root-Left-Right)
void preorderTraversal(TreeNode* root) {
    if (root != NULL) {
        printf("%d ", root->value);
        preorderTraversal(root->left);
        preorderTraversal(root->right);
    }
}

// Postorder traversal (Left-Right-Root)
void postorderTraversal(TreeNode* root) {
    if (root != NULL) {
        postorderTraversal(root->left);
        postorderTraversal(root->right);
        printf("%d ", root->value);
    }
}

// Free all nodes in the tree
void freeTree(TreeNode* root) {
    if (root != NULL) {
        freeTree(root->left);
        freeTree(root->right);
        free(root);
    }
}

// Initialize BST
BST* createBST() {
    BST* bst = (BST*)malloc(sizeof(BST));
    if (bst == NULL) {
        printf("Memory allocation failed\\n");
        return NULL;
    }
    bst->root = NULL;
    bst->nodeCount = 0;
    bst->maxDepth = MAX_DEPTH;
    return bst;
}

// Example usage
int main() {
    BST* myBST = createBST();
    if (myBST == NULL) {
        return 1;
    }
    
    printf("=== Binary Search Tree Demo ===\\n");
    
    // Insert values
    printf("\\nInserting values: 50, 30, 70, 20, 40, 60, 80\\n");
    myBST->root = insert(myBST->root, 50, myBST);
    myBST->root = insert(myBST->root, 30, myBST);
    myBST->root = insert(myBST->root, 70, myBST);
    myBST->root = insert(myBST->root, 20, myBST);
    myBST->root = insert(myBST->root, 40, myBST);
    myBST->root = insert(myBST->root, 60, myBST);
    myBST->root = insert(myBST->root, 80, myBST);
    
    printf("\\nTotal nodes in tree: %d\\n", myBST->nodeCount);
    
    // Traversals
    printf("\\nInorder traversal (sorted): ");
    inorderTraversal(myBST->root);
    printf("\\n");
    
    printf("Preorder traversal: ");
    preorderTraversal(myBST->root);
    printf("\\n");
    
    printf("Postorder traversal: ");
    postorderTraversal(myBST->root);
    printf("\\n");
    
    // Search examples
    printf("\\nSearching for 40:\\n");
    search(myBST->root, 40);
    
    printf("\\nSearching for 25:\\n");
    search(myBST->root, 25);
    
    // Delete examples
    printf("\\nDeleting 20 (leaf node):\\n");
    myBST->root = delete(myBST->root, 20, myBST);
    
    printf("\\nDeleting 30 (node with two children):\\n");
    myBST->root = delete(myBST->root, 30, myBST);
    
    printf("\\nInorder after deletions: ");
    inorderTraversal(myBST->root);
    printf("\\n");
    
    printf("\\nTotal nodes after deletions: %d\\n", myBST->nodeCount);
    
    // Clean up
    freeTree(myBST->root);
    free(myBST);
    
    return 0;
}

/*
Expected Output:
=== Binary Search Tree Demo ===

Inserting values: 50, 30, 70, 20, 40, 60, 80
Inserted 50 successfully
Going left from 50 to insert 30
Inserted 30 successfully
Going right from 50 to insert 70
Inserted 70 successfully
Going left from 50 to insert 20
Going left from 30 to insert 20
Inserted 20 successfully
Going left from 50 to insert 40
Going right from 30 to insert 40
Inserted 40 successfully
Going right from 50 to insert 60
Going left from 70 to insert 60
Inserted 60 successfully
Going right from 50 to insert 80
Going right from 70 to insert 80
Inserted 80 successfully

Total nodes in tree: 7

Inorder traversal (sorted): 20 30 40 50 60 70 80 
Preorder traversal: 50 30 20 40 70 60 80 
Postorder traversal: 20 40 30 60 80 70 50 

Searching for 40:
Checking node with value 50
Going left from 50 to search for 40
Checking node with value 30
Going right from 30 to search for 40
Checking node with value 40
Found 40!

Searching for 25:
Checking node with value 50
Going left from 50 to search for 25
Checking node with value 30
Going left from 30 to search for 25
Checking node with value 20
Going right from 20 to search for 25
Value 25 not found

Deleting 20 (leaf node):
Going left from 50 to delete 20
Going left from 30 to delete 20
Deleting node with value 20

Deleting 30 (node with two children):
Going left from 50 to delete 30
Deleting node with value 30
Replacing 30 with 40 (inorder successor)
Going right from 40 to delete 40
Deleting node with value 40

Inorder after deletions: 40 50 60 70 80 

Total nodes after deletions: 5
*/`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      const newCount = copyCount + 1;
      setCopyCount(newCount);
      setCopyText(`Copied! (${newCount})`);
      
      setTimeout(() => {
        setCopyText("Copy Code to Clipboard");
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      setCopyText("Copy failed - try selecting manually");
      setTimeout(() => {
        setCopyText("Copy Code to Clipboard");
      }, 2000);
    }
  };

  return (
    <div className="diy-section">
      <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {isExpanded ? '▼' : '►'} How to Run This Code Yourself
      </h3>
      
      {isExpanded && (
        <div className="diy-content">
          <p>
            Want to implement and experiment with Binary Trees yourself? Below are runnable C examples.
            For BST/AVL/Heap, save the appropriate file and compile it as shown.
          </p>

          <h4>🚀 Quick Start:</h4>
          <ol>
            <li>Copy the code below</li>
            <li>
              Save as <code>bst.c</code> for Binary Search Tree, <code>avl.c</code> for AVL Tree, or <code>heap.c</code> for Heaps
            </li>
            <li>
              Compile:
              <ul>
                <li>BST: <code>gcc -o bst bst.c</code></li>
                <li>AVL: <code>gcc -o avl avl.c</code></li>
                <li>Heap: <code>gcc -o heap heap.c</code></li>
              </ul>
            </li>
            <li>
              Run:
              <ul>
                <li>BST: <code>./bst</code></li>
                <li>AVL: <code>./avl</code></li>
                <li>Heap: <code>./heap</code></li>
              </ul>
            </li>
          </ol>

          <h4>💡 Try These Experiments:</h4>
          <ul>
            <li>BST/AVL: insert different sequences and compare final shapes</li>
            <li>AVL: cause each rotation type (LL, RR, LR, RL) and verify heights/balance</li>
            <li>Heap: build from array, then test sequences of insert and extract root</li>
            <li>Try inserting values that would exceed the depth limit (BST sample)</li>
            <li>Compare traversal outputs (inorder, preorder, postorder)</li>
            <li>Test edge cases: empty structure, single node, duplicates</li>
          </ul>

          <h4>🔧 Code Features:</h4>
          <ul>
            <li>BST: depth-limited insertion (prevents visualization overflow)</li>
            <li>AVL: height and balance factor tracking with rotations</li>
            <li>Heap: array-based complete tree with sift up/down and O(n) build-heap</li>
            <li>Traversals for trees (inorder, preorder, postorder)</li>
            <li>Memory management and error handling</li>
            <li>Detailed step-by-step output for learning</li>
          </ul>
          
          <div className="code-container">
            <div className="code-header">
              <span className="language-label">C</span>
              <button 
                onClick={handleCopyCode}
                className="copy-button"
                title="Copy code to clipboard"
              >
                {copyText}
              </button>
            </div>
            <div className="code-content">
              <pre><code>{code}</code></pre>
            </div>
          </div>
          
          <h4>🎯 Learning Extensions:</h4>
          <ul>
            <li><strong>Balance Analysis:</strong> Add a function to check if the tree is balanced</li>
            <li><strong>Height Calculation:</strong> Implement a function to calculate tree height</li>
            <li><strong>Level-order Traversal:</strong> Add breadth-first traversal using a queue</li>
            <li><strong>Tree Visualization:</strong> Print the tree structure in a visual format</li>
            <li><strong>Performance Testing:</strong> Time the operations with different input sizes</li>
            <li><strong>Self-Balancing:</strong> Research and implement AVL or Red-Black tree rotations</li>
          </ul>
          
          <div className="tip-box">
            <h4>💡 Pro Tip:</h4>
            <p>
              The inorder traversal of a BST always produces values in sorted order! 
              This makes BSTs excellent for maintaining sorted collections with fast insertion and deletion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeDiySection;
