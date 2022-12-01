import {BaseService} from "@/services/BaseService";
import {Platform} from "@/domains/Platform.d";
import {request} from "@@/plugin-request/request";
import {Result} from "@/domains/Common";

export default class PlatformService extends BaseService<Platform>{
  getDomain(): string {
    return "platform";
  }

  beforeAdd(): any {
  }

  /**
   * upload
   */
  public async submit(params: any) {
    const filedata = new FormData();
    if (params.name) {
      filedata.append("name", params.name)
    }
    if (params.device) {
      filedata.append("device", params.device)
    }
    if (params.mathPath) {
      filedata.append("mathPath", params.mathPath)
    }
    if (params.msFilePath) {
      filedata.append("msFilePath", params.msFilePath)
    }
    if (params.owner) {
      filedata.append("owner", params.owner)
    }
    if (params.sopFile) {
      filedata.append("file", params.sopFile[0].originFileObj)
      filedata.append("fileName", params.sopFile[0].name)
    }
    return request<Result<boolean>>(`${API_URL}/${this.getDomain()}/add`, {
      method: 'POST',
      requestType: 'form',
      data: filedata,
    });
  }
}
