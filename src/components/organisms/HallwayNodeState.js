import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { HallwayNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTextAlertClear, displayTextAlertNext } from '../../helper-functions/textAlert';
import { BUTTON_CLEAR, BUTTON_NEXT, BUTTON_UNDO, STATE_NAMES, BUTTON_BACK, CLEAR_TITLE,
        CLEAR_MESSAGE, HALLWAY_NODE_STATE_TITLE, HALLWAY_NODE_STATE_MESSAGE, NEXT_TITLE, NEXT_MESSAGE  } from '../../assets/locale/en';
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

const HallwayNodeState = ({windowH, photo}) => {

    const {state, hallwayGestures} = useContext(HallwayNodeStateContext);
    const [stateName, setStateName] = state;
    const [gestureLocations, setGestureLocations] = hallwayGestures;

    const listOfButtonNames = [BUTTON_UNDO, BUTTON_CLEAR, BUTTON_NEXT, BUTTON_BACK];

    useEffect(() => {
        displayTextAlert(HALLWAY_NODE_STATE_TITLE, HALLWAY_NODE_STATE_MESSAGE);
    }, []);
    
    const next = () => {
        console.log("next function");
        displayTextAlertNext(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                //STUFF to do before moving to next state
                setStateName(STATE_NAMES.FLOOR_CHANGING_NODE_STATE);
            }
        );
    }

    const back = () => {
        console.log("back function");
        setStateName(STATE_NAMES.DESTINATION_NODE_STATE);
    }

    const clear = () => {
        console.log("clear function invoked");
        displayTextAlertClear(CLEAR_TITLE, CLEAR_MESSAGE, 
            () => {
                console.log("clear function called");
                setGestureLocations([]);
            }
        );
    }

    const undo = () => {
        console.log("undo function");
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
    }

    const updateGesture = (gestureItem) => {
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
    }

    const onPress = (buttonName) => {
        switch (buttonName) {
            case BUTTON_NEXT:
                next();
                break;
            case BUTTON_CLEAR:
                clear();
                break;
            case BUTTON_UNDO:
                undo();
                break;
            case BUTTON_BACK:
                back();
                break;
            default:
                console.log("invalid button name");

        }
    }
    
    const isDisabled = (buttonName) => {
        return (buttonName === BUTTON_UNDO || buttonName === BUTTON_CLEAR) && gestureLocations.length === 0;
    }
    
    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.2"
                ry="1.1"
                stroke="green"
                fill="green"
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

export default HallwayNodeState;
