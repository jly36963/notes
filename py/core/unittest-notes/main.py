# ---------
# unittest & mock
# ---------

# *** TODO: update this ***

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
