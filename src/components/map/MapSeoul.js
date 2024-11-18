import {createContext, createElement, useContext, useEffect} from "react";
import {createPath} from "react-router-dom";
import * as d3 from 'd3';

const LocationMap = createContext();

export const useLocationMapContext = () => useContext(LocationMap);

export const LocationMapeSvg = ({gId, gClassName, eventClick, pathD}) => {
    return (
        <g id={gId} className={`province ${gClassName}`} role="button" tabIndex="0" onClick={eventClick}>
            <path
                d={pathD}
                id={gId}/>
        </g>
    );
}

const LocationActive = createContext();

export const useLocationActiveContext = () => useContext(LocationActive);

export const LocationActiveSvg = ({
                                      gId,
                                      gClassName,
                                      eventClick,
                                      clipPathId,
                                      pathD,
                                      pathId,
                                      imgHref,
                                      imgId,
                                      imgWidth,
                                      imgHeight,
                                      imgX,
                                      imgY,
                                  }) => {
    return (
        <g id={gId} className={`province ${gClassName}`} role="button" tabIndex="0" onClick={eventClick}>
            <defs>
                <clipPath id={clipPathId}>
                    <path
                        d={pathD}
                        id={pathId}/>
                </clipPath>
            </defs>
            <image
                href={imgHref}
                clipPath={`url(#${clipPathId})`} id={imgId} width={imgWidth} height={imgHeight} x={imgX} y={imgY}/>
            <use href={`#${pathId}`} fill={`url(#${imgId})`}/>
        </g>
    );
}

const MapSeoul = ({storyPhotoList, eventClick, openListModal, openAddModal}) => {

    const mapPaths = {
        680: "M 553.2 423.42 575.01 432.66 579.3 485.93 629.82 501.86 653.08 519.63 684.54 574.67 671.43 585.15 645.91 585.11 628.14 599.12 618.95 572.87 592.77 553.08 570.56 566.86 542.27 571.45 524.33 528.33 509.72 530.38 485.27 465.09 478.6 438.95 460.71 429.63 478.01 409.22 522.57 405.01 553.2 423.42 Z",
        740: "M 725.57 452.18 675.6 425.08 683.76 398.85 656.25 387.72 668 354.62 683.06 338.28 711.64 326.36 733.53 326.42 768.14 300.85 784.37 297.76 797.57 344.79 799 380.39 760.89 383.67 742.17 411.21 725.57 452.18 Z",
        305: "M 527.92 174.06 541.75 189.48 517.27 217.55 488.27 220.63 461.9 202.97 455.39 189.69 414.88 159.41 412.54 110.38 434.52 84.7 432.34 55.95 462.9 42.39 477.4 68.12 469.82 121.14 509.18 147.55 527.92 174.06 Z",
        500: "M 160.76 315.2 185.17 336.67 212.55 353.39 212.81 373.07 176.77 381.88 180.12 417.73 134.54 425.46 120.42 387.91 99.09 390.62 59.8 385.36 1 371.16 4.11 348.4 44.24 283.33 58.85 274.55 52.22 257.23 62.34 233.46 160.76 315.2 Z",
        620: "M 407.87 548.96 418.65 570.75 421.11 593.8 393.75 602.79 373.65 622.54 372.63 635.89 326.73 648 303.98 612.51 292.01 596.81 276.18 593.59 265.08 557.48 268.28 537.81 247.29 541.62 255.55 527.4 284.1 515.59 290.24 513.88 303.7 503.14 321.8 510.97 340.68 505.68 354.63 513.51 386.16 551.65 407.87 548.96 Z",
        215: "M 668 354.62 656.25 387.72 618.38 427.34 593.38 437.79 575.01 432.66 553.2 423.42 584.92 346.46 596.34 317.48 620.16 322.88 640.36 313.06 640.68 344.05 648.02 355.37 668 354.62 Z",
        530: "M 200.68 464.35 209.36 447.01 229.78 461.61 240.83 511.74 255.55 527.4 247.29 541.62 229.61 540.92 213.15 525.76 199.94 526.15 190.28 504.24 157.44 534.51 143.05 553.93 92.68 538.82 93.55 491.66 103.52 469.53 124.02 483.09 147.37 466.9 168.64 466.27 198.34 481.79 200.68 464.35 Z",
        545: "M 199.94 526.15 213.15 525.76 229.61 540.92 247.29 541.62 268.28 537.81 265.08 557.48 276.18 593.59 292.01 596.81 303.98 612.51 288.89 633.61 266.81 652.14 246.97 640.3 237.16 605.99 222.32 597.18 219.08 574.35 206.47 554.32 199.94 526.15 Z",
        350: "M 649.89 199.48 612.12 199.51 581.03 211.22 563.77 212.62 541.75 189.48 527.92 174.06 543.42 139.39 553.9 135.12 540.76 84.09 546.45 39.48 569 17.38 603.32 14.58 611.14 28.62 632.08 31.93 624.14 55.98 631.41 76.91 622.49 104.38 628.85 140.4 652.12 138.53 661.48 146.59 661.78 172.39 649.89 199.48 Z",
        320: "M 546.45 39.48 540.76 84.09 553.9 135.12 543.42 139.39 527.92 174.06 509.18 147.55 469.82 121.14 477.4 68.12 462.9 42.39 461.82 27.28 476.19 1 503.02 6.41 508.99 24.61 540.41 19.34 546.45 39.48 Z",
        230: "M 596.34 317.48 584.92 346.46 558.52 340.6 527.21 315.14 503.38 322.07 490.03 316.89 489.97 316.87 489.61 301.98 528.38 255.99 582.88 230.27 579.58 260.23 596.34 317.48 Z",
        590: "M 407.87 548.96 386.16 551.65 354.63 513.51 340.68 505.68 321.8 510.97 303.7 503.14 290.24 513.88 284.1 515.59 255.55 527.4 274.56 499.69 287.22 496.89 301.97 453.24 346.68 448.69 393.45 473.44 405.78 475.8 410.55 499.09 407.87 548.96 Z",
        440: "M 254.8 305.54 305.43 336.76 321.95 356.92 370.15 347.63 371.46 365.77 373.23 372.98 349.66 402.96 336.64 408.97 309.09 390.34 259.6 389.9 248.27 373.76 212.55 353.39 185.17 336.67 160.76 315.2 184.49 301.48 204.75 299.91 216.2 269.25 254.8 305.54 Z",
        410: "M 379.98 331.13 370.15 347.63 321.95 356.92 305.43 336.76 254.8 305.54 273.5 282.35 291.32 288.87 328.68 239.96 348.93 221.73 364.08 253.11 361.77 296.79 379.98 331.13 Z",
        650: "M 628.14 599.12 613.56 627.14 586.24 644.29 578.11 661.75 546.69 666 522.76 644.04 515.27 601.49 494.36 594.33 471.33 602.12 448.61 572.1 421.11 593.8 418.65 570.75 407.87 548.96 410.55 499.09 405.78 475.8 460.71 429.63 478.6 438.95 485.27 465.09 509.72 530.38 524.33 528.33 542.27 571.45 570.56 566.86 592.77 553.08 618.95 572.87 628.14 599.12 Z",
        200: "M 584.92 346.46 553.2 423.42 522.57 405.01 478.01 409.22 461.73 384.44 479.52 353.44 494.84 339.59 490.03 316.89 503.38 322.07 527.21 315.14 558.52 340.6 584.92 346.46 Z",
        290: "M 541.75 189.48 563.77 212.62 581.03 211.22 582.88 230.27 528.38 255.99 489.61 301.98 461.52 295.89 441.93 266.5 423.74 268.99 399.86 253.04 419.23 238.22 413.61 196.43 397.7 170.63 414.88 159.41 455.39 189.69 461.9 202.97 488.27 220.63 517.27 217.55 541.75 189.48 Z",
        710: "M 725.57 452.18 715.64 472.4 757.06 492.84 749.64 519.63 732.24 532.14 722.14 556.75 684.54 574.67 653.08 519.63 629.82 501.86 579.3 485.93 575.01 432.66 593.38 437.79 618.38 427.34 656.25 387.72 683.76 398.85 675.6 425.08 725.57 452.18 Z",
        470: "M 200.68 464.35 198.34 481.79 168.64 466.27 147.37 466.9 124.02 483.09 103.52 469.53 101.27 453.48 110.71 419.1 99.09 390.62 120.42 387.91 134.54 425.46 180.12 417.73 176.77 381.88 212.81 373.07 230.96 407.24 208.74 428.73 209.36 447.01 200.68 464.35 Z",
        560: "M 336.64 408.97 346.8 425.51 346.68 448.69 301.97 453.24 287.22 496.89 274.56 499.69 255.55 527.4 240.83 511.74 229.78 461.61 209.36 447.01 208.74 428.73 230.96 407.24 212.81 373.07 212.55 353.39 248.27 373.76 259.6 389.9 309.09 390.34 336.64 408.97 Z",
        170: "M 461.73 384.44 478.01 409.22 460.71 429.63 405.78 475.8 393.45 473.44 346.68 448.69 346.8 425.51 336.64 408.97 349.66 402.96 373.23 372.98 371.46 365.77 384.67 355.92 416.12 360.87 435.07 376.75 452.76 369.6 461.73 384.44 Z",
        380: "M 367.49 175.26 346.27 190.9 348.93 221.73 328.68 239.96 291.32 288.87 273.5 282.35 254.8 305.54 216.2 269.25 250.29 271.85 255.28 237.93 251.9 219.75 264.71 194.12 275.62 139.15 298.6 134.93 344.79 108.34 362.61 118.9 374.39 166.73 367.49 175.26 Z",
        110: "M 489.61 301.98 489.97 316.87 425.51 325.74 397.42 322.55 379.98 331.13 361.77 296.79 364.08 253.11 348.93 221.73 346.27 190.9 367.49 175.26 397.7 170.63 413.61 196.43 419.23 238.22 399.86 253.04 423.74 268.99 441.93 266.5 461.52 295.89 489.61 301.98 Z",
        140: "M 490.03 316.89 494.84 339.59 479.52 353.44 461.73 384.44 452.76 369.6 435.07 376.75 416.12 360.87 384.67 355.92 371.46 365.77 370.15 347.63 379.98 331.13 397.42 322.55 425.51 325.74 489.97 316.87 490.03 316.89 Z",
        260: "M 640.36 313.06 620.16 322.88 596.34 317.48 579.58 260.23 582.88 230.27 581.03 211.22 612.12 199.51 649.89 199.48 670.5 203.04 673.95 238.02 666.25 248.9 656.13 289.69 640.36 313.06 Z"
    }

    // const imagePosition = () => {
    //     // const svg = document.getElementById('서울특별시_시군구');
    //     // const buttons = svg.querySelectorAll('g[role=button]');
    //
    //     console.dir(svg);
    //     for (const button of buttons) {
    //         console.dir(button);
    //         const path = document.querySelector("#p680");
    //         const image = document.querySelector('#img680');
    //         const pathBox = path.getBBox();
    //
    //         // console.log(pathBox, image.style.x )
    //
    //         if (image.style.width > image.style.height) {
    //             image.style.width = 'auto';
    //             image.style.height = pathBox.height;
    //             image.style.x = pathBox.x - ((pathBox.width / 2) / 2);
    //             image.style.y = pathBox.y;
    //         } else if (image.style.width < image.style.height) {
    //             image.style.width = pathBox.width;
    //             image.style.height = 'auto';
    //             image.style.y = pathBox.y - ((pathBox.height / 2) / 2);
    //             image.style.x = pathBox.x;
    //         } else {
    //             image.style.width = 'auto';
    //             image.style.height = pathBox.height;
    //             image.style.x = pathBox.x;
    //             image.style.y = pathBox.y;
    //         }
    //     }
    // }

    // useEffect(() => {
    //     const svg = document.getElementById('서울특별시_시군구');
    //     const buttons = svg.querySelectorAll('g[role=button]');
    //
    //     console.dir(svg);
    //     for (const button of buttons) {
    //     console.dir(button);
    //     const path = document.querySelector("#p680");
    //     const image = document.querySelector('#img680');
    //     const pathBox = path.getBBox();
    //
    //     // console.log(pathBox, image.style.x )
    //
    //     if (image.style.width > image.style.height) {
    //         image.style.width = 'auto';
    //         image.style.height = pathBox.height;
    //         image.style.x = pathBox.x - ((pathBox.width / 2) / 2);
    //         image.style.y = pathBox.y;
    //     } else if (image.style.width < image.style.height) {
    //         image.style.width = pathBox.width;
    //         image.style.height = 'auto';
    //         image.style.y = pathBox.y - ((pathBox.height / 2) / 2);
    //         image.style.x = pathBox.x;
    //     } else {
    //         image.style.width = 'auto';
    //         image.style.height = pathBox.height;
    //         image.style.x = pathBox.x;
    //         image.style.y = pathBox.y;
    //     }
    //     }
    // }, []);

    return (
        <div className={`city__wrap`}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="800" viewBox="0 0 800 667"
                 strokeLinecap="round" strokeLinejoin="round" id="서울특별시_시군구" className={`city__list`}>
                <g id="서울특별시_시군구_경계">
                    {
                        storyPhotoList && storyPhotoList.length > 0 ? (
                            storyPhotoList.map((item) => {
                                const key = item.id.toString().slice(-3); // 유일한 key 생성
                                const path = mapPaths[key]; // mapPaths에서 해당 key의 path 가져오기

                                if (item.mainPhotoPath !== null) {
                                    return (
                                        <LocationActiveSvg
                                            key={`active-${key}`}
                                            gId={key}
                                            gClassName={key}
                                            eventClick={eventClick}
                                            clipPathId={"clip" + key}
                                            pathId={key}
                                            pathD={path}
                                            imgHref={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${item.mainPhotoPath}`}
                                            imgId={key}
                                        />
                                    );
                                } else if (item.mainPhotoPath == null) {
                                    return (
                                        <LocationMapeSvg
                                            key={`map-${key}`}
                                            gId={"g" + key}
                                            gClassName={key}
                                            pathD={path}
                                            eventClick={eventClick}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            })
                        ) : null
                    }
                </g>
            </svg>
        </div>
    );
}

export default MapSeoul;
