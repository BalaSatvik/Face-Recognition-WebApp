import React from "react"
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import axios from "axios"
import AppBar from '@mui/material/AppBar';
import { Grid } from "@mui/material";
import Legend from './legend';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import './home.css';


const Homepage = (props) => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [detected, setDetected] = useState()
    const [semantic, setSemantic] = useState()
    const [toolslist, setTools] = useState()
    const [processing1, setProcessing1] = useState(false)
    const [processing2, setProcessing2] = useState(false)


    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setDetected();
        setSemantic();
        console.log("yo" + e.target.files)
        setSelectedFile(e.target.files[0])
    }


    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        console.log(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile)
        console.log(objectUrl);
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function detect() {
        console.log(selectedFile)
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append(
            "file",
            selectedFile
        )

        axios.post('http://localhost:8000/object-to-img', formData, config)
            .then(res => {
                setProcessing1(true);
                setTools(res.data.result);
                var encode_image = JSON.parse(res.data.img.body)['image'];
                var image = new Image();
                image.src = 'data:image/png;base64,' + encode_image;
                console.log(typeof image)
                setDetected('data:image/png;base64,' + encode_image);
                setProcessing1(false)
            })
            .catch(err => console.log(err));      
    }
    const HeaderStyle = {
        width: "100%",
        height: "100vh",
        // background: `url("https://static.vecteezy.com/system/resources/thumbnails/012/243/895/small_2x/abstract-blue-polygonal-space-background-with-connecting-dots-and-lines-connection-structure-and-science-background-futuristic-hud-design-free-vector.jpg")`,
        background: `url("https://mcdn.wallpapersafari.com/medium/33/80/fEchld.jpg")`,
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        overflowY :"Scroll",
      };


    return (
        <header style={HeaderStyle}>

        <div className="home">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        FACE - DETECTION
                    </Typography>
                    <Button color="inherit" onClick={() => props.details.setLoginUser({})}>Logout</Button>
                </Toolbar>
            </AppBar>
            <br />
            <div className="backup">
            <Grid container spacing={2} style={{ paddingLeft: "30px", paddingTop: "100px" }}>
                <Grid xs={11}>
                    <Typography align="center" variant="h3">
                        WELCOME {props.details.user.name} !!!
                    </Typography>
                </Grid>
            </Grid>
            <br />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <div className="homepage">
                    <input type='file' onChange={onSelectFile} /> <br /><br />
                    {selectedFile && <img src={preview} style={{ maxWidth: "800px", maxHeight: "600px" }} />}<br /> <br />
                    <Button variant="contained" color="secondary" onClick={detect} >
                        DETECT
                    </Button><br /><br />
                </div>
            </Box>
            {processing1 && processing2 ? (<h1>PROCESSING.......</h1>) :
                (<div>
                    {detected && <h1 style={{ paddingLeft: "50px" }}>DETECTED IMAGE:</h1>}
                    <Grid container spacing={2} style={{ paddingLeft: "200px", paddingTop: "10px" }}>
                        <Grid xs={8}>
                            <div>
                                {detected && <img src={detected} style={{ maxWidth: "600px", maxHeight: "700px" }} />}
                            </div>
                        </Grid>
                        <Grid xs={4}>
                            <div>
                                {detected && <h2>DETECTED HUMAN:</h2>}
                                {detected &&
                                    <ul>{toolslist.length > 0 && toolslist.map((item) => <li key={item}> <h3>{item}</h3> </li>)}</ul>
                                }
                            </div>
                        </Grid>
                    </Grid>
                    {semantic && <h1 style={{ paddingLeft: "50px" }}>Segmented Image:</h1>}<br />
                    <Grid container spacing={2} style={{ paddingLeft: "200px", paddingTop: "10px" }}>
                        <Grid xs={8}>
                            <div>
                                {semantic && <img src={semantic} style={{ maxWidth: "800px", maxHeight: "600px" }} />}
                            </div>
                        </Grid>
                        <Grid xs={4}>
                            <div>
                                {semantic && <Legend />}
                            </div>
                        </Grid>
                    </Grid>
                    
                </div>)}
                </div>
        </div>
        </header>
    )
}

export default Homepage