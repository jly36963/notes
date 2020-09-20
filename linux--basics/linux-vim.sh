
# ------------
# VIM
# ------------

# ------------
# modes
# ------------

i # switch to insert mode before current position
a # switch to insert mode after current position
escape # enter command mode from insert mode
: # enter last-line mode from command mode
q # quit (nags if file not saved)
q! # force quit
ZZ # save/quit
w # write to current file
w file_name # write to new file

# ------------
# command mode (move)
# ------------

h # move cursor left 1. (6h moves left 6 times.)
j # move cursor down 1. (6j moves down 6 times.)
k # move cursor up 1. (6k moves up 6 times.)
l # move cursor right 1. (6l moves right 6 times.)
o # jump cursor to beginning of line
$ # jump cursor to end of line
w # jump forward one word (6w moves forward 6 words.)
e # jump to word end
b # jump to word beginning (6b moves backward 6 words.)
G # jump to end of file
gg # jump to beginning of file

# ------------
# command mode (delete)
# ------------

dw # delete to word end
do # delete to line beginning
d$ # delete to line end
dgg # delete to end of file
dG # delete to beginning of file
u # undo
Ctrl-r # redo

# idk
dx # delete char on cursor
dX # delete char before cursor (backspace)

# ------------
# command mode (select)
# ------------

v # select range of text
V # select lines of text
y # copy (yank) text

# ------------
# command mode (paste) (buffer item from yank/delete)
# ------------

p # paste buffer item after current line
P # past buffer item on the current line


# ------------
# command mode (search)
# ------------

/word # search for 'word' (going forward)
n # next instance
N # previous instance
?word # search for 'word' (going backward)

# ------------
# command mode (replace)
# ------------

:s/foo/bar/g # replace 'foo' with 'bar', (all occurences, current line)
:%s/foo/bar/g # replace 'foo' with 'bar', (all occurences, all lines)
:%s/foo/bar/gc # ask permission, replace 'foo' with 'bar'
:%s/foo/bar/gci # case insensitive
:%s/foo/bar/gc # case sensitive

:5,12s/foo/bar/g # replace 'foo' with 'bar' (all occurences, lines 5-12)
:.,$s/foo/bar/g # replace 'foo' with 'bar' (all occurences, current line - end)
:.,+2s/foo/bar/g # replace 'foo' with 'bar' (all occurences, current line +2 lines)

# ------------
# insert mode
# ------------



# ------------
# last-line mode
# ------------








# end
