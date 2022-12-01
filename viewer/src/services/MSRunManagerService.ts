import {BaseService} from "@/services/BaseService";
import {MSRunManager} from "@/domains/MSRunManager.d";
import {Result} from "@/domains/Common";
import {request} from "@umijs/max";

export default class MSRunManagerService extends BaseService<MSRunManager> {
  getDomain(): string {
    return 'msRunManager';
  }

  beforeAdd(): any {
    return;
  }

  /** 列表 */
  public async submit(params: any) {
    return request<Result<any>>(`${API_URL}/${this.getDomain()}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    });
  }

}
