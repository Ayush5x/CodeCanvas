/**
 * C Algorithm Codes for Greedy Algorithm Visualizations
 * Contains the C implementations for Boyer-Moore, Stable Matching, and Job Scheduling
 */

export const BOYER_MOORE_CODE = `#include <stdio.h>
#include <stdlib.h>

// Find majority element using Boyer-Moore Majority Vote Algorithm
int boyerMooreMajorityVote(int arr[], int n) {
    int candidate = 0;
    int count = 0;
    
    // Phase 1: Find potential majority candidate
    for (int i = 0; i < n; i++) {
        if (count == 0) {
            candidate = arr[i];
            count = 1;
        } else if (arr[i] == candidate) {
            count++;
        } else {
            count--;
        }
    }
    
    // Phase 2: Verify if candidate is actually majority
    count = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] == candidate) {
            count++;
        }
    }
    
    // Return majority element if count > n/2, else -1
    return (count > n/2) ? candidate : -1;
}

int main() {
    int arr[] = {1, 3, 3, 2, 1, 1, 1};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    int majority = boyerMooreMajorityVote(arr, n);
    
    if (majority != -1) {
        printf("Majority element: %d\\n", majority);
    } else {
        printf("No majority element found\\n");
    }
    
    return 0;
}`;

export const STABLE_MATCHING_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define N 4  // Number of men and women

// Function to check if woman prefers new man over current partner
bool womanPrefers(int womanPref[][N], int woman, int man1, int man2) {
    for (int i = 0; i < N; i++) {
        if (womanPref[woman][i] == man1) {
            return true;
        }
        if (womanPref[woman][i] == man2) {
            return false;
        }
    }
    return false;
}

// Gale-Shapley Algorithm for Stable Matching
void stableMatching(int manPref[][N], int womanPref[][N]) {
    int womanPartner[N];  // Woman's current partner
    bool manFree[N];      // Is man free?
    int manNext[N];       // Next woman for each man to propose
    
    // Initialize all as free
    for (int i = 0; i < N; i++) {
        womanPartner[i] = -1;
        manFree[i] = true;
        manNext[i] = 0;
    }
    
    int freeCount = N;
    
    while (freeCount > 0) {
        int man;
        // Find a free man
        for (man = 0; man < N; man++) {
            if (manFree[man]) break;
        }
        
        // Get the woman he wants to propose to
        int woman = manPref[man][manNext[man]];
        manNext[man]++;
        
        // If woman is free, engage them
        if (womanPartner[woman] == -1) {
            womanPartner[woman] = man;
            manFree[man] = false;
            freeCount--;
        }
        // If woman prefers this man over current partner
        else if (womanPrefers(womanPref, woman, man, womanPartner[woman])) {
            manFree[womanPartner[woman]] = true;
            womanPartner[woman] = man;
            manFree[man] = false;
        }
    }
    
    // Print the stable matching
    printf("Stable Matching:\\n");
    for (int i = 0; i < N; i++) {
        printf("Woman %d is matched with Man %d\\n", i, womanPartner[i]);
    }
}

int main() {
    // Preference matrix for men (0-indexed)
    int manPref[N][N] = {
        {0, 1, 2, 3},  // Man 0's preferences
        {2, 1, 0, 3},  // Man 1's preferences  
        {1, 3, 0, 2},  // Man 2's preferences
        {1, 3, 0, 2}   // Man 3's preferences
    };
    
    // Preference matrix for women (0-indexed)
    int womanPref[N][N] = {
        {3, 2, 1, 0},  // Woman 0's preferences
        {0, 3, 2, 1},  // Woman 1's preferences
        {3, 2, 1, 0},  // Woman 2's preferences
        {2, 1, 0, 3}   // Woman 3's preferences
    };
    
    stableMatching(manPref, womanPref);
    return 0;
}`;

export const JOB_SCHEDULING_CODE = `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    char id;      // Job identifier
    int deadline; // Job deadline
    int profit;   // Job profit
} Job;

// Comparison function for sorting jobs by profit (descending)
int compareJobs(const void *a, const void *b) {
    Job *jobA = (Job *)a;
    Job *jobB = (Job *)b;
    return jobB->profit - jobA->profit;
}

// Job Scheduling Algorithm to maximize profit
void jobScheduling(Job jobs[], int n) {
    // Sort jobs by profit in descending order
    qsort(jobs, n, sizeof(Job), compareJobs);
    
    // Find maximum deadline to determine time slots
    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        if (jobs[i].deadline > maxDeadline) {
            maxDeadline = jobs[i].deadline;
        }
    }
    
    // Create result array and slot tracking
    char result[maxDeadline];
    bool slot[maxDeadline];
    
    // Initialize all slots as free
    for (int i = 0; i < maxDeadline; i++) {
        slot[i] = false;
        result[i] = '-';
    }
    
    int totalProfit = 0;
    
    // Iterate through all jobs
    for (int i = 0; i < n; i++) {
        // Find a free slot for this job (starting from last possible slot)
        for (int j = jobs[i].deadline - 1; j >= 0; j--) {
            if (!slot[j]) {
                result[j] = jobs[i].id;
                slot[j] = true;
                totalProfit += jobs[i].profit;
                break;
            }
        }
    }
    
    // Print the scheduled jobs
    printf("Scheduled Jobs: ");
    for (int i = 0; i < maxDeadline; i++) {
        if (result[i] != '-') {
            printf("%c ", result[i]);
        }
    }
    printf("\\nTotal Profit: %d\\n", totalProfit);
}

int main() {
    Job jobs[] = {
        {'a', 2, 100},
        {'b', 1, 19},
        {'c', 2, 27},
        {'d', 1, 25},
        {'e', 3, 15}
    };
    
    int n = sizeof(jobs) / sizeof(jobs[0]);
    
    printf("Job Scheduling Problem\\n");
    printf("Jobs: ");
    for (int i = 0; i < n; i++) {
        printf("%c(d:%d,p:%d) ", jobs[i].id, jobs[i].deadline, jobs[i].profit);
    }
    printf("\\n\\n");
    
    jobScheduling(jobs, n);
    return 0;
}`;

export const ALGORITHM_CONFIGS = {
  boyerMoore: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Boyer-Moore Majority Vote algorithm finds the majority element in linear time with constant space.'
  },
  stableMatching: {
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    description: 'Gale-Shapley algorithm finds a stable matching between two equal-sized sets of elements.'
  },
  jobScheduling: {
    timeComplexity: 'O(n² log n)',
    spaceComplexity: 'O(n)',
    description: 'Greedy job scheduling algorithm maximizes profit by selecting jobs with highest profit that can be completed within their deadlines.'
  }
};
