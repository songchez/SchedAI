// 가격 계산 유틸리티 함수
export const calculatePrices = (totalAmount: number) => {
  const tax = Math.floor(totalAmount / 11);
  const price = totalAmount - tax;
  return {
    price: price.toLocaleString(),
    tax: tax.toLocaleString(),
    total: totalAmount.toLocaleString(),
  };
};
