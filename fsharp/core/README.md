# FSharp Notes

## Install

https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/

## Set up project

```sh
# New project and solution file
dotnet new sln -o FSharpSample

# IMPORTANT: `cd` into project

# New class library
dotnet new classlib -lang "F#" -o src/Library
# Add project to solution file
dotnet sln add src/Library/Library.fsproj
# Write a console application that consumes the class library
dotnet new console -lang "F#" -o src/App
# Add a reference to Library project (for App)
dotnet add src/App/App.fsproj reference src/Library/Library.fsproj
# Add App project to solution file
dotnet sln add src/App/App.fsproj
```

## IMPORTANT NOTE

- ionide / fsharp language server does not work in multi-folder workspace.
- it does fine with fsharp scripts, but not projects
- open fsharp projects in their own window

## Console Applications (entry point)

https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/functions/entry-point

## Fsharp language server

- Ionide for F#

## Package manager

https://github.com/fsprojects/Paket
