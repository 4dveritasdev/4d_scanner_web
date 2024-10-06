// Styles
import "./App.css";

// React
import { useEffect, useState } from "react";

// Components
import QrReader from "./components/QrReader";
import { CalculateRemainPeriod, getIdentifierInfo, getQRInfo } from "./utils/helper";
import { Box, Button, MenuItem, Modal, TextField, Typography,Select } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import YouTube from 'react-youtube';
import CameraIcon from './assets/camera_icon.png';
import YoutubeIcon from './assets/youtube-icon.png';
import Background from './assets/bg.jpg';
import BackButton from './assets/back.png';
import PDFIcon from './assets/pdf.png';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const modalStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  width: '100%',
  height: '85vh'
};

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
  const [viewPDF, setViewPDF] = useState(false);
  const [currentPDF, setCurrentPDF] = useState(null);
  const [identifiers,setIdentifiers] = useState({type:'serial',serial:''})
  const [openIdentifer,setOpenIdentifer] = useState(false)

  // @ts-nocheck
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
    setCurrentIndex(0);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);

    let qrcode: any = params.get('qrcode');
    qrcode = qrcode?.replace(' ', '+');

    if(qrcode !== null) {
      setQrInfo(qrcode);
    }
  }, []);

  useEffect(() => {
    if (qrInfo !== '') {
      // alert(qrInfo);
      (async () => {
        let qrcode = qrInfo;
        if(qrcode.startsWith('https://4dveritaspublic.com')) {
          qrcode = qrcode.slice(35);
        }
        
        const data = await getQRInfo(qrcode);
        setProductInfo(data);
      })()
    }
  }, [qrInfo]);
  
  const getProduct = async() => {
    const data = await getIdentifierInfo(identifiers);
    setProductInfo(data);
  }
 

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

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
      autoplay: 0,
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
        
        <Modal
          open={viewPDF}
          onClose={() => setViewPDF(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer fileUrl={'https://shearnode.com/api/v1/files/' + currentPDF} />
            </Worker>
          </Box>
        </Modal>

        <Box sx={{ textAlign: 'left'}}>
          <Button onClick={() => {setProductInfo(null), setQrInfo('')}} sx={{minWidth: 36, mt: 1}}>
            <img src={BackButton} style={{height: 36, width: 36}} />
          </Button>
        </Box>

        <Typography sx={{ p: 5, pt: 2, fontSize: 24}} >{productInfo.name}</Typography>

        {tabValue === 0 && <Box sx={{ position: 'relative' }}>
          <Slide transitionDuration={100} autoplay={false} onChange={(previous, next) => { console.log(previous), setCurrentIndex(next) }}>
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
        </Box>}
        
        {tabValue === 1 && <Box sx={{ position: 'relative' }}>
          <Slide transitionDuration={100} autoplay={false} onChange={(previous, next) => { console.log(previous), setCurrentIndex(next) }}>
            {productInfo.warrantyAndGuarantee.images.map((slideImage: any, index: number) => (
              <div key={index}>
                <img src={'https://shearnode.com/api/v1/files/' + slideImage} height={window.innerWidth * 0.7} />
              </div>
            ))} 
            {productInfo.warrantyAndGuarantee.videos.map((video: any) => (
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
            <img src={currentIndex < productInfo.warrantyAndGuarantee.images.length ?  CameraIcon : YoutubeIcon} style={{height: 20, width: 20}} />
            <Typography sx={{color: 'white', fontSize: 13, marginLeft: 1}}>
              {currentIndex + 1}/{productInfo.warrantyAndGuarantee.images.length + productInfo.warrantyAndGuarantee.videos.length} Medias
            </Typography>
          </Box>
        </Box>}
        
        {tabValue === 2 && <Box sx={{ position: 'relative' }}>
          <Slide transitionDuration={100} autoplay={false} onChange={(previous, next) => { console.log(previous), setCurrentIndex(next) }}>
            {productInfo.manualsAndCerts.images.map((slideImage: any, index: number) => (
              <div key={index}>
                <img src={'https://shearnode.com/api/v1/files/' + slideImage} height={window.innerWidth * 0.7} />
              </div>
            ))} 
            {productInfo.manualsAndCerts.videos.map((video: any) => (
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
            <img src={currentIndex < productInfo.manualsAndCerts.images.length ?  CameraIcon : YoutubeIcon} style={{height: 20, width: 20}} />
            <Typography sx={{color: 'white', fontSize: 13, marginLeft: 1}}>
              {currentIndex + 1}/{productInfo.manualsAndCerts.images.length + productInfo.manualsAndCerts.videos.length} Medias
            </Typography>
          </Box>
        </Box>}

        <Box sx={{ width: '100%', pt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48, color: '#CCC' }} label="DPP" {...a11yProps(0)} />
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48, color: '#CCC'}} label="TimeCapsule" {...a11yProps(1)} />
              <Tab sx={{ fontSize: 13, fontWeight: 'bold', minWidth: 48, color: '#CCC'}} label="Trade History" {...a11yProps(2)} />
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
                  <Typography style={{fontSize: 13, textAlign: 'right'}}>Location : {productInfo.location}</Typography>
                  {
                      productInfo.serialInfos && productInfo.serialInfos.map((item:any)=>(
                        <Typography style={{fontSize: 13, textAlign: 'right'}}>{item.type.toUpperCase()} : {item.serial}</Typography>
                      ))
                    }
                  {/* <Typography style={{fontSize: 13, textAlign: 'right'}}>EXP Date : {productInfo.exp_time}</Typography> */}
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
                    
              <Box style={{ display: 'flex', flexDirection: 'row'}}>
                {productInfo.files.map((file: any, i: number) => (
                  <Button key={i} onClick={() => {console.log(file), setViewPDF(true), setCurrentPDF(file)}} style={{ padding: 2 }}>
                    <img src={PDFIcon} style={{height: 28, width: 28}} />
                  </Button>
                ))}
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
                <h4>W & G</h4>
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
                    
                <Box style={{ display: 'flex', flexDirection: 'row'}}>
                  {productInfo.warrantyAndGuarantee.files.map((file: any, i: number) => (
                    <Button key={i} onClick={() => {console.log(file), setViewPDF(true), setCurrentPDF(file)}} style={{ padding: 2 }}>
                      <img src={PDFIcon} style={{height: 28, width: 28}} />
                    </Button>
                  ))}
                </Box>
                <h4>Manuals&Certs</h4>
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
                      
                <Box style={{ display: 'flex', flexDirection: 'row'}}>
                  {productInfo.manualsAndCerts.files.map((file: any, i: number) => (
                    <Button key={i} onClick={() => {console.log(file), setViewPDF(true), setCurrentPDF(file)}} style={{ padding: 2 }}>
                      <img src={PDFIcon} style={{height: 28, width: 28}} />
                    </Button>
                  ))}
                </Box>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={2}>
          </CustomTabPanel>
        </Box>
        
        {!openQr && <Button variant="outlined" sx={{minWidth: '40%', color: 'white', borderColor: 'white', m: 2}} onClick={() => {setOpenQr(true), setProductInfo(null), setQrInfo('')}}>
          Scan Product With QR Code
        </Button>}
      </Box>}
      
      <div style={{position:'absolute',minWidth:'40%',bottom:50}}>
          {!openQr && productInfo === null && <Button variant="outlined" sx={{ minWidth: '40%', color: 'white', borderColor: 'white'}} onClick={() => {setOpenQr(true), setOpenIdentifer(false), setProductInfo(null), setQrInfo('')}}>
            Scan Product With QR Code
          </Button>}
          {
            productInfo === null && <Button variant="outlined" sx={{ minWidth: '40%', color: 'white',marginTop:'25px', borderColor: 'white'}} onClick={() => {setOpenQr(false), setProductInfo(null), setQrInfo(''), setOpenIdentifer(true), setIdentifiers({type:'serial',serial:''})}}>Scan Product With Other Identifier</Button>
          }
      </div>
      {
            openIdentifer && (
              <div style={{background:'white',padding:25,marginTop:'10px'}}>
                <div style={{marginTop:25}}>
                  <Select label="Type" value={identifiers.type}>
                    <MenuItem value="serial">Serial Number</MenuItem>
                  </Select>
                </div>
                <div  style={{marginTop:25}}>
                  <TextField id="" label="Identifier" value={identifiers.serial} onChange={e=>setIdentifiers({...identifiers,serial:e.target.value})} />
                </div>

                <Button variant="contained" sx={{ minWidth: '40%', color: 'white', borderColor: 'white',marginTop:5}} onClick={() => {getProduct(); setOpenIdentifer(false); setIdentifiers({type:'serial',serial:''})}}>Scan Product</Button>

              </div>
            )
          }

      {/* {!openQr && productInfo === null && <Button variant="outlined" sx={{position: 'absolute', bottom: 100, left: '30%', minWidth: '40%', color: 'white', borderColor: 'white'}} onClick={() => setQrInfo("https://4dveritaspublic.com?qrcode=qmVQbOYlyQZoXm30fM4npaMzIRbMaG0x74oeaRpQLyyAGbpcXD8QC+WVMuKNJD4QWfsLYcs54jecr29mFrJBow==")}>
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
