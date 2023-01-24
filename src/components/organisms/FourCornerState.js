import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { FourCornerStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTextAlertClear, displayTextAlertNext } from '../../helper-functions/textAlert';
import { BUTTON, TOO_MANY_NODES_PLACED, FOUR_CORNERS_STATE, CLEAR,
     STATE_NAMES, NEXT_TITLE, NEXT_MESSAGE  } from '../../assets/locale/en';
import { getGPSData, postGPSData } from '../../helper-functions/gpsFetching';
import { launchImageLibrary } from 'react-native-image-picker';
import {Ellipse} from 'react-native-svg';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderLeftWidth: 5,
      },
});

let getFourGPSCoords;

const FourCornerState = ({buildingName, windowH, clearAllNodes}) => {

    const {state, photoState, fourCornerGestures} = useContext(FourCornerStateContext);
    const [stateName, setStateName] = state;
    const [photo, setPhoto] = photoState;
    const [gestureLocations, setGestureLocations] = fourCornerGestures;

    const listOfButtonNames = [BUTTON.UPLOAD, BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT];

    if (gestureLocations.length > 4) {
        displayTextAlert(TOO_MANY_NODES_PLACED.TITLE, TOO_MANY_NODES_PLACED_ERROR.MESSAGE);
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1));
    }

    const mapGesturesToGPS = async () => {
        getFourGPSCoords = await getGPSData('get-corner-cords', 'buildingName', buildingName);
        for (let i = 0; i < gestureLocations.length; i++) {
            getFourGPSCoords.cords.cornerCords[i]['gestureLat']  = gestureLocations[i].x;
            getFourGPSCoords.cords.cornerCords[i]['gestureLong'] = gestureLocations[i].y;
        }
        const requestData = JSON.stringify({'gpsCornerCord': [getFourGPSCoords]});
        postGPSData(requestData, 'post-corner-cords');
    };

    const upload = () => {
        const options = {
            noData: true,
        };
    
        launchImageLibrary(options, response => {
            if (response.assets && response.assets[0].uri) {
            setPhoto(response.assets[0]);
            clearAllNodes();
            displayTextAlert(FOUR_CORNERS_STATE.TITLE, FOUR_CORNERS_STATE.MESSAGE);
            }
        });
        console.log("upload function");
    }

    const next = () => {
        console.log("next function");
        displayTextAlertNext(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                mapGesturesToGPS();
                setStateName(STATE_NAMES.DESTINATION_NODE_STATE);
            }
        );
    }

    const clear = () => {
        console.log("clear function invoked");
        displayTextAlertClear(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                setGestureLocations([]);
                console.log("clear function called");
            }
        );
    }

    const undo = () => {
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
        console.log("undo function");
    }

    const updateGesture = (gestureItem) => {
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
    }

    const onPress = (buttonName) => {
        switch (buttonName) {
            case BUTTON.UPLOAD:
                upload();
                break;
            case BUTTON.NEXT:
                next();
                break;
            case BUTTON.CLEAR:
                clear();
                break;
            case BUTTON.UNDO:
                undo();
                break;
            default:
                console.log("invalid button name");

        }
    }
    
    const isDisabled = (buttonName) => {
        return (buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR) && gestureLocations.length === 0;
    }
    
    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.2"
                ry="1.1"
                stroke="blue"
                fill="blue"
            />
        </View>
    ));
    
    return ( 
        <>
            <NodePlacement photo={photo} windowH={windowH} updateGesture={updateGesture} listItems={listItems}/>

            <View style={styles.navBarView}>
                <SideBar onPress={onPress} stateName={stateName} isDisabled={isDisabled} listOfButtonNames={listOfButtonNames}/>
            </View>
        </>
    );
};

export default FourCornerState;