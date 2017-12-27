import React, { Component } from "react";
import firebase from "../../firebase";
import FileUploader from "react-firebase-file-uploader";
import { Circle, Line } from "rc-progress";
import ImageGallery from 'react-image-gallery';

import "react-image-gallery/styles/css/image-gallery.css";



class ProductDetail extends Component {
  constructor(props) {
    super(props);

    console.dir(props);

    this.state = {
      username: "",
      imgProduct: "",
      isUploading: false,
      progress: 0,
      imgProductURL: ""
    };

    this.imagenes = [];
    this.nextImageID = 0;

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  

  componentDidUpdate(){
   
   /* const imagenes = [
      {
        original: "https://firebasestorage.googleapis.com/v0/b/blindaccesapp.appspot.com/o/images%2Fb576391f-a240-484b-9cb0-9db5bac5e896.png?alt=media&token=52df8c57-4e44-4dc6-8020-d838d54f565b",
        thumbnail: "https://firebasestorage.googleapis.com/v0/b/blindaccesapp.appspot.com/o/images%2Fb576391f-a240-484b-9cb0-9db5bac5e896.png?alt=media&token=52df8c57-4e44-4dc6-8020-d838d54f565b"
      }
    ]

    return imagenes;*/
    this.imagenes = [];
    this.nextImageID = 0;

    if (this.props.item) {
      let refImages = "products/" + this.props.item[0].id + "/images";
      console.log(
        "referencia: " + refImages
      );
      console.log(refImages);
      const itemsRef = firebase.database().ref(refImages);
      itemsRef.on("value", snapshot => {
        let items = snapshot.val();
        console.log("items images > ");
        
        //let newState = [];
        for (let item in items) {
          this.imagenes.push({
            original: items[item].original,
            thumbnail: items[item].thumbnail
          });
        }

        this.nextImageID = this.imagenes.length + 1;
        console.log(this.imagenes);
        console.log(this.nextImageID);
      });
    } 

  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleUploadStart() {
    this.setState({ isUploading: true, progress: 0 });
  }
  handleProgress(progress) {
    this.setState({ progress });
  }
  handleUploadError(error) {
    this.setState({ isUploading: false });
    console.error(error);
  }
  handleUploadSuccess(filename) {
    this.setState({ imgProduct: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.putImageItem(url));
  }

  putImageItem(url) {
    //this.setState({ imgProductURL: url });
    console.log(
      "referencia: " + "products/" + this.props.item[0].id + "/images"
    );
    /*
    const itemsRef = firebase
      .database()
      .ref("products/" + this.props.item[0].id + "/images")
      .push({
        url: url,
        isThumbnail: false
      });*/
  }

  handleClose(e) {
    //console.dir(this.props);
    this.props.onClose();
  }

  render() {
    const item = this.props.item;
    const categoriesArray = this.props.categoriesArray;
  
    return (
      <div className="animated fadeIn">
        <form>
          {item ? (
            <div>
              <div className="row ml-2 mt-1 mr-2">
                <div className="col col-sm-12">
                  <div class="alert alert-primary" role="alert">
                    Detalles del Producto
                  </div>
                </div>
              </div>
              <div className="row ml-2 mt-1 mr-2">
                <div className="col col-sm-6">
                  <div class="form-group row">
                    <label for="name" class="col-sm-4 col-form-label">
                      Nombre
                    </label>
                    <div class="col-sm-8">
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        placeholder={item[0].name}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="price" class="col-sm-4 col-form-label">
                      Precio
                    </label>
                    <div class="col-sm-8">
                      <input
                        type="number"
                        class="form-control"
                        id="price"
                        placeholder={item[0].price}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="category" class="col-sm-4 col-form-label">
                      Categoría
                    </label>
                    <div class="col-sm-8">
                      <select
                        className="custom-select mb-2 mr-sm-2 mb-sm-0"
                        onChange={this.handleChangeCategory}
                      >
                        <option value="">Seleccione</option>
                        {categoriesArray.map(category => {
                          return (
                            <option
                              selected={category.id == item[0].category}
                              key={category.id}
                              value={category.id}
                            >
                              {category.categoryName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="description">Descripción</label>
                    <textarea class="form-control" id="description" rows="3">
                      {item[0].description}
                    </textarea>
                  </div>
                </div>
                <div className="col col-sm-6">
                  <div className="row ml-2 mt-1 mr-2">
                    <ImageGallery items={this.imagenes} />
                  </div>
                  <div className="row ml-2 mt-1 mr-2">
                    <div className="col col-sm-12">
                      <label class="badge badge-primary mb-3">
                        <h6>
                          {" "}
                          Nueva Imagen{" "}
                          <i class="fa fa-cloud-upload" aria-hidden="true" />
                        </h6>
                        <FileUploader
                          hidden
                          accept="image/*"
                          name="imgProduct"
                          filename={item[0].id + "~" + this.nextImageID}
                          storageRef={firebase.storage().ref("images")}
                          onUploadStart={this.handleUploadStart}
                          onUploadError={this.handleUploadError}
                          onUploadSuccess={this.handleUploadSuccess}
                          onProgress={this.handleProgress}
                        />
                      </label>
                      {this.state.isUploading && (
                        <div>
                          Cargando {this.state.progress} % <br />
                          <Line percent={this.state.progress} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div />
                </div>
                <div className="row mt-2 mr-2 ml-2 mb-2">
                  <div className="col col-sm-12">
                    <button
                      type="button"
                      class="btn btn-primary mr-2"
                      onClick={this.handleClose}
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={this.handleClose}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h2>Not Found!</h2>
          )}
        </form>
      </div>
    );
  }
}

export default ProductDetail;
