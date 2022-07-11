/* eslint-disable max-lines */
/* eslint-disable react/require-default-props */
import { FC } from 'react';
import './CartImages.scss';

interface CartImagesType {
  images: string[];
}

const CartImages: FC<CartImagesType> = ({ images }) => {
  if (images.length > 6)
    return (
      <div className="cart-images">
        <div className="grid_3">
          {images.slice(0, 6).map((image) => (
            <div>
              <img src={image} />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 5)
    return (
      <div className="cart-images">
        <div className="grid_2">
          {images.slice(0, 2).map((image) => (
            <div>
              <img src={image} />
            </div>
          ))}
        </div>
        <div className="grid_3">
          {images.slice(2, 6).map((image) => (
            <div>
              <img src={image} />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 3 || images.length === 6)
    return (
      <div className="cart-images">
        <div className="grid_3">
          {images.map((image) => (
            <div>
              <img src={image} />
            </div>
          ))}
        </div>
      </div>
    );
  if (images.length === 2 || images.length === 4)
    return (
      <div className="cart-images">
        <div className="grid_2">
          {images.map((image) => (
            <div>
              <img src={image} />
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="cart-images">
      <div className="grid">
        {images.map((image) => (
          <div>
            <img src={image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartImages;
