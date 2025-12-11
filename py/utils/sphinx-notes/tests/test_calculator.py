import asyncio
import math
import unittest
from unittest.mock import patch
from src.calculator import Calculator

# sync: unittest.TestCase
# async: unittest.IsolatedAsyncioTestCase


class TestCalc(unittest.IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls):
        # print('setting up class (beginning)')
        pass

    @classmethod
    def tearDownClass(cls):
        # print('tearing down class (end)')
        pass

    def setUp(self):
        # print('setting up (before each)')
        self.c = Calculator()

    def tearDown(self):
        # print('tearing down (after each)')
        pass

    def test_add(self):
        self.assertEqual(self.c.add(1, 2), 3)

    def test_subtract(self):
        self.assertEqual(self.c.subtract(1, 2), -1)

    def test_multiply(self):
        self.assertEqual(self.c.multiply(1, 2), 2)

    def test_divide(self):
        self.assertEqual(self.c.divide(1, 2), .5)
        self.assertAlmostEqual(self.c.divide(1, 3) - .333333333, 0)
        self.assertEqual(self.c.divide(2, 0), math.inf)

    def test_get_sum(self):
        self.assertEqual(self.c.get_sum([1, 2, 3, 4, 5]), 15)

    def test_get_product(self):
        self.assertEqual(self.c.get_product([1, 2, 3, 4, 5]), 120)

    def test_get_mean(self):
        self.assertEqual(self.c.get_mean([1, 2, 3, 4, 5]), 3)
        self.assertTrue(math.isnan(self.c.get_mean([])))

    def test_get_std(self):
        self.assertAlmostEquals(self.c.get_std([1, 2, 3, 4]), 1.2909944487358056)
        self.assertAlmostEquals(self.c.get_std([1, 2, 3, 4], True), 1.118033988749895)

    async def test_get_randint(self):
        # Mock/Patch
        mock_randint = patch("src.calculator.random.randint")
        self.addCleanup(mock_randint.stop)
        self.mock_randint = mock_randint.start()
        self.mock_randint.return_value = 10

        # Test
        result = await self.c.randint()
        self.assertEquals(result, 10)
        self.assertTrue(self.mock_randint.called)
