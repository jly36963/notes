import pytest
import math
from src.calculator import Calculator
from unittest.mock import patch


@pytest.fixture(autouse=True)
def mock_randint():
    # Mock
    m_randint = patch("src.calculator.random.randint")
    m_randint = m_randint.start()
    m_randint.return_value = 10
    # Yield resource
    yield m_randint
    # Clean up
    m_randint.stop()


@pytest.fixture()
def c():
    yield Calculator()


def test_add(c):
    assert c.add(1, 2) == 3


def test_subtract(c):
    assert c.subtract(1, 2) == -1


def test_multiply(c):
    assert c.multiply(1, 2) == 2


def test_divide(c):
    assert c.divide(1, 2) == .5
    assert c.divide(1, 3) == pytest.approx(.333333333)
    assert c.divide(2, 0) == math.inf


def test_get_sum(c):
    assert c.get_sum([1, 2, 3, 4, 5]) == 15


def test_get_product(c):
    assert c.get_product([1, 2, 3, 4, 5]) == 120


def test_get_mean(c):
    assert c.get_mean([1, 2, 3, 4, 5]) == 3
    assert math.isnan(c.get_mean([]))


def test_get_std(c):
    assert c.get_std([1, 2, 3, 4]) == pytest.approx(1.2909944487358056)
    assert c.get_std([1, 2, 3, 4], True) == pytest.approx(1.118033988749895)


async def test_get_randint(c, mock_randint):
    result = await c.randint()
    assert result == 10
    assert mock_randint.called
