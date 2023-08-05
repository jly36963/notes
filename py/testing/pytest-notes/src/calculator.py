from typing import List
from functools import reduce
import math
import asyncio
import random


Num = int | float


class Calculator:
    # ---
    # Basic
    # ---

    @staticmethod
    def add(a: Num, b: Num) -> Num:
        """Add two numbers"""
        return a + b

    @staticmethod
    def subtract(a: Num, b: Num) -> Num:
        """Subtract two numbers"""
        return a - b

    @staticmethod
    def multiply(a: Num, b: Num) -> Num:
        """Multiply two numbers"""
        return a * b

    @staticmethod
    def divide(a: Num, b: Num) -> Num:
        """Divide two numbers"""
        if b == 0:
            return math.inf
        return a / b

    # ---
    # Aggregations
    # ---

    @staticmethod
    def get_sum(numbers: List[Num]) -> Num:
        """Get the sum of numbers"""
        return reduce(lambda acc, curr: acc + curr, numbers, 0)

    @staticmethod
    def get_product(numbers: List[Num]) -> Num:
        """Get the product of numbers"""
        return reduce(lambda acc, curr: acc * curr, numbers, 1)

    @staticmethod
    def get_mean(numbers: List[Num]) -> float:
        """Get the mean of numbers"""
        length = len(numbers)
        if not length:
            return math.nan
        return Calculator.get_sum(numbers) / length

    @staticmethod
    def get_std(numbers: List[Num], complete_sample=False) -> float:
        """Get the std of numbers"""
        n = len(numbers)
        if not n:
            return math.nan
        mean = Calculator.get_mean(numbers)
        sum_of_squared_diffs = reduce(lambda acc, curr: acc + math.pow(curr - mean, 2), numbers, 0)
        population_size = n if complete_sample else n - 1
        std = math.sqrt(sum_of_squared_diffs / population_size)
        return std

    # ---
    # Random
    # ---

    @staticmethod
    async def randint(max_value: int = 100) -> int:
        """Pretend to fetch a random number"""
        if not isinstance(max_value, int):
            raise TypeError()
        if not max_value > 0:
            raise ValueError()

        await asyncio.sleep(.1)
        return random.randint(0, max_value)
