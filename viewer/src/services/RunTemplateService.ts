import {BaseService} from "@/services/BaseService";
import {RunTemplate} from "@/domains/RunTemplate.d";
import {request} from "@@/plugin-request";
import {Result} from "@/domains/Common";
import {Key} from "react";

export default class RunTemplateService extends BaseService<RunTemplate> {
  getDomain(): string {
    return 'runTemplate';
  }

  beforeAdd(): any {
    return;
  }

  public async submit(params: any) {
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/add`, {
      method: 'post',
      data:params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**  GET  */
  public async getByName(name: Key) {
    return request(`${API_URL}/${this.getDomain()}/getByName`, {
      method: 'GET',
      params: {
        name
      },
    });
  }
}
