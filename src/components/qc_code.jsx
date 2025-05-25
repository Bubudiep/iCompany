import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const QrCodeComponent = ({
  data = "https://example.com",
  image = null,
  width = 150,
  height = 150,
  color = "#0088cc",
  backgroundColor = "#fff",
  dotsType = "classy",
}) => {
  const ref = useRef(null);
  const qrCodeRef = useRef(null);
  useEffect(() => {
    console.log("data qr", data);
    if (ref.current) {
      ref.current.innerHTML = ""; // clear container
    }
    qrCodeRef.current = new QRCodeStyling({
      width: width,
      height: height,
      type: "svg",
      data: data,
      image: image,
      dotsOptions: {
        color: color,
        type: dotsType,
      },
      cornersSquareOptions: {
        color: color,
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: color,
        type: "dot",
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 3,
        imageSize: 0.3,
      },
    });

    // Gắn QR vào DOM
    if (ref.current) {
      qrCodeRef.current.append(ref.current);
    }
  }, [data, image, width, height, color, backgroundColor, dotsType]);

  return <div ref={ref} />;
};

export default QrCodeComponent;
