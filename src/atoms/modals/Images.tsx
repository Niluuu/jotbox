/* eslint-disable max-lines */
/* eslint-disable react/require-default-props */
import { FC } from 'react';
import { Icon } from '../../component/Icon/Icon';
import './Images.scss';

interface ImagesType {
  images: string[];
}

const Images: FC<ImagesType> = ({ images }) => {
  if (images.length === 10)
    return (
      <div className="images">
        <div className="grid_5">
          {images.map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 9)
    return (
      <div className="images">
        <div className="grid_4">
          {images.slice(0, 4).map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
        <div className="grid_5">
          {images.slice(4, 9).map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 7)
    return (
      <div className="images">
        <div className="grid_3">
          {images.slice(0, 3).map((image) => (
            <div>
              <img src={image} />
            </div>
          ))}
        </div>
        <div className="grid_4">
          {images.slice(3, 8).map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 5)
    return (
      <div className="images">
        <div className="grid_2">
          {images.slice(0, 2).map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
        <div className="grid_3">
          {images.slice(2, 6).map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 4 || images.length === 8)
    return (
      <div className="images">
        <div className="grid_4">
          {images.map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 3 || images.length === 6)
    return (
      <div className="images">
        <div className="grid_3">
          {images.map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 2)
    return (
      <div className="images">
        <div className="grid_2">
          {images.map((image) => (
            <div>
              <img src={image} />
              <Icon name="delete" size="xs" />
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="images">
      <div className="grid">
        {images.map((image) => (
          <div>
            <img src={image} />
            <Icon name="delete" size="xs" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
