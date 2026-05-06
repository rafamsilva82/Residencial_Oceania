import { Unit, InterestedParty, Activity } from "./types";

export const UNITS: Unit[] = [
  { id: "101", column: "01", floor: 1, area: 78.5, value: 342500, hasCCCPM: true, status: "Ocupado", interestedCount: 12, priority: "Crítica" },
  { id: "205", column: "05", floor: 2, area: 78.5, value: 342500, hasCCCPM: true, status: "Livre", interestedCount: 0, priority: "Baixa" },
  { id: "311", column: "11", floor: 3, area: 62.0, value: 285000, hasCCCPM: false, status: "Reservado", interestedCount: 3, priority: "Média" },
  { id: "608", column: "08", floor: 6, area: 145.2, value: 1120000, hasCCCPM: true, status: "Livre", interestedCount: 42, priority: "Alta" },
  { id: "402", column: "02", floor: 4, area: 45.1, value: 180000, hasCCCPM: false, status: "Bloqueado", interestedCount: 0, priority: "Nula" },
  { id: "603", column: "03", floor: 6, area: 112.45, value: 845000, hasCCCPM: true, status: "Reservado", interestedCount: 12, priority: "Crítica" },
];

export const INTERESTED_PARTIES: InterestedParty[] = [];

export const ACTIVITIES: Activity[] = [];

export const IMAGES = {
  avatar1: "https://lh3.googleusercontent.com/aida-public/AB6AXuA35VV7BHmtd-A01ak5gEMlKD5plUJfJKAdkJTTRulgp1KB2B4sMjdFkhmAIUwphWOhImvRTpDZSJ3ucJmX5FPTAFVeYYuWDS92CypIvx0MMFpEh7TqqB06BRYvRwqKEPY4U9op1Ab6zmG0555JbRUY295PmqwQ4m8MKdlp4R9FghvjiMaFSZqm1F-VUpsJSmQygA2GyJInqYK_lO5CwiT15dMHk7Uu8shtssou4HBli05OGsQ_uEIrQhUiUur2bVtD5jr5mUoGPAQ",
  avatar2: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMW-UlAQm6bQcC3dIP19FvlpQXT9mYbB0ClAXY0YWsD3b2muQRL9ZUsKrss1AcC75iWV6A4-S3cbFM0oawnEGqx3oyZ8lGIcM4ge-gl8vK09d6voDTpFhdx402lhfKi0I6qKPanacfx_jI21c82dpAJgrLrTwfhMasiepjrG36vVudIhoP_3XZzvqaQjMTJWejVSkBWQjAyo6ImW8BtB6vQG7Wx-cmKYDc-gwJmVOLwT8_haZ1wBgEJFSFHSTsZMLaJOEKV1bTdLI",
  avatar3: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV2GmNnPa2pBGPsid06u2dBcR0_2nnL-0atWr2vEU4P7OymhPgc0usfOjv4nYR_yXKxFYQv7BeCyTn7B1CHlOzSqgxjB78ouQ7ZkGHRAlCvYmWFrGYXbZW0ToSJnIJxLhL0AbSrf_CuDkiViDF5i9RLRH1nXNvPqoF-VBkeB4qsIg3-oKRAwGpCgzGCdzoCNdOU2K4Myw7xPLKgv-krQlAYKaKWn-p9B3LDc5iIXaNSvorgseDhpIkxk16uhOzyzqL6foCafdOOlA",
  avatar4: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv_totRXJAtmj9M3RB_nrp6nrK08VryjmEmHmw1bUufhSFiPCIt1iqT9cpdngsXPAAX6mx6uU8A5gYtr9L7LZa1n4PlWtaHyvYG4OTRxLvN6wZaTdfvY10NMgvn3AuUbag93-l1weI7ekgIPO7zWYPQYZGLk1jarlVguByNRftDcYsFeIufSw-9i89IHCf1WjQq--fppVZg5ocfK1t4PgqdxQuWydPwYrw5GObQDy0-GOGw7GFYA84EyjB2XZkcJRwBg2fELZKWLM",
  building: "https://lh3.googleusercontent.com/aida/ADBb0uhb7JpJJ1JU_SzEYiqbZSH6v0tJ8KPi9FyQyPoX_lVdgsa6jMSoLndtq9kMuyt_fKqVFydeF7K8ia-r8QrYPkLF0PdcEwXN5R6ocfQmb2za-JlBMls3oYynPTdeYjK8GtfZaeiZQEeFv5Duew6tqNsHWoByOGXHZszyAI82Z_cGwcnIqya5IyHLCNdtjS3Q3HneIuJFZp88rdaEzPks4eqkfB96WLH-ufquBXHW-NHPv0cJAuim0InT7k1pLuhvBkzTEnAO0X7P_w",
  floorPlan1: "https://lh3.googleusercontent.com/aida/ADBb0ugxWheoTOG0wCAV-UW5aoQtJ5T9e1MldYpcISKMYwZirCqpPdqfiOz8Ok5J6J-Tg7O67gIi4623ypn4rhEWtZL1GRCJheXoozG6BIdmvGyFVIGiXG1ry3uc_mXqKRE_KRokJA0FsbEbZbOSyBwC2QNEc56KtAzUDD1ZU4qbFheON9_Zz5yeplLi0tSBEX3Lg3AFQZMR5VgYoi9XRPB2aaqh7ocP_L55VuyNIGEAzWzaBbvvrVULt6wmJIwK-ZrEi4Sc17bvum6mqQ",
  floorPlan2: "https://lh3.googleusercontent.com/aida/ADBb0ugSHWWT0T872-wDYLSmyqXA0gsidwruKCbMb4VUrCOMHXjdwrv5IUX1SKb3W7YHKC_1kTDJDGVsJsdZgyPN9cpM3pAb-tgFhF8gIMACWDo6bkAisdI_ZBEkggyeXioCN5yHeAoW53VZDKhF1JY_kv3l1Se95mOISj_qCkCpWF3-UrRSM1g4_4emW5A4PR5BSwfNlXNDO0-1XYuOI1YTgRRX_BHN56dPMJe-EW4Zl9TeEPy7V5RaEpuNWUIkVwNNSov-Cl-yQVharw",
  client1: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3rB3XxamVnJUAdu-KXetoLKDmMlpJGH3cML5_HOhoGdsWnMiMfYdvGEqwTkjEjFlZKl3BDg1kRHN9tTgPJZpFJgnssypsAnCD-nxFWCytR3xsXvwLLXbyLLBUdHuMPFcSwzNtY83k4D40-n2S7mh6_dueYk8lVvYl961LwaQQoNNE2qFi7_JIHke7gd2ko8h6HUtHMLa2Zkcb2as3bx66W2GHEa0YIS8Kt7hZ2kCA-Q_M1zX1KobTUZM-wkvYisQoKlnlbHWp8Iw",
  client2: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtNMGhx-GderM24gt_F78NjzQrEO9OLhVQ-hX4kyHfzZwD5UlVxkNPrRojQ5f5M6ixKPwj1Rxx_oM4yVc6i5QyyAWTxKeKCGtnxRgS1PZ0W_0E10F4rnnjyYoxAH-jkNEp2J4Z7CkxIp_h8_pDMcj5OCwXmdCtUS56t0_H8nsxrpQTqJENgCApHEBhmuo_0Sa4U9folVMadWqRmcLVvb4pgNQJwCDRaxk8B20ppxDu1E_uz7Qh3Bjtg_3vT91xc1o2Fi3LHq5Ui5I"
};
