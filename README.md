# har-to-server

将 HAR 文件转换为 HTTP 服务器，以便在本地进行调试和测试。

## 使用方法

```shell
Usage: har-to-server [options] [directory]

Options:
  --port <port>  服务端口 (default: "3000")
  --docs <docs>  接口文档地址 (default: "/docs")
```

示例

```shell
# 将当前目录下的 har 文件转换为 HTTP 服务器
har-to-server <Har Directory path>

# 将当前目录下的 har 文件转换为 HTTP 服务器，并指定端口为 8080
har-to-server --port 8080 <Har Directory path>

# 将当前目录下的 har 文件转换为 HTTP 服务器，并指定接口文档地址为 /api/docs
har-to-server --docs /api/docs <Har Directory path>
```

## 配置项

### port

服务端口，默认 3000

### docs

接口文档地址，默认`/docs`

## 开发

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## License

MIT
