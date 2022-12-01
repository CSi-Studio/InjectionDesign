import {CloseCircleOutlined} from '@ant-design/icons';
import {Card, Col, Popover, Row, message, Transfer, Table, Switch, Tag} from 'antd';

import type {FC} from 'react';
//@ts-ignore
import React, {useState} from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import {PageContainer, FooterToolbar} from '@ant-design/pro-layout';
import styles from './style.less';
import ProjectService from "@/services/ProjectService";
import DeviceService from "@/services/Device";
import {ProFormDependency, ProFormTreeSelect} from "@ant-design/pro-components";
import PreOrderService from "@/services/PreOrderService";
import RunTemplateService from "@/services/RunTemplateService";
import {TransferProps} from "antd/es";
import {TransferItem} from "antd/es/transfer";
import {ColumnsType} from "antd/es/table";
import {TableRowSelection} from "antd/es/table/interface";
import {difference} from "lodash";
import MSRunManagerService from "@/services/MSRunManagerService";

type InternalNamePath = (string | number)[];

const fieldLabels = {
  name: '任务名称',
  url: '仓库域名',
  owner: '负责人',
  device: "设备",
  platform: "检测平台",
  boardType: "进样孔板",
  project: "项目",
  sample: "进样样本选择",
  runTemplate: "进样模板选择"
};

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  }
];

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}


/**************
 *  穿梭框
 * ************
 */
interface RecordType {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
  tag: string;
}

interface DataType {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
  tag: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: ColumnsType<DataType>;
  rightColumns: ColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer = ({leftColumns, rightColumns, ...restProps}: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: item => ({disabled: listDisabled || item.disabled}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({key}) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({key}, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          // @ts-ignore
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{pointerEvents: listDisabled ? 'none' : undefined}}
          onRow={({key, disabled: itemDisabled}) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key as string, !listSelectedKeys.includes(key as string));
            },
          })}
        />
      );
    }}
  </Transfer>
);


const dataForHFColumn: RecordType[] = [
  {
    key: "HF-1",
    title: "Sample Type",
    description: "必填。仪器定义的样本类型，有4个选项（Unknown, Blank, QC, Std Bracket），默认Unknown",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-2",
    title: "File Name",
    description: "必填。Sample命名： 平台名称_S_sampleID；mixQC命名平台名称_mixQC_序号，同一个项目序号依次往后加，例如第一板到pos_mixQC_3，第二板从pos_mixQC_4开始。不同平台各自命名，例如pos第一板pos_mixQC_1 mixQC_2，neg第一板是neg_mixQC_1。",
    disabled: false,
    tag: "2",
  },
  {
    key: "HF-3",
    title: "Sample ID",
    description: "非必填。默认为板号_进样序号，例如1_6为第1板第6针",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-4",
    title: "Path",
    description: "必填。默认D:\\项目编号\\平台名称\\板号。如果同一盒样本生成两次工单，第二次在名字后面加_2，例如第一次生成batch1，第二次生成batch1_rerun1。",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-5",
    title: "Instrument Method",
    description: "必填。默认D:\\Method\\平台名称",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-6",
    title: "Position",
    description: "必填。进样位置。见进样位置示例",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-7",
    title: "Inj Vol",
    description: "必填。进样量。GCMS和HILIC平台默认为1，其他默认为5",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-8",
    title: "Sample Name",
    description: "非必填，默认为板号_序号。例如1_66，为第1板第66个样本",
    disabled: false,
    tag: "1",
  },
  {
    key: "HF-9",
    title: "Comment",
    description: "非必填，默认为空",
    disabled: false,
    tag: "1",
  }
]


const dataForGCMSColumn: RecordType[] = [
  {
    key: "6500-1",
    title: "Name",
    description: "必选, 样本名称",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-2",
    title: "Vial",
    description: "必选, 进样体积",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-3",
    title: "Method Path",
    description: "必选, 方法路径",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-4",
    title: "Method File",
    description: "必选, 方法文件",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-5",
    title: "Data Path",
    description: "必选, 数据路径",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-6",
    title: "Type",
    description: "必选, 类型",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-7",
    title: "Type",
    description: "必选, 样本名称",
    disabled: false,
    tag: "1",
  }
]

const dataFor6500Column: RecordType[] = [
  {
    key: "6500-1",
    title: "% header=SampleName",
    description: "必选, 样本名称",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-2",
    title: "SampleID",
    description: "必选, 默认为板号_进样序号，例如1_6为第1板第6针",
    disabled: false,
    tag: "2",
  },
  {
    key: "6500-3",
    title: "Comments",
    description: "必选, 默认为空",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-4",
    title: "AcqMethod",
    description: "必选, 默认平台名称",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-5",
    title: "ProcMethod",
    description: "非必填。默认none",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-6",
    title: "RackCode",
    description: "必填。96孔板进样默认MTP 96 Cooled；进样瓶进样默认1.5 mL 105 vials",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-7",
    title: "PlateCode",
    description: "必填。96孔板进样默认MTP 96 Cooled；进样瓶进样默认1.5 mL 105 vials",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-8",
    title: "VialPos",
    description: "必填。参考进样位置示例。",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-9",
    title: "SmplInjVol",
    description: "必填。关联平台管理",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-10",
    title: "DilutFact",
    description: "非必填。默认1",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-11",
    title: "WghtToVol",
    description: "非必填。默认0",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-12",
    title: "Type",
    description: "必填。默认Unknown",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-13",
    title: "RackPos",
    description: "必填。默认1",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-14",
    title: "PlatePos",
    description: "必填。同一个项目同一个平台，96孔板位置1和2交替，例如第一板样本位于1号位置，第二板样本位于2号位置，第三版样本位于1号位置",
    disabled: false,
    tag: "1",
  },
  {
    key: "6500-15",
    title: "OutputFile",
    description: "必填。文件保存路径。默认：平台名称\\板号",
    disabled: false,
    tag: "1",
  },
]

const leftTableColumns: ColumnsType<DataType> = [
  {
    dataIndex: 'title',
    title: 'Title',
  },
  {
    dataIndex: 'description',
    title: 'Description',
  },
];

const rightTableColumns: ColumnsType<Pick<DataType, 'title'>> = [
  {
    dataIndex: 'title',
    title: 'Title',
  },
  {
    dataIndex: 'alias',
    title: 'Alias',
    render: alias => <Tag>{alias}</Tag>,
  },
  {
    dataIndex: 'option',
    title: "Option",
    render: (text, sample) => [
      <a>编辑</a>
    ],
  }
];

/**
 * service
 */
const projectService = new ProjectService();
const deviceService = new DeviceService();
const preOrderService = new PreOrderService();
const runTemplateService = new RunTemplateService();
const msRunManagerService = new MSRunManagerService();


const runManager: FC<Record<string, any>> = () => {
  /**
   * 穿梭框
   */
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(true);

  const [workSheetHeader, setWorkSheetHeader] = useState<RecordType[]>([]);


  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };
  const triggerShowSearch = (checked: boolean) => {
    setShowSearch(checked);
  };

  const [error, setError] = useState<ErrorField[]>([]);
  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon}/>
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined/>
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = async (values: Record<string, any>) => {
    console.log("values", values);
    setError([]);
    try {
      await msRunManagerService.submit(values);
      // await fakeSubmitForm(values);
      message.success('提交成功');
    } catch {
      // console.log
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };
  return (
    <ProForm
      layout="vertical"
      hideRequiredMark
      submitter={{
        render: (props, dom) => {
          return (
            <FooterToolbar>
              {getErrorInfo(error)}
              {dom}
            </FooterToolbar>
          );
        },
      }}
      initialValues={{members: tableData}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer content="上机配置">
        <Card title="上机管理" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label={fieldLabels.name}
                width="xl"
                name="name"
                rules={[{required: true, message: '请输入上机任务名称'}]}
                placeholder="请输入上机任务名称"
              />
            </Col>
            <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
              <ProFormText
                label={fieldLabels.owner}
                width="xl"
                name="owner"
                rules={[{required: true, message: '请输入负责人名称'}]}
                placeholder="请输入负责人名称"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormSelect
                label={fieldLabels.device}
                width="xl"
                name="device"
                rules={[{required: true, message: '请选择设备'}]}
                request={async () => {
                  const res: any[] = [];
                  const device = await deviceService.list({});
                  device?.data.map((item: { name: any; id: any }) => {
                    const temp: Record<any, any> = {};
                    temp.label = item.name;
                    temp.value = item.name;
                    res.push(temp);
                    return null;
                  });
                  return res;
                }}
                placeholder="请选择设备"
                //@ts-ignore
                onChange={(value) => {
                  if (value === '6500+') {
                    setWorkSheetHeader(dataFor6500Column)
                  }
                  if (value === 'HF' || value === 'HFX-1' || value === 'HFX-2' || value === 'GCMS-1' || value === 'GCMS-2') {
                    setWorkSheetHeader(dataForHFColumn)
                  }
                  if (value === '7890B-5977A' || value === '7890B-5977B' || value === '8890-5977B') {
                    setWorkSheetHeader(dataForGCMSColumn)
                  }
                }}
              />
            </Col>
            <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
              <ProFormDependency name={['device']}>
                {({device}) => {
                  return (
                    <ProFormSelect
                      width="xl"
                      mode={"multiple"}
                      name="platform"
                      label="检测平台"
                      params={{device}}
                      request={async () => {
                        const result: any[] = [];
                        const res = await deviceService.getPlatforms({deviceName: device});
                        res?.data?.map((item: { name: any; id: any }) => {
                          const temp: Record<any, any> = {};
                          temp.label = item.name;
                          temp.value = item.name;
                          result.push(temp);
                          return null;
                        });
                        return result;
                      }}
                    />
                  );
                }}
              </ProFormDependency>
            </Col>
            <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
              <ProFormSelect
                width="xl"
                label={fieldLabels.boardType}
                name="boardType"
                rules={[{required: true, message: '请选择进样板类型'}]}
                options={[
                  {
                    label: '96孔板',
                    value: '96孔板',
                  },
                  {
                    label: 'ep管',
                    value: 'ep管',
                  },
                ]}
                placeholder="请选择进样板类型"
              />
            </Col>
          </Row>
        </Card>
        <Card title="进样选择" className={styles.card} bordered={true} style={{marginTop: 10}}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormSelect
                label={fieldLabels.project}
                width="xl"
                name="project"
                mode={"multiple"}
                rules={[{required: true, message: '请选择项目'}]}
                request={async () => {
                  const res: any[] = [];
                  const projectListData = await projectService.list({});
                  projectListData?.data.map((item: { name: any; id: any }) => {
                    const temp: Record<any, any> = {};
                    temp.label = item.name;
                    temp.value = item.name;
                    res.push(temp);
                    return null;
                  });
                  return res;
                }}
                placeholder="请选择项目"
              />
            </Col>
            <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
              <ProFormDependency name={['project']}>
                {({project}) => {
                  return (
                    <ProFormTreeSelect
                      label={fieldLabels.sample}
                      width="xl"
                      name="sample"
                      placeholder="请选择样本"
                      allowClear
                      params={{project}}
                      secondary
                      request={async () => {
                        const projectBoardListData = await preOrderService.getProjectBoardList({
                          projectIds: project,
                        });

                        let sampleBoardList: {
                          title: string;
                          value: string;
                          children?: {
                            title: string;
                            value: string;
                            disabled?: boolean;
                            children?: { value: string; label: string; disable?: boolean }[];
                          }[];
                        }[] = [];

                        const data = projectBoardListData.data;
                        data.forEach((item: { projectId: any; boardDOList: any[] }) => {
                          if (item.projectId) {
                            sampleBoardList.push({
                              value: item.projectId,
                              title: item.projectId,
                              children: item.boardDOList.map(
                                (board: { id: string; boardNo: string; disabled?: boolean }) => {
                                  return {
                                    value: item.projectId + "_" + board.boardNo,
                                    title: item.projectId + "—第" + `${board.boardNo}` + "号板",
                                  };
                                },
                              ),
                            });
                          }
                        });
                        return sampleBoardList;
                      }}
                      // tree-select args
                      fieldProps={{
                        showArrow: false,
                        filterTreeNode: true,
                        showSearch: true,
                        dropdownMatchSelectWidth: true,
                        labelInValue: true,
                        autoClearSearchValue: true,
                        multiple: true,
                        treeCheckable: true,
                        treeNodeFilterProp: 'title',
                        fieldNames: {
                          label: 'title',
                        },
                      }}
                    />
                  );
                }}
              </ProFormDependency>

            </Col>
            <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
              <ProFormSelect
                label={fieldLabels.runTemplate}
                width="xl"
                name="runTemplate"
                rules={[{required: true, message: '请选择进样模板'}]}
                request={async () => {
                  const res: any[] = [];
                  const runTemplateListData = await runTemplateService.list({});
                  runTemplateListData?.data.map((item: { name: any; id: any }) => {
                    const temp: Record<any, any> = {};
                    temp.label = item.name;
                    temp.value = item.name;
                    res.push(temp);
                    return null;
                  });
                  return res;
                }}
                placeholder="请选择进样模板"
              />
            </Col>
          </Row>
        </Card>
        <Card title="配置工单表头" bordered={false} style={{marginTop: 10}}>
          <ProForm.Item name={"tableColumn"}>
            <TableTransfer
              dataSource={workSheetHeader}
              targetKeys={targetKeys}
              showSearch={showSearch}
              onChange={onChange}
              filterOption={(inputValue, item) =>
                item.title!.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
              }
              leftColumns={leftTableColumns}

              //@ts-ignore
              rightColumns={rightTableColumns}
            />
          </ProForm.Item>
          <Switch
            unCheckedChildren="showSearch"
            checkedChildren="showSearch"
            checked={showSearch}
            onChange={triggerShowSearch}
            style={{marginTop: 16}}
          />
        </Card>
      </PageContainer>
    </ProForm>
  );
};

export default runManager;
