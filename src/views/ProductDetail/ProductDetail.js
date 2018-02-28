import React, { Component } from "react";
import { Route } from "react-router-dom";
import store from "../../store";
import firebase from "../../firebase";
import FileUploader from "react-firebase-file-uploader";
import _ from "lodash";
import { Line } from "rc-progress";
//import ImageGallery from "react-image-gallery";
import { HashLoader } from "react-spinners";
//import { ToastContainer, ToastStore } from 'react-toasts';
import { ToastContainer, toast } from 'react-toastify';
import Authorization from '../../Authorization'

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    console.dir(props);
    let product = this.getItembyId(props.match.params.id, store.getState().products)
    this.state = {
      id: props.match.params.id,
      items: store.getState().products,
      item: props.match.params.id !== '' ? product : null,
      name: props.match.params.id !== 'n' ? product[0].name : '',
      price: props.match.params.id !== 'n' ? product[0].price : null,
      category: props.match.params.id !== 'n' ? product[0].category : null,
      description: props.match.params.id !== 'n' ? product[0].description : null,
      outstanding: props.match.params.id !== 'n' && product[0].outstanding ? product[0].outstanding : null,
      topost: props.match.params.id !== 'n' && product[0].topost ? product[0].topost : null,
      imgProduct: "",
      isUploading: false,
      isProcessing: false,
      progress: 0,
      imgProductURL: "",
      imgPreview: "",
      images: null
    };

    //Route;
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    
  }

  componentWillMount() {

    if (this.state.item.length > 0) {
      let refImages = "products/" + this.state.item[0].id + "/images";
      //console.log("referencia: " + refImages);
      //console.log(refImages);
      const itemsRef = firebase.database().ref(refImages);
      itemsRef.on("value", snapshot => {
        let items = snapshot.val();
        //console.log("items images > ");
        this.setState({
          images: items,
          isProcessing: false
        });
      });
    }

    if(this.state.id === 'n'){
      let refProduct = "products/"
      const itemsRef = firebase.database().ref(refProduct);
      const newProductKey = itemsRef.push().key;
      console.dir(newProductKey);
      console.log(newProductKey); 
      let item = [];
      item.push({id: newProductKey});
      console.dir(item) 
      this.setState({item});
    }

  }


  handleUploadStart() {
    this.setState({ isUploading: true, progress: 0 });
  }

  handleProgress(progress) {
    this.setState({ progress });
  }
  handleUploadError(error) {
    this.setState({ isUploading: false });
    //console.error(error);
  }

  handleUploadSuccess(filename) {
    this.setState({
      imgProduct: filename,
      progress: 100,
      isUploading: false,
      isProcessing: true,
      imgPreview: ""
    });
  }


  previewImage(e) {
    //console.log(e.target.id);
    //console.log(this.state.images[e.target.id].original);
    this.setState({ imgPreview: e.target.id });
  }

  deleteImage() {
    this.setState({ imgPreview: false });
    let refImages = "products/" + this.state.item[0].id + "/images/" + this.state.imgPreview;
    firebase.database().ref(refImages).remove();
  }

  getItembyId(id, colection) {
    let items = colection;
    let selItem = _.filter(items, item => {
      return item.id == id;
    });
    return selItem;
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let refProduct = "products/" + this.state.item[0].id;
    firebase.database().ref(refProduct).update({
      name: this.state.name,
      price: this.state.price,
      category: this.state.category,
      description: this.state.description,
      outstanding: this.state.outstanding,
      topost: this.state.topost
    }).then(() => {
      console.log("updated");
      //ToastStore.success('Los datos fueron guardados !');
      toast.success("Los datos fueron guardados !", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }).catch((error) => {
      console.log("updated");
      //ToastStore.error(`${error}`);
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    });
  }

  render() {
    const item = this.state.item;
    const categories = store.getState().categories;

    return (
      <div className="animated fadeIn">
        { /* <ToastContainer style={{position: 'absolute', top: 300, left: 300}} store={ToastStore} /> */}
        <ToastContainer autoClose={2000}/>
        <form>
          {this.state.item.length > 0 || this.state.id === 'n' ? (
            <div>
              <div className="row ml-2 mt-1 mr-2">
                <div className="col col-sm-12">
                  <div className="alert alert-primary" role="alert">
                    <small>Detalles del Producto</small>
                  </div>
                </div>
              </div>
              <div className="row ml-2 mt-1 mr-2">
                <div className="col col-sm-6 mb-2">
                  <div className="form-group row">
                    <label for="name" className="col-sm-4 col-form-label">
                      Nombre
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        defaultValue={this.state.name}
                        onChange={this.handleInputChange}
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
                        name="price"
                        defaultValue={this.state.price}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label for="name" className="col-sm-4 col-form-label">
                      Destacado
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="checkbox"
                        className="form-control"
                        id="outstanding"
                        name="outstanding"
                        checked={this.state.outstanding}
                        onChange={this.handleInputChange}
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
                        name="category"
                        onChange={this.handleInputChange}
                      >
                        {categories.map(category => {
                          return (
                            <option
                              selected={category.id === this.state.category}
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
                      name="description"
                      onChange={this.handleInputChange}
                      rows="7"
                      defaultValue={this.state.description}
                    />
                  </div>
                  <div className="form-group row">
                    <label for="name" className="col-sm-4 col-form-label">
                      Publicar
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="checkbox"
                        className="form-control"
                        id="topost"
                        name="topost"
                        checked={this.state.topost}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col col-sm-6">
                  <div className="d-flex flex-row mb-2">
                    <div className="mr-2">

                      {this.state.images && this.state.images[0] ? (
                        <img src={this.state.images[0].thumbnail} id="0" style={{ height: '70px', width: '70px', borderRadius: 4, cursor: 'pointer' }} onClick={this.previewImage} />
                      ) : (
                          <label style={{ height: '70px', width: '70px', backgroundColor: '#d6d6d6', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer' }}>
                            1
                           <i
                              className="fa fa-cloud-upload"
                              aria-hidden="true"
                            />
                            <FileUploader
                              hidden
                              accept="image/*"
                              name="imgProduct"
                              filename={item[0].id + "~" + 0}
                              storageRef={firebase.storage().ref("images")}
                              onUploadStart={this.handleUploadStart}
                              onUploadError={this.handleUploadError}
                              onUploadSuccess={this.handleUploadSuccess}
                              onProgress={this.handleProgress}
                            />
                          </label>
                        )
                      }

                    </div>
                    <div className="mr-2">
                      {this.state.images && this.state.images[1] ? (
                        <img src={this.state.images[1].thumbnail} id="1" style={{ height: '70px', width: '70px', borderRadius: 4, cursor: 'pointer' }} onClick={this.previewImage} />
                      ) : (
                          <label style={{ height: '70px', width: '70px', backgroundColor: '#d6d6d6', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer' }}>
                            2                        <i
                              className="fa fa-cloud-upload"
                              aria-hidden="true"
                            />
                            <FileUploader
                              hidden
                              accept="image/*"
                              name="imgProduct"
                              filename={item[0].id + "~" + 1}
                              storageRef={firebase.storage().ref("images")}
                              onUploadStart={this.handleUploadStart}
                              onUploadError={this.handleUploadError}
                              onUploadSuccess={this.handleUploadSuccess}
                              onProgress={this.handleProgress}
                            />
                          </label>
                        )
                      }
                    </div>

                    <div className="mr-2">
                      {this.state.images && this.state.images[2] ? (
                        <img src={this.state.images[2].thumbnail} id="2" style={{ height: '70px', width: '70px', borderRadius: 4, cursor: 'pointer' }} onClick={this.previewImage} />
                      ) : (
                          <label style={{ height: '70px', width: '70px', backgroundColor: '#d6d6d6', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer' }} >
                            3                        <i
                              className="fa fa-cloud-upload"
                              aria-hidden="true"
                            />
                            <FileUploader
                              hidden
                              accept="image/*"
                              name="imgProduct"
                              filename={item[0].id + "~" + 2}
                              storageRef={firebase.storage().ref("images")}
                              onUploadStart={this.handleUploadStart}
                              onUploadError={this.handleUploadError}
                              onUploadSuccess={this.handleUploadSuccess}
                              onProgress={this.handleProgress}
                            />
                          </label>
                        )
                      }
                    </div>

                    <div className="mr-2">
                      {this.state.images && this.state.images[3] ? (
                        <img src={this.state.images[3].thumbnail} id="3" style={{ height: '70px', width: '70px', borderRadius: 4, cursor: 'pointer' }} onClick={this.previewImage} />
                      ) : (
                          <label style={{ height: '70px', width: '70px', backgroundColor: '#d6d6d6', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer' }}>
                            4                         <i
                              className="fa fa-cloud-upload"
                              aria-hidden="true"
                            />
                            <FileUploader
                              hidden
                              accept="image/*"
                              name="imgProduct"
                              filename={item[0].id + "~" + 3}
                              storageRef={firebase.storage().ref("images")}
                              onUploadStart={this.handleUploadStart}
                              onUploadError={this.handleUploadError}
                              onUploadSuccess={this.handleUploadSuccess}
                              onProgress={this.handleProgress}
                            />
                          </label>
                        )
                      }
                    </div>
                  </div>
                  {this.state.imgPreview && !(this.state.isUploading || this.state.isProcessing) ? (
                    <div className="d-flex flex-row">
                      <div className="mb-2">
                        <img
                          src={this.state.images[this.state.imgPreview].original}
                          className="rounded"
                          style={{ height: "265px", width: "265px" }}
                        />
                      </div>
                      <div className="d-flex flex-column">
                        <div className="ml-2">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm btn-block"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Eliminar Imagen"
                            onClick={this.deleteImage}
                          >
                            <i className="fa fa-trash" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="mb-2">
                        <div style={{ height: '265px', width: '265px', backgroundColor: '#d6d6d6', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer' }}>
                          <h3>Preview</h3>
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
                              className="alert alert-info d-flex flex-column"
                              role="alert"
                            >
                              <div className="p-2">
                                <small>
                                  {" "}
                                  Procesando Imagen, espere un momento por favor...
                            </small>
                              </div>
                              <div className="p-2">
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
                    )}
                </div>

              </div>

              <div className="row ml-2 mt-1 mr-2">
                {/*Botones*/}
                <div className="col col-sm-12">
                  <div className="d-flex flex-row mb-2">
                    <button
                      type="button"
                      className="btn btn-info btn-sm btn-block"
                      onClick={this.handleSubmit}
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
                          Regresar
                        </button>
                      )}
                    />
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

export default Authorization(ProductDetail);
