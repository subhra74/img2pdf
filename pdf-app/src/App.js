import './App.css';
import React from 'react';
import { PDFDocument } from 'pdf-lib'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      lastError:undefined,
      lastMime:undefined
    };
    this.fileInput = React.createRef();
  }
  render() {
    return (
      <div>
        <div>This app is not styled yet</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {this.state.images.map((img, index) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img src={img.imgDataUrl} alt="" style={{ width: "96px", height: "128px" }}></img>
              <div>{"Page " + (index + 1)}</div>
            </div>
          ))}
        </div>
        <div>
          <input type="file" ref={this.fileInput} onChange={this.readfiles} multiple></input>
          <button onClick={() => { this.setState({ images: [] }) }}>Clear</button>
          <button onClick={this.createPdf}>Generate PDF</button>
        </div>
        {this.state.lastError?
        <div>
          <div>{this.state.lastError}</div>
          <div>{this.state.lastMime}</div>
        </div>:<div>{this.state.lastMime}</div>}
        <div>{this.state.lastMime}</div>
      </div>);
  }

  //https://labs.madisoft.it/javascript-image-compression-and-resizing/
  /* resizeImage = async (file, width, height) => {
    const blobURL = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onload = function (ev) {
      window.URL.revokeObjectURL(blobURL); // release memory
      // Use the img
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
    };

  } */

  readfiles = async (event) => {
    let fileList = this.fileInput.current.files;
    console.log(fileList.length);
    for (let i = 0; i < fileList.length; i++) {
      this.setState((state) => ({
        images: [...state.images, { imgDataUrl: window.URL.createObjectURL(fileList[i]), file: fileList[i] }]
      }));
    }
  }

  createPdf = async () => {
    
    let mime="";
    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < this.state.images.length; i++) {
        let res=await fetch(this.state.images[i].imgDataUrl);
        
        let raw = await res.arrayBuffer();
        mime=res.headers.get('content-type');
        console.log(res.headers.get('content-type'));
        //console.log(raw);
        const img = await (res.headers.get('content-type')==='image/jpeg'?pdfDoc.embedJpg(raw):pdfDoc.embedPng(raw));
        const page = pdfDoc.addPage();
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      }
      const pdfBytes = await pdfDoc.save();
      let blob = new Blob([pdfBytes], { type: "application/pdf" });
      //window.open(window.URL.createObjectURL(blob));
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      let fileName = "file.pdf";
      link.download = fileName;
      link.click();
    }
    catch (err) {
      console.error(err);
      this.setState({lastError:err,lastMime:mime});
    }
  }

  /* createPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    this.createPage(pdfDoc, 1);
  }

  createPage = (pdfDoc, index) => {
    this.embedImage(pdfDoc, index).then(() => {
      if (index > this.state.images.length) {
        pdfDoc.save().then((blob) => {
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          var fileName = "file.pdf";
          link.download = fileName;
          link.click();
        });
      }
      this.createPage(pdfDoc, index + 1);
    });
  }

  embedImage = async (pdfDoc, index) => {
    if (index > this.state.images.length) return;
    let raw = await (await fetch(this.state.images[index - 1])).blob();
    const img = await pdfDoc.embedJpg(raw);
    const page = pdfDoc.addPage();
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  } */


}

export default App;
