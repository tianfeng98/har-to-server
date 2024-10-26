import { type Handler, Route, type RouteOptions } from "./route";

export class Router {
  private routeMap = new Map<string, Route>();

  add(
    method: string,
    url: string,
    handler: Handler,
    options?: RouteOptions
  ): void {
    method = method.toUpperCase();
    const route = new Route(method, new URL(url), handler, options);
    this.routeMap.set(route.key, route);
  }

  getRouteByKey(key: string) {
    return this.routeMap.get(key);
  }

  getRouteByRequest(request: Request) {
    const { url, method } = request;
    const { pathname } = new URL(url);
    const res = this.getRouteList().find(
      (route) => route.pathname === pathname && route.method === method
    );
    if (res) {
      return this.getRouteByKey(res.key);
    }
  }

  getRouteList() {
    return Array.from(this.routeMap).map(([key, route]) => route.getData());
  }
}
