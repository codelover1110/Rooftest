/*eslint-disable*/
import React from "react";
import defaultImage from "../assets/imgs/default-avatar.png";
import { useConfig } from "../config";
const config = useConfig()

export default function PictureUpload({imageUrl, file, setFile}) {
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(imageUrl? `${config.serverUrl}/media${imageUrl}`: defaultImage);
  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let newFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(newFile);
      setImagePreviewUrl(reader.result);
    };
    if (newFile) {
      reader.readAsDataURL(newFile);
    }
  };
  // eslint-disable-next-line
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
