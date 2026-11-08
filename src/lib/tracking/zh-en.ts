/**
 * Offline glosses for tracking text. A line is translated only when every
 * part matches a known logistics pattern. Anything else stays untranslated.
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const CITIES: ReadonlyArray<[string, string]> = [
  ["呼和浩特", "Hohhot"],
  ["乌鲁木齐", "Urumqi"],
  ["石家庄", "Shijiazhuang"],
  ["哈尔滨", "Harbin"],
  ["齐齐哈尔", "Qiqihar"],
  ["连云港", "Lianyungang"],
  ["秦皇岛", "Qinhuangdao"],
  ["张家口", "Zhangjiakou"],
  ["景德镇", "Jingdezhen"],
  ["马鞍山", "Maanshan"],
  ["牡丹江", "Mudanjiang"],
  ["深圳", "Shenzhen"],
  ["广州", "Guangzhou"],
  ["东莞", "Dongguan"],
  ["上海", "Shanghai"],
  ["北京", "Beijing"],
  ["杭州", "Hangzhou"],
  ["宁波", "Ningbo"],
  ["厦门", "Xiamen"],
  ["泉州", "Quanzhou"],
  ["福州", "Fuzhou"],
  ["青岛", "Qingdao"],
  ["天津", "Tianjin"],
  ["苏州", "Suzhou"],
  ["义乌", "Yiwu"],
  ["金华", "Jinhua"],
  ["佛山", "Foshan"],
  ["中山", "Zhongshan"],
  ["惠州", "Huizhou"],
  ["武汉", "Wuhan"],
  ["长沙", "Changsha"],
  ["郑州", "Zhengzhou"],
  ["成都", "Chengdu"],
  ["重庆", "Chongqing"],
  ["西安", "Xi'an"],
  ["昆明", "Kunming"],
  ["南宁", "Nanning"],
  ["海口", "Haikou"],
  ["沈阳", "Shenyang"],
  ["大连", "Dalian"],
  ["长春", "Changchun"],
  ["济南", "Jinan"],
  ["合肥", "Hefei"],
  ["南京", "Nanjing"],
  ["无锡", "Wuxi"],
  ["温州", "Wenzhou"],
  ["嘉兴", "Jiaxing"],
  ["绍兴", "Shaoxing"],
  ["南昌", "Nanchang"],
  ["贵阳", "Guiyang"],
  ["兰州", "Lanzhou"],
  ["银川", "Yinchuan"],
  ["西宁", "Xining"],
  ["太原", "Taiyuan"],
  ["珠海", "Zhuhai"],
  ["汕头", "Shantou"],
  ["香港", "Hong Kong"],
  ["澳门", "Macau"],
  ["台湾", "Taiwan"],
  ["中国", "China"],
  ["美国", "the United States"],
  ["日本", "Japan"],
  ["英国", "the United Kingdom"],
  ["德国", "Germany"],
  ["法国", "France"],
  ["加拿大", "Canada"],
  ["新加坡", "Singapore"],
  ["马来西亚", "Malaysia"],
  ["泰国", "Thailand"],
  ["越南", "Vietnam"],
  ["韩国", "South Korea"],
  ["澳大利亚", "Australia"],
];

const FACILITIES: ReadonlyArray<[string, string]> = [
  ["国际转运中心", "international transit center"],
  ["转运中心", "transit center"],
  ["分拨中心", "sorting center"],
  ["处理中心", "processing center"],
  ["操作中心", "operating center"],
  ["收货点", "receiving point"],
  ["交货点", "handover point"],
  ["营业部", "branch"],
  ["仓库", "warehouse"],
  ["机场", "airport"],
  ["口岸", "port"],
  ["网点", "service point"],
  ["站点", "station"],
];

const WHOLE: ReadonlyArray<[string, string]> = [
  ["货物电子信息已经收到", "Electronic shipment information received"],
  ["电子信息已经收到", "Electronic information received"],
  ["海关放行", "Released by customs"],
  ["清关完成", "Customs clearance completed"],
  ["清关中", "In customs clearance"],
  ["正在派送", "Out for delivery"],
  ["派送中", "Out for delivery"],
  ["已装柜", "Loaded into the container"],
  ["已出库", "Left the warehouse"],
  ["已入库", "Received into the warehouse"],
  ["已揽收", "Picked up"],
  ["已发货", "Shipped"],
  ["已到港", "Arrived at the port"],
  ["已开船", "Vessel departed"],
  ["已签收", "Signed for"],
  ["待取件", "Ready for pickup"],
  ["投递失败", "Delivery attempt failed"],
  ["运输中", "In transit"],
  ["转运中", "In transit"],
  ["揽收", "Picked up"],
  ["签收", "Signed for"],
  ["已退回", "Returned"],
  ["退回", "Returned"],
  ["异常", "Exception"],
  ["暂扣", "Held"],
];

export type TrackingGloss = { state: "plain" } | { state: "translated"; english: string } | { state: "unavailable" };

const CJK = /[\u3400-\u9fff]/;

export function hasChinese(value: string): boolean {
  return CJK.test(value);
}

function forMatch(input: string): string {
  return input
    .normalize("NFKC")
    .trim()
    .replace(/[。．]+$/g, "")
    .replace(/\/+$/g, "")
    .trim()
    .replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff])/g, "$1");
}

function monthDay(monthText: string, dayText: string): string | null {
  const month = Number(monthText);
  const day = Number(dayText);
  if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${MONTHS[month - 1]} ${day}`;
}

function flight(monthText: string, dayText: string): string | null {
  const when = monthDay(monthText, dayText);
  return when ? `${when} flight` : null;
}

const CITIES_BY_LENGTH = [...CITIES].sort((left, right) => right[0].length - left[0].length);
const FACILITIES_BY_LENGTH = [...FACILITIES].sort((left, right) => right[0].length - left[0].length);

function place(raw: string): string | null {
  let rest = raw;
  let city = "";
  for (const [zh, en] of CITIES_BY_LENGTH) {
    if (rest.startsWith(zh)) {
      city = en;
      rest = rest.slice(zh.length);
      break;
    }
  }
  let facility = "";
  for (const [zh, en] of FACILITIES_BY_LENGTH) {
    if (rest.startsWith(zh)) {
      facility = en;
      rest = rest.slice(zh.length);
      break;
    }
  }
  if (rest.length > 0 || (!city && !facility)) return null;
  if (city && facility) return `the ${city} ${facility}`;
  if (facility) return `the ${facility}`;
  return city;
}

function glossNormalized(text: string): string | null {
  const flightStatus = /^转运中(\d{1,2})\/(\d{1,2})号航班$/.exec(text);
  if (flightStatus) {
    const when = flight(flightStatus[1] ?? "", flightStatus[2] ?? "");
    return when ? `In transit — ${when}` : null;
  }
  const flightOnly = /^(\d{1,2})\/(\d{1,2})号航班$/.exec(text);
  if (flightOnly) return flight(flightOnly[1] ?? "", flightOnly[2] ?? "");
  const sent = /^(?:货件|货物)信息已发送给\s*(.+)$/.exec(text);
  if (sent) {
    const who = (sent[1] ?? "").trim();
    if (/^[A-Za-z0-9][A-Za-z0-9 .&+-]*$/.test(who)) return `Shipment information sent to ${who}`;
    return null;
  }
  const left = /^(货物)?离开(.+)$/.exec(text);
  if (left) {
    const where = place(left[2] ?? "");
    if (!where) return null;
    return left[1] ? `Shipment left ${where}` : `Left ${where}`;
  }
  const arrived = /^到达(.+)$/.exec(text);
  if (arrived) {
    const where = place(arrived[1] ?? "");
    return where ? `Arrived at ${where}` : null;
  }
  for (const [zh, en] of WHOLE) {
    if (text === zh) return en;
  }
  return place(text);
}

/** Translate one displayed tracking line, or report that no safe gloss exists. */
export function glossTrackingText(input: string): TrackingGloss {
  const source = input.trim();
  if (!source || !hasChinese(source)) return { state: "plain" };
  const parts = forMatch(source)
    .split(/[，,;；]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return { state: "unavailable" };
  const english = parts.map(glossNormalized);
  if (english.some((part) => !part)) return { state: "unavailable" };
  return { state: "translated", english: english.join(". ") };
}
