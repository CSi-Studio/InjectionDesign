import {BaseService} from "@/services/BaseService";
import {Run} from "@/domains/Run.d";

export default class RunService extends BaseService<Run>{
  getDomain(): string {
    return "run";
  }

  beforeAdd(): any {
  }
}
