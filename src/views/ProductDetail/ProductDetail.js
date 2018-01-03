import React, { Component } from "react";
import { Route } from "react-router-dom";
import store from "../../store";
import firebase from "../../firebase";
import FileUploader from "react-firebase-file-uploader";
import _ from "lodash";
import { Line } from "rc-progress";
//import ImageGallery from "react-image-gallery";
import { HashLoader } from "react-spinners";

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    console.dir(props);

    this.state = {
      items: store.getState().products,
      item: this.getItembyId(props.match.params.id, store.getState().products),
      imgProduct: "",
      isUploading: false,
      isProcessing: false,
      progress: 0,
      imgProductURL: "",
      imgThumbnail: null,
      images: [],
      nextImageID: 0
    };

    this.imagenes = [];
    this.nextImageID = 0;
    Route;
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    let refImages = "products/" + this.state.item[0].id + "/images";
    console.log("referencia: " + refImages);
    console.log(refImages);
    const itemsRef = firebase.database().ref(refImages);
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      console.log("items images > ");

      let newState = [];

      for (let item in items) {
        newState.push({
          id: item,
          original: items[item].original,
          thumbnail: items[item].thumbnail
        });
      }

      this.setState({
        images: newState,
        isProcessing: false,
        nextImageID: newState.length + 1
      });
    });
  }
  /*
  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.state.item) {
      this.imagenes = [];
      this.nextImageID = 0;

      if (nextProps.item) {
        let refImages = "products/" + nextProps.item[0].id + "/images";
        console.log("referencia: " + refImages);
        console.log(refImages);
        const itemsRef = firebase.database().ref(refImages);
        itemsRef.on("value", snapshot => {
          let items = snapshot.val();
          console.log("items images > ");

          let newState = [];

          for (let item in items) {
            newState.push({
              id: item,
              original: items[item].original,
              thumbnail: items[item].thumbnail
            });
          }

          this.nextImageID = newState.length + 1;

          this.setState({
            item: nextProps.item,
            images: newState,
            isProcessing: false,
            thumbnail: nextProps.item[0].thumbnail
          });
        });
      }
    }
  }*/

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
    this.setState({
      imgProduct: filename,
      progress: 100,
      isUploading: false,
      isProcessing: true
    });
    /*
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.putImageItem(url));*/
  }

  handleClose(e) {
    //console.dir(this.props);
    this.props.onClose();
  }

  showImage(e) {
    //e.preventDefault();
    let imgThumbnail = this.getItembyId(e.target.id, this.state.images);

    this.setState({ imgThumbnail: imgThumbnail });
  }

  setImage(e) {
    firebase
      .database()
      .ref("products/" + this.state.item[0].id)
      .update({
        thumbnail: this.state.imgThumbnail
      });
  }

  configHandler(e) {
    console.log(e);
  }

  deleteHandler(e) {
    console.log(e);
  }

  getItembyId(id, colection) {
    let items = colection;
    let selItem = _.filter(items, item => {
      return item.id == id;
    });
    return selItem;
  }

  render() {
    const item = this.state.item;
    const categories = store.getState().categories;

    return (
      <div className="animated fadeIn">
        <form>
          {item ? (
            <div>
              <div className="row ml-2 mt-1 mr-2">
                <div className="col col-sm-12">
                  <div className="alert alert-primary" role="alert">
                    <small>Detalles del Producto</small>
                  </div>
                </div>
              </div>
              <div className="row ml-2 mt-1 mr-2">
                <div className="col col-sm-6">
                  <div className="form-group row">
                    <label for="name" className="col-sm-4 col-form-label">
                      Nombre
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder={item[0].name}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label for="price" className="col-sm-4 col-form-label">
                      Precio
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        placeholder={item[0].price}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label for="category" className="col-sm-4 col-form-label">
                      Categoría
                    </label>
                    <div className="col-sm-8">
                      <select
                        className="custom-select mb-2 mr-sm-2 mb-sm-0"
                        onChange={this.handleChangeCategory}
                      >
                        <option value="">Seleccione</option>
                        {categories.map(category => {
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
                  <div className="form-group">
                    <label for="description">Descripción</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="4"
                      value={item[0].description}
                    />
                  </div>
                  <div className="d-flex flex-row mb-2">
                    <button
                      type="button"
                      class="btn btn-info btn-sm btn-block"
                      onClick={this.handleClose}
                    >
                      Guardar
                    </button>
                  </div>
                  <div className="d-flex flex-row">
                    <Route
                      render={({ history }) => (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm btn-block"
                          onClick={() => {
                            history.push("/products");
                          }}
                        >
                          Cancelar
                        </button>
                      )}
                    />

                    {/*                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-block"
                      onClick={this.handleClose}
                    >
                      Cancelar
</button>*/}
                  </div>
                </div>
                <div className="col col-sm-6">
                  <div>
                    {this.state.imgThumbnail ? (
                      <div className="d-flex flex-row">
                        <div className="mb-2">
                          <img
                            src={this.state.imgThumbnail[0].original}
                            className="rounded"
                            style={{ height: "280px", width: "280px" }}
                          />
                        </div>
                        <div class="d-flex flex-column">
                          <div class="p-2">
                            <button
                              type="button"
                              class="btn btn-outline-secondary btn-sm btn-block"
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Imagen Principal"
                              onClick={e => this.setImage(e)}
                            >
                              <i class="fa fa-picture-o" aria-hidden="true" />
                            </button>
                          </div>
                          <div class="p-2">
                            <button
                              type="button"
                              class="btn btn-outline-danger btn-sm btn-block"
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Eliminar Imagen"
                            >
                              <i class="fa fa-trash" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <img
                          src="img/logo-symbol.png"
                          style={{ height: "280px", width: "280px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row">
                    {this.state.images.length > 0 ? (
                      this.state.images.map(item => {
                        return (
                          <div className="mr-2">
                            <a>
                              <img
                                className="rounded"
                                style={{ height: "60px", width: "60px" }}
                                src={item.thumbnail}
                                id={item.id}
                                onClick={e => this.showImage(e)}
                              />
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <div class="alert alert-warning" role="alert">
                        No hay imagenes cargadas.
                      </div>
                    )}
                  </div>
                  <div class="">
                    <div class="mt-3 mr-2">
                      {!this.state.isUploading &&
                        !this.state.isProcessing && (
                          <label className="alert alert-secondary" role="alert">
                            Cargar Imagen{" "}
                            <i
                              className="fa fa-cloud-upload"
                              aria-hidden="true"
                            />
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
                        )}
                      {this.state.isUploading && (
                        <div
                          className="alert alert-success text-center"
                          role="alert"
                        >
                          <p>
                            <small>Cargando {this.state.progress} %</small>
                          </p>
                          <div>
                            <Line
                              percent={this.state.progress}
                              strokeWidth="1"
                              strokeColor="#20a8d8"
                            />
                          </div>
                        </div>
                      )}

                      {this.state.isProcessing && (
                        <div
                          className="alert alert-info text-center"
                          role="alert"
                        >
                          <p className="text-center">
                            <small>
                              {" "}
                              Procesando Imagen, espere un momento por favor...
                            </small>
                          </p>
                          <div>
                            <HashLoader
                              size={15}
                              color={"#20a8d8"}
                              loading={this.state.isProcessing}
                            />
                          </div>
                        </div>
                      )}
                    </div>
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
