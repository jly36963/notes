package main

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"compress/zlib"
	"crypto"
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"math"
	"math/big"
	mathrand "math/rand"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"time"
)

func main() {
	printSectionTitle("archive/tar")
	basicArchiveTar()
	printSectionTitle("bufio")
	basicBufio()
	printSectionTitle("builtin")
	basicBuiltin()
	printSectionTitle("bytes")
	basicBytes()
	printSectionTitle("compress/gzip")
	basicCompressGzip()
	printSectionTitle("compress/zlib")
	basicCompressZlib()
	printSectionTitle("container")
	basicContainer()
	printSectionTitle("context")
	basicContext()
	printSectionTitle("crypto/aes")
	basicCryptoAes()
	printSectionTitle("crypto/md5")
	basicCryptoMd5()
	printSectionTitle("crypto/hmac")
	basicCryptoHmac()
	printSectionTitle("crypto/rand")
	basicCryptoRand()
	printSectionTitle("crypto/rsa")
	basicCryptoRsa()
	printSectionTitle("crypto/tls")
	basicCryptoTls()
	printSectionTitle("encoding/base64")
	basicEncodingBase64()
	printSectionTitle("encoding/csv")
	basicEncodingCsv()
	printSectionTitle("encoding/json")
	basicEncodingJson()
	printSectionTitle("errors")
	basicErrors()
	printSectionTitle("filepath")
	basicFilepath()
	printSectionTitle("fmt")
	basicFmt()
	printSectionTitle("io")
	basicIO()
	printSectionTitle("log")
	basicLog()
	printSectionTitle("math")
	basicMath()
	printSectionTitle("math/rand")
	basicMathRand()
	printSectionTitle("net/http (Get)")
	basicNetHttpGet()
	printSectionTitle("net/http (Post)")
	basicNetHttpPost()
	printSectionTitle("os")
	basicOs()
	printSectionTitle("os (ReadFile/ReadDir)")
	basicOsRead()
	printSectionTitle("os.File")
	basicOsFile()
	printSectionTitle("os/exec")
	basicOsExec()
	printSectionTitle("path")
	basicPath()
	printSectionTitle("path/filepath")
	basicPathFilepath()
	printSectionTitle("reflect")
	basicReflect()
	printSectionTitle("regexp")
	basicRegexp()
	printSectionTitle("runtime")
	basicRuntime()
	printSectionTitle("sort")
	basicSort()
	printSectionTitle("strconv")
	basicStrconv()
	printSectionTitle("strings")
	basicStrings()
	printSectionTitle("time")
	basicTime()
	printSectionTitle("testing")
	basicTesting()
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

func basicArchiveTar() {
	// Writer
	var b bytes.Buffer
	tw := tar.NewWriter(&b)
	fn := "my-file.txt"
	body := "Is mayonaise an instrument"
	// Write header
	h := &tar.Header{
		Name: fn,
		Mode: 0777,
		Size: int64(len(body)),
	}
	if err := tw.WriteHeader(h); err != nil {
		panic(err)
	}
	// Write body
	if _, err := tw.Write([]byte(body)); err != nil {
		panic(err)
	}
	if err := tw.Close(); err != nil {
		panic(err)
	}
	// Read
	tr := tar.NewReader(&b)
	// Zip archive can contain many files
	for {
		h, err := tr.Next()
		if err == io.EOF {
			break // Break after last file
		}
		if err != nil {
			panic(err)
		}
		fmt.Println("file name: ", h.Name)
		sb := new(strings.Builder)
		if _, err := io.Copy(sb, tr); err != nil {
			panic(err)
		}
		s := sb.String()
		fmt.Println("String result: ", s)
	}
}

func basicBufio() {
	// https://golang.org/pkg/bufio/
	fmt.Println("TODO")
}

func basicBuiltin() {
	// https://pkg.go.dev/builtin@go1.17.7

	appended := append([]string{"a", "b"}, "c")
	capacity := cap([]string{"a", "b", "c"})
	copied := copy([]string{"a", "b", "c"}, []string{})
	delete(map[uint64]string{1234: "Kakashi hatake"}, 1234)
	length := len("Hello world")
	slice1 := make([]string, 0, 3)
	map1 := make(map[uint64]string, 3)
	sb := new(strings.Builder)

	fmt.Println("append", appended)
	fmt.Println("cap", capacity)
	fmt.Println("copy", copied)
	fmt.Println("delete", "(deletes element with specified key)")
	fmt.Println("len", length)
	fmt.Println("make (slice)", slice1)
	fmt.Println("make (map)", map1)
	fmt.Println("new", sb)

	// TODO: panic/recover
}

func basicBytes() {
	// functions for the manipulation of byte slices
	// analogous to the facilities of the strings package
}

func basicCompressGzip() {
	// Write
	var b bytes.Buffer
	w := gzip.NewWriter(&b)
	w.Write([]byte("The inner machinations of my mind are an enigma"))
	w.Close()
	// Read
	r, err := gzip.NewReader(&b) // io.readCloser
	if err != nil {
		panic(err)
	}
	// Read (to string variable)
	sb := new(strings.Builder)
	_, err = io.Copy(sb, r)
	if err != nil {
		panic(err)
	}
	s := sb.String()
	fmt.Println("String result: ", s)
	r.Close()
}

func basicCompressZlib() {
	// Write
	var b bytes.Buffer
	w := zlib.NewWriter(&b) // *zlib.Writer
	w.Write([]byte("The inner machinations of my mind are an enigma"))
	w.Close()
	// Read
	r, err := zlib.NewReader(&b) // io.readCloser
	if err != nil {
		panic(err)
	}
	/*
		// Read (to stdout)
		_, err = io.Copy(os.Stdout, r)
		if err != nil {
			panic(err)
		}
		r.Close()
	*/
	// Read (to string variable)
	sb := new(strings.Builder)
	_, err = io.Copy(sb, r)
	if err != nil {
		panic(err)
	}
	s := sb.String()
	fmt.Println("String result: ", s)
	r.Close()
}

func basicContainer() {
	// https://pkg.go.dev/container
	fmt.Println("TODO")
}

func basicContext() {
	// https://pkg.go.dev/context
	fmt.Println("TODO")
}

func basicCryptoAes() {
	// https://pkg.go.dev/crypto
	// https://pkg.go.dev/crypto#section-directories

	text := []byte("No one can know, not even Squidward's house")
	key := []byte("5eb63bbbe01eeed093cb22bb8f5acdc3")

	// Create aes cipher (key needs to be 32 chars for aes-256)
	c, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}

	// Galois/Counter Mode (mode of operation for symmetric key crypto block ciphers)
	gcm, err := cipher.NewGCM(c)
	if err != nil {
		panic(err)
	}

	// byte array (size of nonce) to be passed to seal
	nonceSize := gcm.NonceSize()
	nonce := make([]byte, nonceSize)

	// populate nonce (with a cryptographically secure random sequence)
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err)
	}

	// Encrypt using seal function
	result := gcm.Seal(nonce, nonce, text, nil)
	fmt.Println("crypto/aes seal result:", result)

	// Write to file
	fn := "my-encrypted-file.txt"
	if err = os.WriteFile(fn, result, 0777); err != nil {
		panic(err)
	}

	// Read from file
	contents, err := os.ReadFile(fn)
	if err != nil {
		panic(err)
	}

	// Decrypt using open function
	nonce, ciphertext := contents[:nonceSize], contents[nonceSize:]
	result, err = gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("crypto/aes open result:", string(result))

	// Cleanup
	if err = os.Remove(fn); err != nil {
		fmt.Println("Could not remove file " + fn)
	}
}

func basicCryptoMd5() {
	// MD% is cryptographically broken and should not be used for secure applications
	hasher := md5.New()
	hasher.Write([]byte("No one can know, not even Squidward's house"))
	result := hex.EncodeToString(hasher.Sum(nil))
	fmt.Println("md5 hash result", result)
}

func basicCryptoHmac() {
	secret := []byte("No one can know, not even Squidward's house")
	data := []byte("One embarrassing snapshot of SpongeBob at the Christmas party")

	// Create hmac and write to it
	h := hmac.New(sha256.New, secret)
	h.Write(data)

	result := hex.EncodeToString(h.Sum(nil))
	fmt.Println("hmac hash result:", result) // 64 chars
}

func basicCryptoRand() {
	randInt, _ := rand.Int(rand.Reader, big.NewInt(100))
	randPrime, _ := rand.Prime(rand.Reader, 8)      // Prime less than 2^8 (I think)
	randRead, _ := rand.Read([]byte("Hello world")) // len(bytes)

	fmt.Println("crypto.rand.Int: ", randInt)
	fmt.Println("crypto.rand.Prime: ", randPrime)
	fmt.Println("crypto.rand.Read: ", randRead)
}

func basicCryptoRsa() {
	// Generate key
	key, err := rsa.GenerateKey(rand.Reader, 1024) // 2048-bit key is recommended
	if err != nil {
		panic(err)
	}
	publicKey := key.PublicKey

	// ---
	// Encryption/Decryption
	// ---

	// Public key encrypts
	// Private key decrypts

	// Encrypt using public key
	encryptedBytes, err := rsa.EncryptOAEP(
		sha256.New(),
		rand.Reader,
		&publicKey,
		[]byte("The owner of the white sedan you left your lights on"),
		nil,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("crypto/rsa encrypt result:", encryptedBytes)

	// Decrypt using private key
	decryptedBytes, err := key.Decrypt(
		nil,
		encryptedBytes,
		&rsa.OAEPOptions{Hash: crypto.SHA256},
	)
	if err != nil {
		panic(err)
	}

	fmt.Println("crypto/rsa decrypt result:", string(decryptedBytes))

	// ---
	// rsa verification (Signing/Verification)
	// ---

	// Ensures message came from the party who issued the public key
	// Verification requires data, signature, public key (data & signature must match)

	// Hash message
	msg := []byte("verifiable message")
	msgHash := sha256.New()
	_, err = msgHash.Write(msg)
	if err != nil {
		panic(err)
	}
	msgHashSum := msgHash.Sum(nil)

	// Get signature
	signature, err := rsa.SignPSS(rand.Reader, key, crypto.SHA256, msgHashSum, nil)
	if err != nil {
		panic(err)
	}

	// Verify signature
	err = rsa.VerifyPSS(&publicKey, crypto.SHA256, msgHashSum, signature, nil)
	if err != nil {
		panic(err)
	}

	fmt.Println("msgHashSum: ", msgHashSum)
	fmt.Println("signature: ", signature)
	fmt.Println("crypto/rsa verification successful")
}

func basicCryptoTls() {
	// https://pkg.go.dev/crypto/tls@go1.17.8
	fmt.Println("TODO")
}

func basicEncodingBase64() {
	s := "Is mayonaise an instrument?"

	// ---
	// EncodeToString/DecodeString
	// ---

	// Encode to string
	encoded := base64.StdEncoding.EncodeToString([]byte(s))
	fmt.Println("base64.StdEncoding.EncodeToString:", encoded)

	// Decode to []byte
	decoded, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		panic(err)
	}
	fmt.Println("base64.StdEncoding.DecodeString:", string(decoded))

	// ---
	// NewEncoder/NewDecoder
	// ---

	// Encode to []byte
	encodedBuffer := bytes.Buffer{}
	encoder := base64.NewEncoder(base64.StdEncoding, &encodedBuffer)
	encoder.Write([]byte(s))
	encoder.Close()
	fmt.Println("base64.NewEncoder encoded:", encodedBuffer.String())

	// Decode to []byte
	r := bytes.NewReader(encodedBuffer.Bytes())
	decoder := base64.NewDecoder(base64.StdEncoding, r)
	decodedBytes, err := ioutil.ReadAll(decoder)
	if err != nil {
		panic(err)
	}
	fmt.Println("base64.NewEncoder decoded:", string(decodedBytes))
}

func basicEncodingCsv() {
	type Ninja struct {
		FirstName string
		LastName  string
		Age       int
	}
	data := "first_name,last_name,age\nKakashi,Hatake,27\nIruka,Umino,25\nYamato,Tenzo,26\n"
	r := csv.NewReader(strings.NewReader(data))
	result := []Ninja{}

	// Convert to [][]string
	lines, err := r.ReadAll()
	if err != nil {
		panic(err)
	}

	// []string to struct
	for i, record := range lines {
		if i == 0 {
			continue
		}
		age, err := strconv.Atoi(record[2])
		if err != nil {
			panic(err)
		}
		result = append(result, Ninja{
			FirstName: record[0],
			LastName:  record[1],
			Age:       age,
		})
	}

	// Print []struct
	bytes, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println("encoding/csv result:", string(bytes))
}

func basicEncodingJson() {
	// struct
	type Person struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	// struct -> []byte
	bytes, _ := json.Marshal(Person{
		FirstName: "Kakashi",
		LastName:  "Hatake",
	})

	// []byte -> struct
	var person Person
	err := json.Unmarshal(bytes, &person)
	if err != nil {
		fmt.Println("Error while parsing")
	}

	// print struct
	fmt.Printf("%+v", person)

	// pretty print
	formattedBytes, _ := json.MarshalIndent(Person{
		FirstName: "Kakashi",
		LastName:  "Hatake",
	}, "", "  ")
	fmt.Printf("%s", formattedBytes)

	// valid json
	isValid := json.Valid(formattedBytes) // boolean
	fmt.Println("isValid", isValid)
}

func basicErrors() {
	// https://golang.org/pkg/errors/
	fmt.Println("TODO")
}

func basicFilepath() {
	fp := "client/build/index.html"
	// Base
	base := filepath.Base(fp) // string
	// Dir
	dir := filepath.Dir(fp) // string
	// Ext
	ext := filepath.Ext(fp) // string
	// IsAbs
	isAbs := filepath.IsAbs(fp) // boolean
	// Join
	cwd, _ := os.Getwd()                        // string, error
	joinedPath := filepath.Join(cwd, "main.go") // string
	// Match
	match, _ := filepath.Match("*.html", "index.html") // boolean, error
	// Split
	d, fn := filepath.Split(fp)

	fmt.Println("filepath.Base", base)
	fmt.Println("filepath.Dir", dir)
	fmt.Println("filepath.Ext", ext)
	fmt.Println("filepath.IsAbs", isAbs)
	fmt.Println("os.Getwd", cwd)
	fmt.Println("filepath.Join", joinedPath)
	fmt.Println("filepath.Match", match)
	fmt.Println("filepath.Split", d, fn)

	fmt.Println("filepath.Walk")
	filepath.Walk("./", func(path string, info os.FileInfo, err error) error {
		fmt.Println(path) // recursively print fp
		return nil
	})
}

func basicFmt() {
	// format verbs
	// %s -- string
	// %v -- default value
	// %+v -- struct with field names
	// %#v -- golang representation
	// %T -- golang type
	// %d -- integer (base 10)
	// %f -- floating point
	// %e -- floating point (decimal notation)

	// Println
	fmt.Println("Hello world!") // print string
	// Sprintf
	name := "Kakashi"
	greeting := fmt.Sprintf("Hello %s!", name)
	fmt.Println(greeting)
	// Printf
	firstName := "Itachi"
	fmt.Printf("Hello %s!", firstName)
}

func basicIO() {
	// Don't use this, use os
}

func basicLog() {
	/*
		// Fatal -- Print() + os.Exit(1)
		log.Fatal("Error!")
		// Fatalf -- Printf() + os.Exit(1)
		log.Fatalf("Error occured at %v", time.Now())
		// Fatalln -- Println() + os.Exit(1)
		log.Fatalln("Error!")
	*/

	// Println
	log.Println("Hello World!")
	// Printf
	firstName := "Itachi"
	log.Printf("Hello %s!", firstName)
}

func basicMath() {
	// round
	round := func(n float64, p int) float64 {
		// move decimal place, round to int, move decimal place back
		a := math.Pow10(p)
		return math.Round(n*a) / a
	}

	// constants
	e := math.E
	pi := math.Pi
	phi := math.Phi
	// math
	abs := math.Abs(-1)         // 1
	ceil := math.Ceil(0.95)     // 1
	floor := math.Floor(1.05)   // 1
	rounded := math.Round(1.65) // 2
	// exp
	cbrt := math.Cbrt(27)  // 3
	exp := math.Exp(-1)    // 1/e
	pow := math.Pow(2, 3)  // 2**3
	pow10 := math.Pow10(3) // 10**3
	// log
	ln := math.Log(math.E) // 1
	log := math.Log10(10)  // 1
	// max/min
	max := math.Max(2, 3) // 3
	min := math.Min(2, 3) // 2
	// trig
	sin := math.Sin(pi / 2)         // 1
	cos := math.Cos(0)              // 1
	tan := math.Tan(pi / 4)         // 1
	csc := 1 / math.Sin(pi/2)       // 1
	sec := 1 / math.Cos(pi/2)       // 1
	cot := 1 / math.Tan(pi/4)       // 1
	asin := math.Asin(1)            // pi/2
	acos := math.Acos(0)            // pi/2
	atan := math.Atan(math.Inf(+1)) // pi/2

	fmt.Println("constants")
	fmt.Println("e", round(e, 2))
	fmt.Println("pi", round(pi, 2))
	fmt.Println("phi", round(phi, 2))

	fmt.Println("rounding")
	fmt.Println("abs", abs)
	fmt.Println("ceil", ceil)
	fmt.Println("floor", floor)
	fmt.Println("rounded", rounded)

	fmt.Println("exp")
	fmt.Println("cbrt", cbrt)
	fmt.Println("exp", exp)
	fmt.Println("pow", pow)
	fmt.Println("pow10", pow10)

	fmt.Println("log")
	fmt.Println("ln", ln)
	fmt.Println("log", log)

	fmt.Println("max/min")
	fmt.Println("max", max)
	fmt.Println("min", min)

	fmt.Println("trig")
	fmt.Println("sin", round(sin, 2))
	fmt.Println("cos", round(cos, 2))
	fmt.Println("tan", round(tan, 2))
	fmt.Println("csc", round(csc, 2))
	fmt.Println("sec", round(sec, 2))
	fmt.Println("cot", round(cot, 2))
	fmt.Println("asin", round(asin, 2))
	fmt.Println("acos", round(acos, 2))
	fmt.Println("atan", round(atan, 2))
}

func basicMathRand() {
	f32 := mathrand.Float32()
	f64 := mathrand.Float64()
	i := mathrand.Int()
	intn := mathrand.Intn(100)
	sliceInt := mathrand.Perm(5)
	read, _ := mathrand.Read([]byte("Did you try W for Wambo?"))
	ui32 := mathrand.Uint32()
	ui64 := mathrand.Uint64()

	shuffled := []int{1, 2, 3, 4, 5}
	mathrand.Shuffle(len(shuffled), func(i, j int) {
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	})

	fmt.Println("math/rand Float32:", f32)
	fmt.Println("math/rand Float64:", f64)
	fmt.Println("math/rand Int:", i)
	fmt.Println("math/rand Intn:", intn)
	fmt.Println("math/rand Perm:", sliceInt)
	fmt.Println("math/rand Read:", read)
	fmt.Println("math/rand Shuffle:", shuffled)
	fmt.Println("math/rand Uint32:", ui32)
	fmt.Println("math/rand Uint64:", ui64)
}

func basicNetHttpGet() {
	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make request
	url := "https://jsonplaceholder.typicode.com/users/1"
	res, err := http.Get(url) // struct -- Status, StatusCode, Content-Type, Body
	if err != nil {
		log.Println(err)
		return
	}

	// get body
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body) // []byte
	if err != nil {
		log.Println(err)
		return
	}

	// unmarshal body
	var user User
	if err = json.Unmarshal(body, &user); err != nil {
		log.Println(err)
		return
	}

	fmt.Println("user", fmt.Sprintf("%+v", user))
}

func basicNetHttpPost() {
	type User struct {
		Id   int    `json:"id"`
		Name string `json:"name"`
	}

	// make request
	url := "https://jsonplaceholder.typicode.com/users"
	contentType := "application/json"
	postBody, err := json.Marshal(User{
		Id:   3,
		Name: "Hiruzen Sarutobi",
	})
	if err != nil {
		log.Println(err)
		return
	}
	data := bytes.NewBuffer(postBody)
	res, err := http.Post(url, contentType, data) // struct -- Status, StatusCode, Content-Type, Body
	if err != nil {
		log.Println(err)
		return
	}

	// get body
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body) // []byte
	if err != nil {
		log.Println(err)
		return
	}

	// unmarshal body
	var user User
	if err = json.Unmarshal(body, &user); err != nil {
		log.Println(err)
		return
	}

	fmt.Println("user", fmt.Sprintf("%+v", user))
}

func basicOs() {
	/*
	   // Chdir
	   os.Chdir("../")

	   // Chmod
	   _ = os.Chmod("main.go", 0777) // chmod 777 main.go

	   // Clearenv
	   os.Clearenv() // clear env vars

	   // Exit
	   os.Exit(1) // exit with error

	   // Mkdir
	   _ = os.Mkdir("dir1", os.ModeDir) // (path string, perm FileMode) => error

	   // NewSyscallError
	   // ***

	   // Remove
	   _ = os.Remove("file.txt") // remove file or empty dir

	   // RemoveAll
	   _ = os.RemoveAll("dir1") // recursively remove until done or error

	   // Rename
	   _ = os.Rename("dir1", "dir2")

	   // Setenv
	   _ = os.Setenv("hello", "world") // hello=world

	   // Unsetenv
	   _ = os.Unsetenv("hello")
	*/

	// Getwd
	cwd, _ := os.Getwd()
	// Environ
	envVars := os.Environ() // []string ("key=value")
	// Getenv
	home := os.Getenv("HOME") // get value of env var
	// Getpid
	pid := os.Getpid() // int (pid of caller)
	// Hostname
	host, _ := os.Hostname()
	// LookupEnv
	user, found := os.LookupEnv("USER")
	// UserHomeDir
	homeDir, _ := os.UserHomeDir()

	fmt.Println("os.Getwd", cwd)
	fmt.Println("len(os.Environ())", len(envVars))
	fmt.Println("os.Getenv", home)
	fmt.Println("os.GetPid", pid)
	fmt.Println("os.Hostname", host)
	fmt.Println("os.LookupEnv", user, found)
	fmt.Println("os.UserHomeDir", homeDir)
}

func basicOsRead() {
	// Write file
	fn := "my-encrypted-file.txt"
	contents := []byte("I'm always going to be there for you, even if it's only as an obstacle for you to overcome")
	if err := os.WriteFile(fn, contents, 0777); err != nil {
		panic(err)
	}

	// Read from file
	contents, err := os.ReadFile(fn)
	if err != nil {
		panic(err)
	}

	fmt.Println("os.ReadFile contents:", contents)

	fileMetas, err := os.ReadDir(".")
	if err != nil {
		panic(err)
	}
	for i, meta := range fileMetas {
		name := meta.Name()
		info, err := meta.Info()
		size := info.Size()
		isDir := info.IsDir()
		if err != nil {
			panic(err)
		}
		fmt.Println("os.ReadDir:", i)
		fmt.Println("name:", name)
		fmt.Println("size:", size)
		fmt.Println("isDir:", isDir)
	}

	// Cleanup
	if err = os.Remove(fn); err != nil {
		fmt.Println("Could not remove file " + fn)
	}
}

func basicOsFile() {
	var f *os.File
	fn := "my-example-file.txt"

	// Create (will overwrite!)
	f, _ = os.Create(fn) // create/open
	name := f.Name()     // get name
	f.Close()            // close

	// Write
	f, _ = os.OpenFile(fn, os.O_WRONLY, os.ModePerm)
	content := []byte("You focus on the trivial, and lose sight of what is most important, change is impossible in this fog of ignorance.") // content to write
	n, _ := f.Write(content)
	f.Close()

	// Read
	f, _ = os.Open(fn)       // open file
	b := make([]byte, n)     // receiver for read
	f.Read(b)                // read open file
	readContent := string(b) // []byte -> string
	f.Close()                // close file

	// Remove
	os.Remove(fn) // remove file or empty dir

	fmt.Println("os.File.Name", name)
	fmt.Println("os.File.Read", readContent)
}

func basicOsExec() {
	// Command as slice
	c := []string{"ls", "-a"}

	// exec.Cmd
	command := exec.Command(c[0], c[1:]...)
	b, err := command.Output()
	if err != nil {
		panic(err)
	}

	// Output
	output := strings.Split(string(b), "\n")

	fmt.Println("command", strings.Join(c, " "))
	fmt.Println("command output", output)
}

func basicPath() {
	// always uses slashes
	base := path.Base("./a/b/c")           // c
	cleaned := path.Clean("./a/b/../b/c")  // a/b/c
	dir := path.Dir("./a/b/c")             // a/b
	ext := path.Ext("./a/b/c.txt")         // .txt
	isAbs := path.IsAbs("./a/b/c")         // false
	joined := path.Join(".", "a", "", "b") // a/b
	d, fn := path.Split("./a/b/c.txt")     // ./a/b/, c.txt

	fmt.Println("path.Base", base)
	fmt.Println("path.Clean", cleaned)
	fmt.Println("path.Dir", dir)
	fmt.Println("path.Ext", ext)
	fmt.Println("path.IsAbs", isAbs)
	fmt.Println("path.Join", joined)
	fmt.Println("path.Split", d, fn)
}

func basicPathFilepath() {
	// os specific behavior ("/", "\")
	abs, _ := filepath.Abs("./a/b/c")              // absolute path
	base := filepath.Base("./a/b/c")               // c
	cleaned := filepath.Clean("./a/b/../b/c")      // a/b/c
	dir := filepath.Dir("./a/b/c")                 // a/b
	ext := filepath.Ext("./a/b/c.txt")             // .txt
	glob, _ := filepath.Glob("*.go")               // .txt
	isAbs := filepath.IsAbs("./a/b/c")             // false
	joined := filepath.Join(".", "a", "", "b")     // a/b
	rel, _ := filepath.Rel("/a", "/b/c")           // ../b/c
	d, fn := filepath.Split("./a/b/c.txt")         // ./a/b/, c.txt
	paths := filepath.SplitList("/a/b/c:/usr/bin") // []string{"a/b/c" "/usr/bin"}

	fmt.Println("filepath.Abs", abs)
	fmt.Println("filepath.Base", base)
	fmt.Println("filepath.Clean", cleaned)
	fmt.Println("filepath.Dir", dir)
	fmt.Println("filepath.Ext", ext)
	fmt.Println("filepath.Glob", glob)
	fmt.Println("filepath.IsAbs", isAbs)
	fmt.Println("filepath.Join", joined)
	fmt.Println("filepath.Rel", rel)
	fmt.Println("filepath.Split", d, fn)
	fmt.Println("filepath.SplitPaths", paths)

	// also Walk, WalkDir
}

func basicReflect() {
	// TODO
	// https://pkg.go.dev/reflect@go1.17.8
}

func basicRegexp() {
	// https://golang.org/pkg/regexp/
	fmt.Println("TODO")
}

func basicRuntime() {
	os := runtime.GOOS
	arch := runtime.GOARCH
	cpus := runtime.NumCPU()
	version := runtime.Version()

	fmt.Println("os: ", os)
	fmt.Println("arch: ", arch)
	fmt.Println("cpus: ", cpus)
	fmt.Println("version: ", version)
}

func basicSort() {
	// Float64s
	floats := []float64{5.2, -1.3, 0.7, -3.8, 2.6}
	sort.Float64s(floats)

	// Ints
	ints := []int{3, 2, 5, 4, 1}
	sort.Ints(ints)

	// Strings (case sensitive)
	strings := []string{"Kakashi", "Obito", "Itachi", "Hashirama"}
	sort.Strings(strings)

	// SliceStable
	s := []int{3, 2, 5, 4, 1}
	sort.SliceStable(s, func(i, j int) bool { return s[i] < s[j] })

	// Reverse
	letters := []string{"b", "c", "e", "a", "d"}
	sort.Sort(sort.Reverse(sort.StringSlice(letters)))

	// Sort slice of structs
	// TODO

	fmt.Println("floats", floats)
	fmt.Println("ints", ints)
	fmt.Println("strings", strings)
	fmt.Println("letters", letters)
	fmt.Println("s", s)
}

func basicStrconv() {
	shorthandStringToInt, _ := strconv.Atoi("100")
	shorthandIntToString := strconv.Itoa(100)

	stringToBool, _ := strconv.ParseBool("true")
	stringToFloat, _ := strconv.ParseFloat("3.1415", 64)
	stringToInt, _ := strconv.ParseInt("100", 10, 64)
	strintToUint, _ := strconv.ParseUint("100", 10, 64)

	boolToString := strconv.FormatBool(true)
	floatToString := strconv.FormatFloat(3.1415, 'g', 2, 32)
	intToString := strconv.FormatInt(100, 10)
	uintToString := strconv.FormatUint(100, 10)

	fmt.Println("strconv.Atoi", shorthandStringToInt)
	fmt.Println("strconv.Itoa", shorthandIntToString)
	fmt.Println("strconv.ParseBool", stringToBool)
	fmt.Println("strconv.ParseFloat", stringToFloat)
	fmt.Println("strconv.ParseInt", stringToInt)
	fmt.Println("strconv.ParseUint", strintToUint)
	fmt.Println("strconv.FormatBool", boolToString)
	fmt.Println("strconv.FormatFloat", floatToString)
	fmt.Println("strconv.FormatInt", intToString)
	fmt.Println("strconv.FormatUint", uintToString)
}

func basicStrings() {
	// Compare -- just use comparison operators (==, <, >, etc)
	comparison := strings.Compare("Kakashi", "Obito") // -1, 0, or 1
	// Contains
	containsSubstring := strings.Contains("Kakashi", "Kaka") // boolean
	// ContainsAny
	containsAnyChars := strings.ContainsAny("Kakashi", "ak") // boolean
	// HasPrefix
	hasPrefix := strings.HasPrefix("Kakashi", "Kaka") // boolean
	// HasSuffix
	hasSuffix := strings.HasSuffix("Kakashi", "hi") // boolean
	// Index (also LastIndex)
	indexFound := strings.Index("Kakashi", "hi") // int (-1 if not found)
	// IndexAny (also LastIndexAny)
	indexOfAny := strings.IndexAny("Kakashi", "ka") // int (-1 if none found)
	// Join
	joinedStringSlice := strings.Join([]string{"Kakashi", "Hashirama"}, ", ") // string
	// Replace
	replacedOnce := strings.Replace("kakashi", "k", "K", 1) // string
	// ReplaceAll
	replacedAll := strings.ReplaceAll("KAkAshi HAtAke", "A", "a") // string
	// Split
	stringSlice := strings.Split("Kakashi, Yamato, Hashirama, Iruka", ", ") // []string
	// Title
	titleCase := strings.Title("kakashi") // string
	// ToLower
	lowerCase := strings.ToLower("Kakashi") // string
	// ToUpper
	upperCase := strings.ToUpper("kakashi") // string
	// Trim (also TrimLeft, TrimRight)
	trimmed := strings.Trim("   Kakashi   ", " ") // string

	fmt.Println("Compare", comparison)
	fmt.Println("Contains", containsSubstring)
	fmt.Println("ContainsAny", containsAnyChars)
	fmt.Println("HasPrefix", hasPrefix)
	fmt.Println("HasSuffix", hasSuffix)
	fmt.Println("Index", indexFound)
	fmt.Println("IndexAny", indexOfAny)
	fmt.Println("Join", joinedStringSlice)
	fmt.Println("Replace", replacedOnce)
	fmt.Println("ReplaceAll", replacedAll)
	fmt.Println("Split", stringSlice)
	fmt.Println("Title", titleCase)
	fmt.Println("ToLower", lowerCase)
	fmt.Println("ToUpper", upperCase)
	fmt.Println("Trim", trimmed)
}

func basicTime() {
	// Date
	date := time.Date(2020, 10, 11, 12, 0, 0, 0, time.UTC)
	// Now
	now := time.Now()
	// Hour (Nanosecond, Second, Minute, Hour, Day, Weekday, Month, Year, YearDay)
	hour := time.Now().Hour()
	// Since
	beginning := time.Now()
	sinceDuration := time.Since(beginning) // duration
	// Until
	untilDuration := time.Until(time.Now().Add(time.Hour)) // duration
	// ParseDuration
	parsedDuration, _ := time.ParseDuration("4h30m")
	// Hours (also Nanoseconds, Microseconds, Milliseconds, Seconds, Minutes)
	hours := parsedDuration.Hours()
	// Add (time.Second, time.Minute, time.Hour)
	tomorrow := time.Now().Add(time.Hour * 24) // add time to a date
	// Sub
	start := time.Now()
	end := time.Now()
	difference := end.Sub(start) // difference between dates
	// AddDate
	newDate := time.Now().AddDate(3, 2, 1) // add 3 years, 2 months, 1 day
	// Before
	before := time.Now().Before(time.Now().Add(time.Hour)) // now is before now + 1hr
	// After
	after := time.Now().After(time.Now().Add(time.Hour * -1)) // now is after now - 1hr
	// Format
	formattedDate := time.Now().Format(time.RFC3339)
	// In
	timeSomewhereElse := time.Now().In(time.UTC)
	// Unix
	dateFromUnixTimestamp := time.Unix(1602745919, 0) // (s, ns) => date
	// Round
	pd, _ := time.ParseDuration("1h15m10s")
	roundedDuration := pd.Round(time.Minute)

	fmt.Println("time.Date", date)
	fmt.Println("time.Now", now)
	fmt.Println("time.Time.Hour", hour)
	fmt.Println("time.Since", sinceDuration)
	fmt.Println("time.Until", untilDuration)
	fmt.Println("time.ParseDuration", parsedDuration)
	fmt.Println("time.Duration.Hours", hours)
	fmt.Println("time.Time.Add", tomorrow)
	fmt.Println("time.Time.Sub", difference)
	fmt.Println("time.Time.AddDate", newDate)
	fmt.Println("time.Time.Before", before)
	fmt.Println("time.Time.After", after)
	fmt.Println("time.Time.Format", formattedDate)
	fmt.Println("time.Time.In", timeSomewhereElse)
	fmt.Println("time.Unix", dateFromUnixTimestamp)
	fmt.Println("time.Duration.Round", roundedDuration)
}

func basicTesting() {
	// https://golang.org/pkg/testing/
	fmt.Println("TODO")
}
