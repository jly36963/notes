# ---------
# unittest & mock
# ---------

# ---
# imports
# ---

import unittest
from unittest.mock import patch
import math

# ---
# about
# ---

# required file naming convention
# "file.py" is tested by "test_file.py"

# required method naming convention
# "add" method is tested by "test_add" method

# run (method 1a) (only class in file)
# python -m unittest test_file.py

# run (method 1b) (only class in file) (test discovery)
# python -m unittest

# run (method 2) (with "if __name__ == '__main__'")
# python test_file.py

# setup and teardown (use camelcase)
# use setUp, tearDown


# ---
# unittest methods
# ---

# assertEqual(a, b) -- a must equal b
# assertNotEqual(a, b) -- a must not equal b
# assertTrue(x) -- a must be true
# assertIs(a, b) -- a and b must be pointers to the same object
# assertIsNone(x) -- x must be None
# assertIsNotNone(x) -- x must not be None
# assertIn(a, b) -- a must be member of b
# assertNotIn(a, b) -- a must not be a member of b
# assertIsInstance(a, b) -- a must be of type/class b
# assertNotIsInstance(a, b) -- a must not be of type/class b

# assertDictEqual
# assertDictContainsSubset
# assertAlmostEqual
# assertNotAlmostEqual
# assertGreater
# assertGreaterEqual
# assertLess
# assertLessEqual
# assertListEqual

# ---
# unittest methods (exception handling)
# ---

# # without context
# assertRaises(error, func, *args) -- func result must be of type error

# # with context
# with self.assertRaises(error):
#   func(*args)

# ---
# unittest example
# ---

# calc.py

def add(x,y):
    return x + y

def subtract(x,y):
    return x - y

def multiply(x,y):
    return x * y

def divide(x,y):
    if y == 0:
        return math.inf
    return x / y

def get_circle_area(r):
    # validate
    if r < 0:
        raise ValueError('The radius cannot be negative')
    if type(r) not in [int, float]:
        raise TypeError('The radius must be a non-negative real number')
    # calculate
    return math.pi * (r ** 2)

# test_calc.py (make sure to import calc functions)

class TestCalc(unittest.TestCase):

    # ---
    # lifecycle
    # ---

    @classmethod
    def setUpClass(cls):
        # at beginning
        print('setting up class')

    @classmethod
    def tearDownClass(cls):
        # at end
        print('tearing down class')

    def setUp(self):
        # before each
        print('setting up') 

    def tearDown(self):
        # after each
        print('tearing down') 

    # ---
    # test
    # ---

    def test_add(self):
        self.assertEqual(calc.add(4, 8), 12)
        self.assertEqual(calc.add(-2, 1), -1)
        self.assertEqual(calc.add(0, 2), 2)

    def test_subtract(self):
        self.assertEqual(calc.subtract(4, 8), -4)
        self.assertEqual(calc.subtract(-2, 1), -3)
        self.assertEqual(calc.subtract(0, 2), -2)

    def test_multiply(self):
        self.assertEqual(calc.multiply(4, 8), 32)
        self.assertEqual(calc.multiply(-2, -1), 2)
        self.assertEqual(calc.multiply(0, 2), 0)

    def test_divide(self):
        self.assertEqual(calc.divide(4, 8), .5)
        self.assertEqual(calc.divide(-2, -1), 2)
        self.assertEqual(calc.divide(0, 2), 0)
        self.assertEqual(calc.divide(2, 0), math.inf)

    def test_get_circle_area(self):
        self.assertAlmostEqual(calc.get_circle_area(0), 0)
        self.assertAlmostEqual(calc.get_circle_area(1), math.pi)
        self.assertRaises(ValueError, calc.get_circle_area, -2)
        self.assertRaises(TypeError, calc.get_circle_area, 'hello')
        self.assertRaises(TypeError, calc.get_circle_area, True)


    # ---
    # mock / patch (stub)
    # ---

    # inline (patcher.start / patcher.stop) (can also be used in setUp/tearDown)
    # using context
    # using decorators

    def test_add_with_patch_context(self):
        with patch('calc.add') as patched_add:
            patched_add.return_value = 5

            self.assertEqual(calc.add(2,3), 5)
            patched_add.assert_called_with(2,3)

    def test_add_with_patch_inline(self):
        # patch
        self.patcher = mock.patch('calc.add',  return_value = 5)
        self.patcher.start()
        # test
        self.assertEqual(calc.add(2,3), 5)
        # remove patch
        self.patcher.stop()
        

if __name__ == '__main__':
    unittest.main()


# ---
#
# ---



# ---
#
# ---



# ---
#
# ---



# ---
#
# ---



# ---
#
# ---


