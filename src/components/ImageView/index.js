import React from "react"
import { Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

export default function ImageView ({route}) {
        return (
            <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={Dimensions.get('window').width}
                       imageHeight={Dimensions.get('window').height}>
                <Image resizeMode="contain" style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height}}
                       source={{uri:route.params.image}}/>
            </ImageZoom>
        )
}