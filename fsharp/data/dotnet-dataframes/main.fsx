#r @"nuget: Microsoft.Data.Analysis"

open Microsoft.Data.Analysis
open System.IO
open System.Linq


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

/// Read a CSV with relative filepath
let readCsv (filepath: string) =
    filepath |> Path.GetFullPath |> DataFrame.LoadCsv

// ---
// Examples
// ---




let basicDataframe () =
    let filepath = "./data/iris.csv"
    let df = readCsv filepath

    let results: (string * obj) list =
        [
            "filepath", filepath

            "df", df

            "df |> _.Head(5)", df |> _.Head(5)

            "df |> _.Tail(5)", df |> _.Tail(5)

            "df.Rows.Count", df.Rows.Count

            "df.Columns.Count", df.Columns.Count

            "df |> _.Info()", df |> _.Info()

            "df |> _.Description()", df |> _.Description()

            """df["species"]""", df["species"]

            """df["species"].DataType""", df["species"].DataType

            """df["species"].Length""", df["species"].Length

            """df["species"].Name""", df["species"].Name

            """df["species"].NullCount""", df["species"].NullCount

            """df["species"] |> _.Info()""", df["species"] |> _.Info()

            "df.Columns |> Seq.map _.Name |> Seq.toList |> box",
            df.Columns |> Seq.map _.Name |> Seq.toList |> box

            """df["species"] |> _.ElementwiseEquals("Iris-setosa")|> fun mask -> df.Filter(mask) |> _.Rows.Count""",
            df["species"]
            |> _.ElementwiseEquals("Iris-virginica")
            |> fun mask -> df.Filter(mask)
            |> _.Rows.Count

            """df["species"] :?> StringDataFrameColumn |> _.ToList() |> Seq.distinct |> box""",
            df["species"] :?> StringDataFrameColumn |> _.ToList() |> Seq.distinct |> box

            """df["sepal_length"] |> _.Max()""", df["sepal_length"] |> _.Max() |> box

            """df["sepal_width"] |> _.Min()""", df["sepal_width"] |> _.Min() |> box

            """df["petal_length"] |> _.Mean()""", df["petal_length"] |> _.Mean() |> box

            """df["petal_width"] |> _.Median()""", df["petal_width"] |> _.Median() |> box

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
