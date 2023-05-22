import React, { useRef, useState, useEffect, } from 'react';

import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { hsv, hex } from 'color-convert';
import { usePeerConnection } from '../connection/context';

const originalColour = hsv.hex([Math.random() * 360, 55, 79]);

interface Extent {
   width: number,
   height: number,
}
interface DraggableBallProps {
   extent: Extent
}

const DraggableBall: React.FC<DraggableBallProps> = (props) => {
   const connection = usePeerConnection();
   const [colour, setColour] = useState(originalColour);
   const radius = 50;

   const getDraggableDimensions = () => {
      return [
         props.extent.width - radius * 2,
         props.extent.height - radius * 2,
      ];
   }

   const dragHandler = (e: DraggableEvent, data: DraggableData) => {
      const [width, height] = getDraggableDimensions();
      const scaledX = data.x / width;
      const scaledY = data.y / height;
      connection.send({
         type: 'update-position',
         position: {
            x: scaledX,
            y: scaledY,
         }
      })
   };

   const mouseDownHandler = () => {
      var hsv_c = hex.hsv(colour);
      hsv_c[1] = 100;
      setColour(hsv.hex(hsv_c));
   };

   const mouseUpHandler = () => {
      setColour(originalColour);
   };

   const styles: React.CSSProperties = {
      backgroundColor: `#${colour}`,
      width: "100px",
      height: "100px",
      border: "2px solid #5c5c5c",
      borderRadius: "50%",
      boxShadow: "0 0 6px 6px rgba(13, 13, 13, 50)",

   };

   return (
      <Draggable
         bounds='parent'
         defaultPosition={{
            x: props.extent.width / 2,
            y: props.extent.height / 2,
         }}
         onStart={mouseDownHandler}
         onStop={mouseUpHandler}
         onDrag={dragHandler}
      >
         <div style={styles}></div>
      </Draggable>
   );
}


const XYControllerPad: React.FC = () => {

   const styles: React.CSSProperties = {
      position: 'relative',
      flexGrow: 1,
   };

   const ref = useRef<HTMLDivElement>(null);
   const [extent, setExtent] = useState({
      width: 0,
      height: 0
   });

   useEffect(() => {
      if (ref.current !== null) {
         setExtent({
            width: ref.current.offsetWidth,
            height: ref.current.offsetHeight,
         })
      }
   }, [ref]);

   return (
      <div ref={ref} style={styles}>
         <DraggableBall extent={extent} />
      </div>
   );
};

const XYControllerPage: React.FC = () => {
   const styles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      height: "100vh",
   };
   return (
      <div style={styles}>
         <XYControllerPad />
      </div>
   );
};

export default XYControllerPage;

