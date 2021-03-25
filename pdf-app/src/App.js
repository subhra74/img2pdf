import './App.css';
import React from 'react';
import { PageSizes, PDFDocument } from 'pdf-lib'

import {polyfill} from "mobile-drag-drop";

// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour";

// options are optional ;)
polyfill({
    // use this to make use of the scroll behaviour
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

window.addEventListener( 'touchmove', function() {});

const A4 = "A4", Letter = "US Letter", Fit = "Same as Image", Portrait = "Portrait", Landscape = "Landscape", None = "0", Small = "20", Big = "50";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      pageOrientation: Portrait,
      pageSize: A4,
      pageMargin: None,
      lastError: undefined,
      lastMime: undefined,
      forceShowOption: false
    };
    this.fileInput = React.createRef();
  }
  render() {
    let pageWrapper = {
      height: "192px",
      width: "192px",
      border: "none",
      display: "flex",
      background: "white"
    };

    let pageStyle = {
      margin: '0px',
      flex: "1",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    };

    if (this.state.pageMargin === Small) {
      pageStyle.margin = "5px";
    } else if (this.state.pageMargin === Big) {
      pageStyle.margin = "10px";
    }

    if (this.state.pageSize !== Fit) {
      pageWrapper.width = Math.ceil(192 * this.getAspectRatio()) + 'px';
      pageWrapper.boxShadow = "5px 5px 5px rgb(200,200,200)";
    }

    const landing = (<div>
      <input type="file" ref={this.fileInput} onChange={this.readfiles} multiple></input>
    </div>);

    const listView = (<div style={{ display: 'flex', flexWrap: 'wrap', flex: "1", justifyContent: "center" }}>
      {this.state.images.map((img, index) => (
        <div
          style={{ padding: "5px" }}
          key={img.id}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', img.id);
            console.log("Drag start " + index);
          }}
          onDrop={(e) => {
            if (e.stopPropagation) {
              e.stopPropagation(); // stops the browser from redirecting.
            }
            let droppedId = e.dataTransfer.getData("text/plain");
            console.log("droppedId: " + droppedId);
            this.handleDrop(droppedId, img.id);
          }}
          onDragOver={(e) => {
            if (e.preventDefault) {
              e.preventDefault(); // stops the browser from redirecting.
            }
          }}
          onDragEnter={(e) => { e.preventDefault() }}
        >
          <div style={{ ...pageWrapper }}>
            <div style={{ ...pageStyle, backgroundImage: "url('" + img.imgDataUrl + "')" }}>
            </div>
          </div>
        </div>
      ))}
    </div>);

    const pageMarginSection = (<div>
      <div style={{ paddingBottom: "10px", fontSize: "16px", color: "gray", paddingTop: "20px" }}>Page margin</div>
      <div style={{ display: "flex" }}>
        <div style={{
          flex: "1", height: "50px", display: "flex", flexDirection: "column",
          justifyContent: "center", textAlign: "center",
          background: (this.state.pageMargin == None ? "purple" : "rgb(240,240,240)"),
          color: (this.state.pageMargin == None ? "white" : "black")
        }} onClick={() => this.setState({ pageMargin: None })}>None</div>
        <div style={{
          flex: "1", height: "50px", display: "flex", flexDirection: "column",
          justifyContent: "center", textAlign: "center",
          background: (this.state.pageMargin == Small ? "purple" : "rgb(240,240,240)"),
          color: (this.state.pageMargin == Small ? "white" : "black")
        }} onClick={() => this.setState({ pageMargin: Small })}>Small</div>
        <div style={{
          flex: "1", height: "50px", display: "flex", flexDirection: "column",
          justifyContent: "center", textAlign: "center",
          background: (this.state.pageMargin == Big ? "purple" : "rgb(240,240,240)"),
          color: (this.state.pageMargin == Big ? "white" : "black")
        }} onClick={() => this.setState({ pageMargin: Big })}>Big</div>
      </div>
    </div>);

    const optionStyle = {}
    if (this.state.forceShowOption) {
      optionStyle.display = "block"
    }

    const closeBtn = this.state.forceShowOption ? <span onClick={() => { this.setState({ forceShowOption: false }) }}>X</span> : <span></span>;

    const options = (
      <div className="options" style={optionStyle}>
        <div style={{ paddingBottom: "10px", fontSize: "20px", display: "flex", justifyContent: "space-between" }}>
          <span>Options</span>
          {closeBtn}
        </div>
        <div style={{ paddingBottom: "10px", fontSize: "16px", color: "gray", paddingTop: "10px" }}>Page orientation</div>
        <div style={{ display: "flex" }}>
          <div style={{
            flex: "1", height: "50px", display: "flex", flexDirection: "column",
            justifyContent: "center", textAlign: "center",
            background: (this.state.pageOrientation == Portrait ? "purple" : "rgb(240,240,240)"),
            color: (this.state.pageOrientation == Portrait ? "white" : "black")
          }}
            onClick={() => this.setState({ pageOrientation: Portrait })}>Portrait</div>
          <div style={{
            flex: "1", height: "50px", display: "flex", flexDirection: "column",
            justifyContent: "center", textAlign: "center",
            background: (this.state.pageOrientation == Landscape ? "purple" : "rgb(240,240,240)"),
            color: (this.state.pageOrientation == Landscape ? "white" : "black")
          }}
            onClick={() => this.setState({ pageOrientation: Landscape })}>Landscape</div>
        </div>
        <div style={{ paddingBottom: "10px", fontSize: "16px", color: "gray", paddingTop: "20px" }}>Page size</div>
        <div style={{ display: "flex" }}>
          <div style={{
            flex: "1", height: "50px", display: "flex", flexDirection: "column",
            justifyContent: "center", textAlign: "center",
            background: (this.state.pageSize == A4 ? "purple" : "rgb(240,240,240)"),
            color: (this.state.pageSize == A4 ? "white" : "black")
          }} onClick={() => this.setState({ pageSize: A4 })}>A4</div>
          <div style={{
            flex: "1", height: "50px", display: "flex", flexDirection: "column",
            justifyContent: "center", textAlign: "center",
            background: (this.state.pageSize == Letter ? "purple" : "rgb(240,240,240)"),
            color: (this.state.pageSize == Letter ? "white" : "black")
          }} onClick={() => this.setState({ pageSize: Letter })}>US Letter</div>
          <div style={{
            flex: "1", height: "50px", display: "flex", flexDirection: "column",
            justifyContent: "center", textAlign: "center",
            background: (this.state.pageSize == Fit ? "purple" : "rgb(240,240,240)"),
            color: (this.state.pageSize == Fit ? "white" : "black")
          }} onClick={() => this.setState({ pageSize: Fit })}>Same as Image</div>
        </div>
        {this.state.pageSize !== Fit ? pageMarginSection : (<div></div>)}
      </div>
    );
    const actions = (<div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex" }} >
        <button onClick={() => {
          this.setState({
            forceShowOption: true
          });
        }} className="option-btn">PDF Options</button>
        <button>Add page</button>
      </div>
      <button onClick={this.createPdf}>Generate PDF</button>
    </div>);

    if (this.state.images.length < 1) {
      return landing;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <div style={{ display: "flex", overflow: "hidden", flex: "1", height: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", flex: "1", overflow: "auto", background: "rgb(240,240,240)" }}>
            {listView}
            <div style={{ flex: "1" }}></div>
          </div>
          {options}
        </div>
        {actions}
      </div>

    );

    // return (
    //   <div>
    //     <div>This app is not styled yet</div>
    //     <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    //       {this.state.images.map((img, index) => (
    //         <div style={{ display: 'flex', flexDirection: 'column' }}>
    //           <img src={img.imgDataUrl} alt="" style={{ width: "96px", height: "128px" }}></img>
    //           <div>{"Page " + (index + 1)}</div>
    //         </div>
    //       ))}
    //     </div>
    //     <div>
    //       <input type="file" ref={this.fileInput} onChange={this.readfiles} multiple></input>
    //       <button onClick={() => { this.setState({ images: [] }) }}>Clear</button>
    //       <button onClick={this.createPdf}>Generate PDF</button>
    //     </div>
    //     {this.state.lastError ?
    //       <div>
    //         <div>{this.state.lastError}</div>
    //         <div>{this.state.lastMime}</div>
    //       </div> : <div>{this.state.lastMime}</div>}
    //     <div>{this.state.lastMime}</div>
    //   </div>);
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
    let imgArr = [];
    for (let i = 0; i < fileList.length; i++) {
      const imgDataUrl = window.URL.createObjectURL(fileList[i]);
      //let img = await this.loadImage(imgDataUrl);
      imgArr.push({ id: this.uuidv4(), imgDataUrl, file: fileList[i], /* width: img.width, height: img.height */ });
    }
    this.setState((state) => ({
      images: [...state.images, ...imgArr]
    }));
  }

  // loadImage = (objUrl) => {
  //   return new Promise((resolve, reject) => {
  //     let img = new Image();
  //     img.onload = () => {
  //       resolve(img);
  //     };
  //     img.onerror = (e) => {
  //       reject(e);
  //     };
  //     img.src = objUrl;
  //   });
  // }

  createPdf = async () => {

    let mime = "";
    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < this.state.images.length; i++) {
        let res = await fetch(this.state.images[i].imgDataUrl);

        let raw = await res.arrayBuffer();
        mime = res.headers.get('content-type');
        console.log(res.headers.get('content-type'));
        //console.log(raw);
        const img = await (res.headers.get('content-type') === 'image/jpeg' ? pdfDoc.embedJpg(raw) : pdfDoc.embedPng(raw));
        let pageSize = this.getPageSize();
        if (this.state.pageSize === Fit) {
          pageSize = [img.width, img.height];
        }
        const page = pdfDoc.addPage(pageSize);
        if (this.state.pageSize === Fit) {
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
          });
        } else {
          //page.setSize(pageSize[0], pageSize[1]);
          let scaleFactor = Math.min((page.getWidth() - this.state.pageMargin) / img.width, (page.getHeight() - this.state.pageMargin) / img.height);
          let w = img.width * scaleFactor;
          let h = img.height * scaleFactor;
          //page.setSize(img.width,img.height);
          console.log(img.width + " " + img.height);
          console.log(page.getWidth() + " " + page.getHeight());
          page.drawImage(img, {
            x: page.getWidth() / 2 - w / 2,
            y: page.getHeight() / 2 - h / 2,
            width: w,
            height: h,
          });
        }
      }
      const pdfBytes = await pdfDoc.save();
      let blob = new Blob([pdfBytes], { type: "application/pdf" });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      // var link = document.createElement('a');
      // link.href = window.URL.createObjectURL(blob);
      // var fileName = "file.pdf";
      // link.download = fileName;
      // link.click();
    }
    catch (err) {
      console.error(err);
      this.setState({ lastError: err, lastMime: mime });
    }
  }

  handleDrop = (droppedId, currentId) => {
    console.log("droppedId: " + droppedId + " currentId: " + currentId);
    let droppedIndex = -1;
    let arr = [...this.state.images];
    arr.forEach((img, index) => {
      if (img.id === droppedId) {
        droppedIndex = index;
      }
    });
    let droppedImage = arr.splice(droppedIndex, 1)[0];
    let currentIndex = -1;
    arr.forEach((img, index) => {
      if (img.id === currentId) {
        currentIndex = index;
      }
    });
    arr.splice(currentIndex, 0, droppedImage);
    console.log(arr);

    this.setState({
      images: arr
    });
  }

  getPageSize = () => {
    switch (this.state.pageSize) {
      case A4:
        if (this.state.pageOrientation === Portrait) {
          return PageSizes.A4;
        }
        else {
          let pageSize = [...PageSizes.A4];
          pageSize.reverse();
          return pageSize;
        }
      case Letter:
        if (this.state.pageOrientation === Portrait) {
          return PageSizes.Letter;
        }
        else {
          let pageSize = [...PageSizes.Letter];
          pageSize.reverse();
          return pageSize;
        }
      default:
        return undefined;
    }
  }

  getAspectRatio = () => {
    let pageSize = this.getPageSize();
    return pageSize[0] / pageSize[1];
  }

  // getPreviewImageSize = (pageWidth, pageHeight, imageWidth, imageHeight) => {
  //   let pageSize = this.getPageSize();
  //   let margin = this.state.pageMargin * pageHeight / pageSize[1];
  //   let scaleFactor = Math.min((pageWidth - margin) / img.width, (pageHeight - margin) / img.height);
  //   let w = imageWidth * scaleFactor;
  //   let h = imageHeight * scaleFactor;
  //   return [w, h];
  // }

  // getPreviewPageSize = () => {
  //   return {
  //     height: 192,
  //     width: 192 * this.getAspectRatio()
  //   };
  // }

  // getMaxImageSize=()=>{
  //   let maxWidth = -1;
  //   let maxHeight = -1;
  //   this.state.images.forEach(image => {
  //     if (image.width > maxWidth) maxWidth = image.width;
  //     if (image.height > maxWidth) maxHeight = image.height;
  //   });
  //   return {
  //     width: maxWidth,
  //     height: maxHeight
  //   };
  // }

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

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}

export default App;
