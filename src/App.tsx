// Styles
import "./App.css";

// React
import { useEffect, useState } from "react";

// Components
import QrReader from "./components/QrReader";
import { getQRInfo } from "./utils/helper";
import { Box, Button, Typography } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import YouTube from 'react-youtube';
import CameraIcon from './assets/camera_icon.png';
import YoutubeIcon from './assets/youtube-icon.png';

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
  const [value, setValue] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // @ts-nocheck
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  useEffect(() => {
    if (qrInfo !== '') {
      // alert(qrInfo);
      (async () => {
        const data = await getQRInfo(qrInfo);
        setProductInfo(data);
      })()
    }
  }, [qrInfo]);

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
    <Box sx={{ textAlign: 'center'}}>
      {!openQr && productInfo !== null && <Box>
        <Typography sx={{ padding: 5, fontSize: 24}} >{productInfo.name}</Typography>

        <Box sx={{ position: 'relative' }}>
          <Slide autoplay={false} onChange={(previous, next) => { console.log(previous), setCurrentIndex(next) }}>
            {productInfo.images.map((slideImage: any, index: number) => (
              <div key={index}>
                <img src={'https://shearnode.com/api/v1/files/' + slideImage} height={window.innerWidth * 0.7} />
              </div>
            ))} 
            {productInfo.videos.map((video: any) => (
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
            <img src={currentIndex < productInfo.images.length ?  CameraIcon : YoutubeIcon} style={{height: 20, width: 20}} />
            <Typography sx={{color: 'white', fontSize: 13, marginLeft: 1}}>
              {currentIndex + 1}/{productInfo.images.length + productInfo.videos.length} Medias
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', pt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48 }} label="DPP" {...a11yProps(0)} />
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48}} label="Warranty/Guarantee" {...a11yProps(1)} />
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48}} label="Manuals & Certs" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
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
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
          </CustomTabPanel>
        </Box>
      </Box>}
      
      {/* {!openQr && <Button variant="contained" onClick={() => setQrInfo('qmVQbOYlyQZoXm30fM4npVFh1rwiGjGlRHtsNIBiFEC1LJ1wPuE6RFqK7kEKLZe1FniDPpKKFUfvt+tA7Cofrg==')}>
        Scan Product
      </Button>} */}
      
      {!openQr && <Button variant="contained" onClick={() => setOpenQr(true)}>
        Scan Product
      </Button>}

      {openQr && <QrReader setOpenQr={setOpenQr} setQrInfo={setQrInfo}/>}
    </Box>
  );
}

export default App;
