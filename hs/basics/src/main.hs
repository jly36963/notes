import Data.Bits (xor)
import Data.Char (toLower, toUpper)
import Data.Function ((&))
import Data.Text qualified as T

-- ---
-- Main
-- ---

main :: IO ()
main = do
  printSectionTitle "Basic Print"
  basicPrint
  printSectionTitle "Basic Operators"
  basicOperators
  printSectionTitle "Basic Number"
  basicNumber
  printSectionTitle "Basic String"
  basicString
  printSectionTitle "Basic Functions"
  basicFunctions
  printSectionTitle "Basic List"
  basicList
  printSectionTitle "Basic If"
  basicIf
  printSectionTitle "Basic Case"
  basicCase
  printSectionTitle "Basic Guards"
  basicGuards
  printSectionTitle "Basic Data Types"
  basicDataTypes
  printSectionTitle "Basic Pattern Matching"
  basicPatternMatching
  printSectionTitle "Basic Type Classes"
  basicTypeClasses
  printSectionTitle "Basic Monads"
  basicMonads

-- ---
-- Utils
-- ---

toUpperCase :: String -> String
toUpperCase = map toUpper

toLowerCase :: String -> String
toLowerCase = map toUpper

printSectionTitle :: String -> IO ()
printSectionTitle str = ("\n" ++ str ++ "\n") & toUpperCase & putStrLn

clean :: String -> String
clean str =
  do
    str
    & T.pack
    & T.strip
    & T.toLower
    & T.unpack

roundTo :: Int -> Float -> Float
roundTo n f = fromIntegral (round (f * 10 ^ n)) / (10.0 ^^ n)

-- ---
-- Examples
-- ---

basicPrint :: IO ()
basicPrint = do
  putStrLn "Hello, world!"

basicOperators :: IO ()
basicOperators = do
  let mathRes = 4 / 2 * 3 + 4 - 5
  putStrLn ("Math result: " ++ show mathRes)

  let b1 = False
  let b2 = True
  let b3 = True
  let boolRes = b1 || (b2 && b3) `xor` not b2
  putStrLn ("Bool result: " ++ show boolRes)

basicNumber :: IO ()
basicNumber = do
  let absRes = abs (-5)
  putStrLn ("`abs (-5)`: " ++ show absRes)

  let roundRes = round 2.75
  putStrLn ("`round 2.75`: " ++ show roundRes)
  let ceilingRes = ceiling 2.75
  putStrLn ("`ceiling 2.75`: " ++ show ceilingRes)
  let floorRes = floor 2.75
  putStrLn ("`floor 2.75`: " ++ show floorRes)

  let sqrtRes = sqrt 5
  putStrLn ("`sqrt 5`: " ++ show sqrtRes)

  let fromIntegralRes = roundTo 3 (sqrt 5)
  putStrLn ("`roundTo 3 (sqrt 5): `" ++ show fromIntegralRes)

basicString :: IO ()
basicString = do
  let str = "The inner machinations of my mind are an enigma."
  putStrLn ("length: " ++ (str & length & show))
  -- TODO: head, tail, init, last
  putStrLn ("take: " ++ (str & take 3 & show))
  putStrLn ("reverse: " ++ (str & reverse & show))
  putStrLn ("concat: " ++ (["Fi", "nl", "and!"] & concat & show))
  putStrLn ("words: " ++ ("Where's the leak ma'am?" & words & show))
  putStrLn ("unwords: " ++ (["W", "for", "Wumbo"] & unwords & show))

basicFunctions :: IO ()
basicFunctions = do
  -- Partial application
  let round2 = roundTo 2
  let roundRes = round2 3.14159
  putStrLn ("pi rounded to 2 decimals is " ++ show roundRes)

  -- Composition
  let f1 = (1 +) . (2 *)
  let f1Res = f1 2
  putStrLn ("f1: " ++ show f1Res)
  let f2 n = n & (* 2) & (+ 1)
  let f2Res = f2 2
  putStrLn ("f2: " ++ show f2Res)
  let f3 n = (+ 1) $ (* 2) n
  let f3Res = f3 2
  putStrLn ("f3: " ++ show f3Res)

basicList :: IO ()
basicList = do
  -- Head/tail, init/last
  let l0 = ['a', 'b', 'c', 'd', 'e']
  putStrLn ("list of char: " ++ show l0)
  putStrLn ("head: " ++ (l0 & head & show))
  putStrLn ("tail: " ++ (l0 & tail & show))
  putStrLn ("init: " ++ (l0 & init & show))
  putStrLn ("last: " ++ (l0 & last & show))

  -- List comprehension
  let l1 = [n ^ 2 | n <- [1 .. 5], even n]
  putStrLn ("list comprehension: " ++ show l1)

  -- Map
  let l2 = map toUpper ['a' .. 'e']
  putStrLn ("list of char (map): " ++ show l2)
  let l3 = map (\x -> 2 * x + 1) [1, 2, 3, 4, 5]
  putStrLn ("List of number (map): " ++ show l3)

  -- Filter
  -- let l4 = filter (>3) [1, 2, 3, 4, 5]
  -- let l4 = filter even [1, 2, 3, 4, 5]
  let l4 = filter (\x -> x ^ 2 > 10) [1, 2, 3, 4, 5]
  putStrLn ("List of number (filter): " ++ show l4)

  -- Fold
  -- let l5 = foldl (*) 1 [1 .. 5]
  -- let l5 = product [1 .. 5]
  let l5 = foldl (\a c -> a + c * c) 0 [1 .. 5]
  putStrLn ("List of number (fold): " ++ show l5)

basicIf :: IO ()
basicIf = do
  let n = 7
  let parity = if even n then "even" else "odd"
  putStrLn (show n ++ " is " ++ parity)

colorToFruit :: String -> String
colorToFruit color = case color of
  "red" -> "Strawberry"
  "yellow" -> "Banana"
  "blue" -> "Blueberry"
  "green" -> "Pear"
  "purple" -> "Plum"
  "orange" -> "Orange"
  _ -> "-"

basicCase :: IO ()
basicCase = do
  let color = "green"
  let fruit = colorToFruit color
  putStrLn ("Fruit is: " ++ fruit)

numberType :: Int -> String
numberType n
  | n < 0 = "negative"
  | n == 0 = "zero"
  | otherwise = "positive"

basicGuards :: IO ()
basicGuards = do
  let n = 7
  let res = numberType n
  putStrLn (show n ++ " is " ++ res)

data Option val = None | Some val

mapOption :: (val -> val) -> Option val -> Option val
mapOption fn (Some val) = val & fn & Some
mapOption fn None = None

basicDataTypes :: IO ()
basicDataTypes = do
  let opt = Some 7
  let mappedOpt = mapOption (\x -> x * 2 + 1) opt
  case mappedOpt of
    Some val -> putStrLn ("The mapped option is " ++ show val)
    None -> putStrLn "The mapped option is None"

basicPatternMatching :: IO ()
basicPatternMatching = do
  putStrLn "TODO"

basicTypeClasses :: IO ()
basicTypeClasses = do
  putStrLn "TODO"

basicMonads :: IO ()
basicMonads = do
  putStrLn "TODO"
