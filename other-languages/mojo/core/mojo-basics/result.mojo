from utils import Variant


struct Result[T: Copyable & Movable, E: Copyable & Movable]:
    comptime _type = Variant[Self.T, Self.E]
    var _value: Self._type
    var _is_valid: Bool

    fn __init__(out self, var value: Self._type, is_valid: Bool):
        self._value = value
        self._is_valid = is_valid

    @staticmethod
    fn ok(var ok_val: T) -> Self:
        value = Self._type(ok_val^)
        return Self(value^, True)

    @staticmethod
    fn err(var err_val: E) -> Self:
        value = Self._type(err_val^)
        return Self(value^, False)

    fn unwrap(self) raises -> Self.T:
        if self._value.isa[Self.T]() and self._is_valid:
            # TODO: move instead of copy
            return self._value[Self.T].copy()
        else:
            raise Error("Unwrapped error value")

    fn unwrap_err(self) raises -> Self.E:
        if self._value.isa[Self.E]() and not self._is_valid:
            # TODO: move instead of copy
            return self._value[Self.E].copy()
        else:
            raise Error("Unwrapped ok value")

    fn and_then[
        T2: Copyable & Movable
    ](self, op: fn (Self.T) -> Result[T2, Self.E]) -> Result[T2, Self.E]:
        if self._value.isa[Self.T]() and self._is_valid:
            # TODO: move instead of copy
            ok_val = self._value[Self.T].copy()
            return op(ok_val^)
        else:
            err_val = self._value[Self.E].copy()
            return Result[T2, E].err(err_val^)

    fn map[
        T2: Copyable & Movable
    ](self, op: fn (Self.T) -> T2) -> Result[T2, Self.E]:
        if self._value.isa[Self.T]() and self._is_valid:
            new_value = op(self._value[Self.T])
            return Result[T2, E].ok(new_value^)
        else:
            # TODO: move instead of copy
            error = self._value[Self.E].copy()
            return Result[T2, E].err(error^)

    fn map_err[
        E2: Copyable & Movable
    ](self, op: fn (Self.E) -> E2) -> Result[Self.T, E2]:
        if self._value.isa[Self.E]() and not self._is_valid:
            new_error = op(self._value[Self.E])
            return Result[T, E2].err(new_error^)
        else:
            # TODO: move instead of copy
            value = self._value[Self.T].copy()
            return Result[T, E2].ok(value^)
