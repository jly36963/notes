# Makefile

Resources:
* https://devhints.io/makefile
* https://gist.github.com/isaacs/62a2d1825d04437c6f08
* https://www.gnu.org/software/make/manual/make.html

## Cheatsheet

```makefile

# assignment
uglify = $(uglify)        # lazy assignment
compressor := $(uglify)   # immediate assignment
prefix ?= /usr/local      # safe assignment

# magic variables
out.o: src.c src.h
  $@   # "out.o" (target)
  $<   # "src.c" (first prerequisite)
  $^   # "src.c src.h" (all prerequisites)

%.o: %.c
  $*   # the 'stem' with which an implicit rule matches ("foo" in "foo.c")

also:
  $+   # prerequisites (all, with duplication)
  $?   # prerequisites (new ones)
  $|   # prerequisites (order-only?)

  $(@D) # target directory

# command prefixes
# - # Ignore errors
# @ # Don’t print command
# + # Run even if Make is in ‘don’t execute’ mode

build:
    @echo "compiling"
    -gcc $< $@

-include .depend


# find files
js_files  := $(wildcard test/*.js)
all_files := $(shell find images -name "*")

# substitutions
file     = $(SOURCE:.cpp=.o)   # foo.cpp => foo.o
outputs  = $(files:src/%.coffee=lib/%.js)

outputs  = $(patsubst %.c, %.o, $(wildcard *.c))
assets   = $(patsubst images/%, assets/%, $(wildcard images/*))

# more functions
$(strip $(string_var))
$(filter %.less, $(files))
$(filter-out %.less, $(files))

# building files
%.o: %.c
  ffmpeg -i $< > $@   # Input and output
  foo $^

# include
-include foo.make

# conditionals
foo: $(objects)
ifeq ($(CC),gcc)
        $(CC) -o foo $(objects) $(libs_for_gcc)
else
        $(CC) -o foo $(objects) $(normal_libs)
endif

# recursion
deploy:
  $(MAKE) deploy2



```

## options

```bash
# options
make
  -e, --environment-overrides
  -B, --always-make
  -s, --silent

  -j, --jobs=N   # parallel processing
```