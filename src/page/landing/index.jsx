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
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = "/#contact";
      }
    }, 300);
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
          <title>HiTech | Giải pháp ứng dụng quản lý doanh nghiệp</title>
          <meta
            name="description"
            content="HiTech cung cấp các giải pháp ứng dụng công nghệ tiên tiến giúp doanh nghiệp tối ưu hoá quy trình quản lý và vận hành hiệu quả."
          />
          <meta
            name="keywords"
            content="HiTech, quản lý doanh nghiệp, giải pháp công nghệ, phần mềm quản lý, chuyển đổi số"
          />
          <meta
            property="og:title"
            content="HiTech | Giải pháp ứng dụng quản lý doanh nghiệp"
          />
          <meta
            property="og:description"
            content="Tối ưu hoá quy trình, nâng tầm doanh nghiệp cùng HiTech."
          />
          <meta property="og:type" content="website" />
        </Helmet>
        <header className="bg-[#008cff] text-white p-4 fadeIn-down">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">HiTech.</h1>
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
            Giải pháp quản lý doanh nghiệp hiện đại
          </h2>
          <p className="text-lg mb-6">
            Nâng cao hiệu suất, giảm chi phí vận hành và tối ưu hoá quy trình
            doanh nghiệp với HiTech.
          </p>
          <button
            onClick={handleStart}
            className="bg-[#008cff] text-white px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-[#0070d4] transition-all duration-300"
          >
            Bắt đầu ngay
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
        <section id="about" className="py-20 bg-white fadeIn-up">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-semibold mb-6 text-[#008cff]">
              Về HiTech
            </h3>
            <p>
              Chúng tôi là đội ngũ chuyên gia công nghệ cung cấp các giải pháp
              số giúp doanh nghiệp Việt Nam hiện đại hoá và phát triển bền vững
              trong kỷ nguyên 4.0.
            </p>
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
            <button className="mt-4 bg-white text-[#008cff] px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300">
              Nhận tư vấn
            </button>
          </div>
        </section>
        <footer className="bg-gray-900 text-white text-center py-4 animate-fade-in-up">
          © 2025 HiTech - All rights reserved.
        </footer>
      </div>
    )
  );
};

export default LandingPage;
