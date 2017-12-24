import React, { Component } from "react";
import firebase from "../../firebase";
import FileUploader from "react-firebase-file-uploader";
import { Circle, Line } from "rc-progress";
//import ImageUpload from "../../components/ImgeUpload"

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    console.dir(props);

    this.state = {
      username: "",
      imgProduct: "",
      isUploading: false,
      progress: 0,
      imgProductURL: "",
      item: this.props.item,
      images:[]
    };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    this.setState({ imgProductURL: url })
    console.log("referencia: "+ "products/" + this.props.item[0].id + "/images")
    const itemsRef = firebase
      .database()
      .ref("products/" + this.props.item[0].id + "/images")
      .push({
        url: url
      });
 
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
                    <div className="col col-sm-4">
                      <img
                        src={item[0].thumbnail}
                        className="rounded float-left"
                        alt={item[0].name}
                      />
                    </div>
                    <div className="col col-sm-4">
                      <img
                        src={item[0].thumbnail}
                        className="rounded float-left"
                        alt={item[0].name}
                      />
                    </div>
                    <div className="col col-sm-4">
                      <img
                        src={item[0].thumbnail}
                        className="rounded float-left"
                        alt={item[0].name}
                      />
                    </div>
                  </div>
                  <div className="row ml-2 mt-1 mr-2">
                    {/*<div className="col col-sm-8">
                      <label class="custom-file">
                        <input
                          type="file"
                          id="file2"
                          class="custom-file-input"
                        />
                        <span class="custom-file-control" />
                      </label>
                    </div>
                    <div className="col col-sm-4">
                      <button type="button" class="btn btn-primary">
                        <i class="fa fa-cloud-upload" aria-hidden="true" />
                      </button>
                      </div> 
                      <div className="col col-sm-12">
                        <ImageUpload/>
                      </div>
                      */}
                    <div className="col col-sm-12">
                      {/*this.state.imgProductURL && (
                        <img src={this.state.imgProductURL} />
                      )*/}
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
                          randomizeFilename
                          storageRef={firebase.storage().ref("images")}
                          onUploadStart={this.handleUploadStart}
                          onUploadError={this.handleUploadError}
                          onUploadSuccess={this.handleUploadSuccess}
                          onProgress={this.handleProgress}
                        />
                      </label>
                      {this.state.isUploading && (
                        <div>
                          Cargando {this.state.progress} % <br/>
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
