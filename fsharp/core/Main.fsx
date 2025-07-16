#r @"nuget: Newtonsoft.Json"
#r @"nuget: FSharpPlus"
#r @"nuget: System.Text.Json"
#r @"nuget: Flurl.Http, 3.3.1"

open FSharpPlus
open System.Threading.Tasks
open Flurl.Http
open System.IO
open Newtonsoft.Json

// #r @"nuget: FSharp.SystemTextJson"
// open System.Net.Http
// open System.Text.Json
// open System.Text
// open FSharp.SystemTextJson

// ---
// Types
// ---

type Ninja =
    {
        FirstName: string
        LastName: string
        Age: uint
    }

let greet (n: Ninja) =
    System.Console.WriteLine $"Hey! I'm {n.FirstName} {n.LastName} ({n.Age})"

type User =
    {
        id: int
        name: string
        username: string
        email: string
    }

// ---
// Utils
// ---

/// Convert a title to upper-case, wrap with new lines, then print
let printSectionTitle (title: string) : unit =
    System.Console.WriteLine $"\n{title.ToUpper()}\n"

/// Get the type name of a value
let getTypeName v : obj =
    if v = null then "<null>" else v.GetType().Name

/// Text format a (potentially-boxed) value
let pretty value =
    match tryUnbox value with
    | Some unboxed -> sprintf "%A" unboxed
    | None -> sprintf "%A" value

let printResults (results: (string * obj) list) : unit =
    for k, v in results do
        let typeName = getTypeName v
        let value = pretty v
        System.Console.WriteLine $"{k}\n{typeName}\n{value}\n"

/// Catch exceptions and return Result instead
let tryCatch (f: unit -> 'T) : Result<'T, exn> =
    try
        Ok(f ())
    with ex ->
        Error ex

// ---
// Examples
// ---

let basicBooleans () =
    let t = true
    let f = false

    let results: (string * obj) list =
        [
            "t", t
            "f", f
            "t && t", t && t
            "t && f", t && f
            "t && f", t && f
            "not t", not t
            "not f", not f
        ]

    printResults results

let basicInts () =
    let i1 = 2
    let i2 = 7

    let results: (string * obj) list =
        [
            "i1", i1
            "i2", i2
            "i1 + i2", box (i1 + i2)
            "i1 - i2", box (i1 - i2)
            "i1 * i2", box (i1 * i2)
            "i1 / i2", box (i1 / i2)
            "i1 < i2", box (i1 < i2)
            "i1 > i2", box (i1 > i2)
        ]


    printResults results


let basicFloats () =
    let f1 = 3.14
    let f2 = -f1

    let results: (string * obj) list =
        [
            "f1", f1
            "f2", f2
            "f1 + f2", box (f1 + f2)
            "f1 - f2", box (f1 - f2)
            "f1 * f2", box (f1 * f2)
            "f1 / f2", box (f1 / f2)
            "f1 ** f2", box (f1 ** f2)
            "f1 < f2", box (f1 < f2)
            "f1 > f2", box (f1 > f2)
            "sqrt f2", box (sqrt f2)
            "round f2", box (round f2)
            "ceil f2", box (ceil f2)
            "floor f2", box (floor f2)
            "abs f2", box (abs f2)
            "sign f2", box (sign f2)
            "int f2", box (int f2)
            "max f1 f2", box (max f1 f2)
            "min f1 f2", box (min f1 f2)
        ]


    printResults results


let basicStrings () =
    let utf8 = System.Text.Encoding.UTF8

    let results: (string * obj) list =
        [
            """String.concat ", " ["a"; "b"; "c"]""", String.concat ", " [ "a"; "b"; "c" ]

            """String.endsWith "fired" "Help me boy or you're fired" """,
            String.endsWith "fired" "Help me boy or you're fired"

            """String.getBytes utf8 "Me hoy minoy ✏️" """, String.getBytes utf8 "Me hoy minoy ✏️"

            """String.isSubString "id" "Not even Squidward's house" """,
            String.isSubString "id" "Not even Squidward's house"

            """String.replace  "ready" "not ready" "I'm ready!" """,
            String.replace "ready" "not ready" "I'm ready!"

            """String.split [","] "a,b,c" """, String.split [ "," ] "a,b,c"

            """String.startsWith "I" "It's okay, take your time" """,
            String.startsWith "I" "It's okay, take your time"

            """String.toLower "I CAN'T SEE MY FOREHEAD" """,
            String.toLower "I CAN'T SEE MY FOREHEAD"

            """String.toUpper "moar!" """, String.toUpper "moar!"

            """String.trim [' '] "   Too bad that didn't kill me   " """,
            String.trim [ ' ' ] "   Too bad that didn't kill me   "

            """String.toCodePoints "Você tá bem?" """, String.toCodePoints "Você tá bem?"
        ]


    printResults results


let basicLists () =
    let l0 = [ 2; 3; 4 ]
    let l1 = List.append (1 :: l0) [ 5 ]
    let l2 = [ "a"; "b"; "c"; "d"; "e" ]
    let l3 = [ for i in 0..4 -> i ]

    let is_even (x) = x % 2 = 0
    let is_even_opt (x) = if x % 2 = 0 then Some x else None

    // TODO groupBy, iter/iteri

    let results: (string * obj) list =
        [
            "l1", l1

            "l2", l2

            "l3", l3

            "List.allPairs l1 l2", List.allPairs l1 l2

            "List.append l1 [ 6 ]", List.append l1 [ 6 ]

            "l1 |> List.map float |> List.average |> box",
            l1 |> List.map float |> List.average |> box

            "List.choose is_even_opt l1", List.choose is_even_opt l1

            "List.chunkBySize 2 l1", List.chunkBySize 2 l1

            "List.distinct [ 1; 1; 1; 2; 3 ]", List.distinct [ 1; 1; 1; 2; 3 ]

            "List.exists is_even l1", List.exists is_even l1

            "List.filter is_even l1", List.filter is_even l1

            // Throws, use `tryFind`
            "l1 |> List.find is_even |> box", l1 |> List.find is_even |> box

            "List.fold (fun acc curr -> acc + curr) 0 l1 |> box",
            List.fold (fun acc curr -> acc + curr) 0 l1 |> box

            "List.forall is_even l1", List.forall is_even l1

            // Throws, use `tryHead`
            "List.head l1 |> box", List.head l1 |> box

            "List.isEmpty l1", List.isEmpty l1

            // Throws, use `tryItem`
            "List.item 0 l1 |> box", List.item 0 l1 |> box

            // Throws, use `tryLast`
            "List.last l1 |> box", List.last l1 |> box

            "List.length l1 |> box", List.length l1 |> box

            "l1 |> List.map (fun x -> pown x 2) |> box", l1 |> List.map (fun x -> pown x 2) |> box

            "l1 |> List.mapi (fun i x -> pown x i) |> box",
            l1 |> List.mapi (fun i x -> pown x i) |> box

            "List.max l1 |> box", List.max l1 |> box

            "List.min l1 |> box", List.min l1 |> box

            "List.partition is_even l1", List.partition is_even l1

            "List.randomChoice l1 |> box", List.randomChoice l1 |> box

            "List.randomChoices 3 l1", List.randomChoices 3 l1

            "List.randomSample 3 l1", List.randomSample 3 l1

            "List.randomShuffle l1", List.randomShuffle l1

            "List.reduce (fun acc curr -> acc + curr) l1 |> box",
            List.reduce (fun acc curr -> acc + curr) l1 |> box

            "List.rev l1", List.rev l1

            "List.skip 2 l1", List.skip 2 l1

            "List.sort l1", List.sort l1

            "List.sum l1 |> box", List.sum l1 |> box

            "List.tail l1", List.tail l1

            "List.take 3 l1", List.take 3 l1

            "l1 |> List.tryFind is_even |> box", l1 |> List.tryFind is_even |> box

            "List.tryHead l1 |> box", List.tryHead l1 |> box

            "List.tryItem 0 l1 |> box", List.tryItem 0 l1 |> box

            "List.tryLast l1 |> box", List.tryLast l1 |> box

            "l1 |> List.tryItem is_even |> box", l1 |> List.tryItem 0 |> box

            // Alias for `List.filter`
            "List.where is_even l1", List.where is_even l1

            "List.zip l1 l2", List.zip l1 l2

            "List.windowed 3 l1", List.windowed 3 l1
        ]

    printResults results

let basicSequences () =
    let s0 = seq { 0..9 }
    let s1 = seq { for i in s0 -> i + 1 }
    let s2 = seq { for c in 'a' .. 'j' -> string c }

    let is_even (x) = x % 2 = 0
    let is_even_opt (x) = if x % 2 = 0 then Some x else None


    let results: (string * obj) list =
        [
            "s1", s1

            "s2", s2

            "Seq.allPairs s1 s2", Seq.allPairs s1 s2

            "Seq.append s1 [ 6 ]", Seq.append s1 [ 6 ]

            "s1 |> Seq.map float |> Seq.average |> box", s1 |> Seq.map float |> Seq.average |> box

            "Seq.choose is_even_opt s1", Seq.choose is_even_opt s1

            "Seq.chunkBySize 2 s1", Seq.chunkBySize 2 s1

            "Seq.distinct [ 1; 1; 1; 2; 3 ]", Seq.distinct [ 1; 1; 1; 2; 3 ]

            "Seq.exists is_even s1", Seq.exists is_even s1

            "Seq.filter is_even s1", Seq.filter is_even s1

            // Throws, use `tryFind`
            "s1 |> Seq.find is_even |> box", s1 |> Seq.find is_even |> box

            "Seq.fold (fun acc curr -> acc + curr) 0 s1 |> box",
            Seq.fold (fun acc curr -> acc + curr) 0 s1 |> box

            "Seq.forall is_even s1", Seq.forall is_even s1

            // Throws, use `tryHead`
            "Seq.head s1 |> box", Seq.head s1 |> box

            "Seq.isEmpty s1", Seq.isEmpty s1

            // Throws, use `tryItem`
            "Seq.item 0 s1 |> box", Seq.item 0 s1 |> box

            // Throws, use `tryLast`
            "Seq.last s1 |> box", Seq.last s1 |> box

            "Seq.length s1 |> box", Seq.length s1 |> box

            "s1 |> Seq.map (fun x -> pown x 2) |> box", s1 |> Seq.map (fun x -> pown x 2) |> box

            "s1 |> Seq.mapi (fun i x -> pown x i) |> box",
            s1 |> Seq.mapi (fun i x -> pown x i) |> box

            "Seq.max s1 |> box", Seq.max s1 |> box

            "Seq.min s1 |> box", Seq.min s1 |> box

            "Seq.randomChoice s1 |> box", Seq.randomChoice s1 |> box

            "Seq.randomChoices 3 s1", Seq.randomChoices 3 s1

            "Seq.randomSample 3 s1", Seq.randomSample 3 s1

            "Seq.randomShuffle s1", Seq.randomShuffle s1

            "Seq.reduce (fun acc curr -> acc + curr) s1 |> box",
            Seq.reduce (fun acc curr -> acc + curr) s1 |> box

            "Seq.rev s1", Seq.rev s1

            "Seq.skip 2 s1", Seq.skip 2 s1

            "Seq.sort s1", Seq.sort s1

            "Seq.sum s1 |> box", Seq.sum s1 |> box

            "Seq.tail s1", Seq.tail s1

            "Seq.take 3 s1", Seq.take 3 s1

            "s1 |> Seq.tryFind is_even |> box", s1 |> Seq.tryFind is_even |> box

            "Seq.tryHead s1 |> box", Seq.tryHead s1 |> box

            "Seq.tryLast s1 |> box", Seq.tryLast s1 |> box

            "s1 |> Seq.tryItem is_even |> box", s1 |> Seq.tryItem 0 |> box

            // Alias for `Seq.filter`
            "Seq.where is_even s1", Seq.where is_even s1

            "Seq.zip s1 s2", Seq.zip s1 s2

            "Seq.windowed 3 s1", Seq.windowed 3 s1
        ]

    printResults results


let basicMaps () =
    let m1 = Map.ofList [ "a", 1; "b", 2; "c", 3 ]

    let inc x = x + 1
    let maybeInc x = Option.map inc x

    // TODO fold, iter, map, partition

    let results: (string * obj) list =
        [
            "m1", m1

            """m1 |> Map.add "d" 4 |> box""", m1 |> Map.add "d" 4 |> box

            """m1 |> Map.change "c" maybeInc |> box""", m1 |> Map.change "c" maybeInc |> box

            """m1 |> Map.containsKey "d" |> box""", m1 |> Map.containsKey "d" |> box

            "m1 |> Map.count |> box", m1 |> Map.count |> box

            "m1 |> Map.exists (fun k v -> v >= 0) |> box",
            m1 |> Map.exists (fun k v -> v >= 0) |> box

            "m1 |> Map.filter (fun k v -> v >= 0) |> box",
            m1 |> Map.filter (fun k v -> v >= 0) |> box

            "m1 |> Map.forall (fun k v -> v >= 0) |> box",
            m1 |> Map.forall (fun k v -> v >= 0) |> box

            "m1 |> Map.isEmpty |> box", m1 |> Map.isEmpty |> box

            "m1 |> Map.keys |> box", m1 |> Map.keys |> box

            """m1 |> Map.remove "c" |> box""", m1 |> Map.remove "c" |> box

            "m1 |> Map.toList |> box", m1 |> Map.toList |> box

            """m1 |> Map.tryFind "c" |> box""", m1 |> Map.tryFind "c" |> box

            "m1 |> Map.values |> box", m1 |> Map.values |> box
        ]

    printResults results

let basicSets () =
    let s1 = Set.ofList [ 1; 2; 3; 3; 2 ]
    let s2 = Set.ofList [ 2; 3; 4; 5 ]

    // TODO exists filter fold forall iter map partition

    let results: (string * obj) list =
        [
            "s1", s1
            "s2", s2
            "s1 |> Set.add 4 |> box", s1 |> Set.add 4 |> box
            "s1 |> Set.remove 3 |> box", s1 |> Set.remove 3 |> box
            "s1 |> Set.contains 3 |> box", s1 |> Set.contains 3 |> box
            "s1 |> Set.isEmpty |> box", s1 |> Set.isEmpty |> box

            // Comparison
            "Set.union s1 s2", Set.union s1 s2
            "Set.intersect s1 s2", Set.intersect s1 s2
            "Set.difference s1 s2", Set.difference s1 s2
            "Set.isProperSubset s1 s2", Set.isProperSubset s1 s2
            "Set.isSubset s1 s2", Set.isSubset s1 s2
            "Set.isSuperset s1 s2", Set.isSuperset s1 s2
        ]

    printResults results


let basicRecords () =
    let n1 =
        {
            FirstName = "Kakashi"
            LastName = "Hatake"
            Age = uint 27
        }

    greet n1


let basicAnonymousRecords () =
    let n =
        {|
            FirstName = "Kakashi"
            LastName = "Hatake"
            Age = uint 27
        |}

    System.Console.WriteLine $"Hey! I'm {n.FirstName} {n.LastName} ({n.Age})"

type Color =
    | Red
    | Yellow
    | Blue

let basicPatternMatching () =
    let c1 = Blue

    match c1 with
    | Red -> printfn "Red"
    | Yellow -> printfn "Yellow"
    | Blue -> printfn "Blue"

let basicOptions () =
    let o1 = Some 2
    let o2: option<int> = None

    let inc (x: int) = x + 1

    let results: (string * obj) list =
        [
            "o1", o1

            "o2", o2

            "o2 |> Option.defaultValue 0 |> box", o2 |> Option.defaultValue 0 |> box

            "o2 |> Option.defaultWith (fun () -> 0) |> box",
            o2 |> Option.defaultWith (fun () -> 0) |> box

            "o2 |> Option.filter (fun v -> v > 5) |> box",
            o2 |> Option.filter (fun v -> v > 5) |> box

            "o1 |> Option.get |> box", o1 |> Option.get |> box

            "o2 |> Option.isNone |> box", o2 |> Option.isNone |> box

            "o1 |> Option.isSome |> box", o1 |> Option.isSome |> box

            "Option.map inc o1", Option.map inc o1

            "Option.orElse o1 o2", Option.orElse o1 o2
        ]


    printResults results

let basicResults () =
    let r1: Result<int, string> = Ok 1
    let r2: Result<int, string> = Error "Invalid value"

    let inc (x: int) = x + 1

    // Throws exception
    // 0 |> unsafe_inv |> string |> System.Console.WriteLine
    let unsafe_inv (x: int) = 1 / x

    let inv x =
        if x = 0 then
            Error "divide by zero"
        else
            x |> unsafe_inv |> Ok

    let results: (string * obj) list =
        [
            "r1", r1

            "r2", r2

            "Result.bind inv r1", Result.bind inv r1

            "tryCatch (fun () -> unsafe_inv 0)", tryCatch (fun () -> unsafe_inv 0)

            "r2 |> Result.defaultValue 0 |> box", r2 |> Result.defaultValue 0 |> box

            "r2 |> Result.defaultWith (fun () -> 0) |> box",
            r2 |> Result.defaultWith (fun _ -> 0) |> box

            "r2 |> Result.isError |> box", r2 |> Result.isError |> box

            "r1 |> Result.isOk |> box", r1 |> Result.isOk |> box

            "Result.map inc r1", Result.map inc r1

            """Result.mapError (fun _ -> "oops") r2""", Result.mapError (fun _ -> "oops") r2

        ]

    printResults results


let basicJson () =
    let n1 =
        {
            FirstName = "Kakashi"
            LastName = "Hatake"
            Age = uint 27
        }

    let data = JsonConvert.SerializeObject(n1)
    let n2 = JsonConvert.DeserializeObject<Ninja>(data)

    let results: (string * obj) list =
        [
            "n1", n1

            "data", data

            "n2", n2
        ]

    printResults results

let readFileTask filename =
    task {
        // use do! when awaiting a Task
        // use let! when awaiting a Task<'T>, and unwrap 'T from Task<'T>.
        do! Task.Delay 1000
        let! text = File.ReadAllTextAsync(filename)
        return text
    }


let basicTasks () =
    let filename = "./justfile"
    let contents = filename |> readFileTask |> _.Result
    System.Console.WriteLine contents

let readFileAsync filename =
    async {
        // use do! when awaiting an Async
        do! Async.Sleep 1000
        let! text = File.ReadAllTextAsync(filename) |> Async.AwaitTask
        return text
    }



let basicAsync () =
    let filename = "./justfile"
    let contents = filename |> readFileAsync |> Async.RunSynchronously
    System.Console.WriteLine contents


let getUser (userId: int) : Task<User> =
    $"https://jsonplaceholder.typicode.com/users/{userId}" |> _.GetJsonAsync<User>()

let createUser (user: User) : Task<User> =
    "https://jsonplaceholder.typicode.com/users"
    |> _.PostJsonAsync(user)
    |> _.ReceiveJson<User>()

let basicHttp () =
    let userId = 1
    let user = userId |> getUser |> _.Result
    let createdUser = user |> createUser |> _.Result

    let results: (string * obj) list =
        [
            "userId", userId

            "user", user

            "createdUser", createdUser
        ]

    printResults results



// ---
// Main
// ---

let main () =
    let examples: (string * (unit -> unit)) list =
        [
            "Booleans", basicBooleans
            "Ints", basicInts
            "Floats", basicFloats
            "Strings", basicStrings
            "Lists", basicLists
            "Sequences", basicSequences
            "Maps", basicMaps
            "Sets", basicSets
            "Records", basicRecords
            "AnonymousRecords", basicAnonymousRecords
            "PatternMatching", basicPatternMatching
            "Options", basicOptions
            "Results", basicResults
            "Tasks", basicTasks
            "Async", basicAsync
            "Json", basicJson
            "Http", basicHttp
        ]

    // examples
    // |> List.iter (fun (title, exampleFunc) ->
    //     printSectionTitle title
    //     exampleFunc ())

    for title, example_func in examples do
        printSectionTitle title
        example_func ()


main ()

// ---
// Extras
// ---
