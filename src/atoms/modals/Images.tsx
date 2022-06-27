/* eslint-disable max-lines */
/* eslint-disable react/require-default-props */
import { FC } from 'react';
import { Icon } from '../../component/Icon/Icon';
import './Images.scss';

interface ImagesType {
  images: string[];
}

const Images: FC<ImagesType> = ({ images }) => {
  if (images.length === 5)
    return (
      <div className="images">
        {images.slice(0, 2).map((image) => (
          <div className="images_div_half">
            <img src={image} />
            <Icon name="delete" size="xs" />
          </div>
        ))}
        {images.slice(2, 6).map((image) => (
          <div className="images_div_three">
            <img src={image} />
            <Icon name="delete" size="xs" />
          </div>
        ))}
      </div>
    );
  if (images.length === 7)
    return (
      <div className="images">
        {images.slice(0, 3).map((image) => (
          <div className="images_div_three">
            <img src={image} />
          </div>
        ))}
        {images.slice(3, 8).map((image) => (
          <div className="images_div_four">
            <img src={image} />
          </div>
        ))}
      </div>
    );
  if (images.length === 9)
    return (
      <div className="images">
        {images.slice(0, 4).map((image) => (
          <div className="images_div_four">
            <img src={image} />
            <Icon name="delete" size="xs" />
          </div>
        ))}
        {images.slice(4, 9).map((image) => (
          <div className="images_div_five">
            <img src={image} />
            <Icon name="delete" size="xs" />
          </div>
        ))}
      </div>
    );
  return (
    <div className="images">
      {images.length !== 5 &&
        images.length !== 7 &&
        images.length !== 9 &&
        images.map((image) => {
          if (images.length === 2)
            return (
              <div className="images_div_half">
                <img src={image} />
                <Icon name="delete" size="xs" />
              </div>
            );
          if (images.length === 3 || images.length === 6)
            return (
              <div className="images_div_three">
                <img src={image} />
                <Icon name="delete" size="xs" />
              </div>
            );
          if (images.length === 4 || images.length === 8)
            return (
              <div className="images_div_four">
                <img src={image} />
                <Icon name="delete" size="xs" />
              </div>
            );
          if (images.length === 10)
            return (
              <div className="images_div_five">
                <img src={image} />
                <Icon name="delete" size="xs" />
              </div>
            );
          return (
            <div className="images_div">
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          );
        })}
    </div>
  );
};

export default Images;
