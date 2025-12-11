use std::cmp::Ordering;
use std::collections::{HashSet, VecDeque};

// ---
// Main
// ---

fn main() {
    // Sync
    let examples: Vec<(&str, fn())> = vec![
        // Sort
        ("basic_bubble_sort", basic_bubble_sort),
        ("basic_quick_sort", basic_quick_sort),
        ("basic_merge_sort", basic_merge_sort),
        // Search
        ("basic_linear_search", basic_linear_search),
        ("basic_binary_search", basic_binary_search),
        // Search (graph)
        ("basic_dfs", basic_dfs),
        ("basic_bfs", basic_bfs),
    ];
    for (title, example_func) in examples {
        print_section_header(title.into());
        example_func();
    }
}

// ---
// Utils
// ---

/// Convert a string to uppercase and print it
fn print_section_header(header: String) {
    println!("\n{}\n", header.to_ascii_uppercase());
}

// ---
// Examples
// ---

fn bubble_sort<T: Ord>(values: &mut Vec<T>) {
    if values.len() < 2 {
        return;
    }
    let mut sorted = false;
    let mut n = values.len();
    while !sorted {
        sorted = true;
        for i in 0..n - 1 {
            if values[1] > values[i + 1] {
                values.swap(i, i + 1);
                sorted = false;
            }
        }
        n -= 1
    }
}

fn basic_bubble_sort() {
    let values = vec![1, 3, 2, 4, 5];
    let values_sorted = (|| {
        let mut v2 = values.clone();
        bubble_sort(&mut v2);
        v2
    })();

    let results = vec![
        format!("values: {:?}", values),
        format!("values.is_sorted(): {:?}", values.is_sorted()),
        format!("values_sorted: {:?}", values_sorted),
        format!("values_sorted.is_sorted(): {:?}", values_sorted.is_sorted()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn quick_sort<T: Ord>(values: &mut Vec<T>) {
    let len = values.len();
    if len < 2 {
        return;
    }
    quick_sort_rec(values, 0, len - 1);
}

fn quick_sort_rec<T: Ord>(values: &mut Vec<T>, mut lo: usize, mut hi: usize) {
    while lo < hi {
        let pivot = partition(values, lo, hi);

        if pivot - lo < hi - pivot {
            if pivot > 0 {
                quick_sort_rec(values, lo, pivot - 1);
            }
            lo = pivot + 1;
        } else {
            quick_sort_rec(values, pivot + 1, hi);
            hi = pivot - 1;
        }
    }
}

pub fn partition<T: PartialOrd>(values: &mut Vec<T>, lo: usize, hi: usize) -> usize {
    let pivot = hi;
    let mut i = lo;
    let mut j = hi - 1;

    loop {
        while values[i] < values[pivot] {
            i += 1;
        }
        while j > 0 && values[j] > values[pivot] {
            j -= 1;
        }

        if j == 0 || i >= j {
            break;
        }

        if values[i] == values[j] {
            i += 1;
            j -= 1;
        } else {
            values.swap(i, j);
        }
    }
    values.swap(i, pivot);
    i
}

fn basic_quick_sort() {
    let values = vec![1, 3, 2, 4, 5];
    let values_sorted = (|| {
        let mut v2 = values.clone();
        quick_sort(&mut v2);
        v2
    })();

    let results = vec![
        format!("values: {:?}", values),
        format!("values.is_sorted(): {:?}", values.is_sorted()),
        format!("values_sorted: {:?}", values_sorted),
        format!("values_sorted.is_sorted(): {:?}", values_sorted.is_sorted()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

fn merge<T: Ord + Copy>(values: &mut [T], mid: usize) {
    // Create temporary vectors to support the merge.
    let left_half = values[..mid].to_vec();
    let right_half = values[mid..].to_vec();

    // Indexes to track the positions while merging.
    let mut l = 0;
    let mut r = 0;

    for v in values {
        // Choose either the smaller element, or from whichever vec is not exhausted.
        if r == right_half.len() || (l < left_half.len() && left_half[l] < right_half[r]) {
            *v = left_half[l];
            l += 1;
        } else {
            *v = right_half[r];
            r += 1;
        }
    }
}

pub fn top_down_merge_sort<T: Ord + Copy>(values: &mut [T]) {
    if values.len() > 1 {
        let mid = values.len() / 2;
        // Sort the left half recursively.
        top_down_merge_sort(&mut values[..mid]);
        // Sort the right half recursively.
        top_down_merge_sort(&mut values[mid..]);
        // Combine the two halves.
        merge(values, mid);
    }
}

pub fn bottom_up_merge_sort<T: Copy + Ord>(values: &mut [T]) {
    if values.len() > 1 {
        let len: usize = values.len();
        let mut sub_array_size: usize = 1;
        while sub_array_size < len {
            let mut start_index: usize = 0;
            // still have more than one sub-arrays to merge
            while len - start_index > sub_array_size {
                let end_idx: usize = if start_index + 2 * sub_array_size > len {
                    len
                } else {
                    start_index + 2 * sub_array_size
                };
                // merge values[start_index..start_index+sub_array_size] and values[start_index+sub_array_size..end_idx]
                // NOTE: mid is a relative index number starting from `start_index`
                merge(&mut values[start_index..end_idx], sub_array_size);
                // update `start_index` to merge the next sub-arrays
                start_index = end_idx;
            }
            sub_array_size *= 2;
        }
    }
}

fn basic_merge_sort() {
    let values = vec![1, 3, 2, 4, 5];
    let values2 = (|| {
        let mut v = values.clone();
        top_down_merge_sort(&mut v);
        v
    })();
    let values3 = (|| {
        let mut v = values.clone();
        bottom_up_merge_sort(&mut v);
        v
    })();

    let results = vec![
        format!("values: {:?}", values),
        format!("values.is_sorted(): {:?}", values.is_sorted()),
        format!("values2: {:?}", values2),
        format!("values2.is_sorted(): {:?}", values2.is_sorted()),
        format!("values3: {:?}", values3),
        format!("values3.is_sorted(): {:?}", values3.is_sorted()),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

pub fn linear_search<T: Ord>(item: &T, arr: &Vec<T>) -> Option<usize> {
    for (i, data) in arr.iter().enumerate() {
        if item == data {
            return Some(i);
        }
    }
    None
}

fn basic_linear_search() {
    let values = vec![1, 2, 3, 4, 5];

    let results = vec![
        format!("values: {:?}", values),
        format!(
            "linear_search(&0, &values): {:?}",
            linear_search(&0, &values)
        ),
        format!(
            "linear_search(&1, &values): {:?}",
            linear_search(&1, &values)
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

pub fn binary_search<T: Ord>(item: &T, arr: &[T]) -> Option<usize> {
    binary_search_rec(item, arr, 0, arr.len())
}

pub fn binary_search_rec<T: Ord>(item: &T, arr: &[T], left: usize, right: usize) -> Option<usize> {
    if left >= right {
        return None;
    }

    let is_asc = arr.len() > 1 && arr[0] < arr[arr.len() - 1];
    let mid = left + (right - left) / 2;
    let cmp_result = item.cmp(&arr[mid]);

    match (is_asc, cmp_result) {
        (true, Ordering::Less) | (false, Ordering::Greater) => {
            binary_search_rec(item, arr, left, mid)
        }
        (true, Ordering::Greater) | (false, Ordering::Less) => {
            binary_search_rec(item, arr, mid + 1, right)
        }
        (_, Ordering::Equal) => Some(mid),
    }
}

fn basic_binary_search() {
    let values = vec![1, 2, 3, 4, 5];

    let results = vec![
        format!("values: {:?}", values),
        format!(
            "binary_search(&0, &values): {:?}",
            binary_search(&0, &values)
        ),
        format!(
            "binary_search(&1, &values): {:?}",
            binary_search(&1, &values)
        ),
    ];
    results.iter().for_each(|s| println!("{}", s));
}

#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
pub struct Vertex(u32);

impl From<u32> for Vertex {
    fn from(item: u32) -> Self {
        Vertex(item)
    }
}

impl Vertex {
    pub fn value(&self) -> u32 {
        self.0
    }

    pub fn neighbors(&self, graph: &Graph) -> VecDeque<Vertex> {
        graph
            .edges
            .iter()
            .filter(|&e| e.0 == self.0)
            .map(|e| e.1.into())
            .collect()
    }
}

#[derive(Copy, Clone, PartialEq, Eq, Hash)]
pub struct Edge(u32, u32);

impl From<(u32, u32)> for Edge {
    fn from(item: (u32, u32)) -> Self {
        Edge(item.0, item.1)
    }
}

#[derive(Clone)]
pub struct Graph {
    #[allow(dead_code)]
    vertices: Vec<Vertex>,
    edges: Vec<Edge>,
}

impl Graph {
    pub fn new(vertices: Vec<Vertex>, edges: Vec<Edge>) -> Self {
        Graph { vertices, edges }
    }
}

pub fn depth_first_search(graph: &Graph, root: Vertex, objective: Vertex) -> Option<Vec<u32>> {
    let mut visited: HashSet<Vertex> = HashSet::new();
    let mut history: Vec<u32> = Vec::new();
    let mut queue = VecDeque::new();
    queue.push_back(root);

    while let Some(current_vertex) = queue.pop_front() {
        history.push(current_vertex.value());
        // Return if found
        if current_vertex == objective {
            return Some(history);
        }
        // Check neighbors
        for neighbor in current_vertex.neighbors(graph).into_iter().rev() {
            if visited.insert(neighbor) {
                queue.push_front(neighbor);
            }
        }
    }
    // Didn't find objective
    None
}

fn basic_dfs() {
    let vertices = vec![1, 2, 3, 4, 5, 6, 7];
    let edges = vec![(1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (3, 7)];
    let graph = Graph::new(
        vertices.clone().into_iter().map(|v| v.into()).collect(),
        edges.clone().into_iter().map(|e| e.into()).collect(),
    );

    let root = Vertex::from(1);
    let objective = Vertex::from(7);
    let result_path = depth_first_search(&graph, root, objective).unwrap();

    let results = vec![
        format!("vertices: {:?}", vertices),
        format!("edges: {:?}", edges),
        format!("root: {:?}", root),
        format!("objective: {:?}", objective),
        format!("result_path: {:?}", result_path), // vec![1, 2, 4, 5, 3, 6, 7];
    ];
    results.iter().for_each(|s| println!("{}", s));
}

pub fn breadth_first_search(graph: &Graph, root: Vertex, objective: Vertex) -> Option<Vec<u32>> {
    let mut visited: HashSet<Vertex> = HashSet::new();
    let mut history: Vec<u32> = Vec::new();
    let mut queue: VecDeque<Vertex> = VecDeque::new();

    visited.insert(root);
    queue.push_back(root);
    while let Some(current_vertex) = queue.pop_front() {
        history.push(current_vertex.value());
        // Return if found
        if current_vertex == objective {
            return Some(history);
        }
        // Check neighbors
        for neighbor in current_vertex.neighbors(graph) {
            if visited.insert(neighbor) {
                queue.push_back(neighbor);
            }
        }
    }
    // Didn't find objective
    None
}

fn basic_bfs() {
    let vertices = vec![1, 2, 3, 4, 5, 6, 7];
    let edges = vec![(1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (3, 7), (5, 8)];
    let graph = Graph::new(
        vertices.clone().into_iter().map(|v| v.into()).collect(),
        edges.clone().into_iter().map(|e| e.into()).collect(),
    );

    let root = Vertex::from(1);
    let objective = Vertex::from(8);
    let result_path = breadth_first_search(&graph, root, objective).unwrap();

    let results = vec![
        format!("vertices: {:?}", vertices),
        format!("edges: {:?}", edges),
        format!("root: {:?}", root),
        format!("objective: {:?}", objective),
        format!("result_path: {:?}", result_path), // vec![1, 2, 3, 4, 5, 6, 7, 8];
    ];
    results.iter().for_each(|s| println!("{}", s));
}
