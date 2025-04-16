import config from '@/configs';

export const createApiImageUrl = (imagePath: string) => {
  const baseUrl = config.baseApiUrl;
  return `${baseUrl}/images/${imagePath}`;
};

export const formatPriceVND = (price: string) => {
  const priceNumber = Number(price);
  if (priceNumber === 0) return 'Giá liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceNumber);
};
