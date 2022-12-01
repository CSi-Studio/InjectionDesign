import {BaseService} from "@/services/BaseService";
import { Compound } from "@/domains/Compound.d";

export default class CompoundService extends BaseService<Compound>{
  getDomain(): string {
    return "compound";
  }

  beforeAdd(): any {
  }
}
