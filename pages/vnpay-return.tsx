import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import vnpayService from '@/services/vnpay-service';
import Link from 'next/link';

const VnpayReturnPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchReturnResult = async () => {
      try {
        const res = await vnpayService.handleReturn(router.query);

        if (res.result) {
          // Trích xuất orderId từ vnp_OrderInfo
          const orderInfo = router.query.vnp_OrderInfo;
          const matched = typeof orderInfo === 'string'
            ? orderInfo.match(/\d{10,}/)
            : null;

          const orderId = matched?.[0];

          if (orderId) {
            router.replace(`/checkout/success?orderId=${orderId}`);
            return;
          } else {
            setErrorMessage('Không thể xác định mã đơn hàng từ thông tin trả về.');
          }
        } else {
          setErrorMessage(res.message || 'Thanh toán thất bại.');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage('Đã xảy ra lỗi khi xác thực giao dịch.');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnResult();
  }, [router, router.isReady, router.query]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-6 text-center">
        {loading ? (
          <p className="text-gray-500">Đang xử lý thanh toán...</p>
        ) : errorMessage ? (
          <>
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Về trang chủ
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default VnpayReturnPage;
