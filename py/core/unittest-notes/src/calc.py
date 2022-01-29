import math


def add(x, y):
    return x + y


def subtract(x, y):
    return x - y


def multiply(x, y):
    return x * y


def divide(x, y):
    if y == 0:
        return math.inf
    return x / y


def get_circle_area(r):
    # validate
    if r < 0:
        raise ValueError('The radius cannot be negative')
    if type(r) not in [int, float]:
        raise TypeError('The radius must be a number')
    # calculate
    return math.pi * (r ** 2)
