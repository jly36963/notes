import unittest
from unittest.mock import patch
import math
from src import calc


class TestCalc(unittest.TestCase):

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

            self.assertEqual(calc.add(2, 3), 5)
            patched_add.assert_called_with(2, 3)

    def test_add_with_patch_inline(self):
        # patch
        self.patcher = patch('calc.add',  return_value=5)
        self.patcher.start()
        # test
        self.assertEqual(calc.add(2, 3), 5)
        # remove patch
        self.patcher.stop()


if __name__ == '__main__':
    unittest.main()
