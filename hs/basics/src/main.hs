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
  printSectionTitle "Basic Functions"
  basicFunctions
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
printSectionTitle str = do
  let contents = toUpperCase ("\n" ++ str ++ "\n")
  putStrLn contents

clean :: String -> String
clean str =
  do
    str
    & T.pack
    & T.strip
    & T.toLower
    & T.unpack

round2 :: Float -> Int -> Float
round2 f n = fromIntegral (round (f * 10 ^ n)) / (10.0 ^^ n)

-- ---
-- Examples
-- ---

basicPrint :: IO ()
basicPrint = do
  putStrLn "Hello, world!"

basicOperators :: IO ()
basicOperators = do
  let mathRes = 4 / 2 * 3 + 4 - 5
  putStrLn $ "Math result: " ++ show mathRes

  let b1 = False
  let b2 = True
  let b3 = True
  let boolRes = b1 || (b2 && b3) `xor` not b2
  putStrLn $ "Bool result: " ++ show boolRes

basicNumber :: IO ()
basicNumber = do
  let absRes = abs (-5)
  putStrLn $ "`abs (-5)`: " ++ show absRes

  let roundRes = round 2.75
  putStrLn $ "`round 2.75`: " ++ show roundRes
  let ceilingRes = ceiling 2.75
  putStrLn $ "`ceiling 2.75`: " ++ show ceilingRes
  let floorRes = floor 2.75
  putStrLn $ "`floor 2.75`: " ++ show floorRes

  let sqrtRes = sqrt 5
  putStrLn $ "`sqrt 5:`" ++ show sqrtRes

  let fromIntegralRes = round2 (sqrt 5) 3
  putStrLn $ "`round2 (sqrt 5) 3:`" ++ show fromIntegralRes

basicString :: IO ()
basicString = do
  putStrLn "TODO"

basicList :: IO ()
basicList = do
  -- Head/tail, init/last
  let l0 = ['a', 'b', 'c', 'd', 'e']
  putStrLn $ "list of char: " ++ show l0
  putStrLn $ "head: " ++ show (head l0)
  putStrLn $ "tail: " ++ show (tail l0)
  putStrLn $ "init: " ++ show (init l0)
  putStrLn $ "last: " ++ show (last l0)

  -- List comprehension
  let l1 = [n ^ 2 | n <- [1 .. 5], even n]
  putStrLn $ "list comprehension: " ++ show l1

  -- Map
  let l2 = map toUpper ['a' .. 'e']
  putStrLn $ "list of char (map): " ++ show l2
  let l3 = map (\x -> 2 * x + 1) [1, 2, 3, 4, 5]
  putStrLn $ "List of number (map): " ++ show l3

  -- Filter
  -- let l4 = filter (>3) [1, 2, 3, 4, 5]
  -- let l4 = filter even [1, 2, 3, 4, 5]
  let l4 = filter (\x -> x ^ 2 > 10) [1, 2, 3, 4, 5]
  putStrLn $ "List of number (filter): " ++ show l4

  -- Fold
  -- let l5 = foldl (*) 1 [1 .. 5]
  -- let l5 = product [1 .. 5]
  let l5 = foldl (\a c -> a + c * c) 0 [1 .. 5]
  putStrLn $ "List of number (fold): " ++ show l5

basicIf :: IO ()
basicIf = do
  putStrLn "TODO"

basicCase :: IO ()
basicCase = do
  putStrLn "TODO"

basicGuards :: IO ()
basicGuards = do
  putStrLn "TODO"

basicDataTypes :: IO ()
basicDataTypes = do
  putStrLn "TODO"

basicPatternMatching :: IO ()
basicPatternMatching = do
  putStrLn "TODO"

basicFunctions :: IO ()
basicFunctions = do
  putStrLn "TODO"

basicTypeClasses :: IO ()
basicTypeClasses = do
  putStrLn "TODO"

basicMonads :: IO ()
basicMonads = do
  putStrLn "TODO"
