import {BaseService} from "@/services/BaseService";
import {DeviceParts, DeviceRepair} from "@/pages/device/Column";
import {Result} from "@/domains/Common";
import {request} from "@@/plugin-request";
import {Key} from "react";

export default class DevicePartService extends BaseService<DeviceParts> {
  getDomain(): string {
    return 'deviceParts';
  }

  beforeAdd(): any {
    return;
  }

  /**
   * 添加设备零件维修记录
   */
  public async addRepair(params: any) {
    return request<Result<Boolean>>(`${API_URL}/${this.getDomain()}/addRepair`, {
      method: 'post',
      params,
    });
  }

  /**
   * 添加设备零件维修记录
   */
  public async deleteRepair(id: Key) {
    return request(`${API_URL}/${this.getDomain()}/deleteRepair`, {
      method: 'GET',
      params: {
        id
      },
    });
  }

  /**
   * 获取设备零件维修列表
   * @param params
   */
  public async getDeviceRepair(params: any) {
    return request<Result<DeviceRepair[]>>(`${API_URL}/${this.getDomain()}/getRepairList`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }
}
