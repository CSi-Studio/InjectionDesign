import type { Key } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Pagination, Result } from '@/domains/Common';
import { buildColumn } from '@/pages/run/Manager/Column';
import { Dropdown, Menu, message, Button } from 'antd';
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import type { Run } from '@/domains/Run.d';
import type { ProFormInstance } from '@ant-design/pro-form';
import {history} from "@umijs/max";
import {FormattedMessage} from "@@/exports";
import {RunTemplate} from "@/domains/RunTemplate.d";
import RunTemplateService from "@/services/RunTemplateService";

const TableList: React.FC = (props: any) => {
  const service = new RunTemplateService();

  //全局引用区域
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const updateFormRef = useRef<ProFormInstance>();

  //全局变量区域
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [total, setTotal] = useState<any>(); //数据总行数
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const [projectId, setProjectId] = useState<string>(props?.location?.query?.projectId); //所属项目

  useEffect(() => {}, []);

  function buildToolbar(): any {
    return {
      actions: [
        <Button type="primary"
          onClick={()=>{
            history.push("/run/manager")
          }}
        >
          <PlusOutlined /><FormattedMessage id='run.template.create'/>
        </Button>,
        <Dropdown
          key="remove"
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={doRemove}>
                <FormattedMessage id='run.delete'/>
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            <FormattedMessage id='run.template.delete'/>
            <DownOutlined style={{ marginLeft: 8 }} />
          </Button>
        </Dropdown>,
      ],
    };
  }

  async function doList(
    params: { pageSize: number; current: number } & any,
  ): Promise<Result<RunTemplate[]>> {
    setProjectId(projectId);
    const result = await service.list({ ...params, projectId });
    setTotal(result.total);
    return Promise.resolve(result);
  }

  async function doUpdate(values: Run): Promise<boolean> {
    setLoading(true);
    // await service.update(values);
    tableRef?.current?.reload();
    message.success('更新成功');
    setLoading(false);
    return true;
  }

  async function doRemove(): Promise<boolean> {
    if (selectedRowKeys.length == 0) {
      message.warn('请选择一个进样');
      return false;
    }
    setLoading(true);
    await service.remove(selectedRowKeys);
    message.success('删除成功');
    tableRef?.current?.reload();
    setLoading(false);
    return true;
  }

  return (
    <>
      <ProTable<RunTemplate, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle={<FormattedMessage id='run.template.title'/>}
        actionRef={tableRef}
        rowKey="id"
        loading={loading}
        size="middle"
        toolbar={buildToolbar()}
        search={{ labelWidth: 120 }}
        tableAlertRender={false}
        pagination={{
          total,
        }}
        request={doList}
        columns={buildColumn(updateFormRef, doUpdate)}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};

export default TableList;
