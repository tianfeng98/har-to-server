export type Handler = (request: Request) => Response | Promise<Response>;

export interface RouteOptions {
  key?: string;
}

export class Route {
  key: string;
  public method: string;
  public urlObj: URL;
  public handler: Handler;
  constructor(
    method: string,
    urlObj: URL,
    handler: Handler,
    options?: RouteOptions
  ) {
    if (options?.key) {
      this.key = options.key;
    } else {
      this.key = `${method} ${urlObj.pathname}`;
      if (urlObj.search) {
        this.key += `?${urlObj.search}`;
      }
    }
    this.method = method;
    this.urlObj = urlObj;
    this.handler = handler;
  }

  getData() {
    return {
      key: this.key,
      method: this.method,
      pathname: this.urlObj.pathname,
      search: this.urlObj.search,
    };
  }
}
