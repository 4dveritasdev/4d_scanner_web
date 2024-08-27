// Styles
import "./App.css";

// React
import { useEffect, useState } from "react";

// Components
import QrReader from "./components/QrReader";
import { getQRInfo } from "./utils/helper";

function App() {
  const [openQr, setOpenQr] = useState<boolean>(false);
  const [qrInfo, setQrInfo] = useState<string>('');
  const [productInfo, setProductInfo] = useState<any>(null);

  useEffect(() => {
    if (qrInfo !== '') {
      (async () => {
        const data = await getQRInfo(qrInfo);
        setProductInfo(data);
      })()
    }
  }, [qrInfo]);

  console.log(productInfo);

  return (
    <div>
      <button onClick={() => setOpenQr(!openQr)}>
        {openQr ? "Close" : "Open"} QR Scanner
      </button>
      {openQr && <QrReader setOpenQr={setOpenQr} setQrInfo={setQrInfo}/>}
      {!openQr && productInfo && <div>
        {productInfo}
      </div>}
    </div>
  );
}

export default App;
