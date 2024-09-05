// Styles
import "./App.css";

// React
import { useEffect, useState } from "react";

// Components
import QrReader from "./components/QrReader";
import { CalculateRemainPeriod, getQRInfo } from "./utils/helper";
import { Box, Button, Typography } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import YouTube from 'react-youtube';
import CameraIcon from './assets/camera_icon.png';
import YoutubeIcon from './assets/youtube-icon.png';
import Background from './assets/bg.jpg';
import BackButton from './assets/back.png';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [openQr, setOpenQr] = useState<boolean>(false);
  const [qrInfo, setQrInfo] = useState<string>('');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cImages, setCImages] = useState([]);
  const [cVideos, setCVideos] = useState([]);

  // @ts-nocheck
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);

    const qrcode = params.get('qrcode');

    if(qrcode !== null) {
      setQrInfo(qrcode);
    }
  }, []);

  useEffect(() => {
    if (qrInfo !== '') {
      // alert(qrInfo);
      if(qrInfo.startsWith('https://parisbrewerytours.com')) {
        qrInfo.replace('https://parisbrewerytours.com?qrcode=', '');
      }
      (async () => {
        const data = await getQRInfo(qrInfo);
        setProductInfo(data);
      })()
    }
  }, [qrInfo]);

  useEffect(() => {
    if (productInfo) {
      console.log('update tab');
      if (productInfo) {
        if (tabValue === 0) {
          setCImages(productInfo.images);
          setCVideos(productInfo.videos);
        } else if (tabValue === 1) {
          setCImages(productInfo.warrantyAndGuarantee.images);
          setCVideos(productInfo.warrantyAndGuarantee.videos);
        } else if (tabValue === 2) {
          setCImages(productInfo.manualsAndCerts.images);
          setCVideos(productInfo.manualsAndCerts.videos);
        }
      }

    }
  }, [tabValue, productInfo]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  console.log(productInfo);
// qmVQbOYlyQZoXm30fM4npVFh1rwiGjGlRHtsNIBiFEC1LJ1wPuE6RFqK7kEKLZe1FniDPpKKFUfvt+tA7Cofrg==

  const getYoutubeVideoIDFromUrl = (url: any): any => {
    var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if(videoid != null) {
      console.log("video id = ",videoid[1]);
      return videoid[1];
    } else {
        console.log("The youtube url is not valid.");
        return null;
    }
  }

  const opts = {
    width: '100%',
    height: window.innerWidth * 0.7,
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Box sx={{ 
        textAlign: 'center',
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: 'center',
        minHeight: window.innerHeight,
      }}>
      {!openQr && productInfo !== null && <Box sx={{ backgroundColor: 'black', color: 'white', minHeight: window.innerHeight}}>
        
        <Box sx={{ textAlign: 'left'}}>
          <Button onClick={() => {setProductInfo(null), setQrInfo('')}} sx={{minWidth: 36, mt: 1}}>
            <img src={BackButton} style={{height: 36, width: 36}} />
          </Button>
        </Box>

        <Typography sx={{ p: 5, pt: 2, fontSize: 24}} >{productInfo.name}</Typography>

        <Box sx={{ position: 'relative' }}>
          <Slide autoplay={false} onChange={(previous, next) => { console.log(previous), setCurrentIndex(next) }}>
            {cImages.map((slideImage: any, index: number) => (
              <div key={index}>
                <img src={'https://shearnode.com/api/v1/files/' + slideImage} height={window.innerWidth * 0.7} />
              </div>
            ))} 
            {cVideos.map((video: any) => (
              <YouTube videoId={getYoutubeVideoIDFromUrl(video.url)} opts={opts} />
            ))}
          </Slide>

          <Box sx={{ 
              position: 'absolute',
              bottom: 15,
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 2,
              paddingRight: 2,
              right: 10,
              borderRadius: 20,
              backgroundColor: '#444',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <img src={currentIndex < cImages.length ?  CameraIcon : YoutubeIcon} style={{height: 20, width: 20}} />
            <Typography sx={{color: 'white', fontSize: 13, marginLeft: 1}}>
              {currentIndex + 1}/{cImages.length + cVideos.length} Medias
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', pt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48, color: '#CCC' }} label="DPP" {...a11yProps(0)} />
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48, color: '#CCC'}} label="W & G" {...a11yProps(1)} />
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48, color: '#CCC'}} label="Manuals & Certs" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabValue} index={0}>
            <Box sx={{
              backgroundColor: 'white',
              color: 'black',
              p: 2,
              m: 1,
              mt: 0,
              borderRadius: 5
            }}>
              <Box sx={{display: 'flex', flexDirection: 'row'}}>
                <Box style={{flex: 1}}>
                  <Typography style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'left' }}>
                    {productInfo.model}
                  </Typography>
                </Box>
                <Box style={{flex: 1}}>
                  <Typography style={{fontSize: 13, textAlign: 'right'}}>Status : {productInfo.status}</Typography>
                  <Typography style={{fontSize: 13, textAlign: 'right'}}>MPG Date : {productInfo.mpg_time}</Typography>
                  <Typography style={{fontSize: 13, textAlign: 'right'}}>EXP Date : {productInfo.exp_time}</Typography>
                </Box>
              </Box>
              <Box style={{paddingTop: 20, display: 'flex', flexDirection: 'row'}}>
                <Box style={{flex: 2}}>
                  <Typography style={{fontSize: 13, textAlign: 'left', whiteSpace: 'pre-line'}}>{productInfo.detail}</Typography>
                </Box>
                <Box style={{flex: 1, textAlign: 'right'}}>
                  <img src={productInfo.qrcode_img} style={{width: 100, height: 100}} />
                </Box>
              </Box>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{
                backgroundColor: 'white',
                color: 'black',
                p: 2,
                m: 1,
                mt: 0,
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {!productInfo.warrantyAndGuarantee.warranty.notime && !productInfo.warrantyAndGuarantee.warranty.lifetime && <Typography style={{ fontSize: 15, textAlign: 'center', width: 200 }}>
                  The warranty for this product will expire in:
                </Typography>}
                <Typography style={{ fontSize: 15, textAlign: 'center', width: 200, paddingTop: 10, color: (!productInfo.warrantyAndGuarantee.warranty.notime && !productInfo.warrantyAndGuarantee.warranty.lifetime && CalculateRemainPeriod(productInfo.mpg_time, productInfo.warrantyAndGuarantee.warranty).duaration < 7 ? 'red' : 'black') }}>
                  
                  {!productInfo.warrantyAndGuarantee.warranty.notime && !productInfo.warrantyAndGuarantee.warranty.lifetime && CalculateRemainPeriod(productInfo.mpg_time, productInfo.warrantyAndGuarantee.warranty).string}
                  {productInfo.warrantyAndGuarantee.warranty.notime && 'No Warranty'}
                  {productInfo.warrantyAndGuarantee.warranty.lifetime && 'Lifetime Warranty'}
                </Typography>
              
                {!productInfo.warrantyAndGuarantee.guarantee.notime && !productInfo.warrantyAndGuarantee.guarantee.lifetime && <Typography style={{ fontSize: 15, textAlign: 'center', width: 220, paddingTop: 20 }}>
                  The guarantee for this product will expire in:
                </Typography>}
                <Typography style={{ fontSize: 15, textAlign: 'center', width: 200, paddingTop: 10, color: (!productInfo.warrantyAndGuarantee.guarantee.notime && !productInfo.warrantyAndGuarantee.guarantee.lifetime && CalculateRemainPeriod(productInfo.mpg_time, productInfo.warrantyAndGuarantee.guarantee).duaration < 7 ? 'red' : 'black') }}>
                  {!productInfo.warrantyAndGuarantee.guarantee.notime && !productInfo.warrantyAndGuarantee.guarantee.lifetime && CalculateRemainPeriod(productInfo.mpg_time, productInfo.warrantyAndGuarantee.guarantee).string}
                  {productInfo.warrantyAndGuarantee.guarantee.notime && 'No Guarantee'}
                  {productInfo.warrantyAndGuarantee.guarantee.lifetime && 'Lifetime Guarantee'}
                </Typography>
                
                <Typography style={{ fontSize: 15, textAlign: 'center', width: 220, paddingTop: 20 }}>
                  Be sure to inspect for and report damage or fault before expiration
                </Typography>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={2}>
            <Box sx={{
              backgroundColor: 'white',
              color: 'black',
              p: 2,
              m: 1,
              mt: 0,
              borderRadius: 5,
              textAlign: 'left'
            }}>
              
              <Typography style={{ fontSize: 15, fontWeight: 'bold' }}>
                Public
              </Typography>
              
              <Typography style={{ fontSize: 13, padding: 2, whiteSpace: 'pre-line'  }}>
                {productInfo.manualsAndCerts.public}
              </Typography>
              
              <Typography style={{ fontSize: 15, fontWeight: 'bold' }}>
                Private
              </Typography>
              
              <Typography style={{ fontSize: 13, padding: 2, whiteSpace: 'pre-line' }}>
                {productInfo.manualsAndCerts.private}
              </Typography>
            </Box>
          </CustomTabPanel>
        </Box>
        
        {!openQr && <Button variant="outlined" sx={{minWidth: '40%', color: 'white', borderColor: 'white', m: 2}} onClick={() => {setOpenQr(true), setProductInfo(null), setQrInfo('')}}>
          Scan Product
        </Button>}
      </Box>}
      
      {!openQr && productInfo === null && <Button variant="outlined" sx={{position: 'absolute', bottom: 100, left: '30%', minWidth: '40%', color: 'white', borderColor: 'white'}} onClick={() => {setOpenQr(true), setProductInfo(null), setQrInfo('')}}>
        Scan Product
      </Button>}

      {/* {!openQr && productInfo === null && <Button variant="outlined" sx={{position: 'absolute', bottom: 100, left: '30%', minWidth: '40%', color: 'white', borderColor: 'white'}} onClick={() => setQrInfo('qmVQbOYlyQZoXm30fM4npfzU8xhTMtAnlBzDfR1nKNtJFw7XjmOcstx0gViKk6DmSjjEnKErFhWaD19cyGjANA==')}>
        Scan Product
      </Button>} */}
      
      {/* {!openQr && <Button variant="contained" sx={productInfo === null ? { position: 'absolute', bottom: 100 } : {}} onClick={() => setOpenQr(true)}>
        Scan Product
      </Button>} */}

      {openQr && productInfo === null && <QrReader setOpenQr={setOpenQr} setQrInfo={setQrInfo}/>}
    </Box>
  );
}

export default App;
