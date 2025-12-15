#r @"nuget: Deedle"

open Deedle

// #r @"nuget: FSharp.SystemTextJson"
// #r @"nuget: Newtonsoft.Json"
// #r @"nuget: FSharpPlus"
// #r @"nuget: System.Text.Json"
// #r @"nuget: Flurl.Http"
// open FSharpPlus
// open System.Threading.Tasks
// open Flurl.Http
// open System.IO
// open Newtonsoft.Json
// open System.Net.Http
// open System.Text.Json
// open System.Text
// open FSharp.SystemTextJson

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
        Result.Error ex

/// Read a CSV with header, inferring schema
let readCsv (filepath: string) =
    Frame.ReadCsv(location = filepath, ?hasHeaders = Some true, ?inferTypes = Some true)


/// Get a column
let getCol<'a> (column: _) (df: Frame<_, _>) : Series<_, 'a> = df |> _.GetColumn<'a>(column)
/// Get a column's values
let getColVals<'a> (column: _) (df: Frame<_, _>) : seq<'a> = df |> _.GetColumn<'a>(column).Values

// /// Get a column's values
// let getColVals<'a, 'b, 'c when 'b: equality and 'c: equality>
//     (column: 'c)
//     (df: Frame<'b, 'c>)
//     : seq<'a> =
//     df |> _.GetColumn<'a>(column).Values

// ---
// Examples
// ---

let basicDataframe () =
    let filepath = $"{__SOURCE_DIRECTORY__}/data/iris.csv"
    let df = readCsv filepath

    let results: (string * obj) list =
        [
            "filepath", filepath

            "df", df

            "df.RowCount", df.RowCount

            "df.ColumnCount", df.ColumnCount

            "df.ColumnKeys |> Seq.toList |> box", df.ColumnKeys |> Seq.toList |> box

            "df.Rows |> Series.take 5 |> box", df.Rows |> Series.take 5 |> box

            """df |> getColVals<string> "species" |> Seq.distinct |> Seq.toList |> box""",
            df |> getColVals<string> "species" |> Seq.distinct |> Seq.toList |> box

            """df |> getCol<double> "sepal_length" |> Stats.mean""",
            df |> getCol<double> "sepal_length" |> Stats.mean |> box

            """df |> getCol<double> "sepal_width" |> Stats.max""",
            df |> getCol<double> "sepal_width" |> Stats.max |> box

            """df |> getCol<double> "petal_length" |> Stats.min""",
            df |> getCol<double> "petal_length" |> Stats.min |> box

            """df |> getCol<double> "petal_width" |> Stats.stdDev""",
            df |> getCol<double> "petal_width" |> Stats.stdDev |> box

        ]

    printResults results





// ---
// Main
// ---

let main () =
    let examples: (string * (unit -> unit)) list =
        [

            "Dataframe", basicDataframe

        ]

    // examples
    // |> List.iter (fun (title, exampleFunc) ->
    //     printSectionTitle title
    //     exampleFunc ())

    for title, example_func in examples do
        printSectionTitle title
        example_func ()


main ()
