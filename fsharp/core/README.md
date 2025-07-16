# FSharp Notes

## Install

https://learn.microsoft.com/en-us/dotnet/fsharp/get-started/

## Set up project

```sh
# New project and solution file
dotnet new sln -o FSharpSample

# `cd` into project

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

## Console Applications (entry point)

https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/functions/entry-point

## Fsharp language server

- Ionide for F#

## Package manager

https://github.com/fsprojects/Paket
