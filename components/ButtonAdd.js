import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function ButtonAdd(props) {


    return (

        <View style={{marginLeft:20, width: 90, height: 90, margin:0}}>
            <TouchableOpacity style={{
                zIndex:1,
                height: 70,
                width: 70,
                elevation: 15,
                borderRadius: 35,
                backgroundColor: '#44bd32',
                justifyContent: 'center',
                alignItems: 'center'
                }}
                onPress={props.btnHandler}>

                    <Icon name='plus' size={30} color='white'/>

            </TouchableOpacity>
        </View>

    )

}

export default ButtonAdd