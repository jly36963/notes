# Data structures and algorithms

- common structures
  - arrays
  - stacks
  - queues
  - linked lists
  - trees
  - tries
  - graphs
  - hash tables

- algorithms
  - sorting
  - dynamic programming
  - BFS + DFS (searching)
  - recursion

## Important developer skills

- good code
  - readable
  - scalable -- speed (time complexity) -- memory (space complexity)

- good code checklist
  - it works
  - proper use of data structures
  - code re-use (good organization)
  - modular
  - less than O(n^2) wherever possible.
  - low space complexity

- solving problems
  - analytical skills
  - coding skills
  - technical skills
  - communication skills

## Time complexity / asymptotic analysis / space complexity

- asymptotic analysis -- mathematical framing of an algorithm's runtime
  performance
- big O notation -- limiting behavior of a function when the argument approaches
  infinity

- 4 rules
  - worst case -- plan for the worst. no blue sky thinking
  - remove constants -- as function approaches infinity, constants are
    negligible.
  - different terms for different inputs -- O(a + b), O(a * b), etc
  - drop non-dominants -- only use largest time compexity. O(n^2 + n) --> O(n^2)

- time
  - operations
  - comparisons
  - loops
  - outside function calls

- space
  - variables
  - data structures
  - function calls
  - allocations

- cheatsheet
  - https://www.bigocheatsheet.com/

- wiki
  - https://en.wikipedia.org/wiki/Time_complexity

- reducing complexity
  - hash maps have higher space complexity than arrays, but much better time
    complexity.
  - for sorted arrays, use binary search tree to reduce time complexity.
