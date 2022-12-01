// @ts-ignore
import { request } from 'umi';
import { url } from '@/utils/request';

export async function fakeSubmitForm(params: any) {
  return request('/api/stepForm', {
    method: 'POST',
    data: params,
  });
}

/** 使用excel 添加样本 */
export async function uploadSampleByExcel() {
  return request(`${url}/sample/upload/excel/override`, {
    method: 'post',
  });
}

/** 使用excel 添加样本 */
export async function addSample(params: { sampleNo: string; projectId: string|undefined; preOrderId: string }) {
  return request(`${url}/preorder/sample/add`, {
    method: 'post',
    data: params,
  });
}
