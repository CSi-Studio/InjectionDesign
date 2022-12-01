import {BaseService} from "@/services/BaseService";
import {Config} from "@/domains/Config.d";

export default class ConfigService extends BaseService<Config>{
  getDomain(): string {
    return "config";
  }

  beforeAdd(): any {
  }
}
