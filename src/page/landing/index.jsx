import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import auto_process from "../../assets/image/landingPage/work_process.svg";
import workup from "../../assets/image/landingPage/report_an.svg";
import remote_mng from "../../assets/image/landingPage/remote_mng.svg";
import bg from "../../assets/image/landingPage/bg.jpg";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleStart = () => {
    window.location.href = `hitech://${window.location.host}/electron`;
  };
  useEffect(() => {
    if (window.electron) {
      navigate("/electron/");
    } else {
      setLoading(false);
    }
  }, []);
  return (
    !loading && (
      <div className="w-full overflow-auto scroll-smooth">
        <Helmet>
          <title>Hoàng Long DJC</title>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <meta
            property="og:title"
            content="Công ty Cung ứng Nhân lực Hoàng Long DJC"
          />
          <meta
            property="og:description"
            content="Chuyên cung ứng nhân lực chất lượng cao cho các cụm khu công nghiệp với quy trình chuyên nghiệp, minh bạch, uy tín hàng đầu."
          />
          <meta
            property="og:image"
            content="https://hl-djc.vieclamvp.vn/images/thumbnail-hoanglong.jpg"
          />
          <meta property="og:url" content="https://hl-djc.vieclamvp.vn" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Hoàng Long DJC" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Công ty Cung ứng Nhân lực Hoàng Long DJC"
          />
          <meta
            name="twitter:description"
            content="Cung ứng nhân lực cho các cụm khu công nghiệp và hỗ trợ việc làm cho người lao động uy tín."
          />
          <meta
            name="twitter:image"
            content="https://hl-djc.vieclamvp.vn/images/thumbnail-hoanglong.jpg"
          />
        </Helmet>
        <header className="bg-[#008cff] text-white p-4 fadeIn-down">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Hoàng Long DJC</h1>
            <nav className="space-x-6">
              <a
                href="#features"
                className="hover:underline transition duration-300 ease-in-out hover:text-gray-300"
              >
                Tính năng
              </a>
              <a
                href="#about"
                className="hover:underline transition duration-300 ease-in-out hover:text-gray-300"
              >
                Giới thiệu
              </a>
              <a
                href="#contact"
                className="hover:underline transition duration-300 ease-in-out hover:text-gray-300"
              >
                Liên hệ
              </a>
            </nav>
          </div>
        </header>
        <section
          className="bg-white text-center py-24 fadeIn-10"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundPosition: `center`,
          }}
        >
          <h2 className="text-5xl font-bold text-[#008cff] mb-4">
            Phần mềm quản lý doanh nghiệp hiện đại
          </h2>
          <p className="text-lg mb-6">
            Nâng cao hiệu suất, giảm chi phí vận hành và tối ưu hoá quy trình
            doanh nghiệp với Phần mềm mới.
          </p>
          <Link
            to="/files/app.zip"
            className="bg-[#008cff] text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-[#0070d4] transition-all duration-300"
          >
            Tải xuống cho máy tính
          </Link>
          <button
            onClick={() => navigate("/app")}
            className="bg-[#02a2d3] ml-3 text-[#fff] px-6 py-3 rounded-full font-semibold hover:scale-105 hover:text-white hover:bg-[#0070d4] transition-all duration-300"
          >
            Dùng bản Web
          </button>
          <button
            onClick={handleStart}
            className="bg-[#02b4d3] ml-3 text-[#fff] px-6 py-3 rounded-full font-semibold hover:scale-105 hover:text-white hover:bg-[#0070d4] transition-all duration-300"
          >
            Mở ứng dụng
          </button>
        </section>
        <section id="features" className="p-20 bg-gray-50 fadeIn-up">
          <div className="container mx-auto">
            <h3 className="text-3xl font-semibold mb-8 text-[#008cff] text-center">
              Tính năng nổi bật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <img
                    src={auto_process}
                    className="max-h-[200px] h-[200px] inline-block fadeIn-6"
                  />
                </div>
                <div className="pb-6 px-6">
                  <h4 className="text-xl font-bold mb-2">Quản lý quy trình</h4>
                  <p>
                    Tự động hoá các quy trình vận hành, tiết kiệm thời gian và
                    nguồn lực.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <img
                    src={workup}
                    className="w-[200px] max-h-[200px] h-[200px] inline-block fadeIn-6"
                  />
                </div>
                <div className="pb-6 px-6">
                  <h4 className="text-xl font-bold mb-2">
                    Phân tích & Báo cáo
                  </h4>
                  <p>
                    Cung cấp báo cáo chi tiết, hỗ trợ ra quyết định nhanh chóng
                    và chính xác.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <img
                    src={remote_mng}
                    className="w-[200px] max-h-[200px] h-[200px] inline-block fadeIn-6"
                  />
                </div>
                <div className="pb-6 px-6">
                  <h4 className="text-xl font-bold mb-2">
                    Bảo mật & Đa nền tảng
                  </h4>
                  <p>
                    Hệ thống bảo mật cao, hoạt động tốt trên mọi thiết bị và nền
                    tảng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="pt-10 pb-15 bg-white fadeIn-up">
          <div className="container mx-auto text-center">
            <h2 className="text-[16px] mb-5 text-[#999]">Được cung cấp bởi</h2>
            <h3 className="text-3xl font-semibold mb-6 text-[#008cff]">
              Công ty phát triển phầm mềm HiTech
            </h3>
            <div className="text-center">
              <p className="max-w-[600px] inline-block">
                ``Chúng tôi là đội ngũ chuyên gia công nghệ cung cấp các giải
                pháp số giúp doanh nghiệp Việt Nam hiện đại hoá và phát triển
                bền vững trong kỷ nguyên vương mình.´´
              </p>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="py-20 bg-[#008cff] text-white fadeIn-up"
        >
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-semibold mb-6">
              Liên hệ với chúng tôi
            </h3>
            <p>
              Gửi yêu cầu tư vấn miễn phí ngay hôm nay để nhận giải pháp phù hợp
              nhất cho doanh nghiệp của bạn!
            </p>
            {/* <button className="mt-4 bg-white text-[#008cff] px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300">
              Nhận tư vấn
            </button> */}
          </div>
        </section>
        <footer className="bg-gray-900 text-white text-center py-4 animate-fade-in-up">
          <div className="">© 2025 HiTech - All rights reserved.</div>
          <div className="">© 2025 Hoàng Long DJC - All rights reserved.</div>
        </footer>
      </div>
    )
  );
};

export default LandingPage;
