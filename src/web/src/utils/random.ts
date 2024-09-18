/**
 * 在[min-max]之间生成一个的随机整数
 * @param min 开始范围
 * @param max 结束范围
 * @returns [min-max]之间的随机整数
 */
export default (min:number, max:number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
