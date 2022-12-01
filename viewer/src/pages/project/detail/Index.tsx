import type {Pagination, Result} from '@/domains/Common';
import type {MSOrder} from '@/domains/MSOrder.d';
import type {PreOrder} from '@/domains/PreOrder.d';
import type {Sample} from '@/domains/Sample.d';
import {
  addSampleListColumn,
  buildColumn,
  buildMSOrderColumn,
  buildOrderBoardColumn,
  buildProcessSampleColumn,
} from '@/pages/project/detail/Column';
import {buildCreateSampleModal} from '@/pages/project/detail/Modals';
import DeviceService from '@/services/Device';
import MSOrderService from '@/services/MSOrderService';
import PreOrderService from '@/services/PreOrderService';
import ProjectService from '@/services/ProjectService';
import SampleService from '@/services/SampleService';
import {url} from '@/utils/request';
import {
  BarsOutlined,
  AppstoreOutlined,
  CheckCircleTwoTone,
  DeleteOutlined,
  DownOutlined,
  ExportOutlined,
  FileSearchOutlined,
  UploadOutlined,
  LoadingOutlined,
  ThunderboltFilled,
  SnippetsOutlined,
  EditOutlined,
  DownloadOutlined, WarningOutlined
} from '@ant-design/icons';
import {
  ProForm,
  ProFormRadio,
  ProFormText,
  DrawerForm,
  WaterMark,
  StepsForm,
} from '@ant-design/pro-components';
import type {ProFormInstance} from '@ant-design/pro-form';
import {ProFormCascader, ProFormUploadButton} from '@ant-design/pro-form';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {Popconfirm, Space, Segmented, Tabs, Input, Divider} from 'antd';
import {
  Button,
  Card,
  Col,
  message,
  Row,
  Steps,
  Modal,
  Tag,
  Form,
  Dropdown,
  Menu,
  Select,
} from 'antd';
import type {Key} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import PreHeartTable from './PreCollection';
import WorkCurve from './WorkCurve';
import {
  SampleAddType,
  SampleAddType1,
  PlateType,
  SampleBoardType,
  SampleRandomMethod, WhiteListSampleAddType,
} from '@/components/Enums/Const';
import type {OrderBoard} from '@/domains/PreOrder.d';
import {addSample} from './Service';
import styles from './Style.less';
import ExcelUpload from '@/pages/project/detail/ExcelUpload';
import ProCard from "@ant-design/pro-card";
import {ProFormSelect} from "@ant-design/pro-form/es";
import {MsBatchConvert, MsBatchSampleConvert} from "@/domains/MSFileConvert.d";
import {getParam} from "@/utils/StringUtil";
// @ts-ignore
import {useLocation} from "umi";
import {transToLabelArrange, transToTags} from "@/components/Commons/Columns";
const {Step} = Steps;
const {Option} = Select;

//@ts-ignore
import { FormattedMessage, useIntl } from 'umi';
import {SampleProcess} from "@/domains/PreOrder.d";
import TextArea from "antd/es/input/TextArea";


const ProjectDetail: React.FC = () => {

  /**
   * 项目id
   */
  const projectId = getParam(useLocation(), "projectId");

  /**
   * service
   */
  const projectService = new ProjectService();
  const sampleService = new SampleService();
  const preProcessOrderService = new PreOrderService();
  const msOrderService = new MSOrderService();
  const deviceService = new DeviceService();

  /**
   * 全局引用区域
   */
  const DISPLAY_LIST = "LIST";
  const DISPLAY_GRIDS = "GRIDS";

  const [current, setCurrent] = useState(0);
  /**
   * 样本管理tableRef
   */
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const updateFormRef = useRef<ProFormInstance>();
  const createFormRef = useRef<ProFormInstance>();


  const orderFormRef = useRef<ProFormInstance>();
  const addSampleTableRef = useRef<ProFormInstance>(); // 录入样本列表table
  const addSampleActionRef = useRef<ActionType>(); // 录入样本列表actionTable
  const preProcessOrderFormRef = useRef<ProFormInstance>(); // 前处理处理列表form
  const collectionFormRef = useRef<ProFormInstance>(); // 质谱采集列表form
  const sampleDetailFormRef = useRef<ProFormInstance>();

  const addSampleRef = useRef<any>(); //Table组件的引用

  const [addSampleSelectRowKeys, setAddSampleSelectRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息

  const [total, setTotal] = useState<any>(); //数据总行
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [sampleRowKeys, setSampleRowKeys] = useState<Key[]>([]); //样本接收行Keys信息
  const [preProcessRowKeys, setPreProcessRowKeys] = useState<Key[]>([]); //前处理行Keys信息
  const [specSampleRowKeys, setSpecSampleRowKeys] = useState<Key[]>([]); //质谱采集行Keys信息
  const [incomingSampRowKeys, setIncomingSampRowKeys] = useState<Key[]>([]); //进样样本行Keys信息
  const [selectedAllRowKeys, setSelectedAllRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [radioFlag, setRadioFlag] = useState<number>(1);
  const [randomMethodValue, setRandomMethodValue] = useState<string>('1');
  const [sampleNum, setSampleNum] = useState();
  const [detailModalFlag, setDetailModalFlag] = useState<boolean>(false);
  const [selectedSampleCount, setSelectedSampleCount] = useState<any>(0);
  const [samplePredictDisable, setSampleDisable] = useState<boolean>(true);
  const [preHeartTable, setPreHeartTable] = useState<boolean>(false);
  const [workCurve, setWorkCurve] = useState<boolean>(false);
  const [showRunSample, setShowRunSample] = useState<boolean>(false);
  const [devicePlatforms, setDevicePlatforms] = useState<any>([]); //设备平台方法
  const [sampleDetail, setSampleDetail] = useState<any>(); //样本详情
  const [preHeartData, setPreHeartData] = useState<any>(); //预热表数据
  const [workCurveData, setWorkCurveData] = useState<any>(); //工作曲线数据
  const [addSampleVisible, setAddSampleVisible] = useState<boolean>(false); //录入样本弹窗
  const [samplePosition, setSamplePosition] = useState<any[]>([]); //样本位置
  const [preProcessOrderItem, setPreProcessOrderItem] = useState<any>(); //前处理工单;
  const [preProcessOrderList, setPreProcessOrderList] = useState<any[]>([]); //前处理工单列表
  const [currentSampleAddType, setCurrentSampleAddType] = useState<any>([]); //批次样本确认 options
  const [blurSampleValue, setBlurSampleValue] = useState<any>(); // sampleList 模糊查询value
  const [blurSampleData, setBlurSampleData] = useState<any[]>([]); // sampleList 模糊查询value
  const [addSampleForm] = Form.useForm(); //手动录入样本表单
  const [findSampleListPagination, setFindSampleListPagination] = useState<any>({
    current: 1,
    pageSize: 50,
  }); //手动录入样本分页
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]); //前处理可编辑表格 编辑行的key的集合
  const [orderEditableKeys, setOrderEditableRowKeys] = useState<any[]>([]); //前处理工单可编辑表格 编辑行的key的集合
  const [orderEditableVisible, setOrderEditableVisible] = useState<boolean>(false); //前处理工单可编辑表格弹窗的visible
  const [orderListItem, setOrderListItem] = useState<any>(); // 点击查看工单内容的工单信息
  const [orderItemTotal, setOrderItemTotal] = useState<any>();
  const [showExcelUpload, setShowExcelUpload] = useState<boolean>(false); //样本excel导入

  // @ts-ignore
  const [getWhiteName, setWhiteName] = useState(false);
  const [showWhiteExcelUpload, setShowWhiteExcelUpload] = useState<boolean>(false); //样本excel导入
  const [existExcelValue, setExistExcelValue] = useState<any>(false);
  const [whiteExcelFile, setWhiteExcelFile] = useState<any>();
  const [displayMode, setDisplayMode] = useState<string | number>(DISPLAY_LIST); //当前展示的数据行

  // 样本接收
  // @ts-ignore
  const [existSampleExcelValue, setExistSampleExcelValue] = useState<any>(false);
  const [sampleExcelFile, setSampleExcelFile] = useState<any>();

  const TargetTablePageSize = 50;
  const [boardType, setBoardType] = useState<any>('1');
  const [boardSampleList, setBoardSampleList] = useState<any>([])

  //@ts-ignore
  const [addSampleBoardIndex, setAddSampleBoardIndex] = useState<any>(1);
  //@ts-ignore
  const [boardSize, setBoardSize] = useState<any>(1);
  const [waterBoardNo, setWaterBoardNO] = useState<any>("");
  //@ts-ignore
  const [boardArr, setBoardArr] = useState<any>([]);
  const [activeSampleNo, setActiveSampleNo] = useState<any>();
  const [showBatchDetailVisible, setShowBatchDetailVisible] = useState<boolean>(false);
  const [convertFileData, setConvertFileData] = useState<any>();
  const [showDrawerForm, setShowDrawerForm] = useState<boolean>(false);
  const [selectedSample, setSelectedSample] = useState<any>();
  const [msOrderBatchList, setMsOrderBatchList] = useState<any>([]);

  const [showDrawerBatchForm, setShowDrawerBatchForm] = useState<boolean>(false);
  const [userAdd, setUserAdd] = useState<boolean>(true);
  const [sampleExcelVisible, setSampleExcelVisible] = useState<any>();
  const [selectedBatch, setSelectedBatch] = useState<any>();

  // 白名单弹窗
  const [showPosition, setShowPosition] = useState<boolean>(false);
  const [whitePosition, setWhitePosition] = useState<any>([]);

  const [sampleSize, setSampleSize] = useState<any>(0);

  // @ts-ignore
  const [showPreOrderDrawerForm, setShowPreOrderDrawerForm] = useState<boolean>(false);
  // @ts-ignore
  const [selectedPreOrder, setSelectedPreOrder] = useState<any>();

  // 工单名称
  const [orderName, setOrderRename] = useState<any>();
  const [sampleDescription, setSampleDescription] = useState<any>();
  const sampleProcessRef = useRef<ActionType>();


  // 工单拷贝
  const [showCopyOrderVisible, setShowCopyOrderVisible] = useState<boolean>(false);
  const initNumArray = useState<any>(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

  const [queryProcessVisible, setQueryProcessVisible] = useState<boolean>(false);
  const intl = useIntl();

  const [boardNoList, setBoardNoList] = useState<any>([]);
  const [currentBoardNo, setCurrentBoardNo] = useState<any>();

  const [showUseBoard, setShowUseBoard] = useState<Boolean>(false);
  const [userBoardSize, setUserBoardSize] = useState<any>();
  const [adviceSampleSize, setAdviceSampleSize] = useState<any>();

  // 录入样本快捷输入
  // useKeyPress(['i'], () => {
  //   addSampleRef.current.focus()
  // });

  /********************
   * 质谱工单 function
   *******************/
  const [ip, setIp] = useState('');

  // 初始化 下拉框数据
  const initDevicePlatforms = async () => {
    const res = await deviceService.getDevicePlatforms();
    if (res.success) {
      const data = res.data;
      let newDevicePlatforms: {
        value: string;
        label: string;
        disabled?: boolean;
        children?: {
          value: string;
          label: string;
          disabled?: boolean;
          children?: { value: string; label: string; disable?: boolean }[];
        }[];
      }[] = [];
      newDevicePlatforms.push({
        value: `${intl.formatMessage({id: 'instrument'})}`,
        label: `${intl.formatMessage({id: 'instrument'})}`,
        disabled: true,
      });
      data.forEach((item: { id: string; deviceName: string; platformList: any[] }) => {
        if (item.deviceName) {
          newDevicePlatforms.push({
            value: item.deviceName,
            label: `${item.deviceName}`,
            children: item.platformList.map(
              (platform: { id: string; name: string; disabled?: boolean }) => {
                return {
                  value: platform.name,
                  label: `${platform.name}`,
                  children: [
                    {value: `${intl.formatMessage({id: 'plate'})}`, label: `${intl.formatMessage({id: 'plate'})}`, disabled: true},
                    {
                      value: `${intl.formatMessage({id: '96.plate'})}`,
                      label: `${intl.formatMessage({id: '96.plate'})}`,
                    },
                    {
                      value: `${intl.formatMessage({id: 'injection.bottle'})}`,
                      label: `${intl.formatMessage({id: 'injection.bottle'})}`,
                    },
                  ],
                };
              },
            ),
          });
        }
      });

      newDevicePlatforms = newDevicePlatforms.map((item) => {
        if (item.children) {
          item.children.unshift({
            value: `${intl.formatMessage({id: 'analytical.platform'})}`,
            label: `${intl.formatMessage({id: 'analytical.platform'})}`,
            disabled: true,
          });
        }
        return item;
      });
      setDevicePlatforms(newDevicePlatforms);
    }

  };

  /**
   * 初始化页面
   */
  useEffect(() => {
    initDevicePlatforms();
    getDetail();
  }, []);
  const onChange = (value: number) => {
    const flag =
      preProcessOrderList.filter((item) => !item.arrangementType || !item.boardType)
        .length == 0;
    if (value == 2) {
      if (flag) {
        setCurrent(value);
      } else {
        message.warning(`${intl.formatMessage({id: 'unfinished.worksheet.tip'})}`);
        setCurrent(value);
      }
    } else {
      setCurrent(value);
    }

  };

  /**
   * 监听录入样本值变化
   */
  useEffect(() => {
  }, [boardSampleList])

  /**
   * 获取项目列表
   * @param id
   */
  async function getDetail(): Promise<void> {
    const result: any = await projectService.detail(projectId);
    if (result.success) {
      setSampleDetail(result.data);
      //给样本信息表单赋值
      sampleDetailFormRef?.current?.setFieldsValue({
        owner: result.data.sampleOwner,
        sampleSize: result.data.predictSampleSize,
        volume: result.data.volume,
      });
    }

  }

  /**
   * 样本接受toolbar
   */
  function buildToolbar(): any {
    return {
      actions: [
        <Button
          key="batchImport"
          icon={<UploadOutlined/>}
          onClick={() => {
            setShowExcelUpload(true);
          }}
        >
          <FormattedMessage id='batch.import.samples'/>
        </Button>,
        <Button
          key="downloadTemplate"
          icon={<DownloadOutlined/>}
          onClick={() => {
            setSampleDisable(false);
          }}
        >
          <a href={`${url}/static/瑞金医院样本信息模板.xlsx`}><FormattedMessage id='download.template'/></a>
        </Button>,
        buildCreateSampleModal(createFormRef, doSampleCreate),
        <Dropdown
          key="remove"
          overlay={
            <Menu items={[
              {
                key: '1',
                label: `${intl.formatMessage({id: 'delete'})}`,
                onClick: doRemove
              }
            ]}/>
          }
        >
          <Button>
            <FormattedMessage id='delete'/>
            <DownOutlined style={{marginLeft: 8}}/>
          </Button>
        </Dropdown>,
      ],
    };

  }

  /********************
   * 样本接收 function
   *******************/
  /**
   * 新建样本
   * @param values
   */
  async function doSampleCreate(values: Sample): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.add({...values, projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'create.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 样本修改
   * @param values
   */
  async function doSampleUpdate(values: Sample): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.update(values);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'update.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'update.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 删除样本
   * @param value
   */
  async function doSampleDelete(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.delete(value);
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'delete.failed'})}`);
      return false;
    } finally {
      tableRef?.current?.reload();
      setLoading(false);
    }

  }

  /**
   * 批量删除样本
   */
  async function doRemove(): Promise<boolean> {
    if (sampleRowKeys.length == 0) {
      message.warn(`${intl.formatMessage({id: 'select.project'})}`);
      return false;
    }
    try {
      setLoading(true);
      await sampleService.remove(sampleRowKeys);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'delete.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 样本预估量保存
   */
  async function doPredictSampleSave(values: any): Promise<boolean> {
    try {
      setLoading(true);
      await sampleService.savePredictSampleSize({...values, projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'save.success'})}`);
      setSampleDisable(true);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'save.success'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 样本列表查询
   * @param params
   */
  async function doSampleList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<Sample[]>> {
    const result = await sampleService.list({...params, projectId});
    setTotal(result.total);
    return Promise.resolve(result);

  }

  /********************
   * 前处理 function
   *******************/
  /**
   * 前处理工单删除
   * @param value
   */
  async function doOrderDelete(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await preProcessOrderService.delete(value);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 前处理工单列表的修改
   * @param params
   */
  async function doOrderEdit(params: any): Promise<boolean> {
    try {
      setLoading(true);
      await preProcessOrderService.update(params);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'update.success'})}`);
      return true;
    } catch (error) {
      tableRef?.current?.reload();
      message.error(`${intl.formatMessage({id: 'update.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 前处理工单创建
   * @param values
   */
  async function doOrderCreate(values: PreOrder): Promise<boolean> {
    try {
      setLoading(true);
      await preProcessOrderService.submit({...values, projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'create.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 前处理工单拷贝
   * @param values
   */
  async function doOrderCopy(values: any): Promise<boolean> {
    try {
      setLoading(true);
      await preProcessOrderService.preOrderCopy({...values, orderId: orderListItem.id, projectId: projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'worksheet.copy.success'})}`);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 样本列表查询
   * @param params
   */
  async function doSampleProcess(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<Sample[]>> {
    const result = await preProcessOrderService.addSampleList({...params, preOrderId: orderListItem.id, projectId});
    setTotal(result.total);
    return Promise.resolve(result);
  }


  /**
   * 白名单工单创建
   * @param values
   */
  async function doWhiteListPreOrderCreate(values: PreOrder): Promise<boolean> {
    try {
      setLoading(true);
      await preProcessOrderService.submitWhiteList({...values, projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'create.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }

  }


  /**
   * 查询项目中所有的工单对应的板子列表
   * 查询工单中某类型的板子及其样本信息（boardIndex）
   * 入参： orderId,
   * 返回:  boardIndex, 是否有不合格样本。
   */
  async function findOrderBoard(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<OrderBoard[]>> {

    const result = await preProcessOrderService.findBoard({
      ...params,
      projectId: projectId,
      boardType: 1,
    });
    setTotal(result.total);
    return Promise.resolve(result);

  }

  /**
   * 前处理工单列表查询
   * @param params
   */
  async function doPreProcessOrderList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<PreOrder[]>> {
    const result = await preProcessOrderService.list({...params, projectId});
    setEditableRowKeys(result.data.map((item: { id: any; }) => item.id));
    setPreProcessOrderList(result.data);
    setTotal(result.total);

    // @ts-ignore
    result?.data.sort((n1: { type: number; }, n2: { type: number; }) => {
      return n2.type - n1.type
    });
    return Promise.resolve(result);

  }

  /**
   * 前处理工单样本位置列表
   * @param params
   */
  // @ts-ignore
  async function doGetOrderSampleList(params: { pageSize: number; current: number }): any {
    const result = await preProcessOrderService.processlist({...params, projectId});
    setOrderEditableRowKeys(result.data.map((item: { id: any; }) => item.id));
    setOrderItemTotal(result.total);
    return Promise.resolve(result);

  }

  /**
   * 前处理工单样本位置列表
   * @param params
   */
  async function doGetMSOrderSampleList(params: { pageSize: number; current: number }) {
    const result = await msOrderService.orderList({...params, projectId});
    setTotal(result.total);
    return result;

  }

  /**
   * 前处理工单样本列表
   * @param sampleNo
   */
  async function doGetBlurSampleList(sampleNo: string) {
    const result = await sampleService.getBlurSampleList({sampleNo, projectId});
    setBlurSampleData(result.data);
    return result;
  }

  /**
   * 前处理工单样本删除
   */
  async function doDeleteSample(sampleNo: {} | null | undefined) {
    try {
      setLoading(true);
      await preProcessOrderService.deleteSample({sampleNo, preOrderId: preProcessOrderItem.id});
      // 刷新列表
      tableRef?.current?.reload();
      addSampleActionRef.current?.reload();
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 前处理工单样本删除
   */
  async function doRemoveSample(sampleNoList: Key[]) {
    try {
      setLoading(true);
      await preProcessOrderService.removeSample({sampleNoList, preOrderId: preProcessOrderItem.id});
      // 刷新列表
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      tableRef?.current?.reload();
      addSampleActionRef.current?.reload();
      return true;
    } finally {
      setLoading(false);
    }
  }


  /**
   * 模糊查询样本的输入框value
   *
   */
  const handleBlurChange = (newValue: string) => {
    setBlurSampleValue(newValue);
  };
  /**
   * 模糊查询样本的输入框value
   *
   */
  let timeout: any;
  const getBlurSearchData = (newValue: string) => {
    if (newValue === '') return;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      doGetBlurSampleList(newValue);
    }, 300);

  };

  /**
   * 前处理工单已录入样本列表
   * @param orderId
   *
   */
  async function doGetFindSampleList(params: { pageSize: number; current: number }) {
    const result = await preProcessOrderService.findSampleList({
      ...params,
      orderId: preProcessOrderItem.id,
    });
    setFindSampleListPagination(result.total);

    // 构造一个81位数的数组，若在直接填充，若不在则补充 ""
    setSampleSize(result?.data === null? 0 : result?.data?.length)
    return Promise.resolve(result);

  }

  /**
   * 判断是否已经录入样本
   *
   */
  function checkAvailability(arr: any[], val: any) {
    return arr.some(function (arrVal) {
      return val === arrVal;
    });
  }


  /**
   * 样本内容列
   */
  function buildSamplePositionColumn(arrangementType: string) {
    const columns: ProColumns<SampleProcess>[] = [
      {
        key: 'sampleId',
        title: <FormattedMessage id='sample.no'/>,
        dataIndex: 'sampleNo',
        width: "150px",
        hideInSearch: false,
        editable: false,
      },
      {
        key: 'matrix',
        title: <FormattedMessage id='matrix'/>,
        dataIndex: 'matrix',
        hideInSearch: true,
        editable: false,
        render: (text, entity) => {
          return transToTags(entity.matrix);
        },
      },
      {
        key: 'species',
        title: <FormattedMessage id='species'/>,
        dataIndex: 'species',
        hideInSearch: true,
        editable: false,
        render: (text, entity) => {
          return transToTags(entity.species, 'purple');
        },
      },
      {
        key: 'group',
        title: <FormattedMessage id='group'/>,
        editable: false,
        dataIndex: 'groupName',
        hideInSearch: true,
      },
      {
        key: 'position',
        title: <FormattedMessage id='position'/>,
        editable: false,
        dataIndex: 'position',
        hideInSearch: true,
      },
      {
        key: 'volume',
        title: <FormattedMessage id='volume'/>,
        editable: false,
        dataIndex: 'volume',
        hideInSearch: true,
      },
      {
        key: 'status',
        title: <FormattedMessage id='status'/>,
        dataIndex: 'sampleStatus',
        hideInSearch: true,
        editable: false,
        valueType: 'select',
        valueEnum: {
          1: {
            text: <FormattedMessage id='normal'/>,
            status: 'Success',
          },
          2 : {
            text: <FormattedMessage id='invalid'/>,
            status: 'Error',
          },
        },
      },
      {
        key: '99board',
        title:
          arrangementType == '1' ?
            <div style={{color: '#1890ff',}}>
              <FormattedMessage id='9.9.plate'/>
            </div>
            : <FormattedMessage id='9.9.plate'/>,
        className: `${arrangementType == '1' && styles.columnCenter}`,
        dataIndex: 'nineNineSampleBoardPosition',
        hideInSearch: true,
        editable: false,

        render: (text, entity) => {
          return <Tag color="purple">{entity.nineNineSampleBoardPosition}</Tag>;
        },
      },
      {
        key: '96board',
        title:
          arrangementType == '2' ?
            <div style={{color: '#1890ff',}}>
              <FormattedMessage id='96.plate'/>
            </div> : <FormattedMessage id='96.plate'/>,
        className: `${arrangementType == '2' && styles.columnCenter}`,
        dataIndex: 'ninetySixSampleBoardPosition',
        hideInSearch: true,
        editable: false,
        render: (text, entity) => {
          return <Tag color="green">{entity.ninetySixSampleBoardPosition}</Tag>;
        },
      },
      {
        title:
          arrangementType == '3' ? <div style={{color: '#1890ff',}}>
            <FormattedMessage id='ep.plate'/>
          </div> : <FormattedMessage id='ep.plate'/>,
        className: `${arrangementType == '3' && styles.columnCenter}`,
        key: 'EP_board',
        dataIndex: 'epPosition',
        hideInSearch: true,
        editable: false,
        render: (text, entity) => {
          return <Tag color="blue">{entity.epPosition}</Tag>;
        },
      },

      {
        key: 'isValid',
        title: <FormattedMessage id='is.valid'/>,
        dataIndex: 'isValid',
        valueType: 'switch',
        hideInSearch: true,
        fieldProps: {
          defaultChecked: true,
          checkedChildren: <FormattedMessage id='yes'/>,
          unCheckedChildren: <FormattedMessage id='no'/>,
        },
      },
      {
        key: 'desc',
        title: '原因',
        dataIndex: 'description',
        editable: false,
        hideInSearch: true,
        render: (_, sample, index, option) => [
          <Popconfirm title={() => {
            return <div>
              <div>编辑原因</div>
              <TextArea defaultValue={sample.description} onChange={(e) => {
                setSampleDescription(e.target.value)
              }
              }/>
            </div>
          }} key="editDescription" onConfirm={(e) => {
            console.log(sampleDescription)
            doEditProcessOrder({
              orderId: orderListItem?.id,
              sampleId: sample?.id,
              description: sampleDescription,
            });
            sampleProcessRef?.current?.reload();
          }}>
            {sample.description}<a><EditOutlined/></a>
          </Popconfirm>,
        ]
      },
    ];
    return columns;
  }

  /**
   *  前处理工单 录入样本 的确认按钮
   */
    //@ts-ignore
  const handleSampleConfirm = async (value: any) => {
      try {
        const res = await addSample({
          sampleNo: value,
          projectId,
          preOrderId: preProcessOrderItem.id,
        });
        if (res.success) {
          if (res.data[0].whiteSample) {
            message.warn(`${intl.formatMessage({id: 'samples.in.whitelist'})}`)
            setShowPosition(true)
            setWhitePosition(res.data)
            return true;
          }
          setSamplePosition(res.data);
          const newItem = blurSampleData.filter((item) => item.sampleNo === value);
          //简易深拷贝
          const newPreProcessOrderItem = JSON.parse(JSON.stringify(preProcessOrderItem));
          if (!checkAvailability(boardSampleList, newItem[0].sampleNo)) {
            console.log("boardSampleList", boardSampleList, newItem[0].sampleNo)
            newPreProcessOrderItem?.sampleList?.push(newItem[0].id);
            newPreProcessOrderItem.sampleSize = newPreProcessOrderItem?.sampleSize + 1;
            setSampleSize(newPreProcessOrderItem.sampleSize);
            setPreProcessOrderItem(newPreProcessOrderItem);
          }

          tableRef.current?.reload();
          addSampleActionRef.current?.reload();
          setAddSampleBoardIndex(Number(res.data[0].relatedBoardIndex))
          setBoardSize(res.data[0].boardSize)
          const boardArray = [];
          for (let i = 1; i <= res.data[0].boardSize; i++) {
            boardArray.push(i)
          }
          setBoardArr(boardArray);
          // 刷新录入样本页面
          // 根据工单id + 板子id 查询
          // 默认查询 1号板子的新
          const result = await preProcessOrderService.findBoardSample({
            id: preProcessOrderItem.id,
            boardNo: res.data[0].relatedBoardIndex
          });
          // 按samplePosition分组
          const data = result.data.filter((res1: { samplePosition: any; }) => {
            return res1.samplePosition
          }).map((item: { sampleNo: any; samplePosition: any }) => {
            return {key: item.samplePosition, value: item.sampleNo}
          })
          // 构造一个81位数的数组，若在直接填充，若不在则补充 ""
          const originArr = new Array(81).fill("")
          data.forEach((item: { key: any; value: any; }) => {
            originArr[Number(item.key)] = item.value
          })
          // 随机录入
          setBoardSampleList(originArr);
          setActiveSampleNo(value);
          setWaterBoardNO(result?.data[0]?.boardNo || "")
          setCurrentBoardNo(result?.data[0]?.boardNo)
        } else {
          console.log("res", res)
        }
      } catch (error) {
        console.log('sampleNo', samplePosition)
      }

    };

  /**
   * 前处理工单列表的修改
   * @param params
   */
  async function doEditProcessOrder(params: any): Promise<boolean> {
    try {
      setLoading(true);
      await preProcessOrderService.editProcessOrder(params);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'update.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }

  }

  /**
   * 质谱工单列表查询
   * @param params
   */
  async function doMSList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<MSOrder[]>> {
    const result = await msOrderService.list({...params, projectId});
    setTotal(result.total);
    setIp(result.data[0].name)
    return Promise.resolve(result);

  }

  /**
   * 质谱工单批次查询
   */
  async function doMsOrderBatch(params: any): Promise<Result<MsBatchConvert[]>> {
    const result = await msOrderService.batchList({...params});
    setTotal(result.total);
    setMsOrderBatchList(result.data);
    return Promise.resolve(result);
  }

  /**
   * 查询文件转换进度
   */
  async function queryFileCovertStatus(params: any): Promise<Result<MsBatchSampleConvert[]>> {
    const result = await msOrderService.batchSampleList({...params});
    setTotal(result.total);
    return Promise.resolve(result);
  }

  /**
   * 质谱采集工单创建
   * @param values
   */
  async function doMSOrderCreate(params: any): Promise<boolean> {
    try {
      setLoading(true);
      await msOrderService.submitMsOrder({...params, projectId: projectId});
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }
    return false;

  }

  /**
   * 删除样本
   * @param value
   */
  async function doMsOrderDelete(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await msOrderService.delete(value);
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'delete.failed'})}`);
      return false;
    } finally {
      tableRef?.current?.reload();
      setLoading(false);
    }

  }

  const preOrderProcessColumn: ProColumns<Sample>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
      readonly: true,
    },
    {
      key: 'sampleNo',
      title: <FormattedMessage id='sample.no'/>,
      dataIndex: 'sampleNo',
      copyable: true,
    },
    {
      key: 'status',
      title: <FormattedMessage id='status'/>,
      dataIndex: 'addStatus',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '-',
        },
        1: {
          text: <FormattedMessage id='entered'/>,
          status: 'Success',
        },
        2: {
          text: <FormattedMessage id='to.be.entered'/>,
          status: 'Error',
        },
      },
    },
    {
      key: 'group',
      title: <FormattedMessage id='group'/>,
      dataIndex: 'groupName',
      hideInSearch: true,
    },
    {
      key: 'position',
      title: <FormattedMessage id='position'/>,
      dataIndex: 'position',
      hideInSearch: true,
    }

  ];



  const preOrderListcolumns: ProColumns<PreOrder>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
      readonly: true,
    },
    {
      key: 'type',
      title: <FormattedMessage id='type'/>,
      dataIndex: 'type',
      width: '120px',
      editable: false,
      render: (text) => {
        if (text === 2) return <Tag color="red"><ThunderboltFilled/><FormattedMessage id='whitelist.worksheet'/></Tag>
        else return <Tag color="blue"><FormattedMessage id='pretreatment.worksheet'/></Tag>;
      },
    },
    {
      key: 'name',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      copyable: true,
      width: '350px',
      editable: false,
      render: (_, order, index, option) => [
        <Popconfirm title={() => {
          return <div>
            <div><FormattedMessage id='rename.worksheet'/></div>
            <Input defaultValue={order.name} onChange={(e) => {
              setOrderRename(e.target.value);
            }
            }/>
          </div>
        }} key="rename" onConfirm={() => {
          const newOrder = order;
          newOrder.name = orderName;
          doOrderEdit(newOrder);
        }}>
          {order.name}<a><EditOutlined/></a>
        </Popconfirm>,
      ]
    },
    {
      key: 'saveType',
      title: <FormattedMessage id='sample.save.type'/>,
      dataIndex: 'saveType',
      valueType: 'select',
      valueEnum: SampleAddType1,
      hideInSearch: true,
      width: '100px',
      readonly: true,
      editable: false,
    },
    {
      key: 'randomMethod',
      title: <FormattedMessage id='random.method'/>,
      dataIndex: 'randomMethod',
      valueType: 'select',
      width: '100px',
      valueEnum: SampleRandomMethod,
      hideInSearch: true,
      readonly: true,
      editable: false,
    },
    {
      key: 'arrangementType',
      title: <FormattedMessage id='arrangement.type'/>,
      dataIndex: 'arrangementType',
      width: '100px',
      valueType: 'select',
      valueEnum: PlateType,
      hideInSearch: true,
    },
    {
      key: 'boardType',
      title: <FormattedMessage id='pretreatment.type'/>,
      dataIndex: 'boardType',
      width: '100px',
      valueType: 'select',
      valueEnum: SampleBoardType,
      hideInSearch: true,
    },
    {
      key: 'sampleTotal',
      title: <FormattedMessage id='samples.total'/>,
      dataIndex: 'sampleTotal',
      hideInSearch: true,
      width: '100px',
      readonly: true,
      editable: false,
      render: (text) => {
        return <Tag color="blue">{text}</Tag>;
      },
    },
    {
      key: 'sampleSize',
      title: <FormattedMessage id='sample.size'/>,
      dataIndex: 'sampleSize',
      width: '200px',
      readonly: true,
      editable: false,
      render: (text, record) => {
        if (record.saveType === 1) {
          return (
            <>
              <Tag>{record?.sampleSize}</Tag>
              <Tag
                style={{cursor: 'pointer'}}
                color="green"
                onClick={() => {

                  if (!record.arrangementType) {
                    message.warn(`${intl.formatMessage({id: 'select.arrangement.type'})}`);
                  } else {
                    const newItem = JSON.parse(JSON.stringify(record));
                    if (!newItem.sampleList) {
                      newItem.sampleList = [];
                    }
                    setPreProcessOrderItem(newItem);
                    setDisplayMode(DISPLAY_LIST);
                    setAddSampleVisible(true);
                  }
                }}
              >
                <FormattedMessage id='enter.sample'/>
              </Tag>
            </>
          );
        } else {
          return <Tag color="blue">{text}</Tag>;
        }
      },
      hideInSearch: true,
    },
    {
      key: 'boardNoList',
      title: <FormattedMessage id='used.plate.no.list'/>,
      dataIndex: 'boardNoList',
      valueType: "text",
      width: '100px',
      readonly: true,
      editable: false,
      ellipsis: true,
      hideInSearch: true,
      render: (text, entity) => {
        // @ts-ignore
        return transToLabelArrange(entity.boardNoList);
      },

    },
    {
      key: 'owner',
      title: <FormattedMessage id='owner'/>,
      dataIndex: 'owner',
      width: '100px',
      readonly: true,
      editable: false,
      hideInSearch: true,
    },
    {
      key: 'createDate',
      title: <FormattedMessage id='create.date'/>,
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
      readonly: true,
      width: '150px',
      editable: false,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.createDate > b?.createDate ? -1 : 1;
      },
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '250px',
      hideInSearch: true,
      readonly: true,
      render: (_, order, index, option) => [
        <Tag
          color="blue"
          key="edit"
          style={{
            cursor: 'pointer',
          }}
          onClick={() => {
            option?.startEditable(order.id);
          }}
        >
          <FormattedMessage id='update'/>
        </Tag>,
        <Popconfirm title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doOrderDelete(order.id)}>
          <Tag
            style={{
              cursor: 'pointer',
            }}
            color="red"
          >
            <FormattedMessage id='delete'/>
          </Tag>
        </Popconfirm>,
        // buildOrderDetailModal(doGetOrderSampleList, order.id, order.arrangementType),
        <Tag color="blue" key="export">
          <a
            style={{
              color: 'inherit',
            }}
            href={API_URL + '/order/export?id=' + order.id}
          >
            <FormattedMessage id='export'/>
          </a>
        </Tag>,
      ],
    },
  ];
  // 批次样本确认 options


  useEffect(() => {
    let newSampleAddType: any = JSON.parse(JSON.stringify(SampleAddType));
    newSampleAddType = newSampleAddType.map((item: any, index: number) => {
      if (randomMethodValue == '1' && (index === 1 || index === 2)) {
        item.disabled = true;
      }
      return item;
    });
    setCurrentSampleAddType(newSampleAddType);
  }, [randomMethodValue]);
  /**
   * detailList
   */
  const detailColumns: ProColumns<MsBatchConvert>[] = [
    {
      title: <FormattedMessage id='batch.name'/>,
      key: 'batchName',
      dataIndex: 'batchName',
      width: "25%"
    },
    {
      title: <FormattedMessage id='batch.size'/>,
      key: 'batchSize',
      dataIndex: 'batchSize',
      width: "25%"
    },
    {
      title: <FormattedMessage id='conversion.status'/>,
      key: 'convertStatus',
      width: "25%",
      dataIndex: 'convertStatus',
      render: (text, record) => {
        if (record.convertStatus == '2') return <Tag color="pink"><LoadingOutlined/><FormattedMessage id='converting'/></Tag>;
        if (record.convertStatus == '3') return <Tag color="purple"><FormattedMessage id='converted'/></Tag>;
        else return <Tag color="green"><FormattedMessage id='tobe.inject'/></Tag>;
      },
    },
    {
      title: <FormattedMessage id='option'/>,
      key: 'option',
      width: "25%",
      valueType: 'option',
      render: (text, record) => [<a onClick={(item) => {
        setShowBatchDetailVisible(true)
        setConvertFileData(record.batchId)
      }
      }><FormattedMessage id='query.conversion.progress'/></a>],
    },
  ];

  const ipColumns: ProColumns<MSOrder>[] = [
    {
      title: <FormattedMessage id='ms.worksheet.list'/>,
      key: 'name',
      dataIndex: 'name',
      hideInSearch: true,
    }
  ];

  /**
   * detailList
   */
  const fileConvertColumn: ProColumns<MsBatchSampleConvert>[] = [
    {
      title: <FormattedMessage id='sample.no'/>,
      key: 'sampleNo',
      dataIndex: 'sampleNo',
      width: "25%"
    },
    {
      title: <FormattedMessage id='file.name'/>,
      key: 'fileName',
      dataIndex: 'fileName',
      width: "25%"
    },
    {
      title: <FormattedMessage id='convert.status'/>,
      key: 'convertStatus',
      width: "25%",
      dataIndex: 'status',
      render: (text, record) => {
        if (record.status == '2') return <Tag color="pink"><LoadingOutlined/><FormattedMessage id='converting'/></Tag>;
        if (record.status == '3') return <Tag color="purple"><FormattedMessage id='converted'/></Tag>;
        else return <Tag color="green"><FormattedMessage id='tobe.inject'/></Tag>;
      },
    },
    {
      title: '操作',
      key: 'option',
      width: "25%",
      valueType: 'option',
      render: () => [<a><FormattedMessage id='detail'/></a>],
    },
  ];

  /**
   * 项目管理流程
   */
  const projectSteps = [
    {
      title: <FormattedMessage id='sample.reception'/>,
      content: (
        <div>
          <Card>
            <ProForm
              formRef={sampleDetailFormRef}
              title={`${intl.formatMessage({id: 'sample.reception'})}`}
              layout="inline"
              onFinish={doPredictSampleSave}
              submitter={{
                searchConfig: {
                  submitText: <FormattedMessage id='save'/>,
                },
                resetButtonProps: {
                  style: {
                    // 隐藏重置按钮
                    display: 'none',
                  },
                },
              }}
            >
              <ProFormText
                name="owner"
                label={<FormattedMessage id='owner'/>}
                placeholder="请输入负责人"
                disabled={samplePredictDisable}
                initialValue={sampleDetail?.sampleOwner}
              />

              <ProFormText
                name="sampleSize"
                label={<FormattedMessage id='sample.size'/>}
                placeholder="请输入预估录入样本量"
                disabled={samplePredictDisable}
                initialValue={sampleDetail?.predictSampleSize}
              />
              <ProFormText
                name="volume"
                label={<FormattedMessage id='sample.volume'/>}
                placeholder="请输入样本体积"
                disabled={samplePredictDisable}
                initialValue={sampleDetail?.volume}
              />
              <Button
                type="primary"
                onClick={() => {
                  setSampleDisable(false);
                }}
              >
                <FormattedMessage id='update'/>
              </Button>
            </ProForm>
          </Card>
          <Card>
            <ProTable<Sample, Pagination>
              scroll={{x: 'max-content'}}
              headerTitle={<FormattedMessage id='sample'/>}
              actionRef={tableRef}
              rowKey="id"
              loading={loading}
              size="middle"
              toolbar={buildToolbar()}
              search={{span: 4}}
              tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                <Space size={24}>
                  <span>
                     {selectedRowKeys.length} <FormattedMessage id='selected'/>
                    <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                      <FormattedMessage id='unselect'/>
                    </a>
                  </span>
                </Space>
              )}
              pagination={{
                total,
                pageSize: TargetTablePageSize,
              }}
              request={doSampleList}
              columns={buildColumn(updateFormRef, doSampleUpdate, doSampleDelete)}
              rowSelection={{
                selectedRowKeys: sampleRowKeys,
                onChange: (newSelectedRowKeys: Key[]) => {
                  setSampleRowKeys(newSelectedRowKeys);
                },
              }}
              onRow={record => {
                return {
                  onClick: event => {
                    setShowDrawerForm(false)
                    setSelectedSample(record)
                  }
                }
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      title: <FormattedMessage id='pretreatment'/>,
      content: (
        <>
          <Row>
            <Col span={3}>
              <Card>
              <Tabs>
                <Tabs.TabPane tab={<FormattedMessage id='whitelist.worksheet'/>} key="item-1">
                  <Card>
                    <ProForm
                      layout="vertical"
                      formRef={preProcessOrderFormRef}
                      // @ts-ignore
                      onFinish={async (e) => {
                        e.sampleTotal = sampleNum;
                        e.sampleList = selectedAllRowKeys;
                        e.whiteExcelFile = whiteExcelFile;
                        e.file = sampleExcelFile
                        switch (radioFlag) {
                          case 2:
                            if (selectedSampleCount == 0) {
                              message.error(`${intl.formatMessage({id: 'select.sample'})}`);
                              return false;
                            }
                            break;
                          case 3:
                            if (e.file === undefined) {
                              message.error(`${intl.formatMessage({id: 'upload.file'})}`);
                              return false;
                            }
                            break;

                          default:
                            break;
                        }
                        const success = await doWhiteListPreOrderCreate(e);
                        if (success) {
                          preProcessOrderFormRef.current?.resetFields();
                          setRandomMethodValue('1');
                          setSelectedAllRowKeys([]);
                          setSelectedSampleCount(0);
                          setRadioFlag(1);
                          setExistExcelValue(false);
                          setWhiteExcelFile(null);
                          setExistSampleExcelValue(false);
                          setWhiteName(false);
                          setSampleExcelFile(null);
                        }
                      }}
                      onReset={() => {
                        preProcessOrderFormRef.current?.resetFields();
                        setRandomMethodValue('1');
                        setSelectedAllRowKeys([]);
                        setSelectedSampleCount(0);
                        setRadioFlag(1);
                        setExistExcelValue(false);
                        setWhiteExcelFile(null);
                        setSampleExcelFile(null);
                        setExistSampleExcelValue(false);
                        setWhiteName(false);
                      }}
                      submitter={{
                        searchConfig: {
                          submitText: `${intl.formatMessage({id: 'submit.worksheet'})}`,
                        },
                      }}
                    >
                      <ProFormText
                        width="sm"
                        name="owner"
                        label={<FormattedMessage id='owner'/>}
                        fieldProps={{
                          style: {
                            marginBottom: 20,
                          },
                        }}
                        rules={[
                          {required: true, pattern: /^.{1,50}$/, message: `${intl.formatMessage({id: 'input.owner.tip'})}`},
                        ]}
                        tooltip={`${intl.formatMessage({id: 'input.max.length.24'})}`}
                        placeholder="Owner"
                      />

                      <ProFormRadio.Group
                        width="md"
                        label={`${intl.formatMessage({id: 'random.method'})}`}
                        name="randomMethod"
                        tooltip={`${intl.formatMessage({id: 'random.method.tip'})}`}
                        initialValue="1"
                        valueEnum={SampleRandomMethod}
                        fieldProps={{
                          style: {
                            marginBottom: 20,
                          },
                          onChange: (e) => {
                            setRandomMethodValue(e.target.value);
                            preProcessOrderFormRef.current?.setFieldsValue({
                              sampleSaveType: 1,
                            });
                            setSelectedAllRowKeys([]);
                            setSelectedSampleCount(0);
                            setRadioFlag(1);
                          },
                        }}
                      />
                      <ProFormRadio.Group
                        width="md"
                        label={`${intl.formatMessage({id: 'batch.sample.confirm'})}`}
                        name="saveType"
                        initialValue={3}
                        options={WhiteListSampleAddType}
                        fieldProps={{
                          style: {
                            marginBottom: 20,
                          },
                          onChange: (e) => {
                            setRadioFlag(e.target.value);
                          },
                        }}
                      />
                      <div
                        style={{
                          marginBottom: '10px',
                          // height: '130px',
                          width: '100%',
                        }}
                      >
                        {(
                          <>
                            <h3
                              style={{
                                display: 'inline-block',
                                margin: 0,
                              }}
                            >
                              <FormattedMessage id='sample.content'/>
                            </h3>
                            {/*{setSampleExcelVisible(true)}*/}
                            <div style={{display: "block", marginTop: "10px"}}>

                              <Button type={'primary'} size={'small'} onClick={() => {
                                setShowWhiteExcelUpload(true);
                              }} name="file"> {existExcelValue ?
                                <CheckCircleTwoTone twoToneColor="#52c41a"/> : ''}<FormattedMessage id='please.upload.file'/></Button>
                            </div>
                            <Divider />

                            {/*<ProFormUploadButton name="file" title="上传文件"/>*/}
                          </>
                        )}
                      </div>
                    </ProForm>
                  </Card>

                </Tabs.TabPane>
                <Tabs.TabPane tab={<FormattedMessage id='worksheet'/>} key="item-2">
                  <Card>
                    <ProForm
                      layout="vertical"
                      formRef={preProcessOrderFormRef}
                      // @ts-ignore
                      onFinish={async (e) => {
                        e.sampleTotal = sampleNum;
                        e.sampleList = selectedAllRowKeys;
                        e.whiteExcelFile = whiteExcelFile;
                        switch (radioFlag) {
                          case 2:
                            if (selectedSampleCount == 0) {
                              message.error(`${intl.formatMessage({id: 'select.sample'})}`);
                              return false;
                            }
                            break;
                          case 3:
                            if (!preProcessOrderFormRef?.current?.getFieldValue('file')) {
                              message.error(`${intl.formatMessage({id: 'please.upload.file'})}`);
                              return false;
                            }
                            break;

                          default:
                            break;
                        }
                        const success = await doOrderCreate(e);
                        if (success) {
                          preProcessOrderFormRef.current?.resetFields();
                          setRandomMethodValue('1');
                          setSelectedAllRowKeys([]);
                          setSelectedSampleCount(0);
                          setRadioFlag(1);
                          setExistExcelValue(false);
                          setWhiteExcelFile(null);
                          setWhiteName(false);
                        }
                      }}
                      onReset={() => {
                        preProcessOrderFormRef.current?.resetFields();
                        setRandomMethodValue('1');
                        setSelectedAllRowKeys([]);
                        setSelectedSampleCount(0);
                        setRadioFlag(1);
                        setExistExcelValue(false);
                        setWhiteExcelFile(null);
                        setWhiteName(false);
                      }}
                      submitter={{
                        searchConfig: {
                          submitText: `${intl.formatMessage({id: 'submit.worksheet'})}`,
                        },
                      }}
                    >
                      <ProFormText
                        width="sm"
                        name="owner"
                        label={`${intl.formatMessage({id: 'owner'})}`}
                        fieldProps={{
                          style: {
                            marginBottom: 20,
                          },
                        }}
                        rules={[
                          {required: true, pattern: /^.{1,50}$/, message: `${intl.formatMessage({id: 'input.owner.tip'})}`},
                        ]}
                        tooltip={`${intl.formatMessage({id: 'input.max.length.24'})}`}
                        placeholder="Owner"
                      />

                      <ProFormRadio.Group
                        width="md"
                        label={`${intl.formatMessage({id: 'random.method'})}`}
                        name="randomMethod"
                        initialValue="1"
                        valueEnum={SampleRandomMethod}
                        fieldProps={{
                          style: {
                            marginBottom: 20,
                          },
                          onChange: (e) => {
                            setRandomMethodValue(e.target.value);
                            preProcessOrderFormRef.current?.setFieldsValue({
                              sampleSaveType: 1,
                            });
                            setSelectedAllRowKeys([]);
                            setSelectedSampleCount(0);
                            setRadioFlag(1);
                          },
                        }}
                      />
                      <ProFormRadio.Group
                        width="md"
                        label={`${intl.formatMessage({id: 'batch.sample.confirm'})}`}
                        name="saveType"
                        initialValue={1}
                        options={randomMethodValue == '1' ? currentSampleAddType : SampleAddType}
                        fieldProps={{
                          style: {
                            marginBottom: 20,
                          },
                          onChange: (e) => {
                            setRadioFlag(e.target.value);
                          },
                        }}
                      />
                      <div
                        style={{
                          marginBottom: '10px',
                          // height: '130px',
                          width: '100%',
                        }}
                      >
                        {radioFlag === 1 ? (
                          <ProForm.Group>
                            <h3
                              style={{
                                display: 'inline-block',
                                margin: 0,
                              }}
                            >
                              {intl.formatMessage({id: 'sample.content'})}
                            </h3>
                            <ProFormText
                              //@ts-ignore
                              onBlur={()=>{
                                console.log(preProcessOrderFormRef?.current?.getFieldValue('sampleCount'))
                                const sampleSize = preProcessOrderFormRef?.current?.getFieldValue('sampleCount') / 81
                                const boardSize = Math.ceil(sampleSize)
                                setShowUseBoard(true)
                                setUserBoardSize(boardSize)
                                setAdviceSampleSize(boardSize*81)

                              }}
                              fieldProps={{
                                style: {
                                  width: '100%',
                                },
                                onBlur: () => {
                                  setSampleNum(
                                    preProcessOrderFormRef?.current?.getFieldValue('sampleCount'),
                                  );
                                },
                              }}
                              name="sampleCount"
                              label={`${intl.formatMessage({id: 'samples.total'})}`}
                              rules={[
                                {
                                  required: true,
                                  pattern: /^[1-9]\d*$/,
                                  message: `${intl.formatMessage({id: 'input.sample.tip'})}`,
                                },
                              ]}
                            />
                            {showUseBoard?<div style={{color: "green"}}><WarningOutlined />将使用{userBoardSize}块孔板, 建议样本数量{adviceSampleSize}</div>: <></>}
                          </ProForm.Group>
                        ) : radioFlag == 2 ? (
                          <>
                            <h3
                              style={{
                                display: 'block',
                                margin: 0,
                              }}
                            >
                              {intl.formatMessage({id: 'sample.content'})}
                            </h3>
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => {
                                setDetailModalFlag(true);
                                setSelectedRowKeys(selectedAllRowKeys);
                              }}
                            >
                              {intl.formatMessage({id: 'to.check'})}
                            </Button>
                            <div>
                              {intl.formatMessage({id: 'selected.samples.count'})}:
                              <p
                                style={{
                                  color: '#1890ff',
                                  fontSize: '24px',
                                  display: 'inline-block',
                                  margin: 0,
                                }}
                              >
                                {selectedSampleCount}
                              </p>
                            </div>
                            <Modal
                              visible={detailModalFlag}
                              title={`${intl.formatMessage({id: 'check'})}`}
                              width={1200}
                              onCancel={async () => {
                                setDetailModalFlag(false);
                              }}
                              onOk={() => {
                                if (selectedRowKeys.length == 0) {
                                  setSelectedSampleCount(0);
                                  setSelectedAllRowKeys([]);
                                } else {
                                  setSelectedSampleCount(
                                    [...new Set([...selectedRowKeys, ...selectedAllRowKeys])].length,
                                  );
                                  //数组去重
                                  setSelectedAllRowKeys([
                                    ...new Set([...selectedRowKeys, ...selectedAllRowKeys]),
                                  ]);
                                }
                                setDetailModalFlag(false);
                              }}
                            >
                              <ProTable<Sample, Pagination>
                                actionRef={tableRef}
                                rowKey="id"
                                loading={loading}
                                size="small"
                                // search={false}
                                toolBarRender={false}
                                tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                                  <Space size={24}>
                                <span>
                                   {selectedRowKeys.length} <FormattedMessage id='selected'/>
                                  <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                                    <FormattedMessage id='unselect'/>
                                  </a>
                                </span>
                                  </Space>
                                )}
                                pagination={{
                                  total,
                                  pageSize: TargetTablePageSize,
                                }}
                                request={doSampleList}
                                columns={buildProcessSampleColumn()}
                                rowSelection={{
                                  selectedRowKeys,
                                  onChange: (newSelectedRowKeys: Key[]) => {
                                    setSelectedRowKeys(newSelectedRowKeys);
                                  },
                                }}
                              />
                            </Modal>
                          </>
                        ) : radioFlag === 3 ? (
                          <>
                            <h3
                              style={{
                                display: 'inline-block',
                                margin: 0,
                              }}
                            >
                              <FormattedMessage id='sample.content'/>
                            </h3>
                            <ProFormUploadButton name="file" title={<FormattedMessage id='please.upload.file'/>}/>
                          </>
                        ) : (
                          <></>
                        )}
                        <Divider />
                      </div>
                    </ProForm>
                  </Card>
                </Tabs.TabPane>
              </Tabs>
              </Card>
            </Col>
            <Col span={21}>
              <Card>
              <EditableProTable
                formRef={orderFormRef}
                scroll={{x: 'max-content'}}
                headerTitle={<FormattedMessage id='worksheet'/>}
                actionRef={tableRef}
                rowKey="id"
                loading={loading}
                size="middle"
                // @ts-ignore
                rowClassName={(record, index) => {
                  if (record.type===2) {
                    return `${styles.orderTableActiveRow}`

                  }
                }}
                search={{labelWidth: 120}}
                tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                  <Space size={24}>
                    <span>
                      {selectedRowKeys.length} <FormattedMessage id='selected'/>
                      <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                        <FormattedMessage id='unselect'/>
                      </a>
                    </span>
                  </Space>
                )}
                pagination={{
                  total,
                  pageSize: TargetTablePageSize,
                }}
                request={doPreProcessOrderList}
                columns={preOrderListcolumns}
                rowSelection={{
                  selectedRowKeys: preProcessRowKeys,
                  onChange: (newSelectedRowKeys: Key[]) => {
                    setPreProcessRowKeys(newSelectedRowKeys);
                  },
                }}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  onValuesChange: (record, item) => {
                    doOrderEdit(record);
                  },
                  actionRender: (row: any, config, defaultDom) => {
                    return [
                      <a onClick={() => {
                        setOrderListItem(row);
                        setOrderEditableVisible(true);
                      }}><FileSearchOutlined/><FormattedMessage id='worksheet'/></a>,

                      <a href={API_URL + '/preorder/export?id=' + row.id}><ExportOutlined/><FormattedMessage id='export'/></a>
                      ,
                      <a style={{color: "purple"}} onClick={(e) => {
                        setShowCopyOrderVisible(true)
                        setOrderListItem(row);
                      }}><SnippetsOutlined/><FormattedMessage id='worksheet.copy'/></a>,
                      <Popconfirm
                        title={<FormattedMessage id='delete'/>}
                        key="delete"
                        onConfirm={() => doOrderDelete(row.id)}
                      >
                        <a style={{color: "red"}}><DeleteOutlined/><FormattedMessage id='delete'/></a>
                      </Popconfirm>,
                    ];
                  },
                }}
                recordCreatorProps={false}
              />
              </Card>
              {/*样本进度弹窗*/}
              <Modal
                title={<FormattedMessage id='sample.enter.progress'/>}
                visible={queryProcessVisible}
                onCancel={()=>{
                  setQueryProcessVisible(false);
                }}
                onOk={()=>{
                  setQueryProcessVisible(false)
                }}
                width={1000}
                destroyOnClose={true}
              >
                <ProTable<Sample, Pagination>
                  scroll={{x: 'max-content'}}
                  rowKey="id"
                  loading={loading}
                  size={"small"}
                  search={{labelWidth: 120}}
                  toolBarRender={false}
                  pagination={{
                    total,
                    pageSize: 20,
                  }}
                  request={doSampleProcess}
                  columns={preOrderProcessColumn}
                />

              </Modal>


              {/*工单拷贝弹窗*/}
              <StepsForm
                stepsProps={{size: 'small'}}
                onFinish={async (values) => {
                  // 请求后端接口新建副本工单
                  const success = await doOrderCopy(values);
                  if (success) {
                    message.success(`${intl.formatMessage({id: 'worksheet.copy.success'})}`)
                  }
                  setShowCopyOrderVisible(false)
                  return true;
                }}
                stepsFormRender={(dom, submitter) => {
                  return (
                    <Modal
                      title={`${intl.formatMessage({id: 'worksheet.copy'})}`}
                      bodyStyle={{ padding: '32px 40px 48px' }}
                      visible={showCopyOrderVisible}
                      onCancel={() => {
                        setShowCopyOrderVisible(false);
                      }}
                      onOk={() => {
                        setShowCopyOrderVisible(false);
                      }
                      }
                      width={640}
                      footer={submitter}
                      destroyOnClose={true}
                      maskClosable={false}
                    >
                      {dom}
                    </Modal>
                  );

                }}
              >
                <StepsForm.StepForm
                  title={`${intl.formatMessage({id: 'worksheet.config'})}`}
                >
                  <ProFormText
                    name="owner"
                    label={`${intl.formatMessage({id: 'owner'})}`}
                    width={140}
                    initialValue={orderListItem?.owner}
                    rules={[{
                      required:true,
                      message: "Input Worksheet Owner!"
                    }]}
                  />

                  <ProFormSelect
                    name="type"
                    width="md"
                    initialValue={"1"}
                    label={`${intl.formatMessage({id: 'worksheet.type'})}`}
                    rules={[{
                      required:true,
                      message: `${intl.formatMessage({id: 'select.worksheet.type'})}`
                    }]}
                    valueEnum={{
                      2: `${intl.formatMessage({id: 'whitelist.worksheet'})}`,
                      1: `${intl.formatMessage({id: 'pretreatment.worksheet'})}`,
                    }}
                  />

                  <ProFormText
                    name="nameSuffix"
                    label={`${intl.formatMessage({id: 'copy.worksheet.name'})}`}
                    width={140}
                    initialValue={"_copy"}
                    tooltip={`${intl.formatMessage({id: 'input.worksheet.name.tip'})}`}
                    rules={[{
                      required:true,
                      message: "Input a worksheet name"
                    }]}
                    addonBefore={<Input defaultValue={orderListItem?.name} disabled={true} />}
                  />
                </StepsForm.StepForm>

                <StepsForm.StepForm
                  title={`${intl.formatMessage({id: 'config.sample'})}`}
                >
                  <ProFormRadio.Group
                    width="md"
                    label={`${intl.formatMessage({id: 'random.method'})}`}
                    name="randomMethod"
                    disabled={true}
                    initialValue={"1"}
                    valueEnum={SampleRandomMethod}
                    fieldProps={{
                      style: {
                        marginBottom: 10,
                      }
                    }}
                  />

                  <ProFormText
                    name="sampleSuffix"
                    label={`${intl.formatMessage({id: 'sample.suffix'})}`}
                    width={140}
                    tooltip={`${intl.formatMessage({id: 'input.sample.suffix.tip'})}`}
                    initialValue={"_a"}
                    rules={[{
                      required:true,
                      message: "Input sample suffix"
                    }]}
                    addonBefore={<Input defaultValue={"sampleId"} disabled={true}/>}
                  />

                  <ProFormText
                    name="boardSuffix"
                    label={`${intl.formatMessage({id: 'global.plate.suffix'})}`}
                    tooltip={`${intl.formatMessage({id: 'input.global.plate.suffix.tip'})}`}
                    width={140}
                    initialValue={"_a"}
                    rules={[{
                      required:true,
                      message: "Input global plate suffix"
                    }]}
                    addonBefore={<Input defaultValue={"setNo"} disabled={true} />}
                  />
                </StepsForm.StepForm>
              </StepsForm>


                {/* 查看工单样本的弹窗 */}
                <Modal
                  title={`${intl.formatMessage({id: 'worksheet.content'})}`}
                  visible={orderEditableVisible}
                  onCancel={() => {
                    setOrderEditableVisible(false);
                  }}
                  onOk={() => {
                    setOrderEditableVisible(false);
                  }}
                  width={1600}
                  destroyOnClose={true}
                >
                  <span style={{float: "right", marginRight: '40px'}}>
                    <Segmented value={displayMode}
                               onChange={(e)=>{
                                 console.log(e)
                               }}
                     options={[
                      {value: DISPLAY_LIST, icon: <BarsOutlined/>},
                      {value: DISPLAY_GRIDS, icon: <AppstoreOutlined/>}
                    ]}/>
                  </span>
                  <EditableProTable
                    actionRef={sampleProcessRef}
                    headerTitle={`${intl.formatMessage({id: 'worksheet.content'})}`}
                    toolBarRender={() => [
                      <Button key="out" onClick={()=>{
                        setQueryProcessVisible(true)
                      }}>
                        {`${intl.formatMessage({id: 'query.progress'})}`}
                      </Button>,
                    ]}
                    tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                      <Space size={24}>
                      <span>
                        {selectedRowKeys.length}  {`${intl.formatMessage({id: 'selected'})}`}
                        <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                          {`${intl.formatMessage({id: 'unselect'})}`}
                        </a>
                      </span>
                      </Space>
                    )}
                    search={false}
                    size="small"
                    rowKey="id"
                    pagination={{
                      total: orderItemTotal,
                      pageSize: 20,
                    }}
                    request={(params: any) => {
                      const result = doGetOrderSampleList({
                        ...params,
                        id: orderListItem?.id,
                      });
                      return result;
                    }}
                    recordCreatorProps={false}
                    columns={buildSamplePositionColumn(orderListItem?.arrangementType)}
                    editable={{
                      type: 'multiple',
                      editableKeys: orderEditableKeys,
                      onChange: setOrderEditableRowKeys,
                      onValuesChange: (record) => {
                        doEditProcessOrder({
                          orderId: orderListItem?.id,
                          sampleId: record?.id,
                          status: record?.isValid,
                          // volume: record?.volume,
                          sampleStatus: record?.sampleStatus,
                          description: record?.description,
                        });
                      },
                    }}
                  />
                </Modal>
                {/*白名单样本弹窗*/}
                <Modal
                  title={`${intl.formatMessage({id: 'whitelist.sample.location'})}`}
                  width={500}
                  visible={showPosition}
                  destroyOnClose={true}
                  onOk={() => {
                    setShowPosition(false)
                  }}
                  onCancel={() => {
                    setShowPosition(false)
                  }}
                >
                  {whitePosition.map((_item: {
                    boardPosition: any;
                    boardType: any;
                    sampleNo: {} | null | undefined;
                  }) => {
                    return (
                      <div>
                        <Card title={_item.boardType} style={{color: "blue", textAlign: "center", fontSize: "20px"}}>
                          {_item.boardPosition}
                        </Card>
                      </div>
                    );
                  })}
                </Modal>
                {/* 录入样本的弹窗 */}
                <Modal
                  title={`${intl.formatMessage({id: 'enter.sample'})}`}
                  width={1400}
                  visible={addSampleVisible}
                  destroyOnClose={true}
                  maskClosable={false}
                  onOk={() => {
                    setAddSampleVisible(false);
                    setUserAdd(false)
                    // 置空 孔板数据
                    // setActiveSampleNo("")
                    setBlurSampleValue("")
                    setBlurSampleData([])
                    setBoardSampleList([])
                    setBoardArr([])
                    setWaterBoardNO('')
                  }}
                  onCancel={() => {
                    // setActiveSampleNo("")
                    setBlurSampleValue('')
                    setBlurSampleData([])
                    setAddSampleVisible(false);
                    setUserAdd(false)
                    // 置空 孔板数据
                    setBoardSampleList([])
                    setBoardArr([])
                    setWaterBoardNO('')
                  }}
                  okText={<div>{`${intl.formatMessage({id: 'generate.worksheet'})}`}</div>}
                >
                  <>
                    <Form
                      form={addSampleForm}
                      layout="horizontal"
                      style={{display: 'inline-block',}}
                      onFinish={(value) => {
                        handleSampleConfirm(value.sampleNo);
                        setBlurSampleValue("");
                      }}
                    >
                      <Form.Item
                        name="sampleNo"
                        label={`${intl.formatMessage({id: 'sample.no'})}`}
                        style={{width: "300px", display: 'inline-block'}}
                        tooltip={`${intl.formatMessage({id: 'sample.no.tip'})}`}
                        rules={[
                          {
                            required: true,
                            message: 'Input Correct Sample No',
                          },
                        ]}
                      >
                        <Select
                          disabled={
                            preProcessOrderItem?.sampleTotal <=
                            preProcessOrderItem?.sampleSize
                          }
                          ref={addSampleRef}
                          autoFocus={true}
                          showSearch
                          value={blurSampleValue}
                          placeholder="Input Correct Sample No"
                          defaultActiveFirstOption={true}
                          showArrow={false}
                          filterOption={false}
                          onSearch={getBlurSearchData}
                          onChange={handleBlurChange}
                          notFoundContent={'No Related Sample'}
                        >
                          {blurSampleData.map((_item) => {
                            return <Option key={_item.sampleNo}>{_item.sampleNo}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                      <Button type="primary" htmlType="submit" style={{display: 'inline-block', marginLeft: "2px"}}
                              onClick={() => {
                                setUserAdd(true)
                                addSampleRef.current.focus()
                              }}>
                        {`${intl.formatMessage({id: 'confirm.add'})}`}
                      </Button>
                    </Form>
                    {samplePosition.map((item, index) => {
                      //字符串根据:分割
                      if (
                        PlateType[preProcessOrderItem?.arrangementType * 1]
                          .text == item.boardType && userAdd
                      ) {
                        return (
                          <div
                            key={`sam${index}`}
                            className={`${styles.selectedSampleType} ${PlateType[
                            preProcessOrderItem?.arrangementType * 1
                              ] == item.boardType
                              ? styles.selected
                              : ''
                            }`}
                            style={{display: 'inline-block', marginLeft: '10px'}}
                          >
                            <div
                              style={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                width: '180px',
                                display: 'inline-block',
                                marginLeft: '10px',
                              }}
                            >
                              <FormattedMessage id='plate.type'/>：<span style={{color: "#1890ff"}}>{item.boardType}</span>
                            </div>
                            <div style={{display: "inline-block", marginLeft: '10px'}}>
                              <FormattedMessage id='global.plate.no'/>：
                              <div className={`${styles.selectedSampleTypeText} ${styles.activeSampleTypeText}`}>
                                {item.boardPosition.split(':')[0]}
                              </div>
                            </div>
                            <div style={{display: "inline-block", marginLeft: '20px'}}>
                              <FormattedMessage id='sample.position'/>：
                              <div className={`${styles.selectedSampleTypeText} ${styles.activeSampleTypeText}`}>
                                {item.boardPosition.split(':')[1]}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                    <span style={{display: 'inline-block', marginLeft: '20px', fontSize: '14px'}}><FormattedMessage id='sample.size.entered'/> /<FormattedMessage id='sample.total'/> :
                    <span
                      className={styles.selectedSampleTypeText}> {sampleSize}
                    </span>
                    /
                    <span
                      className={styles.selectedSampleTypeText}>{preProcessOrderItem?.sampleTotal === null ? 0 : preProcessOrderItem?.sampleTotal}
                    </span>
                  </span>
                    <span style={{float: "right", marginRight: '40px'}}>
                    <Segmented value={displayMode}
                               onChange={async (value: any) => {
                                 // 查询孔板板号
                                 const boardNoList = await preProcessOrderService.findBoardNo({
                                   id: preProcessOrderItem.id,
                                 })
                                 setBoardNoList(boardNoList?.data);
                                 // 根据工单id + 板子id 查询
                                 // 若确实查询时有板子的值则使用，默认查询 1号板子的新
                                 setDisplayMode(value)
                                 setAddSampleBoardIndex(1)
                                 setCurrentBoardNo(boardNoList?.data[0])
                                 const res = await preProcessOrderService.findBoardNoSample({
                                   id: preProcessOrderItem.id,
                                   boardNo: currentBoardNo?currentBoardNo:boardNoList?.data[0]
                                 });

                                 let boardSize = res?.data[0]?.boardSize ? res.data[0].boardSize : 1
                                 setBoardSize(boardSize)

                                 // set全局板号
                                 let waterBoardNo = res?.data[0]?.boardNo ? res.data[0].boardNo : boardNoList?.data[0]
                                 setWaterBoardNO(waterBoardNo)

                                 let boardOption = [];
                                 // 生成一个1-boardSize的数组
                                 for (let i = 1; i <= boardSize; i++) {
                                   boardOption.push(i)
                                 }
                                 setBoardArr(boardOption)

                                 // 按samplePosition分组
                                 const data = res.data.filter((res1: { samplePosition: any; }) => {
                                   return res1.samplePosition
                                 }).map((item: { sampleNo: any; samplePosition: any }) => {
                                   return {key: item.samplePosition, value: item.sampleNo}
                                 })
                                 // 构造一个81位数的数组，若在直接填充，若不在则补充 ""
                                 const originArr = new Array(81).fill("")
                                 data.forEach((item: { key: any; value: any; }) => {
                                   originArr[Number(item.key)] = item.value
                                 })
                                 // 随机录入
                                 setBoardSampleList(originArr);
                               }
                               }
                               options={[
                                 {value: DISPLAY_LIST, icon: <BarsOutlined/>},
                                 {value: DISPLAY_GRIDS, icon: <AppstoreOutlined/>}
                               ]}/>
                  </span>
                    {displayMode === DISPLAY_LIST ?
                      <ProTable
                        formRef={addSampleTableRef}
                        scroll={{x: 'max-content'}}
                        actionRef={addSampleActionRef}
                        search={false}
                        // toolBarRender={false}
                        options={{fullScreen: true, density: false}}
                        style={{width: "1300px"}}
                        rowKey="sampleId"
                        size="small"
                        tableAlertRender={({selectedRows, onCleanSelected}) => (
                          <Space size={24}>
                            <span key={'span'}>
                              {addSampleSelectRowKeys.length} <FormattedMessage id='selected'/>
                            </span>
                            <a key={'delete'} onClick={()=>{
                              const sampleNoList = selectedRows.map((item)=>{
                                return item.sampleNo
                              })
                              doRemoveSample(sampleNoList)
                              setAddSampleSelectRowKeys([])
                              preProcessOrderItem.sampleSize = preProcessOrderItem?.sampleSize - sampleNoList.length
                              setPreProcessOrderItem(preProcessOrderItem);
                            }}><FormattedMessage id='batch.delete'/></a>
                          </Space>
                        )}
                        pagination={{
                          current: findSampleListPagination?.current,
                          total: findSampleListPagination?.total,
                          pageSize: findSampleListPagination?.pageSize,
                        }}
                        rowSelection={{
                          addSampleSelectRowKeys,
                          onChange: (newAddSampleSelectRowKeys: Key[]) => {
                            setAddSampleSelectRowKeys(newAddSampleSelectRowKeys)
                        }
                        }}
                        request={doGetFindSampleList}
                        columns={addSampleListColumn(preProcessOrderItem?.arrangementType)}
                        rowClassName={(record, index) => {
                          // TODO 查询接口 如果没有添加，添加完后，展示在第一个，第一个高亮；如果已经添加过，返回的数据中有样本位置，展示在对应位置，对应位置高亮
                          if (record.sampleNo === activeSampleNo) {
                            return `${styles.tableActiveRow}`
                          }
                          if (index == 0) {
                            // return `${styles.tableActiveRow}`
                            return ''
                          } else {
                            return ''
                          }
                        }}
                      /> :
                      <div style={{width: '1300px', margin: '0 auto'}}>
                        <div className={styles.sampleGradBoard}>
                          <ProForm submitter={false}>
                            <ProFormSelect
                              width={120}
                              name="status"
                              valueEnum={PlateType}
                              initialValue='1'
                              // @ts-ignore
                              onChange={async (value: any) => {
                                // 根据工单id + 板子id 查询
                                // 默认查询 1号板子的新
                                const res = await preProcessOrderService.findBoardSample({
                                  id: preProcessOrderItem.id,
                                  boardNo: 1
                                });
                                const data = res.data.filter((res1: { samplePosition: any; }) => {
                                  return res1.samplePosition
                                }).map((item: { sampleNo: any; samplePosition: any }) => {
                                  return {key: item.samplePosition, value: item.sampleNo}
                                })
                                // 构造一个81位数的数组，若在直接填充，若不在则补充 ""
                                const originArr = new Array(81).fill("")
                                data.forEach((item: { key: any; value: any; }) => {
                                  originArr[Number(item.key)] = item.value
                                })
                                // 随机录入
                                setBoardSampleList(originArr);
                                setBoardType(value);
                              }
                              }
                            />
                          </ProForm>
                        </div>
                        <div className={styles.sampleGrad}>
                          <div>
                            全局孔板号：
                            <Select value={currentBoardNo ? currentBoardNo : 1}
                                    style={{width: 80}}
                                    bordered={false}
                                    // options={boardNoList}
                                    onChange={async (value: any) => {
                                      console.log(value)
                                      setCurrentBoardNo(value)
                                      // 请求后端接口，重新渲染
                                      // 按samplePosition分组
                                      const res = await preProcessOrderService.findBoardNoSample({
                                        id: preProcessOrderItem.id,
                                        boardNo: value
                                      });
                                      // 按samplePosition分组
                                      const data = res?.data?.filter((res1: { samplePosition: any; }) => {
                                        return res1.samplePosition
                                      })?.map((item: { sampleNo: any; samplePosition: any }) => {
                                        return {key: item.samplePosition, value: item.sampleNo}
                                      })
                                      // 构造一个81位数的数组，若在直接填充，若不在则补充 ""
                                      const originArr = new Array(81).fill("")
                                      data?.forEach((item: { key: any; value: any; }) => {
                                        originArr[Number(item.key)] = item.value
                                      })
                                      // 随机录入
                                      setBoardSampleList(originArr);
                                      setWaterBoardNO(value)
                                    }
                                    }
                            >
                              {
                                boardNoList.map((_item: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: Key | null | undefined) => {
                                  return <Option
                                    //@ts-ignore
                                    key={_item}>
                                    {_item}</Option>;
                                })}
                            </Select>
                          </div>

                        </div>

                        <WaterMark
                          rotate={0}
                          content={waterBoardNo ? waterBoardNo : ''}
                          fontColor='rgba(0,0,0,0.1)'
                          fontSize={initNumArray[0].includes(waterBoardNo) ? 300 : 300}
                          zIndex={100}
                          width={1000}
                          height={1000}
                          offsetLeft={initNumArray[0].includes(waterBoardNo) ? 550 : 450}
                          offsetTop={initNumArray[0].includes(waterBoardNo) ? 450 : 400}
                        >
                          {
                            boardType === '1' ?
                              <Row>
                                <Col
                                  //@ts-ignore
                                  width={40}>
                                  <div className={styles.nineNineLeftContentIndex0}/>
                                  <div className={styles.gridLeft}>
                                    {
                                      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((item, index) => {
                                        return (
                                          <div
                                            className={styles.nineNineLeftContent}>{item}</div>
                                        )
                                      })
                                    }
                                  </div>
                                </Col>
                                <Col span={23}>
                                  <div className={styles.gridHead}>
                                    {
                                      [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index: number) => {
                                        return (
                                          <div className={styles.nineNineHeadContent}
                                               key={`head${index}`}>{item}</div>
                                        )
                                      })
                                    }
                                  </div>
                                  <div className={styles.grid} onClick={() => {
                                  }
                                  }
                                  >
                                    {
                                      boardSampleList.map((item: {} | null | undefined, index: number) => {
                                        return (
                                          <div key={`sample${index}`} style={{position: "relative"}}
                                               className={item == '' ? styles.nineNineInValidContent : item == activeSampleNo ? styles.active : styles.nineNineContent}>
                                            {item}

                                            <div className={styles.show}><Popconfirm title={`${intl.formatMessage({id: 'confirm.delete'})}`} key="delete"
                                                                                     onConfirm={() => {
                                                                                       const newBoardSampleList = boardSampleList;
                                                                                       const targetSampleNo = newBoardSampleList.indexOf(item);
                                                                                       newBoardSampleList[targetSampleNo] = ''
                                                                                       setBoardSampleList(newBoardSampleList)

                                                                                       // 更新preorder 总数
                                                                                       const newPreProcessOrderItem = preProcessOrderItem;
                                                                                       newPreProcessOrderItem?.sampleList.splice(index, 1)
                                                                                       // 把某一个值给减1
                                                                                       newPreProcessOrderItem.sampleSize = newPreProcessOrderItem?.sampleSize - 1
                                                                                       setSampleSize(newPreProcessOrderItem.sampleSize)
                                                                                       setPreProcessOrderItem(newPreProcessOrderItem)
                                                                                       doDeleteSample(item)
                                                                                     }}>
                                              <div><DeleteOutlined /> </div>
                                            </Popconfirm></div>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>

                                </Col>
                              </Row>
                              : boardType === '2' ?
                                <Row>
                                  <Col width={40}>
                                    <div className={styles.nineNineLeftContentIndex0}/>
                                    <div className={styles.gridLeftNinetySix}>
                                      {
                                        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((item, index) => {
                                          return (
                                            <div
                                              className={styles.nineNineLeftContent}>{item}</div>
                                          )
                                        })
                                      }
                                    </div>
                                  </Col>
                                  <Col span={23}>
                                    <div className={styles.gridHeadNinetySix}>
                                      {
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => {
                                          return (
                                            <div className={styles.ninetySixHeadContent}>{item}</div>
                                          )
                                        })
                                      }
                                    </div>
                                    <div className={styles.gridNinetySix}>
                                      {
                                        boardSampleList.map((item: {} | null | undefined, index: Key | null | undefined) => {
                                          return (
                                            <div key={index} style={{position: "relative"}}
                                                 className={item == '' ? styles.ninetySixInValidContent : item == activeSampleNo ? styles.activeNinetySix : styles.ninetySixContent}>
                                              {item}
                                              <div className={styles.show}><Popconfirm title={`${intl.formatMessage({id: 'confirm.delete'})}`} key="delete"
                                                                                       onConfirm={() => {
                                                                                         const newBoardSampleList = boardSampleList;
                                                                                         const targetSampleNo = newBoardSampleList.indexOf(item);
                                                                                         newBoardSampleList[targetSampleNo] = ''
                                                                                         setBoardSampleList(newBoardSampleList)


                                                                                         // 更新preorder 总数
                                                                                         const newPreProcessOrderItem = preProcessOrderItem;
                                                                                         newPreProcessOrderItem?.sampleList.splice(index, 1)
                                                                                         // 把某一个值给减1
                                                                                         newPreProcessOrderItem.sampleSize = newPreProcessOrderItem?.sampleSize - 1
                                                                                         setSampleSize(newPreProcessOrderItem.sampleSize)
                                                                                         setPreProcessOrderItem(newPreProcessOrderItem)
                                                                                         doDeleteSample(item)
                                                                                       }}>
                                                <div><DeleteOutlined /></div>
                                              </Popconfirm></div>
                                            </div>
                                          )
                                        })
                                      }
                                      {
                                        ['blk', 'blk', 'blk', 'mix', 'mix', 'mix', 'ref'].map((item, index) => {
                                          return (
                                            <div key={index}
                                                 className={item == 'blk' ? styles.blankContent : item == 'mix' ? styles.mixContent : item == 'ref' ? styles.refContent : styles.ninetySixInValidContent}
                                            >
                                              {item}
                                            </div>
                                          )
                                        })
                                      }
                                      {
                                        [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                                          return (
                                            <div key={index} className={styles.otherContent}
                                            />
                                          )
                                        })
                                      }
                                    </div>
                                  </Col>
                                </Row>
                                :
                                <Row>
                                  <Col width={40}>
                                    <div className={styles.nineNineLeftContentIndex0}/>
                                    <div className={styles.gridLeft}>
                                      {
                                        ['1', '10', '19', '28', '37', '46', '55', '64', '73'].map((item, index) => {
                                          return (
                                            <div
                                              className={styles.nineNineLeftContent}>{item}</div>
                                          )
                                        })
                                      }
                                    </div>
                                  </Col>
                                  <Col span={23}>
                                    <div className={styles.gridHead}>
                                      {
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item,) => {
                                          return (
                                            <div className={styles.nineNineHeadContent}>{item}</div>
                                          )
                                        })
                                      }
                                    </div>
                                    <div className={styles.grid} onClick={() => {
                                      console.log("boardSampleList", boardSampleList)
                                    }
                                    }>
                                      {
                                        boardSampleList.map((item: {} | null | undefined, index: number) => {
                                          return (
                                            <div key={index} style={{position: "relative"}}
                                                 className={item == '' ? styles.nineNineInValidContent : item == activeSampleNo ? styles.active : styles.nineNineContent}>
                                              {item}
                                              <div className={styles.show}><Popconfirm title={`${intl.formatMessage({id: 'confirm.delete'})}`} key="delete"
                                                                                       onConfirm={() => {
                                                                                         const newBoardSampleList = boardSampleList;
                                                                                         const targetSampleNo = newBoardSampleList.indexOf(item);
                                                                                         newBoardSampleList[targetSampleNo] = ''
                                                                                         setBoardSampleList(newBoardSampleList)

                                                                                         // 更新preorder 总数
                                                                                         const newPreProcessOrderItem = preProcessOrderItem;
                                                                                         newPreProcessOrderItem?.sampleList.splice(index, 1)
                                                                                         // 把某一个值给减1
                                                                                         newPreProcessOrderItem.sampleSize = newPreProcessOrderItem?.sampleSize - 1
                                                                                         setSampleSize(newPreProcessOrderItem.sampleSize)
                                                                                         setPreProcessOrderItem(newPreProcessOrderItem)
                                                                                         doDeleteSample(item)
                                                                                       }}>
                                                <div><DeleteOutlined /></div>
                                              </Popconfirm></div>
                                            </div>

                                          )
                                        })
                                      }
                                    </div>
                                  </Col>
                                </Row>
                          }
                        </WaterMark>

                      </div>
                    }
                  </>
                </Modal>
            </Col>
          </Row>
        </>
),
},
  {
    title: `${intl.formatMessage({id: 'ms.acquisition'})}`,
    content:
    (
      <div>
        <Row>
          <Col span={3}>
            <Card>
              <ProForm
                // size="middle"
                layout="vertical"
                formRef={collectionFormRef}
                onFinish={async (e) => {
                  if (incomingSampRowKeys.length == 0) {
                    message.warning(`${intl.formatMessage({id: 'select.sample'})}`);
                    return;
                  }
                  if (!preHeartData) {
                    message.warning(`${intl.formatMessage({id: 'select.warmup.table'})}`);
                    return;
                  }

                  e.preHeartData = preHeartData;
                  e.workCurveData = workCurveData;
                  e.incomingSamData = incomingSampRowKeys;
                  try {
                    const success = await doMSOrderCreate(e);
                    if (success) {
                      collectionFormRef.current?.resetFields();
                      setPreHeartData(null);
                      setWorkCurveData(null);
                      setIncomingSampRowKeys([]);
                    }
                  } catch (error) {
                    message.error(`${intl.formatMessage({id: 'submit.failed'})}`);
                  }
                }}
                submitter={{
                  searchConfig: {
                    submitText: `${intl.formatMessage({id: 'submit.worksheet'})}`,
                  },
                  // 配置按钮的属性
                  resetButtonProps: {
                    style: {
                      // 隐藏重置按钮
                      // display: 'none',
                    },
                  },
                }}
              >
                <ProFormText
                  width="md"
                  name="owner"
                  label={`${intl.formatMessage({id: 'owner'})}`}
                  rules={[{required: true, message: 'Owner is required'}]}
                  tooltip={`${intl.formatMessage({id: 'input.max.length.24'})}`}
                  placeholder="Owner"
                />
                <ProFormCascader
                  width="md"
                  name="specSampMethod"
                  rules={[{required: true, message: 'MS Acq is required'}]}
                  label={`${intl.formatMessage({id: 'ms.acquisition.method'})}`}
                  fieldProps={{
                    dropdownClassName: `${styles.specSampMethod}`,
                    options: devicePlatforms,
                  }}
                  placeholder="please select"
                />
                {/*<ProFormText*/}
                {/*  name="colorSpectrumCode"*/}
                {/*  rules={[{ required: false, message: '色谱柱编号不能为空' }]}*/}
                {/*  label="色谱柱编号"*/}
                {/*  tooltip="色谱柱编号可填写多个，按逗号分割。 示例：a,b"*/}
                {/*  placeholder="请输入色谱柱编号,示例:a,b"*/}
                {/*/>*/}
                <div
                  style={{
                    marginBottom: '20px',
                  }}
                >
                  <p style={{margin: '0px'}}>{`${intl.formatMessage({id: 'select.sample'})}`}</p>
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowRunSample(true);
                    }}
                  >
                    {incomingSampRowKeys.length > 0 ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a"/>
                    ) : (
                      ''
                    )}
                    {intl.formatMessage({id: 'select.by.pretreatment'})}
                  </Button>
                </div>

                <Modal
                  visible={showRunSample}
                  title={`${intl.formatMessage({id: 'select.plate'})}`}
                  width={1200}
                  onOk={async () => {
                    setShowRunSample(false);
                    return true;
                  }}
                  onCancel={() => {
                    setShowRunSample(false);
                  }}
                >
                  <ProTable<OrderBoard, Pagination>
                    scroll={{x: 'max-content'}}
                    headerTitle={`${intl.formatMessage({id: 'select.plate'})}`}
                    actionRef={tableRef}
                    rowKey="boardId"
                    loading={loading}
                    size="small"
                    search={{
                      labelWidth: 120,
                    }}
                    toolBarRender={false}
                    tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                      <Space size={24}>
                          <span>
                            {selectedRowKeys.length} {`${intl.formatMessage({id: 'selected'})}`}
                            <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                              {`${intl.formatMessage({id: 'unselect'})}`}
                            </a>
                          </span>
                      </Space>
                    )}
                    pagination={{
                      total,
                      pageSize: 20,
                    }}
                    request={findOrderBoard}
                    columns={buildOrderBoardColumn()}
                    rowSelection={{
                      selectedRowKeys: incomingSampRowKeys,
                      onChange: (newSelectedRowKeys: Key[]) => {
                        setIncomingSampRowKeys(newSelectedRowKeys);
                      },
                    }}
                  />
                </Modal>

                <div>
                  <p style={{margin: '0px'}}>{`${intl.formatMessage({id: 'pre.acquisition.worksheet'})}`}</p>
                  <Button
                    style={{display: 'block', marginBottom: '5px'}}
                    onClick={() => {
                      setPreHeartTable(true);
                    }}
                  >
                    {preHeartData ? <CheckCircleTwoTone twoToneColor="#52c41a"/> : ''}
                    {`${intl.formatMessage({id: 'warmup.table'})}`}
                  </Button>
                  <Button
                    style={{display: 'block', marginBottom: '25px'}}
                    onClick={() => {
                      setWorkCurve(true);
                    }}
                  >
                    {workCurveData ? <CheckCircleTwoTone twoToneColor="#52c41a"/> : ''}
                    {`${intl.formatMessage({id: 'working.curve'})}`}
                  </Button>
                </div>
                <PreHeartTable
                  visible={preHeartTable}
                  value={
                    collectionFormRef?.current?.getFieldValue('specSampMethod')
                      ? collectionFormRef?.current?.getFieldValue('specSampMethod')[0]
                      : ''
                  }
                  onOk={(data) => {
                    setPreHeartData(data);
                    setPreHeartTable(false);
                  }}
                  onCancel={() => {
                    setPreHeartData(null);
                    setPreHeartTable(false);
                  }}
                />

                <WorkCurve
                  visible={workCurve}
                  value={
                    collectionFormRef?.current?.getFieldValue('specSampMethod')
                      ? collectionFormRef?.current?.getFieldValue('specSampMethod')[0]
                      : ''
                  }
                  onOk={(data) => {
                    setWorkCurveData(data);
                    setWorkCurve(false);
                  }}
                  onCancel={() => {
                    setWorkCurveData(null);
                    setWorkCurve(false);
                  }}
                />
              </ProForm>
            </Card>
          </Col>
          <Col span={21}>
            <Card>
              {/* <h2>质谱工单</h2> */}
              <ProTable<MSOrder, Pagination>
                scroll={{x: 'max-content'}}
                headerTitle={`${intl.formatMessage({id: 'ms.worksheet.list'})}`}
                actionRef={tableRef}
                rowKey="id"
                loading={loading}
                size="middle"
                search={{span: 4}}
                tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
                  <Space size={24}>
                      <span>
                        {selectedRowKeys.length} {`${intl.formatMessage({id: 'selected'})}`}
                        <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                          {`${intl.formatMessage({id: 'unselect'})}`}
                        </a>
                      </span>
                  </Space>
                )}
                pagination={{
                  total,
                  pageSize: TargetTablePageSize,
                }}
                request={doMSList}
                columns={buildMSOrderColumn(
                  updateFormRef,
                  doGetMSOrderSampleList,
                  doMsOrderDelete,
                )}
                rowSelection={{
                  selectedRowKeys: specSampleRowKeys,
                  onChange: (newSelectedRowKeys: Key[]) => {
                    setSpecSampleRowKeys(newSelectedRowKeys);
                  },
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    ),
  }
,
  {
    title: `${intl.formatMessage({id: 'file.conversion'})}`,
    content:
    (
      <div>
        <ProCard split="vertical">
          <ProCard colSpan="384px" ghost>
            <ProTable<MSOrder, Pagination>
              columns={ipColumns}
              request={doMSList}
              rowKey="msOrder"
              toolBarRender={false}
              options={false}
              pagination={false}
              search={false}
              onRow={(record) => {
                return {
                  onClick: (value) => {
                    setIp(record.name)
                    const result = doMsOrderBatch({msOrderName: record.name})
                    console.log("value", result)
                  },
                };
              }}
            />
          </ProCard>
          <ProCard title={ip}>
            <ProTable<MsBatchConvert, Pagination>
              columns={detailColumns}
              dataSource={msOrderBatchList}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
              }}
              rowKey="msOrder"
              // toolBarRender={false}
              search={false}
            />
          </ProCard>
        </ProCard>

        <Modal
          visible={showBatchDetailVisible}
          title={`${intl.formatMessage({id: 'file.conversion.detail'})}`}
          width={1200}
          destroyOnClose={true}
          onOk={async () => {
            setShowBatchDetailVisible(false);
            return true;
          }}
          onCancel={() => {
            setShowBatchDetailVisible(false);
          }}
        >
          <ProTable<MsBatchSampleConvert, Pagination>
            columns={fileConvertColumn}
            request={(params: any) => {
              const res = queryFileCovertStatus({
                ...params,
                msOrderName: ip,
                boardId: convertFileData
              });
              return res;
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            rowKey="msOrder"
            // toolBarRender={false}
            search={false}

            onRow={record => {
              return {
                onClick: event => {
                  setShowDrawerBatchForm(false)
                  setSelectedBatch(record)
                }
              }
            }}
          />

          <DrawerForm
            onVisibleChange={setShowDrawerBatchForm}
            title={`${intl.formatMessage({id: 'file.conversion.detail'})}`}
            width={400}
            visible={showDrawerBatchForm}
            onFinish={async () => {
              return true
            }
            }
          >
            <ProForm.Group>
              <ProFormText initialValue={selectedBatch?.sampleNo} width="md" name="id" label={`${intl.formatMessage({id: 'sample.no'})}`} disabled={true}/>
              <ProFormText initialValue={selectedBatch?.status} width="md" name="status" label={`${intl.formatMessage({id: 'status'})}`}
                           disabled={true}/>
              <ProFormText initialValue={selectedBatch?.fileName} width="md" name="fileName" label={`${intl.formatMessage({id: 'file.name'})}`}
                           disabled={true}/>


              <ProFormText initialValue={selectedBatch?.createDate} width="md" name="createDate" label={`${intl.formatMessage({id: 'create.date'})}`}
                           disabled={true}/>
              <ProFormText initialValue={selectedBatch?.lastModifiedDate} width="md" name="lastModifiedDate"
                           label={`${intl.formatMessage({id: 'update.date'})}`} disabled={true}/>

            </ProForm.Group>
          </DrawerForm>

        </Modal>
      </div>
    ),
  }
,
  {
    title: `${intl.formatMessage({id: 'data.analysis'})}`,
    content:
    (
      <div>
        <h1><FormattedMessage id={"not.open"}/></h1>
      </div>
    ),
  }
,
];

return (
  <>
    <Card
      style={{
        height: '100%',
      }}
    >
      <Steps
        type="navigation"
        size="small"
        labelPlacement="vertical"
        current={current}
        onChange={onChange}
        className="site-navigation-steps"
      >
        {projectSteps.map((item) => (
          <Step key={item.title} title={item.title}/>
        ))}
      </Steps>
      <div className="steps-content">{projectSteps[current]?.content}</div>
    </Card>

    {/*批量样本确认upload弹窗*/}
    <ExcelUpload
      addCoverStrDesc={`${intl.formatMessage({id: 'confirm.save'})}`}
      newAddStrDesc={`${intl.formatMessage({id: 'upload.sample.file.tip.1'})}`}
      outVoStr=""
      draggerStr={`${intl.formatMessage({id: 'download.to.fill.tip'})}`}
      id={projectId}
      coverStr={`${intl.formatMessage({id: 'save'})}`}
      // newAddStr="保存"
      title={`${intl.formatMessage({id: 'import.sample.by.excel'})}`}
      visible={sampleExcelVisible}
      setVisible={setSampleExcelVisible}
      standardFileUrl={`${url}/static/SampleTemplate.xlsx`}
      actionUrl={`${url}/sample/check/excel`}

      uploadHandle={async function (addMode: number, file: any): Promise<boolean> {
        setSampleExcelFile(file);
        setExistSampleExcelValue(true);
        return true;
      }}

    />


    {/* 样本接收excel导入 */}
    <ExcelUpload
      addCoverStrDesc={`${intl.formatMessage({id: 'sample.overwrite.warning'}) + "," + intl.formatMessage({id: 'confirm.overwrite'})}`}
      newAddStrDesc={`${intl.formatMessage({id: 'upload.sample.file.tip.1'})}`}
      outVoStr=""
      draggerStr={`${intl.formatMessage({id: 'download.to.fill.tip'})}`}
      id={projectId}
      coverStr={`${intl.formatMessage({id: 'overwrite.current.sample'})}`}
      newAddStr={`${intl.formatMessage({id: 'create.sample'})}`}
      title={`${intl.formatMessage({id: 'import.sample.by.excel'})}`}
      visible={showExcelUpload}
      setVisible={setShowExcelUpload}
      standardFileUrl={`${url}/static/SampleTemplate.xlsx`}
      actionUrl={`${url}/sample/check/excel`}
      uploadHandle={async function (addMode: number, file: any): Promise<boolean> {
        const res = await sampleService.uploadExcel({
          projectId: projectId,
          addMode: addMode,
          file: file,
        });
        if (res.success) {
          if (res.data.length) {
            Modal.warning({
              title: `${intl.formatMessage({id: 'samples.not.imported.successful.exist'})}`,
              content: <>`${intl.formatMessage({id: 'samples.not.imported.successful'})}`..</>,
            });
          } else {
            message.success(`${intl.formatMessage({id: 'upload.success'})}`);
          }
          tableRef?.current?.reload();
          return true;
        } else {
          if (res.data.length && res.data instanceof Array) {
            Modal.warning({
              title: `${intl.formatMessage({id: 'samples.not.imported.successful.exist'})}`,
              content: <>`${intl.formatMessage({id: 'samples.not.imported.successful'})}`..</>,
            });
          }
          return false;
        }
      }}
    />

    {/* 前处理白名单样本excel导入 */}
    <ExcelUpload
      addCoverStrDesc= {`${intl.formatMessage({id: 'confirm.save'}) + intl.formatMessage({id: 'confirm.whitelist.samples.are.subset.of.system.sample.library'})}`}
      newAddStrDesc=""
      outVoStr=""
      draggerStr={`${intl.formatMessage({id: 'download.whitelist.to.fill.tip'})}`}
      id={projectId}
      coverStr={`${intl.formatMessage({id: 'save'})}`}
      title={`${intl.formatMessage({id: 'import.whitelist.samples'})}`}
      visible={showWhiteExcelUpload}
      setVisible={setShowWhiteExcelUpload}
      standardFileUrl={`${url}/static/WhiteListTemplate.xlsx`}
      actionUrl={`${url}/preorder/check/excel`}
      uploadHandle={async function (addMode: number, file: any): Promise<boolean> {
        setWhiteExcelFile(file);
        setExistExcelValue(true);
        return true;
      }}
    />
  </>
);
};

export default ProjectDetail;

