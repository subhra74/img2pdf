import './App.css';
import React from 'react';
import { PDFDocument } from 'pdf-lib'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
    this.fileInput = React.createRef();
  }
  render() {
    return (
      <div>
        <div>Donec sollicitudin tristique enim. Fusce elementum vitae mi sed porta. Maecenas posuere pharetra velit ut vulputate. Integer volutpat velit id aliquam porttitor. Praesent finibus tempor neque, non ultrices nisl dapibus eget. Praesent a tortor nec tortor viverra dapibus id at ipsum. Aliquam in turpis sit amet tellus posuere faucibus eget et arcu.</div>
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
    try {
      console.log("create");
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < this.state.images.length; i++) {
        let res=await fetch(this.state.images[i].imgDataUrl);
        res.headers.forEach((val,key)=>console.log(key+":"+val));
        
        let raw = await res.arrayBuffer();
        //console.log(raw);
        const img = await (res.headers['content-type']==='image/jpeg'?pdfDoc.embedJpg(raw):pdfDoc.embedPng(raw));
        const page = pdfDoc.addPage();
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      }
      const pdfBytes = await pdfDoc.save();
      var blob = new Blob([pdfBytes], { type: "application/pdf" });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var fileName = "file.pdf";
      link.download = fileName;
      link.click();
    }
    catch (err) {
      console.error(err);
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
