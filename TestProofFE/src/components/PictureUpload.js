/*eslint-disable*/
import React from "react";

export default function PictureUpload({ imagePreviewUrl = 'img/avatar.png', handleImageChange = () => {} }) {
  const handleSubmit = e => {
    e.preventDefault();
  };
  return (
    <div className="picture-container">
      <div className="picture">
        <img src={imagePreviewUrl} className="picture-src" alt="..." />
        <input type="file" onChange={e => handleImageChange(e)} />
      </div>
      <h4 className="description">Edit Profile Photo</h4>
    </div>
  );
}
