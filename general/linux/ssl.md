# SSL

- file types explained
  - https://crypto.stackexchange.com/a/43700

- key -- private key to a certificate
- crt -- signed certificate

## Generate key (linux)

```bash
# generate rsa key (ssh-keygen) (.key)
ssh-keygen -t <cryptosystem> -b <key-size-bits> -f <key-path>
# example
ssh-keygen -t rsa -b 4096 -f "./self.key"
```

## Generate pem (linux)

- generate rsa key (openssl) (public and private) (.pem)
  - generate rsa key
  - export rsa public key to file

```bash
openssl genrsa -des3 -out private.pem 4096
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

## Generate pem (key & crt)

## Produces two files

    # cert.pem -- crt
    # key.pem -- key

```bash
openssl genrsa -out key.pem 4096
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```
