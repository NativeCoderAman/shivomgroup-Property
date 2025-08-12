export const getOldReadingsMap = data => {
  return data?.map(item => ({
    roomno: item?.meterChangeRecords?.roomno || item?.roomno,
    total_old_reading: item?.meterChangeRecords?.total_old_reading || 0,
  }));
};
