import {BaseService} from "@/services/BaseService";
import {SampleProcess} from "@/domains/Sample.d";

export default class ProcessOrderService extends BaseService<SampleProcess>{
  getDomain(): string {
    return "sampleProcess";
  }

  beforeAdd(): any {
  }
}
