
function myFunctionExample() {
  let myURL = 'poophttps://www.google.com';
  let x =  UrlFetch(myURL);
  console.log(x.getResponseCode(),x.getContentText());
}

const clearHeaders = function clearHeaders(headers = {}){
    headers = headers?.headers ?? headers;
    try{
      delete headers['X-Forwarded-For']
    }catch{
      try{
        if(headers['X-Forwarded-For']){
          Object.defineProperty(headers,'X-Forwarded-For',{
            value:undefined,
            writable:true,
            configurable:true
          });
        }
      }catch{}
    }
    return headers;
};


/** 
* Creates a new HTTP response simulation. 
* @param {string} body - The response body as a string. 
* @param {Object} options - Configuration options for the response. * @return {Object} The simulated HTTP response. 
*/
class HttpResponse {
  constructor(body, options = {}) {
    Object.assign(this,{body,headers:{},status:200,...options});
    this.bodyBlob = Utilities.newBlob([...this.body??[]].map(x=>x.charCodeAt()));
  }
  getAllHeaders() {
    return this.headers;
  }
  getHeaders() {
    return this.headers;
  }
  getContent() {
    return this.bodyBlob?.getBytes?.();
  }
  getAs(type){
    return this.bodyBlob?.getAs?.(type);
  }
  getBlob(type){
    return this.bodyBlob;
  }
  getContentText(charset) {
    return charset ? this.bodyBlob.getDataAsString(charset) : this.body;
  }
  toString(){
    return this.body;
  }
  getResponseCode() {
    return this.status;
  }
};


/** 
 * Default options for http requests. 
 * Different from what google picks for defaults 
 */
const defaultOptions = {
  validateHttpsCertificates : false,
  muteHttpExceptions : true,
  escaping : false,
};

/** 
 * Wrapper for UrlFetch that handles exceptions by returning a custom error response.
 * @param {string} url - The URL to fetch. 
 * @param {Object} options - The options for the fetch operation. 
 * @return {Object} The response object, either from the fetch or an error response. 
 */
globalThis.UrlFetch = function UrlFetch(url, options) {
    const requestOptions = {...defaultOptions, ...options};
    try {
      const response = UrlFetchApp.fetch(String(url), requestOptions);
      const status = response.getResponseCode();
      if(requestOptions.muteHttpExceptions == false
        &&(status  >= 400 || status <= 0 || !status)){
        throw new Error(`Fetch error ${status}`);
      }
      return res;
    } catch (e) {
      if(requestOptions.muteHttpExceptions == false){
        throw e;
      }
      return new HttpResponse(`500 ${e.message}`, {
        status: 500
      });
    }
};

 class HttpRequest{
  constructor(url, options = {}) {
    const allOptions = {...defaultOptions, ...options};
    try{
      Object.assign(this,{...UrlFetchApp.getRequest(String(url), allOptions),...allOptions});
    }catch{
      Object.assign(this,{...UrlFetchApp.getRequest('https://www.google.com',allOptions),...allOptions,url});
    }
    clearHeaders(this);
  }
};
  
const defaultEvent = { 
  queryString: '',
  parameter: {},
  parameters: {},
  pathInfo: '',
  contextPath: '',
  postData: {
     contents: '', 
     length: 0, 
     type: 'text/plain', 
     name: 'postData' 
  },
  contentLength: 0 
};

class HttpEvent{
  constructor(e = {}){
    Object.assign(this,{...defaultEvent, ...e});
  }
};


