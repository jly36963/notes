from src.calculator import Calculator
import asyncio


async def main():
    c = Calculator()

    add_result = c.add(1, 2)
    subtract_result = c.subtract(1, 2)
    multiply_result = c.multiply(1, 2)
    divide_result = c.divide(1, 2)
    get_sum_result = c.get_sum([1, 2, 3, 4, 5])
    get_product_result = c.get_product([1, 2, 3, 4, 5])
    get_mean_result = c.get_mean([1, 2, 3, 4, 5])
    get_std_result = c.get_std([1, 2, 3, 4, 5])
    randint_result = await c.randint(100)

    print("add_result: ", add_result)
    print("subtract_result: ", subtract_result)
    print("multiply_result: ", multiply_result)
    print("divide_result: ", divide_result)
    print("get_sum_result: ", get_sum_result)
    print("get_product_result: ", get_product_result)
    print("get_mean_result: ", get_mean_result)
    print("get_std_result: ", get_std_result)
    print("randint_result: ", randint_result)

asyncio.run(main())
