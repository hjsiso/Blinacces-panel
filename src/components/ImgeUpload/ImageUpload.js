import React, { Component } from "react";

import "./ImageUpload.css";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { file: "", imagePreviewUrl: "" };
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log("handle uploading-", this.state.file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} />;
    } else {
      $imagePreview = (
        <div className="">Please select an Image for Preview</div>
      );
    }

    return (
      <form onSubmit={e => this._handleSubmit(e)}>
        <div className="row mt-2 mr-2 ml-2 mb-2">
          <div className="col col-sm-8">
            <label class="custom-file">
              <input
                type="file"
                id="file2"
                class="custom-file-input"
                onChange={e => this._handleImageChange(e)}
              />
              <span class="custom-file-control" />
            </label>
          </div>
          <div className="col col-sm-4">
            <button
              class="btn btn-primary"
              type="submit"
              onClick={e => this._handleSubmit(e)}
            >
              <i class="fa fa-cloud-upload" aria-hidden="true" />
            </button>
          </div>

          <div className="imgPreview">{$imagePreview}</div>
        </div>
      </form>
    );
  }
}

export default ImageUpload;
