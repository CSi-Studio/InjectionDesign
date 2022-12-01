import type {PlatformConfig} from '@/domains/Platform.d';
import {
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
// @ts-ignore
import {Link} from 'umi';
import PlatformService from '@/services/PlatformService';
import {PlusOutlined} from '@ant-design/icons';
// @ts-ignore
import { FormattedMessage } from 'umi';
/**
 * 服务
 */
const platformService = new PlatformService();
export const ProjectFields: any = {
  id: (value: any, readonly: boolean) => (
    <ProFormText initialValue={value} readonly={readonly} width="md" name="id" label="ID"/>
  ),
  name: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      rules={[
        {
          required: true,
          message: <FormattedMessage id='project.no.format.tip.error'/>,
        },
      ]}
      width="md"
      name="name"
      label={<FormattedMessage id='project.no'/>}
      placeholder="Demo: P001_220301"
    />
  ),
  alias: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="alias"
      label={<FormattedMessage id='alias'/>}
      tooltip="Unique"
      placeholder="Please input project alias, Demo: has"
    />
  ),
  owner: (value: any, readonly: boolean) => (
    <ProFormText
      initialValue={value}
      readonly={readonly}
      width="md"
      name="owner"
      label={<FormattedMessage id='owner'/>}
      placeholder="Demo: James"
    />
  ),
  platforms: (value: any, readonly: boolean) => (
    <ProFormSelect
      initialValue={value}
      readonly={readonly}
      width="md"
      mode="multiple"
      name="platforms"
      label={<FormattedMessage id='analytical.platform'/>}
      placeholder="Please select"
      request={async () => {
        const res: any[] = [];
        const beforeAddProjectPlatform = await platformService.list({});
        //获取所有的name，并去重
        const platformName = beforeAddProjectPlatform?.data
          .map((item: { name: any }) => {
            return item.name;
          })
          .filter((item: any, index: number, arr: any[]) => {
            return arr.indexOf(item) === index;
          });
        platformName?.forEach((item: { name: any; id: any }) => {
          const temp: Record<any, any> = {};
          temp.label = item;
          temp.value = item;
          res.push(temp);
        });
        return res;
      }}
      fieldProps={{
        dropdownRender: (e) => {
          return (
            <>
              <Link
                to={{
                  pathname: '/platform',
                }}
                style={{
                  paddingLeft: '10px',
                }}
              >
                <PlusOutlined/> <FormattedMessage id='create.platform'/>
              </Link>
              {e}
            </>
          );
        },
      }}
    />
  ),
  createDate: (value: any, readonly: boolean) => (
    <ProFormDateTimePicker
      initialValue={value}
      readonly={readonly}
      width="sm"
      name="createDate"
      label={<FormattedMessage id='create.date'/>}
    />
  ),
  lastModifiedDate: (value: any, readonly: boolean) => (
    <ProFormDateTimePicker
      initialValue={value}
      readonly={readonly}
      width="sm"
      name="lastModifiedDate"
      label={<FormattedMessage id='update.date'/>}
    />
  ),
};

export type Project = {
  id: string;
  name: string;
  alias: string;
  owner: string;
  platforms: string[];
  platformMap: Map<string, PlatformConfig>;
  createDate: string;
  lastModifiedDate: string;
};
