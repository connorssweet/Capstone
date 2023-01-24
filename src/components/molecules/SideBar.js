import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, FlatList, View} from 'native-base';

const styles = StyleSheet.create({
    button: {
      marginTop: 10,
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    disabledButton: {
      marginTop: 10,
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      backgroundColor: 'grey'
    },
    optionBar: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

const SideBar = ({onPress, isDisabled, listOfButtonNames, stateName}) => {

    return (

        <View style={styles.optionBar}>

            <FlatList
                data={listOfButtonNames}
                renderItem={({item}) => (
                    <>
                        <Button
                            title={item}
                            onPress={() => onPress(item)}
                            style={(isDisabled(item)) ? styles.disabledButton : styles.button }
                            disabled={isDisabled(item) ? true : false }>
                            {item}
                        </Button>
                    </>
                )}
            />

            <Button
                title="State"
                onPress={() => {
                    console.log(stateName);
                }}
                style={styles.button}>
                State
            </Button>

            {/* {stateName!='state1' && (
                <>
                    <Button
                        title="Back"
                        onPress={() => {
                            prevState();
                        }}
                        style={styles.button}>
                        Back
                    </Button>
                </>
            )}

            {stateName=='state3' && (
                <>
                    <Button
                        title="Unselect"
                        onPress={() => {
                            prevState();
                        }}
                        style={styles.button}>
                        Unselect
                    </Button>
                </>
            )}

            {stateName=='state3' && (
                <>
                    <Button
                        title="View Text"
                        onPress={() => {
                            prevState();
                        }}
                        style={styles.button}>
                        View Text
                    </Button>
                </>
            )}  */}
        </View>
    )
};

export default SideBar;