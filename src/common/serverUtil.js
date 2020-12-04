const resInfo = {
  // 错误
  // 5xxx
  ERR_DB_CONN: {
    code: 5000,
    msg: "服务器错误DB_CONN"
  },
  ERR_DB_INSERT: {
    code: 5001,
    msg: "服务器错误:DB_INSERT"
  },
  ERR_DB_QUERY: {
    code: 5002,
    msg: "服务器错误:DB_QUERY"
  },
  ERR_CODE_UNKNOWN: {
    code: 5003,
    msg: "服务器错误:CODE_UNKNOWN"
  },
  ERR_DB_CALL: {
    code: 5004,
    msg: "服务器错误:DB_CALL"
  },
  // 4xxx
  ERR_CLIENT_PARAM: {
    code: 4000,
    msg: "客户端参数错误"
  },
  ERR_CLIENT_UNAUTH: {
    code: 4001,
    msg: "客户端无权限"
  },
  // 成功
  // 2xxx
  SUC_OK: {
    code: 2000,
    msg: "成功"
  },
  SUC_OK_DATA: {
    code: 2001,
    msg: "成功:WITH_DATA"
  },
  // 特殊
  NOT_FOUND: {
    code: -999,
    msg: "无效的路径"
  }
};

class ServerUtil {
  constructor(env = "dev") {
    this.env = env;
    this.resInfo = resInfo;
  }

  get apiUrl() {
    return this.env == "dev"
      ? "http://127.0.0.1:3001/manager/"
      : "http://admin.xsdxs.club/manager/";
  }

  get serverUrl() {
    return this.env == "dev"
      ? "http://127.0.0.1:3001/"
      : "http://admin.xsdxs.club/";
  }

  isSuccess(code) {
    let { SUC_OK, SUC_OK_DATA } = this.resInfo;
    let sucArr = [SUC_OK.code, SUC_OK_DATA.code];
    return sucArr.indexOf(code) != -1;
  }
}

export default ServerUtil;
