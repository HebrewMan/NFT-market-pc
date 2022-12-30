import BigNumber from 'bignumber.js';
import _ from 'lodash'

type IType = string | BigNumber | number;
type ITypeArr = IType[];

export function toBigNumber(val: IType) {
  return BigNumber.isBigNumber(val) ? val : new BigNumber(val);
}

export function toFixed(params: any, decimalsToAppear: number = 2) {
  let bigNumber = params;
  if (bigNumber === '') {
    return '';
  }
  bigNumber = toBigNumber(bigNumber);
  
  if (Number(decimalsToAppear) === 0) {
    return bigNumber.toFixed(0);
  }
  bigNumber = bigNumber.toString();
  const reg = new RegExp('\\d*.\\d{0,' + decimalsToAppear + '}', 'g');
  // 处理次幂数据，js中返回页面显示不会有e+xx方式，所以拼接处理
  const integerArr = bigNumber.split(/(e\+\d+)/),
    // floatArr = bigNumber.split(/(e\-\d+)/);
    floatArr = bigNumber.split(/(e-\d+)/);
  // 小数点指定位数后面截断，不使用四舍五入
  
  if (floatArr.length > 1) {
    const e = floatArr[1].replace('e-', '');
    if (e < decimalsToAppear) {
      return (
        coverage(e - 1) +
        '' +
        floatArr[0].replace('.', '').slice(0, decimalsToAppear - 1)
      );
    }
    return '0.00';
  }
  const arr = integerArr[0].match(reg) || [0];
  return integerArr[1] ? arr[0] + integerArr[1] : arr[0];
}

export function sum(arr: ITypeArr, decimal?: number) {
  const _sum = BigNumber.sum.apply(null, arr);
  return decimal ? _sum.toFixed(decimal) : _sum.toString();
}

export function minus(numbera: IType, numberb: IType) {
  // 减法
  return toBigNumber(numbera).minus(toBigNumber(numberb)).toString();
}

// 乘
export function multipliedBy(value: IType, value1: IType, decimals?: number) {
  const result = toBigNumber(value).multipliedBy(toBigNumber(value1));
  if (decimals) {
    return toFixed(result, decimals);
  }
  return result.toString();
}


// 乘精度换算
export function multipliedByDecimals(
  value: string | BigNumber,
  decimals: number = 18,
) {
  // 根据精度格式化数据
  return toBigNumber(value)
    .multipliedBy(new BigNumber(1).pow(decimals))
    .toFixed();
}

export function dividedByDecimals(value: IType, decimals = 18) {
  // 精度换算 除
  return toBigNumber(value)
    .dividedBy(new BigNumber(10).pow(decimals))
    .toFixed();
}

// 除
export function dividedBy(value: IType, value1: IType) {
  return toBigNumber(value).dividedBy(toBigNumber(value1)).toString();
}

export function maximum(a: IType, b: IType) {
  return BigNumber.maximum(toBigNumber(a), toBigNumber(b)).toString();
}

export function minimum(a: IType, b: IType) {
  return BigNumber.minimum(toBigNumber(a), toBigNumber(b)).toString();
}

export function lt(a: IType, b: IType) {
  // 比较两个数字的大小
  return toBigNumber(a).isLessThan(toBigNumber(b));
}

export function lte(one: IType, two: IType) {
  // 比较两个数字的大小
  return toBigNumber(one).isLessThanOrEqualTo(toBigNumber(two));
}

export function coverage(num:any) {
  let str = '0.'
  if (num) {
    while (num--) {
      str += '0'
    }
  }
  return str
}
  /**
   * 国际数字格式化
   * 支持千分位,小数按照精度舍去，截断(向下保留)
   * @param num
   * @param precision 精度
   */
   export function intlFloorFormat(num: number, precision = 0): string | number {
    if (num === 0 || num == null || num == undefined) {
      return '0.00'
    }
    let result = ''
    let reg = new RegExp(`^\\d+(?:\\.\\d{0,${precision}})?`);
    let trimNum:any = num.toString().match(reg)
    if (trimNum == '0.0000') {
      result =  '0.00'
    }else{
      result = trimNum
    }
    return result
  }

/**
   * 数值单位转换
   * @param num
   * @param precision 精度
   */
 export function NumUnitFormat(num: IType) {
  if(num >= 10000){
    num = Math.round(Number(num) / 1000) / 10 + 'w';
  }else if (num >= 1000){
    num = Math.round(Number(num) / 100) / 10 + 'k';
  }
  return num
}
