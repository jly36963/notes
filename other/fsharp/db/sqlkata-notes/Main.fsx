#r @"nuget: Microsoft.Data.Analysis"
#r @"nuget: SqlKata"
#r @"nuget: SqlKata.Execution"
#r @"nuget: Npgsql"
#r @"nuget: FSharpPlus"

open FSharpPlus
open Npgsql
open SqlKata
open SqlKata.Compilers
open SqlKata.Execution
open System

// ---
// Constants
// ---

let PG_URL = "postgresql://postgres:postgres@localhost:5432/practice"

// ---
// Types
// ---

[<CLIMutable>]
type Ninja =
    {
        id: Guid
        first_name: string
        last_name: string
        age: int
        created_at: DateTime
        updated_at: DateTime option
    }

[<CLIMutable>]
type NinjaCreateInput =
    {
        first_name: string
        last_name: string
        age: int
    }

[<CLIMutable>]
type NinjaUpdateInput =
    {
        first_name: string option
        last_name: string option
        age: int option
    }

[<CLIMutable>]
type Jutsu =
    {
        id: Guid
        name: string
        chakra_nature: string
        description: string
        created_at: DateTime
        updated_at: DateTime option
    }

[<CLIMutable>]
type JutsuCreateInput =
    {
        name: string
        chakra_nature: string
        description: string
    }

[<CLIMutable>]
type JutsuUpdateInput =
    {
        name: string option
        chakra_nature: string option
        description: string option
    }

[<CLIMutable>]
type NinjaWithJutsus =
    {
        id: Guid
        first_name: string
        last_name: string
        age: int
        created_at: DateTime
        updated_at: DateTime option
        jutsus: Jutsu list option
    }


// ---
// Utils
// ---

/// Get the type name of a value
let getTypeName v : obj =
    if v = null then "<null>" else v.GetType().Name

/// Text format a (potentially-boxed) value
let pretty value =
    match tryUnbox value with
    | Some unboxed -> sprintf "%A" unboxed
    | None -> sprintf "%A" value

let printResults (results: (string * obj) list) =
    for k, v in results do
        let typeName = getTypeName v
        let value = pretty v
        System.Console.WriteLine $"{k}\n{typeName}\n{value}\n"

/// For an optional value, only set the k/v if the value is Some
let maybeAdd k v map =
    match v with
    | Some v -> Map.add k v map
    | None -> map

/// Given a URL connection string, convert to dotnet format
let convertUrlConnString url =
    let uri = Uri(url)
    let userInfo = uri.UserInfo.Split ':'

    let username, password =
        match userInfo with
        | [| u; p |] -> u, p
        | _ -> failwith "Url must have username and password."

    let host = uri.Host
    let port = uri.Port
    let database = uri.AbsolutePath.TrimStart '/'

    let mutable builder = new NpgsqlConnectionStringBuilder()
    builder.Host <- host
    builder.Port <- port
    builder.Username <- username
    builder.Password <- password
    builder.Database <- database

    builder.ConnectionString

// ---
// Providers
// ---

let ninjaCreate (db: QueryFactory) (input: NinjaCreateInput) : Result<Guid, Exception> =
    try
        let id = Guid.NewGuid()
        {| input with id = id |} |> db.Query("ninjas").Insert |> ignore
        Ok id
    with ex ->
        Error ex


let ninjaGet (db: QueryFactory) (ninjaId: Guid) : Result<Option<Ninja>, Exception> =
    try
        db.Query("ninjas").Where("id", "=", ninjaId).Get<Ninja>() |> Seq.tryHead |> Ok
    with ex ->
        Error ex

let ninjaUpdate (db: QueryFactory) (id: Guid) (input: NinjaUpdateInput) : Result<int, Exception> =
    try
        let updates: Map<string, objnull> =
            Map.empty
            |> fun m -> maybeAdd "first_name" (Option.map box input.first_name) m
            |> fun m -> maybeAdd "last_name" (Option.map box input.last_name) m
            |> fun m -> maybeAdd "age" (Option.map box input.age) m

        let updateCount = db.Query("ninjas").Where("id", "=", id).Update(updates)
        Ok updateCount
    with ex ->
        Error ex

let ninjaDelete (db: QueryFactory) (id: Guid) : Result<int, Exception> =
    try
        let count = db.Query("ninjas").Where("id", "=", id).Delete()
        Ok count
    with ex ->
        Error ex

let jutsuCreate (db: QueryFactory) (input: JutsuCreateInput) : Result<Guid, Exception> =
    try
        let id = Guid.NewGuid()
        {| input with id = id |} |> db.Query("jutsus").Insert |> ignore
        Ok id
    with ex ->
        Error ex


let jutsuGet (db: QueryFactory) (jutsuId: Guid) : Result<Option<Jutsu>, Exception> =
    try
        db.Query("jutsus").Where("id", "=", jutsuId).Get<Jutsu>() |> Seq.tryHead |> Ok
    with ex ->
        Error ex

let jutsuUpdate (db: QueryFactory) (id: Guid) (input: JutsuUpdateInput) : Result<int, Exception> =
    try
        let updates: Map<string, objnull> =
            Map.empty
            |> fun m -> maybeAdd "name" (Option.map box input.name) m
            |> fun m -> maybeAdd "description" (Option.map box input.description) m
            |> fun m -> maybeAdd "chakra_nature" (Option.map box input.chakra_nature) m

        let count = db.Query("jutsus").Where("id", "=", id).Update(updates)
        Ok count
    with ex ->
        Error ex

let jutsuDelete (db: QueryFactory) (id: Guid) : Result<int, Exception> =
    try
        let count = db.Query("jutsus").Where("id", "=", id).Delete()
        Ok count
    with ex ->
        Error ex

let ninjaJutsuAssociate
    (db: QueryFactory)
    (ninjaId: Guid)
    (jutsuId: Guid)
    : Result<unit, Exception> =
    try
        let row =
            {|
                id = Guid.NewGuid()
                ninja_id = ninjaId
                jutsu_id = jutsuId
            |}

        row |> db.Query("ninjas_jutsus").Insert |> ignore
        Ok()
    with ex ->
        Error ex

let ninjaJutsuDissociate
    (db: QueryFactory)
    (ninjaId: Guid)
    (jutsuId: Guid)
    : Result<unit, Exception> =
    try
        db
            .Query("ninjas_jutsus")
            .Where("ninja_id", "=", ninjaId)
            .Where("jutsu_id", "=", jutsuId)
            .Delete()
        |> ignore

        Ok()
    with ex ->
        Error ex


let ninjaJutsusGet (db: QueryFactory) (ninjaId: Guid) : Result<Option<NinjaWithJutsus>, Exception> =
    try
        db.Query("ninjas").Where("id", "=", ninjaId).Get<NinjaWithJutsus>()
        |> Seq.tryHead
        |> Option.map (fun n ->
            let qb = Query("ninjas_jutsus").Select("jutsu_id").Where("ninja_id", ninjaId)
            let jutsus = db.Query("jutsus").WhereIn("id", qb).Get<Jutsu>() |> Seq.toList
            { n with jutsus = Some jutsus })
        |> Ok
    with ex ->
        Error ex

// ---
// Main
// ---

let main () =
    let connString = convertUrlConnString PG_URL
    let connection = new NpgsqlConnection(connString)
    let compiler = new PostgresCompiler()
    let db = new QueryFactory(connection, compiler)

    let ninjaId =
        ninjaCreate
            db
            {
                first_name = "Kakashi"
                last_name = "Hatake"
                age = 27
            }
        |> Result.get

    printfn "inserted ninja"

    let ninja = ninjaGet db ninjaId |> Result.get |> Option.get

    printfn "got ninja"

    let ninjaUpdates =
        {
            first_name = Some "Kaka"
            last_name = Some "Sensei"
            age = None
        }

    let updateNinjaCount = ninjaUpdates |> ninjaUpdate db ninjaId |> Result.get

    printfn "updated ninja"

    let updatedNinja = ninjaGet db ninjaId |> Result.get |> Option.get

    printfn "got the updated ninja"

    let jutsuId =
        jutsuCreate
            db
            {
                name = "Chidori"
                chakra_nature = "Lightning"
                description = "Plover / a thousand birds"
            }
        |> Result.get

    printfn "created jutsu"

    let jutsu = jutsuGet db jutsuId |> Result.get |> Option.get

    printfn "got jutsu"

    let jutsuUpdates =
        {
            name = None
            chakra_nature = None
            description = Some "Lightning blade"
        }

    let updateJutsuCount = jutsuUpdates |> jutsuUpdate db jutsuId |> Result.get

    printfn "updated jutsu"

    let updatedJutsu = jutsuGet db jutsuId |> Result.get |> Option.get

    printfn "got the updated jutsu"

    let rawQueryResult: Ninja list =
        db.Select<Ninja> "SELECT * FROM ninjas" |> Seq.toList

    ninjaJutsuAssociate db ninjaId jutsuId |> Result.get

    printfn "associated ninja/jutsu"

    let ninjaWithJutsus = ninjaJutsusGet db ninjaId |> Result.get |> Option.get

    printfn "got ninja with jutsus (after association)"

    ninjaJutsuDissociate db ninjaId jutsuId |> Result.get

    printfn "dissociated ninja/jutsu"

    let ninjaWithJutsus2 = ninjaJutsusGet db ninjaId |> Result.get |> Option.get

    printfn "got ninja with jutsus (after dissociation)"

    let jutsuDeleteCount = jutsuDelete db jutsuId |> Result.get

    printfn "deleted the jutsu"

    let ninjaDeleteCount = ninjaDelete db ninjaId |> Result.get

    printfn "deleted the ninja"

    let results: (string * obj) list =
        [
            "ninjaId", ninjaId
            "ninja", ninja
            "updateNinjaCount", updateNinjaCount
            "updatedNinja", updatedNinja

            "jutsuId", jutsuId
            "jutsu", jutsu
            "updateJutsuCount", updateJutsuCount
            "updatedJutsu", updatedJutsu

            "rawQueryResult", rawQueryResult
            "ninjaWithJutsus", ninjaWithJutsus
            "ninjaWithJutsus2", ninjaWithJutsus2

            "jutsuDeleteCount", jutsuDeleteCount
            "ninjaDeleteCount", ninjaDeleteCount

        ]

    printResults results


main ()
