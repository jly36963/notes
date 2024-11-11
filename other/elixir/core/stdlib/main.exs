require Integer

defmodule Stdlib do
  # ---
  # Main
  # ---

  def main do
    print_section_title("path")
    basic_path()

    print_section_title("file")
    basic_file()

    print_section_title("file io")
    basic_file_io()

    print_section_title("system")
    basic_system()

    print_section_title("process")
    basic_process()
  end

  # ---
  # Utils
  # ---

  @spec is_string(any()) :: bool()
  def is_string(v) do
    is_binary(v) and String.valid?(v)
  end

  @spec is_mapset(any()) :: bool()
  def is_mapset(v) do
    case v do
      %MapSet{} -> true
      _ -> false
    end
  end

  def stringify(v) do
    cond do
      is_list(v) ->
        v
        |> Enum.map(fn inner -> stringify(inner) end)
        |> Enum.join(", ")
        |> then(fn s -> "[" <> s <> "]" end)

      is_mapset(v) ->
        v
        |> Enum.map(fn inner -> stringify(inner) end)
        |> Enum.join(", ")
        |> then(fn s -> "MapSet.new([" <> s <> "])" end)

      is_tuple(v) ->
        v
        |> Tuple.to_list()
        |> Enum.map(fn inner -> stringify(inner) end)
        |> Enum.join(", ")
        |> then(fn s -> "{" <> s <> "}" end)

      is_string(v) ->
        ~s|"#{v}"|

      true ->
        inspect(v)
    end
  end

  @spec print_section_title(String.t()) :: none()
  def print_section_title(str) do
    "\n#{str}\n"
    |> String.upcase()
    |> IO.puts()
  end

  # ---
  # Examples
  # ---

  def basic_path() do
    dir1 = "."
    dir2 = "./a/b/c/d.txt"
    dir3 = "~"

    results = [
      "dir1: #{dir1}",
      "dir2: #{dir2}",
      "dir3: #{dir3}",
      "Path.absname(dir1): #{Path.absname(dir1)}",
      "Path.basename(dir2): #{Path.basename(dir2)}",
      "Path.dirname(dir2): #{Path.dirname(dir2)}",
      "Path.expand(dir3): #{Path.expand(dir3)}",
      ~s|Path.join([".", "data", "input"]): #{Path.join([".", "data", "input"])}|,
      "Path.rootname(dir2): #{Path.rootname(dir2)}",
      "Path.split(dir2): #{Path.split(dir2)}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_file() do
    dir1 = "."
    filename1 = "./main.exs"

    results = [
      "dir1: #{dir1}",
      "filename1: #{filename1}",
      "File.cwd!(): #{File.cwd!()}",
      "File.dir?(dir1): #{File.dir?(dir1)}",
      "File.exists?(dir1): #{File.exists?(dir1)}",
      "File.ls!(): #{File.ls!()}",
      "File.regular?(filename1): #{File.regular?(filename1)}",
      "File.stat!(filename1).type: #{File.stat!(filename1).type}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_file_io() do
    data_dir = Path.join([".", "data"])
    input_dir = Path.join([data_dir, "input"])
    output_dir = Path.join([data_dir, "output"])

    file1_name = "report.txt"
    file1_path = Path.join([input_dir, file1_name])
    file1_copy_path = Path.join([output_dir, file1_name])

    File.cd!(".")
    File.mkdir_p!(input_dir)
    File.mkdir!(output_dir)
    File.touch!(file1_path)
    File.write!(file1_path, "Who you calling pinhead?")
    File.read!(file1_path) |> stringify |> IO.puts()
    File.copy!(file1_path, file1_copy_path)

    File.open!(
      file1_copy_path,
      [:read, :write],
      fn f -> IO.write(f, "I can't see my forehead.") end
    )

    File.open!(file1_copy_path, [:read], fn f -> IO.read(f, :eof) end)
    |> stringify
    |> IO.puts()

    File.rm!(file1_copy_path)
    File.rm!(file1_path)
    File.rmdir!(output_dir)
    File.rmdir!(input_dir)
    File.rmdir!(data_dir)
  end

  def basic_system do
    dir1 = "."
    filename1 = "./main.exs"

    results = [
      "dir1: #{dir1}",
      "System.argv(): #{System.argv() |> stringify}",
      ~s|System.cmd("pwd", []): #{System.cmd("pwd", []) |> elem(0) |> String.trim() |> stringify}|,
      ~s|System.fetch_env!("USER"): #{System.fetch_env!("USER")}|,
      ~s|System.get_env()["HOME"]: #{System.get_env()["HOME"] |> stringify}|,
      "System.os_time(): #{System.os_time() |> stringify}",
      "System.pid(): #{System.pid() |> stringify}",
      ~s|System.shell("pwd"): #{System.shell("pwd") |> elem(0) |> String.trim() |> stringify}|,
      "System.system_time(): #{System.system_time() |> stringify}",
      "System.user_home!(): #{System.user_home!() |> stringify}",
      "System.version(): #{System.version() |> stringify}"
    ]

    Enum.each(results, fn r -> IO.puts(r) end)
  end

  def basic_process do
    IO.puts("...")
    # https://hexdocs.pm/elixir/processes.html
    # https://hexdocs.pm/elixir/Task.html
  end

  # TODO: agent, process, task
end

# ---
# Run
# ---

Stdlib.main()
