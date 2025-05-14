import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles/Carousel.scss";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export interface CarouselSlideData {
  content: string;
}

interface CarouselArrowProps {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const CarouselLeftArrow: React.FC<CarouselArrowProps> = ({ onClick }) => (
  <a
    href="#"
    className="carousel__arrow carousel__arrow--left"
    onClick={onClick}
  >
    <FaAngleLeft size={40} />
  </a>
);

const CarouselRightArrow: React.FC<CarouselArrowProps> = ({ onClick }) => (
  <a
    href="#"
    className="carousel__arrow carousel__arrow--right"
    onClick={onClick}
  >
    <FaAngleRight size={40} />
  </a>
);

interface CarouselIndicatorProps {
  index: number;
  activeIndex: number;
  onClick: () => void;
}

const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
  index,
  activeIndex,
  onClick,
}) => (
  <li>
    <a
      className={
        index === activeIndex
          ? "carousel__indicator carousel__indicator--active"
          : "carousel__indicator"
      }
      onClick={onClick}
    />
  </li>
);

interface CarouselSlideProps {
  index: number;
  activeIndex: number;
  slide: CarouselSlideData;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  index,
  activeIndex,
  slide,
}) => (
  <li
    className={
      index === activeIndex
        ? "carousel__slide carousel__slide--active"
        : "carousel__slide"
    }
  >
    <p className="carousel-slide__content">{slide.content}</p>
  </li>
);

interface CarouselProps {
  slides: CarouselSlideData[];
  setCategory: Dispatch<SetStateAction<string>>;
  setCurrentIndex?: Dispatch<SetStateAction<number>>;
}

const Carousel: React.FC<CarouselProps> = ({ slides, setCategory, setCurrentIndex=()=>{}}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevSlide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    setCategory(slides[activeIndex]?.content);
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  return (
    <div className="carousel">
      <CarouselLeftArrow onClick={goToPrevSlide} />

      <ul className="carousel__slides">
        {slides?.map((slide, index) => (
          <CarouselSlide
            key={index}
            index={index}
            activeIndex={activeIndex}
            slide={slide}
          />
        ))}
      </ul>

      <CarouselRightArrow onClick={goToNextSlide} />

      <ul className="carousel__indicators">
        {slides?.map((slide, index) => (
          <CarouselIndicator
            key={index}
            index={index}
            activeIndex={activeIndex}
            onClick={() => goToSlide(index)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Carousel;
