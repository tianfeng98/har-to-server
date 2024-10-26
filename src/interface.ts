export interface Har {
  log: Log;
}

interface Log {
  version: string;
  creator: Creator;
  pages: Page[];
  entries: Entry[];
}

interface Entry {
  _initiator: Initiator;
  _priority: string;
  _resourceType: string;
  cache: Cache;
  connection: string;
  pageref?: string;
  request: Request;
  response: Response;
  serverIPAddress: string;
  startedDateTime: string;
  time: number;
  timings: Timings;
}

interface Timings {
  blocked: number;
  dns: number;
  ssl: number;
  connect: number;
  send: number;
  wait: number;
  receive: number;
  _blocked_queueing: number;
  _workerStart: number;
  _workerReady: number;
  _workerFetchStart: number;
  _workerRespondWithSettled: number;
}

interface Response {
  status: number;
  statusText: string;
  httpVersion: string;
  headers: Header[];
  cookies: any[];
  content: Content;
  redirectURL: string;
  headersSize: number;
  bodySize: number;
  _transferSize: number;
  _error: null | string;
  _fetchedViaServiceWorker: boolean;
}

interface Content {
  size: number;
  mimeType: string;
  compression?: number;
  text?: string;
}

interface Request {
  method: string;
  url: string;
  httpVersion: string;
  headers: Header[];
  queryString: Header[];
  cookies: Cooky[];
  headersSize: number;
  bodySize: number;
  postData?: PostData;
}

interface PostData {
  mimeType: string;
  text: string;
}

interface Cooky {
  name: string;
  value: string;
  path: string;
  domain: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

interface Header {
  name: string;
  value: string;
}

interface Cache {}

interface Initiator {
  type: string;
  stack: Stack;
}

interface Stack {
  callFrames: CallFrame[];
  parent?: Parent5;
  parentId?: ParentId;
}

interface Parent5 {
  description: string;
  callFrames: CallFrame[];
  parent?: Parent4;
  parentId?: ParentId;
}

interface ParentId {
  id: string;
  debuggerId: string;
}

interface Parent4 {
  description: string;
  callFrames: CallFrame[];
  parent?: Parent3;
}

interface Parent3 {
  description: string;
  callFrames: CallFrame[];
  parent?: Parent2;
}

interface Parent2 {
  description: string;
  callFrames: CallFrame[];
  parent?: Parent;
}

interface Parent {
  description: string;
  callFrames: CallFrame[];
}

interface CallFrame {
  functionName: string;
  scriptId: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
}

interface Page {
  startedDateTime: string;
  id: string;
  title: string;
  pageTimings: PageTimings;
}

interface PageTimings {
  onContentLoad: number;
  onLoad: number;
}

interface Creator {
  name: string;
  version: string;
}
