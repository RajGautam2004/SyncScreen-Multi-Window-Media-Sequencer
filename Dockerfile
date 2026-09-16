# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server

# Stage 2: Minimal runtime image
FROM alpine:latest

WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env . 

# Render injects PORT dynamically
EXPOSE 8080

CMD ["./main"]
