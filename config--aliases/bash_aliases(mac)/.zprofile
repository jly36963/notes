# aliases
    # put this in .bashrc / .zprofile
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# gopath
export GOPATH="$HOME/go"
PATH="$GOPATH/bin:$PATH"