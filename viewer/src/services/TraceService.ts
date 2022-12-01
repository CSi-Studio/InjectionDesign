import {BaseService} from "@/services/BaseService";
import {Trace} from "@/domains/Trace.d";

export default class TraceService extends BaseService<Trace>{
  getDomain(): string {
    return "trace";
  }

  beforeAdd(): any {
  }
}
