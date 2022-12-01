import {BaseService} from "@/services/BaseService";
import {Standard} from "@/domains/Standard.d";

export default class StandardService extends BaseService<Standard>{
  getDomain(): string {
    return "standard";
  }

  beforeAdd(): any {
  }
}
