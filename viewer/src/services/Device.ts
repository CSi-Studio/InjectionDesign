import { BaseService } from '@/services/BaseService';
import type { Device } from '@/domains/Device.d';
//@ts-ignore
import { request } from 'umi';
import type { Result } from '@/domains/Common';

export default class DeviceService extends BaseService<Device> {
  getDomain(): string {
    return 'device';
  }
  /* 设备和检测平台的对应关系 */
  public async getDevicePlatforms() {
    return request<Result<Device[]>>(`${API_URL}/${this.getDomain()}/listPlatform`, {
      method: 'GET',
    });
  }

  /* 获取指定设备的平台 */
  public async getPlatforms(params: any) {
    return request<Result<Device[]>>(`${API_URL}/${this.getDomain()}/getPlatforms`, {
      method: 'GET',
      params: {
        ...params,
      },
    });
  }

  beforeAdd(): any {}

  public async upload(params: any) {
    const filedata = new FormData();
    if (params.otherMaterial) {
      filedata.append('otherMaterial', params.otherMaterial[0].originFileObj);
    }
    if (params.name){
      filedata.append('name', params.name);
    }
    if (params.owner){
      filedata.append('owner', params.owner);
    }
    if (params.deviceModel){
      filedata.append('deviceModel', params.deviceModel);
    }
    if (params.deviceType){
      filedata.append('deviceType', params.deviceType);
    }
    if (params.trainingMaterial){
      filedata.append('trainingMaterial', params.trainingMaterial[0].originFileObj);
    }
    if (params.mainParam){
      filedata.append('mainParam', params.mainParam);
    }

    return request<Result<Device>>(`${API_URL}/${this.getDomain()}/create`, {
      method: 'POST',
      requestType:'form',
      data: filedata,
    });
  }
}
