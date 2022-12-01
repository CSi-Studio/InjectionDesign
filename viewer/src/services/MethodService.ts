import {BaseService} from "@/services/BaseService";
import {Method} from "@/domains/Method.d";

export default class MethodService extends BaseService<Method>{
  getDomain(): string {
    return "method";
  }

  beforeAdd(): any {
  }
}
