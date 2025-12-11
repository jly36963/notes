# Gorilla

## Install

`go get -u github.com/gorilla/mux`

## Todo

## Startup

```bash
# dev (requires "air")
make dev
# run
make run
# build / run
make build; make run-build
```

## Go Basics

```bash
# build
go build; ./
# build / run
go run <fn>

# complie packages/dependencies
go build # default fn
go build -o <filename> # specify output fn
go build -o app; ./app #  compile/run
# show environment variables (workspace, etc)
go env
# recursive prettier
go fmt ./...
# download & install dependency (different than "go install")
go get -d <url>
go get ./... # download deps (recursive)
# compile and install dependency (in $GOPATH/bin)
go install <url>
# list packages
go list
# compile and run code
go run <fn>
# version
go version
```
