export const BaselineMethod = {
  TOLERANCE: { text: 'TOLERANCE', value: 'TOLERANCE' },
  NONE: { text: 'NONE', value: 'NONE' },
};

export const DataType = {
  QCMap: 'QCMap',
  MS1: 'MS1',
  MS2: 'MS2',
  ISArea: 'ISArea',
  ISColumn: 'ISColumn',
  ISEIC: 'ISEIC(Smooth)',
  ISMassAccuracy: 'ISMassAccuracy',
};

export const CheckStatus = {
  Success: { text: 'Success', value: 0 },
  Failed: { text: 'Failed', value: 1 },
  Unknown: { text: 'Unknown', value: 2 },
};

export const CompType = {
  Common: { text: 'Common', value: 'Common' },
  IS: { text: 'Internal Standard.ts', value: 'IS' },
  RS: { text: 'Recovery Standard.ts', value: 'RS' },
  Endogenous: { text: 'Endogenous', value: 'Endogenous' },
};

export const EnergyLevel = [
  { text: 'Low', value: 'Low' },
  { text: 'Med', value: 'Med' },
  { text: 'High', value: 'High' },
];

export const FragMod = [
  { text: 'CID', value: 'CID' },
  { text: 'HCD', value: 'HCD' },
  { text: 'ETD', value: 'ETD' },
];

export const IonizationMod = [
  { text: 'ESI', value: 'ESI' },
  { text: 'EI', value: 'EI' },
];

export const MigrationStrategy = [
  { text: 'None', value: 'None' },
  { text: 'Override', value: 'Override' },
  { text: 'Combine', value: 'Combine' },
];

export const NoiseEstimateMethod = {
  SLIDING_WINDOW_PEAK: { text: 'SLIDING_WINDOW_PEAK', value: 'SLIDING_WINDOW_PEAK' },
  WAVELET_COEFF_PEAK: { text: 'WAVELET_COEFF_PEAK', value: 'WAVELET_COEFF_PEAK' },
  PROPRO_EIC: { text: 'PROPRO_EIC', value: 'PROPRO_EIC' },
  AMPLITUDE_EIC: { text: 'AMPLITUDE_EIC', value: 'AMPLITUDE_EIC' },
  PERCENTAGE_EIC: { text: 'PERCENTAGE_EIC', value: 'PERCENTAGE_EIC' },
};

export const PeakFindingMethod = {
  PROPRO: { text: 'PROPRO', value: 'PROPRO' },
  MZMINE: { text: 'MZMINE', value: 'MZMINE' },
  WAVELET: { text: 'WAVELET', value: 'WAVELET' },
  LOCAL_MINIMUM: { text: 'LOCAL_MINIMUM', value: 'LOCAL_MINIMUM' },
  SAVITZKY_GOLAY: { text: 'SAVITZKY_GOLAY', value: 'SAVITZKY_GOLAY' },
};

export const Polarity = {
  Negative: { text: 'Negative', value: 'Negative' },
  Positive: { text: 'Positive', value: 'Positive' },
};

export const RunType = {
  SAM: { text: 'SAM', value: 'SAM' },
  REF: { text: 'REF', value: 'REF' },
  MIX: { text: 'MIX', value: 'MIX' },
  BLK: { text: 'BLK', value: 'BLK' },
};

export const MsType = {
  PROFILE: { text: 'PROFILE', value: 'PROFILE' },
  CENTROIDED: { text: 'CENTROIDED', value: 'CENTROIDED' },
};

export const ProjectStatus = {
  START: { text: 'Ready', value: 1},
  SAMPLE_ACCEPT: { text: 'Sample Receiving', value: 2 },
  PRE_PROCESS: { text: 'Pretreatment', value: 3 },
  DATA_COLLECTION: { text: 'MS Acquisition', value: 4 },
  FILE_CONVERT: { text: 'File Conversion', value: 5 },
  PRE_CONTROL: { text: 'PreQC', value: 6 },
  DATA_ANALYSIS: { text: 'Data Analysis', value: 7 },
  FINISHED: { text: 'Finished', value: 8 },
};

export const ProjectStatusLV = [
  {key: 1, label: 'Ready', value: 1},
  {key: 2, label: 'Sample Receiving', value: 2},
  {key: 3, label: 'Pretreatment', value: 3},
  {key: 4, label: 'MS Acquisition', value: 4},
  {key: 5, label: 'File Conversion', value: 5},
  {key: 6, label: 'PreQC', value: 6},
  {key: 7, label: 'Data Analysis', value: 7},
  {key: 8, label: 'Finished', value: 8},
]

export const SampleStatus = {
  1: { text: 'Normal', value: 1 },
  2: { text: 'Abnormal', value: 2 },
};

export const SampleStatusLV = [
  {key:'1', label: 'Normal', value: 1 },
  {key:'2', label: 'Abnormal', value: 2 },
];

export const VolumeUnit = {
  1: { text: 'μl', value: 1 },
  2: { text: 'ml', value: 2 },
};

export const SampleRandomMethod = {
  1: { text: '板子随机', value: 1 },
  2: { text: '样本随机', value: 2 },
};

export const Dims = {
  1: { text: 'dim1', value: '1' },
  2: { text: 'dim2', value: '2' },
  3: { text: 'dim3', value: '3' },
}

export const PlateNumberType = {
  number: { text: '1-N', value: 'number' },
  sequence: { text: 'A-Z', value: 'sequence' },
}

export const RandomMethod = {
  1: {text: 'Complete Randomization', value:1},
  2: {text: 'Block Randomization', value:2}
}

export const BalanceMethodEnum = {
  '1': 'Random Balance',
  '2': 'Stratified Balance'
}

export const RandomMethodEnum = {
  '1': 'Complete Random',
  '2': 'Block Random'
}

export const DimsEnum = {
  '1': 'dim1',
  '2': 'dim2',
  '3': 'dim3',
}

export const PlateNumber = {
  '1': 'A-Z',
  '2': '1-N'
}

export const DirectionEnum = {
  '1': 'Horizontal',
  // '2': 'Vertical',
}

export const PlateTypeEnum = {
  '1': '81 well (9*9)',
  '2': '96 well (8*12)',
  '3': '384 well (16*24)'
}

export const SampleAddType1 = {
  1: { text: '人工录入', value: 1 },
  2: { text: '样本勾选', value: 2 },
  3: { text: 'Excel导入', value: 3 },
};
export const SampleAddType = [
  { label: '人工录入', value: 1 },
  { label: '样本勾选', value: 2 },
  { label: 'Excel导入', value: 3 },
];

export const WhiteListSampleAddType = [
  { label: 'Excel', value: 3 },
];

export const PlateType = {
  1: { text: '9*9样本板', value: 1 },
  2: { text: '96孔板', value: 2 },
  3: { text: 'ep管', value: 3 },
};

export const PlateTypeEN = {
  1: { text: '81 well (9*9)', value: 1 },
  2: { text: '96 well (8*12)', value: 2 },
  3: { text: '384 well (16*24)', value: 3 },
  // 3: { text: 'EP bottle', value: 3 },
};

export const DirectionTypeEN = {
  1: { text: 'Horizontal', value: 1 },
  2: { text: 'Vertical', value: 2 },
};

export const SampleBoardType = {
  2: { text: '96孔板', value: 2 },
  4: { text: 'ep管', value: 4 },
};

export const PlatformStatus = {
  '1': { text: 'Online', value: '1' },
  '2': { text: 'Offline', value: '2' },
};

export const SmoothMethod = {
  LINEAR: { text: 'LINEAR', value: 'LINEAR' },
  GAUSS: { text: 'GAUSS', value: 'GAUSS' },
  SAVITZKY_GOLAY: { text: 'SAVITZKY_GOLAY', value: 'SAVITZKY_GOLAY' },
  PROPRO_GAUSS: { text: 'PROPRO_GAUSS', value: 'PROPRO_GAUSS' },
  NONE: { text: 'NONE', value: 'NONE' },
};

export const SpectrumSource = {
  Deconvoluted: { text: 'Deconvoluted', value: 'Deconvoluted' },
  Standard: { text: 'Standard', value: 'Standard' },
  Raw: { text: 'Raw', value: 'Raw' },
};

export const SpectrumType = {
  MS1: { text: 'MS1', value: 'MS1' },
  MS2: { text: 'MS2', value: 'MS2' },
};

export const TaskStatus = {
  UNKNOWN: { text: 'UNKNOWN', value: 'UNKNOWN' },
  WAITING: { text: 'WAITING', value: 'WAITING' },
  RUNNING: { text: 'RUNNING', value: 'RUNNING' },
  SUCCESS: { text: 'SUCCESS', value: 'SUCCESS' },
  FAILED: { text: 'FAILED', value: 'FAILED' },
  EXCEPTION: { text: 'EXCEPTION', value: 'EXCEPTION' },
};

export const TraceOuterType = {
  Project: { text: 'Project', value: 'Project' },
  Library: { text: 'Library', value: 'Library' },
};

export const Template = {
  SCAN_AND_UPDATE_RUNS: { text: 'Scan Runs', value: 'SCAN_AND_UPDATE_RUNS' },
  UPLOAD_LIBRARY_FILE: { text: 'Upload Library', value: 'UPLOAD_LIBRARY_FILE' },
  EXTRACTOR: { text: 'XIC', value: 'EXTRACTOR' },
  LIBRARY_PUSH: { text: 'Push Library', value: 'LIBRARY_PUSH' },
  TARGET_ANALYZE_WITH_RT: { text: 'RT Targeted Analysis', value: 'TARGET_ANALYZE_WITH_RT' },
  TARGET_ANALYZE_WITH_RI: { text: 'RI Targeted Analysis', value: 'TARGET_ANALYZE_WITH_RI' },
  PRE_QC: { text: 'PreQC', value: 'PRE_QC' },
  RI_CALIBRATION: { text: 'RI Calibration', value: 'RI_CALIBRATION' },
  BUILD_LIBRARY: { text: 'Build Library', value: 'BUILD_LIBRARY' },
};

export const LibraryType = {
  INS: { text: 'INS', value: 'INS' },
  ANA: { text: 'ANA', value: 'ANA' },
};

export const SupportPlatForm = {
  pos: { text: 'pos', value: 'pos' },
  neg: { text: 'neg', value: 'neg' },
  HILIC: { text: 'HILIC', value: 'HILIC' },
  lippos: { text: 'lippos', value: 'lippos' },
  GC: { text: 'GC', value: 'GC' },
};

export const DeviceType = {
  '6500+': { text: '6500+', value: '6500+' },
  "HF": { text: 'HF', value: 'HF' },
  'HFX-1': { text: 'HFX-1', value: 'HFX-1' },
  'HFX-2': { text: 'HFX-2', value: 'HFX-2' },
  'GCMS-1': { text: 'GCMS-1', value: 'GCMS-1' },
  'GCMS-2': { text: 'GCMS-2', value: 'GCMS-2' },
};
