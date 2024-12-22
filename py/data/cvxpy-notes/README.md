# Optimization

- [cvxpy](https://www.cvxpy.org/)
- [cvxpy solvers](https://www.cvxpy.org/tutorial/solvers/index.html#solve-returns)
- [cvxpy user guide](https://www.cvxpy.org/tutorial/index.html)

## Installation

```sh
# Install modelers
uv add cvxpy

# # Install solvers
# brew install cbc
# brew install glpk
# brew install ipopt

# Install solver packages
uv add clarabel # Doesn't support MIP
uv add cvxopt # Includes GLPK_MI, which can solve MIP
uv add ecos # Doesn't support MIP
uv add pyscipopt # Solves non-linear MIP
# uv add cyipopt # ipopt (pyomo NLP)
# uv add glpk
```
