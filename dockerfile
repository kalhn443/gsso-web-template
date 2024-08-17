FROM golang:1.21 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=amd64
ENV CC=gcc
ENV CXX=g++

# ตั้งค่า CFLAGS และ LDFLAGS เพื่อบังคับใช้ GLIBC_2.28
ENV CFLAGS="-O2 -D_FORTIFY_SOURCE=2 -fstack-protector-strong -Wformat -Werror=format-security"
ENV LDFLAGS="-Wl,-z,relro -Wl,-z,now -Wl,--wrap=memcpy -Wl,--wrap=memmove -Wl,--wrap=memset -Wl,--wrap=bcopy"

RUN go build -ldflags="-linkmode external -extldflags '-static'" -o main .

CMD ["./main"]
